import React, { useState, useMemo } from 'react';
import { Download, Zap, Trophy, X, Award, MapPin, Eraser, LayoutTemplate, Columns, List } from 'lucide-react';
import { Flag } from './ui/Flag';
import { TROPHY_URL, VENUES } from '../data/constants';

// --- COMPONENTES UI ---
const TeamSelect = ({ value, onChange, teams, darkMode, placeholder = "Selecciona Equipo" }) => (
    <select value={value} onChange={(e) => onChange(e.target.value)} className={`p-3 rounded-lg border-2 outline-none cursor-pointer font-bold w-full transition-all focus:ring-4 ring-yellow-500/20 ${darkMode ? 'bg-slate-800 border-slate-600 text-white focus:border-yellow-500' : 'bg-white border-gray-200 text-slate-900 focus:border-yellow-500'}`}>
        <option value="">-- {placeholder} --</option>
        {teams.map(t => (<option key={t} value={t}>{t}</option>))}
    </select>
);

const AwardInput = ({ label, playerValue, teamValue, onPlayerChange, onTeamChange, teams, darkMode }) => (
  <div className="flex flex-col gap-1 mb-4">
    <label className="text-xs font-bold opacity-70 uppercase tracking-wider flex items-center gap-2"><Trophy size={12} className="text-yellow-500" /> {label}</label>
    <div className="flex gap-2">
        <input type="text" value={playerValue} onChange={(e) => onPlayerChange(e.target.value)} className={`flex-1 p-3 rounded-lg border-2 outline-none focus:ring-4 ring-yellow-500/20 transition-all font-bold ${darkMode ? 'bg-slate-800 border-slate-600 text-white focus:border-yellow-500' : 'bg-white border-gray-200 text-slate-900 focus:border-yellow-500'}`} placeholder="Nombre del Jugador..." />
        <div className="w-1/3"><TeamSelect value={teamValue} onChange={onTeamChange} teams={teams} darkMode={darkMode} placeholder="Equipo" /></div>
    </div>
  </div>
);

