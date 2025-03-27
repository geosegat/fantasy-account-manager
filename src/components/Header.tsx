
import React from 'react';
import { exportCharacters } from '../utils/localStorage';

const Header: React.FC = () => {
  return (
    <header className="w-full glass-panel p-6 mb-8 flex flex-col sm:flex-row justify-between items-center gap-4 medieval-border">
      <div className="text-center sm:text-left">
        <h1 className="text-3xl sm:text-4xl font-medieval text-white">
          <span className="text-mu-gold">MU</span>
          <span className="tracking-wide"> Account Manager</span>
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Track, analyze, and manage your character progression
        </p>
      </div>
      
      <button 
        onClick={exportCharacters}
        className="secondary-button flex items-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        Export Data
      </button>
    </header>
  );
};

export default Header;
