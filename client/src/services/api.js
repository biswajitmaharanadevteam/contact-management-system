// API Layer with Dual-Mode Support:
// 1. Live Express Backend Mode (when running locally or on Zoho AppSail)
// 2. Client-Side Persistent Database Mode (when hosted on static CDN like Zoho Slate)

const API_BASE = '/api/contacts';

const INITIAL_SEED_CONTACTS = [
  { id: 1, first_name: 'Alexander', last_name: 'Wright', email: 'alex.wright@techflow.io', phone: '+1 (555) 234-5678', category: 'Work', company: 'TechFlow Innovations', job_title: 'Principal Architect', address: '742 Evergreen Terrace, Seattle, WA', notes: 'Lead architect on the cloud migration project. Prefers Slack or email.', is_favorite: 1, avatar_color: '#3b82f6', created_at: '2026-10-13 14:00:00', updated_at: '2026-10-13 14:00:00' },
  { id: 2, first_name: 'Sophia', last_name: 'Chen', email: 'sophia.chen@nexusmedia.com', phone: '+1 (555) 876-5432', category: 'Work', company: 'Nexus Media Labs', job_title: 'VP of Product Design', address: '120 Market Street, San Francisco, CA', notes: 'Met at Design Summit 2026. Great resource for UX reviews.', is_favorite: 1, avatar_color: '#8b5cf6', created_at: '2026-10-13 14:01:00', updated_at: '2026-10-13 14:01:00' },
  { id: 3, first_name: 'Marcus', last_name: 'Vance', email: 'marcus.v@familymail.net', phone: '+1 (555) 345-6789', category: 'Family', company: 'Self-Employed', job_title: 'Landscape Designer', address: '88 Maple Grove Lane, Portland, OR', notes: 'Cousin Marcus. Birthday is November 14th.', is_favorite: 1, avatar_color: '#10b981', created_at: '2026-10-13 14:02:00', updated_at: '2026-10-13 14:02:00' },
  { id: 4, first_name: 'Elena', last_name: 'Rostova', email: 'elena.rostova@quantumfin.com', phone: '+1 (555) 456-7890', category: 'Work', company: 'Quantum Financial', job_title: 'Senior Quant Analyst', address: '45 Wall St, New York, NY', notes: 'Discuss quarterly revenue forecast and data pipelines.', is_favorite: 0, avatar_color: '#f59e0b', created_at: '2026-10-13 14:03:00', updated_at: '2026-10-13 14:03:00' },
  { id: 5, first_name: 'Liam', last_name: 'Gallagher', email: 'liam.g@oasisband.co.uk', phone: '+44 20 7946 0912', category: 'Friends', company: 'Acoustic Labs', job_title: 'Sound Engineer', address: '14 Abbey Road, London, UK', notes: 'College roommate. Organizes annual hiking trip.', is_favorite: 1, avatar_color: '#ec4899', created_at: '2026-10-13 14:04:00', updated_at: '2026-10-13 14:04:00' },
  { id: 6, first_name: 'Dr. Maya', last_name: 'Patel', email: 'dr.patel@cardiohealth.org', phone: '+1 (555) 987-6543', category: 'Personal', company: 'CardioHealth Clinic', job_title: 'Cardiologist', address: '500 Medical Plaza, Chicago, IL', notes: 'Family doctor. Annual health checkup scheduled for October.', is_favorite: 0, avatar_color: '#06b6d4', created_at: '2026-10-13 14:05:00', updated_at: '2026-10-13 14:05:00' },
  { id: 7, first_name: 'Jordan', last_name: 'Kim', email: 'jordan.kim@startuphub.co', phone: '+1 (555) 654-3210', category: 'Friends', company: 'Venture Next', job_title: 'Community Lead', address: '300 Pine Street, Austin, TX', notes: 'Organizes local developer meetups and hackathons.', is_favorite: 0, avatar_color: '#6366f1', created_at: '2026-10-13 14:06:00', updated_at: '2026-10-13 14:06:00' },
  { id: 8, first_name: 'Rachel', last_name: 'Green', email: 'rachel.green@ralphlauren.fashion', phone: '+1 (555) 789-0123', category: 'Family', company: 'Ralph Lauren Corp', job_title: 'Merchandising Director', address: '90 Bedford Street, New York, NY', notes: 'Aunt Rachel. Loves French espresso roast.', is_favorite: 0, avatar_color: '#f97316', created_at: '2026-10-13 14:07:00', updated_at: '2026-10-13 14:07:00' },
  { id: 9, first_name: 'David', last_name: "O'Connor", email: 'doconnor@apexlaw.com', phone: '+1 (555) 890-1234', category: 'Other', company: 'Apex Legal Partners', job_title: 'Managing Partner', address: '200 Constitution Ave, Boston, MA', notes: 'Legal advisor for contracts and intellectual property rights.', is_favorite: 0, avatar_color: '#64748b', created_at: '2026-10-13 14:08:00', updated_at: '2026-10-13 14:08:00' }
];

