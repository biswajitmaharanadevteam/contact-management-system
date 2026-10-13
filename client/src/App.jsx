import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import StatsOverview from './components/StatsOverview';
import SearchAndFilters from './components/SearchAndFilters';
import ContactCard from './components/ContactCard';
import ContactTableView from './components/ContactTableView';
import ContactFormModal from './components/ContactFormModal';
import ContactDetailsModal from './components/ContactDetailsModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import ImportModal from './components/ImportModal';
import DatabaseModal from './components/DatabaseModal';
import Toast from './components/Toast';
import { api } from './services/api';
import { UserX, Plus, Loader2 } from 'lucide-react';

export default function App() {
  const [contacts, setContacts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filters & Sorting
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [isFavoriteOnly, setIsFavoriteOnly] = useState(false);
  const [sortBy, setSortBy] = useState('first_name');
  const [sortOrder, setSortOrder] = useState('ASC');
  const [viewMode, setViewMode] = useState('grid');

  // Modals state
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState(null);

  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingContact, setDeletingContact] = useState(null);

  const [importModalOpen, setImportModalOpen] = useState(false);
  const [databaseModalOpen, setDatabaseModalOpen] = useState(false);


  // Toast state
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast({ message: '', type: 'success' });
    }, 3500);
  };

  const fetchStats = async () => {
    try {
      const res = await api.getStats();
      if (res.success) setStats(res.data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.getContacts({
        search,
        category,
        favorite: isFavoriteOnly,
        sortBy,
        sortOrder
      });
      if (res.success) {
        setContacts(res.data);
      }
    } catch (err) {
      showToast(err.message || 'Error loading contacts', 'error');
    } finally {
      setLoading(false);
    }
  }, [search, category, isFavoriteOnly, sortBy, sortOrder]);

  // Initial load and filter change
  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  useEffect(() => {
    fetchStats();
  }, []);

  // Handler for quick stat clicks
  const handleStatSelect = (statId) => {
    if (statId === 'Favorites') {
      setIsFavoriteOnly(true);
      setCategory('All');
    } else {
      setIsFavoriteOnly(false);
      setCategory(statId);
    }
  };

  const handleToggleFavorite = async (id) => {
    try {
      const res = await api.toggleFavorite(id);
      if (res.success) {
        setContacts((prev) =>
          prev.map((c) => (c.id === id ? { ...c, is_favorite: res.data.is_favorite } : c))
        );
        if (selectedContact && selectedContact.id === id) {
          setSelectedContact((prev) => ({ ...prev, is_favorite: res.data.is_favorite }));
        }
        showToast(res.message);
        fetchStats();
      }
    } catch (err) {
      showToast(err.message || 'Failed to update favorite', 'error');
    }
  };

  const handleSaveContact = async (formData, id) => {
    if (id) {
      const res = await api.updateContact(id, formData);
      showToast('Contact updated successfully');
      setContacts((prev) => prev.map((c) => (c.id === id ? res.data : c)));
      if (selectedContact && selectedContact.id === id) {
        setSelectedContact(res.data);
      }
    } else {
      const res = await api.createContact(formData);
      showToast('Contact created successfully');
      setContacts((prev) => [res.data, ...prev]);
    }
    fetchStats();
  };

  const handleDeleteConfirm = async (id) => {
    try {
      await api.deleteContact(id);
      setContacts((prev) => prev.filter((c) => c.id !== id));
      showToast('Contact deleted successfully');
      fetchStats();
    } catch (err) {
      showToast(err.message || 'Failed to delete contact', 'error');
    }
  };

  const handleImportSuccess = async (importedList) => {
    try {
      const res = await api.bulkImport(importedList);
      showToast(res.message);
      fetchContacts();
      fetchStats();
    } catch (err) {
      showToast(err.message || 'Failed to import contacts', 'error');
    }
  };

  const handleExportCsv = () => {
    window.open(api.getExportCsvUrl(), '_blank');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Top Navigation */}
      <Navbar
        onOpenAddModal={() => {
          setEditingContact(null);
          setFormModalOpen(true);
        }}
        onExportCsv={handleExportCsv}
        onOpenImportModal={() => setImportModalOpen(true)}
        onOpenDatabaseModal={() => setDatabaseModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Statistics Dashboard Banner */}
        <StatsOverview
          stats={stats}
          activeFilter={isFavoriteOnly ? 'Favorites' : category}
          onSelectFilter={handleStatSelect}
        />

        {/* Search, Category and Sorting Bar */}
        <SearchAndFilters
          search={search}
          onSearchChange={setSearch}
          category={category}
          onCategoryChange={(cat) => {
            setCategory(cat);
            setIsFavoriteOnly(false);
          }}
          isFavoriteOnly={isFavoriteOnly}
          onToggleFavoriteFilter={() => setIsFavoriteOnly((prev) => !prev)}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={(sb, so) => {
            setSortBy(sb);
            setSortOrder(so);
          }}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          totalResults={contacts.length}
        />

        {/* Content View: Loading, Empty, Grid or Table */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-3" />
            <p className="text-sm font-medium text-slate-500">Loading contacts...</p>
          </div>
        ) : contacts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto my-8 shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4 border border-blue-100">
              <UserX className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No contacts found</h3>
            <p className="text-xs text-slate-500 mt-1 mb-6 leading-relaxed">
              {search || category !== 'All' || isFavoriteOnly
                ? 'Try adjusting your search criteria or clearing filters to find what you are looking for.'
                : 'Get started by creating your very first contact record in the database.'}
            </p>
            <button
              onClick={() => {
                if (search || category !== 'All' || isFavoriteOnly) {
                  setSearch('');
                  setCategory('All');
                  setIsFavoriteOnly(false);
                } else {
                  setEditingContact(null);
                  setFormModalOpen(true);
                }
              }}
              className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{search || category !== 'All' || isFavoriteOnly ? 'Clear Filters' : 'Add First Contact'}</span>
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {contacts.map((contact) => (
              <ContactCard
                key={contact.id}
                contact={contact}
                onEdit={(c) => {
                  setEditingContact(c);
                  setFormModalOpen(true);
                }}
                onDelete={(c) => {
                  setDeletingContact(c);
                  setDeleteModalOpen(true);
                }}
                onView={(c) => {
                  setSelectedContact(c);
                  setDetailsModalOpen(true);
                }}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>
        ) : (
          <ContactTableView
            contacts={contacts}
            onEdit={(c) => {
              setEditingContact(c);
              setFormModalOpen(true);
            }}
            onDelete={(c) => {
              setDeletingContact(c);
              setDeleteModalOpen(true);
            }}
            onView={(c) => {
              setSelectedContact(c);
              setDetailsModalOpen(true);
            }}
            onToggleFavorite={handleToggleFavorite}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-500">
          <p>ContactHub Full Stack Contact Management System • Built with React, Express & SQLite</p>
          <p className="mt-1 text-slate-400">
            Database file: <button onClick={() => setDatabaseModalOpen(true)} className="underline text-blue-600 hover:text-blue-800 font-mono cursor-pointer">contact-management-system/database/contacts.db</button> • <button onClick={() => setDatabaseModalOpen(true)} className="font-semibold text-slate-700 hover:text-blue-600 underline cursor-pointer">Click to View Full DB</button>
          </p>
        </div>
      </footer>

      {/* Modals */}
      <ContactFormModal
        isOpen={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        onSave={handleSaveContact}
        contact={editingContact}
      />

      <ContactDetailsModal
        isOpen={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        contact={selectedContact}
        onEdit={(c) => {
          setEditingContact(c);
          setFormModalOpen(true);
        }}
        onDelete={(c) => {
          setDeletingContact(c);
          setDeleteModalOpen(true);
        }}
        onToggleFavorite={handleToggleFavorite}
      />

      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        contact={deletingContact}
      />

      <ImportModal
        isOpen={importModalOpen}
        onClose={() => setImportModalOpen(false)}
        onImport={handleImportSuccess}
      />

      <DatabaseModal
        isOpen={databaseModalOpen}
        onClose={() => setDatabaseModalOpen(false)}
        onDatabaseChanged={() => {
          fetchContacts();
          fetchStats();
        }}
      />


      {/* Toast Feedback */}
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'success' })}
      />
    </div>
  );
}
