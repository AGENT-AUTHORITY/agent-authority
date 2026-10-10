import { analyticsConfig } from './analytics-config.js';
import { createAnalytics } from './analytics.js';

const analytics = createAnalytics(window, document, analyticsConfig);
analytics.init();

const menu = document.querySelector('.menu');
const nav = document.querySelector('#navigation');
if (menu && nav) {
  const close = () => {
    nav.classList.remove('open');
    menu.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-label', 'Abrir menú');
  };
  menu.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && nav.classList.contains('open')) { close(); menu.focus(); }
  });
}

document.querySelectorAll('[data-profile]').forEach(link => link.addEventListener('click', () => {
  const profile = document.querySelector('#profile');
  if (profile) profile.value = link.dataset.profile;
}));

const demos = {
  coach: { mark: 'MR', name: 'MARCOS RIVERA', role: 'PORTFOLIO DE DIRECTOR TÉCNICO', slogan: 'Clubes, temporadas y palmarés.\nUna pizarra para explorar su idea de juego.', image: 'assets/demos/preview-coach.jpg', alt: 'Vista de la demo de Marcos Rivera, de estética editorial clara', href: 'demo-coach.html', features: ['Escudos y trayectoria', 'Trofeos y palmarés', 'Pizarra interactiva'] },
  agency: { mark: 'N', name: 'NORTH FOOTBALL', role: 'AGENCIA DE REPRESENTACIÓN', slogan: 'Un plantel visual y fichas individuales.\nUna identidad pensada para el talento.', image: 'assets/demos/preview-agency.jpg', alt: 'Vista de la demo North Football, con retratos de jugadores y diseño violeta', href: 'demo-agency.html', features: ['Fotos de jugadores', 'Filtros por posición', 'Fichas individuales'] },
};
const tabs = [...document.querySelectorAll('[data-demo]')];
function selectDemo(tab) {
  const d = demos[tab.dataset.demo];
  if (!d) return;
  tabs.forEach(button => {
    button.setAttribute('aria-selected', String(button === tab));
    button.tabIndex = button === tab ? 0 : -1;
  });
  document.querySelector('#demo-panel').setAttribute('aria-labelledby', tab.id);
  for (const key of ['mark', 'name', 'role']) document.querySelector('#preview-' + key).textContent = d[key];
  const slogan = document.querySelector('#preview-slogan');
  slogan.textContent = d.slogan;
  slogan.style.whiteSpace = 'pre-line';
  const image = document.querySelector('#preview-image');
  image.src = d.image;
  image.alt = d.alt;
  const link = document.querySelector('#demo-link');
  link.href = d.href;
  link.dataset.demoType = tab.dataset.demo;
  const features = document.querySelector('#demo-features');
  features.replaceChildren(...d.features.map(text => {
    const item = document.createElement('li'); item.textContent = text; return item;
  }));
  analytics.track('demo_select', { demo_type: tab.dataset.demo, cta_position: 'showcase' });
}
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectDemo(tab));
  tab.addEventListener('keydown', e => {
    let next;
    if (e.key === 'ArrowRight') next = tabs[(index + 1) % tabs.length];
    if (e.key === 'ArrowLeft') next = tabs[(index + tabs.length - 1) % tabs.length];
    if (e.key === 'Home') next = tabs[0];
    if (e.key === 'End') next = tabs.at(-1);
    if (next) { e.preventDefault(); next.focus(); selectDemo(next); }
  });
});

document.querySelectorAll('[data-whatsapp="direct"]').forEach(link => {
  const message = 'Hola Oscar. Vi la propuesta de web + portfolio desde USD 500 y me gustaría definir el alcance para mi perfil.\nOrigen: ' + analytics.attributionLabel();
  link.href = 'https://wa.me/5492226638043?text=' + encodeURIComponent(message);
});
document.querySelectorAll('[data-whatsapp]').forEach(link => link.addEventListener('click', () => {
  analytics.track('whatsapp_click', { cta_position: link.dataset.ctaPosition || 'other' });
}));
document.querySelectorAll('[data-track]').forEach(link => link.addEventListener('click', () => {
  analytics.track(link.dataset.track, { demo_type: link.dataset.demoType, cta_position: link.dataset.ctaPosition });
}));
document.querySelectorAll('[data-faq]').forEach(details => details.addEventListener('toggle', () => {
  if (details.open) analytics.track('faq_open', { faq_id: details.dataset.faq });
}));
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting && analytics.track(entry.target.dataset.observe)) observer.unobserve(entry.target);
  }), { threshold: 0.15 });
  document.querySelectorAll('[data-observe]').forEach(section => observer.observe(section));
}
const form = document.querySelector('#proposal-form');
let formStarted = false;
form?.addEventListener('focusin', () => {
  if (!formStarted) formStarted = analytics.track('form_start', { cta_position: 'proposal' });
});
form?.addEventListener('input', () => {
  document.querySelector('#form-result').hidden = true;
  document.querySelector('#send-whatsapp').removeAttribute('href');
});
form?.addEventListener('submit', e => {
  e.preventDefault();
  if (!form.reportValidity()) return;
  const values = new FormData(form);
  const value = key => String(values.get(key) || '').trim();
  const message = [
    'Hola Oscar. Quiero una propuesta de web + portfolio para mi perfil.',
    'Nombre: ' + value('name'),
    'Perfil: ' + value('profile'),
    value('site') ? 'Web / LinkedIn: ' + value('site') : '',
    'Objetivo: ' + value('goal'),
    'Inversión que evalúo: ' + value('budget'),
    'Cuándo quiero empezar: ' + value('timing'),
    'Origen: ' + analytics.attributionLabel(),
  ].filter(Boolean).join('\n');
  document.querySelector('#message-preview').value = message;
  document.querySelector('#send-whatsapp').href = 'https://wa.me/5492226638043?text=' + encodeURIComponent(message);
  const result = document.querySelector('#form-result');
  result.hidden = false;
  result.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion:reduce)').matches ? 'auto' : 'smooth', block: 'nearest' });
  document.querySelector('#send-whatsapp').focus();
  analytics.track('proposal_ready', { cta_position: 'proposal' });
});
const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();
