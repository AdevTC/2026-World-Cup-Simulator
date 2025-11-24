import React, { useState } from 'react';
import { Trophy } from 'lucide-react';
import { PLAYOFFS_DATA } from '../data/constants';

export const PlayoffSelector = ({ onComplete, darkMode }) => {
  const [selections, setSelections] = useState({});

  const handleSelect = (id, winner) => {
    setSelections(prev => ({ ...prev, [id]: winner }));
  };
  const isComplete = [...PLAYOFFS_DATA.uefa, ...PLAYOFFS_DATA.inter].every(p => selections[p.id]);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 animate-fade-in">
      <h2 className="text-3xl font-bold mb-2 text-center">Predicción de Repechajes</h2>
      <p className="text-center opacity-70 mb-8">Define quién clasifica para completar los 48 equipos.</p>
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {[
          { title: 'UEFA (Europa)', color: 'text-blue-500', data: PLAYOFFS_DATA.uefa },
          { title: 'Intercontinental', color: 'text-green-500', data: PLAYOFFS_DATA.inter }
        ].map((section, idx) => (
            <div key={idx} className={`p-6 rounded-xl border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
                <h3 className={`font-bold text-lg mb-4 flex items-center gap-2 ${section.color}`}><Trophy size={18}/> {section.title}</h3>
                <div className="space-y-4">
                    {section.data.map(p => (
                    <div key={p.id} className="flex flex-col gap-2">
                        <label className="text-sm font-medium opacity-80">{p.name}</label>
                        <select className={`p-2 rounded border w-full ${darkMode ? 'bg-slate-900 border-slate-600' : 'bg-gray-50'}`}
                        onChange={(e) => handleSelect(p.id, e.target.value)} value={selections[p.id] || ''}>
                        <option value="">-- Seleccionar Ganador --</option>
                        {p.candidates.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    ))}
                </div>
            </div>
        ))}
      </div>
      <div className="text-center">
        <button disabled={!isComplete} onClick={() => onComplete(Object.values(selections))}
          className={`px-8 py-3 rounded-full font-bold text-lg shadow-lg transition-all transform hover:scale-105 ${
            isComplete ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}>
          Confirmar y Sortear Mundial
        </button>
      </div>
    </div>
  );
};