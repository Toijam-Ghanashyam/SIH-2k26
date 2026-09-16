import React from 'react';
import { ArrowDown, ArrowRight, CheckCircle, Database, Eye, FileSearch, HelpCircle, Shuffle } from 'lucide-react';

const Pipeline = () => {
  const steps = [
    { id: 1, title: "Ingest", icon: <Database size={24} />, desc: "Multi-source import" },
    { id: 2, title: "AI Spatial Matching", icon: <Shuffle size={24} />, desc: "Geometry alignment" },
    { id: 3, title: "Conflict Detection", icon: <FileSearch size={24} />, desc: "Identify mismatches" },
    { id: 4, title: "Confidence Scoring", icon: <HelpCircle size={24} />, desc: "Rate reliability" },
    { id: 5, title: "Human Review", icon: <Eye size={24} />, desc: "Verify low confidence" },
    { id: 6, title: "Harmonized Record", icon: <CheckCircle size={24} />, desc: "Final cadastral output" },
  ];

  return (
    <section id="architecture" className="py-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-navy-900 dark:text-white mb-4">How It Works</h2>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            A streamlined, automated pipeline from raw disconnected data to a finalized, verified urban land record.
          </p>
        </div>

        {/* Desktop Pipeline */}
        <div className="hidden lg:flex justify-between items-center relative">
          <div className="absolute left-10 right-10 top-1/2 transform -translate-y-1/2 h-1 bg-slate-200 dark:bg-slate-700 -z-10"></div>
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center w-32 relative z-0 bg-white dark:bg-slate-900 pt-4 transition-colors">
                <div className="w-16 h-16 rounded-full bg-navy-800 dark:bg-slate-800 text-white flex items-center justify-center mb-4 shadow-lg border-4 border-white dark:border-slate-900 relative z-10">
                  {step.icon}
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-accent-teal flex items-center justify-center text-xs font-bold border-2 border-white dark:border-slate-900">
                    {step.id}
                  </div>
                </div>
                <h3 className="font-semibold text-navy-900 dark:text-slate-100 text-sm text-center mb-1">{step.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 text-center leading-tight">{step.desc}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="text-slate-300 dark:text-slate-600">
                  <ArrowRight size={24} />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Mobile Pipeline */}
        <div className="lg:hidden flex flex-col items-center space-y-4">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <div className="flex items-center w-full max-w-sm bg-slate-50 dark:bg-slate-800/80 p-4 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors">
                <div className="w-12 h-12 rounded-full bg-navy-800 dark:bg-slate-700 text-white flex items-center justify-center mr-4 shrink-0 relative">
                  {step.icon}
                   <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-accent-teal flex items-center justify-center text-[10px] font-bold border-2 border-white dark:border-slate-800">
                    {step.id}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-navy-900 dark:text-slate-100">{step.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{step.desc}</p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className="text-slate-300 dark:text-slate-600">
                  <ArrowDown size={24} />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pipeline;
