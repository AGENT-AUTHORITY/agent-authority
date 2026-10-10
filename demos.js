const tacticalPhases = {
  possession: {
    formation:'4 — 3 — 3', phase:'FASE OFENSIVA', title:'Amplitud para encontrar espacios.',
    copy:'Salida con apoyos, extremos abiertos y un mediocampo que conecta líneas. La pelota como punto de encuentro.',
    positions:[[50,90],[16,67],[38,73],[62,73],[84,67],[50,57],[32,43],[68,43],[12,21],[50,17],[88,21]],
  },
  defence: {
    formation:'4 — 1 — 4 — 1', phase:'FASE DEFENSIVA', title:'Cerca entre líneas. Lejos de nuestro arco.',
    copy:'Un bloque compacto que protege el centro, reduce distancias y orienta al rival hacia las bandas.',
    positions:[[50,90],[20,77],[40,80],[60,80],[80,77],[50,65],[37,52],[63,52],[17,52],[50,32],[83,52]],
  },
  transition: {
    formation:'3 — 2 — 5', phase:'TRANSICIÓN OFENSIVA', title:'Recuperar y mirar hacia adelante.',
    copy:'Primer pase con intención, apoyos por dentro y profundidad por fuera. Atacar el espacio antes de que el rival se reorganice.',
    positions:[[50,90],[26,73],[50,77],[74,73],[88,20],[40,57],[60,57],[66,27],[12,20],[50,15],[34,27]],
  },
};
const tacticButtons = [...document.querySelectorAll('[data-tactic]')];
tacticButtons.forEach(button => button.addEventListener('click', () => {
  const state = tacticalPhases[button.dataset.tactic];
  if (!state) return;
  tacticButtons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  document.querySelector('#tactic-formation').textContent = state.formation;
  document.querySelector('#board-phase').textContent = state.phase;
  document.querySelector('#tactic-title').textContent = state.title;
  document.querySelector('#tactic-copy').textContent = state.copy;
  document.querySelector('.pitch').setAttribute('aria-label', 'Pizarra de fútbol: ' + state.phase.toLowerCase() + ', esquema ' + state.formation.replaceAll(' — ', '-'));
  document.querySelectorAll('.pitch-player').forEach((player, i) => {
    player.style.setProperty('--x', state.positions[i][0] + '%');
    player.style.setProperty('--y', state.positions[i][1] + '%');
  });
}));

const filterButtons = [...document.querySelectorAll('[data-position]')];
filterButtons.forEach(button => button.addEventListener('click', () => {
  filterButtons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  let count = 0;
  document.querySelectorAll('[data-player-position]').forEach(card => {
    const visible = button.dataset.position === 'all' || card.dataset.playerPosition === button.dataset.position;
    card.hidden = !visible;
    if (visible) count++;
  });
  document.querySelector('#roster-count').textContent = count + (count === 1 ? ' perfil ilustrativo' : ' perfiles ilustrativos');
}));

// These are illustrative identities, not records belonging to real players.
const players = {
  mateo: { name:'Mateo Silva', image:'assets/demos/player-mateo.webp', number:'09', role:'Delantero centro',
    data:[['País','Argentina'],['Edad','24 años'],['Altura','1,84 m'],['Pierna hábil','Derecha'],['Club de ejemplo','Puerto Sur FC'],['Posición','Delantero centro']],
    strengths:'Movilidad entre centrales, apoyos de espaldas y ataque al espacio. Un perfil orientado a la finalización y a conectar el último tercio.',
    career:[['2023 — 2026','Puerto Sur FC'],['2020 — 2023','Unión Sierra']], },
  lucas: { name:'Lucas Costa', image:'assets/demos/player-lucas.webp', number:'08', role:'Mediocampista central',
    data:[['País','Argentina'],['Edad','27 años'],['Altura','1,78 m'],['Pierna hábil','Izquierda'],['Club de ejemplo','Atlético Delta'],['Posición','Volante central']],
    strengths:'Lectura del juego, circulación de la pelota y conexión entre líneas. Un mediocampista que ofrece apoyos y continuidad a la posesión.',
    career:[['2022 — 2026','Atlético Delta'],['2018 — 2022','Puerto Sur FC']], },
  nicolas: { name:'Nicolás Duarte', image:'assets/demos/player-nicolas.webp', number:'04', role:'Defensor central',
    data:[['País','Uruguay'],['Edad','23 años'],['Altura','1,89 m'],['Pierna hábil','Derecha'],['Club de ejemplo','Unión Sierra'],['Posición','Defensor central']],
    strengths:'Anticipación, juego aéreo y primer pase. Un defensor que combina presencia en el área con una salida simple y orientada.',
    career:[['2024 — 2026','Unión Sierra'],['2021 — 2024','Atlético Delta']], },
};
const dialog = document.querySelector('#player-dialog');
let lastPlayerButton;
document.querySelectorAll('[data-player]').forEach(button => button.addEventListener('click', () => {
  const player = players[button.dataset.player];
  if (!dialog || !player) return;
  lastPlayerButton = button;
  document.querySelector('#player-dialog-name').textContent = player.name;
  document.querySelector('#player-dialog-role').textContent = player.role;
  document.querySelector('#player-dialog-number').textContent = player.number;
  const image = document.querySelector('#player-dialog-image');
  image.src = player.image;
  image.alt = player.name + ', identidad ficticia';
  document.querySelector('#player-dialog-strengths').textContent = player.strengths;
  document.querySelector('#player-dialog-data').replaceChildren(...player.data.map(([label, value]) => {
    const row = document.createElement('div');
    const dt = document.createElement('dt'); dt.textContent = label;
    const dd = document.createElement('dd'); dd.textContent = value;
    row.append(dt, dd); return row;
  }));
  document.querySelector('#player-dialog-career').replaceChildren(...player.career.map(([period, club]) => {
    const row = document.createElement('li');
    const date = document.createElement('span'); date.textContent = period;
    const name = document.createElement('strong'); name.textContent = club;
    row.append(date, name); return row;
  }));
  dialog.showModal();
  dialog.scrollTop = 0;
}));
dialog?.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog?.addEventListener('click', event => {
  const bounds = dialog.getBoundingClientRect();
  if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) dialog.close();
});
dialog?.addEventListener('close', () => lastPlayerButton?.focus());
