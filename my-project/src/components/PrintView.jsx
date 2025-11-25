import React, { useState, useEffect, useMemo } from 'react';
import { TROPHY_URL } from '../data/constants';
import { Flag } from './ui/Flag';
import { getBestThirdsList } from '../utils/logic';
import { Trophy, Award, Calendar, ListOrdered, Shield, ShieldAlert, BarChart3 } from 'lucide-react';

export const PrintView = ({ groups, bracket, winner, thirdPlace, onBack, userName, awards }) => {
  const [date] = useState(new Date());
  
  useEffect(() => { 
      const timer = setTimeout(() => window.print(), 800); 
      return () => clearTimeout(timer);
  }, []);

  const qualifiedThirds = useMemo(() => getBestThirdsList(groups), [groups]);

  // --- CÁLCULO DE ESTADÍSTICAS AUTOMÁTICAS ---
  const tournamentStats = useMemo(() => {
    const stats = {}; 

    Object.values(groups).flat().forEach(t => {
        stats[t.name] = { name: t.name, ga: t.ga }; 
    });

    const processMatch = (m) => {
        if (m.scoreA !== '' && m.scoreB !== '' && m.teamA && m.teamB) {
            const sA = parseInt(m.scoreA);
            const sB = parseInt(m.scoreB);
            if (stats[m.teamA.name]) stats[m.teamA.name].ga += sB;
            if (stats[m.teamB.name]) stats[m.teamB.name].ga += sA;
        }
    };

    if (bracket) {
        ['r32', 'r16', 'qf', 'sf', 'final'].forEach(r => bracket[r].forEach(processMatch));
    }
    if (thirdPlace) processMatch(thirdPlace);

    let maxGA = { name: 'N/A', ga: -1 };
    let minGA = { name: 'N/A', ga: 999 };

    Object.values(stats).forEach(t => {
        if (t.ga > maxGA.ga) maxGA = t;
        if (t.ga < minGA.ga) minGA = t;
    });

    return { maxGA, minGA };
  }, [groups, bracket, thirdPlace]);

  const runnerUp = bracket?.final[0]?.winner === bracket?.final[0]?.teamA 
      ? bracket?.final[0]?.teamB 
      : bracket?.final[0]?.teamA;
  
  const thirdWinner = thirdPlace?.winner;

  return (
    <div className="absolute top-0 left-0 w-full min-h-screen bg-white text-slate-900 font-sans print-container">
      
      <button onClick={onBack} className="fixed top-6 right-6 bg-black text-white px-6 py-3 rounded-full shadow-2xl font-bold z-50 hover:scale-105 transition no-print flex items-center gap-2">
          ← Volver
      </button>

      {/* ================= PÁGINA 1: GRUPOS ================= */}
      <div className="print-page p-8 max-w-[210mm] mx-auto relative bg-white">
        
        <div className="flex items-center justify-between border-b-4 border-black pb-4 mb-6">
            <div className="flex items-center gap-4">
                <img src={TROPHY_URL} className="h-16 object-contain" alt="Copa" />
                <div>
                    <h1 className="text-3xl font-black tracking-tighter uppercase leading-none">Reporte Oficial</h1>
                    <p className="text-sm text-gray-500 tracking-widest font-bold uppercase">Mundial 2026</p>
                </div>
            </div>
            <div className="text-right">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Creado por</p>
                <p className="text-lg font-black capitalize">{userName}</p>
            </div>
        </div>

        <div className="flex items-center gap-2 mb-4">
            <div className="bg-black text-white p-1 rounded"><ListOrdered size={14}/></div>
            <h2 className="text-xl font-black uppercase tracking-tight">Fase de Grupos</h2>
        </div>

        <div className="grid grid-cols-3 gap-x-4 gap-y-4">
           {Object.keys(groups).sort().map(g => (
             <div key={g} className="border border-gray-200 rounded overflow-hidden break-inside-avoid shadow-sm">
               <div className="bg-gray-100 px-2 py-1 flex justify-between items-center border-b border-gray-200">
                   <span className="font-black text-xs">GRUPO {g}</span>
               </div>
               <table className="w-full text-[9px]">
                   <thead>
                       <tr className="text-gray-400 border-b border-gray-100 bg-gray-50/50">
                           <th className="pl-3 py-1 text-left font-bold w-6">Pos.</th>
                           <th className="text-left font-bold">País</th>
                           <th className="text-center font-bold w-6">DG</th>
                           <th className="text-center font-black text-black w-6 bg-gray-100">PTS</th>
                       </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-50">
                       {groups[g].map((t, i) => {
                           const isQualified = i < 2 || (i === 2 && qualifiedThirds.some(q => q.name === t.name));
                           
                           let rowClass = 'text-gray-600';
                           let posClass = 'text-gray-400 font-medium';
                           
                           if (isQualified) { 
                               rowClass = 'font-bold text-black bg-green-50/40'; 
                               posClass = 'text-green-700 font-black'; 
                           }
                           
                           return (
                               <tr key={i} className={rowClass}>
                                   <td className={`pl-3 py-1.5 ${posClass}`}>{i+1}º</td>
                                   <td className="flex items-center gap-2 py-1.5">
                                       <Flag name={t.name} size="w-4 h-3 shadow-sm rounded-[1px]" />
                                       <span className="truncate max-w-[65px]">{t.name}</span>
                                   </td>
                                   <td className="text-center opacity-60 font-mono">{t.gd > 0 ? `+${t.gd}` : t.gd}</td>
                                   <td className="text-center font-black bg-gray-50/50 text-black text-[10px]">{t.pts}</td>
                               </tr>
                           );
                       })}
                   </tbody>
               </table>
             </div>
           ))}
        </div>

        <div className="absolute bottom-6 left-0 w-full text-center">
            <p className="text-[8px] text-gray-400 uppercase tracking-widest">Página 1 de 3</p>
        </div>
      </div>


      {/* ================= PÁGINA 2: ELIMINATORIAS ================= */}
      <div className="break-before-page"></div>
      
      <div className="print-page p-8 max-w-[210mm] mx-auto relative bg-white">
        <div className="flex items-center justify-between border-b-2 border-gray-100 pb-2 mb-6">
            <h2 className="text-2xl font-black uppercase tracking-tight">Fase Final</h2>
            <div className="flex items-center gap-2 opacity-50">
                <Calendar size={16}/> <span className="text-[10px] font-bold uppercase">Resultados Oficiales</span>
            </div>
        </div>

        <div className="grid grid-cols-2 gap-x-8 gap-y-6 text-[10px]">
            <div className="space-y-6">
                <div>
                    <h3 className="font-black uppercase text-gray-400 mb-2 text-[9px] border-b border-gray-100">Dieciseisavos</h3>
                    <div className="space-y-1">
                        {bracket.r32.map((m, i) => <MatchRowCompact key={i} m={m} />)}
                    </div>
                </div>
                <div>
                    <h3 className="font-black uppercase text-gray-400 mb-2 text-[9px] border-b border-gray-100">Octavos</h3>
                    <div className="space-y-1">
                        {bracket.r16.map((m, i) => <MatchRowCompact key={i} m={m} />)}
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <div>
                    <h3 className="font-black uppercase text-gray-400 mb-2 text-[9px] border-b border-gray-100">Cuartos</h3>
                    <div className="space-y-2">
                        {bracket.qf.map((m, i) => <MatchCard key={i} m={m} />)}
                    </div>
                </div>
                
                <div className="pt-2">
                    <h3 className="font-black uppercase text-gray-400 mb-2 text-[9px] border-b border-gray-100">Semifinales</h3>
                    <div className="space-y-2">
                        {bracket.sf.map((m, i) => <MatchCard key={i} m={m} highlighted />)}
                    </div>
                </div>

                {/* BLOQUE GRAN FINAL */}
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200 text-center">
                    <h4 className="text-xs font-black uppercase tracking-widest mb-3">Gran Final</h4>
                    {bracket.final.map((m, i) => (
                        <div key={i}>
                            <div className="flex justify-center items-end gap-6 mb-2">
                                <div className="text-center">
                                    <Flag name={m.teamA?.name} size="w-10 h-7 shadow-sm mb-1 mx-auto" />
                                    <p className="font-black text-sm">{m.teamA?.name}</p>
                                </div>
                                <div className="text-2xl font-black mb-1 bg-black text-white px-3 py-1 rounded leading-none">
                                    {m.scoreA}-{m.scoreB}
                                </div>
                                <div className="text-center">
                                    <Flag name={m.teamB?.name} size="w-10 h-7 shadow-sm mb-1 mx-auto" />
                                    <p className="font-black text-sm">{m.teamB?.name}</p>
                                </div>
                            </div>
                            
                            {/* <--- CAMBIO NUEVO: Detalles Extra en Final */}
                            {(m.isExtraTime || (m.penA && m.penB)) && (
                                <div className="text-[9px] font-mono text-gray-500 mt-1 flex gap-2 justify-center">
                                    {m.isExtraTime && <span>(ET)</span>}
                                    {m.penA && m.penB && <span>(Pen {m.penA}-{m.penB})</span>}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>

        <div className="absolute bottom-6 left-0 w-full text-center">
            <p className="text-[8px] text-gray-400 uppercase tracking-widest">Página 2 de 3</p>
        </div>
      </div>


      {/* ================= PÁGINA 3: PREMIOS ================= */}
      <div className="break-before-page"></div>
      
      <div className="print-page p-10 max-w-[210mm] mx-auto relative bg-slate-50/50">
        
        <div className="text-center mb-8">
            <Trophy size={32} className="mx-auto text-black mb-2" />
            <h2 className="text-3xl font-black uppercase tracking-tighter">Cuadro de Honor</h2>
        </div>

        {/* PODIO DEL TORNEO */}
        <div className="grid grid-cols-3 gap-4 mb-10 items-end text-center">
            {/* SUBCAMPEÓN */}
            <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm order-1 translate-y-4">
                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Subcampeón</div>
                {runnerUp && <Flag name={runnerUp.name} size="w-16 h-10 shadow-md mx-auto mb-2" />}
                <h3 className="text-lg font-black text-slate-700 leading-tight">{runnerUp?.name || 'TBD'}</h3>
                <div className="inline-block bg-gray-200 text-gray-700 text-[9px] font-bold px-2 py-0.5 rounded mt-1">2º Lugar</div>
            </div>

            {/* CAMPEÓN */}
            <div className="p-6 bg-gradient-to-b from-yellow-50 to-white rounded-xl border-2 border-yellow-400 shadow-lg order-2 relative z-10">
                <div className="text-xs font-black text-yellow-600 uppercase tracking-widest mb-3">Campeón del Mundo</div>
                {winner && <Flag name={winner.name} size="w-24 h-16 shadow-xl mx-auto mb-4" />}
                <h1 className="text-3xl font-black text-slate-900 leading-none mb-1">{winner?.name || 'TBD'}</h1>
                <div className="inline-block bg-yellow-400 text-yellow-900 text-[10px] font-black px-3 py-1 rounded mt-1">1º Lugar</div>
            </div>

            {/* TERCERO */}
            <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm order-3 translate-y-6">
                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Tercer Lugar</div>
                {thirdWinner && <Flag name={thirdWinner.name} size="w-14 h-9 shadow-md mx-auto mb-2" />}
                <h3 className="text-lg font-black text-slate-700 leading-tight">{thirdWinner?.name || 'TBD'}</h3>
                <div className="inline-block bg-orange-100 text-orange-800 text-[9px] font-bold px-2 py-0.5 rounded mt-1">3º Lugar</div>
            </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="space-y-3">
                <h3 className="font-black text-sm uppercase border-b-2 border-black pb-1 mb-2">Premios</h3>
                <AwardCard title="Balón de Oro" value={awards.bestPlayer} />
                <AwardCard title="Guante de Oro" value={awards.bestKeeper} />
                <AwardCard title="Mejor Joven" value={awards.bestYoung} />
                <AwardCard title="Mejor Gol" value={awards.bestGoal} />
            </div>

            <div className="space-y-3">
                <h3 className="font-black text-sm uppercase border-b-2 border-black pb-1 mb-2">Estadísticas</h3>
                <StatCard label="Bota de Oro" player={awards.topScorer.name} value={awards.topScorer.count} unit="Goles" />
                <StatCard label="Máx. Asistente" player={awards.topAssister.name} value={awards.topAssister.count} unit="Asist." />
                <StatCard label="MVP (G/A)" player={awards.topGA.name} value={awards.topGA.count} unit="Total" />
            </div>
        </div>

        <div className="mt-auto border-t-2 border-gray-200 pt-6">
            <div className="flex items-center justify-center gap-2 mb-4">
                <div className="bg-black text-white p-1 rounded"><BarChart3 size={14}/></div>
                <h3 className="text-sm font-black uppercase tracking-widest">Extra Stats</h3>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
                    <div className="flex items-center justify-center gap-1 mb-2 text-green-700">
                        <Shield size={12} />
                        <span className="text-[9px] font-black uppercase tracking-wider">Muro Defensivo</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <Flag name={tournamentStats.minGA.name} size="w-8 h-5 shadow-sm" />
                        <span className="font-black text-sm leading-none">{tournamentStats.minGA.name}</span>
                    </div>
                    <div className="mt-2 text-xs font-black bg-white inline-block px-2 py-0.5 rounded border border-green-100 text-green-800">
                        {tournamentStats.minGA.ga} Goles Encajados
                    </div>
                </div>

                <div className="bg-white border border-gray-200 p-3 rounded-lg shadow-sm">
                    <div className="flex items-center justify-center gap-1 mb-2 text-blue-600">
                        <Award size={12} />
                        <span className="text-[9px] font-black uppercase tracking-wider">Juego Limpio</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <Flag name={awards.fairPlay} size="w-8 h-5 shadow-sm" />
                        <span className="font-black text-sm leading-none">{awards.fairPlay}</span>
                    </div>
                    <div className="mt-2 text-[9px] font-bold text-gray-400 uppercase tracking-widest">Premio Oficial</div>
                </div>

                <div className="bg-red-50 border border-red-200 p-3 rounded-lg">
                    <div className="flex items-center justify-center gap-1 mb-2 text-red-700">
                        <ShieldAlert size={12} />
                        <span className="text-[9px] font-black uppercase tracking-wider">Más Goleado</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <Flag name={tournamentStats.maxGA.name} size="w-8 h-5 shadow-sm" />
                        <span className="font-black text-sm leading-none">{tournamentStats.maxGA.name}</span>
                    </div>
                    <div className="mt-2 text-xs font-black bg-white inline-block px-2 py-0.5 rounded border border-red-100 text-red-800">
                        {tournamentStats.maxGA.ga} Goles Encajados
                    </div>
                </div>
            </div>
        </div>

        <div className="absolute bottom-6 left-0 w-full text-center">
            <p className="text-[8px] text-gray-400 uppercase tracking-widest">Página 3 de 3 • Fin del Reporte</p>
        </div>
      </div>

      <style>{`
        @media print {
          @page { size: A4; margin: 0; }
          body { background: white; -webkit-print-color-adjust: exact; }
          .print-container { position: absolute; top: 0; left: 0; width: 100%; }
          .no-print { display: none !important; }
          
          .break-before-page { page-break-before: always; height: 0; display: block; }
          
          .print-page { 
              width: 210mm; 
              height: 297mm; 
              margin: 0 auto; 
              background: white; 
              overflow: hidden; 
              page-break-after: auto; 
          }
        }
        
        @media screen {
          .print-container { background: #f3f4f6; padding: 40px 0; }
          .print-page { 
              margin: 0 auto 40px auto; 
              box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1); 
              width: 210mm; 
              height: 297mm; 
          }
          .break-before-page { display: none; }
        }
      `}</style>
    </div>
  );
};

// <--- CAMBIO NUEVO: Helper actualizado para formato (ET) (Pen X-Y)
const getScore = (m) => {
    if (m.scoreA === '' || m.scoreB === '') return '-';
    let res = `${m.scoreA}-${m.scoreB}`;
    if (m.isExtraTime) res += ' (ET)';
    if (m.penA && m.penB) res += ` (Pen ${m.penA}-${m.penB})`;
    return res;
};

const MatchRowCompact = ({ m }) => (
    <div className="flex justify-between items-center text-[9px] border-b border-dotted border-gray-200 pb-1">
        <div className="flex items-center gap-1 w-[42%]">
            <Flag name={m.teamA?.name} size="w-3 h-2" />
            <span className={`truncate ${m.winner === m.teamA ? 'font-bold text-black' : 'text-gray-500'}`}>{m.teamA?.name || '-'}</span>
        </div>
        <div className="font-mono font-bold whitespace-nowrap">{getScore(m)}</div>
        <div className="flex items-center justify-end gap-1 w-[42%]">
            <span className={`truncate ${m.winner === m.teamB ? 'font-bold text-black' : 'text-gray-500'}`}>{m.teamB?.name || '-'}</span>
            <Flag name={m.teamB?.name} size="w-3 h-2" />
        </div>
    </div>
);

const MatchCard = ({ m, highlighted = false }) => (
    <div className={`border rounded p-2 flex justify-between items-center ${highlighted ? 'border-black bg-gray-50' : 'border-gray-200'}`}>
        <div className="flex flex-col gap-1 w-full">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Flag name={m.teamA?.name} size="w-4 h-3 rounded-[1px]" />
                    <span className={`text-[10px] ${m.winner === m.teamA ? 'font-bold' : 'font-medium text-gray-500'}`}>{m.teamA?.name || '-'}</span>
                </div>
                <span className="font-mono font-bold text-xs">{m.scoreA}</span>
            </div>
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Flag name={m.teamB?.name} size="w-4 h-3 rounded-[1px]" />
                    <span className={`text-[10px] ${m.winner === m.teamB ? 'font-bold' : 'font-medium text-gray-500'}`}>{m.teamB?.name || '-'}</span>
                </div>
                <span className="font-mono font-bold text-xs">{m.scoreB}</span>
            </div>
            
            {/* <--- CAMBIO NUEVO: Detalles Extra en Cards */}
            {(m.isExtraTime || (m.penA && m.penB)) && (
                <div className="text-[8px] text-center text-gray-500 font-mono mt-1 pt-1 border-t border-gray-100">
                    {m.isExtraTime && <span>(ET) </span>}
                    {m.penA && m.penB && <span>(Pen {m.penA}-{m.penB})</span>}
                </div>
            )}
        </div>
    </div>
);

const AwardCard = ({ title, value }) => (
    <div className="flex items-center justify-between p-3 border border-gray-100 rounded bg-white shadow-sm">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{title}</span>
        <span className="text-sm font-black text-slate-900">{value || '-'}</span>
    </div>
);

const StatCard = ({ label, player, value, unit }) => (
    <div className="flex items-center justify-between p-3 border-b border-gray-100">
        <div>
            <p className="text-[9px] font-bold text-gray-400 uppercase">{label}</p>
            <p className="font-bold text-xs text-slate-900">{player || '-'}</p>
        </div>
        <div className="text-right">
            <span className="text-lg font-black block leading-none">{value || '0'}</span>
            <span className="text-[8px] text-gray-400 uppercase">{unit}</span>
        </div>
    </div>
);