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
import SpatialEvidenceLedger from '../components/dashboard/SpatialEvidenceLedger';

import { computeKPIs, topologyMetrics, plotsGeoJSON } from '../data/mockData';

const Dashboard = () => {
  const [layers, setLayers] = useState({
    plots: true,
    buildings: true,
    conflicts: true,
    municipal: true,
    utilities: true,
    gt: true,
    gnss: true,
  });

  const [selectedPlotId, setSelectedPlotId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [engineRunning, setEngineRunning] = useState(false);
  const [toast, setToast] = useState(null);

  const handleToggleLayer = useCallback((layerKey) => {
    setLayers((prev) => ({
      ...prev,
      [layerKey]: !prev[layerKey],
    }));
  }, []);

  const handlePlotClick = useCallback((plotId) => {
    setSelectedPlotId(plotId);
  }, []);

  const handleRerunEngine = useCallback(() => {
    setEngineRunning(true);

    setTimeout(() => {
      setEngineRunning(false);

      setToast({
        message:
          'Spatial Conflict Engine executed successfully — 8 active conflicts analyzed.',
        type: 'success',
      });
    }, 2000);
  }, []);

  const kpis = computeKPIs();

  const repaired =
    topologyMetrics.find(
      (m) => m.metric_name === 'Self-Intersecting Polygons Repaired'
    )?.metric_value || 0;

  const snapped =
    topologyMetrics.find(
      (m) => m.metric_name === 'Building Edges Snapped to Boundaries'
    )?.metric_value || 0;

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col text-slate-800 dark:text-slate-100 transition-colors duration-200">

      <TopBar
        onRerun={handleRerunEngine}
        isRunning={engineRunning}
      />

      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-[1920px] mx-auto">
          <KpiRow kpis={kpis} />

          <TopologyRow
            plotsCount={plotsGeoJSON.features.length}
            repaired={repaired}
            snapped={snapped}
          />
        </div>
      </div>

      <div className="lg:hidden px-3 sm:px-4 pt-3">
        <button
          onClick={() => setSidebarOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          <Menu size={18} />
          Map Layers &amp; Ingestion
        </button>
      </div>

      <div className="flex-1 flex max-w-[1920px] mx-auto w-full">

        <LayerSidebar
          layers={layers}
          onToggle={handleToggleLayer}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        >
          <IngestionHub
            onIngestSuccess={() =>
              setToast({
                message:
                  'Spatial layers updated with freshly ingested features.',
                type: 'success',
              })
            }
          />
        </LayerSidebar>

        <main className="flex-1 p-2.5 sm:p-4 space-y-3 sm:space-y-4 overflow-y-auto w-full">

          <div className="h-[420px] sm:h-[500px] lg:h-[580px]">
            <MapTabs
              mapProps={{
                layers,
                selectedPlotId,
                onPlotClick: handlePlotClick,
              }}
            />
          </div>

          <PlotInspectionPanel
            selectedPlotId={selectedPlotId}
          />

          <ConflictsTable
            onRowClick={handlePlotClick}
            selectedPlotId={selectedPlotId}
          />

          {/* Spatial Evidence Ledger */}
          <SpatialEvidenceLedger />

        </main>
      </div>

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