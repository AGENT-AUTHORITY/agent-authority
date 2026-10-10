# Agent Authority

Sitio estático para presentar servicios digitales a profesionales del fútbol.

## Desarrollo

```sh
npm ci
npm run dev -- --host 0.0.0.0 --port 4173 --strictPort
npm run build
```

Los HTML, `styles.css`, `main.js`, `analytics.js`, `analytics-config.js` y `assets/` también funcionan sin compilación, desde la raíz del repositorio en GitHub Pages. Las tipografías y los iconos se sirven localmente.

## Contacto

El formulario valida perfil, objetivo, inversión y plazo; prepara una consulta y ofrece un enlace a WhatsApp `5492226638043`. El visitante revisa y envía el mensaje en WhatsApp. La web no almacena los campos en un servidor y nunca informa que un mensaje fue enviado. El contacto visible usa únicamente el nombre Oscar.

## Medición

La base usa GA4 directo con el ID `G-7RWQ9F2LFR`, consentimiento previo, eventos limitados y atribución por UTM. La recepción de eventos debe verificarse después de publicar en el dominio. Los clics a WhatsApp no se cuentan como consultas recibidas ni ventas. Consultar [la guía de Analytics](docs/ANALYTICS.md) para verificarla en Tiempo real. La configuración local de desarrollo está excluida de la medición. Google Tag Manager sigue disponible como ruta alternativa.

## Oferta

Web y portfolio desde USD 500, con alcance base visible, dos rondas de revisión y extras definidos antes de comenzar. La fecha y forma de pago se acuerdan en la propuesta. No se atribuyen resultados comerciales al diseño de la web.

`jugadores.html` ofrece un portfolio inicial de USD 149: una página en español sobre una plantilla, fotos y contenido aportados, ficha básica, trayectoria, hasta tres enlaces de video, contacto y una ronda de ajustes. Dominio y hosting aparte. Análisis, edición de video, idiomas, nuevos contenidos y mantenimiento tienen presupuesto adicional. El armado inicial de perfiles y la gestión mensual de redes se ofrecen por separado en la portada.

## Demos

`demo-coach.html`, `demo-agency.html` y `demo-player.html` usan identidades ficticias, avisos visibles y `noindex`. No son clientes, casos de éxito ni evidencia de resultados. `agentes.html` conserva el acceso anterior y dirige a la nueva portada. Player Network sigue en `players.html`, fuera de la navegación y del sitemap, con `noindex`.

La demo del técnico tiene una identidad editorial en crema, azul y cobre, retrato, escudos de clubes ficticios, temporadas, palmarés y una pizarra con tres fases de juego. La agencia usa negro y violeta, fotos de jugadores, filtros por posición y fichas en un diálogo accesible. `demo-styles.css` y `demos.js` contienen estos diseños e interacciones. La landing usa capturas reales de las demos en `assets/demos/preview-*.jpg`, con estilos en `preview-styles.css`.

La agencia ahora permite explorar atributos y mapas de calor de tres jugadores. La demo personal usa una identidad deportiva en teal y verde, tarjeta de talento, recorrido y estructura para videos. Los módulos de análisis usan datos simulados; no hay integración con Wyscout, StatsBomb, GPS ni un proveedor. El mapa representa concentración relativa de acciones ficticias; las fases son General, Con pelota y Sin pelota. La ficha usa una escala ilustrativa de 0 a 99, no una valoración real. Para producir un perfil real se acuerdan fuente, período y método; si no hay datos válidos se omite ese módulo.

El técnico suma un microciclo interactivo y un dossier PDF de dos páginas. `football-data.js` contiene únicamente ejemplos; `football-visuals.js` produce SVG accesibles con identificadores separados por instancia; `football-ui.js` maneja los controles. `football-styles.css` define estos módulos y la nueva oferta. La miniatura del jugador es un SVG original de sus componentes, no una captura del navegador.

El formulario distingue el servicio y ajusta los presupuestos posibles. No procesa pagos ni sube videos. Analytics usa `offer_type` con valores cerrados y un evento `service_select`; los datos libres del formulario y los atributos de los jugadores no se envían. Ejecutar `npm test` para comprobar consentimiento, atribución, gráficos, identificadores SVG y preparación de consultas.

## Assets

Hero y fotografía de entrenamiento: generados para este proyecto. Imagen de agente: reutilizada del repositorio y optimizada en WebP. Tipografías Anton e Inter: Fontsource. Iconos: Phosphor Icons. Licencias de tipografías en `assets/fonts/`.

Retratos de las demos: personas ficticias generadas para este proyecto y codificadas en WebP. Escudos: SVG originales de clubes ficticios. No se usan jugadores reales ni marcas de clubes reales como prueba de experiencia.
