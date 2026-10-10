import { analyticsConfig } from './analytics-config.js';
import { createAnalytics } from './analytics.js';
import { buildProposalMessage } from './proposal.js';

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
  coach: { mark: 'MR', name: 'MARCOS RIVERA', role: 'PORTFOLIO DE DIRECTOR TÉCNICO', slogan: 'Clubes, temporadas y palmarés.\nUna pizarra para explorar su idea de juego.', image: new URL('./assets/demos/preview-coach.jpg', import.meta.url).href, alt: 'Vista de la demo de Marcos Rivera, de estética editorial clara', href: 'demo-coach.html', features: ['Escudos y trayectoria', 'Trofeos y palmarés', 'Pizarra interactiva'] },
  agency: { mark: 'N', name: 'NORTH FOOTBALL', role: 'AGENCIA DE REPRESENTACIÓN', slogan: 'Un plantel visual y fichas individuales.\nUna identidad pensada para el talento.', image: new URL('./assets/demos/preview-agency.jpg', import.meta.url).href, alt: 'Vista de la demo North Football, con retratos de jugadores y diseño violeta', href: 'demo-agency.html', features: ['Fotos y fichas de jugadores', 'Atributos visuales', 'Mapas de calor ilustrativos'] },
  player: { mark: 'MS', name: 'MATEO SILVA', role: 'PORTFOLIO PERSONAL DE JUGADOR', slogan: 'Tu perfil, trayectoria y videos en un solo link.\nDemo con módulo adicional de análisis.', image: new URL('./assets/demos/preview-player.svg', import.meta.url).href, alt: 'Ficha ilustrativa de Mateo Silva con atributos y mapa de calor', href: 'demo-player.html', features: ['Ficha y trayectoria', 'Enlaces a tus videos', 'Análisis como módulo adicional'] },
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
document.querySelectorAll('[data-whatsapp="player"]').forEach(link => {
  link.href = 'https://wa.me/5492226638043?text=' + encodeURIComponent('Hola Oscar. Quiero consultar por el portfolio para jugadores de USD 149.\nOrigen: ' + analytics.attributionLabel());
});
document.querySelectorAll('[data-whatsapp]').forEach(link => link.addEventListener('click', () => {
  analytics.track('whatsapp_click', { cta_position: link.dataset.ctaPosition || 'other', offer_type: link.dataset.offerType || selectedOffer() });
}));
document.querySelectorAll('[data-track]').forEach(link => link.addEventListener('click', () => {
  analytics.track(link.dataset.track, { demo_type: link.dataset.demoType, cta_position: link.dataset.ctaPosition, offer_type: link.dataset.offerType });
}));
document.querySelectorAll('[data-faq]').forEach(details => details.addEventListener('toggle', () => {
  if (details.open) analytics.track('faq_open', { faq_id: details.dataset.faq });
}));
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting && analytics.track(entry.target.dataset.observe, { offer_type: entry.target.dataset.offerType || 'professional' })) observer.unobserve(entry.target);
  }), { threshold: 0.15 });
  document.querySelectorAll('[data-observe]').forEach(section => observer.observe(section));
}
const form = document.querySelector('#proposal-form');
const service = document.querySelector('#service');
function selectedOffer() { return service?.value || form?.dataset.offerType || 'professional'; }
function resetPreparedMessage() {
  if (!form) return;
  document.querySelector('#form-result').hidden = true;
  document.querySelector('#send-whatsapp').removeAttribute('href');
}
function chooseService(value, emitEvent = true) {
  if (!service || !Array.from(service.options).some(option => option.value === value)) return;
  service.value = value;
  const isPlayer = value === 'player';
  const budget = form.querySelector('[name="budget"]');
  const budgetChoices = value === 'professional'
    ? ['', 'USD 500 a 750', 'USD 750 a 1.000', 'Más de USD 1.000', 'Quiero definir el alcance primero']
    : isPlayer ? ['USD 149 · Portfolio inicial para jugador', 'Quiero sumar extras y definir el alcance']
    : ['Quiero definir el alcance primero', 'Tengo un presupuesto: lo detallo en el objetivo'];
  budget.replaceChildren(...budgetChoices.map(choice => {
    const option = document.createElement('option'); option.value = choice; option.textContent = choice || 'Elegí una opción'; return option;
  }));
  if (isPlayer) document.querySelector('#profile').value = 'Jugador o jugadora';
  else if (document.querySelector('#profile').value === 'Jugador o jugadora' && value === 'professional') document.querySelector('#profile').value = '';
  const messages = { professional:'Web + portfolio desde USD 500.', player:'Portfolio inicial para jugador: USD 149.', social_setup:'Armado de redes: presupuesto según perfiles y materiales.', social_management:'Gestión de redes: presupuesto mensual según alcance.', combined:'Definimos un presupuesto para los servicios que necesitás.' };
  document.querySelector('#contact-price').textContent = messages[value];
  const send = document.querySelector('#send-whatsapp');
  send.dataset.offerType = value;
  const direct = document.querySelector('[data-whatsapp="direct"][data-cta-position="contact"]');
  if (direct) {
    direct.dataset.offerType = value;
    direct.href = 'https://wa.me/5492226638043?text=' + encodeURIComponent('Hola Oscar. Quiero consultar por ' + service.selectedOptions[0].textContent + '.\nOrigen: ' + analytics.attributionLabel());
  }
  resetPreparedMessage();
  if (emitEvent) analytics.track('service_select', { offer_type: value, cta_position: 'proposal' });
}
service?.addEventListener('change', () => chooseService(service.value));
document.querySelectorAll('[data-service]').forEach(link => link.addEventListener('click', () => chooseService(link.dataset.service, !link.dataset.track)));
let formStarted = false;
form?.addEventListener('focusin', () => {
  if (!formStarted) formStarted = analytics.track('form_start', { cta_position: 'proposal', offer_type: selectedOffer() });
});
form?.addEventListener('input', resetPreparedMessage);
form?.addEventListener('change', resetPreparedMessage);
form?.addEventListener('submit', e => {
  e.preventDefault();
  if (!form.reportValidity()) return;
  const values = Object.fromEntries(new FormData(form));
  const message = buildProposalMessage(values, analytics.attributionLabel());
  document.querySelector('#message-preview').value = message;
  document.querySelector('#send-whatsapp').href = 'https://wa.me/5492226638043?text=' + encodeURIComponent(message);
  const result = document.querySelector('#form-result');
  result.hidden = false;
  result.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion:reduce)').matches ? 'auto' : 'smooth', block: 'nearest' });
  document.querySelector('#send-whatsapp').focus();
  analytics.track('proposal_ready', { cta_position: 'proposal', offer_type: selectedOffer() });
});
const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();
