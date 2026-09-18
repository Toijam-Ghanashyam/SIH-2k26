import React, { useState, useEffect, useMemo } from 'react';

const API_BASE = import.meta.env.VITE_LEDGER_API_BASE || 'http://127.0.0.1:5000';

export default function SpatialEvidenceLedger() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modals state
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [auditList, setAuditList] = useState([]);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [auditLoading, setAuditLoading] = useState(false);

  // ZK Verification state: maps parcel_id -> { valid: boolean, message: string }
  const [verificationMap, setVerificationMap] = useState({});

  // Fetch ledger records
  const fetchLedger = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/ledger`);
      if (!res.ok) {
        throw new Error(`Server returned ${res.status}: ${res.statusText}`);
      }
      const data = await res.json();
      setRecords(Array.isArray(data) ? data : data.records || []);
    } catch (err) {
      setError(`Failed to connect to Spatial Evidence Ledger backend (${err.message}). Ensure Flask backend is running on ${API_BASE}.`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLedger();
  }, []);

  // Fetch audit history
  const fetchAuditHistory = async () => {
    setAuditLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/audit`);
      if (!res.ok) {
        throw new Error(`Audit API returned ${res.status}`);
      }
      const data = await res.json();
      const rawList = Array.isArray(data) ? data : data.audit || [];
      // Sort newest first
      const sorted = [...rawList].sort((a, b) => {
        const timeA = new Date(a.timestamp || 0).getTime();
        const timeB = new Date(b.timestamp || 0).getTime();
        return timeB - timeA;
      });
      setAuditList(sorted);
      setIsAuditModalOpen(true);
    } catch (err) {
      setFeedback({ type: 'error', text: `Could not fetch audit records: ${err.message}` });
    } finally {
      setAuditLoading(false);
    }
  };

  // Verify ZK Commitment format (64-character hex string)
  const handleVerifyCommitment = (parcelId, commitment) => {
    if (!commitment || typeof commitment !== 'string') {
      setVerificationMap((prev) => ({
        ...prev,
        [parcelId]: { valid: false, message: 'Commitment missing or invalid' }
      }));
      return;
    }
    const hexPattern = /^[a-fA-F0-9]{64}$/;
    const isValid = hexPattern.test(commitment.trim());
    setVerificationMap((prev) => ({
      ...prev,
      [parcelId]: {
        valid: isValid,
        message: isValid
          ? 'Valid 64-char Hex SHA-256 format verified'
          : 'Invalid commitment format: Expected 64-character hexadecimal'
      }
    }));
  };

  // Approve action
  const handleApprove = async (parcelId) => {
    setFeedback(null);
    try {
      const res = await fetch(`${API_BASE}/api/approve/${encodeURIComponent(parcelId)}`, {
        method: 'POST'
      });
      if (!res.ok) {
        throw new Error(`Approval failed with status ${res.status}`);
      }
      setFeedback({ type: 'success', text: `Parcel ${parcelId} approved successfully.` });
      fetchLedger();
    } catch (err) {
      setFeedback({ type: 'error', text: `Failed to approve parcel: ${err.message}` });
    }
  };

  // Reject action
  const handleReject = async (parcelId) => {
    const confirmed = window.confirm(`Are you sure you want to reject parcel ${parcelId}?`);
    if (!confirmed) return;

    setFeedback(null);
    try {
      const res = await fetch(`${API_BASE}/api/reject/${encodeURIComponent(parcelId)}`, {
        method: 'POST'
      });
      if (!res.ok) {
        throw new Error(`Rejection failed with status ${res.status}`);
      }
      setFeedback({ type: 'success', text: `Parcel ${parcelId} rejected successfully.` });
      fetchLedger();
    } catch (err) {
      setFeedback({ type: 'error', text: `Failed to reject parcel: ${err.message}` });
    }
  };

  // Filtered record list
  const filteredRecords = useMemo(() => {
    return records.filter((item) => {
      const parcelIdStr = String(item.parcel_id || item.id || '').toLowerCase();
      const matchesSearch = parcelIdStr.includes(searchQuery.toLowerCase().trim());
      const currentStatus = (item.status || 'PENDING').toUpperCase();
      const matchesStatus = statusFilter === 'ALL' || currentStatus === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [records, searchQuery, statusFilter]);

  const getStatusBadge = (status) => {
    const s = (status || 'PENDING').toUpperCase();
    if (s === 'APPROVED') {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300">
          APPROVED
        </span>
      );
    }
    if (s === 'REJECTED') {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300">
          REJECTED
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
        PENDING
      </span>
    );
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-5 mt-6 transition-colors">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-700 pb-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-teal-500" />
            Spatial Evidence Ledger
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Immutable spatial evidence, human decisions and zero-knowledge verification.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <input
            type="text"
            placeholder="Search Parcel ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="text-xs px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-teal-500"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-teal-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>

          <button
            onClick={fetchLedger}
            disabled={loading}
            className="text-xs px-3 py-1.5 rounded-lg font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 transition-colors disabled:opacity-50"
          >
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>

          <button
            onClick={fetchAuditHistory}
            disabled={auditLoading}
            className="text-xs px-3 py-1.5 rounded-lg font-medium bg-teal-600 hover:bg-teal-700 text-white transition-colors disabled:opacity-50"
          >
            {auditLoading ? 'Loading Audit...' : 'Audit History'}
          </button>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`mt-3 px-3 py-2 text-xs rounded-md flex items-center justify-between ${
            feedback.type === 'success'
              ? 'bg-teal-50 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300 border border-teal-200 dark:border-teal-800'
              : 'bg-rose-50 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
          }`}
        >
          <span>{feedback.text}</span>
          <button
            onClick={() => setFeedback(null)}
            className="ml-3 font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Table Content */}
      <div className="mt-4">
        {loading && (
          <div className="py-12 text-center text-xs text-slate-500 dark:text-slate-400">
            <div className="inline-block animate-spin rounded-full h-5 w-5 border-2 border-teal-500 border-t-transparent mb-2" />
            <p>Loading spatial evidence ledger records...</p>
          </div>
        )}

        {error && !loading && (
          <div className="p-4 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-lg text-xs text-rose-700 dark:text-rose-300">
            {error}
          </div>
        )}

        {!loading && !error && filteredRecords.length === 0 && (
          <div className="py-10 text-center text-xs text-slate-400 dark:text-slate-500">
            No ledger records found matching the active filters.
          </div>
        )}

        {!loading && !error && filteredRecords.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 font-semibold bg-slate-50/50 dark:bg-slate-800/50">
                  <th className="py-2.5 px-3">Parcel ID</th>
                  <th className="py-2.5 px-3">Source</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Transformation</th>
                  <th className="py-2.5 px-3">Conflict</th>
                  <th className="py-2.5 px-3">Decision Reason</th>
                  <th className="py-2.5 px-3">Human Approval</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">ZK Commitment</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                {filteredRecords.map((rec, idx) => {
                  const pid = rec.parcel_id || rec.id || `REC-${idx}`;
                  const commitment = rec.zk_commitment || rec.commitment || '';
                  const status = (rec.status || 'PENDING').toUpperCase();
                  const verification = verificationMap[pid];

                  return (
                    <tr
                      key={pid}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-700/40 transition-colors"
                    >
                      <td className="py-3 px-3 font-mono font-medium text-slate-900 dark:text-slate-100">
                        {pid}
                      </td>
                      <td className="py-3 px-3 text-slate-600 dark:text-slate-300">
                        {rec.source || 'N/A'}
                      </td>
                      <td className="py-3 px-3 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                        {rec.date || rec.timestamp || 'N/A'}
                      </td>
                      <td className="py-3 px-3 text-slate-600 dark:text-slate-300">
                        {rec.transformation || 'None'}
                      </td>
                      <td className="py-3 px-3 text-slate-600 dark:text-slate-300">
                        {rec.conflict ? (
                          <span className="text-amber-600 dark:text-amber-400 font-medium">
                            {String(rec.conflict)}
                          </span>
                        ) : (
                          'None'
                        )}
                      </td>
                      <td className="py-3 px-3 text-slate-600 dark:text-slate-300 max-w-[150px] truncate" title={rec.decision_reason}>
                        {rec.decision_reason || '—'}
                      </td>
                      <td className="py-3 px-3 text-slate-600 dark:text-slate-300">
                        {rec.human_approval ? String(rec.human_approval) : '—'}
                      </td>
                      <td className="py-3 px-3">
                        {getStatusBadge(status)}
                      </td>
                      <td className="py-3 px-3 max-w-[180px]">
                        {commitment ? (
                          <div className="space-y-1">
                            <div className="font-mono text-[10px] text-slate-500 dark:text-slate-400 truncate bg-slate-100 dark:bg-slate-700/50 p-1 rounded" title={commitment}>
                              {commitment}
                            </div>
                            <button
                              onClick={() => handleVerifyCommitment(pid, commitment)}
                              className="text-[10px] font-medium text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300 underline block"
                            >
                              Verify Commitment
                            </button>
                            {verification && (
                              <div
                                className={`text-[10px] leading-tight ${
                                  verification.valid
                                    ? 'text-teal-600 dark:text-teal-400'
                                    : 'text-rose-600 dark:text-rose-400'
                                }`}
                              >
                                {verification.message}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[10px]">No commitment</span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedRecord(rec)}
                            className="px-2 py-1 rounded text-[11px] font-medium text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 transition-colors"
                          >
                            Details
                          </button>

                          {status === 'PENDING' && (
                            <>
                              <button
                                onClick={() => handleApprove(pid)}
                                className="px-2 py-1 rounded text-[11px] font-medium text-white bg-teal-600 hover:bg-teal-700 transition-colors"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleReject(pid)}
                                className="px-2 py-1 rounded text-[11px] font-medium text-white bg-rose-600 hover:bg-rose-700 transition-colors"
                              >
                                Reject
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Parcel Details Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 w-full max-w-xl max-h-[85vh] flex flex-col overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between bg-slate-50 dark:bg-slate-800">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Parcel Details: {selectedRecord.parcel_id || selectedRecord.id}
              </h3>
              <button
                onClick={() => setSelectedRecord(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-lg leading-none"
              >
                ✕
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-3 text-xs">
              {Object.entries(selectedRecord).map(([key, value]) => (
                <div key={key} className="grid grid-cols-3 gap-2 border-b border-slate-100 dark:border-slate-700/50 pb-2">
                  <span className="font-semibold text-slate-500 dark:text-slate-400 capitalize">
                    {key.replace(/_/g, ' ')}
                  </span>
                  <span className="col-span-2 text-slate-800 dark:text-slate-200 break-words font-mono">
                    {typeof value === 'object' && value !== null
                      ? JSON.stringify(value, null, 2)
                      : String(value ?? '—')}
                  </span>
                </div>
              ))}
            </div>

            <div className="px-5 py-3 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedRecord(null)}
                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Audit History Modal */}
      {isAuditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between bg-slate-50 dark:bg-slate-800">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Audit History Log
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Sorted newest first. Tracks verification and decisions.
                </p>
              </div>
              <button
                onClick={() => setIsAuditModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-lg leading-none"
              >
                ✕
              </button>
            </div>

            <div className="p-5 overflow-y-auto">
              {auditList.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400">
                  No audit trail records found.
                </div>
              ) : (
                <div className="space-y-3">
                  {auditList.map((entry, i) => (
                    <div
                      key={entry.id || i}
                      className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/30 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-wide text-[11px]">
                          {entry.action || 'ACTION'}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {entry.timestamp || entry.date || 'N/A'}
                        </span>
                      </div>
                      <div className="font-mono text-slate-700 dark:text-slate-300">
                        <span className="text-slate-400">Parcel:</span> {entry.parcel_id || entry.id || 'N/A'}
                      </div>
                      <div className="text-slate-600 dark:text-slate-300 break-words">
                        <span className="text-slate-400">Details:</span>{' '}
                        {typeof entry.details === 'object'
                          ? JSON.stringify(entry.details)
                          : String(entry.details || entry.message || '—')}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="px-5 py-3 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 flex justify-end">
              <button
                onClick={() => setIsAuditModalOpen(false)}
                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}