# Informe de auditoría técnica · Rizzoma Arquitectura
**Fecha:** 26 de octubre de 2026  
**Sitio público revisado:** https://santhii12.github.io/rizzoma-arquitectura/  
**Repositorio:** https://github.com/Santhii12/rizzoma-arquitectura

## Hallazgos y correcciones

| Elemento | Estado observado | Medida |
| --- | --- | --- |
| Página 404 | Existía, solo enlazaba al Inicio | Añadido enlace a Portafolio y texto de orientación |
| Robots y sitemap | Endpoints `src/pages/robots.txt.ts` y `src/pages/sitemap.xml.ts` configurados | Conservarlos; prueba automática de indexación y URL |
| Canonical / datos sociales | Ya configurados en ambos layouts; favicon SVG y manifest presentes | Evitar cambios innecesarios; nueva prueba de metadatos críticos |
| Privacidad | Aviso breve, sin política integral identificando al responsable | Aviso público transparente + borrador de política no vigente |
| Footer | Derechos de autor estáticos; no había enlace a privacidad | Enlace discreto y año automático |
| Formulario | Genera un mensaje en el navegador y abre WhatsApp; no lo envía automáticamente | Mantener comportamiento y aviso con explicación fiel |
| Analítica/marketing | No se detectaron scripts propios activos de analítica, publicidad ni iframes en los archivos inspeccionados | No instalar banner de cookies sin inventariar tecnologías reales |
| Rendimiento | Imágenes mayormente WebP; animaciones y WebGL de portada limitadas por soporte y preferencias de movimiento | Conservar renders; Lighthouse y pruebas en red móvil aún pendientes |
| Accesibilidad | Enlace para saltar al contenido; textos alternativos y controles con foco en componentes revisados | Auditoría HTML automatizada + revisión de teclado real pendiente |
| Respaldo | Ramas históricas verificadas con cinco proyectos | Descargar ZIP/clonar y conservar además fuera de GitHub |

## Pruebas reproducibles

Desde Windows con Node.js 22:

```powershell
npm install
npm run check
$env:GITHUB_PAGES = "true"
npm run build
npm run verify
npm run audit:technical
Remove-Item Env:GITHUB_PAGES
```

Las pruebas comprueban 12 rutas indexables, 404, aviso provisional, sitemap, robots, metadatos de redes, títulos, canonicals, imagenes con alt, enlaces locales, las cinco fichas y los accesos de contacto. No sustituyen un navegador real, un escáner WCAG, un Lighthouse completo ni asesoría jurídica.

## Inventario de datos y servicios

- Formulario: `src/pages/contacto.astro` y `src/scripts/site.ts`.
- Datos que puede introducir el visitante: nombre, correo opcional, teléfono opcional, tipo de encargo, servicio, ubicación opcional y mensaje.
- El enlace final abre WhatsApp con el mensaje. Debe enviarlo el visitante.
- Contacto directo por correo (`mailto:`) y enlaces a WhatsApp e Instagram.
- `sessionStorage` almacena marcas de tiempo de intentos recientes. No contiene los campos del formulario.
- WebGl y tipografías locales no implican por sí mismos cookies analíticas.
- El CSS de la web permite imágenes de una fuente externa (`framerusercontent.com`); si se muestran, comprobar políticas del proveedor.
- No se detectó en los archivos revisados Google Analytics, píxeles publicitarios, mapas, videos embebidos ni un CMP activo. Esto no certifica que el alojamiento o herramientas incorporadas fuera del repositorio no procesen información.

## Privacidad pendiente

El borrador en `docs/BORRADOR-POLITICA-DATOS-NO-PUBLICAR.md` requiere:
1. Identidad legal, domicilio, dirección física/medio de notificación y contacto confirmado del responsable.
2. Plazos y motivos de conservación, acceso, borrado de mensajes y documentos; confirmación de herramientas de correo/WhatsApp.
3. Método de atención a consultas y reclamos, responsable operativo y registro de autorizaciones.
4. Proveedores y posibles transmisiones internacionales verificadas.
5. Revisión jurídica y aprobación antes de sustituir el aviso por una política integral.

Mientras tanto, `/privacidad/` funciona como información pública provisional y permanece `noindex`. **No afirmar cumplimiento legal completo**.

## Recuperación independiente de IA

- Código: rama `main` de https://github.com/Santhii12/rizzoma-arquitectura.
- Dos respaldos de estado anterior comprobados: `backup/rizzoma-antes-estrategia-20261026` y `backup/rizzoma-antes-ajuste-contacto-20261026`.
- Descargar: **Code → Download ZIP** o `git clone https://github.com/Santhii12/rizzoma-arquitectura.git`.
- Imágenes originales: `public/images/projects/`; marcas: `public/brand/`; contenidos: `src/data/projects.ts`.
- Publicación: `.github/workflows/deploy-pages.yml`, flujo GitHub Actions tras integrar cambios a `main` con `GITHUB_PAGES=true`.
- Si se usa Cloudflare Pages con dominio propio, revisar el ajuste `astro.config.mjs` y las URL canónicas; no asumir que ambos sitios se actualizan simultáneamente.
- Guardar una copia ZIP también en una ubicación de almacenamiento independiente de GitHub.

## Verificación manual pendiente

- Safari iPhone/Android: comprobar tamaño de las imágenes, navegación, enfoque y menú.
- Teclado: tabulación a enlaces, `details`, modales, carruseles; Escape y retorno al disparador.
- Lighthouse móvil y escritorio con red controlada, LCP/CLS/INP y peso real de cada imagen.
- Validar vistas previas de WhatsApp, Facebook y otras plataformas.
- Confirmar la situación efectiva de `rizzomaarquitectura.com` y si recibe tráfico público.
- Revisar dirección y rol jurídico de la persona responsable antes de publicar la política integral.
