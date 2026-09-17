import React from 'react';
import { Link } from 'react-router-dom';
import { RefreshCw, ShieldCheck, ExternalLink, HelpCircle } from 'lucide-react';
import { AshokaLionCapital, AshokaChakra, G20Logo, DigitalIndiaLogo } from './GovEmblems';
import ThemeToggle from '../ThemeToggle';
import { useDashboard } from '../../context/DashboardContext';

/**
 * GovHeader — Official Indian Government Header Component.
 * Aligned with standards from india.gov.in, dolr.gov.in, and bhunaksha.nic.in.
 *
 * Structure:
 *  1. Top National Tricolor Stripe (Saffron / White / Green)
 *  2. National Utility Bar (Gov of India, Accessibility A- A A+, Language, Theme)
 *  3. Deep Dark Blue Government Portal Banner (#112e51) with Emblems & Titles
 */

const GovHeader = () => {
  const {
    fontScale,
    setFontScale,
    language,
    setLanguage,
    engineRunning,
    handleRerunEngine,
  } = useDashboard();

  return (
    <header className="w-full flex flex-col select-none z-[1010] relative">
      {/* 1. National Tricolor Strip */}
      <div className="india-tricolor-bar" />

      {/* 2. Top Accessibility & National Utility Bar */}
      <div className="bg-[#0b1e36] text-slate-300 text-[11px] sm:text-xs border-b border-[#1b3a63] px-3 sm:px-6 py-1">
        <div className="max-w-[1920px] mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Left: National & Ministry Designation */}
          <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
            <span className="font-semibold text-white tracking-wide flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-gov-saffron" />
              {language === 'hi' ? 'भारत सरकार' : 'GOVERNMENT OF INDIA'}
            </span>
            <span className="text-slate-500 hidden sm:inline">|</span>
            <span className="hidden sm:inline text-slate-300">
              {language === 'hi'
                ? 'ग्रामीण विकास मंत्रालय · भूमि संसाधन विभाग (DoLR)'
                : 'Ministry of Rural Development · Dept. of Land Resources (DoLR)'}
            </span>
            <span className="text-slate-500 hidden md:inline">|</span>
            <span className="hidden md:inline text-amber-300/90 font-mono text-[10px] bg-[#112e51] px-1.5 py-0.2 rounded-none border border-[#1b3a63]">
              SIH 2026 · PS26013
            </span>
          </div>

          {/* Right: Accessibility Controls, Font Resizing, Language, Theme */}
          <div className="flex items-center gap-2 sm:gap-3 ml-auto">
            {/* Skip to Main Content */}
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:bg-amber-400 focus:text-slate-900 focus:px-2 focus:py-0.5 font-bold"
            >
              Skip to Main
            </a>

            {/* Font Size Adjusters: A- | A | A+ */}
            <div className="flex items-center border border-[#1b3a63] bg-[#071526] px-1 py-0.5 rounded-none" title="Text Size Adjustment">
              <button
                type="button"
                onClick={() => setFontScale('sm')}
                className={`px-1.5 py-0.5 font-semibold text-[10px] hover:text-white transition-colors ${
                  fontScale === 'sm' ? 'text-amber-400 bg-[#112e51]' : 'text-slate-400'
                }`}
                aria-label="Decrease Font Size"
              >
                A-
              </button>
              <button
                type="button"
                onClick={() => setFontScale('base')}
                className={`px-1.5 py-0.5 font-semibold text-[11px] hover:text-white transition-colors border-x border-[#1b3a63] ${
                  fontScale === 'base' ? 'text-amber-400 bg-[#112e51]' : 'text-slate-400'
                }`}
                aria-label="Normal Font Size"
              >
                A
              </button>
              <button
                type="button"
                onClick={() => setFontScale('lg')}
                className={`px-1.5 py-0.5 font-semibold text-[12px] hover:text-white transition-colors ${
                  fontScale === 'lg' ? 'text-amber-400 bg-[#112e51]' : 'text-slate-400'
                }`}
                aria-label="Increase Font Size"
              >
                A+
              </button>
            </div>

            {/* Language Switcher */}
            <div className="border border-[#1b3a63] bg-[#071526] px-1.5 py-0.5 text-[10px] font-semibold text-slate-300">
              <button
                type="button"
                onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
                className="hover:text-amber-300 transition-colors uppercase tracking-wider"
              >
                {language === 'en' ? 'हिन्दी' : 'English'}
              </button>
            </div>

            {/* Theme Toggle */}
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* 3. Main Government Portal Banner (Deep Dark Blue #112e51) */}
      <div className="bg-[#112e51] dark:bg-[#0a1b30] text-white border-b-2 border-gov-saffron px-3 sm:px-6 py-2.5 sm:py-3.5 shadow-md transition-colors">
        <div className="max-w-[1920px] mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Brand & State Emblems */}
          <div className="flex items-center gap-3 sm:gap-4 w-full md:w-auto">
            {/* State Emblem of India (Lion Capital) */}
            <Link
              to="/"
              onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'instant' })}
              className="shrink-0 group hover:opacity-95 transition-opacity"
              title="National Portal of India"
            >
              <AshokaLionCapital className="w-9 h-12 sm:w-11 sm:h-14 text-white" />
            </Link>

            {/* Vertical Divider */}
            <div className="h-10 sm:h-12 w-[1px] bg-slate-400/40 shrink-0" />

            {/* Ashoka Chakra */}
            <div className="shrink-0 hidden sm:block">
              <AshokaChakra className="w-8 h-8 sm:w-10 sm:h-10" spokeColor="#60a5fa" ringColor="#93c5fd" />
            </div>

            {/* Portal Titles */}
            <div className="flex flex-col">
              <div className="flex items-center gap-2 flex-wrap">
                <Link to="/dashboard" className="text-lg sm:text-2xl font-bold tracking-tight text-white hover:text-amber-300 transition-colors">
                  GeoHarmonize <span className="text-amber-400">AI</span>
                </Link>
                <span className="text-[10px] sm:text-xs font-mono bg-[#0b203d] border border-[#234e82] text-amber-300 px-2 py-0.5 rounded-none uppercase tracking-wider font-semibold">
                  National Cadastral Portal
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-300 font-medium leading-tight mt-0.5">
                {language === 'hi'
                  ? 'राष्ट्रीय बहु-स्रोत भू-स्थानिक एवं कडस्ट्रल सामंजस्य प्रणाली'
                  : 'Automated Multi-Dataset Geospatial & Cadastral Harmonization Engine'}
              </p>
              <p className="text-[10px] text-slate-400 hidden sm:block">
                Department of Land Resources (DoLR) · Ministry of Rural Development, Govt. of India
              </p>
            </div>
          </div>

          {/* Right Action & Emblem Cluster */}
          <div className="flex items-center justify-between md:justify-end gap-3 sm:gap-4 w-full md:w-auto mt-1 md:mt-0 pt-2 md:pt-0 border-t md:border-t-0 border-[#1b3a63]">
            {/* G20 & Digital India Emblems (Visible on desktop) */}
            <div className="hidden xl:flex items-center gap-4 pr-3 border-r border-[#1b3a63]">
              <G20Logo className="h-12 sm:h-14" />
              <DigitalIndiaLogo className="h-8" />
            </div>

            {/* Live Operational Status */}
            <div className="hidden lg:flex flex-col items-start bg-[#0a1c33] border border-[#1b3a63] px-2.5 py-1 text-[10px]">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold tracking-wider">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>SPATIAL ENGINE ONLINE</span>
              </div>
              <span className="text-slate-400 font-mono text-[9px]">PostGIS Cluster · Active</span>
            </div>

            {/* Re-run Conflict Engine Button (Government Action Style) */}
            <button
              onClick={handleRerunEngine}
              disabled={engineRunning}
              className="inline-flex items-center gap-1.5 sm:gap-2 bg-gov-saffron hover:bg-amber-600 disabled:bg-amber-500/60 disabled:cursor-not-allowed text-[#0b1e36] font-bold text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-none border border-amber-400 shadow-sm transition-colors cursor-pointer whitespace-nowrap ml-auto md:ml-0"
              title="Execute Automated Spatial Conflict Detection Algorithm"
            >
              <RefreshCw size={15} className={`shrink-0 ${engineRunning ? 'animate-spin' : ''}`} />
              <span>
                {engineRunning ? (
                  'Re-analyzing…'
                ) : (
                  <>
                    Re-run <span className="hidden sm:inline">Conflict </span>Engine
                  </>
                )}
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default GovHeader;
