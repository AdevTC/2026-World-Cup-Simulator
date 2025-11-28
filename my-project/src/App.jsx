import React, { useState, useEffect } from 'react';
import { User, Play, Shuffle, CalendarCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { TROPHY_URL } from './data/constants';
import { generateStructure, generateRealStructure, generateMatches, generateKnockoutBracket, getBestThirdsList, simulateMatchResult } from './utils/logic';
import { Header } from './components/Header';
import { PlayoffSelector } from './components/PlayoffSelector';
import { GroupStage } from './components/GroupStage';
import { KnockoutStage } from './components/KnockoutStage';
import { PrintView } from './components/PrintView';
import { TutorialModal } from './components/TutorialModal';
import { StatsView } from './components/StatsView';
import { ConfirmModal } from './components/ui/ConfirmModal'; // <--- IMPORTAR MODAL

// ... (TUTORIAL_STEPS igual que antes) ...
const TUTORIAL_STEPS = {
  landing: { title: "¡Bienvenido al Mundial!", emoji: "🌍", text: "Estás a punto de simular el Mundial 2026.\n\nPara comenzar, simplemente ingresa tu nombre de usuario." },
  mode_select: { title: "Elige tu Camino", emoji: "🛣️", text: "• Sorteo Aleatorio: Genera grupos nuevos al azar.\n• Sorteo Oficial: Juega con los grupos reales (5 Dic)." },
  config: { title: "Repechajes", emoji: "🎟️", text: "Predice quién ganará los últimos playoffs." },
  groups: { title: "Fase de Grupos", emoji: "📊", text: "Gestiona los resultados. Clasifican los 2 primeros y los 8 mejores terceros." },
  knockout: { title: "Fase Final", emoji: "🏆", text: "Simula los partidos hasta la Final y elige los Premios. ¡Usa 'Simular' para ver la animación!" },
  print: { title: "Reporte Oficial", emoji: "📄", text: "Tu resumen completo para guardar o imprimir." },
  stats: { title: "Centro de Datos", emoji: "📈", text: "Consulta tus estadísticas." }
};

export default function App() {
  // ... (Estados iguales) ...
  const [darkMode, setDarkMode] = useState(true);
  const [userName, setUserName] = useState(() => localStorage.getItem('wc26_userName') || '');
  const [view, setView] = useState(() => localStorage.getItem('wc26_view') || 'landing');
  const [simulationMode, setSimulationMode] = useState(() => localStorage.getItem('wc26_simulationMode') || 'random');
  const [previousView, setPreviousView] = useState(null);

  const [groups, setGroups] = useState(() => JSON.parse(localStorage.getItem('wc26_groups')) || null);
  const [matches, setMatches] = useState(() => JSON.parse(localStorage.getItem('wc26_matches')) || null);
  const [qualified, setQualified] = useState(() => JSON.parse(localStorage.getItem('wc26_qualified')) || null);
  const [bracket, setBracket] = useState(() => JSON.parse(localStorage.getItem('wc26_bracket')) || null);
  const [thirdPlace, setThirdPlace] = useState(() => JSON.parse(localStorage.getItem('wc26_thirdPlace')) || null);
  const [winner, setWinner] = useState(() => JSON.parse(localStorage.getItem('wc26_winner')) || null);
  
  const [awards, setAwards] = useState(() => {
    const saved = JSON.parse(localStorage.getItem('wc26_awards'));
    const defaultAwards = { bestPlayer: { name: '', team: '' }, bestKeeper: { name: '', team: '' }, bestYoung: { name: '', team: '' }, bestGoal: { name: '', team: '' }, fairPlay: '', topScorer: { name: '', team: '', count: '' }, topAssister: { name: '', team: '', count: '' }, topGA: { name: '', team: '', count: '' } };
    if (!saved) return defaultAwards;
    if (typeof saved.bestPlayer === 'string') return { ...defaultAwards, ...saved, bestPlayer: { name: saved.bestPlayer || '', team: '' } }; 
    return saved;
  });

  const [stats, setStats] = useState(() => JSON.parse(localStorage.getItem('wc26_stats')) || { visits: 0, downloads: 0 });
  const [showTutorial, setShowTutorial] = useState(false);
  const [seenTutorials, setSeenTutorials] = useState(() => JSON.parse(localStorage.getItem('wc26_seen_tutorials')) || []);

  // <--- NUEVO ESTADO PARA EL MODAL DE CONFIRMACIÓN --->
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    isDestructive: false
  });

  const isRealDrawEnabled = new Date() >= new Date('2025-12-05');

  // ... (Efectos iguales) ...
  useEffect(() => {
    const sessionVisit = sessionStorage.getItem('wc26_session_visit');
    if (!sessionVisit) {
        const newStats = { ...stats, visits: stats.visits + 1 };
        setStats(newStats);
        localStorage.setItem('wc26_stats', JSON.stringify(newStats));
        sessionStorage.setItem('wc26_session_visit', 'true');
    }
  }, []);

  useEffect(() => { localStorage.setItem('wc26_userName', userName); }, [userName]);
  useEffect(() => { localStorage.setItem('wc26_view', view); }, [view]);
  useEffect(() => { localStorage.setItem('wc26_simulationMode', simulationMode); }, [simulationMode]);
  useEffect(() => { if(groups) localStorage.setItem('wc26_groups', JSON.stringify(groups)); }, [groups]);
  useEffect(() => { if(matches) localStorage.setItem('wc26_matches', JSON.stringify(matches)); }, [matches]);
  useEffect(() => { if(qualified) localStorage.setItem('wc26_qualified', JSON.stringify(qualified)); }, [qualified]);
  useEffect(() => { if(bracket) localStorage.setItem('wc26_bracket', JSON.stringify(bracket)); }, [bracket]);
  useEffect(() => { if(thirdPlace) localStorage.setItem('wc26_thirdPlace', JSON.stringify(thirdPlace)); }, [thirdPlace]);
  useEffect(() => { if(winner) localStorage.setItem('wc26_winner', JSON.stringify(winner)); }, [winner]);
  useEffect(() => { localStorage.setItem('wc26_awards', JSON.stringify(awards)); }, [awards]);
  useEffect(() => { localStorage.setItem('wc26_stats', JSON.stringify(stats)); }, [stats]);

  useEffect(() => {
    if (TUTORIAL_STEPS[view] && !seenTutorials.includes(view)) {
      setShowTutorial(true);
    }
  }, [view, seenTutorials]);

  const handleCloseTutorial = () => {
    setShowTutorial(false);
    if (!seenTutorials.includes(view)) {
      const newSeenList = [...seenTutorials, view];
      setSeenTutorials(newSeenList);
      localStorage.setItem('wc26_seen_tutorials', JSON.stringify(newSeenList));
    }
  };

  // <--- HELPER PARA ABRIR MODAL --->
  const openConfirm = (title, message, onConfirm, isDestructive = false) => {
      setConfirmModal({ isOpen: true, title, message, onConfirm, isDestructive });
  };

  // --- ACCIONES REEMPLAZADAS CON EL NUEVO MODAL ---

  const handleFullReset = () => {
      openConfirm(
          "¿Reiniciar toda la aplicación?",
          "Volverás a la pantalla de inicio y perderás todo el progreso (sorteo, resultados y premios).",
          () => {
              localStorage.clear();
              window.location.reload();
          },
          true
      );
  };

  const handleClearGroups = () => {
      openConfirm(
          "¿Borrar resultados de Grupos?",
          "Se eliminarán todos los marcadores de la fase de grupos. El sorteo de equipos se mantendrá.",
          () => {
              if (matches) {
                const resetMatches = { ...matches };
                Object.keys(resetMatches).forEach(g => {
                    resetMatches[g] = resetMatches[g].map(m => ({ ...m, scoreA: '', scoreB: '' }));
                });
                setMatches(resetMatches);
              }
          },
          true
      );
  };

  const handleClearKnockout = () => {
      openConfirm(
          "¿Reiniciar Fase Final?",
          "Se borrará todo el cuadro de eliminatorias, el campeón y los premios.",
          () => {
              if (qualified && groups) {
                 const initialBracket = generateKnockoutBracket(groups, qualified.bestThirds);
                 setBracket(initialBracket);
              }
              setWinner(null);
              setThirdPlace({ teamA: null, teamB: null, scoreA: '', scoreB: '', penA: '', penB: '', isExtraTime: false, winner: null });
          },
          true
      );
  };

  const handleBack = () => {
    if (view === 'mode_select') setView('landing');
    else if (view === 'config') setView('mode_select');
    else if (view === 'groups') {
        openConfirm(
            "¿Volver a la Configuración?",
            "Si vuelves atrás, se perderá el sorteo actual y tendrás que generar los grupos de nuevo.",
            () => setView('config'),
            true
        );
    }
    else if (view === 'knockout') setView('groups');
    else if (view === 'print') setView('knockout');
  };

  const handleStart = () => { if(userName.trim().length > 0) setView('mode_select'); };
  const selectMode = (mode) => { setSimulationMode(mode); setView('config'); };
  
  const runDraw = (playoffSelections) => {
    let rawGroups = simulationMode === 'real' ? generateRealStructure(playoffSelections) : generateStructure(Object.values(playoffSelections));
    setGroups(rawGroups);
    setMatches(generateMatches(rawGroups));
    setView('groups');
  };

  // ... (Resto de efectos y funciones lógicas igual) ...
  useEffect(() => {
    if (view !== 'groups' || !groups || !matches) return;
    const newG = { ...groups };
    Object.keys(newG).forEach(k => {
      const currentOrder = newG[k].map(t => t.name);
      newG[k] = newG[k].map(t => ({ ...t, played: 0, w:0, d:0, l:0, gf:0, ga:0, gd:0, pts:0 }));
      matches[k].forEach(m => {
        if(m.scoreA !== '' && m.scoreB !== '') {
          const sA = parseInt(m.scoreA);
          const sB = parseInt(m.scoreB);
          const tA = newG[k].find(t => t.name === m.teamA);
          const tB = newG[k].find(t => t.name === m.teamB);
          if(tA && tB) {
             tA.played++; tB.played++;
             tA.gf+=sA; tA.ga+=sB; tA.gd=tA.gf-tA.ga;
             tB.gf+=sB; tB.ga+=sA; tB.gd=tB.gf-tB.ga;
             if(sA>sB) { tA.w++; tA.pts+=3; tB.l++; }
             else if(sB>sA) { tB.w++; tB.pts+=3; tA.l++; }
             else { tA.d++; tA.pts+=1; tB.d++; tB.pts+=1; }
          }
        }
      });
      newG[k].sort((a,b) => {
         if (b.pts !== a.pts) return b.pts - a.pts;
         if (b.gd !== a.gd) return b.gd - a.gd;
         if (b.gf !== a.gf) return b.gf - a.gf;
         return currentOrder.indexOf(a.name) - currentOrder.indexOf(b.name);
      });
    });
    setGroups(newG);
  }, [matches]);

  const goToKnockout = () => {
    const bestThirds = getBestThirdsList(groups);
    const newBracket = generateKnockoutBracket(groups, bestThirds);
    setBracket(newBracket);
    setThirdPlace({ teamA: null, teamB: null, scoreA: '', scoreB: '', penA: '', penB: '', isExtraTime: false, winner: null });
    setWinner(null);
    setQualified({ bestThirds });
    setView('knockout');
  };

  const updateBracketMatch = (round, index, field, value) => {
    const newB = { ...bracket };
    const m = newB[round][index];
    m[field] = value;
    if (m.scoreA !== '' && m.scoreB !== '') {
      const sA = parseInt(m.scoreA);
      const sB = parseInt(m.scoreB);
      if (sA > sB) m.winner = m.teamA;
      else if (sB > sA) m.winner = m.teamB;
      else {
        if (m.penA !== '' && m.penB !== '') {
           if (parseInt(m.penA) > parseInt(m.penB)) m.winner = m.teamA;
           else if (parseInt(m.penB) > parseInt(m.penA)) m.winner = m.teamB;
        } else m.winner = null;
      }
    }
    let nextRound = '', nextIdx = Math.floor(index / 2), pos = index % 2 === 0 ? 'teamA' : 'teamB';
    if (round === 'r32') nextRound = 'r16';
    if (round === 'r16') nextRound = 'qf';
    if (round === 'qf') nextRound = 'sf';
    if (round === 'sf') nextRound = 'final';

    if (nextRound && m.winner) newB[nextRound][nextIdx][pos] = m.winner;
    
    if (round === 'sf' && newB.sf[0].winner && newB.sf[1].winner) {
       const loser1 = newB.sf[0].winner === newB.sf[0].teamA ? newB.sf[0].teamB : newB.sf[0].teamA;
       const loser2 = newB.sf[1].winner === newB.sf[1].teamA ? newB.sf[1].teamB : newB.sf[1].teamA;
       setThirdPlace(prev => ({ ...prev, teamA: loser1, teamB: loser2 }));
    }
    if (round === 'final' && m.winner) {
        setWinner(m.winner);
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#FFD700', '#FFA500', '#ffffff'] });
    }
    setBracket(newB);
  };

  const updateThirdPlaceMatch = (round, index, field, value) => {
     setThirdPlace(prev => {
       const m = { ...prev, [field]: value };
       if (m.scoreA !== '' && m.scoreB !== '') {
           const sA = parseInt(m.scoreA);
           const sB = parseInt(m.scoreB);
           if(sA > sB) m.winner = m.teamA;
           else if(sB > sA) m.winner = m.teamB;
           else if (m.penA !== '' && m.penB !== '') m.winner = parseInt(m.penA) > parseInt(m.penB) ? m.teamA : m.teamB;
       }
       return m;
     });
  };

  const handlePrintView = () => {
      const newStats = { ...stats, downloads: stats.downloads + 1 };
      setStats(newStats);
      setView('print');
  };

  const handleSimulateKnockout = async () => {
    if (!bracket) return;
    let currentBracket = JSON.parse(JSON.stringify(bracket));
    let currentThird = { ...thirdPlace };
    
    const simulateRound = async (roundName, nextRoundName) => {
        const matchesToSim = currentBracket[roundName].map((m, idx) => ({ ...m, originalIdx: idx })).filter(m => m.teamA && m.teamB && !m.winner);
        for (const m of matchesToSim) {
            const res = simulateMatchResult(m.teamA.name, m.teamB.name);
            const matchRef = currentBracket[roundName][m.originalIdx];
            Object.assign(matchRef, res);
            
            if (matchRef.scoreA > matchRef.scoreB) matchRef.winner = matchRef.teamA;
            else if (matchRef.scoreB > matchRef.scoreA) matchRef.winner = matchRef.teamB;
            else if (matchRef.penA > matchRef.penB) matchRef.winner = matchRef.teamA;
            else matchRef.winner = matchRef.teamB;

            if (nextRoundName) {
                const nextIdx = Math.floor(m.originalIdx / 2);
                const pos = m.originalIdx % 2 === 0 ? 'teamA' : 'teamB';
                currentBracket[nextRoundName][nextIdx][pos] = matchRef.winner;
            }
            setBracket({ ...currentBracket });
            await new Promise(r => setTimeout(r, 200));
        }
    };

    await simulateRound('r32', 'r16');
    await simulateRound('r16', 'qf');
    await simulateRound('qf', 'sf');
    await simulateRound('sf', 'final');

    if (currentBracket.sf[0].winner && currentBracket.sf[1].winner) {
        const loser1 = currentBracket.sf[0].winner === currentBracket.sf[0].teamA ? currentBracket.sf[0].teamB : currentBracket.sf[0].teamA;
        const loser2 = currentBracket.sf[1].winner === currentBracket.sf[1].teamA ? currentBracket.sf[1].teamB : currentBracket.sf[1].teamA;
        currentThird.teamA = loser1;
        currentThird.teamB = loser2;
        
        if (!currentThird.winner) {
             const res = simulateMatchResult(loser1.name, loser2.name);
             currentThird = { ...currentThird, ...res };
             if (currentThird.scoreA > currentThird.scoreB) currentThird.winner = currentThird.teamA;
             else if (currentThird.scoreB > currentThird.scoreA) currentThird.winner = currentThird.teamB;
             else if (currentThird.penA > currentThird.penB) currentThird.winner = currentThird.teamA;
             else currentThird.winner = currentThird.teamB;
             setThirdPlace(currentThird);
             await new Promise(r => setTimeout(r, 400));
        }
    }

    const finalMatch = currentBracket.final[0];
    if (finalMatch.teamA && finalMatch.teamB && !finalMatch.winner) {
        const res = simulateMatchResult(finalMatch.teamA.name, finalMatch.teamB.name);
        Object.assign(finalMatch, res);
        if (finalMatch.scoreA > finalMatch.scoreB) finalMatch.winner = finalMatch.teamA;
        else if (finalMatch.scoreB > finalMatch.scoreA) finalMatch.winner = finalMatch.teamB;
        else if (finalMatch.penA > finalMatch.penB) finalMatch.winner = finalMatch.teamA;
        else finalMatch.winner = finalMatch.teamB;
        setBracket({ ...currentBracket });
        setWinner(finalMatch.winner);
        confetti({ particleCount: 300, spread: 120, origin: { y: 0.6 }, colors: ['#FFD700', '#FFA500', '#ffffff'] });
    }
  };

  return (
    <div className={`min-h-screen font-sans ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'} transition-colors`}>
      <style>{`
        .champion-text { background: linear-gradient(to bottom, #FFD700, #FDB931, #FFD700); background-clip: text; -webkit-text-fill-color: transparent; text-shadow: 0px 1px 2px rgba(0,0,0,0.2); }
        .animate-fade-in { animation: fadeIn 0.5s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <TutorialModal isOpen={showTutorial} onClose={handleCloseTutorial} content={TUTORIAL_STEPS[view]} />
      
      {/* <--- MODAL GLOBAL RENDERIZADO AQUÍ ---> */}
      <ConfirmModal 
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        isDestructive={confirmModal.isDestructive}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        darkMode={darkMode}
      />

      {view !== 'print' && (
        <Header 
            darkMode={darkMode} 
            setDarkMode={setDarkMode} 
            reset={handleFullReset} 
            view={view} 
            onClearData={() => {}} 
            onViewStats={() => { setPreviousView(view); setView('stats'); }}
            onBack={handleBack} 
        />
      )}

      {/* ... (El resto del JSX se mantiene idéntico, ya pasamos los handlers arriba) ... */}
      
      {view === 'landing' && (
         <div className="flex flex-col items-center justify-center min-h-[80vh] gap-8 p-6 text-center animate-fade-in">
            <img src={TROPHY_URL} className="h-48 drop-shadow-2xl animate-pulse" alt="World Cup"/>
            <h1 className="text-6xl font-black italic bg-gradient-to-br from-indigo-500 to-fuchsia-500 bg-clip-text text-transparent">MUNDIAL 2026</h1>
            <p className="text-xl max-w-2xl opacity-75">Simulador Profesional: 48 Equipos, Repechajes, 8 Mejores Terceros y Final en New Jersey.</p>
            <div className="flex flex-col gap-2 w-full max-w-md">
                <label className="text-sm font-bold opacity-70 flex items-center gap-2"><User size={16}/> INGRESA TU NOMBRE</label>
                <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="Ej: StreamerPro" className={`p-4 rounded-xl font-bold text-center text-xl shadow-inner focus:ring-4 ring-blue-500 outline-none ${darkMode ? 'text-black bg-white' : 'text-black bg-white border'}`} />
            </div>
            <button onClick={handleStart} disabled={userName.trim().length === 0} className={`group relative px-8 py-4 rounded-full font-bold text-xl shadow-xl transition-all ${userName.trim().length > 0 ? 'bg-blue-600 hover:bg-blue-500 hover:scale-105 text-white' : 'bg-gray-500 opacity-50 cursor-not-allowed text-gray-300'}`}>
               <div className="flex items-center gap-3"><Play size={24} fill="currentColor" /> SIGUIENTE</div>
            </button>
         </div>
      )}

      {view === 'mode_select' && (
          <div className="flex flex-col items-center justify-center min-h-[70vh] gap-8 p-4 animate-fade-in">
              <h2 className="text-4xl font-black mb-4">Elige tu Simulación</h2>
              <div className="grid md:grid-cols-2 gap-8 max-w-4xl w-full">
                  <button onClick={() => selectMode('random')} className={`p-8 rounded-2xl border-2 flex flex-col items-center gap-4 transition-all hover:scale-105 ${darkMode ? 'bg-slate-900 border-blue-500 hover:bg-slate-800' : 'bg-white border-blue-500 hover:bg-blue-50 shadow-lg'}`}><div className="bg-blue-100 p-4 rounded-full text-blue-600"><Shuffle size={48} /></div><h3 className="text-2xl font-bold">Sorteo Aleatorio</h3><p className="opacity-70 text-center">Simula un sorteo nuevo basado en los bombos oficiales de la FIFA.</p></button>
                  <button onClick={() => isRealDrawEnabled && selectMode('real')} disabled={!isRealDrawEnabled} className={`relative p-8 rounded-2xl border-2 flex flex-col items-center gap-4 transition-all ${isRealDrawEnabled ? 'hover:scale-105 cursor-pointer' : 'opacity-50 cursor-not-allowed grayscale'} ${darkMode ? 'bg-slate-900 border-green-500' : 'bg-white border-green-500 shadow-lg'}`}>{!isRealDrawEnabled && (<div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">Disponible 5 Dic</div>)}<div className="bg-green-100 p-4 rounded-full text-green-600"><CalendarCheck size={48} /></div><h3 className="text-2xl font-bold">Sorteo Oficial</h3><p className="opacity-70 text-center">Usa los grupos reales definidos en el sorteo del 5 de Diciembre.</p></button>
              </div>
          </div>
      )}

      {view === 'config' && <PlayoffSelector onComplete={runDraw} darkMode={darkMode} />}

      {view === 'groups' && groups && (
        <GroupStage 
          groups={groups} 
          matches={matches} 
          setMatches={setMatches} 
          setGroups={setGroups}
          onNext={goToKnockout} 
          onClear={handleClearGroups} 
          darkMode={darkMode}
        />
      )}

      {view === 'knockout' && bracket && (
        <KnockoutStage 
           bracket={bracket} 
           groups={groups}
           updateMatch={updateBracketMatch} 
           darkMode={darkMode} 
           winner={winner}
           thirdPlace={thirdPlace}
           updateThirdPlace={updateThirdPlaceMatch}
           onPrint={handlePrintView}
           onSimulate={handleSimulateKnockout}
           onClear={handleClearKnockout} 
           awards={awards} 
           setAwards={setAwards}
        />
      )}

      {view === 'print' && (
        <PrintView groups={groups} bracket={bracket} winner={winner} thirdPlace={thirdPlace} userName={userName} awards={awards} onBack={() => setView('knockout')} />
      )}

      {view === 'stats' && (
          <StatsView stats={stats} onBack={() => { setView(previousView || 'landing'); setPreviousView(null); }} darkMode={darkMode} />
      )}
    </div>
  );
}