const CONSENT_KEY = 'aa_analytics_consent_v1';
const SOURCE_KEY = 'aa_visit_source_v1';
const CONSENT_TTL = 180 * 24 * 60 * 60 * 1000;
const SESSION_TTL = 30 * 60 * 1000;
const EVENTS = new Set(['page_view', 'offer_view', 'demo_view', 'demo_click', 'demo_select', 'form_start', 'proposal_ready', 'whatsapp_click', 'faq_open']);
const PAGES = new Set(['home', 'demo_agency', 'demo_coach', 'privacy', 'agents']);
const SOURCES = new Set(['linkedin', 'instagram', 'google', 'email', 'referral', 'direct']);
const MEDIA = new Set(['social', 'organic_social', 'dm', 'referral', 'email', 'paid_social', 'organic', 'none']);
const POSITIONS = new Set(['showcase', 'oscar', 'contact', 'mobile', 'proposal', 'demo', 'other']);
const FAQS = new Set(['socials', 'materials', 'timeline', 'ownership', 'existing_site', 'results']);
const safeRead = (storage, key) => { try { return JSON.parse(storage.getItem(key)); } catch { return null; } };
const safeWrite = (storage, key, value) => { try { storage.setItem(key, JSON.stringify(value)); } catch { /* The site still works without storage. */ } };

export function readAttribution(location, referrer, previous, config, now = Date.now()) {
  const url = new URL(location.href);
  const source = url.searchParams.get('utm_source')?.toLowerCase();
  const medium = url.searchParams.get('utm_medium')?.toLowerCase();
  const campaign = url.searchParams.get('utm_campaign')?.toLowerCase();
  const content = url.searchParams.get('utm_content')?.toLowerCase();
  if (SOURCES.has(source) && source !== 'direct') return {
    source, medium: MEDIA.has(medium) ? medium : 'referral',
    campaign: config.campaigns.includes(campaign) ? campaign : '',
    content: config.contents.includes(content) ? content : '', timestamp: now,
  };
  let host = '';
  try { host = new URL(referrer).hostname.toLowerCase(); } catch { /* Direct traffic. */ }
  const domain = name => host === name || host.endsWith('.' + name);
  const inferred = domain('linkedin.com') || domain('lnkd.in') ? 'linkedin' : domain('instagram.com') ? 'instagram' : domain('google.com') ? 'google' : '';
  if (inferred) return { source: inferred, medium: inferred === 'google' ? 'organic' : 'social', campaign: '', content: '', timestamp: now };
  if (previous && now - previous.timestamp >= 0 && now - previous.timestamp < SESSION_TTL && SOURCES.has(previous.source) && MEDIA.has(previous.medium)) return {
    source: previous.source, medium: previous.medium,
    campaign: config.campaigns.includes(previous.campaign) ? previous.campaign : '',
    content: config.contents.includes(previous.content) ? previous.content : '', timestamp: now,
  };
  return { source: host && host !== location.hostname ? 'referral' : 'direct', medium: host && host !== location.hostname ? 'referral' : 'none', campaign: '', content: '', timestamp: now };
}

export function sanitizeEvent(name, params = {}) {
  if (!EVENTS.has(name)) return null;
  const safe = {};
  if (PAGES.has(params.page_type)) safe.page_type = params.page_type;
  if (POSITIONS.has(params.cta_position)) safe.cta_position = params.cta_position;
  if (['agency', 'coach'].includes(params.demo_type)) safe.demo_type = params.demo_type;
  if (FAQS.has(params.faq_id)) safe.faq_id = params.faq_id;
  return safe;
}

