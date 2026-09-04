import React from 'react';
import { TrendingUp, Building2, AlertTriangle, Target } from 'lucide-react';

/**
 * KpiRow — Executive KPI Summary (4 cards).
 * Mirrors app.py lines 120-126: Total Area, Buildings, Encroachments (alert), Accuracy.
 */
const KpiRow = ({ kpis }) => {
  const cards = [
    {
      label: 'Total Area Integrated',
      value: `${kpis.totalAreaHectares} ha`,
      icon: TrendingUp,
      color: 'text-teal-400',
      bgColor: 'bg-teal-500/10',
      borderColor: 'border-teal-500/30',
    },
    {
      label: 'Total Buildings Extracted',
      value: kpis.totalBuildings.toLocaleString(),
      icon: Building2,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30',
    },
    {
      label: 'Encroachments Flagged',
      value: kpis.encroachments.toLocaleString(),
      icon: AlertTriangle,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/30',
      isAlert: true,
    },
    {
      label: 'Spatial Accuracy Rate',
      value: `${kpis.accuracyRate}%`,
      icon: Target,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/30',
    },
  ];

  return (
    <section className="px-4 sm:px-6 py-4">
      <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
        📊 Executive KPI Summary
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className={`rounded-lg border p-4 transition-all duration-200 hover:shadow-lg ${
                card.isAlert
                  ? 'bg-amber-500/5 border-amber-500/40 ring-1 ring-amber-500/20'
                  : `bg-white ${card.borderColor}`
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                  {card.label}
                </span>
                <div className={`p-1.5 rounded-md ${card.bgColor}`}>
                  <Icon size={16} className={card.color} />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-800">{card.value}</p>
              {card.isAlert && (
                <span className="inline-block mt-2 text-xs font-medium text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">
                  ⚠ Requires Review
                </span>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default KpiRow;
