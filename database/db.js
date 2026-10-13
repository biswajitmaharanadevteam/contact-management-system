import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.join(__dirname, 'contacts.db');
const SCHEMA_PATH = path.join(__dirname, 'schema.sql');
const SEED_PATH = path.join(__dirname, 'seed.sql');

// Initialize database instance
export const db = new DatabaseSync(DB_PATH);

// Enable WAL mode for high concurrency & performance
try {
  db.exec('PRAGMA journal_mode = WAL;');
  db.exec('PRAGMA synchronous = NORMAL;');
} catch (err) {
  console.warn('Note on pragmas:', err.message);
}

// Run schema initialization and seed if table is new or empty
export function initDatabase() {
  try {
    if (fs.existsSync(SCHEMA_PATH)) {
      const schemaSql = fs.readFileSync(SCHEMA_PATH, 'utf-8');
      db.exec(schemaSql);
    }

    // Check count of contacts
    const countStmt = db.prepare('SELECT COUNT(*) as count FROM contacts');
    const result = countStmt.get();

    if (result && result.count === 0 && fs.existsSync(SEED_PATH)) {
      console.log('Database empty. Seeding initial contacts...');
      const seedSql = fs.readFileSync(SEED_PATH, 'utf-8');
      db.exec(seedSql);
      console.log('Initial contacts seeded successfully.');
    }
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

// Data Access Layer methods
export const contactModel = {
  findAll({ search = '', category = '', favorite = '', sortBy = 'first_name', sortOrder = 'ASC' } = {}) {
    let sql = 'SELECT * FROM contacts WHERE 1=1';
    const params = [];

    if (search && search.trim() !== '') {
      const term = `%${search.trim()}%`;
      sql += ' AND (first_name LIKE ? OR last_name LIKE ? OR email LIKE ? OR phone LIKE ? OR company LIKE ? OR job_title LIKE ?)';
      params.push(term, term, term, term, term, term);
    }

    if (category && category !== 'All') {
      sql += ' AND category = ?';
      params.push(category);
    }

    if (favorite === '1' || favorite === 'true') {
      sql += ' AND is_favorite = 1';
    }

    // Sanitize sort column to prevent SQL injection
    const allowedSortFields = {
      name: 'first_name',
      first_name: 'first_name',
      last_name: 'last_name',
      company: 'company',
      category: 'category',
      created_at: 'created_at',
      updated_at: 'updated_at'
    };

    const sortField = allowedSortFields[sortBy] || 'first_name';
    const direction = sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    sql += ` ORDER BY ${sortField} ${direction}`;

    const stmt = db.prepare(sql);
    return stmt.all(...params);
  },

  findById(id) {
    const stmt = db.prepare('SELECT * FROM contacts WHERE id = ?');
    return stmt.get(Number(id));
  },

  create(data) {
    const stmt = db.prepare(`
      INSERT INTO contacts (
        first_name, last_name, email, phone, category,
        company, job_title, address, notes, is_favorite, avatar_color
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      data.first_name || '',
      data.last_name || '',
      data.email || '',
      data.phone || '',
      data.category || 'Personal',
      data.company || '',
      data.job_title || '',
      data.address || '',
      data.notes || '',
      data.is_favorite ? 1 : 0,
      data.avatar_color || '#3b82f6'
    );

    return this.findById(result.lastInsertRowid);
  },

  update(id, data) {
    const current = this.findById(id);
    if (!current) return null;

    const stmt = db.prepare(`
      UPDATE contacts SET
        first_name = ?,
        last_name = ?,
        email = ?,
        phone = ?,
        category = ?,
        company = ?,
        job_title = ?,
        address = ?,
        notes = ?,
        is_favorite = ?,
        avatar_color = ?
      WHERE id = ?
    `);

    stmt.run(
      data.first_name !== undefined ? data.first_name : current.first_name,
      data.last_name !== undefined ? data.last_name : current.last_name,
      data.email !== undefined ? data.email : current.email,
      data.phone !== undefined ? data.phone : current.phone,
      data.category !== undefined ? data.category : current.category,
      data.company !== undefined ? data.company : current.company,
      data.job_title !== undefined ? data.job_title : current.job_title,
      data.address !== undefined ? data.address : current.address,
      data.notes !== undefined ? data.notes : current.notes,
      data.is_favorite !== undefined ? (data.is_favorite ? 1 : 0) : current.is_favorite,
      data.avatar_color !== undefined ? data.avatar_color : current.avatar_color,
      Number(id)
    );

    return this.findById(id);
  },

  toggleFavorite(id) {
    const current = this.findById(id);
    if (!current) return null;

    const newFavorite = current.is_favorite ? 0 : 1;
    const stmt = db.prepare('UPDATE contacts SET is_favorite = ? WHERE id = ?');
    stmt.run(newFavorite, Number(id));

    return this.findById(id);
  },

  delete(id) {
    const current = this.findById(id);
    if (!current) return false;

    const stmt = db.prepare('DELETE FROM contacts WHERE id = ?');
    stmt.run(Number(id));
    return true;
  },

  getStats() {
    const totalStmt = db.prepare('SELECT COUNT(*) as total FROM contacts');
    const favStmt = db.prepare('SELECT COUNT(*) as favorites FROM contacts WHERE is_favorite = 1');
    const categoryStmt = db.prepare('SELECT category, COUNT(*) as count FROM contacts GROUP BY category');

    const total = totalStmt.get().total;
    const favorites = favStmt.get().favorites;
    const categoryRows = categoryStmt.all();

    const categories = {};
    for (const row of categoryRows) {
      categories[row.category] = row.count;
    }

    return {
      total,
      favorites,
      categories
    };
  },

  bulkInsert(contactsList) {
    if (!Array.isArray(contactsList) || contactsList.length === 0) {
      return { insertedCount: 0 };
    }

    const stmt = db.prepare(`
      INSERT INTO contacts (
        first_name, last_name, email, phone, category,
        company, job_title, address, notes, is_favorite, avatar_color
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    let count = 0;
    // Execute inside immediate transaction
    db.exec('BEGIN TRANSACTION;');
    try {
      for (const item of contactsList) {
        if (!item.first_name || !item.phone) continue;
        stmt.run(
          item.first_name || '',
          item.last_name || '',
          item.email || '',
          item.phone || '',
          item.category || 'Personal',
          item.company || '',
          item.job_title || '',
          item.address || '',
          item.notes || '',
          item.is_favorite ? 1 : 0,
          item.avatar_color || '#3b82f6'
        );
        count++;
      }
      db.exec('COMMIT;');
    } catch (err) {
      db.exec('ROLLBACK;');
      throw err;
    }

    return { insertedCount: count };
  },

  getInspectionData() {
    let fileSize = 0;
    try {
      if (fs.existsSync(DB_PATH)) {
        fileSize = fs.statSync(DB_PATH).size;
      }
    } catch {}

    const versionStmt = db.prepare('SELECT sqlite_version() as version');
    const version = versionStmt.get()?.version || 'Unknown';

    const columns = db.prepare('PRAGMA table_info(contacts)').all();
    const indexes = db.prepare('PRAGMA index_list(contacts)').all();
    const rows = db.prepare('SELECT * FROM contacts ORDER BY id ASC').all();

    let rawSchemaSql = '';
    try {
      if (fs.existsSync(SCHEMA_PATH)) {
        rawSchemaSql = fs.readFileSync(SCHEMA_PATH, 'utf-8');
      }
    } catch {}

    return {
      sqliteVersion: version,
      dbPath: DB_PATH,
      fileSizeBytes: fileSize,
      fileSizeKb: (fileSize / 1024).toFixed(2),
      tableName: 'contacts',
      columns,
      indexes,
      totalRows: rows.length,
      schemaSql: rawSchemaSql,
      rows
    };
  },

  runQuery(query) {
    if (!query || typeof query !== 'string') {
      throw new Error('Query string is required');
    }
    const trimmed = query.trim();

    // Security check: Only allow SELECT / PRAGMA / EXPLAIN queries
    const upper = trimmed.toUpperCase();
    if (!upper.startsWith('SELECT') && !upper.startsWith('PRAGMA') && !upper.startsWith('EXPLAIN')) {
      throw new Error('Only read-only SELECT / PRAGMA queries are permitted in the web viewer.');
    }

    const stmt = db.prepare(trimmed);
    const results = stmt.all();
    return {
      query: trimmed,
      rowCount: results.length,
      rows: results
    };
  },

  resetDatabase() {
    db.exec('DROP TABLE IF EXISTS contacts;');
    initDatabase();
    return this.getInspectionData();
  }
};

