// src/data/constants.js

export const TROPHY_URL = "https://png.pngtree.com/png-vector/20250206/ourmid/pngtree-fifa-world-cup-trophy-png-image_15408410.png";

export const PAST_CHAMPIONS = ['Italia', 'Uruguay', 'Argentina', 'Brasil', 'España', 'Inglaterra', 'Alemania', 'Francia'];

// <--- CAMBIO NUEVO: Configuración para el Sorteo Real (Rellenar el 5 de Diciembre)
// Usa los IDs de los repechajes ('uefa-a', 'inter-1', etc.) para los ganadores de playoff.
export const REAL_GROUPS_CONFIG = {
  A: ['México', 'TeamA2', 'TeamA3', 'TeamA4'],
  B: ['Canadá', 'TeamB2', 'TeamB3', 'TeamB4'],
  C: ['TeamC1', 'TeamC2', 'TeamC3', 'TeamC4'],
  D: ['EE. UU.', 'TeamD2', 'TeamD3', 'TeamD4'],
  E: ['TeamE1', 'TeamE2', 'TeamE3', 'TeamE4'],
  F: ['TeamF1', 'TeamF2', 'TeamF3', 'TeamF4'],
  G: ['TeamG1', 'TeamG2', 'TeamG3', 'TeamG4'],
  H: ['TeamH1', 'TeamH2', 'TeamH3', 'TeamH4'],
  I: ['TeamI1', 'TeamI2', 'TeamI3', 'TeamI4'],
  J: ['TeamJ1', 'TeamJ2', 'TeamJ3', 'TeamJ4'],
  K: ['TeamK1', 'TeamK2', 'TeamK3', 'TeamK4'],
  L: ['TeamL1', 'TeamL2', 'TeamL3', 'TeamL4'],
};

export const FLAGS = {
  'México': 'mx', 'Canadá': 'ca', 'EE. UU.': 'us',
  'Argentina': 'ar', 'Francia': 'fr', 'Brasil': 'br', 'Inglaterra': 'gb-eng',
  'Bélgica': 'be', 'Portugal': 'pt', 'Países Bajos': 'nl', 'España': 'es', 'Alemania': 'de', 'Croacia': 'hr',
  'Italia': 'it', 'Marruecos': 'ma', 'Colombia': 'co', 'Uruguay': 'uy', 'Suiza': 'ch',
  'Japón': 'jp', 'Senegal': 'sn', 'Irán': 'ir', 'Corea del Sur': 'kr', 'Ecuador': 'ec', 'Austria': 'at', 'Australia': 'au',
  'Dinamarca': 'dk', 'Turquía': 'tr',
  'Ucrania': 'ua', 'Suecia': 'se', 'Polonia': 'pl', 'Gales': 'gb-wls', 'Nigeria': 'ng', 'Egipto': 'eg',
  'Túnez': 'tn', 'Chile': 'cl', 'Perú': 'pe', 'Costa Rica': 'cr', 'Arabia Saudita': 'sa',
  'Noruega': 'no', 'Panamá': 'pa', 'Argelia': 'dz', 'Escocia': 'gb-sct', 'Paraguay': 'py',
  'Costa de Marfil': 'ci', 'Uzbekistán': 'uz', 'Qatar': 'qa', 'Sudáfrica': 'za', 'Rusia': 'ru',
  'Jordania': 'jo', 'Cabo Verde': 'cv', 'Ghana': 'gh', 'Curazao': 'cw', 'Haití': 'ht', 'Nueva Zelanda': 'nz',
  'Bolivia': 'bo', 'Suriname': 'sr', 'Iraq': 'iq', 'R.D. del Congo': 'cd', 'Nueva Caledonia': 'nc', 'Jamaica': 'jm',
  'Irlanda del Norte': 'gb-nir', 'Bosnia': 'ba', 'Albania': 'al', 'Rumania': 'ro', 'Kosovo': 'xk', 'Eslovaquia': 'sk',
  'Macedonia del Norte': 'mk', 'Rep. Checa': 'cz', 'Irlanda': 'ie'
};

export const PLAYOFFS_DATA = {
  uefa: [
    { id: 'uefa-a', name: 'UEFA Llave A', candidates: ['Italia', 'Irlanda del Norte', 'Gales', 'Bosnia'], winner: '' },
    { id: 'uefa-b', name: 'UEFA Llave B', candidates: ['Ucrania', 'Suecia', 'Polonia', 'Albania'], winner: '' },
    { id: 'uefa-c', name: 'UEFA Llave C', candidates: ['Turquía', 'Rumania', 'Eslovaquia', 'Kosovo'], winner: '' },
    { id: 'uefa-d', name: 'UEFA Llave D', candidates: ['Dinamarca', 'Macedonia del Norte', 'Rep. Checa', 'Irlanda'], winner: '' },
  ],
  inter: [
    { id: 'inter-1', name: 'Intercontinental 1', candidates: ['Nueva Caledonia', 'Jamaica', 'R.D. del Congo'], winner: '' },
    { id: 'inter-2', name: 'Intercontinental 2', candidates: ['Bolivia', 'Suriname', 'Iraq'], winner: '' }
  ]
};

export const POTS_BASE = {
  pot1: ['Argentina', 'Francia', 'Brasil', 'Inglaterra', 'Portugal', 'Países Bajos', 'Bélgica', 'España', 'Alemania'],
  pot2: ['Croacia', 'Marruecos', 'Colombia', 'Uruguay', 'Suiza', 'Japón', 'Senegal', 'Irán', 'Corea del Sur', 'Ecuador', 'Austria', 'Australia'],
  pot3: ['Noruega', 'Panamá', 'Egipto', 'Argelia', 'Escocia', 'Paraguay', 'Túnez', 'Costa de Marfil', 'Uzbekistán', 'Qatar', 'Arabia Saudita', 'Sudáfrica'],
  pot4: ['Jordania', 'Cabo Verde', 'Ghana', 'Curazao', 'Haití', 'Nueva Zelanda']
};