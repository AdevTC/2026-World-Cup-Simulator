import { POTS_BASE } from '../data/constants';

export const statsInit = () => ({ played: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0 });

// <--- CAMBIO NUEVO: Ahora devuelve el objeto completo del equipo, no solo el nombre, para usarlo en los cruces
export const getBestThirdsList = (groups) => {
  const thirds = [];
  Object.keys(groups).forEach(g => {
    if (groups[g].length >= 3) {
      thirds.push({ ...groups[g][2], group: g });
    }
  });
  // Sort logic: Pts > GD > GF
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

// <--- CAMBIO NUEVO: Función para simular un solo partido (resultado y penales si hay empate)
export const simulateMatchResult = () => {
    const sA = Math.floor(Math.random() * 4); // Goles entre 0 y 3
    const sB = Math.floor(Math.random() * 4);
    let penA = '', penB = '';
    
    // Si hay empate, simulamos penaltis
    if (sA === sB) {
        let pA = 0, pB = 0;
        while(pA === pB) {
            pA = Math.floor(Math.random() * 5) + 3;
            pB = Math.floor(Math.random() * 5) + 3;
        }
        penA = pA;
        penB = pB;
    }

    return { scoreA: sA, scoreB: sB, penA, penB, isExtraTime: sA === sB };
};

// <--- CAMBIO NUEVO: Lógica exacta de cruces del Mundial 2026
export const generateKnockoutBracket = (groups, bestThirds) => {
    // Función auxiliar para sacar equipo por Grupo y Posición (1, 2, 3 o 4)
    const getTeam = (letter, pos) => groups[letter][pos - 1];

    // Sorteamos aleatoriamente los terceros para asignarlos a los huecos disponibles
    const shuffledThirds = [...bestThirds].sort(() => 0.5 - Math.random());
    
    // Mapeo exacto según el reglamento oficial para 48 equipos
    const r32Matches = [
        { id: 1,  tA: getTeam('E', 1), tB: shuffledThirds[0] }, // R32-1
        { id: 2,  tA: getTeam('I', 1), tB: shuffledThirds[1] }, // R32-2
        { id: 3,  tA: getTeam('A', 2), tB: getTeam('B', 2) },   // R32-3
        { id: 4,  tA: getTeam('F', 1), tB: getTeam('C', 2) },   // R32-4
        { id: 5,  tA: getTeam('K', 2), tB: getTeam('L', 2) },   // R32-5
        { id: 6,  tA: getTeam('H', 1), tB: getTeam('J', 2) },   // R32-6
        { id: 7,  tA: getTeam('D', 1), tB: shuffledThirds[2] }, // R32-7
        { id: 8,  tA: getTeam('G', 1), tB: shuffledThirds[3] }, // R32-8
        { id: 9,  tA: getTeam('C', 1), tB: getTeam('F', 2) },   // R32-9
        { id: 10, tA: getTeam('E', 2), tB: getTeam('I', 2) },   // R32-10
        { id: 11, tA: getTeam('A', 1), tB: shuffledThirds[4] }, // R32-11
        { id: 12, tA: getTeam('L', 1), tB: shuffledThirds[5] }, // R32-12
        { id: 13, tA: getTeam('J', 1), tB: getTeam('H', 2) },   // R32-13
        { id: 14, tA: getTeam('D', 2), tB: getTeam('G', 2) },   // R32-14
        { id: 15, tA: getTeam('B', 1), tB: shuffledThirds[6] }, // R32-15
        { id: 16, tA: getTeam('K', 1), tB: shuffledThirds[7] }, // R32-16
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