import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

/* ── Landing Page Components ─────────────────────────────────────── */
import UtilityBar from './components/UtilityBar';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProblemStats from './components/ProblemStats';
import DataSourceEcosystem from './components/DataSourceEcosystem';
import Pipeline from './components/Pipeline';
import FeatureCards from './components/FeatureCards';
import ConfidencePreview from './components/ConfidencePreview';
import TechStack from './components/TechStack';
import Footer from './components/Footer';

/* ── Dashboard Page ──────────────────────────────────────────────── */
import Dashboard from './pages/Dashboard';

/**
 * LandingPage — The existing marketing/informational page,
 * now wrapped in its own component for routing.
 */
function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <UtilityBar />
      <Navbar />
      
      <main>
        <Hero />
        <ProblemStats />
        <DataSourceEcosystem />
        <Pipeline />
        <FeatureCards />
        <ConfidencePreview />
        <TechStack />
      </main>
      
      <Footer />
    </div>
  );
}

/**
 * App — Root component with routing.
 * `/`          → Landing Page (marketing)
 * `/dashboard` → Operational Dashboard (the core product)
 */
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
