import { withBase } from '@/utils/paths';

export type ProjectImage = {
  src: string;
  alt: string;
  caption?: string;
};

export type ProjectSection = {
  title: string;
  text: string;
  image?: ProjectImage;
};

export type ProjectImageGroup = {
  title: string;
  description?: string;
  images: ProjectImage[];
};

export type Project = {
  slug: string;
  title: string;
  category: string;
  year?: string;
  location?: string;
  region?: string;
  typology?: string;
  participation?: string;
  cover?: string;
  coverAlt?: string;
  gallery?: string[];
  tour?: ProjectImageGroup[];
  archive?: ProjectImageGroup[];
  statement?: string;
  intro?: string;
  sections?: ProjectSection[];
  available: boolean;
  featured?: boolean;
  instagramUrl?: string;
};

const patioCover =
  'https://framerusercontent.com/images/cabZ2D5YdDKd1m0vI8cRQ0o4o8o.png?height=1054&width=1493';

const patioGallery = [
  patioCover,
  'https://framerusercontent.com/images/F1pDPT8fmpPgztERE8eGCxkVa4.jpeg?height=1536&width=1024',
  'https://framerusercontent.com/images/RbabW7Bbkb61cFQmJ04EeYJSC5c.jpeg?height=1536&width=1024',
  'https://framerusercontent.com/images/H7cyWBHTHcgbfOHOWWI6PpFTR4.png?height=989&width=1320',
  'https://framerusercontent.com/images/w5e50WABdiaAIByqnBCJeg9eYjw.png?height=1360&width=2048'
];

const caboImage = (name: string) => withBase(`/images/projects/cabo-san-miguel/${name}.webp`);

