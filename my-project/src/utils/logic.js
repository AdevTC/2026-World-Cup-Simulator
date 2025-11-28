import { POTS_BASE, REAL_GROUPS_CONFIG, TEAM_STATS } from '../data/constants';

export const statsInit = () => ({ played: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0 });

export const getBestThirdsList = (groups) => {
  const thirds = [];
  Object.keys(groups).forEach(g => {
    if (groups[g].length >= 3) {
      thirds.push({ ...groups[g][2], group: g });
    }
  });
  thirds.sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf);
  return thirds.slice(0, 8);
};

export const generateStructure = (playoffWinners) => {
  const pot1 = [...POTS_BASE.pot1];
  const pot2 = [...POTS_BASE.pot2]; 
  const pot3 = [...POTS_BASE.pot3];
  const pot4 = [...POTS_BASE.pot4, ...playoffWinners];

  const groups = {};
  const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
  
  const p1 = pot1.sort(() => 0.5 - Math.random());
  const p2 = pot2.sort(() => 0.5 - Math.random());
  const p3 = pot3.sort(() => 0.5 - Math.random());
  const p4 = pot4.sort(() => 0.5 - Math.random());

  letters.forEach((l, i) => {
    let t1Name;
    if (l === 'A') t1Name = 'México';
    else if (l === 'B') t1Name = 'Canadá';
    else if (l === 'D') t1Name = 'EE. UU.';
    else t1Name = p1.pop();

    groups[l] = [
      { name: t1Name, pot: 1, ...statsInit() },
      { name: p2[i], pot: 2, ...statsInit() },
      { name: p3[i], pot: 3, ...statsInit() },
      { name: p4[i], pot: 4, ...statsInit() },
    ];
  });
  return groups;
};

export const generateRealStructure = (playoffSelections) => {
  const groups = {};
  const letters = Object.keys(REAL_GROUPS_CONFIG);

  letters.forEach(l => {
    const teamNames = REAL_GROUPS_CONFIG[l];
    groups[l] = teamNames.map((teamOrId, idx) => {
        const finalName = playoffSelections[teamOrId] || teamOrId;
        return { 
            name: finalName, 
            pot: idx + 1,
            ...statsInit() 
        };
    });
  });

  return groups;
};

export const generateMatches = (grp) => {
    const m = {};
    Object.keys(grp).forEach(g => {
      const t = grp[g];
      m[g] = [
        { id: `${g}1`, teamA: t[0].name, teamB: t[1].name, scoreA: '', scoreB: '' },
        { id: `${g}2`, teamA: t[2].name, teamB: t[3].name, scoreA: '', scoreB: '' },
        { id: `${g}3`, teamA: t[0].name, teamB: t[2].name, scoreA: '', scoreB: '' },
        { id: `${g}4`, teamA: t[3].name, teamB: t[1].name, scoreA: '', scoreB: '' },
        { id: `${g}5`, teamA: t[3].name, teamB: t[0].name, scoreA: '', scoreB: '' },
        { id: `${g}6`, teamA: t[1].name, teamB: t[2].name, scoreA: '', scoreB: '' },
      ];
    });
    return m;
};

// <--- CAMBIO CLAVE: Lógica de Empates y Penaltis
export const simulateMatchResult = (teamA, teamB) => {
    const pointsA = TEAM_STATS[teamA] || 1300;
    const pointsB = TEAM_STATS[teamB] || 1300;
    
    // Diferencia de nivel
    const diff = pointsA - pointsB;
    
    // Probabilidad base de victoria A (sigmoide)
    const probA = 1 / (1 + Math.pow(10, -diff / 400));
    
    // Probabilidad de empate: Mayor si la diferencia es pequeña
    // Base 28% de empate, se reduce si hay mucha diferencia
    const drawChance = 0.28 * Math.max(0, 1 - Math.abs(diff) / 600); 
    
    const roll = Math.random();
    
    let sA, sB;
    let isExtraTime = false;
    let penA = '', penB = '';

    if (roll < drawChance) {
        // --- EMPATE ---
        // Generar marcador de empate (0-0, 1-1, 2-2)
        const goals = Math.floor(Math.random() * 3); // 0, 1 o 2
        sA = goals;
        sB = goals;
        isExtraTime = true; // Se activa la bandera de PRÓRROGA

        // Simular PENALTIS
        let pA = 0, pB = 0;
        // Tanda de 5
        for(let i=0; i<5; i++) {
            if(Math.random() > 0.2) pA++;
            if(Math.random() > 0.2) pB++;
        }
        // Muerte súbita si siguen empatados
        while (pA === pB) {
            if(Math.random() > 0.2) pA++;
            if(Math.random() > 0.2) pB++;
        }
        penA = pA;
        penB = pB;

    } else {
        // --- VICTORIA (Sin empate) ---
        // Recalcular probabilidad A excluyendo el rango de empate
        const adjustedProbA = probA; // Simplificación, A sigue siendo favorito
        
        // Determinar quién gana en 90mins/120mins
        const winnerIsA = Math.random() < adjustedProbA;
        
        if (winnerIsA) {
            sA = Math.floor(Math.random() * 3) + 1; // 1 a 3 goles
            sB = Math.floor(Math.random() * sA);    // Menos que A
        } else {
            sB = Math.floor(Math.random() * 3) + 1;
            sA = Math.floor(Math.random() * sB);
        }
    }

    return { scoreA: sA, scoreB: sB, penA, penB, isExtraTime };
};

export const generateKnockoutBracket = (groups, bestThirds) => {
    const getTeam = (letter, pos) => groups[letter][pos - 1];
    const shuffledThirds = [...bestThirds].sort(() => 0.5 - Math.random());
    
    const r32Matches = [
        { id: 1,  tA: getTeam('E', 1), tB: shuffledThirds[0] },
        { id: 2,  tA: getTeam('I', 1), tB: shuffledThirds[1] },
        { id: 3,  tA: getTeam('A', 2), tB: getTeam('B', 2) },
        { id: 4,  tA: getTeam('F', 1), tB: getTeam('C', 2) },
        { id: 5,  tA: getTeam('K', 2), tB: getTeam('L', 2) },
        { id: 6,  tA: getTeam('H', 1), tB: getTeam('J', 2) },
        { id: 7,  tA: getTeam('D', 1), tB: shuffledThirds[2] },
        { id: 8,  tA: getTeam('G', 1), tB: shuffledThirds[3] },
        { id: 9,  tA: getTeam('C', 1), tB: getTeam('F', 2) },
        { id: 10, tA: getTeam('E', 2), tB: getTeam('I', 2) },
        { id: 11, tA: getTeam('A', 1), tB: shuffledThirds[4] },
        { id: 12, tA: getTeam('L', 1), tB: shuffledThirds[5] },
        { id: 13, tA: getTeam('J', 1), tB: getTeam('H', 2) },
        { id: 14, tA: getTeam('D', 2), tB: getTeam('G', 2) },
        { id: 15, tA: getTeam('B', 1), tB: shuffledThirds[6] },
        { id: 16, tA: getTeam('K', 1), tB: shuffledThirds[7] },
    ];

    const createM = (pair) => ({ 
        teamA: pair ? pair.tA : null, 
        teamB: pair ? pair.tB : null, 
        scoreA: '', scoreB: '', penA: '', penB: '', isExtraTime: false, winner: null 
    });

    return {
        r32: r32Matches.map(createM),
        r16: Array(8).fill(null).map(() => createM()),
        qf: Array(4).fill(null).map(() => createM()),
        sf: Array(2).fill(null).map(() => createM()),
        final: [createM()]
    };
};