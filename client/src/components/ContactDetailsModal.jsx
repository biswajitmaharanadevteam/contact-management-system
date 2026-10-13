import React from 'react';
import { X, Phone, Mail, Building2, MapPin, Calendar, Clock, Star, Edit2, Trash2 } from 'lucide-react';

const CATEGORY_COLORS = {
  Work: 'bg-indigo-50 text-indigo-700 border-indigo-200/60',
  Family: 'bg-rose-50 text-rose-700 border-rose-200/60',
  Friends: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
  Personal: 'bg-blue-50 text-blue-700 border-blue-200/60',
  Other: 'bg-slate-100 text-slate-700 border-slate-200'
};

export default function ContactDetailsModal({ isOpen, onClose, contact, onEdit, onDelete, onToggleFavorite }) {
  if (!isOpen || !contact) return null;

  const initials = `${(contact.first_name || '')[0] || ''}${(contact.last_name || '')[0] || ''}`.toUpperCase();
  const categoryStyle = CATEGORY_COLORS[contact.category] || CATEGORY_COLORS.Other;

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in duration-200">
        {/* Header Banner */}
        <div className="relative p-6 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-lg flex-shrink-0"
              style={{ backgroundColor: contact.avatar_color || '#3b82f6' }}
            >
              {initials || '?'}
            </div>

            <div className="min-w-0 pr-8">
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-bold text-white truncate">
                  {contact.first_name} {contact.last_name}
                </h2>
                <button
                  onClick={() => onToggleFavorite(contact.id)}
                  title={contact.is_favorite ? 'Remove from favorites' : 'Add to favorites'}
                  className="cursor-pointer"
                >
                  <Star
                    className={`w-5 h-5 ${
                      contact.is_favorite ? 'text-amber-400 fill-amber-400' : 'text-slate-500 hover:text-slate-300'
                    }`}
                  />
                </button>
              </div>

              {(contact.job_title || contact.company) && (
                <p className="text-xs text-slate-300 truncate mt-0.5">
                  {[contact.job_title, contact.company].filter(Boolean).join(' • ')}
                </p>
              )}

              <div className="mt-2">
                <span className={`inline-block px-2.5 py-0.5 text-xs font-medium rounded-full border ${categoryStyle}`}>
                  {contact.category || 'Personal'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Row */}
        <div className="flex items-center justify-around border-b border-slate-100 bg-slate-50/50 py-3 px-6">
          <a
            href={`tel:${contact.phone}`}
            className="flex flex-col items-center text-xs font-semibold text-slate-700 hover:text-blue-600 transition-colors"
          >
            <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-1">
              <Phone className="w-4 h-4" />
            </div>
            <span>Call</span>
          </a>

          {contact.email && (
            <a
              href={`mailto:${contact.email}`}
              className="flex flex-col items-center text-xs font-semibold text-slate-700 hover:text-blue-600 transition-colors"
            >
              <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mb-1">
                <Mail className="w-4 h-4" />
              </div>
              <span>Email</span>
            </a>
          )}

          <button
            onClick={() => {
              onClose();
              onEdit(contact);
            }}
            className="flex flex-col items-center text-xs font-semibold text-slate-700 hover:text-blue-600 transition-colors cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center mb-1">
              <Edit2 className="w-4 h-4" />
            </div>
            <span>Edit</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onDelete(contact);
            }}
            className="flex flex-col items-center text-xs font-semibold text-slate-700 hover:text-rose-600 transition-colors cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mb-1">
              <Trash2 className="w-4 h-4" />
            </div>
            <span>Delete</span>
          </button>
        </div>

        {/* Information Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Contact Details */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Contact Details</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3 text-sm">
                <Phone className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-slate-400">Phone</p>
                  <p className="font-mono text-slate-800 font-medium">{contact.phone}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 text-sm">
                <Mail className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-slate-400">Email</p>
                  <p className="text-slate-800 font-medium">{contact.email || 'None'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Professional Details */}
          {(contact.company || contact.job_title) && (
            <div className="border-t border-slate-100 pt-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Organization</h4>
              <div className="flex items-start space-x-3 text-sm">
                <Building2 className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-slate-400">Position</p>
                  <p className="text-slate-800 font-medium">
                    {[contact.job_title, contact.company].filter(Boolean).join(' at ')}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Address */}
          {contact.address && (
            <div className="border-t border-slate-100 pt-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Location</h4>
              <div className="flex items-start space-x-3 text-sm">
                <MapPin className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-slate-400">Address</p>
                  <p className="text-slate-800">{contact.address}</p>
                </div>
              </div>
            </div>
          )}

          {/* Notes */}
          {contact.notes && (
            <div className="border-t border-slate-100 pt-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Notes</h4>
              <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">
                {contact.notes}
              </div>
            </div>
          )}

          {/* Metadata timestamps */}
          <div className="border-t border-slate-100 pt-4 text-xs text-slate-400 space-y-1">
            <div className="flex items-center space-x-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>Created: {formatDate(contact.created_at)}</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>Last Updated: {formatDate(contact.updated_at)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
