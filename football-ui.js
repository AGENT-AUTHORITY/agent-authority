import { players, microcycle, getAttributeLabels } from './football-data.js';
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
const portfolio = document.querySelector('[data-player-portfolio]');
if (portfolio) {
  const buttons = [...document.querySelectorAll('[data-portfolio-player]')];
  const setText = (field, value) => document.querySelectorAll('[data-portfolio-field="'+field+'"]').forEach(node => {node.textContent=value;});
  const select = key => {
    const player = players[key], profile = player?.portfolio;
    if (!profile) return;
    buttons.forEach(button => button.setAttribute('aria-pressed',String(button.dataset.portfolioPlayer===key)));
    portfolio.dataset.playerPortfolio = key;
    document.title = player.name+' · Portfolio de jugador | Demo de Agent Authority';
    setText('initials',profile.initials);
    setText('name',player.name.toLocaleUpperCase('es'));
    setText('first',profile.first);
    setText('last',profile.last);
    setText('nickname',profile.nickname ?? '');
    document.querySelector('[data-portfolio-field="nickname"]').hidden = !profile.nickname;
    setText('byline','PLAYER PORTFOLIO / '+player.number);
    setText('role',player.role.toLocaleUpperCase('es')+' / '+profile.country.toLocaleUpperCase('es'));
    setText('tagline',profile.tagline);
    setText('club',profile.club);
    setText('height',profile.height);
    setText('foot',profile.foot);
    setText('age',profile.age);
    setText('strengths',player.strengths);
    setText('video-focus',profile.videoFocus);
    setText('current',player.name+' · '+player.role);
    setText('analysis-copy',player.kind==='goalkeeper' ? 'Reflejos, manejo, juego aéreo y zonas de acción del arquero. Siempre con fuente, período y criterio de evaluación.' : 'Atributos y zonas de acción para acompañar al video. Siempre con fuente, período y criterio de evaluación.');
    const role = document.querySelector('[data-portfolio-role]');
    role.replaceChildren(document.createTextNode(player.code));
    const country = document.createElement('small');
    country.textContent = 'ARG / '+player.number;
    role.append(country);
    const image = document.querySelector('[data-portfolio-image]');
    image.src = player.image;
    image.alt = player.name+', '+player.role.toLowerCase()+' ficticio';
    const labels = getAttributeLabels(player);
    const abbreviations = player.attributeShortLabels ?? ['RIT','REM','PAS','CON','DEF','FIS'];
    document.querySelector('[data-portfolio-attributes]').replaceChildren(...labels.map((label,i) => {
      const span = document.createElement('span');
      span.title = label;
      span.setAttribute('aria-label',label+': '+player.attributes[i]);
      const strong = document.createElement('strong');
      strong.textContent = player.attributes[i];
      span.append(strong,document.createTextNode(abbreviations[i]));
      return span;
    }));
    document.querySelector('[data-portfolio-career]').replaceChildren(...player.career.map(([period,club],i) => {
      const li=document.createElement('li'), crest=document.createElement('img'), details=document.createElement('div');
      crest.src=profile.crests[i]; crest.alt='Escudo ficticio '+club;
      const date=document.createElement('span'), name=document.createElement('h3'), role=document.createElement('p');
      date.textContent=period; name.textContent=club; role.textContent=profile.careerRoles[i];
      details.append(date,name,role); li.append(crest,details); return li;
    }));
    const analysis = document.querySelector('[data-analysis-player]');
    analysis.dataset.analysisPlayer=key;
    mountAnalysis(analysis,key,'portfolio-0');
  };
  buttons.forEach(button => button.addEventListener('click', () => select(button.dataset.portfolioPlayer)));
  select(portfolio.dataset.playerPortfolio);
}
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
