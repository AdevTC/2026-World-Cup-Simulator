import React, { useState } from 'react';
import { Download, Zap, Trophy, X, Award } from 'lucide-react';
import { Flag } from './ui/Flag';
import { TROPHY_URL } from '../data/constants';

// --- COMPONENTE INTERNO: INPUT DE PREMIO (SACADO FUERA PARA EVITAR BUG DE FOCO) ---
const AwardInput = ({ label, value, onChange, placeholder = "Nombre...", darkMode }) => (
  <div className="flex flex-col gap-1 mb-4">
    <label className="text-xs font-bold opacity-70 uppercase tracking-wider flex items-center gap-2">
      <Trophy size={12} className="text-yellow-500" /> {label}
    </label>
    <input 
       type="text" 
       value={value} 
       onChange={(e) => onChange(e.target.value)}
       className={`p-3 rounded-lg border-2 outline-none focus:ring-4 ring-yellow-500/20 transition-all font-bold ${darkMode ? 'bg-slate-800 border-slate-600 text-white focus:border-yellow-500' : 'bg-white border-gray-200 text-slate-900 focus:border-yellow-500'}`}
       placeholder={placeholder}
    />
  </div>
);

// --- COMPONENTE INTERNO: MODAL DE PREMIOS ---
const AwardsModal = ({ isOpen, onClose, awards, setAwards, darkMode }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
       <div className={`w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl border-2 relative ${darkMode ? 'bg-slate-900 border-yellow-500/30' : 'bg-white border-yellow-400'}`}>
          
          {/* Header del Modal */}
          <div className={`flex justify-between items-center p-6 border-b sticky top-0 z-10 ${darkMode ? 'bg-slate-900/95 border-slate-700' : 'bg-white/95 border-gray-200'}`}>
             <h3 className="text-2xl font-black uppercase flex items-center gap-3 text-yellow-500 tracking-wider">
               <Award size={32} /> Premios del Torneo
             </h3>
             <button onClick={onClose} className="p-2 rounded-full hover:bg-red-500 hover:text-white transition">
               <X size={24} />
             </button>
          </div>

          {/* Formulario */}
          <div className="p-8">
              <div className="grid md:grid-cols-2 gap-6">
                <AwardInput label="Mejor Jugador (Balón de Oro)" value={awards.bestPlayer} onChange={(v)=>setAwards({...awards, bestPlayer: v})} darkMode={darkMode} />
                <AwardInput label="Mejor Portero (Guante de Oro)" value={awards.bestKeeper} onChange={(v)=>setAwards({...awards, bestKeeper: v})} darkMode={darkMode} />
                <AwardInput label="Mejor Jugador Joven" value={awards.bestYoung} onChange={(v)=>setAwards({...awards, bestYoung: v})} darkMode={darkMode} />
                <AwardInput label="Mejor Gol del Torneo" value={awards.bestGoal} onChange={(v)=>setAwards({...awards, bestGoal: v})} darkMode={darkMode} />
                <AwardInput label="Premio Fair Play (País)" value={awards.fairPlay} onChange={(v)=>setAwards({...awards, fairPlay: v})} darkMode={darkMode} />
              </div>
              
              <div className={`mt-6 pt-6 border-t border-dashed ${darkMode ? 'border-slate-700' : 'border-gray-300'}`}>
                  <h4 className="font-black text-lg mb-4 opacity-80 uppercase">Estadísticas Clave</h4>
                  <div className="grid md:grid-cols-3 gap-4">
                      <div className="space-y-2 bg-black/5 dark:bg-white/5 p-4 rounded-xl">
                         <label className="text-xs font-bold opacity-70 uppercase block">Bota de Oro</label>
                         <input type="text" placeholder="Jugador" className={`w-full p-2 mb-2 rounded border outline-none font-semibold ${darkMode ? 'bg-slate-800 border-slate-600' : 'bg-white'}`} value={awards.topScorer.name} onChange={(e)=>setAwards({...awards, topScorer: {...awards.topScorer, name: e.target.value}})} />
                         <input type="number" placeholder="Goles" className={`w-full p-2 rounded border outline-none font-mono ${darkMode ? 'bg-slate-800 border-slate-600' : 'bg-white'}`} value={awards.topScorer.count} onChange={(e)=>setAwards({...awards, topScorer: {...awards.topScorer, count: e.target.value}})} />
                      </div>
                      <div className="space-y-2 bg-black/5 dark:bg-white/5 p-4 rounded-xl">
                         <label className="text-xs font-bold opacity-70 uppercase block">Máximo Asistente</label>
                         <input type="text" placeholder="Jugador" className={`w-full p-2 mb-2 rounded border outline-none font-semibold ${darkMode ? 'bg-slate-800 border-slate-600' : 'bg-white'}`} value={awards.topAssister.name} onChange={(e)=>setAwards({...awards, topAssister: {...awards.topAssister, name: e.target.value}})} />
                         <input type="number" placeholder="Asist." className={`w-full p-2 rounded border outline-none font-mono ${darkMode ? 'bg-slate-800 border-slate-600' : 'bg-white'}`} value={awards.topAssister.count} onChange={(e)=>setAwards({...awards, topAssister: {...awards.topAssister, count: e.target.value}})} />
                      </div>
                      <div className="space-y-2 bg-black/5 dark:bg-white/5 p-4 rounded-xl">
                         <label className="text-xs font-bold opacity-70 uppercase block">MVP G/A</label>
                         <input type="text" placeholder="Jugador" className={`w-full p-2 mb-2 rounded border outline-none font-semibold ${darkMode ? 'bg-slate-800 border-slate-600' : 'bg-white'}`} value={awards.topGA.name} onChange={(e)=>setAwards({...awards, topGA: {...awards.topGA, name: e.target.value}})} />
                         <input type="number" placeholder="Total" className={`w-full p-2 rounded border outline-none font-mono ${darkMode ? 'bg-slate-800 border-slate-600' : 'bg-white'}`} value={awards.topGA.count} onChange={(e)=>setAwards({...awards, topGA: {...awards.topGA, count: e.target.value}})} />
                      </div>
                  </div>
              </div>
          </div>
          
          {/* Footer del Modal */}
          <div className={`p-6 border-t flex justify-end ${darkMode ? 'bg-slate-900/95 border-slate-700' : 'bg-gray-50 border-gray-200'}`}>
             <button onClick={onClose} className="px-8 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-bold rounded-xl shadow-lg hover:scale-105 transition transform">
                Guardar Premios
             </button>
          </div>
       </div>
    </div>
  );
};


