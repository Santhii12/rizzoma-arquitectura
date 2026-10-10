import { withBase } from '@/utils/paths';

export type ProjectSection = {
  title: string;
  text: string;
};

export type Project = {
  slug: string;
  title: string;
  category: string;
  year?: string;
  location?: string;
  region?: string;
  cover?: string;
  gallery?: string[];
  statement?: string;
  intro?: string;
  sections?: ProjectSection[];
  available: boolean;
  featured?: boolean;
  instagramUrl?: string;
};

const patioCover =
  'https://framerusercontent.com/images/cabZ2D5YdDKd1m0vI8cRQ0o4o8o.png?height=1054&width=1493';

export const projects: Project[] = [
  {
    slug: 'casa-patio-horizonte',
    title: 'Casa Patio Horizonte',
    category: 'Diseño arquitectónico',
    year: '2025',
    location: 'San Vicente de Ferrer',
    region: 'Antioquia',
    cover: patioCover,
    gallery: [
      patioCover,
      'https://framerusercontent.com/images/F1pDPT8fmpPgztERE8eGCxkVa4.jpeg?height=1536&width=1024',
      'https://framerusercontent.com/images/RbabW7Bbkb61cFQmJ04EeYJSC5c.jpeg?height=1536&width=1024',
      'https://framerusercontent.com/images/H7cyWBHTHcgbfOHOWWI6PpFTR4.png?height=989&width=1320',
      'https://framerusercontent.com/images/w5e50WABdiaAIByqnBCJeg9eYjw.png?height=1360&width=2048'
    ],
    statement: 'Habitar entre el interior y el paisaje.',
    intro:
      'Una vivienda concebida para diluir los límites entre habitar y contemplar. La arquitectura se abre al territorio y convierte las vistas en parte esencial de la experiencia cotidiana.',
    sections: [
      {
        title: 'Integración con el paisaje',
        text: 'Las visuales y las condiciones naturales del lugar orientan la organización de los espacios. Las aperturas estratégicas incorporan luz, vegetación y paisaje al interior.'
      },
      {
        title: 'Continuidad espacial',
        text: 'Patios, terrazas y aperturas construyen una transición gradual entre interior y exterior. Los espacios se conectan y se extienden hacia el paisaje.'
      },
      {
        title: 'Materialidad honesta',
        text: 'Los volúmenes horizontales y los materiales expresivos construyen una arquitectura sobria y atemporal. La materialidad conserva su carácter y refuerza la relación de la vivienda con el lugar.'
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
    category: 'Visualización comercial',
    year: '2026',
    cover: withBase('/images/projects/cabo-san-miguel.webp'),
    available: false
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
