import React, { useState, useEffect } from 'react';
import { User, Play, Shuffle, CalendarCheck } from 'lucide-react'; // Importa iconos nuevos
import { TROPHY_URL } from './data/constants';
import { generateStructure, generateRealStructure, generateMatches, generateKnockoutBracket, getBestThirdsList, simulateMatchResult } from './utils/logic';
import { Header } from './components/Header';
import { PlayoffSelector } from './components/PlayoffSelector';
import { GroupStage } from './components/GroupStage';
import { KnockoutStage } from './components/KnockoutStage';
import { PrintView } from './components/PrintView';

export default function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [userName, setUserName] = useState('');
  const [view, setView] = useState('landing');
  const [simulationMode, setSimulationMode] = useState('random'); // 'random' | 'real'
  const [groups, setGroups] = useState(null);
  const [matches, setMatches] = useState(null);
  
  const [qualified, setQualified] = useState(null);
  const [bracket, setBracket] = useState(null);
  const [thirdPlace, setThirdPlace] = useState(null);
  const [winner, setWinner] = useState(null);

  const [awards, setAwards] = useState({
    bestPlayer: { name: '', team: '' },
    bestKeeper: { name: '', team: '' },
    bestYoung: { name: '', team: '' },
    bestGoal: { name: '', team: '' },
    fairPlay: '', 
    topScorer: { name: '', team: '', count: '' },
    topAssister: { name: '', team: '', count: '' },
    topGA: { name: '', team: '', count: '' }
  });

  // <--- CAMBIO NUEVO: Lógica de fecha para el botón
  const isRealDrawEnabled = new Date() >= new Date('2025-12-05');

  const handleStart = () => {
      if(userName.trim().length > 0) setView('mode_select'); // Vamos a seleccionar modo
  };

  // <--- CAMBIO NUEVO: Función para elegir modo
  const selectMode = (mode) => {
      setSimulationMode(mode);
      setView('config'); // Pasamos a elegir repechajes (siempre necesario)
  };

  const runDraw = (playoffSelections) => {
    let rawGroups;
    
    // <--- CAMBIO NUEVO: Elegir algoritmo según modo
    if (simulationMode === 'real') {
        rawGroups = generateRealStructure(playoffSelections);
    } else {
        // Para modo random, necesitamos solo la lista de ganadores para el bombo 4
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
    if (round === 'final' && m.winner) setWinner(m.winner);
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
                const res = simulateMatchResult();
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
             const res = simulateMatchResult();
             tp = { ...tp, ...res };
             if (tp.scoreA > tp.scoreB) tp.winner = tp.teamA;
             else if (tp.scoreB > tp.scoreA) tp.winner = tp.teamB;
             else if (tp.penA > tp.penB) tp.winner = tp.teamA;
             else tp.winner = tp.teamB;
        }
        setThirdPlace(tp);
    }

    processRound('final', null);
    if (newB.final[0].winner) setWinner(newB.final[0].winner);

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

      {view !== 'print' && (
        <Header darkMode={darkMode} setDarkMode={setDarkMode} reset={() => setView('landing')} view={view} />
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

      {/* <--- CAMBIO NUEVO: Pantalla de Selección de Modo */}
      {view === 'mode_select' && (
          <div className="flex flex-col items-center justify-center min-h-[70vh] gap-8 p-4 animate-fade-in">
              <h2 className="text-4xl font-black mb-4">Elige tu Simulación</h2>
              <div className="grid md:grid-cols-2 gap-8 max-w-4xl w-full">
                  
                  {/* Opción Aleatoria */}
                  <button onClick={() => selectMode('random')} className={`p-8 rounded-2xl border-2 flex flex-col items-center gap-4 transition-all hover:scale-105 ${darkMode ? 'bg-slate-900 border-blue-500 hover:bg-slate-800' : 'bg-white border-blue-500 hover:bg-blue-50 shadow-lg'}`}>
                      <div className="bg-blue-100 p-4 rounded-full text-blue-600">
                          <Shuffle size={48} />
                      </div>
                      <h3 className="text-2xl font-bold">Sorteo Aleatorio</h3>
                      <p className="opacity-70 text-center">Simula un sorteo nuevo basado en los bombos oficiales de la FIFA.</p>
                  </button>

                  {/* Opción Real */}
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