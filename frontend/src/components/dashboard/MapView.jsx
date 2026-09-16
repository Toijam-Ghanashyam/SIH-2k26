import React, { useRef, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap, CircleMarker, Popup } from 'react-leaflet';
import { useTheme } from '../../context/ThemeContext';
import {
  plotsGeoJSON,
  buildingsGeoJSON,
  conflictsGeoJSON,
  municipalGeoJSON,
  utilitiesGeoJSON,
  gtGeoJSON,
  gnssGeoJSON,
  MAP_CENTER,
  MAP_ZOOM,
} from '../../data/mockData';

/**
 * MapView — Interactive Leaflet map with 7 toggleable GeoJSON layers.
 * Mirrors the Folium map in app.py with identical color conventions.
 *
 * Props:
 *  - layers: object with boolean toggles for each layer
 *  - selectedPlotId: currently selected plot ID (highlight)
 *  - onPlotClick(plotId): callback when a cadastral plot is clicked
 */

/* ── Layer style helpers ────────────────────────────────────────────── */

const plotStyle = (feature, selectedPlotId) => ({
  color: '#3b82f6',
  weight: feature.properties.plot_id === selectedPlotId ? 3 : 1.5,
  fillColor: feature.properties.plot_id === selectedPlotId ? '#60a5fa' : '#3b82f680',
  fillOpacity: feature.properties.plot_id === selectedPlotId ? 0.5 : 0.25,
});

const buildingStyle = () => ({
  color: '#166534',
  weight: 1.5,
  fillColor: '#22c55e',
  fillOpacity: 0.4,
});

const conflictStyle = () => ({
  color: '#ef4444',
  weight: 2,
  fillColor: '#ef4444',
  fillOpacity: 0.35,
});

const municipalStyle = () => ({
  color: '#a855f7',
  weight: 2,
  dashArray: '6 4',
  fillOpacity: 0,
});

const utilityStyle = () => ({
  color: '#06b6d4',
  weight: 2.5,
  fillOpacity: 0,
});

/* ── Legend sub-component ──────────────────────────────────────────── */

const LEGEND_ITEMS = [
  { label: 'Cadastral Plots', color: '#3b82f6', type: 'fill' },
  { label: 'AI Buildings', color: '#22c55e', type: 'fill' },
  { label: 'Spatial Conflicts', color: '#ef4444', type: 'fill' },
  { label: 'Municipal Zoning', color: '#a855f7', type: 'dash' },
  { label: 'Utility Networks', color: '#06b6d4', type: 'line' },
  { label: 'Ground Truth', color: '#f97316', type: 'circle' },
  { label: 'GNSS/CORS', color: '#3b82f6', type: 'circle' },
];

