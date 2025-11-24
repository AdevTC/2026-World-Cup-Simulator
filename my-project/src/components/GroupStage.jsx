import React, { useState, useMemo } from 'react';
import { Eye, Rewind, Calculator, ChevronRight, ChevronUp, ChevronDown } from 'lucide-react';
import { Flag } from './ui/Flag';
import { TeamName } from './ui/TeamName';
import { getBestThirdsList } from '../utils/logic';

export const GroupStage = ({ groups, matches, setMatches, onNext, darkMode, setGroups }) => {
  const [showPots, setShowPots] = useState(false);
  const qualifiedThirds = useMemo(() => getBestThirdsList(groups), [groups]);

  const handleScore = (group, matchId, team, val) => {
    // Validar enteros positivos
    if (!/^\d*$/.test(val)) return;
    setMatches(prev => ({
      ...prev,
      [group]: prev[group].map(m => m.id === matchId ? { ...m, [team]: val } : m)
    }));
  };

  const preventInvalidInput = (e) => {
    // Bloquear puntos, comas, signos mas/menos y 'e' exponencial
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
       <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
         <div>
            <h2 className="text-3xl font-bold flex items-center gap-2">Fase de Grupos <span className="text-sm font-normal opacity-50 bg-slate-200 dark:bg-slate-800 px-2 py-1 rounded">48 Equipos</span></h2>
         </div>

         <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer select-none bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-lg hover:bg-slate-200 transition">
                <input type="checkbox" checked={showPots} onChange={() => setShowPots(!showPots)} className="accent-blue-600" />
                <span className="text-sm font-bold flex items-center gap-1"><Eye size={14}/> Ver Bombos</span>
            </label>
            <div className="h-8 w-[1px] bg-slate-300 dark:bg-slate-700 mx-2"></div>
             <button onClick={simulateAll} className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition">
               <Rewind size={16} fill="currentColor" /> Simular Todo
             </button>
             <button onClick={simulateRest} className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition">
               <Calculator size={16} /> Simular Restantes
             </button>
             <button onClick={onNext} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-bold shadow-md transition transform hover:scale-105">
               Ir a Eliminatorias <ChevronRight size={18} />
             </button>
         </div>
       </div>
       
       <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
         {Object.keys(groups).sort().map(gLetter => (
           <div key={gLetter} className={`rounded-xl border overflow-hidden ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-200'} shadow-md`}>
              <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white p-2 text-center font-bold flex justify-between px-4">
                <span>Grupo {gLetter}</span>
              </div>
              <table className="w-full text-xs">
                <thead className="bg-slate-100 dark:bg-slate-800 uppercase">
                  <tr>
                    <th className="p-1 w-4"></th>
                    <th className="p-2 text-left pl-1">Equipo</th>
                    <th className="p-1 text-center w-6" title="Jugados">PJ</th>
                    <th className="p-1 text-center w-6" title="Ganados">G</th>
                    <th className="p-1 text-center w-6" title="Empatados">E</th>
                    <th className="p-1 text-center w-6" title="Perdidos">P</th>
                    <th className="p-1 text-center w-6" title="Goles Favor">GF</th>
                    <th className="p-1 text-center w-6" title="Goles Contra">GC</th>
                    <th className="p-1 text-center w-8" title="Diferencia">DG</th>
                    <th className="p-1 text-center w-8 bg-black/5 dark:bg-white/5 font-bold" title="Puntos">PTS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                  {groups[gLetter].map((t, idx) => {
                    let barColor = 'bg-gray-300'; 
                    if (idx < 2) barColor = 'bg-green-500';
                    else if (idx === 2) {
                         const isThird = qualifiedThirds.some(q => q.name === t.name);
                         if (isThird) barColor = 'bg-green-500'; 
                         else barColor = 'bg-gray-300';
                    }
                    return (
                        <tr key={idx} className={`${idx < 2 ? 'bg-green-500/5' : ''}`}>
                        <td className="p-1 text-center relative group">
                             <span className="text-xs opacity-50 group-hover:hidden">{idx + 1}</span>
                            <div className="hidden group-hover:flex flex-col items-center absolute inset-0 justify-center bg-white dark:bg-slate-900 z-10">
                                {idx > 0 && <button onClick={() => moveTeam(gLetter, idx, -1)} className="text-slate-400 hover:text-blue-500"><ChevronUp size={14}/></button>}
                                {idx < 3 && <button onClick={() => moveTeam(gLetter, idx, 1)} className="text-slate-400 hover:text-blue-500"><ChevronDown size={14}/></button>}
                            </div>
                        </td>
                        <td className="p-2 pl-1 flex items-center relative">
                            <span className={`absolute left-0 top-2 bottom-2 w-1 rounded-r ${barColor} transition-colors duration-500`}></span>
                            <div className="pl-3 flex items-center">
                                {/* <--- CAMBIO NUEVO: Bandera un poco más grande */}
                                <Flag name={t.name} size="w-7 h-5" />
                                <TeamName name={t.name} pot={t.pot} showPot={showPots} />
                            </div>
                        </td>
                        <td className="p-1 text-center opacity-70">{t.played}</td>
                        <td className="p-1 text-center opacity-70">{t.w}</td>
                        <td className="p-1 text-center opacity-70">{t.d}</td>
                        <td className="p-1 text-center opacity-70">{t.l}</td>
                        <td className="p-1 text-center opacity-70">{t.gf}</td>
                        <td className="p-1 text-center opacity-70">{t.ga}</td>
                        <td className="p-1 text-center opacity-70 font-mono">{t.gd > 0 ? `+${t.gd}` : t.gd}</td>
                        <td className="p-1 text-center font-bold bg-black/5 dark:bg-white/5">{t.pts}</td>
                        </tr>
                    );
                  })}
                </tbody>
              </table>
              <div className="p-2 bg-slate-50 dark:bg-slate-950/50 border-t dark:border-slate-800 space-y-2">
                {matches[gLetter].map(m => (
                  <div key={m.id} className="flex items-center justify-between text-xs p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition">
                    <div className="flex items-center w-28 overflow-hidden gap-2 justify-end">
                       <span className="truncate text-right font-bold">{m.teamA}</span> <Flag name={m.teamA} size="w-5 h-4"/>
                    </div>
                    <div className="flex gap-2 items-center">
                      {/* <--- CAMBIO NUEVO: Input ESTILO PREMIER LEAGUE (Grande, centrado, bordeado) */}
                      <input 
                        type="number" 
                        className={`w-10 h-8 text-lg text-center rounded-md font-mono font-black border-2 focus:ring-2 ring-blue-500 outline-none transition-all ${darkMode ? 'bg-slate-800 border-slate-700 text-white focus:border-blue-500' : 'bg-white border-gray-200 text-black focus:border-blue-500 shadow-sm'}`}
                        value={m.scoreA} 
                        onKeyDown={preventInvalidInput}
                        onChange={(e) => handleScore(gLetter, m.id, 'scoreA', e.target.value)} 
                      />
                      <span className="opacity-30 font-bold">-</span>
                      <input 
                        type="number" 
                        className={`w-10 h-8 text-lg text-center rounded-md font-mono font-black border-2 focus:ring-2 ring-blue-500 outline-none transition-all ${darkMode ? 'bg-slate-800 border-slate-700 text-white focus:border-blue-500' : 'bg-white border-gray-200 text-black focus:border-blue-500 shadow-sm'}`}
                        value={m.scoreB} 
                        onKeyDown={preventInvalidInput}
                        onChange={(e) => handleScore(gLetter, m.id, 'scoreB', e.target.value)} 
                      />
                    </div>
                    <div className="flex items-center w-28 overflow-hidden gap-2">
                       <Flag name={m.teamB} size="w-5 h-4"/> <span className="truncate font-bold">{m.teamB}</span>
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