export const projects: Project[] = [
  {
    slug: 'casa-patio-horizonte',
    title: 'Casa Patio Horizonte',
    category: 'Diseño arquitectónico',
    year: '2025',
    location: 'San Vicente de Ferrer',
    region: 'Antioquia',
    typology: 'Vivienda',
    participation: 'Diseño arquitectónico',
    cover: patioCover,
    coverAlt: 'Vista principal de Casa Patio Horizonte, vivienda integrada al entorno natural',
    gallery: patioGallery,
    tour: [
      {
        title: 'Vistas del proyecto',
        description: 'Perspectivas seleccionadas de la vivienda, su arquitectura y su relación con los espacios exteriores.',
        images: [
          { src: patioGallery[1], alt: 'Perspectiva vertical de Casa Patio Horizonte y su arquitectura', caption: 'Lectura del conjunto' },
          { src: patioGallery[3], alt: 'Otra perspectiva arquitectónica de Casa Patio Horizonte', caption: 'Vistas y espacios' }
        ]
      }
    ],
    statement: 'Habitar entre el interior y el paisaje.',
    intro:
      'Una vivienda concebida para diluir los límites entre habitar y contemplar. La arquitectura se abre al territorio y convierte las vistas en parte esencial de la experiencia cotidiana.',
    sections: [
      {
        title: 'Integración con el paisaje',
        text: 'Las visuales y las condiciones naturales del lugar orientan la organización de los espacios. Las aperturas estratégicas incorporan luz, vegetación y paisaje al interior.',
        image: { src: patioGallery[2], alt: 'Casa Patio Horizonte vista desde otra perspectiva, en relación con el paisaje', caption: 'Paisaje y arquitectura' }
      },
      {
        title: 'Continuidad espacial',
        text: 'Patios, terrazas y aperturas construyen una transición gradual entre interior y exterior. Los espacios se conectan y se extienden hacia el paisaje.'
      },
      {
        title: 'Materialidad honesta',
        text: 'Los volúmenes horizontales y los materiales expresivos construyen una arquitectura sobria y atemporal. La materialidad conserva su carácter y refuerza la relación de la vivienda con el lugar.',
        image: { src: patioGallery[4], alt: 'Espacios y materiales de Casa Patio Horizonte', caption: 'Espacio y materialidad' }
      }
    ],
    available: true,
    featured: true,
    instagramUrl: 'https://www.instagram.com/rizzoma_arquitectura'
  },
  {
    slug: 'casa-el-santuario',
    title: 'Casa El Santuario',
    category: 'Diseño arquitectónico',
    available: false
  },
  {
    slug: 'cabo-san-miguel',
    title: 'Cabo San Miguel',
    category: 'Visualización comercial · Diseño de fachada',
    year: '2026',
    location: 'Guatapé',
    region: 'Antioquia',
    typology: 'Edificio de vivienda',
    participation: 'Visualización comercial y diseño de fachada',
    cover: caboImage('exteriores-04'),
    coverAlt: 'Cabo San Miguel, edificio de vivienda en Guatapé presentado al atardecer frente al embalse',
    gallery: [caboImage('exteriores-04')],
    statement: 'Un edificio de vivienda en relación con el paisaje de Guatapé.',
    intro: 'Cabo San Miguel es un edificio de vivienda en Guatapé, Antioquia. El trabajo de Rizzoma comprende el diseño de fachada y la visualización comercial; no el diseño integral del edificio.',
    tour: [
      {
        title: 'Exterior y paisaje',
        description: 'Perspectivas del conjunto junto al agua, sus terrazas y el acercamiento desde el entorno.',
        images: [
          { src: caboImage('exteriores-01'), alt: 'Vista panorámica de Cabo San Miguel junto al embalse de Guatapé', caption: 'Panorama junto al embalse' },
          { src: caboImage('exteriores-02'), alt: 'Acceso escalonado desde el borde del agua al conjunto', caption: 'Llegada desde el agua' },
          { src: caboImage('exteriores-05'), alt: 'Terrazas y áreas exteriores del edificio Cabo San Miguel', caption: 'Terrazas exteriores' },
          { src: caboImage('exteriores-06'), alt: 'Vista aérea del conjunto junto al embalse y el paisaje de Guatapé', caption: 'Relación con el entorno' },
          { src: caboImage('exteriores-07'), alt: 'Vista lateral de los niveles, arcos y balcones del conjunto', caption: 'Fachada y proporciones' },
          { src: caboImage('exteriores-08'), alt: 'Recorrido peatonal bajo arcos de la edificación con vegetación', caption: 'Acceso peatonal' }
        ]
      },
      {
        title: 'Espacios interiores',
        description: 'Vistas comerciales de los ambientes residenciales y sus relaciones espaciales.',
        images: [
          { src: caboImage('exteriores-10'), alt: 'Escalera, sala de estar y mobiliario del espacio interior', caption: 'Escalera y zona social' },
          { src: caboImage('interiores-02'), alt: 'Espacio social con cocina integrada e iluminación natural', caption: 'Sala y cocina' },
          { src: caboImage('interiores-03'), alt: 'Sala residencial con sofá, mesa de centro y cocina de fondo', caption: 'Área de estar' },
          { src: caboImage('interiores-04'), alt: 'Dormitorio del proyecto abierto hacia el paisaje exterior', caption: 'Dormitorio con vistas' },
          { src: caboImage('interiores-05'), alt: 'Habitación con cabecero verde y acceso a un balcón', caption: 'Habitación y terraza' },
          { src: caboImage('interiores-06'), alt: 'Baño de vivienda con acabados cerámicos y de madera', caption: 'Baño y materialidad' }
        ]
      }
    ],
    sections: [
      {
        title: 'Expresión de fachada',
        text: 'Las vistas del exterior hacen legibles los arcos, los balcones y el contraste entre superficies y vegetación. El diseño de fachada es parte del trabajo realizado por Rizzoma.',
        image: { src: caboImage('exteriores-03'), alt: 'Vista detallada de la fachada, sus arcos, balcones y vegetación', caption: 'Composición de fachada' }
      },
      {
        title: 'Comunicar los interiores',
        text: 'La visualización comercial permite comprender la relación entre zona social, cocina y luz natural. Estas imágenes comunican el proyecto sin atribuir a Rizzoma el diseño integral de los espacios.',
        image: { src: caboImage('interiores-01'), alt: 'Interior del edificio con cocina y sala abiertas, materiales cálidos y luz natural', caption: 'Visualización de espacios interiores' }
      },
      {
        title: 'Acceso y aproximación',
        text: 'Una perspectiva desde la vía completa el recorrido exterior y permite observar cómo aparece el edificio al llegar desde el entorno.',
        image: { src: caboImage('exteriores-09'), alt: 'Acceso desde la vía hacia la fachada principal del edificio', caption: 'Vista desde el acceso' }
      }
    ],
    archive: [
      {
        title: 'Modelos y volumetría',
        description: 'Tres vistas de modelo que documentan el volumen y el emplazamiento. No se les asigna una etapa de diseño sin confirmación.',
        images: [
          { src: caboImage('modelo-01'), alt: 'Modelo tridimensional general de Cabo San Miguel y su terreno', caption: 'Modelo · Vista general' },
          { src: caboImage('modelo-02'), alt: 'Segunda perspectiva del modelo tridimensional de Cabo San Miguel', caption: 'Modelo · Vista alternativa' },
          { src: caboImage('modelo-03'), alt: 'Acercamiento al modelo volumétrico del edificio', caption: 'Modelo · Volumetría' }
        ]
      }
    ],
    available: true
  },
  {
    slug: 'casa-el-umbral',
    title: 'Casa El Umbral',
    category: 'Interiorismo',
    year: '2025',
    available: false
  },
  {
    slug: 'oasis-del-bosque',
    title: 'Oasis del Bosque',
    category: 'Diseño arquitectónico',
    year: '2025',
    location: 'San Vicente de Ferrer',
    region: 'Antioquia',
    available: false
  },
  {
    slug: 'sune-villa',
    title: 'Sune Villa',
    category: 'Exploración arquitectónica',
    available: false
  }
];

export const availableProjects = projects.filter((project) => project.available);
export const featuredProject = projects.find((project) => project.featured) ?? availableProjects[0];