const Legend = () => {
  const [mobileExpanded, setMobileExpanded] = React.useState(false);

  return (
    <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 z-[1000] flex flex-col items-end">
      {/* Mobile toggle button */}
      <button
        onClick={() => setMobileExpanded((prev) => !prev)}
        className="sm:hidden flex items-center gap-1.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm px-2.5 py-1.5 rounded-md shadow-md border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors"
      >
        <span>Legend</span>
        <span className="text-[10px] text-slate-400">{mobileExpanded ? '▲' : '▼'}</span>
      </button>

      {/* Legend content (always visible on sm+, toggleable on mobile) */}
      <div
        className={`${
          mobileExpanded ? 'block mt-1.5' : 'hidden'
        } sm:block bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 p-2.5 sm:p-3 text-left transition-colors`}
      >
        <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Layer Legend</p>
        <div className="space-y-1.5">
          {LEGEND_ITEMS.map((item) => (
            <div key={item.label} className="flex items-center gap-2 text-[11px] sm:text-xs text-slate-600 dark:text-slate-300">
              {item.type === 'fill' && (
                <span className="w-3.5 sm:w-4 h-2.5 sm:h-3 rounded-sm border shrink-0" style={{ backgroundColor: item.color + '60', borderColor: item.color }} />
              )}
              {item.type === 'dash' && (
                <span className="w-3.5 sm:w-4 h-0 border-t-2 border-dashed shrink-0" style={{ borderColor: item.color }} />
              )}
              {item.type === 'line' && (
                <span className="w-3.5 sm:w-4 h-0 border-t-2 shrink-0" style={{ borderColor: item.color }} />
              )}
              {item.type === 'circle' && (
                <span className="w-2.5 sm:w-3 h-2.5 sm:h-3 rounded-full border-2 shrink-0" style={{ borderColor: item.color, backgroundColor: item.color + '40' }} />
              )}
              <span className="truncate">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ── Main MapView component ────────────────────────────────────────── */

const MapView = ({ layers, selectedPlotId, onPlotClick }) => {
  const { isDark } = useTheme();

  /* React-leaflet requires unique keys when GeoJSON data/style changes,
     so we use the selectedPlotId as part of the key for the plots layer
     to force a re-render when selection changes. */

  const onEachPlot = (feature, layer) => {
    layer.on({
      click: () => onPlotClick(feature.properties.plot_id),
    });
    layer.bindTooltip(feature.properties.plot_id, {
      direction: 'top',
      className: 'leaflet-tooltip-custom',
    });
  };

  const onEachConflict = (feature, layer) => {
    layer.bindTooltip(
      `${feature.properties.conflict_type} (IoU: ${feature.properties.iou}%)`,
      { direction: 'top' }
    );
  };

  const onEachMunicipal = (feature, layer) => {
    layer.bindTooltip(feature.properties.zone_name, { direction: 'center' });
  };

  const onEachUtility = (feature, layer) => {
    layer.bindTooltip(feature.properties.type, { direction: 'top' });
  };

  return (
    <div className="map-2d-view relative w-full h-full min-h-[400px] rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
      <MapContainer
        center={MAP_CENTER}
        zoom={MAP_ZOOM}
        className="w-full h-full z-0"
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        {/* Base tile layer — styled with CSS dark filter when dark mode is enabled */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Cadastral Plots — blue */}
        {layers.plots && (
          <GeoJSON
            key={`plots-${selectedPlotId}`}
            data={plotsGeoJSON}
            style={(feature) => plotStyle(feature, selectedPlotId)}
            onEachFeature={onEachPlot}
          />
        )}

        {/* AI Buildings — green */}
        {layers.buildings && (
          <GeoJSON
            key="buildings"
            data={buildingsGeoJSON}
            style={buildingStyle}
          />
        )}

        {/* Municipal Zoning — purple dashed */}
        {layers.municipal && (
          <GeoJSON
            key="municipal"
            data={municipalGeoJSON}
            style={municipalStyle}
            onEachFeature={onEachMunicipal}
          />
        )}

        {/* Utility Networks — cyan lines */}
        {layers.utilities && (
          <GeoJSON
            key="utilities"
            data={utilitiesGeoJSON}
            style={utilityStyle}
            onEachFeature={onEachUtility}
          />
        )}

        {/* Ground Truthing Points — orange circles */}
        {layers.gt &&
          gtGeoJSON.features.map((f) => (
            <CircleMarker
              key={f.properties.gt_id}
              center={[f.geometry.coordinates[1], f.geometry.coordinates[0]]}
              radius={6}
              pathOptions={{ color: '#f97316', fillColor: '#f97316', fillOpacity: 0.6, weight: 2 }}
            >
              <Popup>
                <div className="text-xs">
                  <p className="font-semibold">{f.properties.gt_id}</p>
                  <p>Surveyor: {f.properties.surveyor}</p>
                  <p>Accuracy: ±{f.properties.accuracy_m}m</p>
                </div>
              </Popup>
            </CircleMarker>
          ))}

        {/* GNSS/CORS Stations — blue circles, slightly larger */}
        {layers.gnss &&
          gnssGeoJSON.features.map((f) => (
            <CircleMarker
              key={f.properties.station_id}
              center={[f.geometry.coordinates[1], f.geometry.coordinates[0]]}
              radius={9}
              pathOptions={{ color: '#2563eb', fillColor: '#3b82f6', fillOpacity: 0.5, weight: 2.5 }}
            >
              <Popup>
                <div className="text-xs">
                  <p className="font-semibold">{f.properties.name}</p>
                  <p>Status: {f.properties.status}</p>
                  <p>Accuracy: ±{f.properties.accuracy_cm}cm</p>
                </div>
              </Popup>
            </CircleMarker>
          ))}

        {/* Spatial Conflicts — red (drawn on top of everything) */}
        {layers.conflicts && (
          <GeoJSON
            key="conflicts"
            data={conflictsGeoJSON}
            style={conflictStyle}
            onEachFeature={onEachConflict}
          />
        )}
      </MapContainer>

      {/* Legend overlay */}
      <Legend />
    </div>
  );
};

export default MapView;
