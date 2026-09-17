import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ShieldCheck,
  Activity,
  Sparkles,
} from 'lucide-react';

/* ── 3 Slide Background Images with Real Urban & National Land Imagery ── */
const SLIDES = [
  {
    image: '/INDIA.jpg',
    badge: 'National Macro-Scale GIS',
    title: 'Topographic Satellite & Geodetic Framework',
    description:
      'Harmonizing multi-resolution satellite feeds and Survey of India CORS-GNSS baseline vectors across the subcontinent.',
  },
  {
    image: '/india_buildings.jpg',
    badge: 'High-Density Cadastral Abadi',
    title: 'NAKSHA Drone Survey & Parcel Harmonization',
    description:
      'Resolving fragmented rural-urban fringe settlements and reconciling overlapping revenue boundaries with sub-meter spatial accuracy.',
  },
  {
    image: '/india_roadxbuilds.jpg',
    badge: 'Urban Infrastructure Corridor',
    title: 'Municipal Masterplans & Right-of-Way Matching',
    description:
      'Automated conflict detection between municipal zoning, transport rights-of-way, utility networks, and private land titles.',
  },
];

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Automatic slide crossfade every 2 seconds (2000ms) - starts immediately without hover delay
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section
      className="relative w-full h-[calc(100vh-100px)] min-h-[600px] max-h-[960px] flex items-center overflow-hidden bg-slate-950 text-white select-none"
      aria-label="National Land Records Harmonization Hero"
    >
      {/* ── 1. Full-Width Background Images with Smooth 2s Crossfade ── */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        {SLIDES.map((slide, index) => {
          const isActive = index === currentSlide;
          return (
            <div
              key={slide.image}
              className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className={`w-full h-full object-cover object-center transform transition-transform duration-[4000ms] ease-out ${
                  isActive ? 'scale-105' : 'scale-100'
                }`}
                loading="eager"
              />
            </div>
          );
        })}

        {/* ── 2. Subtle Dark Overlays for High Contrast & Text Legibility ── */}
        <div className="absolute inset-0 z-20 bg-gradient-to-r from-slate-950/95 via-slate-950/80 to-slate-950/45 pointer-events-none" />
        <div className="absolute inset-0 z-20 bg-radial from-transparent via-slate-950/40 to-slate-950/75 pointer-events-none" />
        <div className="absolute bottom-0 inset-x-0 h-28 z-20 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent pointer-events-none" />
      </div>

      {/* ── 3. Main Hero Content Container (Telemetry card removed as requested) ── */}
      <div className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12 md:py-16">
        <div className="max-w-3xl space-y-6">

          {/* DoLR Mandate Pill */}
          <div className="inline-flex items-center gap-2.5 bg-slate-900/90 border border-slate-700/80 px-3.5 py-1.5 backdrop-blur-md shadow-lg">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              Department of Land Resources · DoLR (PS26013)
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-extrabold leading-[1.15] tracking-tight text-white drop-shadow-sm">
            Automated Harmonization of{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-teal-300 to-emerald-400">
              Multi-source Urban Land Records
            </span>
          </h1>

          {/* Descriptive Narrative */}
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed drop-shadow-sm font-normal">
            Replacing fragmented manual workflows with intelligent spatial matching. Built to
            ingest, validate, and synchronize NAKSHA survey outputs, satellite orthomosaics, and
            municipal GIS registers into a verifiable single source of truth.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
            <Link
              to="/dashboard"
              className="btn-primary flex justify-center items-center gap-2 px-6 py-3 text-sm font-bold shadow-lg shadow-teal-900/30 group"
            >
              <span>Launch Live Prototype</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#architecture"
              className="btn-secondary flex justify-center items-center gap-2 px-6 py-3 text-sm font-bold bg-slate-900/60 hover:bg-slate-800/80 border-slate-600 backdrop-blur-sm"
            >
              <span>Explore Architecture</span>
            </a>
          </div>

          {/* Micro Feature Highlights */}
          <div className="pt-2 flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-slate-300">
            <div className="flex items-center gap-1.5">
              <ShieldCheck size={16} className="text-emerald-400 shrink-0" />
              <span>Survey of India CORS Compliant</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Activity size={16} className="text-blue-400 shrink-0" />
              <span>Sub-Centimeter Orthorectification</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Sparkles size={16} className="text-amber-400 shrink-0" />
              <span>AI Encroachment Engine</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
