import { defineConfig } from 'vite';
import { resolve } from 'node:path';
export default defineConfig({server:{host:'0.0.0.0',allowedHosts:['terminal.local']},build:{rollupOptions:{input:{home:resolve('index.html'),agents:resolve('agentes.html'),coach:resolve('demo-coach.html'),agency:resolve('demo-agency.html'),player:resolve('demo-player.html'),playersOffer:resolve('jugadores.html'),privacy:resolve('privacidad.html')}}}});
