# Agent Authority

Sitio estático para presentar servicios digitales a profesionales del fútbol.

## Desarrollo

```sh
npm ci
npm run dev -- --host 0.0.0.0 --port 4173 --strictPort
npm run build
```

Los HTML, `styles.css`, `main.js` y `assets/` también funcionan sin compilación, desde la raíz del repositorio en GitHub Pages. Las tipografías y los iconos se sirven localmente. No cambiar la configuración de Pages ni fusionar esta rama antes de la revisión visual.

## Contacto

El formulario valida los campos, prepara una consulta y ofrece un enlace a WhatsApp `5492226638043`. El visitante revisa y envía el mensaje en WhatsApp. La web no almacena consultas y nunca informa que un mensaje fue enviado. No se incorporó medición de conversiones porque no hay un identificador de analítica confirmado.

## Demos

`demo-coach.html` y `demo-agency.html` usan identidades ficticias, avisos visibles y `noindex`. No son clientes, casos de éxito ni evidencia de resultados. `agentes.html` conserva el acceso anterior y dirige a la nueva portada. Player Network sigue en `players.html`, fuera de la navegación y del sitemap, con `noindex`.

## Assets

Hero y fotografía de entrenamiento: generados para este proyecto. Imagen de agente: reutilizada del repositorio y optimizada en WebP. Tipografías Anton e Inter: Fontsource. Iconos: Phosphor Icons. Licencias de tipografías en `assets/fonts/`.
