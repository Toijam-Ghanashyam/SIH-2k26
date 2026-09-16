import React from 'react';

const TechStack = () => {
  const technologies = [
    "AI/ML", "GeoAI", "GIS & Web-GIS", "Spatial Databases", "ETL Automation", 
    "Computer Vision", "Cloud Computing", "Spatial Analytics", "API Integration Frameworks"
  ];

  return (
    <section className="py-12 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h3 className="text-sm font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-6">Powered By</h3>
        <div className="flex flex-wrap justify-center gap-3">
          {technologies.map((tech, index) => (
            <span key={index} className="inline-block px-4 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-sm font-medium rounded-full shadow-sm hover:border-teal-300 dark:hover:border-teal-500 hover:text-teal-700 dark:hover:text-teal-300 transition-colors cursor-default">
              {tech}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStack;
