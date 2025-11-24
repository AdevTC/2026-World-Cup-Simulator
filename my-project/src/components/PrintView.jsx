import React, { useState, useEffect, useMemo } from 'react';
import { TROPHY_URL } from '../data/constants';
import { Flag } from './ui/Flag';
import { getBestThirdsList } from '../utils/logic';
import { Trophy, Medal, Award } from 'lucide-react';

export const PrintView = ({ groups, bracket, winner, onBack, userName, awards }) => {
  const [date, setDate] = useState(new Date());
  useEffect(() => { 
      // Pequeño delay para asegurar renderizado antes de imprimir
      setTimeout(() => window.print(), 800); 
  }, []);

  const qualifiedThirds = useMemo(() => getBestThirdsList(groups), [groups]);
  
  const getRes = (m) => {
    let base = `${m.scoreA}-${m.scoreB}`;
    if (m.isExtraTime) base += " (Prórroga)";
    if (m.penA && m.penB) base += ` (${m.penA}-${m.penB} pen)`;
    return base;
  };

  // <--- CAMBIO NUEVO: Cambiado de 'fixed inset-0' a 'absolute' con min-h-screen
  // Esto permite que el contenido fluya y el navegador pueda paginarlo correctamente
  return (
    <div className="absolute top-0 left-0 w-full min-h-screen bg-white z-[9999] text-black p-8 font-serif">
      <div className="max-w-4xl mx-auto border-4 border-black p-8 relative">
        <div className="text-center border-b-2 border-black pb-4 mb-6 flex items-center justify-center gap-4">
          <img src={TROPHY_URL} className="h-24" alt="Cup"/>
          <div>
            <h1 className="text-4xl font-black uppercase">Reporte Mundial 2026</h1>
            <p className="text-lg italic text-gray-600">Creado por: {userName}</p>
          </div>
        </div>

        {winner && (
          <div className="text-center mb-8 p-6 bg-yellow-50 border-2 border-yellow-400 rounded-xl shadow-sm break-inside-avoid">
            <h2 className="text-xl uppercase tracking-widest text-gray-500 mb-2">Campeón del Mundo</h2>
            <div className="text-6xl font-black flex items-center justify-center gap-4">
               <Flag name={winner.name} size="w-20 h-14" />
              {winner.name}
            </div>
          </div>
        )}

        {/* Groups */}
        <h3 className="text-2xl font-bold border-b border-black mb-4">Fase de Grupos</h3>
        <div className="grid grid-cols-3 gap-6 mb-8 text-xs">
           {Object.keys(groups).sort().map(g => (
             <div key={g} className="border p-2 break-inside-avoid shadow-sm rounded">
               <h3 className="font-bold bg-gray-200 p-1 text-center mb-1 rounded-t">Grupo {g}</h3>
               {groups[g].map((t, i) => {
                   let rowClass = '';
                   if (i < 2) rowClass = 'bg-green-100 font-bold';
                   else if (i === 2 && qualifiedThirds.includes(t.name)) rowClass = 'bg-green-50 font-semibold text-green-800';
                   return (
                    <div key={i} className={`flex justify-between items-center p-1 border-b last:border-0 ${rowClass}`}>
                       <div className="flex items-center gap-1">
                           <span className="w-3 text-center opacity-50">{i+1}</span>
                           <Flag name={t.name} size="w-4 h-3"/> 
                           <span className="truncate max-w-[80px]">{t.name}</span>
                       </div>
                       {/* <--- CAMBIO NUEVO: Mostrar más stats en el resumen */}
                       <div className="flex gap-2 font-mono">
                           <span title="GF/GC">{t.gf}:{t.ga}</span>
                           <span className="font-bold">{t.pts}</span>
                       </div>
                     </div>
                   );
               })}
             </div>
           ))}
        </div>

        {/* Knockout */}
        <div className="break-before-page"></div>
        <h3 className="text-2xl font-bold border-b border-black mb-4 mt-8">Fase Final</h3>
        
        <div className="grid grid-cols-2 gap-x-12 gap-y-6 text-sm">
            {[
                { title: '16avos de Final', data: bracket.r32 },
                { title: 'Octavos de Final', data: bracket.r16 },
                { title: 'Cuartos de Final', data: bracket.qf },
                { title: 'Semifinales', data: bracket.sf },
            ].map(round => (
                <div key={round.title} className="break-inside-avoid mb-4">
                    <h4 className="font-bold underline mb-2 text-lg">{round.title}</h4>
                    <div className="space-y-1">
                        {round.data.map((m, i) => (
                            <div key={i} className="flex justify-between border-b border-dotted pb-1">
                                <span className="flex items-center gap-1 w-1/3"><Flag name={m.teamA?.name} size="w-4 h-3"/> {m.teamA?.name || 'TBD'}</span>
                                <span className="font-mono font-bold w-1/3 text-center">{getRes(m)}</span>
                                <span className="flex items-center gap-1 w-1/3 justify-end">{m.teamB?.name || 'TBD'} <Flag name={m.teamB?.name} size="w-4 h-3"/></span>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
             
             <div className="col-span-2 mt-4 p-4 border-4 border-double border-gray-300 rounded bg-gray-50 text-center break-inside-avoid">
                 <h4 className="font-bold text-xl mb-4 text-center">GRAN FINAL</h4>
                 {bracket.final.map((m, i) => (
                    <div key={i} className="text-xl">
                        <div className="flex justify-center items-center gap-4 mb-2">
                             <span className="flex items-center gap-2 text-right"><Flag name={m.teamA?.name} size="w-8 h-6"/> {m.teamA?.name || 'TBD'}</span>
                             <span className="font-black bg-black text-white px-4 py-1 rounded">{getRes(m)}</span>
                             <span className="flex items-center gap-2 text-left">{m.teamB?.name || 'TBD'} <Flag name={m.teamB?.name} size="w-8 h-6"/></span>
                        </div>
                    </div>
                 ))}
             </div>
        </div>

        {/* <--- CAMBIO NUEVO: Sección de Premios en el PDF */}
        <div className="break-before-page"></div>
        <div className="border-4 border-yellow-500 p-8 rounded-xl bg-yellow-50 mt-8 break-inside-avoid">
            <h3 className="text-3xl font-black text-center uppercase mb-8 flex items-center justify-center gap-3">
                <Award size={32} /> Cuadro de Honor
            </h3>
            
            <div className="grid grid-cols-2 gap-8 text-center">
                <div className="p-4 bg-white border border-gray-200 rounded shadow-sm">
                    <h4 className="font-bold text-gray-500 uppercase text-xs mb-1">Mejor Jugador (Balón de Oro)</h4>
                    <p className="text-xl font-black">{awards.bestPlayer}</p>
                </div>
                <div className="p-4 bg-white border border-gray-200 rounded shadow-sm">
                    <h4 className="font-bold text-gray-500 uppercase text-xs mb-1">Mejor Portero (Guante de Oro)</h4>
                    <p className="text-xl font-black">{awards.bestKeeper}</p>
                </div>
                <div className="p-4 bg-white border border-gray-200 rounded shadow-sm">
                    <h4 className="font-bold text-gray-500 uppercase text-xs mb-1">Mejor Jugador Joven</h4>
                    <p className="text-xl font-black">{awards.bestYoung}</p>
                </div>
                <div className="p-4 bg-white border border-gray-200 rounded shadow-sm">
                    <h4 className="font-bold text-gray-500 uppercase text-xs mb-1">Mejor Gol</h4>
                    <p className="text-xl font-black">{awards.bestGoal}</p>
                </div>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-4 text-center">
                 <div className="p-4 bg-white border border-gray-200 rounded shadow-sm">
                    <h4 className="font-bold text-gray-500 uppercase text-xs mb-1">Bota de Oro</h4>
                    <p className="text-lg font-bold">{awards.topScorer.name}</p>
                    <p className="text-sm font-mono bg-black text-white inline-block px-2 rounded">{awards.topScorer.count} Goles</p>
                 </div>
                 <div className="p-4 bg-white border border-gray-200 rounded shadow-sm">
                    <h4 className="font-bold text-gray-500 uppercase text-xs mb-1">Máximo Asistente</h4>
                    <p className="text-lg font-bold">{awards.topAssister.name}</p>
                    <p className="text-sm font-mono bg-black text-white inline-block px-2 rounded">{awards.topAssister.count} Asist.</p>
                 </div>
                 <div className="p-4 bg-white border border-gray-200 rounded shadow-sm">
                    <h4 className="font-bold text-gray-500 uppercase text-xs mb-1">MVP Estadístico (G/A)</h4>
                    <p className="text-lg font-bold">{awards.topGA.name}</p>
                    <p className="text-sm font-mono bg-black text-white inline-block px-2 rounded">{awards.topGA.count} G/A</p>
                 </div>
            </div>

            <div className="mt-6 text-center">
                 <h4 className="font-bold text-gray-500 uppercase text-xs mb-1">Premio al Juego Limpio</h4>
                 <div className="text-2xl font-black flex justify-center items-center gap-2">
                     <Flag name={awards.fairPlay} size="w-8 h-6" /> {awards.fairPlay}
                 </div>
            </div>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-4 border-t border-gray-400 flex justify-between text-xs text-gray-500 font-mono">
            <span>Reporte generado por: {userName}</span>
            <span>{date.toLocaleDateString()} - {date.toLocaleTimeString()}</span>
        </div>
      </div>
      
      <button onClick={onBack} className="fixed top-4 right-4 bg-red-600 text-white px-6 py-2 rounded shadow print:hidden font-sans font-bold z-50 hover:bg-red-700">
          Cerrar Vista de Impresión
      </button>

      <style>{`
        @media print {
          .print\\:hidden { display: none !important; }
          body { background: white; -webkit-print-color-adjust: exact; }
          @page { margin: 0.5cm; size: A4; }
          .break-before-page { page-break-before: always; }
          .break-inside-avoid { page-break-inside: avoid; }
        }
      `}</style>
    </div>
  );
};