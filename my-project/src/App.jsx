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

// --- DATOS DEL TUTORIAL ---
const TUTORIAL_STEPS = {
  landing: {
    title: "¡Bienvenido al Mundial!",
    emoji: "🌍",
    text: "Estás a punto de simular el Mundial 2026.\n\nPara comenzar, simplemente ingresa tu nombre de usuario. Esto personalizará tu experiencia y aparecerá en el reporte final oficial."
  },
  mode_select: {
    title: "Elige tu Camino",
    emoji: "🛣️",
    text: "• Sorteo Aleatorio: Genera grupos nuevos al azar basados en los bombos oficiales.\n\n• Sorteo Oficial: Juega con los grupos reales confirmados por la FIFA (Opción disponible a partir del 5 de Dic)."
  },
  config: {
    title: "Repechajes Pendientes",
    emoji: "🎟️",
    text: "Antes de sortear, necesitamos definir los últimos clasificados.\n\nPredice quién ganará los playoffs de la UEFA y los duelos intercontinentales para completar los 48 equipos."
  },
  groups: {
    title: "Fase de Grupos",
    emoji: "📊",
    text: "Gestiona los resultados de los 12 grupos.\n\n• Escribe los marcadores manualmente o usa 'Simular Todo' para ir rápido.\n• ¡Ojo! Clasifican los 2 primeros y los 8 mejores terceros."
  },
  knockout: {
    title: "Fase Final",
    emoji: "🏆",
    text: "¡El camino a la gloria!\n\n1. Simula los partidos hasta la Gran Final.\n2. Haz clic en '🏆 Premios' para elegir al MVP, Bota de Oro y más.\n3. Finalmente, genera tu PDF oficial."
  },
  print: {
    title: "Tu Reporte Oficial",
    emoji: "📄",
    text: "¡Enhorabuena! Aquí tienes el resumen completo de tu torneo.\n\nSe abrirá la ventana de impresión del navegador automáticamente. Puedes guardar el reporte como PDF o imprimirlo en papel."
  }
};

