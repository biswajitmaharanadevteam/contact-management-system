import React from 'react';
import { Users, Plus, Download, Upload, Database } from 'lucide-react';

export default function Navbar({ onOpenAddModal, onExportCsv, onOpenImportModal, onOpenDatabaseModal }) {
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold tracking-tight text-slate-900">ContactHub</h1>
                <span className="px-2 py-0.5 text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/60 rounded-full">
                  Full Stack
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">Modern Contact Management System</p>
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* View Database button */}
            <button
              onClick={onOpenDatabaseModal}
              title="Inspect raw database tables, schema, and run SQL queries"
              className="inline-flex items-center space-x-1.5 px-3 py-2 text-xs sm:text-sm font-semibold bg-slate-900 text-slate-100 hover:bg-slate-800 rounded-lg shadow-xs transition-all cursor-pointer"
            >
              <Database className="w-4 h-4 text-emerald-400" />
              <span>View Full DB</span>
            </button>

            {/* Export button */}
            <button
              onClick={onExportCsv}
              title="Export all contacts to CSV file"
              className="inline-flex items-center space-x-1.5 px-3 py-2 text-xs sm:text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm cursor-pointer"
            >
              <Download className="w-4 h-4 text-slate-500" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>

            {/* Import button */}
            <button
              onClick={onOpenImportModal}
              title="Import contacts from JSON"
              className="inline-flex items-center space-x-1.5 px-3 py-2 text-xs sm:text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm cursor-pointer"
            >
              <Upload className="w-4 h-4 text-slate-500" />
              <span className="hidden sm:inline">Import</span>
            </button>

            {/* Add Contact CTA */}
            <button
              onClick={onOpenAddModal}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md shadow-blue-600/25 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Add Contact</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
