import React from 'react';
import { Trophy, RefreshCw, Sun, Moon, Trash2 } from 'lucide-react';
import { TROPHY_URL } from '../data/constants';

export const Header = ({ darkMode, setDarkMode, reset, view, onClearData }) => (
  <header className={`p-4 flex justify-between items-center shadow-md print:hidden ${darkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}`}>
    <div className="flex items-center gap-3">
      <img src={TROPHY_URL} alt="World Cup Trophy" className="h-12 drop-shadow-md hover:scale-110 transition-transform" />
      <div>
        <h1 className="text-2xl font-black tracking-tighter italic bg-gradient-to-r from-yellow-500 to-yellow-200 bg-clip-text text-transparent drop-shadow-sm">
            MUNDIAL 2026
        </h1>
        <p className="text-xs opacity-70 font-mono uppercase tracking-widest">Simulador Oficial</p>
      </div>
    </div>
    <div className="flex gap-4 items-center">
      {view !== 'landing' && (
        <>
            <button onClick={reset} className="flex items-center gap-2 text-sm font-semibold hover:text-blue-500 transition">
            <RefreshCw size={16} /> Reiniciar
            </button>
            <button onClick={onClearData} className="flex items-center gap-2 text-sm font-semibold text-red-500 hover:text-red-700 transition border border-red-500/30 px-3 py-1 rounded hover:bg-red-500/10">
            <Trash2 size={16} /> Borrar Datos
            </button>
        </>
      )}
      <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700 transition">
        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
      </button>
    </div>
  </header>
);