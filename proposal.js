const serviceLabels = {professional:'Web + portfolio profesional',player:'Portfolio inicial para jugador',social_setup:'Armado de perfiles en redes',social_management:'Gestión mensual de redes',combined:'Web y redes / alcance combinado'};
export function buildProposalMessage(values, origin) {
  const value = key => String(values[key] || '').trim();
  return [
    'Hola Oscar. Quiero consultar por este servicio.',
    'Servicio: ' + (serviceLabels[value('service')] || value('service') || serviceLabels.professional),
    'Nombre: ' + value('name'),
    'Perfil: ' + value('profile'),
    value('site') ? 'Perfil / video / web: ' + value('site') : '',
    'Objetivo y materiales: ' + value('goal'),
    'Inversión que evalúo: ' + value('budget'),
    'Cuándo quiero empezar: ' + value('timing'),
    'Origen: ' + origin,
  ].filter(Boolean).join('\n');
}
