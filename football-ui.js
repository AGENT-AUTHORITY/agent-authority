import { players, microcycle } from './football-data.js';
import { analysisMarkup, createHeatmapSvg } from './football-visuals.js';
export function mountAnalysis(host, key, scope) {
  const player = players[key];
  if (!host || !player) return;
  host.innerHTML = analysisMarkup(player,scope);
  host.querySelectorAll('[data-heat]').forEach(button => button.addEventListener('click', () => {
    host.querySelectorAll('[data-heat]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    host.querySelector('[data-heat-view]').innerHTML = createHeatmapSvg(player,button.dataset.heat,scope+'-heat');
    host.querySelector('[data-zone-summary]').textContent = player.zoneSummary[button.dataset.heat];
  }));
}
const lab = document.querySelector('#talent-analysis');
if (lab) {
  mountAnalysis(lab,'mateo','talent');
  document.querySelectorAll('[data-lab-player]').forEach(button => button.addEventListener('click', () => {
    const key = button.dataset.labPlayer, player = players[key];
    if (!player) return;
    document.querySelectorAll('[data-lab-player]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    document.querySelector('#lab-name').textContent = player.name;
    document.querySelector('#lab-role').textContent = player.role;
    mountAnalysis(lab,key,'talent');
  }));
}
document.querySelectorAll('[data-analysis-player]').forEach((host,i) => mountAnalysis(host,host.dataset.analysisPlayer,'portfolio-'+i));
const week = document.querySelector('#week-detail');
if (week) {
  const buttons = [...document.querySelectorAll('[data-week]')];
  const select = index => {
    const day = microcycle[index];
    buttons.forEach((button,i) => button.setAttribute('aria-pressed',String(i===index)));
    document.querySelector('#week-title').textContent = day.title;
    document.querySelector('#week-focus').textContent = day.focus;
    document.querySelector('#week-tasks').replaceChildren(...day.tasks.map(task => {const li=document.createElement('li');li.textContent=task;return li;}));
    document.querySelector('#week-load').textContent = 'Exigencia relativa de ejemplo: '+day.load+' / 5';
    document.querySelectorAll('.load-bars span').forEach((bar,i) => bar.classList.toggle('active', i<day.load));
  };
  buttons.forEach(button => button.addEventListener('click', () => select(Number(button.dataset.week))));
  select(0);
}

const dossier = document.querySelector('[data-coach-dossier]');
if (dossier) dossier.href = new URL('./assets/demos/dossier-marcos-rivera.pdf', import.meta.url).href;
