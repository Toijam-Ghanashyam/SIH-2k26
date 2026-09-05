import React from 'react';
import { ShieldCheck } from 'lucide-react';

const DataSourceEcosystem = () => {
  const sources = [
    { name: "Drone Imagery", naksha: true },
    { name: "Orthorectified Imagery (ORI)", naksha: true },
    { name: "DSM/DTM Datasets", naksha: true },
    { name: "Ground Truthing (GT)", naksha: true },
    { name: "GNSS/CORS Survey Data", naksha: true },
    { name: "Existing Cadastral Maps", naksha: false },
    { name: "Revenue Records", naksha: false },
    { name: "Municipal GIS Layers", naksha: false },
    { name: "Utility Network Data", naksha: false },
    { name: "Building Footprints", naksha: false },
  ];

  return (
    <section id="data-sources" className="py-20 bg-slate-50 dark:bg-slate-950 border-t border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-navy-900 dark:text-white mb-4">Multi-Source Data Ecosystem</h2>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            A centralized integration engine built to automatically ingest and harmonize diverse geospatial inputs.
          </p>
        </div>

        <div className="relative">
          {/* Mobile Central Hub (< lg) */}
          <div className="lg:hidden mb-6 bg-navy-900 dark:bg-slate-900 text-white p-5 rounded-xl shadow-lg border-2 border-teal-500 text-center max-w-sm mx-auto">
            <ShieldCheck className="mx-auto mb-2 text-teal-400" size={36} />
            <h3 className="font-bold text-base text-white">AI Integration Engine</h3>
            <p className="text-xs text-slate-300 mt-1">Spatial Matching & Conflict Detection</p>
          </div>

          {/* Central Hub (Desktop only) */}
          <div className="hidden lg:flex absolute inset-0 items-center justify-center pointer-events-none z-10">
             <div className="bg-navy-900 dark:bg-slate-900 text-white p-6 rounded-xl shadow-2xl border-2 border-teal-500 w-64 text-center">
                <ShieldCheck className="mx-auto mb-2 text-teal-400" size={40} />
                <h3 className="font-bold text-lg">AI Integration Engine</h3>
                <p className="text-xs text-slate-300 mt-2">Spatial Matching & Conflict Detection</p>
             </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-y-24 relative z-0">
            {sources.map((source, index) => (
              <div 
                key={index} 
                className={`p-3 sm:p-4 rounded border transition-colors ${
                  source.naksha
                    ? 'bg-white dark:bg-slate-900 border-teal-200 dark:border-teal-500/40 shadow-sm'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                } flex flex-col justify-center text-center h-24 sm:h-28 relative`}
              >
                {source.naksha && (
                  <div className="absolute -top-2.5 sm:-top-3 left-1/2 transform -translate-x-1/2 bg-teal-100 dark:bg-teal-950/80 text-teal-800 dark:text-teal-300 text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded uppercase tracking-wider border border-teal-200 dark:border-teal-800 whitespace-nowrap">
                    NAKSHA Source
                  </div>
                )}
                <span className="font-medium text-navy-800 dark:text-slate-200 text-xs sm:text-sm leading-snug">{source.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 text-center">
          <p className="inline-block bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-6 py-3 rounded-full text-slate-700 dark:text-slate-300 shadow-sm text-sm font-medium">
            <span className="text-teal-600 dark:text-teal-400 font-bold mr-2">✓</span>
            Built to automatically ingest and harmonize NAKSHA-generated survey outputs
          </p>
        </div>
      </div>
    </section>
  );
};

export default DataSourceEcosystem;
