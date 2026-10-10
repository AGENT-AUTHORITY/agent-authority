# Activar la medición de Agent Authority

La integración incluye el ID de GA4 **G-7RWQ9F2LFR** proporcionado por Oscar. **La recepción de eventos en Google todavía debe verificarse en el dominio publicado.** La ruta configurada es GA4 directo; Tag Manager es una alternativa incluida para una etapa posterior. No pegues otra etiqueta manual en el HTML: el cargador existente inicia una sola etiqueta después de aceptar la analítica.

## 1. Crear GA4 desde cero

1. Entrá en [Google Analytics](https://analytics.google.com/) con la cuenta de Google que vas a conservar como titular.
2. Creá una cuenta llamada **Agent Authority** y una propiedad llamada **Agent Authority — Web**. Seleccioná Argentina / Buenos Aires como zona horaria y USD como moneda para mantener el criterio comercial de la oferta. Revisá personalmente las opciones de uso de datos y las condiciones de Google.
3. Creá un flujo de datos **Web**, con URL `https://agentauthority.lat` y nombre **Web principal**.
4. Copiá el **ID de medición**, que empieza con `G-`. No es una contraseña. No copies el número de propiedad ni el ID del flujo.
5. En la configuración de **Medición mejorada** del flujo, desactivá al menos **clics salientes**, **interacciones de formularios** y **cambios de página por historial**. Para esta implementación conviene desactivarla por completo al principio: los eventos importantes se envían manualmente y así se evitan duplicados y enlaces de WhatsApp con texto personal. No actives Google Signals, medición proporcionada por usuarios ni etiquetas de publicidad en esta puesta en marcha.
6. En `analytics-config.js`, completá solo esta ruta:

```js
mode: 'gtag',
measurementId: 'G-7RWQ9F2LFR',
tagManagerId: '',
```

7. Publicá ese archivo junto con los archivos de la nueva web. **No pegues otra etiqueta de Google en los HTML:** eso duplicaría la integración y podría cargarla antes del consentimiento.

## 2. Comprobar que recibe datos

Abrí la web publicada en un navegador sin bloqueadores para esta prueba. Aceptá la analítica, abrí una demo y pulsá un enlace de contacto. No hace falta enviar el mensaje de WhatsApp para probar el clic.

En **Informes → Tiempo real** de GA4 deben aparecer la visita y los eventos. Google indica que la recepción inicial puede demorar hasta unos 30 minutos. Si no aparece nada, verificá el ID, la publicación de la versión correcta, el consentimiento y los bloqueadores antes de agregar etiquetas nuevas.

Confirmá que aparece **una sola vista de página por carga**, que `whatsapp_click` no se duplica y que ningún evento contiene nombres, teléfonos, emails, objetivos escritos o el parámetro `text` de WhatsApp. Al rechazar la analítica no se debe solicitar ningún script de Google. La elección se puede cambiar desde el pie de página.

## 3. Eventos y significado

| Evento | Qué confirma | Parámetros propios permitidos |
| --- | --- | --- |
| `page_view` | Una página vista con analítica aceptada | `page_type` y origen |
| `offer_view` | Una sección de oferta entró en la vista | `offer_type` y origen |
| `service_select` | Eligió un servicio o su enlace de consulta | `offer_type`, `cta_position` |
| `demo_select` | Cambió la pestaña de ejemplo | `demo_type`, `cta_position` |
| `demo_click` | Pulsó «Explorar demo» | `demo_type`, `cta_position` |
| `demo_view` | Se cargó una página de demo | `demo_type`, `cta_position` |
| `form_start` | Empezó a interactuar con la consulta | `cta_position`, `offer_type` |
| `proposal_ready` | Preparó un mensaje válido para revisar | `cta_position`, `offer_type` |
| `whatsapp_click` | Pulsó el enlace para abrir WhatsApp | `cta_position`, `offer_type` |
| `faq_open` | Abrió una duda frecuente | `faq_id` |

Todos los eventos llevan `page_type`, `origin_source`, `origin_medium` y, si existe un valor permitido, `origin_campaign` y `origin_content`. La ubicación enviada excluye consultas arbitrarias y fragmentos; el referente se reduce a su origen.

**Un clic no demuestra un mensaje enviado.** Esta versión no emite `generate_lead` ni `purchase`. Oscar registra consultas recibidas, propuestas aceptadas y cobros reales en su seguimiento comercial. Un pago solo debería enviarse a GA4 con un mecanismo que lo confirme, moneda, valor e identificador único de transacción.

En GA4 podés marcar `whatsapp_click` como evento clave de **intención de contacto**, sin llamarlo venta. Para comparar los botones, creá una dimensión personalizada de alcance evento para `cta_position`. Podés añadir `demo_type`, `offer_type` y `origin_content` si vas a utilizarlas en tus informes. Evitá crear dimensiones para datos libres del formulario.

### Separar las nuevas ofertas

El parámetro `offer_type` tiene estos valores: `professional`, `player`, `social_setup`, `social_management` y `combined`. Se envían categorías de servicio, nunca campos del formulario, nombres, enlaces de video ni puntuaciones deportivas.

Después de comprobar que llega en Tiempo real, creá una dimensión personalizada: **Administrador → Visualización de datos → Definiciones personalizadas → Crear dimensión personalizada**. Nombre: **Servicio consultado**. Ámbito: **Evento**. Parámetro: **offer_type**. Necesitás rol Editor o superior. La disponibilidad en informes puede demorar entre 24 y 48 horas después de recoger datos y registrar la dimensión. [Instrucciones oficiales](https://support.google.com/analytics/answer/14239696?hl=es).

## 4. Enlaces de campaña

Usá minúsculas y los mismos nombres siempre. No incluyas nombres de prospectos, teléfonos ni emails en las UTM.

| Canal / ubicación | Enlace |
| --- | --- |
| LinkedIn, mensaje directo | `https://agentauthority.lat/?utm_source=linkedin&utm_medium=dm&utm_campaign=prospeccion&utm_content=dm` |
| LinkedIn, perfil personal | `https://agentauthority.lat/?utm_source=linkedin&utm_medium=organic_social&utm_campaign=lanzamiento&utm_content=perfil` |
| LinkedIn, publicación de demo | `https://agentauthority.lat/?utm_source=linkedin&utm_medium=organic_social&utm_campaign=contenido&utm_content=demo_agencia` |
| Instagram, bio | `https://agentauthority.lat/?utm_source=instagram&utm_medium=organic_social&utm_campaign=lanzamiento&utm_content=bio` |
| Instagram, mensaje directo | `https://agentauthority.lat/?utm_source=instagram&utm_medium=dm&utm_campaign=prospeccion&utm_content=dm` |
| Instagram, portfolio para jugadores | `https://agentauthority.lat/jugadores.html?utm_source=instagram&utm_medium=dm&utm_campaign=jugadores&utm_content=portfolio` |
| Instagram, demo de jugador | `https://agentauthority.lat/demo-player.html?utm_source=instagram&utm_medium=organic_social&utm_campaign=jugadores&utm_content=demo_jugador` |
| LinkedIn, servicios de redes | `https://agentauthority.lat/?utm_source=linkedin&utm_medium=dm&utm_campaign=redes&utm_content=oferta#redes` |
| Instagram, historia | `https://agentauthority.lat/?utm_source=instagram&utm_medium=organic_social&utm_campaign=contenido&utm_content=historia` |

El sitio acepta una lista acotada de fuentes, campañas y contenidos para excluir valores arbitrarios. Si creás una campaña nueva, incorporá su nombre a `campaigns` en `analytics-config.js`; para una pieza nueva, añadí su categoría a `contents`. Usá categorías, no un identificador para cada persona.

Las UTM se mantienen durante la navegación interna de una demo y se agregan en lenguaje legible al mensaje preparado. Si no hay UTM ni referente reconocido, se informa «Visita directa / origen no identificado»; no se inventa un canal.

## 5. Si preferís Google Tag Manager

GTM organiza etiquetas; **GA4** analiza los datos. GTM no reemplaza la propiedad de Analytics.

1. Creá una cuenta y un contenedor **Web** en [Google Tag Manager](https://tagmanager.google.com/). Copiá su ID real `GTM-…`.
2. Cambiá `mode` a `'gtm'`, completá `tagManagerId` y dejá `measurementId` vacío. No añadas los snippets habituales a mano: el cargador del sitio espera a la aceptación para iniciar el contenedor. Por ese motivo no se utiliza un iframe `noscript` que lo cargue sin permiso.
3. En GTM, creá variables de capa de datos, versión 2, para `page_location`, `page_referrer`, `page_type`, `cta_position`, `demo_type`, `faq_id`, `offer_type`, `origin_source`, `origin_medium`, `origin_campaign` y `origin_content`.
4. Creá una etiqueta **Google tag** con el ID `G-` de la propiedad. Configurá `send_page_view` como `false`, `allow_google_signals` como `false`, `allow_ad_personalization_signals` como `false` y `page_location` / `page_referrer` con sus variables saneadas. Activación: **Initialization — All Pages**. El contenedor ya se carga únicamente después de aceptar.
5. Creá una etiqueta **Google Analytics: GA4 Event**, nombre del evento `{{Event}}`, con los parámetros anteriores vinculados a las variables de capa de datos. Añadí un activador **Custom Event** con expresión regular exacta:

```text
^(page_view|offer_view|demo_view|demo_click|demo_select|form_start|proposal_ready|whatsapp_click|faq_open|service_select)$
```

6. Exigí `analytics_storage` en las comprobaciones de consentimiento de las etiquetas de analítica. No agregues activadores automáticos de enlaces o formularios que capturen los campos o el `href` completo de WhatsApp.
7. Probá el contenedor en Preview / Tag Assistant: una sola etiqueta base, una sola vista de página y eventos sin datos personales. Publicá el contenedor después de esa prueba.

No actives GA4 directo y GTM a la vez para la misma propiedad. Esta ruta está soportada por el código, pero un contenedor real debe configurarse y verificarse en tu cuenta antes de considerarla operativa.

## 6. Qué mirar semanalmente

- **Adquisición de tráfico:** sesiones por fuente / medio y campaña. En GA4 es distinto el primer origen del usuario del origen de la sesión.
- **Intención:** usuarios con `offer_view`, `demo_view`, `proposal_ready` y `whatsapp_click`, por canal y dispositivo. Para ratios usá usuarios únicos o sesiones con evento, no eventos repetidos como si fueran personas.
- **Negocio:** consultas efectivamente recibidas, consultas con encaje, propuestas enviadas, aceptaciones y pagos. Registralos aparte y vinculá su canal declarado.

Analytics muestra una parte observable del tráfico: consentimiento, bloqueadores, mensajes entre dispositivos y falta de UTM pueden reducir o cambiar la atribución. Complementalo con el origen del mensaje y una pregunta breve al prospecto cuando sea necesario. Revisá tu propia política de privacidad al configurar servicios nuevos.

## Documentación oficial consultada

- [Crear cuenta, propiedad y flujo de GA4](https://support.google.com/analytics/answer/9304153?hl=es)
- [Campañas con UTM](https://support.google.com/analytics/answer/10917952?hl=es)
- [Evitar información personal en Analytics](https://support.google.com/analytics/answer/6366371?hl=es)
- [Modo de consentimiento básico y avanzado](https://developers.google.com/tag-platform/security/concepts/consent-mode)
- [Implementar consentimiento](https://developers.google.com/tag-platform/security/guides/consent)
- [Capa de datos de Tag Manager](https://developers.google.com/tag-platform/devguides/datalayer)
- [Google tag en Tag Manager](https://support.google.com/tagmanager/answer/9442095?hl=es)
- [Eventos recomendados de GA4](https://developers.google.com/analytics/devguides/collection/ga4/reference/events)
