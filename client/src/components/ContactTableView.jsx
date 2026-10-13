import React from 'react';
import { Phone, Mail, Star, Edit2, Trash2, Eye } from 'lucide-react';

const CATEGORY_COLORS = {
  Work: 'bg-indigo-50 text-indigo-700 border-indigo-200/60',
  Family: 'bg-rose-50 text-rose-700 border-rose-200/60',
  Friends: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
  Personal: 'bg-blue-50 text-blue-700 border-blue-200/60',
  Other: 'bg-slate-100 text-slate-700 border-slate-200'
};

export default function ContactTableView({ contacts, onEdit, onDelete, onView, onToggleFavorite }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50/80 text-xs uppercase font-semibold text-slate-500 border-b border-slate-200">
            <tr>
              <th scope="col" className="px-5 py-3.5 w-12 text-center">Fav</th>
              <th scope="col" className="px-5 py-3.5">Contact</th>
              <th scope="col" className="px-5 py-3.5">Category</th>
              <th scope="col" className="px-5 py-3.5">Phone</th>
              <th scope="col" className="px-5 py-3.5">Email</th>
              <th scope="col" className="px-5 py-3.5">Company & Title</th>
              <th scope="col" className="px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {contacts.map((contact) => {
              const initials = `${(contact.first_name || '')[0] || ''}${(contact.last_name || '')[0] || ''}`.toUpperCase();
              const categoryStyle = CATEGORY_COLORS[contact.category] || CATEGORY_COLORS.Other;

              return (
                <tr key={contact.id} className="hover:bg-slate-50/80 transition-colors">
                  {/* Star */}
                  <td className="px-5 py-3.5 text-center">
                    <button
                      onClick={() => onToggleFavorite(contact.id)}
                      className="text-slate-300 hover:text-amber-500 transition-colors cursor-pointer"
                    >
                      <Star
                        className={`w-4 h-4 ${contact.is_favorite ? 'text-amber-400 fill-amber-400' : ''}`}
                      />
                    </button>
                  </td>

                  {/* Name and avatar */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                        style={{ backgroundColor: contact.avatar_color || '#3b82f6' }}
                      >
                        {initials}
                      </div>
                      <span className="font-medium text-slate-900 whitespace-nowrap">
                        {contact.first_name} {contact.last_name}
                      </span>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="px-5 py-3.5">
                    <span className={`inline-block px-2.5 py-0.5 text-xs font-medium rounded-full border ${categoryStyle}`}>
                      {contact.category}
                    </span>
                  </td>

                  {/* Phone */}
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <a href={`tel:${contact.phone}`} className="hover:text-blue-600 transition-colors font-mono text-xs">
                      {contact.phone}
                    </a>
                  </td>

                  {/* Email */}
                  <td className="px-5 py-3.5">
                    {contact.email ? (
                      <a href={`mailto:${contact.email}`} className="hover:text-blue-600 transition-colors truncate max-w-[180px] inline-block">
                        {contact.email}
                      </a>
                    ) : (
                      <span className="text-slate-300 italic">—</span>
                    )}
                  </td>

                  {/* Company & Title */}
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <span className="text-slate-700">
                      {[contact.company, contact.job_title].filter(Boolean).join(' • ') || '—'}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-3.5 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end space-x-1">
                      <button
                        onClick={() => onView(contact)}
                        title="View details"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100 transition-colors cursor-pointer"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onEdit(contact)}
                        title="Edit contact"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100 transition-colors cursor-pointer"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(contact)}
                        title="Delete contact"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
