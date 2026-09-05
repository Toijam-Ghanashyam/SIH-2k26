import React from 'react';
import { X, Layers, Map } from 'lucide-react';

/**
 * LayerSidebar — Sidebar with layer toggle checkboxes + color swatches.
 * Mirrors app.py lines 148-158. Collapses into a drawer on mobile (<1024px).
 *
 * Props:
 *  - layers: object with boolean toggles for each layer
 *  - onToggle(layerName): callback to flip a layer's visibility
 *  - isOpen: sidebar drawer state (mobile)
 *  - onClose: close drawer (mobile)
 *  - children: slot for IngestionHub (Phase 2)
 */

const LAYER_GROUPS = [
  {
    title: 'Map Layers',
    items: [
      { key: 'plots', label: 'Cadastral Plots', color: '#3b82f6' },
      { key: 'buildings', label: 'AI Buildings', color: '#22c55e' },
      { key: 'conflicts', label: 'Spatial Conflicts', color: '#ef4444' },
    ],
  },
  {
    title: 'Multi-Dataset Integration',
    items: [
      { key: 'municipal', label: 'Municipal Zoning', color: '#a855f7' },
      { key: 'utilities', label: 'Utility Networks', color: '#06b6d4' },
      { key: 'gt', label: 'Ground Truthing Points', color: '#f97316' },
      { key: 'gnss', label: 'GNSS/CORS Stations', color: '#3b82f6' },
    ],
  },
];

const LayerSidebar = ({ layers, onToggle, isOpen, onClose, children }) => {
  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Header — visible on mobile drawer only */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200 lg:hidden">
        <div className="flex items-center gap-2">
          <Layers size={18} className="text-teal-600" />
          <span className="font-semibold text-slate-700">Layers & Ingestion</span>
        </div>
        <button onClick={onClose} className="p-2 -mr-1 rounded-md hover:bg-slate-100 text-slate-500 hover:text-slate-700" aria-label="Close sidebar">
          <X size={20} />
        </button>
      </div>

      {/* Layer groups */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {LAYER_GROUPS.map((group) => (
          <div key={group.title}>
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Map size={12} />
              {group.title}
            </h3>
            <div className="space-y-1.5">
              {group.items.map((item) => (
                <label
                  key={item.key}
                  className="flex items-center gap-2.5 px-2 py-1.5 rounded-md cursor-pointer hover:bg-slate-100 transition-colors text-sm text-slate-700"
                >
                  <input
                    type="checkbox"
                    checked={layers[item.key]}
                    onChange={() => onToggle(item.key)}
                    className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 w-4 h-4"
                  />
                  {/* Color swatch */}
                  <span
                    className="w-3 h-3 rounded-sm border border-slate-300 flex-shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  {item.label}
                </label>
              ))}
            </div>
          </div>
        ))}

        {/* Divider + children slot (for IngestionHub in Phase 2) */}
        {children && (
          <>
            <hr className="border-slate-200" />
            {children}
          </>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar — always visible */}
      <aside className="hidden lg:block w-64 flex-shrink-0 bg-white border-r border-slate-200 overflow-hidden">
        {sidebarContent}
      </aside>

      {/* Mobile drawer overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />
          {/* Drawer panel */}
          <aside className="absolute left-0 top-0 h-full w-[82vw] sm:w-72 max-w-xs bg-white shadow-xl animate-slide-in">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
};

export default LayerSidebar;
