// All identities and values in this module are fictional demonstration data.
export const attributeLabels = ['Ritmo', 'Remate', 'Pase', 'Control', 'Defensa', 'Físico'];
export const goalkeeperAttributeLabels = ['Reflejos', 'Manejo', 'Juego aéreo', 'Distribución', 'Uno contra uno', 'Posicionamiento'];
export const getAttributeLabels = player => player.attributeLabels ?? attributeLabels;
const crest = club => new URL('./assets/demos/crest-'+club+'.svg', import.meta.url).href;
export const players = {
  mateo: { name:'Mateo Silva', image:new URL('./assets/demos/player-mateo.webp', import.meta.url).href, number:'09', code:'DC', role:'Delantero centro',
    portfolio:{initials:'MS', first:'MATEO', last:'SILVA.', country:'Argentina', tagline:'Atacar el espacio. Conectar el juego. Estar donde se define la jugada.', club:'Puerto Sur FC', height:'1,84 m', foot:'Derecha', age:'24 años', crests:[crest('puerto'),crest('sierra')], careerRoles:['Primer equipo · Delantero','Formación · Primer equipo'], videoFocus:'Una selección con un foco concreto: definición, progresión o duelos.'},
    data:[['País','Argentina'],['Edad','24 años'],['Altura','1,84 m'],['Pierna hábil','Derecha'],['Club de ejemplo','Puerto Sur FC'],['Posición','Delantero centro']],
    strengths:'Movilidad entre centrales, apoyos de espaldas y ataque al espacio. Un perfil orientado a la finalización y a conectar el último tercio.',
    career:[['2023 — 2026','Puerto Sur FC'],['2020 — 2023','Unión Sierra']], attributes:[86,88,73,82,34,79],
    zones:{ all:[[76,48,48],[84,30,37],[83,68,39],[62,52,34]], ball:[[84,49,44],[75,31,32],[74,65,30]], off:[[64,50,44],[80,23,36],[81,77,36]] },
    zoneSummary:{all:'Mayor concentración en el último tercio, entre centrales y en los dos canales interiores.',ball:'Acciones con pelota cerca del área y apoyos por los canales interiores.',off:'Acciones sin pelota en apoyos centrales y desmarques por ambos canales.'} },
  lucas: { name:'Lucas Costa', image:new URL('./assets/demos/player-lucas.webp', import.meta.url).href, number:'08', code:'MC', role:'Mediocampista central',
    data:[['País','Argentina'],['Edad','27 años'],['Altura','1,78 m'],['Pierna hábil','Izquierda'],['Club de ejemplo','Atlético Delta'],['Posición','Volante central']],
    strengths:'Lectura del juego, circulación de la pelota y conexión entre líneas. Un mediocampista que ofrece apoyos y continuidad a la posesión.',
    career:[['2022 — 2026','Atlético Delta'],['2018 — 2022','Puerto Sur FC']], attributes:[74,69,89,87,68,76],
    zones:{all:[[49,49,50],[61,33,38],[59,68,36],[36,53,33]],ball:[[58,45,49],[68,32,33],[51,65,37]],off:[[39,51,47],[48,26,35],[50,76,34]]},
    zoneSummary:{all:'Mayor concentración en el carril central y a ambos lados del mediocampo.',ball:'Acciones con pelota en el centro y en conexiones hacia el último tercio.',off:'Acciones sin pelota por detrás de la línea media y en coberturas laterales.'} },
  nicolas: { name:'Nicolás Duarte', image:new URL('./assets/demos/player-nicolas.webp', import.meta.url).href, number:'04', code:'DFC', role:'Defensor central',
    data:[['País','Uruguay'],['Edad','23 años'],['Altura','1,89 m'],['Pierna hábil','Derecha'],['Club de ejemplo','Unión Sierra'],['Posición','Defensor central']],
    strengths:'Anticipación, juego aéreo y primer pase. Un defensor que combina presencia en el área con una salida simple y orientada.',
    career:[['2024 — 2026','Unión Sierra'],['2021 — 2024','Atlético Delta']], attributes:[70,42,75,67,88,86],
    zones:{all:[[24,48,49],[34,28,36],[32,70,36],[43,51,28]],ball:[[32,49,47],[42,30,31],[42,70,31]],off:[[18,50,47],[28,25,35],[26,74,35]]},
    zoneSummary:{all:'Mayor concentración en campo propio, el área y los canales defensivos.',ball:'Acciones con pelota en la primera línea y en salidas por ambos canales.',off:'Acciones sin pelota cerca del área propia y en coberturas defensivas.'} },
  anibal: { name:'Aníbal “Perfumo” Gonzales', image:new URL('./assets/demos/player-julian.webp', import.meta.url).href, number:'01', code:'ARQ', role:'Arquero', kind:'goalkeeper',
    portfolio:{initials:'AG', first:'ANÍBAL', last:'GONZALES.', nickname:'“PERFUMO”', country:'Argentina', tagline:'Proteger el arco. Ordenar el área. Dar el primer pase.', club:'Atlético Delta', height:'1,91 m', foot:'Derecha', age:'25 años', crests:[crest('delta'),crest('puerto')], careerRoles:['Primer equipo · Arquero','Formación · Primer equipo'], videoFocus:'Atajadas, centros, uno contra uno y distribución: acciones para observar tu trabajo bajo los tres palos.'},
    data:[['País','Argentina'],['Edad','25 años'],['Altura','1,91 m'],['Pierna hábil','Derecha'],['Club de ejemplo','Atlético Delta'],['Posición','Arquero']],
    strengths:'Reflejos bajo los tres palos, lectura de centros y cobertura de la espalda de la defensa. Un arquero que participa en la salida y organiza su área.',
    career:[['2022 — 2026','Atlético Delta'],['2018 — 2022','Puerto Sur FC']],
    attributeLabels:goalkeeperAttributeLabels, attributeShortLabels:['REF','MAN','AER','DIS','1V1','POS'], attributes:[89,84,86,78,88,87],
    zones:{all:[[7,50,18],[13,33,15],[14,68,15],[23,50,14]],ball:[[14,50,18],[23,33,14],[23,66,14]],off:[[4,50,14],[10,36,12],[11,64,12]]},
    zoneSummary:{all:'Acciones concentradas en el arco y el área propia, con intervenciones por delante del área.',ball:'Acciones con pelota en el área y en apoyos para iniciar la salida del equipo.',off:'Posicionamiento sin pelota bajo los tres palos y en la cobertura del área propia.'} },
};
export const microcycle = [
  {code:'MD−4', day:'Construir', title:'Principios colectivos', focus:'Salida con apoyos y ocupación de los espacios interiores.', tasks:['Video: reconocer el primer apoyo.','Campo: juego de posición y progresión.','Cierre: acuerdos entre líneas.'], load:4},
  {code:'MD−3', day:'Intensificar', title:'Competir en espacios reducidos', focus:'Presión tras pérdida y coordinación del bloque.', tasks:['Activación con pelota.','Campo: situaciones de oposición.','Cierre: revisión de decisiones.'], load:5},
  {code:'MD−2', day:'Ajustar', title:'Plan de partido', focus:'Preparar escenarios del rival y roles por sector.', tasks:['Video: situaciones del próximo rival.','Campo: ensayo del plan colectivo.','Cierre: tareas por línea.'], load:3},
  {code:'MD−1', day:'Afinar', title:'Claridad para competir', focus:'Repasar balón parado y acuerdos del equipo.', tasks:['Activación breve.','Campo: repaso de pelota parada.','Cierre: mensajes y roles.'], load:2},
  {code:'MD', day:'Competir', title:'Llevar la idea al partido', focus:'Observar el contexto, ajustar y sostener los principios.', tasks:['Preparación del grupo.','Partido: observación y decisiones.','Registro para la siguiente semana.'], load:5},
];
