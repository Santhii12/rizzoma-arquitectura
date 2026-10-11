# Rizzoma — guía para añadir proyectos al portafolio

Las fichas publicadas usan **una sola plantilla**: `src/components/ProjectEditorial.astro`.
La ruta es `src/pages/proyectos/[slug].astro` y los estilos están en
`src/styles/project-editorial.css`. No crees una nueva página ni un nuevo
componente por cada proyecto.

## 1. Preparar imágenes reales

Guarda las fotografías/renders optimizados en `public/images/projects/<slug>/`.
Para rutas locales usa `withBase('/images/projects/<slug>/<archivo>.webp')`.
Cada archivo debe tener texto alternativo fiel. No presentes renders como obras
construidas ni modelos como fases de proceso sin confirmación.

## 2. Añadir datos

En `src/data/projects.ts`, agrega una entrada al arreglo `projects`.
`cover` y `available: true` publican la portada y el enlace desde Portafolio;
solo asigna `true` cuando el proyecto esté listo.

Ejemplo de estructura (sustituye todos los valores por datos verificados):

```ts
{
  slug: 'nombre-del-proyecto',
  title: 'Nombre del proyecto',
  category: 'Diseño arquitectónico', // disciplina real de Rizzoma
  statement: 'Idea breve y específica.',
  intro: 'Descripción fiel y breve de este proyecto.',
  typology: 'Vivienda',
  participation: 'Diseño arquitectónico',
  location: 'Municipio',
  region: 'Antioquia',
  year: '2026',
  cover: withBase('/images/projects/nombre-del-proyecto/portada.webp'),
  coverAlt: 'Descripción real de la imagen principal',
  tour: [
    {
      title: 'Recorrido exterior',
      description: 'Qué muestran estas vistas.',
      images: [
        {
          src: withBase('/images/projects/nombre-del-proyecto/vista-01.webp'),
          alt: 'Descripción real de esta perspectiva',
          caption: 'Vista del conjunto'
        }
      ]
    }
  ],
  sections: [
    {
      title: 'Decisión o capacidad demostrable',
      text: 'Qué permite comprender esta decisión o representación.',
      // image: { src: withBase('...'), alt: '...', caption: '...' }
    }
  ],
  // archive: [{ title: 'Modelos', description: '...', images: [{ src, alt, caption }] }],
  available: true
}
```

No inventes `typology`, `participation`, `year`, `location` ni detalles
arquitectónicos. Omite los campos que no estén confirmados.

## 3. Reglas del sistema

- **Apertura**: título, statement, categoría, metadatos presentes e imagen principal.
- **El proyecto**: `intro` y ficha con solo campos disponibles.
- **Recorrido visual**: `tour` admite grupos y cualquier número de imágenes.
- **La mirada de Rizzoma**: `sections` con títulos, textos e imagen opcional.
- **Archivo complementario**: `archive` con modelos, esquemas o imágenes adicionales.
  Si no existe o está vacío, la sección no se renderiza.
- **Cierre**: contacto, volver al portafolio y proyecto siguiente, si lo hay.
- Las imágenes usadas en `cover`, `tour`, `sections.image` y `archive`
  no deben repetirse solo para rellenar galerías.
- La numeración y el siguiente proyecto dependen exclusivamente de
  `availableProjects` (proyectos con `available: true`).
- La propiedad `gallery` se mantiene por compatibilidad con las secciones ya
  existentes del sitio, pero la plantilla nueva usa `tour`, `sections` y
  `archive`.

## 4. Validación

Ejecuta `npm run build` y `npm run check`, visita la nueva URL
`/proyectos/<slug>/` y comprueba que abre desde Portafolio, que las imágenes
cargan en escritorio y móvil, y que el visor se puede cerrar con Escape y
recorrer con las flechas del teclado.
