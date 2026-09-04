import React from 'react';

const TechStack = () => {
  const technologies = [
    "AI/ML", "GeoAI", "GIS & Web-GIS", "Spatial Databases", "ETL Automation", 
    "Computer Vision", "Cloud Computing", "Spatial Analytics", "API Integration Frameworks"
  ];

  return (
    <section className="py-12 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-6">Powered By</h3>
        <div className="flex flex-wrap justify-center gap-3">
          {technologies.map((tech, index) => (
            <span key={index} className="inline-block px-4 py-2 bg-slate-50 border border-slate-200 text-slate-600 text-sm font-medium rounded-full shadow-sm hover:border-teal-300 hover:text-teal-700 transition-colors cursor-default">
              {tech}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStack;
