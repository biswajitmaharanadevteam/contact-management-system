const API_BASE = '/api/contacts';

export const api = {
  async getContacts({ search = '', category = '', favorite = false, sortBy = 'first_name', sortOrder = 'ASC' } = {}) {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (category && category !== 'All') params.append('category', category);
    if (favorite) params.append('favorite', '1');
    if (sortBy) params.append('sortBy', sortBy);
    if (sortOrder) params.append('sortOrder', sortOrder);

    const res = await fetch(`${API_BASE}?${params.toString()}`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to fetch contacts');
    }
    return res.json();
  },

  async getStats() {
    const res = await fetch(`${API_BASE}/stats`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to fetch stats');
    }
    return res.json();
  },

  async getContact(id) {
    const res = await fetch(`${API_BASE}/${id}`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to fetch contact details');
    }
    return res.json();
  },

  async createContact(contactData) {
    const res = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contactData)
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to create contact');
    }
    return data;
  },

  async updateContact(id, contactData) {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contactData)
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to update contact');
    }
    return data;
  },

  async toggleFavorite(id) {
    const res = await fetch(`${API_BASE}/${id}/favorite`, {
      method: 'PATCH'
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to toggle favorite');
    }
    return data;
  },

  async deleteContact(id) {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: 'DELETE'
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to delete contact');
    }
    return data;
  },

  async bulkImport(contactsList) {
    const res = await fetch(`${API_BASE}/bulk-import`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contacts: contactsList })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to import contacts');
    }
    return data;
  },

  getExportCsvUrl() {
    return `${API_BASE}/export/csv`;
  },

  async inspectDatabase() {
    const res = await fetch(`${API_BASE}/database/inspect`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to inspect database');
    }
    return res.json();
  },

  async runDatabaseQuery(query) {
    const res = await fetch(`${API_BASE}/database/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Query execution failed');
    }
    return data;
  },

  async resetDatabase() {
    const res = await fetch(`${API_BASE}/database/reset`, {
      method: 'POST'
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to reset database');
    }
    return data;
  },

  getDownloadDatabaseUrl() {
    return `${API_BASE}/database/download`;
  }
};

