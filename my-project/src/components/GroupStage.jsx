import React, { useState, useMemo } from 'react';
import { Eye, Rewind, Calculator, ChevronRight, ChevronUp, ChevronDown, Layers } from 'lucide-react';
import { Flag } from './ui/Flag';
import { TeamName } from './ui/TeamName';
import { getBestThirdsList } from '../utils/logic';

export const GroupStage = ({ groups, matches, setMatches, onNext, darkMode, setGroups }) => {
  const [showPots, setShowPots] = useState(false);
  const qualifiedThirds = useMemo(() => getBestThirdsList(groups), [groups]);

  const handleScore = (group, matchId, team, val) => {
    if (!/^\d*$/.test(val)) return;
    setMatches(prev => ({
      ...prev,
      [group]: prev[group].map(m => m.id === matchId ? { ...m, [team]: val } : m)
    }));
  };

  const preventInvalidInput = (e) => {
    if (['.', ',', 'e', 'E', '+', '-'].includes(e.key)) e.preventDefault();
  };

  const simulateRest = () => {
    setMatches(prev => {
      const next = { ...prev };
      Object.keys(next).forEach(g => {
        next[g] = next[g].map(m => {
          if (m.scoreA !== '' && m.scoreB !== '') return m;
          const sA = Math.floor(Math.random() * 4);
          const sB = Math.floor(Math.random() * 4);
          return { ...m, scoreA: sA, scoreB: sB };
        });
      });
      return next;
    });
  };

  const simulateAll = () => {
    setMatches(prev => {
      const next = { ...prev };
      Object.keys(next).forEach(g => {
        next[g] = next[g].map(m => {
          const sA = Math.floor(Math.random() * 4);
          const sB = Math.floor(Math.random() * 4);
          return { ...m, scoreA: sA, scoreB: sB };
        });
      });
      return next;
    });
  };

  const moveTeam = (groupLetter, index, direction) => {
    setGroups(prev => {
      const newG = { ...prev };
      const group = [...newG[groupLetter]];
      const newIndex = index + direction;
      if (newIndex < 0 || newIndex >= group.length) return prev;
      [group[index], group[newIndex]] = [group[newIndex], group[index]];
      newG[groupLetter] = group;
      return newG;
    });
  };

  return (
    <div className="container mx-auto p-4 animate-fade-in">
       {/* PANEL DE CONTROL SUPERIOR */}
       <div className={`p-6 rounded-2xl shadow-sm border mb-8 flex flex-col md:flex-row justify-between items-center gap-6 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
         <div>
            <h2 className="text-3xl font-black flex items-center gap-3 tracking-tight">
                <Layers size={32} className={darkMode ? 'text-blue-500' : 'text-blue-600'} />
                Fase de Grupos 
                <span className={`text-sm font-bold px-3 py-1 rounded-full ${darkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>48 Equipos</span>
            </h2>
         </div>

         <div className="flex flex-wrap justify-center items-center gap-3">
            <label className={`flex items-center gap-2 cursor-pointer select-none px-4 py-2.5 rounded-xl font-bold transition shadow-sm border ${darkMode ? 'bg-slate-800 border-slate-700 hover:bg-slate-700' : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'}`}>
                <input type="checkbox" checked={showPots} onChange={() => setShowPots(!showPots)} className="accent-blue-600 scale-110" />
                <span className="text-sm flex items-center gap-2"><Eye size={16}/> Ver Bombos</span>
            </label>
            
            <div className={`h-8 w-[1px] mx-2 ${darkMode ? 'bg-slate-700' : 'bg-slate-300'}`}></div>
             
             <button onClick={simulateAll} className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md transition hover:scale-105 active:scale-95">
               <Rewind size={18} fill="currentColor" /> Simular Todo
             </button>
             <button onClick={simulateRest} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md transition hover:scale-105 active:scale-95">
               <Calculator size={18} /> Restantes
             </button>
             <button onClick={onNext} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg transition hover:scale-105 active:scale-95 ml-2">
               Siguiente Fase <ChevronRight size={20} />
             </button>
         </div>
       </div>
       
       {/* GRID DE GRUPOS */}
       <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
         {Object.keys(groups).sort().map(gLetter => (
           <div key={gLetter} className={`rounded-2xl border overflow-hidden shadow-sm transition-all hover:shadow-md ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
              
              {/* HEADER DE GRUPO: Ahora limpio en modo claro */}
              <div className={`p-3 text-center font-black text-lg flex justify-between px-5 border-b ${darkMode ? 'bg-gradient-to-r from-slate-800 to-slate-900 text-white border-slate-700' : 'bg-white text-slate-800 border-slate-100'}`}>
                <span>Grupo {gLetter}</span>
              </div>
              
              <table className="w-full text-xs">
                <thead className={`uppercase border-b ${darkMode ? 'bg-slate-800/50 border-slate-700 text-slate-400' : 'bg-white border-slate-100 text-slate-500'}`}>
                  <tr>
                    <th className="p-2 w-4"></th>
                    <th className="p-2 text-left pl-1 font-bold">Equipo</th>
                    <th className="p-1 text-center w-7" title="Jugados">PJ</th>
                    <th className="p-1 text-center w-7" title="Ganados">G</th>
                    <th className="p-1 text-center w-7" title="Empatados">E</th>
                    <th className="p-1 text-center w-7" title="Perdidos">P</th>
                    <th className="p-1 text-center w-7" title="Goles Favor">GF</th>
                    <th className="p-1 text-center w-7" title="Goles Contra">GC</th>
                    <th className="p-1 text-center w-9" title="Diferencia">DG</th>
                    {/* Columna Puntos destacada */}
                    <th className={`p-2 text-center w-10 font-black text-sm border-l ${darkMode ? 'bg-white/5 border-slate-700 text-white' : 'bg-slate-50 border-slate-100 text-slate-900'}`} title="Puntos">PTS</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${darkMode ? 'divide-slate-800' : 'divide-slate-50'}`}>
                  {groups[gLetter].map((t, idx) => {
                    // Lógica de colores de clasificación más sutil en modo claro
                    let barColor = darkMode ? 'bg-slate-700' : 'bg-slate-200'; 
                    let rowClass = darkMode ? 'hover:bg-white/5' : 'hover:bg-slate-50';
                    
                    if (idx < 2) {
                        barColor = 'bg-emerald-500';
                        rowClass = darkMode ? 'bg-emerald-500/10' : 'bg-emerald-50';
                    } else if (idx === 2) {
                         const isThird = qualifiedThirds.some(q => q.name === t.name);
                         if (isThird) {
                            barColor = 'bg-emerald-500'; 
                            rowClass = darkMode ? 'bg-emerald-500/5' : 'bg-emerald-50/40';
                         }
                    }
                    
                    return (
                        <tr key={idx} className={`transition-colors ${rowClass}`}>
                        <td className="p-1 text-center relative group">
                             <span className="text-[10px] font-bold opacity-30 group-hover:hidden">{idx + 1}</span>
                            <div className={`hidden group-hover:flex flex-col items-center absolute inset-0 justify-center z-10 ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
                                {idx > 0 && <button onClick={() => moveTeam(gLetter, idx, -1)} className="text-slate-400 hover:text-blue-500 p-0.5"><ChevronUp size={14}/></button>}
                                {idx < 3 && <button onClick={() => moveTeam(gLetter, idx, 1)} className="text-slate-400 hover:text-blue-500 p-0.5"><ChevronDown size={14}/></button>}
                            </div>
                        </td>
                        <td className="p-2 pl-1 flex items-center relative">
                            {/* Barra lateral de estado */}
                            <span className={`absolute left-0 top-2 bottom-2 w-1 rounded-r-full ${barColor} transition-colors duration-500`}></span>
                            <div className="pl-3 flex items-center">
                                <Flag name={t.name} size="w-6 h-4 shadow-sm" />
                                <div className="ml-2">
                                    <TeamName name={t.name} pot={t.pot} showPot={showPots} />
                                </div>
                            </div>
                        </td>
                        <td className="p-1 text-center opacity-70 font-medium">{t.played}</td>
                        <td className="p-1 text-center opacity-60">{t.w}</td>
                        <td className="p-1 text-center opacity-60">{t.d}</td>
                        <td className="p-1 text-center opacity-60">{t.l}</td>
                        <td className="p-1 text-center opacity-60">{t.gf}</td>
                        <td className="p-1 text-center opacity-60">{t.ga}</td>
                        <td className={`p-1 text-center font-mono font-medium ${t.gd > 0 ? 'text-green-500' : (t.gd < 0 ? 'text-red-500' : 'opacity-60')}`}>{t.gd > 0 ? `+${t.gd}` : t.gd}</td>
                        <td className={`p-1 text-center font-black border-l ${darkMode ? 'bg-white/5 border-slate-700 text-white' : 'bg-slate-50 border-slate-100 text-slate-900'}`}>{t.pts}</td>
                        </tr>
                    );
                  })}
                </tbody>
              </table>
              
              {/* LISTA DE PARTIDOS: Fondo sutil para separar de la tabla */}
              <div className={`p-3 space-y-2 border-t ${darkMode ? 'bg-slate-950/30 border-slate-800' : 'bg-slate-50/50 border-slate-100'}`}>
                {matches[gLetter].map(m => (
                  <div key={m.id} className={`flex items-center justify-between text-xs p-2 rounded-lg transition border ${darkMode ? 'hover:bg-white/5 border-transparent' : 'bg-white border-slate-200 hover:border-blue-200 shadow-sm'}`}>
                    <div className="flex items-center w-1/3 overflow-hidden gap-2 justify-end">
                       <span className={`truncate text-right font-bold ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>{m.teamA}</span> <Flag name={m.teamA} size="w-5 h-3.5"/>
                    </div>
                    
                    <div className="flex gap-2 items-center justify-center w-1/3">
                      {/* INPUTS: Muy limpios en blanco */}
                      <input 
                        type="number" 
                        placeholder="-"
                        className={`w-9 h-8 text-base text-center rounded-md font-mono font-bold border-2 outline-none transition-all focus:scale-110 focus:z-10 ${darkMode ? 'bg-slate-800 border-slate-700 text-white focus:border-blue-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-500 focus:bg-white'}`}
                        value={m.scoreA} 
                        onKeyDown={preventInvalidInput}
                        onChange={(e) => handleScore(gLetter, m.id, 'scoreA', e.target.value)} 
                      />
                      <input 
                        type="number" 
                        placeholder="-"
                        className={`w-9 h-8 text-base text-center rounded-md font-mono font-bold border-2 outline-none transition-all focus:scale-110 focus:z-10 ${darkMode ? 'bg-slate-800 border-slate-700 text-white focus:border-blue-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-500 focus:bg-white'}`}
                        value={m.scoreB} 
                        onKeyDown={preventInvalidInput}
                        onChange={(e) => handleScore(gLetter, m.id, 'scoreB', e.target.value)} 
                      />
                    </div>
                    
                    <div className="flex items-center w-1/3 overflow-hidden gap-2">
                       <Flag name={m.teamB} size="w-5 h-3.5"/> <span className={`truncate font-bold ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>{m.teamB}</span>
                    </div>
                  </div>
                ))}
              </div>
           </div>
         ))}
       </div>
    </div>
  );
};