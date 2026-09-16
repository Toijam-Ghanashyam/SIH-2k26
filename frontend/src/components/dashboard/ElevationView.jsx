import React, { useMemo } from 'react';
import { DeckGL } from '@deck.gl/react';
import { GeoJsonLayer } from '@deck.gl/layers';
import { buildingsGeoJSON, MAP_CENTER } from '../../data/mockData';

/**
 * ElevationView — 3D extruded building footprints using deck.gl.
 * Mirrors the pydeck 3D view in app.py.
 *
 * - Extruded polygons with elevation_m * 2
 * - Tilted camera (pitch ~55°, bearing ~-25°)
 * - Hover tooltip: Structure ID + Height
 * - Green fill, white wireframe
 */

const INITIAL_VIEW_STATE = {
  longitude: MAP_CENTER[1],
  latitude: MAP_CENTER[0],
  zoom: 15.5,
  pitch: 55,
  bearing: -25,
  minZoom: 13,
  maxZoom: 19,
};

const ElevationView = () => {
  // Check if buildings have elevation data
  const hasElevation = buildingsGeoJSON.features.some(
    (f) => f.properties.elevation_m != null
  );

  if (!hasElevation) {
    return (
      <div className="w-full h-full min-h-[400px] flex items-center justify-center bg-slate-100 rounded-b-lg">
        <p className="text-sm text-slate-400">No 3D elevation data available to render.</p>
      </div>
    );
  }

  const layers = [
    new GeoJsonLayer({
      id: 'buildings-3d',
      data: buildingsGeoJSON,
      extruded: true,
      wireframe: true,
      filled: true,
      getElevation: (f) => (f.properties.elevation_m || 5) * 2,
      getFillColor: [34, 197, 94, 180], // green-500 with alpha
      getLineColor: [255, 255, 255, 200], // white wireframe
      lineWidthMinPixels: 1,
      pickable: true,
      autoHighlight: true,
      highlightColor: [13, 148, 136, 200], // teal highlight
    }),
  ];

  return (
    <div className="w-full h-full min-h-[400px] relative rounded-b-lg overflow-hidden bg-slate-900">
      {/* Caption */}
      <div className="absolute top-2.5 sm:top-3 left-2.5 sm:left-3 z-10 bg-navy-900/80 backdrop-blur-sm rounded-md px-2.5 sm:px-3 py-1.5 sm:py-2 border border-navy-700 max-w-[85vw] sm:max-w-none">
        <p className="text-[10px] sm:text-[11px] text-slate-300 leading-tight">
          Interactive 3D heights — drag to rotate, scroll/pinch to zoom.
        </p>
      </div>

      <DeckGL
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
        layers={layers}
        getTooltip={({ object }) => {
          if (!object) return null;
          return {
            html: `
              <div style="padding: 6px 10px; font-size: 12px; font-family: 'IBM Plex Sans', sans-serif;">
                <strong>${object.properties.building_id}</strong><br/>
                Estimated Height: ${object.properties.elevation_m}m
              </div>
            `,
            style: {
              backgroundColor: '#0f2145',
              color: '#fff',
              borderRadius: '6px',
              border: '1px solid #142d5e',
            },
          };
        }}
        style={{ width: '100%', height: '100%' }}
      >
        {/* Dark base map for better 3D contrast */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, #0a1628 0%, #142d5e 100%)',
            zIndex: -1,
          }}
        />
      </DeckGL>
    </div>
  );
};

export default ElevationView;
