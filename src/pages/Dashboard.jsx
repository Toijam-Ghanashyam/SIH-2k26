import React, { useState, useCallback } from 'react';
import { Menu } from 'lucide-react';
import TopBar from '../components/dashboard/TopBar';
import KpiRow from '../components/dashboard/KpiRow';
import TopologyRow from '../components/dashboard/TopologyRow';
import LayerSidebar from '../components/dashboard/LayerSidebar';
import MapTabs from '../components/dashboard/MapTabs';
import PlotInspectionPanel from '../components/dashboard/PlotInspectionPanel';
import ConflictsTable from '../components/dashboard/ConflictsTable';
import IngestionHub from '../components/dashboard/IngestionHub';
import Toast from '../components/dashboard/Toast';
import { computeKPIs, topologyMetrics, plotsGeoJSON } from '../data/mockData';

/**
 * Dashboard — Main operational dashboard page.
 * Orchestrates all dashboard components and manages shared state.
 */
const Dashboard = () => {
  /* ── State ────────────────────────────────────────────────────────── */

  // Layer visibility toggles (all checked by default, mirrors app.py sidebar)
  const [layers, setLayers] = useState({
    plots: true,
    buildings: true,
    conflicts: true,
    municipal: true,
    utilities: true,
    gt: true,
    gnss: true,
  });

  // Selected plot (for inspection panel)
  const [selectedPlotId, setSelectedPlotId] = useState(null);

  // Sidebar drawer (mobile only)
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Conflict engine loading state
  const [engineRunning, setEngineRunning] = useState(false);

  // Global toast notification for dashboard actions
  const [toast, setToast] = useState(null);

  /* ── Handlers ─────────────────────────────────────────────────────── */

  const handleToggleLayer = useCallback((layerKey) => {
    setLayers((prev) => ({ ...prev, [layerKey]: !prev[layerKey] }));
  }, []);

  const handlePlotClick = useCallback((plotId) => {
    setSelectedPlotId(plotId);
  }, []);

  const handleRerunEngine = useCallback(() => {
    setEngineRunning(true);
    setTimeout(() => {
      setEngineRunning(false);
      setToast({
        message: 'Spatial Conflict Engine executed successfully — 8 active conflicts analyzed.',
        type: 'success',
      });
    }, 2000);
  }, []);

  /* ── Computed values ──────────────────────────────────────────────── */

  const kpis = computeKPIs();
  const repaired = topologyMetrics.find(
    (m) => m.metric_name === 'Self-Intersecting Polygons Repaired'
  )?.metric_value || 0;
  const snapped = topologyMetrics.find(
    (m) => m.metric_name === 'Building Edges Snapped to Boundaries'
  )?.metric_value || 0;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Top bar */}
      <TopBar onRerun={handleRerunEngine} isRunning={engineRunning} />

      {/* KPI and Topology rows */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-[1920px] mx-auto">
          <KpiRow kpis={kpis} />
          <TopologyRow
            plotsCount={plotsGeoJSON.features.length}
            repaired={repaired}
            snapped={snapped}
          />
        </div>
      </div>

      {/* Mobile sidebar toggle */}
      <div className="lg:hidden px-4 pt-3">
        <button
          onClick={() => setSidebarOpen(true)}
          className="flex items-center gap-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 px-3 py-2 rounded-md hover:bg-slate-50"
        >
          <Menu size={16} />
          Map Layers
        </button>
      </div>

      {/* Main content: Sidebar + Map/Panels */}
      <div className="flex-1 flex max-w-[1920px] mx-auto w-full">
        {/* Sidebar */}
        <LayerSidebar
          layers={layers}
          onToggle={handleToggleLayer}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        >
          <IngestionHub
            onIngestSuccess={() =>
              setToast({
                message: 'Spatial layers updated with freshly ingested features.',
                type: 'success',
              })
            }
          />
        </LayerSidebar>

        {/* Main panel */}
        <main className="flex-1 p-4 space-y-4 overflow-y-auto">
          {/* Map with tabs (2D / 3D / Temporal) */}
          <div className="h-[500px] lg:h-[580px]">
            <MapTabs
              mapProps={{
                layers,
                selectedPlotId,
                onPlotClick: handlePlotClick,
              }}
            />
          </div>

          {/* Plot Inspection Panel */}
          <PlotInspectionPanel selectedPlotId={selectedPlotId} />

          {/* Conflicts Table */}
          <ConflictsTable
            onRowClick={handlePlotClick}
            selectedPlotId={selectedPlotId}
          />
        </main>
      </div>

      {/* Global Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default Dashboard;
