# Mantenimiento y publicación — Rizzoma Arquitectura

Rizzoma es una web estática en Astro. El código, las imágenes, las galerías y los contenidos están en GitHub. **No requiere ninguna suscripción a herramientas de IA** para funcionar, editarse o publicarse.

## Respaldo y protección

La versión anterior a la actualización comercial se preservó en la rama `backup/rizzoma-antes-estrategia-20261026`.

Los cinco proyectos permanecen en `src/data/projects.ts`: `cabo-san-miguel`, `casa-patio-horizonte`, `casa-el-umbral`, `casa-el-santuario` y `casa-oquedad`.

Los renders, fotografías y planos originales están en `public/images/projects/`; logos en `public/brand/` y estilos en `src/styles/`. No cambies los slugs si quieres mantener los enlaces públicos de cada proyecto. El portafolio y las fichas toman datos del mismo catálogo.

## Dónde editar

| Tarea | Archivo |
| --- | --- |
| Correo, WhatsApp, Instagram | `src/config/site.ts` |
| Mensajes y enlaces principales | `src/pages/index.astro` |
| Tres líneas resumidas en Inicio | `src/components/QuePodemosHacer.astro` |
| Servicios, alcances y casos relacionados | `src/pages/servicios.astro` |
| Datos y galerías de proyectos | `src/data/projects.ts` |
| Tarjetas del portafolio en Inicio | `src/components/HomeSelectedProjects.astro` |
| Presentación del fundador | `src/pages/estudio.astro` |
| Campos del contacto | `src/pages/contacto.astro` |
| Validación y enlace a WhatsApp | `src/scripts/site.ts` |
| Estética y diseño móvil | `src/styles/` |

Datos de contacto guardados en código: `rizzomaarquitectura@gmail.com` y WhatsApp `+57 315 741 4871`.

## Descargar el proyecto

1. Abre https://github.com/Santhii12/rizzoma-arquitectura.
2. En la rama `main`, elige **Code → Download ZIP**.
3. Descomprime el ZIP y guarda otra copia fuera de GitHub.

Con Git instalado, también puedes clonar:

```powershell
git clone https://github.com/Santhii12/rizzoma-arquitectura.git
cd rizzoma-arquitectura
```

## Trabajar en Windows

Necesitas Node.js 22, npm y un editor de código. Desde la carpeta del proyecto:

```powershell
npm install
npm run dev
```

Para verificar antes de publicar:

```powershell
npm run check
$env:GITHUB_PAGES = "true"
npm run build
npm run verify
Remove-Item Env:GITHUB_PAGES
```

`npm run verify` comprueba el catálogo de cinco proyectos, sus páginas, recursos originales referenciados, servicios, anclas antiguas y datos de contacto.

## Publicar otra vez

**GitHub Pages:** el sitio de prueba utiliza el prefijo `/rizzoma-arquitectura/`. Usa `GITHUB_PAGES=true` al compilar manualmente. Comprueba en **Settings → Pages** que el repositorio tiene habilitado el despliegue desde GitHub Actions. Abre una Pull Request, revisa las pruebas y fusiona a `main` para activar el flujo si está configurado.

```powershell
git checkout -b actualizacion-rizzoma
git add .
git commit -m "Actualizar Rizzoma"
git push -u origin actualizacion-rizzoma
```

**Cloudflare Pages, como alternativa:** conecta el repositorio de GitHub, usa Node 22, comando `npm run build` y directorio de salida `dist`. No configures `GITHUB_PAGES=true` si sirves el sitio desde la raíz del dominio propio. Configura DNS y dominio con los valores que indique Cloudflare. Publicar en un proveedor no actualiza automáticamente el otro.

## Notas comerciales y técnicas

- El formulario valida los campos y abre WhatsApp con un mensaje preparado. No guarda solicitudes en un servidor ni envía nada hasta que la persona decida hacerlo.
- Servicios actuales: desarrollo arquitectónico; modelado y documentación según alcance; visualización arquitectónica.
- Las colaboraciones se ofrecen como **apoyo externo del arquitecto responsable**, con responsabilidades y entregables acordados.
- Las anclas históricas `/servicios/#remodelacion` y `/servicios/#diseno-visualizacion` continúan como compatibilidad. Si las usas en campañas antiguas, revisa el nuevo contexto.
- No atribuyas a la práctica licencias, ingeniería, dirección de obra, un equipo multidisciplinario ni documentación técnica integral sin respaldo.

## Lista previa al lanzamiento

1. Abrir Inicio, Portafolio, Servicios, Estudio, Contacto y las cinco fichas.
2. Revisar imágenes, galerías, enlaces de proyectos y CTA.
3. Probar móviles reales y computador, en especial Safari iPhone.
4. Probar correo y WhatsApp sin enviar consultas a terceros por accidente.
5. Ejecutar `npm run check`, `npm run build` y `npm run verify`.
6. Comparar con el respaldo antes de cambiar el catálogo, las imágenes originales o las marcas.

Última revisión de la guía: 26 de octubre de 2026.
