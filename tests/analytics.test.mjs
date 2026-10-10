import assert from 'node:assert/strict';
import { createAnalytics, readAttribution, sanitizeEvent } from '../analytics.js';
import { analyticsConfig } from '../analytics-config.js';

function fixture(overrides = {}, savedChoice = null, context = {}) {
  const scripts = [], controls = {}, settings = [];
  const makeControl = () => ({ hidden: true, events: {}, addEventListener(type, fn) { this.events[type] = fn; }, focus() {} });
  const yes = makeControl(), no = makeControl();
  const preferences = makeControl(); settings.push(preferences);
  const storage = () => { const map = new Map(); return { getItem: k => map.get(k) || null, setItem: (k, v) => map.set(k, v), map }; };
  const win = { location: { href: 'https://agentauthority.lat/?utm_source=linkedin&utm_medium=dm&utm_campaign=prospeccion&utm_content=dm&email=private%40example.com#private', hostname: 'agentauthority.lat', pathname: '/', origin: 'https://agentauthority.lat', reload() { win.reloads++; } }, localStorage: storage(), sessionStorage: storage(), reloads: 0 };
  if (savedChoice) win.localStorage.setItem('aa_analytics_consent_v1', JSON.stringify(savedChoice));
  const doc = { referrer: 'https://www.linkedin.com/feed/?email=private@example.com', body: { dataset: { pageType: 'home' }, append(element) { controls.banner = element; } }, head: { append(element) { scripts.push(element); } }, createElement(tag) { return { tag, hidden: false, setAttribute() {}, querySelector(selector) { return selector.includes('yes') ? yes : no; } }; }, querySelectorAll() { return settings; } };
  if (context.pageType) doc.body.dataset.pageType = context.pageType;
  if (context.pathname) {
    win.location.pathname = context.pathname;
    win.location.href = win.location.origin + context.pathname + '?utm_source=instagram&utm_medium=dm&utm_campaign=jugadores&phone=private';
  }
  const config = { ...analyticsConfig, measurementId: 'G-TEST123456', ...overrides };
  const analytics = createAnalytics(win, doc, config); analytics.init();
  return { win, scripts, controls, yes, no, preferences, analytics };
}