const AwardsModal = ({ isOpen, onClose, awards, setAwards, teams, darkMode }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
       <div className={`w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl border-2 relative ${darkMode ? 'bg-slate-900 border-yellow-500/30' : 'bg-white border-yellow-400'}`}>
          <div className={`flex justify-between items-center p-6 border-b sticky top-0 z-10 ${darkMode ? 'bg-slate-900/95 border-slate-700' : 'bg-white/95 border-gray-200'}`}>
             <h3 className="text-2xl font-black uppercase flex items-center gap-3 text-yellow-500 tracking-wider"><Award size={32} /> Premios del Torneo</h3>
             <button onClick={onClose} className="p-2 rounded-full hover:bg-red-500 hover:text-white transition"><X size={24} /></button>
          </div>
          <div className="p-8">
              <div className="grid grid-cols-1 gap-6">
                <AwardInput label="Mejor Jugador (Balón de Oro)" playerValue={awards.bestPlayer.name} teamValue={awards.bestPlayer.team} onPlayerChange={(v)=>setAwards({...awards, bestPlayer: {...awards.bestPlayer, name: v}})} onTeamChange={(v)=>setAwards({...awards, bestPlayer: {...awards.bestPlayer, team: v}})} teams={teams} darkMode={darkMode} />
                <AwardInput label="Mejor Portero (Guante de Oro)" playerValue={awards.bestKeeper.name} teamValue={awards.bestKeeper.team} onPlayerChange={(v)=>setAwards({...awards, bestKeeper: {...awards.bestKeeper, name: v}})} onTeamChange={(v)=>setAwards({...awards, bestKeeper: {...awards.bestKeeper, team: v}})} teams={teams} darkMode={darkMode} />
                <AwardInput label="Mejor Jugador Joven" playerValue={awards.bestYoung.name} teamValue={awards.bestYoung.team} onPlayerChange={(v)=>setAwards({...awards, bestYoung: {...awards.bestYoung, name: v}})} onTeamChange={(v)=>setAwards({...awards, bestYoung: {...awards.bestYoung, team: v}})} teams={teams} darkMode={darkMode} />
                <AwardInput label="Mejor Gol del Torneo" playerValue={awards.bestGoal.name} teamValue={awards.bestGoal.team} onPlayerChange={(v)=>setAwards({...awards, bestGoal: {...awards.bestGoal, name: v}})} onTeamChange={(v)=>setAwards({...awards, bestGoal: {...awards.bestGoal, team: v}})} teams={teams} darkMode={darkMode} />
                <div className="flex flex-col gap-1 mb-4"><label className="text-xs font-bold opacity-70 uppercase tracking-wider flex items-center gap-2"><Trophy size={12} className="text-blue-500" /> Premio Fair Play (País)</label><TeamSelect value={awards.fairPlay} onChange={(v)=>setAwards({...awards, fairPlay: v})} teams={teams} darkMode={darkMode} placeholder="Seleccionar País Ganador" /></div>
              </div>
              <div className={`mt-6 pt-6 border-t border-dashed ${darkMode ? 'border-slate-700' : 'border-gray-300'}`}>
                  <h4 className="font-black text-lg mb-4 opacity-80 uppercase">Estadísticas Clave</h4>
                  <div className="grid md:grid-cols-3 gap-4">
                      <div className="space-y-2 bg-black/5 dark:bg-white/5 p-4 rounded-xl"><label className="text-xs font-bold opacity-70 uppercase block">Bota de Oro</label><input type="text" placeholder="Jugador" className={`w-full p-2 mb-1 rounded border outline-none font-semibold ${darkMode ? 'bg-slate-800 border-slate-600' : 'bg-white'}`} value={awards.topScorer.name} onChange={(e)=>setAwards({...awards, topScorer: {...awards.topScorer, name: e.target.value}})} /><TeamSelect value={awards.topScorer.team} onChange={(v)=>setAwards({...awards, topScorer: {...awards.topScorer, team: v}})} teams={teams} darkMode={darkMode} placeholder="Equipo" /><input type="number" placeholder="Goles" className={`w-full p-2 mt-1 rounded border outline-none font-mono ${darkMode ? 'bg-slate-800 border-slate-600' : 'bg-white'}`} value={awards.topScorer.count} onChange={(e)=>setAwards({...awards, topScorer: {...awards.topScorer, count: e.target.value}})} /></div>
                      <div className="space-y-2 bg-black/5 dark:bg-white/5 p-4 rounded-xl"><label className="text-xs font-bold opacity-70 uppercase block">Máximo Asistente</label><input type="text" placeholder="Jugador" className={`w-full p-2 mb-1 rounded border outline-none font-semibold ${darkMode ? 'bg-slate-800 border-slate-600' : 'bg-white'}`} value={awards.topAssister.name} onChange={(e)=>setAwards({...awards, topAssister: {...awards.topAssister, name: e.target.value}})} /><TeamSelect value={awards.topAssister.team} onChange={(v)=>setAwards({...awards, topAssister: {...awards.topAssister, team: v}})} teams={teams} darkMode={darkMode} placeholder="Equipo" /><input type="number" placeholder="Asist." className={`w-full p-2 mt-1 rounded border outline-none font-mono ${darkMode ? 'bg-slate-800 border-slate-600' : 'bg-white'}`} value={awards.topAssister.count} onChange={(e)=>setAwards({...awards, topAssister: {...awards.topAssister, count: e.target.value}})} /></div>
                      <div className="space-y-2 bg-black/5 dark:bg-white/5 p-4 rounded-xl"><label className="text-xs font-bold opacity-70 uppercase block">MVP G/A</label><input type="text" placeholder="Jugador" className={`w-full p-2 mb-1 rounded border outline-none font-semibold ${darkMode ? 'bg-slate-800 border-slate-600' : 'bg-white'}`} value={awards.topGA.name} onChange={(e)=>setAwards({...awards, topGA: {...awards.topGA, name: e.target.value}})} /><TeamSelect value={awards.topGA.team} onChange={(v)=>setAwards({...awards, topGA: {...awards.topGA, team: v}})} teams={teams} darkMode={darkMode} placeholder="Equipo" /><input type="number" placeholder="Total" className={`w-full p-2 mt-1 rounded border outline-none font-mono ${darkMode ? 'bg-slate-800 border-slate-600' : 'bg-white'}`} value={awards.topGA.count} onChange={(e)=>setAwards({...awards, topGA: {...awards.topGA, count: e.target.value}})} /></div>
                  </div>
              </div>
          </div>
          <div className={`p-6 border-t flex justify-end ${darkMode ? 'bg-slate-900/95 border-slate-700' : 'bg-gray-50 border-gray-200'}`}>
             <button onClick={onClose} className="px-8 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-bold rounded-xl shadow-lg hover:scale-105 transition transform">Guardar Premios</button>
          </div>
       </div>
    </div>
  );
};

