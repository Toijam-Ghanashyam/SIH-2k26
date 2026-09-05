import React, { useState, useRef, useCallback, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import { plotsGeoJSON, buildingsGeoJSON, MAP_CENTER, MAP_ZOOM } from '../../data/mockData';

/**
 * TemporalCompareView — Side-by-side swipe comparison between two base maps.
 * Left  = standard OSM basemap ("Historical Baseline")
 * Right = satellite-style tiles ("New Drone Survey")
 *
 * Uses CSS clip-path over a single map instance for simplicity and performance.
 * Includes an "Overlay Vector Boundaries" checkbox.
 */

// Using two different tile styles to simulate historical vs. new data
const TILES_HISTORICAL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const TILES_SATELLITE = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';

const plotOverlayStyle = () => ({
  color: '#3b82f6',
  weight: 2,
  fillOpacity: 0,
});

const buildingOverlayStyle = () => ({
  color: '#166534',
  weight: 1,
  fillColor: '#22c55e',
  fillOpacity: 0.3,
});

const TemporalCompareView = () => {
  const [sliderPos, setSliderPos] = useState(50); // percentage 0-100
  const [showOverlay, setShowOverlay] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  const handleMove = useCallback((clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(pct);
  }, []);

  const handleMouseDown = useCallback(() => setIsDragging(true), []);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e) => handleMove(e.clientX);
    const handleTouchMove = (e) => handleMove(e.touches[0].clientX);
    const handleUp = () => setIsDragging(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleUp);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleUp);
    };
  }, [isDragging, handleMove]);

  return (
    <div className="w-full h-full min-h-[400px] flex flex-col rounded-b-lg overflow-hidden bg-slate-100 dark:bg-slate-950 transition-colors">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 px-3 py-2 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors">
        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
          Drag the slider to compare a historical baseline against the latest survey and spot changes.
        </p>
        <label className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 cursor-pointer flex-shrink-0 sm:ml-3" title="Note: This may reduce performance with large datasets.">
          <input
            type="checkbox"
            checked={showOverlay}
            onChange={(e) => setShowOverlay(e.target.checked)}
            className="rounded border-slate-300 dark:border-slate-600 dark:bg-slate-800 text-teal-600 focus:ring-teal-500 w-3.5 h-3.5"
          />
          <span>Overlay <span className="hidden sm:inline">Vector </span>Boundaries</span>
        </label>
      </div>

      {/* Map comparison area */}
      <div ref={containerRef} className="flex-1 relative select-none" style={{ cursor: isDragging ? 'col-resize' : 'default' }}>
        {/* RIGHT map (satellite) — full width, underneath */}
        <div className="absolute inset-0 z-0">
          <MapContainer
            center={MAP_CENTER}
            zoom={MAP_ZOOM}
            className="w-full h-full"
            style={{ height: '100%', width: '100%' }}
            scrollWheelZoom={true}
            zoomControl={false}
            dragging={!isDragging}
          >
            <TileLayer
              url={TILES_SATELLITE}
              attribution='&copy; Esri'
              maxZoom={19}
            />
            {showOverlay && (
              <>
                <GeoJSON data={plotsGeoJSON} style={plotOverlayStyle} />
                <GeoJSON data={buildingsGeoJSON} style={buildingOverlayStyle} />
              </>
            )}
          </MapContainer>
        </div>

        {/* LEFT map (historical) — clipped to slider position */}
        <div
          className="absolute inset-0 z-10"
          style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
        >
          <MapContainer
            center={MAP_CENTER}
            zoom={MAP_ZOOM}
            className="w-full h-full"
            style={{ height: '100%', width: '100%' }}
            scrollWheelZoom={false}
            zoomControl={false}
            dragging={false}
            attributionControl={false}
          >
            <TileLayer
              url={TILES_HISTORICAL}
              attribution='&copy; OSM'
              maxZoom={19}
            />
            {showOverlay && (
              <>
                <GeoJSON data={plotsGeoJSON} style={plotOverlayStyle} />
                <GeoJSON data={buildingsGeoJSON} style={buildingOverlayStyle} />
              </>
            )}
          </MapContainer>
        </div>

        {/* Slider handle */}
        <div
          className="absolute top-0 bottom-0 z-20 flex items-center"
          style={{ left: `${sliderPos}%`, transform: 'translateX(-50%)' }}
        >
          {/* Vertical line */}
          <div className="w-0.5 h-full bg-white shadow-lg" />
          {/* Drag handle */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-xl border-2 border-teal-500 flex items-center justify-center cursor-col-resize hover:scale-110 transition-transform"
            onMouseDown={handleMouseDown}
            onTouchStart={handleMouseDown}
          >
            <div className="flex gap-0.5">
              <div className="w-0.5 h-3 bg-teal-500 rounded-full" />
              <div className="w-0.5 h-3 bg-teal-500 rounded-full" />
            </div>
          </div>
        </div>

        {/* Labels */}
        <div className="absolute top-3 left-3 z-20 bg-navy-900/80 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-1 rounded">
          Historical Baseline
        </div>
        <div className="absolute top-3 right-3 z-20 bg-navy-900/80 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-1 rounded">
          New Drone Survey
        </div>
      </div>
    </div>
  );
};

export default TemporalCompareView;
