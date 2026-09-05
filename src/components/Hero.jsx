import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Layers, MapPin, Play } from 'lucide-react';

const Hero = () => {
  return (
    <section className="bg-navy-900 text-white py-16 md:py-24 relative overflow-hidden">
      {/* Background abstract element */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-navy-800 opacity-50 blur-3xl mix-blend-screen pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div className="space-y-6 sm:space-y-8">
            <div className="inline-flex items-center space-x-2 bg-navy-800 border border-navy-700 px-3 py-1 rounded-full text-xs sm:text-sm font-medium text-slate-300">
              <span className="w-2 h-2 rounded-full bg-accent-teal animate-pulse"></span>
              <span>AI-Enabled Geospatial Integration</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Automated Harmonization of Multi-source Urban Land Records
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl text-slate-400 max-w-2xl leading-relaxed">
              Replacing fragmented manual workflows with intelligent spatial matching. Built to ingest, validate, and synchronize NAKSHA survey outputs and municipal datasets into a single source of truth.
            </p>
            
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <Link to="/dashboard" className="btn-primary w-full sm:w-auto flex justify-center items-center gap-2 group">
                <span>Launch Live Prototype</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <a href="#architecture" className="btn-secondary w-full sm:w-auto flex justify-center items-center">
                Explore Architecture
              </a>
            </div>
          </div>

          <div className="relative flex justify-center items-center h-full py-4 sm:py-0 overflow-hidden">
            {/* Abstract Layered Map Illustration */}
            <div className="relative w-full max-w-[280px] sm:max-w-md aspect-square mx-auto scale-90 sm:scale-100">
              {/* Layer 1: Base Map */}
              <div className="absolute inset-0 bg-navy-800 rounded-xl border border-navy-700 shadow-2xl transform rotate-x-12 rotate-y-[-15deg] rotate-z-[5deg] flex items-center justify-center overflow-hidden transition-transform duration-1000 hover:-translate-y-2">
                <div className="w-full h-full opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
              </div>
              
              {/* Layer 2: Drone/GNSS Data */}
              <div className="absolute inset-0 bg-navy-700/80 rounded-xl border border-teal-500/30 shadow-xl transform rotate-x-12 rotate-y-[-15deg] rotate-z-[5deg] -translate-y-6 sm:-translate-y-8 translate-x-3 sm:translate-x-4 flex items-center justify-center transition-transform duration-1000 hover:-translate-y-12">
                 <div className="absolute inset-4 border border-teal-500/50 rounded flex items-center justify-center">
                    <MapPin className="text-teal-400" size={40} />
                 </div>
              </div>

              {/* Layer 3: Cadastral */}
              <div className="absolute inset-0 bg-navy-800/90 rounded-xl border border-amber-500/30 shadow-xl transform rotate-x-12 rotate-y-[-15deg] rotate-z-[5deg] -translate-y-12 sm:-translate-y-16 translate-x-6 sm:translate-x-8 flex items-center justify-center transition-transform duration-1000 hover:-translate-y-24">
                <div className="grid grid-cols-2 gap-2 p-4 w-full h-full opacity-60">
                   <div className="border border-amber-500/50 rounded-sm bg-amber-500/10"></div>
                   <div className="border border-amber-500/50 rounded-sm bg-amber-500/10"></div>
                   <div className="border border-amber-500/50 rounded-sm bg-amber-500/10 col-span-2"></div>
                </div>
                <div className="absolute bg-navy-900 rounded-full p-2.5 sm:p-3 border border-navy-600 shadow-lg top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                   <Layers className="text-white" size={28} />
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default Hero;