// --- COMPONENTE DEL PARTIDO ---
const KnockoutMatch = ({ match, round, index, updateMatch, darkMode, small = false, connector = 'left' }) => {
  const hasScore = match.scoreA !== '' && match.scoreB !== '';
  const scoreA = parseInt(match.scoreA || '0');
  const scoreB = parseInt(match.scoreB || '0');
  const isDraw = hasScore && scoreA === scoreB;
  const showExtraTimeControls = hasScore && (isDraw || match.isExtraTime);

  const winnerClass = "font-black scale-105 transition-transform duration-300 origin-left";

  let venueName = null;
  if (round === 'final') venueName = VENUES.final;
  else if (round === 'sf') venueName = VENUES.sf[index];
  else if (round === 'third') venueName = VENUES.third;
  else if (round === 'qf') venueName = VENUES.qf[index];

  const cardClass = small 
    ? `flex flex-col mb-2 rounded border relative overflow-hidden ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-300'} shadow-sm w-full text-xs`
    : `flex flex-col mb-6 rounded-xl border-2 relative overflow-hidden transition-all hover:shadow-lg ${darkMode ? 'bg-slate-800 border-slate-700 hover:border-slate-600' : 'bg-white border-gray-200 hover:border-blue-300'} shadow-sm w-full group`;

  const inputClass = small
    ? `w-6 h-5 text-xs text-center rounded border ${darkMode ? 'bg-slate-900 border-slate-600' : 'bg-white border-gray-200'}`
    : `w-12 h-10 text-xl text-center rounded-lg font-mono font-black border-2 focus:ring-4 ring-blue-500/30 outline-none transition-all ${darkMode ? 'bg-slate-950 border-slate-700 text-white focus:border-blue-500' : 'bg-white border-gray-200 text-slate-900 focus:border-blue-500 shadow-inner'}`;

  const preventInvalidInput = (e) => { if (['.', ',', 'e', 'E', '+', '-'].includes(e.key)) e.preventDefault(); };

  return (
    <div className={cardClass}>
      {!small && connector === 'left' && <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-4 h-[2px] bg-gray-300 dark:bg-slate-600"></div>}
      {!small && connector === 'right' && <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-4 h-[2px] bg-gray-300 dark:bg-slate-600"></div>}
      
      {!small && venueName && (<div className="bg-black/5 dark:bg-white/5 py-1 px-2 text-[9px] text-center font-bold uppercase text-gray-500 flex justify-center items-center gap-1"><MapPin size={10}/> {venueName}</div>)}
      
      {/* EQUIPO A */}
      <div className={`flex justify-between items-center ${small ? 'p-1' : 'p-3'} border-b-2 dark:border-slate-700/50 ${match.winner === match.teamA && match.winner ? 'bg-gradient-to-r from-green-500/10 to-transparent' : ''}`}>
        {/* <--- CAMBIO: 'flex-1' en lugar de 'max-w' fijo para que el texto ocupe todo el espacio libre */}
        <div className="flex items-center gap-3 overflow-hidden flex-1">
            <Flag name={match.teamA?.name} size={small ? "w-5 h-3" : "w-8 h-6 shadow-sm ring-1 ring-black/10"} />
            <span className={`truncate ${small ? '' : 'text-base'} ${match.winner === match.teamA ? winnerClass + ' text-green-600 dark:text-green-400' : 'font-bold'}`}>
                {match.teamA?.name || 'TBD'}
            </span>
        </div>
        <input type="number" className={inputClass} onKeyDown={preventInvalidInput} value={match.scoreA} onChange={(e) => updateMatch(round, index, 'scoreA', e.target.value)} />
      </div>

      {/* EQUIPO B */}
      <div className={`flex justify-between items-center ${small ? 'p-1' : 'p-3'} ${match.winner === match.teamB && match.winner ? 'bg-gradient-to-r from-green-500/10 to-transparent' : ''}`}>
        {/* <--- CAMBIO: 'flex-1' aquí también */}
        <div className="flex items-center gap-3 overflow-hidden flex-1">
            <Flag name={match.teamB?.name} size={small ? "w-5 h-3" : "w-8 h-6 shadow-sm ring-1 ring-black/10"} />
            <span className={`truncate ${small ? '' : 'text-base'} ${match.winner === match.teamB ? winnerClass + ' text-green-600 dark:text-green-400' : 'font-bold'}`}>
                {match.teamB?.name || 'TBD'}
            </span>
        </div>
        <input type="number" className={inputClass} onKeyDown={preventInvalidInput} value={match.scoreB} onChange={(e) => updateMatch(round, index, 'scoreB', e.target.value)} />
      </div>
      
      {showExtraTimeControls && (
        <div className={`p-1 ${small ? '' : 'bg-yellow-500/5 border-t-2'} border-dashed dark:border-slate-700 text-center`}>
           {!small && <div className="flex justify-center items-center gap-2 mb-1"><label className="flex items-center gap-1.5 cursor-pointer select-none group/check"><input type="checkbox" className="accent-yellow-500 scale-110" checked={match.isExtraTime} onChange={() => updateMatch(round, index, 'isExtraTime', !match.isExtraTime)} /><span className="font-bold text-yellow-600 uppercase text-[10px]">Prórroga (120')</span></label></div>}
           {match.isExtraTime && isDraw && (<div className="flex items-center justify-center gap-2 animate-fade-in mt-1"><div className="flex items-center gap-1"><span className="text-[10px] opacity-70 font-bold">P:</span><input type="number" className={`w-8 h-6 text-[10px] text-center rounded border ${darkMode ? 'bg-slate-900 border-slate-600' : 'bg-white'}`} placeholder="A" onKeyDown={preventInvalidInput} value={match.penA || ''} onChange={(e) => updateMatch(round, index, 'penA', e.target.value)} /></div><div className="flex items-center gap-1"><input type="number" className={`w-8 h-6 text-[10px] text-center rounded border ${darkMode ? 'bg-slate-900 border-slate-600' : 'bg-white'}`} placeholder="B" onKeyDown={preventInvalidInput} value={match.penB || ''} onChange={(e) => updateMatch(round, index, 'penB', e.target.value)} /></div></div>)}
        </div>
      )}
    </div>
  );
};

// --- COMPONENTE PRINCIPAL ---
export const KnockoutStage = ({ bracket, groups, updateMatch, darkMode, winner, thirdPlace, updateThirdPlace, onPrint, onSimulate, onClear, awards, setAwards }) => {
  const [isAwardsOpen, setIsAwardsOpen] = useState(false);
  // <--- CAMBIO: 'split' (TV) es ahora la vista por defecto
  const [viewMode, setViewMode] = useState('split'); 

  if(!bracket) return null;

  const allTeams = useMemo(() => {
      if (!groups) return [];
      return Object.values(groups).flat().map(t => t.name).sort();
  }, [groups]);

  const isAwardsComplete = awards.bestPlayer.name && awards.bestKeeper.name && awards.bestYoung.name && awards.bestGoal.name && awards.fairPlay && awards.topScorer.name && awards.topScorer.count && awards.topAssister.name && awards.topAssister.count && awards.topGA.name && awards.topGA.count;

  const handlePrintClick = () => {
    if(!isAwardsComplete) { setIsAwardsOpen(true); alert("¡Atención! Debes rellenar todos los premios en la ventana emergente antes de generar el PDF."); return; }
    onPrint();
  };

  const runnerUp = bracket?.final[0]?.winner === bracket?.final[0]?.teamA ? bracket?.final[0]?.teamB : bracket?.final[0]?.teamA;
  const thirdWinner = thirdPlace?.winner;

  // --- RENDERIZADORES ---

  // <--- CAMBIO: renderClassic es la "Vista 2" (Scroll)
  const renderClassic = () => (
    <div className="flex gap-16 w-max mx-auto px-8 mb-20 pt-8">
        {['16avos de Final', 'Octavos de Final', 'Cuartos de Final', 'Semifinales'].map((label, idx) => {
            const roundKey = ['r32', 'r16', 'qf', 'sf'][idx];
            return (<div key={roundKey} className="flex flex-col justify-around w-72"><h4 className={`text-center font-black mb-6 uppercase text-xs opacity-60 py-2 rounded-lg sticky top-0 backdrop-blur-sm z-10 tracking-widest ${darkMode ? 'bg-slate-800/80 text-white' : 'bg-gray-200/80 text-slate-800'}`}>{label}</h4>{bracket[roundKey].map((m, i) => <KnockoutMatch key={i} match={m} round={roundKey} index={i} updateMatch={updateMatch} darkMode={darkMode} />)}</div>);
        })}
        <div className="flex flex-col justify-center w-96 gap-16 pl-8 border-l-2 border-dashed border-gray-300 dark:border-slate-800"><div className="scale-110 origin-left"><h4 className="text-center font-black mb-6 uppercase text-sm text-yellow-600 bg-yellow-100 py-3 rounded-lg border-2 border-yellow-400 shadow-sm tracking-widest">GRAN FINAL</h4>{bracket.final.map((m, i) => <KnockoutMatch key={i} match={m} round="final" index={i} updateMatch={updateMatch} darkMode={darkMode} connector="left" />)}</div><div className="opacity-90 scale-100 origin-left"><h4 className="text-center font-bold mb-4 uppercase text-xs text-orange-600 bg-orange-100 py-2 rounded border border-orange-200">3er Puesto</h4>{thirdPlace && <KnockoutMatch match={thirdPlace} round="third" index={0} updateMatch={updateThirdPlace} darkMode={darkMode} connector="none" />}</div></div>
    </div>
  );

  // <--- CAMBIO: renderSplit es la "Vista 1" (TV)
  const renderSplit = () => (
    <div className="flex gap-12 w-max mx-auto px-8 pt-8 pb-20">
        <div className="flex gap-8">
            <div className="flex flex-col justify-around w-64"><h4 className="text-center font-black mb-4 opacity-50 uppercase text-xs">16avos</h4>{bracket.r32.slice(0, 8).map((m, i) => <KnockoutMatch key={i} match={m} round="r32" index={i} updateMatch={updateMatch} darkMode={darkMode} connector="none" />)}</div>
            <div className="flex flex-col justify-around w-64"><h4 className="text-center font-black mb-4 opacity-50 uppercase text-xs">Octavos</h4>{bracket.r16.slice(0, 4).map((m, i) => <KnockoutMatch key={i} match={m} round="r16" index={i} updateMatch={updateMatch} darkMode={darkMode} connector="left" />)}</div>
            <div className="flex flex-col justify-around w-64"><h4 className="text-center font-black mb-4 opacity-50 uppercase text-xs">Cuartos</h4>{bracket.qf.slice(0, 2).map((m, i) => <KnockoutMatch key={i} match={m} round="qf" index={i} updateMatch={updateMatch} darkMode={darkMode} connector="left" />)}</div>
            <div className="flex flex-col justify-around w-64"><h4 className="text-center font-black mb-4 opacity-50 uppercase text-xs">Semis</h4>{bracket.sf.slice(0, 1).map((m, i) => <KnockoutMatch key={i} match={m} round="sf" index={i} updateMatch={updateMatch} darkMode={darkMode} connector="left" />)}</div>
        </div>
        
        <div className="flex flex-col justify-center items-center w-96 gap-8 z-20 px-4 border-x-2 border-dashed border-gray-200 dark:border-slate-800">
            <div className="scale-125"><h4 className="text-center font-black mb-6 uppercase text-sm text-yellow-600 bg-yellow-100 py-2 rounded shadow">GRAN FINAL</h4>{bracket.final.map((m, i) => <KnockoutMatch key={i} match={m} round="final" index={i} updateMatch={updateMatch} darkMode={darkMode} connector="none" />)}</div>
            {winner && (<div className="text-center animate-fade-in mt-8"><img src={TROPHY_URL} alt="Trophy" className="h-40 mx-auto drop-shadow-2xl mb-4" /><h2 className="text-5xl font-black text-yellow-500 uppercase tracking-widest drop-shadow-sm">{winner.name}</h2></div>)}
            <div className="opacity-80 mt-12 w-full"><h4 className="text-center font-bold mb-2 uppercase text-xs text-orange-600 bg-orange-100 py-1 rounded">3er Puesto</h4>{thirdPlace && <KnockoutMatch match={thirdPlace} round="third" index={0} updateMatch={updateThirdPlace} darkMode={darkMode} connector="none" />}</div>
        </div>

        <div className="flex flex-row-reverse gap-8">
            <div className="flex flex-col justify-around w-64"><h4 className="text-center font-black mb-4 opacity-50 uppercase text-xs">16avos</h4>{bracket.r32.slice(8, 16).map((m, i) => <KnockoutMatch key={i} match={m} round="r32" index={i + 8} updateMatch={updateMatch} darkMode={darkMode} connector="none" />)}</div>
            <div className="flex flex-col justify-around w-64"><h4 className="text-center font-black mb-4 opacity-50 uppercase text-xs">Octavos</h4>{bracket.r16.slice(4, 8).map((m, i) => <KnockoutMatch key={i} match={m} round="r16" index={i + 4} updateMatch={updateMatch} darkMode={darkMode} connector="right" />)}</div>
            <div className="flex flex-col justify-around w-64"><h4 className="text-center font-black mb-4 opacity-50 uppercase text-xs">Cuartos</h4>{bracket.qf.slice(2, 4).map((m, i) => <KnockoutMatch key={i} match={m} round="qf" index={i + 2} updateMatch={updateMatch} darkMode={darkMode} connector="right" />)}</div>
            <div className="flex flex-col justify-around w-64"><h4 className="text-center font-black mb-4 opacity-50 uppercase text-xs">Semis</h4>{bracket.sf.slice(1, 2).map((m, i) => <KnockoutMatch key={i} match={m} round="sf" index={i + 1} updateMatch={updateMatch} darkMode={darkMode} connector="right" />)}</div>
        </div>
    </div>
  );

  const renderList = () => (
      <div className="max-w-4xl mx-auto grid gap-8 pb-20">
          <div className="p-6 rounded-xl border bg-opacity-50 bg-gray-50 dark:bg-slate-800 dark:border-slate-700 shadow-lg">
              <h3 className="font-black text-2xl mb-6 text-center flex items-center justify-center gap-2"><Trophy size={24} className="text-yellow-500" /> Gran Final</h3>
              {bracket.final.map((m, i) => <KnockoutMatch key={i} match={m} round="final" index={i} updateMatch={updateMatch} darkMode={darkMode} />)}
          </div>
          <div className="grid md:grid-cols-2 gap-4"><div className="p-4 rounded-xl border dark:border-slate-700"><h3 className="font-bold text-lg mb-3 text-center">Semifinales</h3><div className="space-y-2">{bracket.sf.map((m, i) => <KnockoutMatch key={i} match={m} round="sf" index={i} updateMatch={updateMatch} darkMode={darkMode} small />)}</div></div><div className="p-4 rounded-xl border dark:border-slate-700"><h3 className="font-bold text-lg mb-3 text-center">Cuartos</h3><div className="space-y-2">{bracket.qf.map((m, i) => <KnockoutMatch key={i} match={m} round="qf" index={i} updateMatch={updateMatch} darkMode={darkMode} small />)}</div></div></div>
          <div className="grid md:grid-cols-2 gap-4"><div className="p-4 rounded-xl border dark:border-slate-700"><h3 className="font-bold text-lg mb-3 text-center">Octavos</h3><div className="space-y-2">{bracket.r16.map((m, i) => <KnockoutMatch key={i} match={m} round="r16" index={i} updateMatch={updateMatch} darkMode={darkMode} small />)}</div></div><div className="p-4 rounded-xl border dark:border-slate-700"><h3 className="font-bold text-lg mb-3 text-center">16avos</h3><div className="space-y-2">{bracket.r32.map((m, i) => <KnockoutMatch key={i} match={m} round="r32" index={i} updateMatch={updateMatch} darkMode={darkMode} small />)}</div></div></div>
      </div>
  );

  return (
    <div className="overflow-x-auto pb-12 animate-fade-in pl-6 pr-6 min-h-[80vh]">
      <div className={`flex flex-col xl:flex-row justify-between items-center mb-10 sticky left-0 px-6 py-4 z-20 border-b shadow-md rounded-xl mt-2 backdrop-blur-md ${darkMode ? 'bg-slate-950/90 border-slate-800' : 'bg-white/90 border-gray-200'}`}>
          <div className="mb-4 xl:mb-0">
            <h2 className="text-3xl font-black tracking-tight">Fase Eliminatoria</h2>
            <p className="text-sm opacity-60">Camino a la gran final</p>
          </div>
          <div className={`flex bg-gray-100 dark:bg-slate-800 p-1 rounded-lg mr-4 ${darkMode ? 'border-slate-700' : 'border-gray-200'} border`}>
              {/* <--- CAMBIO: Iconos intercambiados en lógica (LayoutTemplate = Split, Columns = Classic) */}
              <button onClick={() => setViewMode('split')} className={`p-2 rounded-md transition ${viewMode === 'split' ? 'bg-white dark:bg-slate-600 shadow text-purple-500' : 'opacity-50'}`} title="Vista TV (Split)"><LayoutTemplate size={20} /></button>
              <button onClick={() => setViewMode('classic')} className={`p-2 rounded-md transition ${viewMode === 'classic' ? 'bg-white dark:bg-slate-600 shadow text-blue-500' : 'opacity-50'}`} title="Vista Clásica"><Columns size={20} /></button>
              <button onClick={() => setViewMode('list')} className={`p-2 rounded-md transition ${viewMode === 'list' ? 'bg-white dark:bg-slate-600 shadow text-green-500' : 'opacity-50'}`} title="Vista Resumen"><List size={20} /></button>
          </div>
          <div className="flex gap-3 flex-wrap justify-center">
              <button onClick={() => setIsAwardsOpen(true)} className={`px-4 py-2 rounded-lg flex items-center gap-2 transition shadow-lg font-bold border-2 ${isAwardsComplete ? 'bg-yellow-500/10 border-yellow-500 text-yellow-600 hover:bg-yellow-500 hover:text-white' : 'bg-red-500 text-white border-red-500 animate-pulse'}`}><Trophy size={18} /> {isAwardsComplete ? 'Editar' : 'Premios'}</button>
              <button onClick={onClear} className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition hover:scale-105 active:scale-95 border ${darkMode ? 'bg-slate-800 border-red-500/50 text-red-400 hover:bg-red-500/10' : 'bg-white border-red-200 text-red-500 hover:bg-red-50'}`} title="Borrar Resultados"><Eraser size={18} /></button>
              <button onClick={onSimulate} className="bg-purple-600 text-white px-5 py-2 rounded-lg flex items-center gap-2 hover:bg-purple-700 transition shadow-lg hover:scale-105 font-bold"><Zap size={18} fill="currentColor" /> Simular</button>
              <button onClick={handlePrintClick} className={`text-white px-5 py-2 rounded-lg flex items-center gap-2 transition shadow-lg font-bold ${isAwardsComplete ? 'bg-slate-800 hover:bg-black' : 'bg-gray-400 cursor-not-allowed'}`}><Download size={18} /> PDF</button>
          </div>
      </div>

      {winner && viewMode !== 'list' && viewMode !== 'split' && (
        <div className="flex flex-col items-center justify-center p-8 mb-16 bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-500 rounded-2xl text-white animate-bounce-in shadow-2xl max-w-4xl mx-auto border-4 border-white sticky left-0 right-0 z-10 transform">
           <img src={TROPHY_URL} alt="Trophy" className="h-40 drop-shadow-lg mb-6" />
           <h2 className="text-6xl font-black uppercase tracking-widest drop-shadow-md mb-2">CAMPEÓN 2026</h2>
           <div className="flex items-center gap-6 bg-white/20 px-12 py-4 rounded-full backdrop-blur-sm shadow-inner mb-8">
             <Flag name={winner.name} size="w-16 h-12 shadow-lg" /> <span className="text-5xl font-black">{winner.name}</span>
           </div>
           <div className="grid grid-cols-3 gap-8 w-full mt-4 pt-6 border-t border-white/30">
                <div className="text-center opacity-90 translate-y-4"><div className="text-xs font-bold uppercase mb-2">Subcampeón</div>{runnerUp && <Flag name={runnerUp.name} size="w-10 h-7 mx-auto shadow mb-1" />}<div className="font-bold text-lg">{runnerUp?.name}</div></div>
                <div className="text-center scale-110 font-black text-yellow-100"><div className="text-xs font-bold uppercase mb-2">Ganador</div><div className="text-2xl">🥇</div></div>
                <div className="text-center opacity-90 translate-y-6"><div className="text-xs font-bold uppercase mb-2">3er Lugar</div>{thirdWinner && <Flag name={thirdWinner.name} size="w-10 h-7 mx-auto shadow mb-1" />}<div className="font-bold text-lg">{thirdWinner?.name}</div></div>
           </div>
        </div>
      )}

      {viewMode === 'classic' && renderClassic()}
      {viewMode === 'split' && renderSplit()}
      {viewMode === 'list' && renderList()}

      <AwardsModal isOpen={isAwardsOpen} onClose={() => setIsAwardsOpen(false)} awards={awards} setAwards={setAwards} teams={allTeams} darkMode={darkMode} />
    </div>
  );
};