let checks = 0;
const check = (label, fn) => { fn(); checks++; console.log('PASS ' + label); };
check('No ID: no Google scripts, no consent UI, no events', () => {
  const f = fixture({ measurementId: '' }); assert.equal(f.scripts.length, 0); assert.equal(f.controls.banner, undefined); assert.equal(f.analytics.track('whatsapp_click'), false);
});
check('No consent: no scripts and no queued pre-consent click', () => {
  const f = fixture(); assert.equal(f.scripts.length, 0); assert.equal(f.analytics.track('whatsapp_click'), false); assert.equal(f.win.dataLayer, undefined);
});
check('Accept: one loader, one page_view, advertising denied', () => {
  const f = fixture(); f.yes.events.click(); f.yes.events.click();
  assert.equal(f.scripts.length, 1); assert.ok(f.scripts[0].src.startsWith('https://www.googletagmanager.com/gtag/js'));
  const rows = f.win.dataLayer.map(row => Array.from(row));
  assert.equal(rows.filter(row => row[0] === 'event' && row[1] === 'page_view').length, 1);
  assert.equal(rows.find(row => row[0] === 'consent' && row[1] === 'update')[2].ad_user_data, 'denied');
});
check('PII and arbitrary fields/URLs are excluded from payloads', () => {
  const f = fixture(); f.yes.events.click(); f.analytics.track('whatsapp_click', { cta_position: 'contact', name: 'Private Person', email: 'private@example.com', goal: 'private text', link_url: 'https://wa.me/123?text=private', page_location: 'https://private.example/' });
  const data = JSON.stringify(f.win.dataLayer);
  for (const forbidden of ['private', 'Private Person', 'wa.me', 'email=']) assert.equal(data.includes(forbidden), false);
  assert.ok(data.includes('utm_source=linkedin')); assert.ok(data.includes('whatsapp_click'));
});
check('Unknown events and unknown enum values cannot be emitted', () => {
  assert.equal(sanitizeEvent('purchase', { value: 500 }), null);
  assert.deepEqual(sanitizeEvent('faq_open', { faq_id: 'private@example.com', page_type: 'private' }), {});
});
check('Reject: no loader; reopen then accept works', () => {
  const f = fixture(); f.no.events.click(); assert.equal(f.scripts.length, 0); assert.equal(f.controls.banner.hidden, true);
  f.preferences.events.click(); assert.equal(f.controls.banner.hidden, false); f.yes.events.click(); assert.equal(f.scripts.length, 1);
});
check('Withdraw: future custom events stop and page reload requested', () => {
  const f = fixture(); f.yes.events.click(); f.no.events.click(); assert.equal(f.win.reloads, 1); assert.equal(f.analytics.track('whatsapp_click'), false);
});
check('A saved rejection does not load Google', () => {
  const f = fixture({}, { accepted: false, timestamp: Date.now() }); assert.equal(f.scripts.length, 0); assert.equal(f.controls.banner.hidden, true);
});
check('GTM mode is exclusive even when both IDs exist', () => {
  const f = fixture({ mode: 'gtm', tagManagerId: 'GTM-TEST123' }); f.yes.events.click(); f.analytics.track('proposal_ready', { cta_position: 'proposal' });
  assert.equal(f.scripts.length, 1); assert.ok(f.scripts[0].src.includes('/gtm.js?')); assert.ok(f.win.dataLayer.some(row => row.event === 'proposal_ready')); assert.equal(f.win.gtag, undefined);
});
check('Preview hosts never load production tracking', () => {
  const f = fixture({ productionHosts: ['other.example'] }); assert.equal(f.controls.banner, undefined); assert.equal(f.analytics.track('page_view'), false);
});
check('Attribution survives an internal demo visit, then expires', () => {
  const previous = { source: 'linkedin', medium: 'dm', campaign: 'prospeccion', content: 'dm', timestamp: 1000 };
  const location = { href: 'https://agentauthority.lat/demo-agency.html', hostname: 'agentauthority.lat' };
  assert.equal(readAttribution(location, 'https://agentauthority.lat/', previous, analyticsConfig, 2000).source, 'linkedin');
  assert.equal(readAttribution(location, 'https://agentauthority.lat/', previous, analyticsConfig, 2000000).source, 'direct');
});
check('Arbitrary UTM values and external personal query strings are discarded', () => {
  const location = { href: 'https://agentauthority.lat/?utm_source=private@example.com&utm_campaign=person_name&utm_content=phone123456789', hostname: 'agentauthority.lat' };
  const result = readAttribution(location, '', null, analyticsConfig); assert.equal(result.source, 'direct'); assert.equal(result.campaign, '');
});
check('Unavailable storage does not prevent consent or tracking', () => {
  const f = fixture(); f.win.localStorage.setItem = () => { throw new Error('blocked'); }; f.yes.events.click(); assert.equal(f.scripts.length, 1); assert.equal(f.analytics.track('form_start'), true);
});
check('New player pages emit safe paths and a single player demo view', () => {
  const f = fixture({}, null, {pageType:'demo_player',pathname:'/demo-player.html'}); f.yes.events.click();
  const events = f.win.dataLayer.map(row => Array.from(row)).filter(row => row[0] === 'event');
  const demos = events.filter(row => row[1] === 'demo_view');
  assert.equal(demos.length,1); assert.equal(demos[0][2].demo_type,'player');
  assert.ok(demos[0][2].page_location.includes('/demo-player.html'));
  assert.equal(JSON.stringify(events).includes('phone='),false);
  const offer = fixture({}, null, {pageType:'players_offer',pathname:'/jugadores.html'}); offer.yes.events.click();
  assert.equal(offer.win.dataLayer.map(row => Array.from(row)).filter(row => row[1] === 'demo_view').length,0);
  assert.equal(offer.analytics.track('offer_view',{offer_type:'player'}),true);
});
check('GTM clears offer type between events and never retains form data', () => {
  const f=fixture({mode:'gtm',tagManagerId:'GTM-TEST123'}); f.yes.events.click();
  f.analytics.track('service_select',{offer_type:'social_setup',name:'Private Person'});
  f.analytics.track('faq_open',{faq_id:'socials'});
  const rows=f.win.dataLayer.filter(row => row.event);
  assert.equal(rows.at(-2).offer_type,'social_setup');assert.equal(rows.at(-1).offer_type,null);
  assert.equal(JSON.stringify(rows).includes('Private Person'),false);
});
console.log(`${checks} checks passed. Test IDs were used only with in-memory script stubs; no Google requests were made.`);