// --- COMPONENTE DEL PARTIDO (Rediseñado Grande) ---
const KnockoutMatch = ({ match, round, index, updateMatch, darkMode }) => {
  const hasScore = match.scoreA !== '' && match.scoreB !== '';
  const scoreA = parseInt(match.scoreA || '0');
  const scoreB = parseInt(match.scoreB || '0');
  const isDraw = hasScore && scoreA === scoreB;
  const showExtraTimeControls = hasScore && (isDraw || match.isExtraTime);

  const inputClass = `w-12 h-10 text-xl text-center rounded-lg font-mono font-black border-2 focus:ring-4 ring-blue-500/30 outline-none transition-all ${
      darkMode 
      ? 'bg-slate-950 border-slate-700 text-white focus:border-blue-500' 
      : 'bg-white border-gray-200 text-slate-900 focus:border-blue-500 shadow-inner'
  }`;
  
  const preventInvalidInput = (e) => {
    if (['.', ',', 'e', 'E', '+', '-'].includes(e.key)) e.preventDefault();
  };

  return (
    <div className={`flex flex-col mb-6 rounded-xl border-2 relative overflow-hidden transition-all hover:shadow-lg ${darkMode ? 'bg-slate-800 border-slate-700 hover:border-slate-600' : 'bg-white border-gray-200 hover:border-blue-300'} shadow-sm w-full group`}>
      {/* Línea conectora */}
      <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-4 h-[2px] bg-gray-300 dark:bg-slate-600"></div>
      
      {/* Equipo A */}
      <div className={`flex justify-between items-center p-3 border-b-2 dark:border-slate-700/50 ${match.winner === match.teamA && match.winner ? 'bg-gradient-to-r from-green-500/10 to-transparent' : ''}`}>
        <div className="flex items-center gap-3 overflow-hidden">
          <Flag name={match.teamA?.name} size="w-8 h-6 shadow-sm ring-1 ring-black/10" />
          <span className={`truncate max-w-[140px] text-base ${match.winner === match.teamA ? 'font-black text-green-600 dark:text-green-400' : 'font-bold'}`}>
            {match.teamA?.name || 'TBD'}
          </span>
        </div>
        <input type="number" className={inputClass} 
          onKeyDown={preventInvalidInput}
          value={match.scoreA} onChange={(e) => updateMatch(round, index, 'scoreA', e.target.value)} />
      </div>

      {/* Equipo B */}
      <div className={`flex justify-between items-center p-3 ${match.winner === match.teamB && match.winner ? 'bg-gradient-to-r from-green-500/10 to-transparent' : ''}`}>
        <div className="flex items-center gap-3 overflow-hidden">
          <Flag name={match.teamB?.name} size="w-8 h-6 shadow-sm ring-1 ring-black/10" />
          <span className={`truncate max-w-[140px] text-base ${match.winner === match.teamB ? 'font-black text-green-600 dark:text-green-400' : 'font-bold'}`}>
            {match.teamB?.name || 'TBD'}
          </span>
        </div>
        <input type="number" className={inputClass}
          onKeyDown={preventInvalidInput}
          value={match.scoreB} onChange={(e) => updateMatch(round, index, 'scoreB', e.target.value)} />
      </div>

      {/* Prórroga y Penales */}
      {showExtraTimeControls && (
        <div className="p-2 bg-yellow-500/5 text-center border-t-2 border-dashed dark:border-slate-700">
          <div className="flex justify-center items-center gap-2 mb-1">
             <label className="flex items-center gap-1.5 cursor-pointer select-none group/check">
               <input type="checkbox" className="accent-yellow-500 scale-110" checked={match.isExtraTime} onChange={() => updateMatch(round, index, 'isExtraTime', !match.isExtraTime)} />
               <span className="font-bold text-yellow-600 uppercase text-[10px] group-hover/check:text-yellow-500 transition">Prórroga (120')</span>
             </label>
          </div>
          {match.isExtraTime && isDraw && (
            <div className="flex items-center justify-center gap-2 animate-fade-in mt-1">
                <div className="flex items-center gap-1">
                  <span className="text-[10px] opacity-70 font-bold">PEN:</span>
                  <input type="number" className={`w-10 h-8 text-sm font-bold text-center rounded border ${darkMode ? 'bg-slate-900 border-slate-600' : 'bg-white'}`} placeholder="A"
                      onKeyDown={preventInvalidInput}
                      value={match.penA || ''} onChange={(e) => updateMatch(round, index, 'penA', e.target.value)} />
                </div>
                <div className="text-xs text-slate-400">vs</div>
                <div className="flex items-center gap-1">
                  <input type="number" className={`w-10 h-8 text-sm font-bold text-center rounded border ${darkMode ? 'bg-slate-900 border-slate-600' : 'bg-white'}`} placeholder="B"
                      onKeyDown={preventInvalidInput}
                      value={match.penB || ''} onChange={(e) => updateMatch(round, index, 'penB', e.target.value)} />
                </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};


// --- COMPONENTE PRINCIPAL ---
export const KnockoutStage = ({ bracket, updateMatch, darkMode, winner, thirdPlace, updateThirdPlace, onPrint, onSimulate, awards, setAwards }) => {
  const [isAwardsOpen, setIsAwardsOpen] = useState(false);

  if(!bracket) return null;

  // Validación de premios para habilitar botón
  const isAwardsComplete = 
      awards.bestPlayer && awards.bestKeeper && awards.bestYoung && 
      awards.bestGoal && awards.fairPlay && 
      awards.topScorer.name && awards.topScorer.count &&
      awards.topAssister.name && awards.topAssister.count &&
      awards.topGA.name && awards.topGA.count;

  const handlePrintClick = () => {
    if(!isAwardsComplete) {
        setIsAwardsOpen(true);
        alert("¡Atención! Debes rellenar todos los premios en la ventana emergente antes de generar el PDF.");
        return;
    }
    onPrint();
  };

  return (
    <div className="overflow-x-auto pb-12 animate-fade-in pl-6">
      
      {/* HEADER DE LA FASE ELIMINATORIA */}
      <div className={`flex justify-between items-center mb-10 sticky left-0 px-6 py-4 z-20 border-b shadow-md rounded-xl mx-4 mt-2 backdrop-blur-md ${darkMode ? 'bg-slate-950/90 border-slate-800' : 'bg-white/90 border-gray-200'}`}>
          <div>
            <h2 className="text-3xl font-black tracking-tight">Fase Eliminatoria</h2>
            <p className="text-sm opacity-60">Camino a la gran final</p>
          </div>
          <div className="flex gap-3">
              <button onClick={() => setIsAwardsOpen(true)} className={`px-4 py-2 rounded-lg flex items-center gap-2 transition shadow-lg font-bold border-2 ${isAwardsComplete ? 'bg-yellow-500/10 border-yellow-500 text-yellow-600 hover:bg-yellow-500 hover:text-white' : 'bg-red-500 text-white border-red-500 animate-pulse'}`}>
                  <Trophy size={18} /> {isAwardsComplete ? 'Editar Premios' : 'Premios (Pendiente)'}
              </button>

              <div className="h-10 w-[1px] bg-slate-300 dark:bg-slate-700 mx-2"></div>

              <button onClick={onSimulate} className="bg-purple-600 text-white px-5 py-2 rounded-lg flex items-center gap-2 hover:bg-purple-700 transition shadow-lg hover:scale-105 font-bold">
                  <Zap size={18} fill="currentColor" /> Simular
              </button>
              <button onClick={handlePrintClick} className={`text-white px-5 py-2 rounded-lg flex items-center gap-2 transition shadow-lg font-bold ${isAwardsComplete ? 'bg-slate-800 hover:bg-black' : 'bg-gray-400 cursor-not-allowed'}`}>
                  <Download size={18} /> PDF
              </button>
          </div>
      </div>

      {winner && (
        <div className="flex flex-col items-center justify-center p-8 mb-16 bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-500 rounded-2xl text-white animate-bounce shadow-2xl max-w-2xl mx-auto border-4 border-white sticky left-0 right-0 z-10 transform hover:scale-105 transition duration-500">
           <img src={TROPHY_URL} alt="Trophy" className="h-32 drop-shadow-lg mb-4" />
           <h2 className="text-5xl font-black uppercase tracking-widest drop-shadow-md">CAMPEÓN 2026</h2>
           <div className="text-4xl mt-4 font-bold flex items-center gap-4 bg-white/20 px-8 py-3 rounded-full backdrop-blur-sm shadow-inner">
             <Flag name={winner.name} size="w-12 h-9 shadow-lg" /> {winner.name}
           </div>
        </div>
      )}

      <div className="flex gap-16 min-w-[2000px] px-8 mb-20">
        {['16avos de Final', 'Octavos de Final', 'Cuartos de Final', 'Semifinales'].map((label, idx) => {
            const roundKey = ['r32', 'r16', 'qf', 'sf'][idx];
            return (
                <div key={roundKey} className="flex flex-col justify-around w-72">
                    <h4 className={`text-center font-black mb-6 uppercase text-xs opacity-60 py-2 rounded-lg sticky top-0 backdrop-blur-sm z-10 tracking-widest ${darkMode ? 'bg-slate-800/80 text-white' : 'bg-gray-200/80 text-slate-800'}`}>{label}</h4>
                    {bracket[roundKey].map((m, i) => <KnockoutMatch key={i} match={m} round={roundKey} index={i} updateMatch={updateMatch} darkMode={darkMode} />)}
                </div>
            );
        })}
          
         <div className="flex flex-col justify-center w-96 gap-16 pl-8 border-l-2 border-dashed border-gray-300 dark:border-slate-800">
             <div className="scale-110 origin-left">
                <h4 className="text-center font-black mb-6 uppercase text-sm text-yellow-600 bg-yellow-100 py-3 rounded-lg border-2 border-yellow-400 shadow-sm tracking-widest">GRAN FINAL</h4>
                {bracket.final.map((m, i) => <KnockoutMatch key={i} match={m} round="final" index={i} updateMatch={updateMatch} darkMode={darkMode} />)}
             </div>
             <div className="opacity-90 scale-100 origin-left">
                <h4 className="text-center font-bold mb-4 uppercase text-xs text-orange-600 bg-orange-100 py-2 rounded border border-orange-200">3er Puesto</h4>
                {thirdPlace && <KnockoutMatch match={thirdPlace} round="third" index={0} updateMatch={updateThirdPlace} darkMode={darkMode} />}
             </div>
        </div>
      </div>

      <AwardsModal 
          isOpen={isAwardsOpen} 
          onClose={() => setIsAwardsOpen(false)} 
          awards={awards} 
          setAwards={setAwards} 
          darkMode={darkMode} 
      />
    </div>
  );
};