export default function App() {
  // --- ESTADOS CON PERSISTENCIA ---
  const [darkMode, setDarkMode] = useState(true);
  
  const [userName, setUserName] = useState(() => localStorage.getItem('wc26_userName') || '');
  const [view, setView] = useState(() => localStorage.getItem('wc26_view') || 'landing');
  const [simulationMode, setSimulationMode] = useState(() => localStorage.getItem('wc26_simulationMode') || 'random');
  
  const [groups, setGroups] = useState(() => JSON.parse(localStorage.getItem('wc26_groups')) || null);
  const [matches, setMatches] = useState(() => JSON.parse(localStorage.getItem('wc26_matches')) || null);
  
  // <--- ESTADO RECUPERADO (Era el causante del error)
  const [qualified, setQualified] = useState(() => JSON.parse(localStorage.getItem('wc26_qualified')) || null);
  
  const [bracket, setBracket] = useState(() => JSON.parse(localStorage.getItem('wc26_bracket')) || null);
  const [thirdPlace, setThirdPlace] = useState(() => JSON.parse(localStorage.getItem('wc26_thirdPlace')) || null);
  const [winner, setWinner] = useState(() => JSON.parse(localStorage.getItem('wc26_winner')) || null);
  
  const [awards, setAwards] = useState(() => JSON.parse(localStorage.getItem('wc26_awards')) || {
    bestPlayer: { name: '', team: '' },
    bestKeeper: { name: '', team: '' },
    bestYoung: { name: '', team: '' },
    bestGoal: { name: '', team: '' },
    fairPlay: '', 
    topScorer: { name: '', team: '', count: '' },
    topAssister: { name: '', team: '', count: '' },
    topGA: { name: '', team: '', count: '' }
  });

  // Tutorial
  const [showTutorial, setShowTutorial] = useState(false);
  const [seenTutorials, setSeenTutorials] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('wc26_seen_tutorials');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const isRealDrawEnabled = new Date() >= new Date('2025-12-05');

  // --- EFECTOS DE GUARDADO AUTOMÁTICO ---
  useEffect(() => { localStorage.setItem('wc26_userName', userName); }, [userName]);
  useEffect(() => { localStorage.setItem('wc26_view', view); }, [view]);
  useEffect(() => { localStorage.setItem('wc26_simulationMode', simulationMode); }, [simulationMode]);
  useEffect(() => { if(groups) localStorage.setItem('wc26_groups', JSON.stringify(groups)); }, [groups]);
  useEffect(() => { if(matches) localStorage.setItem('wc26_matches', JSON.stringify(matches)); }, [matches]);
  // Guardamos qualified también
  useEffect(() => { if(qualified) localStorage.setItem('wc26_qualified', JSON.stringify(qualified)); }, [qualified]);
  useEffect(() => { if(bracket) localStorage.setItem('wc26_bracket', JSON.stringify(bracket)); }, [bracket]);
  useEffect(() => { if(thirdPlace) localStorage.setItem('wc26_thirdPlace', JSON.stringify(thirdPlace)); }, [thirdPlace]);
  useEffect(() => { if(winner) localStorage.setItem('wc26_winner', JSON.stringify(winner)); }, [winner]);
  useEffect(() => { localStorage.setItem('wc26_awards', JSON.stringify(awards)); }, [awards]);

  // --- LÓGICA TUTORIAL ---
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

  // --- NUEVA LÓGICA: LIMPIAR RESULTADOS (Soft Reset) ---
  const handleClearData = () => {
      if(window.confirm("¿Quieres reiniciar los resultados? Se borrarán los marcadores y la fase final, pero se mantendrán los grupos sorteados.")) {
          // 1. Limpiar marcadores de grupos
          if (matches) {
            const resetMatches = { ...matches };
            Object.keys(resetMatches).forEach(g => {
                resetMatches[g] = resetMatches[g].map(m => ({ ...m, scoreA: '', scoreB: '' }));
            });
            setMatches(resetMatches);
          }
          
          // 2. Borrar toda la fase final y premios
          setBracket(null);
          setQualified(null);
          setWinner(null);
          setThirdPlace(null);
          setAwards({
            bestPlayer: { name: '', team: '' },
            bestKeeper: { name: '', team: '' },
            bestYoung: { name: '', team: '' },
            bestGoal: { name: '', team: '' },
            fairPlay: '', 
            topScorer: { name: '', team: '', count: '' },
            topAssister: { name: '', team: '', count: '' },
            topGA: { name: '', team: '', count: '' }
          });

          // 3. Volver a la vista de grupos
          setView('groups');
      }
  };

  const handleStart = () => {
      if(userName.trim().length > 0) setView('mode_select');
  };

  const selectMode = (mode) => {
      setSimulationMode(mode);
      setView('config');
  };

  const runDraw = (playoffSelections) => {
    let rawGroups;
    if (simulationMode === 'real') {
        rawGroups = generateRealStructure(playoffSelections);
    } else {
        rawGroups = generateStructure(Object.values(playoffSelections));
    }
    setGroups(rawGroups);
    setMatches(generateMatches(rawGroups));
    setView('groups');
  };

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
    setQualified({ bestThirds }); // ¡ESTO AHORA FUNCIONARÁ!
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
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#FFD700', '#FFA500', '#ffffff']
        });
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

  const handleSimulateKnockout = () => {
    if (!bracket) return;
    const newB = { ...bracket };
    
    const processRound = (roundName, nextRoundName) => {
        newB[roundName].forEach((m, idx) => {
            if (m.teamA && m.teamB && !m.winner) {
                const res = simulateMatchResult(m.teamA.name, m.teamB.name);
                m.scoreA = res.scoreA;
                m.scoreB = res.scoreB;
                m.penA = res.penA;
                m.penB = res.penB;
                m.isExtraTime = res.isExtraTime;
                
                if (m.scoreA > m.scoreB) m.winner = m.teamA;
                else if (m.scoreB > m.scoreA) m.winner = m.teamB;
                else if (m.penA > m.penB) m.winner = m.teamA;
                else m.winner = m.teamB;

                if (nextRoundName) {
                    const nextIdx = Math.floor(idx / 2);
                    const pos = idx % 2 === 0 ? 'teamA' : 'teamB';
                    newB[nextRoundName][nextIdx][pos] = m.winner;
                }
            }
        });
    };

    processRound('r32', 'r16');
    processRound('r16', 'qf');
    processRound('qf', 'sf');
    processRound('sf', 'final');
    
    if (newB.sf[0].winner && newB.sf[1].winner) {
        const loser1 = newB.sf[0].winner === newB.sf[0].teamA ? newB.sf[0].teamB : newB.sf[0].teamA;
        const loser2 = newB.sf[1].winner === newB.sf[1].teamA ? newB.sf[1].teamB : newB.sf[1].teamA;
        
        let tp = { ...thirdPlace, teamA: loser1, teamB: loser2 };
        if (!tp.winner) {
             const res = simulateMatchResult(tp.teamA.name, tp.teamB.name);
             tp = { ...tp, ...res };
             if (tp.scoreA > tp.scoreB) tp.winner = tp.teamA;
             else if (tp.scoreB > tp.scoreA) tp.winner = tp.teamB;
             else if (tp.penA > tp.penB) tp.winner = tp.teamA;
             else tp.winner = tp.teamB;
        }
        setThirdPlace(tp);
    }

    processRound('final', null);
    if (newB.final[0].winner) {
        setWinner(newB.final[0].winner);
        confetti({ particleCount: 200, spread: 100, origin: { y: 0.6 } });
    }

    setBracket(newB);
  };

  return (
    <div className={`min-h-screen font-sans ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'} transition-colors`}>
      <style>{`
        .champion-text {
          background: linear-gradient(to bottom, #FFD700, #FDB931, #FFD700);
          background-clip: text;
          -webkit-text-fill-color: transparent;
          text-shadow: 0px 1px 2px rgba(0,0,0,0.2);
        }
        .animate-fade-in { animation: fadeIn 0.5s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <TutorialModal 
        isOpen={showTutorial} 
        onClose={handleCloseTutorial} 
        content={TUTORIAL_STEPS[view]} 
      />

      {view !== 'print' && (
        <Header 
            darkMode={darkMode} 
            setDarkMode={setDarkMode} 
            reset={() => setView('landing')} 
            view={view} 
            onClearData={handleClearData} 
        />
      )}

      {view === 'landing' && (
         <div className="flex flex-col items-center justify-center min-h-[80vh] gap-8 p-6 text-center animate-fade-in">
            <img src={TROPHY_URL} className="h-48 drop-shadow-2xl animate-pulse" alt="World Cup"/>
            <h1 className="text-6xl font-black italic bg-gradient-to-br from-indigo-500 to-fuchsia-500 bg-clip-text text-transparent">MUNDIAL 2026</h1>
            <p className="text-xl max-w-2xl opacity-75">
              Simulador Profesional: 48 Equipos, Repechajes, 8 Mejores Terceros y Final en New Jersey.
            </p>

            <div className="flex flex-col gap-2 w-full max-w-md">
                <label className="text-sm font-bold opacity-70 flex items-center gap-2"><User size={16}/> INGRESA TU NOMBRE</label>
                <input 
                    type="text" 
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Ej: StreamerPro"
                    className={`p-4 rounded-xl font-bold text-center text-xl shadow-inner focus:ring-4 ring-blue-500 outline-none ${darkMode ? 'text-black bg-white' : 'text-black bg-white border'}`}
                />
            </div>

            <button 
                onClick={handleStart} 
                disabled={userName.trim().length === 0}
                className={`group relative px-8 py-4 rounded-full font-bold text-xl shadow-xl transition-all ${userName.trim().length > 0 ? 'bg-blue-600 hover:bg-blue-500 hover:scale-105 text-white' : 'bg-gray-500 opacity-50 cursor-not-allowed text-gray-300'}`}>
               <div className="flex items-center gap-3">
                 <Play size={24} fill="currentColor" /> SIGUIENTE
               </div>
            </button>
         </div>
      )}

      {view === 'mode_select' && (
          <div className="flex flex-col items-center justify-center min-h-[70vh] gap-8 p-4 animate-fade-in">
              <h2 className="text-4xl font-black mb-4">Elige tu Simulación</h2>
              <div className="grid md:grid-cols-2 gap-8 max-w-4xl w-full">
                  <button onClick={() => selectMode('random')} className={`p-8 rounded-2xl border-2 flex flex-col items-center gap-4 transition-all hover:scale-105 ${darkMode ? 'bg-slate-900 border-blue-500 hover:bg-slate-800' : 'bg-white border-blue-500 hover:bg-blue-50 shadow-lg'}`}>
                      <div className="bg-blue-100 p-4 rounded-full text-blue-600">
                          <Shuffle size={48} />
                      </div>
                      <h3 className="text-2xl font-bold">Sorteo Aleatorio</h3>
                      <p className="opacity-70 text-center">Simula un sorteo nuevo basado en los bombos oficiales de la FIFA.</p>
                  </button>

                  <button 
                      onClick={() => isRealDrawEnabled && selectMode('real')} 
                      disabled={!isRealDrawEnabled}
                      className={`relative p-8 rounded-2xl border-2 flex flex-col items-center gap-4 transition-all ${isRealDrawEnabled ? 'hover:scale-105 cursor-pointer' : 'opacity-50 cursor-not-allowed grayscale'} ${darkMode ? 'bg-slate-900 border-green-500' : 'bg-white border-green-500 shadow-lg'}`}
                  >
                      {!isRealDrawEnabled && (
                          <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                              Disponible 5 Dic
                          </div>
                      )}
                      <div className="bg-green-100 p-4 rounded-full text-green-600">
                          <CalendarCheck size={48} />
                      </div>
                      <h3 className="text-2xl font-bold">Sorteo Oficial</h3>
                      <p className="opacity-70 text-center">Usa los grupos reales definidos en el sorteo del 5 de Diciembre.</p>
                  </button>
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
           onPrint={() => setView('print')}
           onSimulate={handleSimulateKnockout}
           awards={awards} 
           setAwards={setAwards}
        />
      )}

      {view === 'print' && (
        <PrintView 
          groups={groups} 
          bracket={bracket} 
          winner={winner} 
          thirdPlace={thirdPlace}
          userName={userName}
          awards={awards}
          onBack={() => setView('knockout')} 
        />
      )}
    </div>
  );
}