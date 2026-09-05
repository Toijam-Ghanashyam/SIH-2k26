import React, { useState } from 'react';
import { FileDown, User, Receipt, Hash, Ruler, AlertCircle, Brain } from 'lucide-react';
import { revenueRecords, conflictsGeoJSON } from '../../data/mockData';

/**
 * PlotInspectionPanel — Appears when a cadastral plot is clicked.
 * Mirrors the plot inspection section in app.py:
 *  - Owner, Tax Status, Tax ID
 *  - Registered vs. GIS Area vs. Discrepancy
 *  - AI Model Diagnostics (confidence + IoU progress bars)
 *  - Download PDF button (stubbed)
 */

const ConfidenceBar = ({ label, value, threshold = 85 }) => {
  const isHigh = value >= threshold;
  const barColor = isHigh ? 'bg-emerald-500' : 'bg-amber-500';
  const badgeColor = isHigh ? 'text-emerald-700 bg-emerald-100' : 'text-amber-700 bg-amber-100';
  const badgeText = isHigh ? 'High Certainty' : 'Needs Human Review';

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-500">{label}</span>
        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${badgeColor}`}>
          {badgeText}
        </span>
      </div>
      <div className="w-full bg-slate-200 rounded-full h-2.5">
        <div
          className={`h-2.5 rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${Math.min(value, 100)}%` }}
        />
      </div>
      <span className="text-xs font-medium text-slate-600">{value.toFixed(1)}%</span>
    </div>
  );
};

const PlotInspectionPanel = ({ selectedPlotId }) => {
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const handleDownloadNotice = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 3000);
    }, 1000);
  };

  /* Empty state */
  if (!selectedPlotId) {
    return (
      <div className="bg-white rounded-lg border border-slate-200 p-6 text-center">
        <p className="text-sm text-slate-500 font-medium">No parcel selected</p>
        <p className="text-xs text-slate-400 mt-1">
          Click any cadastral plot on the map or a row in the conflicts table to inspect attributes.
        </p>
      </div>
    );
  }

  /* Find revenue record for the selected plot */
  const record = revenueRecords.find((r) => r.plot_id === selectedPlotId);

  /* Find linked conflict (if any) */
  const conflict = conflictsGeoJSON.features.find(
    (f) => f.properties.plot_id === selectedPlotId
  );

  if (!record) {
    return (
      <div className="bg-white rounded-lg border border-slate-200 p-6 text-center">
        <p className="text-sm text-slate-400">No revenue record found for {selectedPlotId}.</p>
      </div>
    );
  }

  const discrepancy = Math.abs(record.registered_area_sqm - record.gis_area_sqm);
  const isLargeDiscrepancy = discrepancy > 10;

  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <h3 className="text-xs sm:text-sm font-semibold text-slate-700">
          📋 Plot Inspection — {selectedPlotId}
        </h3>
        <button
          onClick={handleDownloadNotice}
          disabled={downloading}
          className="flex items-center justify-center gap-1.5 text-xs font-medium text-amber-700 bg-amber-100 hover:bg-amber-200 disabled:opacity-75 px-3 py-1.5 rounded-md transition-colors w-full sm:w-auto"
        >
          <FileDown size={14} className={downloading ? 'animate-bounce shrink-0' : 'shrink-0'} />
          <span>
            {downloading
              ? 'Generating Notice…'
              : downloaded
              ? 'Notice Ready (Simulated)'
              : <>Download <span className="hidden sm:inline">Official Inspection </span>Notice (PDF)</>}
          </span>
        </button>
      </div>

      <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
        {/* Row 1: Owner, Tax Status, Tax ID */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
          <StatCell icon={User} label="Legal Owner" value={record.owner_name} />
          <StatCell
            icon={Receipt}
            label="Property Tax Status"
            value={record.tax_status}
            valueClass={
              record.tax_status === 'Overdue'
                ? 'text-red-600'
                : record.tax_status === 'Pending'
                ? 'text-amber-600'
                : 'text-emerald-600'
            }
          />
          <StatCell icon={Hash} label="Tax ID" value={record.tax_id} />
        </div>

        {/* Row 2: Registered Area, GIS Area, Discrepancy */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
          <StatCell icon={Ruler} label="Registered Area" value={`${record.registered_area_sqm} m²`} />
          <StatCell icon={Ruler} label="GIS Surveyed Area" value={`${record.gis_area_sqm} m²`} />
          <StatCell
            icon={AlertCircle}
            label="Area Discrepancy"
            value={`${discrepancy} m²`}
            valueClass={isLargeDiscrepancy ? 'text-red-600 font-bold' : 'text-slate-700'}
          />
        </div>

        {/* AI Model Diagnostics (only if conflict exists) */}
        {conflict && (
          <div className="bg-slate-50 rounded-md border border-slate-200 p-4 space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <Brain size={16} className="text-teal-600" />
              <h4 className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                AI Model Diagnostics
              </h4>
            </div>
            <ConfidenceBar
              label="AI Extraction Confidence"
              value={conflict.properties.confidence_score}
            />
            <ConfidenceBar
              label="Spatial Overlap / IoU"
              value={conflict.properties.iou}
              threshold={85}
            />
          </div>
        )}
      </div>
    </div>
  );
};

/* ── Small stat cell helper ────────────────────────────────────────── */
const StatCell = ({ icon: Icon, label, value, valueClass = 'text-slate-700' }) => (
  <div className="bg-slate-50 rounded-md border border-slate-100 p-3">
    <div className="flex items-center gap-1.5 mb-1">
      <Icon size={12} className="text-slate-400" />
      <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">{label}</span>
    </div>
    <p className={`text-sm font-semibold ${valueClass} truncate`}>{value}</p>
  </div>
);

export default PlotInspectionPanel;
