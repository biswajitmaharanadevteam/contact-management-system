import { contactModel } from '../../../database/db.js';

// Predefined palette for aesthetic contact avatars
const AVATAR_PALETTE = [
  '#3b82f6', '#8b5cf6', '#ec4899', '#f97316',
  '#10b981', '#06b6d4', '#6366f1', '#e11d48', '#14b8a6'
];

function getRandomAvatarColor() {
  return AVATAR_PALETTE[Math.floor(Math.random() * AVATAR_PALETTE.length)];
}

export const contactController = {
  // GET /api/contacts
  getAll(req, res, next) {
    try {
      const { search, category, favorite, sortBy, sortOrder } = req.query;
      const contacts = contactModel.findAll({ search, category, favorite, sortBy, sortOrder });
      res.json({
        success: true,
        count: contacts.length,
        data: contacts
      });
    } catch (error) {
      next(error);
    }
  },

  // GET /api/contacts/stats
  getStats(req, res, next) {
    try {
      const stats = contactModel.getStats();
      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      next(error);
    }
  },

  // GET /api/contacts/:id
  getById(req, res, next) {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ success: false, message: 'Invalid contact ID' });
      }

      const contact = contactModel.findById(id);
      if (!contact) {
        return res.status(404).json({ success: false, message: 'Contact not found' });
      }

      res.json({ success: true, data: contact });
    } catch (error) {
      next(error);
    }
  },

  // POST /api/contacts
  create(req, res, next) {
    try {
      const { first_name, last_name, email, phone, category, company, job_title, address, notes, is_favorite, avatar_color } = req.body;

      if (!first_name || first_name.trim() === '') {
        return res.status(400).json({ success: false, message: 'First name is required' });
      }
      if (!phone || phone.trim() === '') {
        return res.status(400).json({ success: false, message: 'Phone number is required' });
      }

      // Basic email validation if provided
      if (email && email.trim() !== '') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
          return res.status(400).json({ success: false, message: 'Please provide a valid email address' });
        }
      }

      const newContact = contactModel.create({
        first_name: first_name.trim(),
        last_name: (last_name || '').trim(),
        email: (email || '').trim().toLowerCase(),
        phone: phone.trim(),
        category: category || 'Personal',
        company: (company || '').trim(),
        job_title: (job_title || '').trim(),
        address: (address || '').trim(),
        notes: (notes || '').trim(),
        is_favorite: Boolean(is_favorite),
        avatar_color: avatar_color || getRandomAvatarColor()
      });

      res.status(201).json({
        success: true,
        message: 'Contact created successfully',
        data: newContact
      });
    } catch (error) {
      next(error);
    }
  },

  // PUT /api/contacts/:id
  update(req, res, next) {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ success: false, message: 'Invalid contact ID' });
      }

      const existing = contactModel.findById(id);
      if (!existing) {
        return res.status(404).json({ success: false, message: 'Contact not found' });
      }

      const { first_name, last_name, email, phone, category, company, job_title, address, notes, is_favorite, avatar_color } = req.body;

      if (first_name !== undefined && first_name.trim() === '') {
        return res.status(400).json({ success: false, message: 'First name cannot be empty' });
      }
      if (phone !== undefined && phone.trim() === '') {
        return res.status(400).json({ success: false, message: 'Phone number cannot be empty' });
      }

      if (email && email.trim() !== '') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
          return res.status(400).json({ success: false, message: 'Please provide a valid email address' });
        }
      }

      const updated = contactModel.update(id, {
        first_name: first_name !== undefined ? first_name.trim() : undefined,
        last_name: last_name !== undefined ? last_name.trim() : undefined,
        email: email !== undefined ? email.trim().toLowerCase() : undefined,
        phone: phone !== undefined ? phone.trim() : undefined,
        category: category !== undefined ? category : undefined,
        company: company !== undefined ? company.trim() : undefined,
        job_title: job_title !== undefined ? job_title.trim() : undefined,
        address: address !== undefined ? address.trim() : undefined,
        notes: notes !== undefined ? notes.trim() : undefined,
        is_favorite: is_favorite !== undefined ? Boolean(is_favorite) : undefined,
        avatar_color: avatar_color !== undefined ? avatar_color : undefined
      });

      res.json({
        success: true,
        message: 'Contact updated successfully',
        data: updated
      });
    } catch (error) {
      next(error);
    }
  },

  // PATCH /api/contacts/:id/favorite
  toggleFavorite(req, res, next) {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ success: false, message: 'Invalid contact ID' });
      }

      const updated = contactModel.toggleFavorite(id);
      if (!updated) {
        return res.status(404).json({ success: false, message: 'Contact not found' });
      }

      res.json({
        success: true,
        message: updated.is_favorite ? 'Added to favorites' : 'Removed from favorites',
        data: updated
      });
    } catch (error) {
      next(error);
    }
  },

  // DELETE /api/contacts/:id
  delete(req, res, next) {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ success: false, message: 'Invalid contact ID' });
      }

      const deleted = contactModel.delete(id);
      if (!deleted) {
        return res.status(404).json({ success: false, message: 'Contact not found' });
      }

      res.json({
        success: true,
        message: 'Contact deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  },

  // POST /api/contacts/bulk-import
  bulkImport(req, res, next) {
    try {
      const { contacts } = req.body;
      if (!Array.isArray(contacts) || contacts.length === 0) {
        return res.status(400).json({ success: false, message: 'Array of contacts is required' });
      }

      const result = contactModel.bulkInsert(contacts);
      res.json({
        success: true,
        message: `Successfully imported ${result.insertedCount} contacts`,
        data: result
      });
    } catch (error) {
      next(error);
    }
  },

  // GET /api/contacts/export/csv
  exportCsv(req, res, next) {
    try {
      const contacts = contactModel.findAll({ sortBy: 'first_name', sortOrder: 'ASC' });
      const headers = ['First Name', 'Last Name', 'Phone', 'Email', 'Category', 'Company', 'Job Title', 'Address', 'Favorite', 'Notes'];

      const escapeCsv = (val) => {
        if (val === null || val === undefined) return '""';
        const str = String(val).replace(/"/g, '""');
        return `"${str}"`;
      };

      const rows = contacts.map(c => [
        escapeCsv(c.first_name),
        escapeCsv(c.last_name),
        escapeCsv(c.phone),
        escapeCsv(c.email),
        escapeCsv(c.category),
        escapeCsv(c.company),
        escapeCsv(c.job_title),
        escapeCsv(c.address),
        escapeCsv(c.is_favorite ? 'Yes' : 'No'),
        escapeCsv(c.notes)
      ].join(','));

      const csvContent = [headers.join(','), ...rows].join('\r\n');

      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', 'attachment; filename="contacts_export.csv"');
      res.status(200).send(csvContent);
    } catch (error) {
      next(error);
    }
  },

  // GET /api/database/inspect
  inspectDatabase(req, res, next) {
    try {
      const data = contactModel.getInspectionData();
      res.json({
        success: true,
        data
      });
    } catch (error) {
      next(error);
    }
  },

  // POST /api/database/query
  runQuery(req, res, next) {
    try {
      const { query } = req.body;
      const result = contactModel.runQuery(query);
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message || 'Query execution failed'
      });
    }
  },

  // POST /api/database/reset
  resetDatabase(req, res, next) {
    try {
      const data = contactModel.resetDatabase();
      res.json({
        success: true,
        message: 'Database has been successfully reset and seeded.',
        data
      });
    } catch (error) {
      next(error);
    }
  },

  // GET /api/database/download
  downloadDatabase(req, res, next) {
    try {
      const data = contactModel.getInspectionData();
      res.download(data.dbPath, 'contacts.db');
    } catch (error) {
      next(error);
    }
  }
};

