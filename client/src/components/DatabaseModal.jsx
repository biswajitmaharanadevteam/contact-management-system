import React, { useState, useEffect } from 'react';
import {
  X, Database, Terminal, Table, FileCode, Download, RefreshCw,
  Play, RotateCcw, Copy, Check, HardDrive, Layers, ShieldCheck, AlertCircle
} from 'lucide-react';
import { api } from '../services/api';

export default function DatabaseModal({ isOpen, onClose, onDatabaseChanged }) {
  const [activeTab, setActiveTab] = useState('table'); // 'table', 'query', 'schema', 'json'
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Custom SQL Runner state
  const [customQuery, setCustomQuery] = useState('SELECT id, first_name, last_name, phone, category, is_favorite FROM contacts ORDER BY id ASC;');
  const [queryResult, setQueryResult] = useState(null);
  const [queryLoading, setQueryLoading] = useState(false);
  const [queryError, setQueryError] = useState(null);

  // Copy feedback
  const [copied, setCopied] = useState(false);

  const fetchInspection = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.inspectDatabase();
      if (res.success) {
        setData(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to inspect database');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchInspection();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleRunQuery = async (queryToRun = customQuery) => {
    setQueryLoading(true);
    setQueryError(null);
    try {
      const res = await api.runDatabaseQuery(queryToRun);
      if (res.success) {
        setQueryResult(res.data);
      }
    } catch (err) {
      setQueryError(err.message || 'Query failed');
      setQueryResult(null);
    } finally {
      setQueryLoading(false);
    }
  };

  const handleResetDb = async () => {
    if (!window.confirm('Reset database to initial schema and sample seed contacts?')) return;
    try {
      const res = await api.resetDatabase();
      setData(res.data);
      if (onDatabaseChanged) onDatabaseChanged();
      alert('Database reset and seeded successfully.');
    } catch (err) {
      alert('Reset failed: ' + err.message);
    }
  };

  const handleCopyJson = () => {
    if (!data?.rows) return;
    navigator.clipboard.writeText(JSON.stringify(data.rows, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const presetQueries = [
    { label: 'All Contacts', sql: 'SELECT id, first_name, last_name, phone, category, is_favorite FROM contacts;' },
    { label: 'Favorites Only', sql: 'SELECT first_name, last_name, email, phone FROM contacts WHERE is_favorite = 1;' },
    { label: 'Category Count', sql: 'SELECT category, COUNT(*) as count FROM contacts GROUP BY category ORDER BY count DESC;' },
    { label: 'Table Pragmas', sql: 'PRAGMA table_info(contacts);' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-5xl w-full h-[90vh] flex flex-col overflow-hidden animate-in fade-in duration-200">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-400/30 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-bold text-white">SQLite Database Explorer</h2>
                <span className="px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                  LIVE CONNECTION
                </span>
              </div>
              <p className="text-xs text-slate-400 truncate max-w-md">
                Path: <code className="text-blue-300">{data?.dbPath || 'contacts.db'}</code>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <a
              href={api.getDownloadDatabaseUrl()}
              title="Download SQLite .db file directly"
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold bg-white/10 hover:bg-white/20 text-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download .db</span>
            </a>

            <button
              onClick={handleResetDb}
              title="Reset database to default seed state"
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 rounded-lg transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset Seed</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Database Quick Stats Bar */}
        <div className="bg-slate-800 text-xs text-slate-300 px-6 py-2.5 flex items-center justify-between flex-wrap gap-3 border-b border-slate-700 flex-shrink-0">
          <div className="flex items-center space-x-5 flex-wrap">
            <div className="flex items-center space-x-1.5">
              <HardDrive className="w-3.5 h-3.5 text-blue-400" />
              <span>Engine: <strong className="text-white">SQLite {data?.sqliteVersion || '3.x'}</strong></span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              <span>Table: <strong className="text-white">contacts</strong></span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Table className="w-3.5 h-3.5 text-emerald-400" />
              <span>Total Rows: <strong className="text-white">{data?.totalRows ?? '...'}</strong></span>
            </div>
            <div className="flex items-center space-x-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>File Size: <strong className="text-white">{data?.fileSizeKb ? `${data.fileSizeKb} KB` : '...'}</strong></span>
            </div>
          </div>

          <button
            onClick={fetchInspection}
            className="inline-flex items-center space-x-1 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-slate-200 px-6 bg-slate-50 flex items-center space-x-2 flex-shrink-0">
          {[
            { id: 'table', label: 'Raw Table Records', icon: Table },
            { id: 'query', label: 'Live SQL Runner', icon: Terminal },
            { id: 'schema', label: 'Schema & Indexes', icon: FileCode },
            { id: 'json', label: 'JSON Export', icon: Copy }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center space-x-2 py-3 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
                  isActive
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
          {error && (
            <div className="p-4 mb-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* TAB 1: RAW TABLE VIEW */}
          {activeTab === 'table' && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="px-5 py-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">All Database Records (Raw Columns)</h3>
                  <p className="text-[11px] text-slate-500">Includes all database fields: id, timestamps, address, notes, and avatar colors</p>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full border border-blue-200">
                  {data?.rows?.length || 0} rows
                </span>
              </div>

              <div className="overflow-x-auto max-h-[55vh]">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-100 text-slate-600 sticky top-0 z-10 border-b border-slate-200 font-sans font-semibold">
                    <tr>
                      <th className="px-3.5 py-2.5">id</th>
                      <th className="px-3.5 py-2.5">first_name</th>
                      <th className="px-3.5 py-2.5">last_name</th>
                      <th className="px-3.5 py-2.5">phone</th>
                      <th className="px-3.5 py-2.5">email</th>
                      <th className="px-3.5 py-2.5">category</th>
                      <th className="px-3.5 py-2.5">company</th>
                      <th className="px-3.5 py-2.5">job_title</th>
                      <th className="px-3.5 py-2.5">is_favorite</th>
                      <th className="px-3.5 py-2.5">avatar_color</th>
                      <th className="px-3.5 py-2.5">created_at</th>
                      <th className="px-3.5 py-2.5">updated_at</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {data?.rows?.map((row) => (
                      <tr key={row.id} className="hover:bg-blue-50/40 transition-colors">
                        <td className="px-3.5 py-2 font-bold text-blue-600">{row.id}</td>
                        <td className="px-3.5 py-2 font-sans font-medium text-slate-900">{row.first_name}</td>
                        <td className="px-3.5 py-2 font-sans text-slate-700">{row.last_name || '—'}</td>
                        <td className="px-3.5 py-2 text-slate-800">{row.phone}</td>
                        <td className="px-3.5 py-2 text-slate-600 truncate max-w-[140px]">{row.email || '—'}</td>
                        <td className="px-3.5 py-2 font-sans">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 border border-slate-200 text-slate-700">
                            {row.category}
                          </span>
                        </td>
                        <td className="px-3.5 py-2 font-sans text-slate-600 truncate max-w-[120px]">{row.company || '—'}</td>
                        <td className="px-3.5 py-2 font-sans text-slate-600 truncate max-w-[120px]">{row.job_title || '—'}</td>
                        <td className="px-3.5 py-2 text-center font-sans">
                          {row.is_favorite ? (
                            <span className="text-amber-500 font-bold">1 (★)</span>
                          ) : (
                            <span className="text-slate-400">0</span>
                          )}
                        </td>
                        <td className="px-3.5 py-2">
                          <div className="flex items-center space-x-1.5">
                            <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: row.avatar_color }} />
                            <span>{row.avatar_color}</span>
                          </div>
                        </td>
                        <td className="px-3.5 py-2 text-slate-500 text-[11px] whitespace-nowrap">{row.created_at}</td>
                        <td className="px-3.5 py-2 text-slate-500 text-[11px] whitespace-nowrap">{row.updated_at}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: LIVE SQL RUNNER */}
          {activeTab === 'query' && (
            <div className="space-y-4">
              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Execute Read-Only SQL Query
                  </label>
                  <div className="flex items-center space-x-1.5 flex-wrap">
                    <span className="text-[11px] text-slate-400 mr-1">Presets:</span>
                    {presetQueries.map((p) => (
                      <button
                        key={p.label}
                        onClick={() => {
                          setCustomQuery(p.sql);
                          handleRunQuery(p.sql);
                        }}
                        className="px-2 py-1 text-[11px] font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors cursor-pointer"
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="relative">
                  <textarea
                    rows={3}
                    value={customQuery}
                    onChange={(e) => setCustomQuery(e.target.value)}
                    placeholder="SELECT * FROM contacts WHERE category = 'Work';"
                    className="w-full font-mono text-xs p-3 bg-slate-900 text-emerald-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                  <button
                    onClick={() => handleRunQuery()}
                    disabled={queryLoading || !customQuery.trim()}
                    className="absolute bottom-3 right-3 inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm transition-all disabled:opacity-50 cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{queryLoading ? 'Running...' : 'Execute SQL'}</span>
                  </button>
                </div>
              </div>

              {/* Query Error */}
              {queryError && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{queryError}</span>
                </div>
              )}

              {/* Query Results */}
              {queryResult && (
                <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
                  <div className="px-5 py-2.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-700">
                      Query Results: <strong className="text-blue-600">{queryResult.rowCount}</strong> rows returned
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">{queryResult.query}</span>
                  </div>

                  <div className="overflow-x-auto max-h-[45vh]">
                    {queryResult.rows.length === 0 ? (
                      <p className="p-6 text-center text-xs text-slate-400">Query returned zero rows.</p>
                    ) : (
                      <table className="w-full text-left text-xs font-mono">
                        <thead className="bg-slate-100 text-slate-600 border-b border-slate-200 font-sans font-semibold sticky top-0">
                          <tr>
                            {Object.keys(queryResult.rows[0]).map((col) => (
                              <th key={col} className="px-3.5 py-2">{col}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {queryResult.rows.map((row, i) => (
                            <tr key={i} className="hover:bg-slate-50">
                              {Object.values(row).map((val, idx) => (
                                <td key={idx} className="px-3.5 py-2 whitespace-nowrap">
                                  {val === null ? <span className="text-slate-300 italic">null</span> : String(val)}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SCHEMA & INDEXES */}
          {activeTab === 'schema' && (
            <div className="space-y-5">
              {/* Columns Table */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="px-5 py-3 border-b border-slate-200 bg-slate-50">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Table Columns Definition</h4>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-slate-100 text-slate-600 border-b border-slate-200 font-sans font-semibold">
                      <tr>
                        <th className="px-4 py-2">Column Name</th>
                        <th className="px-4 py-2">Type</th>
                        <th className="px-4 py-2">Not Null?</th>
                        <th className="px-4 py-2">Default Value</th>
                        <th className="px-4 py-2">Primary Key</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {data?.columns?.map((col) => (
                        <tr key={col.name} className="hover:bg-slate-50">
                          <td className="px-4 py-2 font-bold text-slate-800">{col.name}</td>
                          <td className="px-4 py-2 text-blue-600 font-semibold">{col.type}</td>
                          <td className="px-4 py-2 font-sans">{col.notnull ? 'Yes' : 'No'}</td>
                          <td className="px-4 py-2 text-slate-500">{col.dfl_value ?? '—'}</td>
                          <td className="px-4 py-2 font-sans">{col.pk ? '✅ PK' : '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Indexes */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="px-5 py-3 border-b border-slate-200 bg-slate-50">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Declared SQLite Indexes</h4>
                </div>
                <div className="p-4 space-y-2">
                  {data?.indexes?.map((idx) => (
                    <div key={idx.name} className="flex items-center space-x-2 text-xs font-mono bg-slate-50 p-2 rounded-lg border border-slate-200">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="font-semibold text-slate-800">{idx.name}</span>
                      <span className="text-slate-400 font-sans">({idx.unique ? 'UNIQUE' : 'INDEX'})</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Raw SQL DDL */}
              {data?.schemaSql && (
                <div className="bg-slate-900 rounded-xl p-4 text-xs font-mono text-emerald-400 overflow-x-auto shadow-md">
                  <div className="text-slate-400 text-[10px] font-sans font-bold uppercase tracking-wider mb-2">
                    schema.sql
                  </div>
                  <pre>{data.schemaSql}</pre>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: JSON EXPORT */}
          {activeTab === 'json' && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col h-[55vh]">
              <div className="px-5 py-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Raw JSON Representation</h4>
                  <p className="text-[11px] text-slate-500">Live JSON dump of the contacts database table</p>
                </div>
                <button
                  onClick={handleCopyJson}
                  className="inline-flex items-center space-x-1.5 px-3 py-1 text-xs font-semibold bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors shadow-xs cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                  <span>{copied ? 'Copied!' : 'Copy JSON'}</span>
                </button>
              </div>

              <div className="flex-1 p-4 bg-slate-900 overflow-y-auto">
                <pre className="text-xs font-mono text-blue-300 whitespace-pre-wrap">
                  {JSON.stringify(data?.rows || [], null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
