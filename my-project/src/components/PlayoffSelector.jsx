import React, { useState } from 'react';
import { Trophy, CheckCircle } from 'lucide-react';
import { PLAYOFFS_DATA } from '../data/constants';
import { Flag } from './ui/Flag'; // Importamos Flag para mostrar banderas

export const PlayoffSelector = ({ onComplete, darkMode }) => {
  const [selections, setSelections] = useState({});

  const handleSelect = (id, winner) => {
    setSelections(prev => ({ ...prev, [id]: winner }));
  };
  
  const isComplete = [...PLAYOFFS_DATA.uefa, ...PLAYOFFS_DATA.inter].every(p => selections[p.id]);

  // Componente de Tarjeta de Selección
  const SelectionCard = ({ candidate, isSelected, onClick }) => (
      <button 
        onClick={onClick}
        className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all w-full text-left group relative ${
            isSelected 
            ? 'border-green-500 bg-green-500/10 shadow-md ring-2 ring-green-500/20' 
            : `border-transparent ${darkMode ? 'bg-slate-900 hover:bg-slate-700' : 'bg-gray-100 hover:bg-white hover:shadow-sm'}`
        }`}
      >
          <Flag name={candidate} size="w-8 h-6 shadow-sm" />
          <span className={`font-bold flex-1 ${darkMode ? 'text-slate-200' : 'text-slate-700'} ${isSelected ? 'text-green-600 dark:text-green-400' : ''}`}>
              {candidate}
          </span>
          {isSelected && <CheckCircle className="text-green-500 animate-bounce-in" size={20} />}
      </button>
  );

  return (
    <div className="max-w-5xl mx-auto py-12 px-4 animate-fade-in pb-32">
      <div className="text-center mb-12">
          <h2 className="text-4xl font-black mb-3 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">Predicción de Repechajes</h2>
          <p className="opacity-60 text-lg max-w-2xl mx-auto">Selecciona los equipos ganadores de cada llave para completar los 48 participantes del Mundial.</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
        {[
          { title: 'UEFA (Europa)', color: 'text-blue-500', bg: 'bg-blue-500', data: PLAYOFFS_DATA.uefa },
          { title: 'Intercontinental', color: 'text-green-500', bg: 'bg-green-500', data: PLAYOFFS_DATA.inter }
        ].map((section, idx) => (
            <div key={idx} className={`p-6 rounded-2xl border ${darkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200 shadow-xl'}`}>
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-dashed border-gray-200 dark:border-slate-700">
                    <div className={`p-2 rounded-lg ${section.bg} bg-opacity-20 text-white`}>
                        <Trophy size={24} className={section.color} />
                    </div>
                    <h3 className={`font-black text-xl ${section.color}`}>{section.title}</h3>
                </div>
                
                <div className="space-y-8">
                    {section.data.map(p => (
                    <div key={p.id} className="space-y-3">
                        <label className="text-xs font-bold opacity-50 uppercase tracking-widest ml-1">{p.name}</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {p.candidates.map(c => (
                                <SelectionCard 
                                    key={c} 
                                    candidate={c} 
                                    isSelected={selections[p.id] === c} 
                                    onClick={() => handleSelect(p.id, c)} 
                                />
                            ))}
                        </div>
                    </div>
                    ))}
                </div>
            </div>
        ))}
      </div>
      
      <div className="text-center sticky bottom-8 z-20">
        <button 
          disabled={!isComplete} 
          onClick={() => onComplete(selections)}
          className={`px-10 py-4 rounded-full font-black text-xl shadow-2xl transition-all transform hover:scale-105 flex items-center gap-3 mx-auto ${
            isComplete 
            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white ring-4 ring-blue-500/30' 
            : 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-70'}`
          }
        >
          {isComplete ? <CheckCircle fill="currentColor" className="text-white" /> : <Trophy className="opacity-50" />}
          {isComplete ? 'Confirmar y Sortear' : 'Selecciona todos los ganadores'}
        </button>
      </div>
    </div>
  );
};