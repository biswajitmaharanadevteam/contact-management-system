import React from 'react';
import { Phone, Mail, Building2, Star, MoreVertical, Edit2, Trash2, Eye } from 'lucide-react';

const CATEGORY_COLORS = {
  Work: 'bg-indigo-50 text-indigo-700 border-indigo-200/60',
  Family: 'bg-rose-50 text-rose-700 border-rose-200/60',
  Friends: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
  Personal: 'bg-blue-50 text-blue-700 border-blue-200/60',
  Other: 'bg-slate-100 text-slate-700 border-slate-200'
};

export default function ContactCard({ contact, onEdit, onDelete, onView, onToggleFavorite }) {
  const initials = `${(contact.first_name || '')[0] || ''}${(contact.last_name || '')[0] || ''}`.toUpperCase();
  const categoryStyle = CATEGORY_COLORS[contact.category] || CATEGORY_COLORS.Other;

  return (
    <div className="bg-white rounded-xl border border-slate-200 hover:border-slate-300 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group">
      {/* Top Header */}
      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            {/* Avatar */}
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-xs flex-shrink-0"
              style={{ backgroundColor: contact.avatar_color || '#3b82f6' }}
            >
              {initials || '?'}
            </div>

            {/* Name & Title */}
            <div className="min-w-0">
              <h3 className="text-base font-semibold text-slate-900 truncate">
                {contact.first_name} {contact.last_name}
              </h3>
              {(contact.job_title || contact.company) && (
                <p className="text-xs text-slate-500 truncate flex items-center gap-1 mt-0.5">
                  <Building2 className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate">
                    {[contact.job_title, contact.company].filter(Boolean).join(' • ')}
                  </span>
                </p>
              )}
            </div>
          </div>

          {/* Favorite Toggle Star */}
          <button
            onClick={() => onToggleFavorite(contact.id)}
            title={contact.is_favorite ? 'Remove from favorites' : 'Add to favorites'}
            className="p-1 rounded-lg text-slate-300 hover:text-amber-500 transition-colors cursor-pointer"
          >
            <Star
              className={`w-5 h-5 transition-transform active:scale-125 ${
                contact.is_favorite ? 'text-amber-400 fill-amber-400' : ''
              }`}
            />
          </button>
        </div>

        {/* Category Badge */}
        <div className="mt-3.5">
          <span className={`inline-block px-2.5 py-0.5 text-xs font-medium rounded-full border ${categoryStyle}`}>
            {contact.category || 'Personal'}
          </span>
        </div>

        {/* Contact Info (Phone & Email) */}
        <div className="mt-4 space-y-2 text-xs text-slate-600">
          <a
            href={`tel:${contact.phone}`}
            className="flex items-center space-x-2 text-slate-600 hover:text-blue-600 group/link transition-colors"
          >
            <div className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center flex-shrink-0 group-hover/link:bg-blue-50 group-hover/link:text-blue-600">
              <Phone className="w-3 h-3" />
            </div>
            <span className="truncate font-mono">{contact.phone}</span>
          </a>

          {contact.email ? (
            <a
              href={`mailto:${contact.email}`}
              className="flex items-center space-x-2 text-slate-600 hover:text-blue-600 group/link transition-colors"
            >
              <div className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center flex-shrink-0 group-hover/link:bg-blue-50 group-hover/link:text-blue-600">
                <Mail className="w-3 h-3" />
              </div>
              <span className="truncate">{contact.email}</span>
            </a>
          ) : (
            <div className="flex items-center space-x-2 text-slate-400">
              <div className="w-6 h-6 rounded-md bg-slate-50 flex items-center justify-center flex-shrink-0">
                <Mail className="w-3 h-3" />
              </div>
              <span className="italic text-slate-400">No email listed</span>
            </div>
          )}
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="border-t border-slate-100 px-4 py-2.5 bg-slate-50/70 rounded-b-xl flex items-center justify-between">
        <button
          onClick={() => onView(contact)}
          className="inline-flex items-center space-x-1 text-xs font-medium text-slate-600 hover:text-blue-600 transition-colors cursor-pointer"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>View Details</span>
        </button>

        <div className="flex items-center space-x-1">
          <button
            onClick={() => onEdit(contact)}
            title="Edit contact"
            className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-white transition-colors cursor-pointer"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(contact)}
            title="Delete contact"
            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-white transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