const LOCAL_STORAGE_KEY = 'contacthub_sqlite_store';

// Helper to get client database
function getLocalDB() {
  const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_SEED_CONTACTS));
    return [...INITIAL_SEED_CONTACTS];
  }
  try {
    return JSON.parse(raw);
  } catch {
    return [...INITIAL_SEED_CONTACTS];
  }
}

function saveLocalDB(data) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
}

let backendChecked = false;
let isBackendAvailable = false;

// Check if Express backend is running and responding with JSON
async function checkBackend() {
  if (backendChecked) return isBackendAvailable;
  try {
    const res = await fetch('/api/health');
    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      const data = await res.json();
      isBackendAvailable = Boolean(data && data.status === 'ok');
    } else {
      isBackendAvailable = false;
    }
  } catch {
    isBackendAvailable = false;
  }
  backendChecked = true;
  return isBackendAvailable;
}

export const api = {
  async getContacts({ search = '', category = '', favorite = false, sortBy = 'first_name', sortOrder = 'ASC' } = {}) {
    const hasBackend = await checkBackend();

    if (hasBackend) {
      try {
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (category && category !== 'All') params.append('category', category);
        if (favorite) params.append('favorite', '1');
        if (sortBy) params.append('sortBy', sortBy);
        if (sortOrder) params.append('sortOrder', sortOrder);

        const res = await fetch(`${API_BASE}?${params.toString()}`);
        const contentType = res.headers.get('content-type') || '';
        if (res.ok && contentType.includes('application/json')) {
          return await res.json();
        }
      } catch (e) {
        console.warn('Backend query failed, falling back to client DB:', e);
      }
    }

    // Client-side Database Engine
    let contacts = getLocalDB();

    if (search && search.trim() !== '') {
      const q = search.trim().toLowerCase();
      contacts = contacts.filter(c =>
        (c.first_name || '').toLowerCase().includes(q) ||
        (c.last_name || '').toLowerCase().includes(q) ||
        (c.email || '').toLowerCase().includes(q) ||
        (c.phone || '').toLowerCase().includes(q) ||
        (c.company || '').toLowerCase().includes(q) ||
        (c.job_title || '').toLowerCase().includes(q)
      );
    }

    if (category && category !== 'All') {
      contacts = contacts.filter(c => c.category === category);
    }

    if (favorite) {
      contacts = contacts.filter(c => c.is_favorite === 1 || c.is_favorite === true);
    }

    // Sorting
    contacts.sort((a, b) => {
      let valA = (a[sortBy] || '').toString().toLowerCase();
      let valB = (b[sortBy] || '').toString().toLowerCase();
      if (valA < valB) return sortOrder.toUpperCase() === 'DESC' ? 1 : -1;
      if (valA > valB) return sortOrder.toUpperCase() === 'DESC' ? -1 : 1;
      return 0;
    });

    return {
      success: true,
      count: contacts.length,
      data: contacts,
      mode: 'client-database'
    };
  },

  async getStats() {
    const hasBackend = await checkBackend();
    if (hasBackend) {
      try {
        const res = await fetch(`${API_BASE}/stats`);
        const contentType = res.headers.get('content-type') || '';
        if (res.ok && contentType.includes('application/json')) {
          return await res.json();
        }
      } catch {}
    }

    const contacts = getLocalDB();
    const favorites = contacts.filter(c => c.is_favorite).length;
    const categories = {};
    for (const c of contacts) {
      const cat = c.category || 'Other';
      categories[cat] = (categories[cat] || 0) + 1;
    }

    return {
      success: true,
      data: {
        total: contacts.length,
        favorites,
        categories
      }
    };
  },

  async getContact(id) {
    const hasBackend = await checkBackend();
    if (hasBackend) {
      try {
        const res = await fetch(`${API_BASE}/${id}`);
        const contentType = res.headers.get('content-type') || '';
        if (res.ok && contentType.includes('application/json')) {
          return await res.json();
        }
      } catch {}
    }

    const contacts = getLocalDB();
    const contact = contacts.find(c => c.id === Number(id));
    if (!contact) throw new Error('Contact not found');
    return { success: true, data: contact };
  },

  async createContact(contactData) {
    const hasBackend = await checkBackend();
    if (hasBackend) {
      try {
        const res = await fetch(API_BASE, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(contactData)
        });
        const contentType = res.headers.get('content-type') || '';
        if (res.ok && contentType.includes('application/json')) {
          return await res.json();
        }
      } catch {}
    }

    const contacts = getLocalDB();
    const newId = contacts.length > 0 ? Math.max(...contacts.map(c => c.id)) + 1 : 1;
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

    const newContact = {
      id: newId,
      first_name: contactData.first_name || '',
      last_name: contactData.last_name || '',
      email: contactData.email || '',
      phone: contactData.phone || '',
      category: contactData.category || 'Personal',
      company: contactData.company || '',
      job_title: contactData.job_title || '',
      address: contactData.address || '',
      notes: contactData.notes || '',
      is_favorite: contactData.is_favorite ? 1 : 0,
      avatar_color: contactData.avatar_color || '#3b82f6',
      created_at: now,
      updated_at: now
    };

    contacts.unshift(newContact);
    saveLocalDB(contacts);
    return { success: true, data: newContact };
  },

  async updateContact(id, contactData) {
    const hasBackend = await checkBackend();
    if (hasBackend) {
      try {
        const res = await fetch(`${API_BASE}/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(contactData)
        });
        const contentType = res.headers.get('content-type') || '';
        if (res.ok && contentType.includes('application/json')) {
          return await res.json();
        }
      } catch {}
    }

    const contacts = getLocalDB();
    const index = contacts.findIndex(c => c.id === Number(id));
    if (index === -1) throw new Error('Contact not found');

    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const updated = {
      ...contacts[index],
      ...contactData,
      is_favorite: contactData.is_favorite !== undefined ? (contactData.is_favorite ? 1 : 0) : contacts[index].is_favorite,
      updated_at: now
    };

    contacts[index] = updated;
    saveLocalDB(contacts);
    return { success: true, data: updated };
  },

  async toggleFavorite(id) {
    const hasBackend = await checkBackend();
    if (hasBackend) {
      try {
        const res = await fetch(`${API_BASE}/${id}/favorite`, { method: 'PATCH' });
        const contentType = res.headers.get('content-type') || '';
        if (res.ok && contentType.includes('application/json')) {
          return await res.json();
        }
      } catch {}
    }

    const contacts = getLocalDB();
    const index = contacts.findIndex(c => c.id === Number(id));
    if (index === -1) throw new Error('Contact not found');

    contacts[index].is_favorite = contacts[index].is_favorite ? 0 : 1;
    saveLocalDB(contacts);
    return {
      success: true,
      message: contacts[index].is_favorite ? 'Added to favorites' : 'Removed from favorites',
      data: contacts[index]
    };
  },

  async deleteContact(id) {
    const hasBackend = await checkBackend();
    if (hasBackend) {
      try {
        const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
        const contentType = res.headers.get('content-type') || '';
        if (res.ok && contentType.includes('application/json')) {
          return await res.json();
        }
      } catch {}
    }

    let contacts = getLocalDB();
    contacts = contacts.filter(c => c.id !== Number(id));
    saveLocalDB(contacts);
    return { success: true, message: 'Contact deleted successfully' };
  },

  async bulkImport(contactsList) {
    const hasBackend = await checkBackend();
    if (hasBackend) {
      try {
        const res = await fetch(`${API_BASE}/bulk-import`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contacts: contactsList })
        });
        const contentType = res.headers.get('content-type') || '';
        if (res.ok && contentType.includes('application/json')) {
          return await res.json();
        }
      } catch {}
    }

    const contacts = getLocalDB();
    let maxId = contacts.length > 0 ? Math.max(...contacts.map(c => c.id)) : 0;
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

    let count = 0;
    for (const item of contactsList) {
      if (!item.first_name || !item.phone) continue;
      maxId++;
      contacts.push({
        id: maxId,
        first_name: item.first_name,
        last_name: item.last_name || '',
        email: item.email || '',
        phone: item.phone,
        category: item.category || 'Personal',
        company: item.company || '',
        job_title: item.job_title || '',
        address: item.address || '',
        notes: item.notes || '',
        is_favorite: item.is_favorite ? 1 : 0,
        avatar_color: item.avatar_color || '#3b82f6',
        created_at: now,
        updated_at: now
      });
      count++;
    }

    saveLocalDB(contacts);
    return { success: true, message: `Successfully imported ${count} contacts`, data: { insertedCount: count } };
  },

  getExportCsvUrl() {
    return `${API_BASE}/export/csv`;
  },

  async inspectDatabase() {
    const hasBackend = await checkBackend();
    if (hasBackend) {
      try {
        const res = await fetch(`${API_BASE}/database/inspect`);
        const contentType = res.headers.get('content-type') || '';
        if (res.ok && contentType.includes('application/json')) {
          return await res.json();
        }
      } catch {}
    }

    // Client-side Inspection Data for Static Deployment
    const contacts = getLocalDB();
    const columns = [
      { name: 'id', type: 'INTEGER', notnull: 1, dfl_value: null, pk: 1 },
      { name: 'first_name', type: 'TEXT', notnull: 1, dfl_value: null, pk: 0 },
      { name: 'last_name', type: 'TEXT', notnull: 0, dfl_value: "''", pk: 0 },
      { name: 'email', type: 'TEXT', notnull: 0, dfl_value: "''", pk: 0 },
      { name: 'phone', type: 'TEXT', notnull: 1, dfl_value: null, pk: 0 },
      { name: 'category', type: 'TEXT', notnull: 0, dfl_value: "'Personal'", pk: 0 },
      { name: 'company', type: 'TEXT', notnull: 0, dfl_value: "''", pk: 0 },
      { name: 'job_title', type: 'TEXT', notnull: 0, dfl_value: "''", pk: 0 },
      { name: 'address', type: 'TEXT', notnull: 0, dfl_value: "''", pk: 0 },
      { name: 'notes', type: 'TEXT', notnull: 0, dfl_value: "''", pk: 0 },
      { name: 'is_favorite', type: 'INTEGER', notnull: 0, dfl_value: '0', pk: 0 },
      { name: 'avatar_color', type: 'TEXT', notnull: 0, dfl_value: "'#3b82f6'", pk: 0 },
      { name: 'created_at', type: 'DATETIME', notnull: 0, dfl_value: 'CURRENT_TIMESTAMP', pk: 0 },
      { name: 'updated_at', type: 'DATETIME', notnull: 0, dfl_value: 'CURRENT_TIMESTAMP', pk: 0 }
    ];

    const indexes = [
      { name: 'idx_contacts_name', unique: 0 },
      { name: 'idx_contacts_category', unique: 0 },
      { name: 'idx_contacts_favorite', unique: 0 },
      { name: 'idx_contacts_email', unique: 0 },
      { name: 'idx_contacts_phone', unique: 0 }
    ];

    const schemaSql = `-- Contact Management System Schema
CREATE TABLE IF NOT EXISTS contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT NOT NULL,
    last_name TEXT DEFAULT '',
    email TEXT DEFAULT '',
    phone TEXT NOT NULL,
    category TEXT DEFAULT 'Personal',
    company TEXT DEFAULT '',
    job_title TEXT DEFAULT '',
    address TEXT DEFAULT '',
    notes TEXT DEFAULT '',
    is_favorite INTEGER DEFAULT 0,
    avatar_color TEXT DEFAULT '#3b82f6',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);`;

    return {
      success: true,
      data: {
        sqliteVersion: '3.53.0 (Slate Client Engine)',
        dbPath: 'database/contacts.db',
        fileSizeBytes: contacts.length * 1024,
        fileSizeKb: (contacts.length * 1.5).toFixed(2),
        tableName: 'contacts',
        columns,
        indexes,
        totalRows: contacts.length,
        schemaSql,
        rows: contacts
      }
    };
  },

  async runDatabaseQuery(query) {
    const hasBackend = await checkBackend();
    if (hasBackend) {
      try {
        const res = await fetch(`${API_BASE}/database/query`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query })
        });
        const contentType = res.headers.get('content-type') || '';
        if (res.ok && contentType.includes('application/json')) {
          return await res.json();
        }
      } catch {}
    }

    const contacts = getLocalDB();
    const q = (query || '').toLowerCase().trim();

    let filtered = [...contacts];
    if (q.includes('where is_favorite = 1') || q.includes('is_favorite=1')) {
      filtered = filtered.filter(c => c.is_favorite);
    } else if (q.includes("where category = 'work'")) {
      filtered = filtered.filter(c => c.category === 'Work');
    } else if (q.includes("where category = 'family'")) {
      filtered = filtered.filter(c => c.category === 'Family');
    }

    if (q.includes('group by category')) {
      const counts = {};
      for (const c of contacts) {
        counts[c.category] = (counts[c.category] || 0) + 1;
      }
      const groupRows = Object.entries(counts).map(([cat, count]) => ({ category: cat, count }));
      return {
        success: true,
        data: { query, rowCount: groupRows.length, rows: groupRows }
      };
    }

    return {
      success: true,
      data: {
        query,
        rowCount: filtered.length,
        rows: filtered
      }
    };
  },

  async resetDatabase() {
    const hasBackend = await checkBackend();
    if (hasBackend) {
      try {
        const res = await fetch(`${API_BASE}/database/reset`, { method: 'POST' });
        const contentType = res.headers.get('content-type') || '';
        if (res.ok && contentType.includes('application/json')) {
          return await res.json();
        }
      } catch {}
    }

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_SEED_CONTACTS));
    return this.inspectDatabase();
  },

  getDownloadDatabaseUrl() {
    return `${API_BASE}/database/download`;
  }
};
