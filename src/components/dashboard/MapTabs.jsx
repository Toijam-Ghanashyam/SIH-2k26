import React, { useState } from 'react';
import { Map, Cuboid, Clock } from 'lucide-react';

/**
 * MapTabs — 3-tab wrapper around the existing MapView and two new views.
 * Tab 1: "2D GIS Integration View" (existing MapView, unchanged)
 * Tab 2: "3D Elevation Inspector (DSM)"
 * Tab 3: "Temporal Change Detection"
 *
 * Props:
 *  - mapProps: passed through to MapView (layers, selectedPlotId, onPlotClick)
 */

import MapView from './MapView';
import ElevationView from './ElevationView';
import TemporalCompareView from './TemporalCompareView';

const TABS = [
  { id: '2d', label: '2D GIS Integration View', icon: Map },
  { id: '3d', label: '3D Elevation Inspector (DSM)', icon: Cuboid },
  { id: 'temporal', label: 'Temporal Change Detection', icon: Clock },
];

const MapTabs = ({ mapProps }) => {
  const [activeTab, setActiveTab] = useState('2d');

  return (
    <div className="flex flex-col h-full">
      {/* Tab bar */}
      <div className="flex border-b border-slate-200 bg-white rounded-t-lg overflow-x-auto">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium whitespace-nowrap border-b-2 transition-all ${
                isActive
                  ? 'border-teal-500 text-teal-700 bg-teal-50/50'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Icon size={14} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div className="flex-1 min-h-[400px]">
        {activeTab === '2d' && <MapView {...mapProps} />}
        {activeTab === '3d' && <ElevationView />}
        {activeTab === 'temporal' && <TemporalCompareView />}
      </div>
    </div>
  );
};

export default MapTabs;