export function createAnalytics(win, doc, config) {
  let granted = false;
  let started = false;
  let banner;
  const pageType = PAGES.has(doc.body.dataset.pageType) ? doc.body.dataset.pageType : 'home';
  let prior;
  try { prior = safeRead(win.sessionStorage, SOURCE_KEY); } catch { /* Storage may be unavailable. */ }
  const attribution = readAttribution(win.location, doc.referrer, prior, config);
  try { safeWrite(win.sessionStorage, SOURCE_KEY, attribution); } catch { /* No dependency on storage. */ }
  const mode = config.mode;
  const id = mode === 'gtm' ? config.tagManagerId : config.measurementId;
  const validId = mode === 'gtm' ? /^GTM-[A-Z0-9]+$/.test(id) : mode === 'gtag' && /^G-[A-Z0-9]{6,}$/.test(id);
  const configured = validId && config.productionHosts.includes(win.location.hostname);
  const path = ['/', '/index.html', '/demo-agency.html', '/demo-coach.html', '/privacidad.html', '/agentes.html'].includes(win.location.pathname) ? win.location.pathname : '/';
  const safePage = new URL(win.location.origin + path);
  if (attribution.source !== 'direct') {
    safePage.searchParams.set('utm_source', attribution.source);
    safePage.searchParams.set('utm_medium', attribution.medium);
    if (attribution.campaign) safePage.searchParams.set('utm_campaign', attribution.campaign);
    if (attribution.content) safePage.searchParams.set('utm_content', attribution.content);
  }
  let safeReferrer = '';
  try { safeReferrer = new URL(doc.referrer).origin; } catch { /* Empty referrer. */ }
  const sourceParams = { origin_source: attribution.source, origin_medium: attribution.medium };
  if (attribution.campaign) sourceParams.origin_campaign = attribution.campaign;
  if (attribution.content) sourceParams.origin_content = attribution.content;
  const layer = () => (win.dataLayer = win.dataLayer || []);
  function command() { layer().push(arguments); }
  function track(name, params = {}) {
    const safe = sanitizeEvent(name, { page_type: pageType, ...params });
    if (!configured || !granted || !started || !safe) return false;
    const payload = { ...safe, ...sourceParams, page_location: safePage.href, page_referrer: safeReferrer };
    if (mode === 'gtm') layer().push({ event: name, cta_position: null, demo_type: null, faq_id: null, ...payload });
    else command('event', name, { ...payload, send_to: id });
    return true;
  }
  function activate() {
    granted = true;
    if (started) return;
    started = true;
    // Basic consent mode: no Google script is loaded before acceptance.
    command('consent', 'default', { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
    command('consent', 'update', { analytics_storage: 'granted', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
    const script = doc.createElement('script');
    script.async = true;
    script.id = 'aa-google-tag';
    if (mode === 'gtm') {
      layer().push({ 'gtm.start': Date.now(), event: 'gtm.js' });
      script.src = 'https://www.googletagmanager.com/gtm.js?id=' + id;
    } else {
      win.gtag = command;
      command('js', new Date());
      command('config', id, { send_page_view: false, allow_google_signals: false, allow_ad_personalization_signals: false, page_location: safePage.href, page_referrer: safeReferrer });
      script.src = 'https://www.googletagmanager.com/gtag/js?id=' + id;
    }
    doc.head.append(script);
    track('page_view');
    if (pageType === 'demo_agency' || pageType === 'demo_coach') track('demo_view', { demo_type: pageType === 'demo_agency' ? 'agency' : 'coach', cta_position: 'demo' });
  }
  function choose(accepted) {
    try { safeWrite(win.localStorage, CONSENT_KEY, { accepted, timestamp: Date.now() }); } catch { /* Keep the in-memory choice. */ }
    banner.hidden = true;
    if (accepted) activate();
    else {
      const reload = started;
      granted = false;
      if (reload) win.location.reload();
    }
  }
  function init() {
    if (!configured) return;
    banner = doc.createElement('section');
    banner.className = 'consent-banner';
    banner.setAttribute('role', 'region');
    banner.setAttribute('aria-labelledby', 'consent-title');
    banner.innerHTML = '<div><h2 id="consent-title">¿Nos ayudás a mejorar la web?</h2><p>Con tu permiso, Google Analytics mide visitas y clics. Podés usar la web sin aceptar. <a href="privacidad.html">Ver privacidad</a>.</p><small>Si cambiás tu elección después, se recargará la página.</small></div><div class="consent-actions"><button type="button" data-consent="no" class="button outline">Rechazar</button><button type="button" data-consent="yes" class="button">Aceptar analítica</button></div>';
    doc.body.append(banner);
    banner.querySelector('[data-consent="yes"]').addEventListener('click', () => choose(true));
    banner.querySelector('[data-consent="no"]').addEventListener('click', () => choose(false));
    doc.querySelectorAll('.privacy-settings').forEach(button => {
      button.hidden = false;
      button.addEventListener('click', () => { banner.hidden = false; banner.querySelector('[data-consent="no"]').focus(); });
    });
    let choice;
    try { choice = safeRead(win.localStorage, CONSENT_KEY); } catch { /* Ask without persistence. */ }
    if (choice && typeof choice.accepted === 'boolean' && Date.now() - choice.timestamp >= 0 && Date.now() - choice.timestamp < CONSENT_TTL) {
      banner.hidden = true;
      if (choice.accepted) activate();
    }
  }
  function attributionLabel() {
    const labels = { linkedin: 'LinkedIn', instagram: 'Instagram', google: 'Google', email: 'Email', referral: 'Enlace externo', direct: 'Visita directa / origen no identificado' };
    return [labels[attribution.source], attribution.medium === 'dm' ? 'mensaje directo' : '', attribution.campaign, attribution.content].filter(Boolean).join(' · ');
  }
  return { init, track, attributionLabel };
}
