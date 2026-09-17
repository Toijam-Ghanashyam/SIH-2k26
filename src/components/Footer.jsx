import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-navy-900 text-slate-400 py-10 border-t border-navy-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
        
        <div className="mb-4 md:mb-0 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start space-x-2 mb-2">
            <span className="text-white text-xl font-bold tracking-tight">GeoHarmonize <span className="text-accent-teal">AI</span></span>
            <span className="text-xs bg-navy-800 text-slate-300 px-2 py-0.5 rounded border border-navy-700">PS26013</span>
          </div>
          <p className="text-sm">Team <span className="text-white font-medium">The Intellect</span></p>
        </div>

        <div className="text-center md:text-right max-w-lg">
          <p className="text-xs leading-relaxed border border-navy-700 bg-navy-800/50 p-3 rounded text-slate-500">
            <strong>Disclaimer:</strong> This is a hackathon prototype proposal for Smart India Hackathon 2026. It is not a live government system, and no actual government data is exposed or represented.
          </p>
        </div>
        
      </div>
    </footer>
  );
};

export default Footer;
