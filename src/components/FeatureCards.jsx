import React from 'react';
import { Activity, Network, Scale, Users } from 'lucide-react';

const FeatureCards = () => {
  const features = [
    {
      icon: <Scale className="text-teal-400" size={28} />,
      title: "Intelligent Source Trust Engine",
      today: "Equal weight given to all conflicting sources.",
      adds: "Dynamic trust scoring based on positional accuracy, freshness, and agreement."
    },
    {
      icon: <Activity className="text-teal-400" size={28} />,
      title: "Explainable Conflict Resolution",
      today: "Black-box outputs with no reasoning.",
      adds: "Transparent reasoning showing which sources disagree, how much, and why."
    },
    {
      icon: <Users className="text-teal-400" size={28} />,
      title: "Smart Conflict Triage",
      today: "All conflicts require manual human review.",
      adds: "Confidence-based routing (auto-approve, review queue, mandatory verification)."
    },
    {
      icon: <Network className="text-teal-400" size={28} />,
      title: "Conflict Root-Cause Clustering",
      today: "Conflicts are handled one-by-one.",
      adds: "Groups similar conflicts to surface shared causes (e.g., coordinate shift)."
    }
  ];

  return (
    <section id="features" className="py-20 bg-navy-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-4">Core Capabilities</h2>
          <p className="text-lg text-slate-400">
            Moving beyond simple map visualization to intelligent, explainable geospatial resolution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="bg-navy-800 border border-navy-700 p-8 rounded-xl hover:border-teal-500/50 transition-colors duration-300">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-lg bg-navy-900 flex items-center justify-center border border-navy-700 mr-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <span className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1 block">What today misses</span>
                  <p className="text-slate-300 text-sm bg-navy-900/50 p-3 rounded border border-navy-700/50">
                    {feature.today}
                  </p>
                </div>
                <div>
                  <span className="text-xs uppercase tracking-wider text-teal-500 font-semibold mb-1 block">What this adds</span>
                  <p className="text-slate-100 text-sm bg-teal-900/20 p-3 rounded border border-teal-800/30">
                    {feature.adds}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureCards;
