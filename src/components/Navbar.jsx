import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Problem', href: '#problem' },
    { name: 'Architecture', href: '#architecture' },
    { name: 'Features', href: '#features' },
    { name: 'Data Sources', href: '#data-sources' },
    { name: 'Team', href: '#team' },
  ];

  return (
    <nav className="bg-navy-800 dark:bg-slate-900 sticky top-0 z-50 border-b border-navy-700 dark:border-slate-800 shadow-md transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center">
            <span className="text-white text-2xl font-bold tracking-tight">GeoSync</span>
            <span className="ml-2 text-xs text-slate-400 border border-slate-600 px-1.5 py-0.5 rounded-sm uppercase tracking-wider">Prototype</span>
          </div>
          
          <div className="hidden md:flex space-x-6 items-center">
            {navLinks.map((link) => (
              <a key={link.name} href={link.href} className="nav-link">
                {link.name}
              </a>
            ))}
            <ThemeToggle className="ml-2" />
            <Link to="/dashboard" className="btn-primary ml-2 inline-block">
              View Demo
            </Link>
          </div>

          <div className="md:hidden flex items-center gap-1.5">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-300 hover:text-white p-2"
              aria-label="Toggle Navigation Menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-navy-800 dark:bg-slate-900 border-t border-navy-700 dark:border-slate-800">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="block px-3 py-2 text-base font-medium text-slate-300 hover:text-white hover:bg-navy-700 dark:hover:bg-slate-800 rounded-md transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <div className="px-3 py-2">
              <Link to="/dashboard" className="btn-primary w-full text-center block">
                View Demo
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
