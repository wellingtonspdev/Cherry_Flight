// Cherry Bloom — Gameplay Constants & Academic Strings
// Source of Truth: CHERRY_BLOOM_SPECIFICATION_AND_ACCEPTANCE.md

export const GAME = {
  gravity: 1050,          // dp/s^2
  jumpVelocity: -390,     // dp/s (upward impulse)
  maxFallVelocity: 580,   // dp/s cap so falling remains fair
  obstacleSpeed: 155,     // dp/s horizontal velocity
  obstacleWidth: 68,      // dp width of Bloom Branch trunk
  obstacleSpacing: 260,   // dp horizontal distance between obstacle pairs
  gapSize: 168,           // dp vertical safe corridor
  playerSize: 48,         // dp visual diameter of Cherri
  playerHitboxInset: 6,   // dp forgiving inset so petal/stem edge doesn't feel unfair
  playerXRatio: 0.26,     // horizontal position ratio on screen
  topClearance: 84,       // dp minimum top branch height / HUD clearance
  bottomClearance: 96,    // dp minimum bottom branch height / ground clearance
  groundHeight: 36,       // dp visual garden floor strip height
  maxDeltaTime: 0.05,     // s cap to prevent huge jump on frame drop/tab switch
  obstacleCount: 3,       // recycled pool size
};

export const GAME_STATE = {
  READY: 'READY',
  PLAYING: 'PLAYING',
  PAUSED: 'PAUSED',
  GAME_OVER: 'GAME_OVER',
};

// Mandatory Academic Information (Section 4 & 10.4 of Specification)
// DO NOT MODIFY THIS DISCLAIMER STRING.
export const ACADEMIC_INFO = {
  gameTitle: 'Cherry Bloom',
  tagline: 'Fly Through the Blossom',
  studentName: 'Wellington Siqueira Porto',
  institution: 'FATEC Itaquera — Prof. Miguel Reale',
  course: 'Desenvolvimento de Software Multiplataforma',
  discipline: 'Programação para Dispositivos Móveis II',
  semester: '5º Semestre',
  professor: 'Prof. Jeferson de Souza Dias',
  activity: 'Atividade Prática 9 — Flappy Bird',
  mandatoryDisclaimer:
    'Este site é um projeto acadêmico da FATEC, criado apenas para fins de estudo. Não utilize as informações aqui para uso real.',
};
