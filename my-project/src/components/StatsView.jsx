import React from 'react';
import { ArrowLeft, Users, Download, BarChart3, Trophy } from 'lucide-react';

export const StatsView = ({ stats, onBack, darkMode }) => {
  
  const StatCard = ({ title, value, icon, color }) => (
    <div className={`p-6 rounded-2xl border-2 shadow-lg transition-transform hover:scale-105 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'}`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${color} text-white shadow-md`}>
          {icon}
        </div>
        <span className={`text-4xl font-black ${darkMode ? 'text-white' : 'text-slate-800'}`}>
          {value}
        </span>
      </div>
      <h3 className={`text-lg font-bold uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
        {title}
      </h3>
    </div>
  );

  return (
    <div className="container mx-auto p-6 animate-fade-in max-w-4xl min-h-[80vh] flex flex-col justify-center">
      
      <div className="text-center mb-12">
        <div className="inline-block p-4 rounded-full bg-blue-100 text-blue-600 mb-4 shadow-sm">
            <BarChart3 size={48} />
        </div>
        <h2 className="text-4xl md:text-5xl font-black mb-2 tracking-tight">Estadísticas</h2>
        <p className="opacity-60 text-lg">Resumen de actividad de tu simulador</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <StatCard 
          title="Visitas Totales" 
          value={stats.visits} 
          icon={<Users size={32} />} 
          color="bg-gradient-to-br from-blue-500 to-indigo-600"
        />
        <StatCard 
          title="PDFs Generados" 
          value={stats.downloads} 
          icon={<Download size={32} />} 
          color="bg-gradient-to-br from-emerald-500 to-teal-600"
        />
      </div>

      <div className={`p-8 rounded-2xl border text-center ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
        <Trophy className="mx-auto mb-4 text-yellow-500" size={40} />
        <h4 className="text-xl font-bold mb-2">¡Gracias por usar el Simulador!</h4>
        <p className="opacity-60 max-w-lg mx-auto">
          Estos datos se guardan localmente en tu dispositivo.
        </p>
      </div>

      <div className="mt-12 text-center">
        <button 
          onClick={onBack}
          className={`flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105 ${darkMode ? 'bg-white text-slate-900 hover:bg-gray-200' : 'bg-slate-900 text-white hover:bg-slate-800'} mx-auto shadow-xl`}
        >
          <ArrowLeft size={24} /> Volver
        </button>
      </div>
    </div>
  );
};