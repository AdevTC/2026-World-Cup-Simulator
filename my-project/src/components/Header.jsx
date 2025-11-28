import React from 'react';
import { Trophy, RefreshCw, Sun, Moon, BarChart2, ArrowLeft } from 'lucide-react';
import { TROPHY_URL } from '../data/constants';

export const Header = ({ darkMode, setDarkMode, reset, view, onViewStats, onBack }) => {
  
  const showBack = view !== 'landing' && view !== 'stats' && onBack;

  return (
    <header className={`p-4 flex flex-wrap justify-between items-center shadow-md print:hidden gap-4 ${darkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}`}>
      
      <div className="flex items-center gap-3">
        {showBack && (
            <button onClick={onBack} className="mr-2 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-800 transition">
                <ArrowLeft size={24} />
            </button>
        )}
        
        <img src={TROPHY_URL} alt="Trophy" className="h-10 md:h-12 drop-shadow-md hover:scale-110 transition-transform" />
        
        <div>
          <h1 className="text-xl md:text-2xl font-black tracking-tighter italic bg-gradient-to-r from-yellow-500 to-yellow-200 bg-clip-text text-transparent drop-shadow-sm">
              MUNDIAL 2026
          </h1>
          <p className="hidden md:block text-xs opacity-70 font-mono uppercase tracking-widest">Simulador Oficial</p>
        </div>
      </div>

      <div className="flex gap-2 md:gap-4 items-center">
        {view !== 'landing' && view !== 'stats' && (
          <button onClick={reset} className="hidden md:flex items-center gap-2 text-sm font-semibold hover:text-blue-500 transition">
            <RefreshCw size={16} /> <span className="hidden lg:inline">Reiniciar Todo</span>
          </button>
        )}
        
        {view !== 'stats' && (
            <button onClick={onViewStats} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-800 transition text-blue-500" title="Ver Estadísticas">
              <BarChart2 size={24} />
            </button>
        )}

        <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700 transition">
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </header>
  );
};