import assert from 'node:assert/strict';
import { players, attributeLabels } from '../football-data.js';
import { createHeatmapSvg, createRadarSvg, analysisMarkup } from '../football-visuals.js';
import { buildProposalMessage } from '../proposal.js';
import { sanitizeEvent, readAttribution } from '../analytics.js';
import { analyticsConfig } from '../analytics-config.js';

for (const [key,player] of Object.entries(players)) {
  assert.equal(player.attributes.length, attributeLabels.length);
  assert.ok(player.attributes.every(value => Number.isFinite(value) && value>=0 && value<=99));
  for (const phase of ['all','ball','off']) {
    const svg = createHeatmapSvg(player,phase,key+'-'+phase);
    assert.ok(svg.includes(player.zoneSummary[phase]));
    assert.ok(svg.includes('No son posiciones GPS ni mediciones reales.'));
    assert.ok(!svg.includes('NaN'));
    assert.ok(player.zones[phase].every(([x,y,r]) => x>=0 && x<=100 && y>=0 && y<=100 && r>0));
  }
  assert.notEqual(createHeatmapSvg(player,'all','same'),createHeatmapSvg(player,'ball','same'));
  assert.ok(createRadarSvg(player,key).includes('Valores ficticios'));
}
const combined = analysisMarkup(players.mateo,'lab') + analysisMarkup(players.mateo,'dialog');
const ids = [...combined.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
assert.equal(new Set(ids).size,ids.length,'SVG definitions must not collide across the lab and dialog');
assert.equal(createHeatmapSvg(players.mateo,'invalid','fallback'),createHeatmapSvg(players.mateo,'all','fallback'));
const malicious = {...players.mateo,name:'<script>alert("test")</script>'};
assert.ok(!createRadarSvg(malicious).includes('<script>'));
assert.ok(!createHeatmapSvg(malicious).includes('<script>'));

const proposal = buildProposalMessage({service:'social_management',name:'Test',profile:'Jugador',goal:'Ordenar redes',budget:'A definir',timing:'Este mes'},'Instagram');
assert.ok(proposal.includes('Gestión mensual de redes'));
assert.ok(!proposal.includes('undefined'));
assert.ok(!proposal.includes('Perfil / video / web:'));
assert.ok(buildProposalMessage({service:'Portfolio inicial para jugador',budget:'USD 149'},'Directo').includes('USD 149'));
assert.deepEqual(sanitizeEvent('proposal_ready',{offer_type:'player',name:'Private',video:'https://private.example',rating:99}),{offer_type:'player'});
assert.deepEqual(sanitizeEvent('service_select',{offer_type:'Private Person'}),{});
assert.deepEqual(sanitizeEvent('demo_view',{demo_type:'player',page_type:'demo_player'}),{page_type:'demo_player',demo_type:'player'});
const attribution = readAttribution({href:'https://agentauthority.lat/jugadores.html?utm_source=instagram&utm_medium=dm&utm_campaign=jugadores&utm_content=demo_jugador',hostname:'agentauthority.lat'},'',null,analyticsConfig);
assert.equal(attribution.campaign,'jugadores');
assert.equal(attribution.content,'demo_jugador');
console.log('PASS player graphics, distinct map phases, SVG IDs, escaping, service proposals and safe offer attribution');
