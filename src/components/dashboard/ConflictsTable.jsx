import React, { useState, useMemo } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { conflictsGeoJSON } from '../../data/mockData';

/**
 * ConflictsTable — Sortable table of all flagged conflicts.
 * Mirrors the conflicts display in app.py with colored confidence badges.
 *
 * Props:
 *  - onRowClick(plotId): callback when a row is clicked (selects plot on map)
 *  - selectedPlotId: highlights the active row
 */

/* ── Confidence badge color logic ──────────────────────────────────── */
const getConfidenceBadge = (score) => {
  if (score >= 85) return { text: 'High', bg: 'bg-emerald-100', fg: 'text-emerald-700', dot: 'bg-emerald-500' };
  if (score >= 60) return { text: 'Medium', bg: 'bg-amber-100', fg: 'text-amber-700', dot: 'bg-amber-500' };
  return { text: 'Low', bg: 'bg-red-100', fg: 'text-red-700', dot: 'bg-red-500' };
};

const SORT_KEYS = ['plot_id', 'conflict_type', 'iou', 'confidence_score', 'status'];

const ConflictsTable = ({ onRowClick, selectedPlotId }) => {
  const [sortKey, setSortKey] = useState('confidence_score');
  const [sortDir, setSortDir] = useState('desc');

  const conflicts = useMemo(() => {
    const data = conflictsGeoJSON.features.map((f) => f.properties);
    return [...data].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (typeof aVal === 'number') {
        return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
      }
      return sortDir === 'asc'
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
  }, [sortKey, sortDir]);

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  };

  const SortIcon = ({ colKey }) => {
    if (sortKey !== colKey) return <ArrowUpDown size={12} className="text-slate-300" />;
    return sortDir === 'asc'
      ? <ArrowUp size={12} className="text-teal-500" />
      : <ArrowDown size={12} className="text-teal-500" />;
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
      <div className="px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <h3 className="text-xs sm:text-sm font-semibold text-slate-700">
          🚨 Flagged Spatial Conflicts ({conflicts.length})
        </h3>
        <span className="text-[10px] sm:hidden text-slate-400 font-medium">
          Swipe horizontally →
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/50">
              {[
                { key: 'plot_id', label: 'Plot ID' },
                { key: 'conflict_type', label: 'Conflict Type' },
                { key: 'iou', label: 'IoU %' },
                { key: 'confidence_score', label: 'Confidence' },
                { key: 'status', label: 'Status' },
              ].map((col) => (
                <th
                  key={col.key}
                  className="px-3 sm:px-4 py-2 sm:py-2.5 text-left text-[10px] sm:text-[11px] font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-700 select-none whitespace-nowrap"
                  onClick={() => handleSort(col.key)}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    <SortIcon colKey={col.key} />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {conflicts.map((c) => {
              const badge = getConfidenceBadge(c.confidence_score);
              const isSelected = c.plot_id === selectedPlotId;
              return (
                <tr
                  key={c.conflict_id}
                  onClick={() => onRowClick(c.plot_id)}
                  className={`cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-blue-50 hover:bg-blue-100'
                      : 'hover:bg-slate-50'
                  }`}
                >
                  <td className="px-3 sm:px-4 py-2 sm:py-2.5 font-mono text-[11px] sm:text-xs font-medium text-slate-700 whitespace-nowrap">
                    {c.plot_id}
                  </td>
                  <td className="px-3 sm:px-4 py-2 sm:py-2.5 text-slate-600 whitespace-nowrap">{c.conflict_type}</td>
                  <td className="px-3 sm:px-4 py-2 sm:py-2.5 font-medium text-slate-700 whitespace-nowrap">{c.iou}%</td>
                  <td className="px-3 sm:px-4 py-2 sm:py-2.5 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] sm:text-xs font-medium ${badge.bg} ${badge.fg}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                      {c.confidence_score}% — {badge.text}
                    </span>
                  </td>
                  <td className="px-3 sm:px-4 py-2 sm:py-2.5 whitespace-nowrap">
                    <span className={`text-[11px] sm:text-xs font-medium ${
                      c.status === 'Confirmed' ? 'text-emerald-600' :
                      c.status === 'Needs Review' ? 'text-amber-600' :
                      'text-red-600'
                    }`}>
                      {c.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ConflictsTable;
