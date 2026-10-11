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
  display?: 'gallery' | 'grid';
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
  galleryLabel?: string;
  tour?: ProjectImageGroup[];
  archive?: ProjectImageGroup[];
  statement?: string;
  intro?: string;
  closingText?: string;
  sections?: ProjectSection[];
  available: boolean;
  featured?: boolean;
  instagramUrl?: string;
};

const patioImage = (folder: 'exteriores' | 'interiores' | 'archivo', filename: string) =>
  withBase(`/images/projects/casa-patio-horizonte/${folder}/${filename}.webp`);

const patioGallery = [
  patioImage('exteriores', 'exterior-01'),
  patioImage('exteriores', 'exterior-02'),
  patioImage('exteriores', 'exterior-05'),
  patioImage('exteriores', 'exterior-06'),
  patioImage('exteriores', 'exterior-07')
];
const patioCover = patioGallery[0];

const caboImage = (name: string) => withBase(`/images/projects/cabo-san-miguel/${name}.webp`);
const umbralImage = (category: 'principal' | 'ambientes' | 'mirada', filename: string) =>
  withBase(`/images/projects/casa-el-umbral/${category}/${filename}.webp`);

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
    coverAlt: 'Vista exterior de Casa Patio Horizonte, una vivienda de volúmenes horizontales integrada al paisaje',
    gallery: patioGallery,
    galleryLabel: 'Exteriores y arquitectura',
    statement: 'Habitar entre el interior y el paisaje.',
    closingText: 'Si tienes un lugar por habitar o una idea de vivienda por desarrollar, conversemos sobre sus necesidades, el paisaje y las posibilidades del proyecto.',
    intro: 'Una vivienda concebida para diluir los límites entre habitar y contemplar. La arquitectura se abre al territorio y convierte las vistas en parte esencial de la experiencia cotidiana.',
    tour: [
      {
        title: 'Espacios interiores',
        description: 'Imágenes de los ambientes de la vivienda: la sala, la cocina-comedor y el dormitorio, donde la luz y los materiales contribuyen a su atmósfera.',
        display: 'gallery',
        images: [
          {
            src: patioImage('interiores', 'interior-01'),
            alt: 'Sala de Casa Patio Horizonte con chimenea, madera, ventanales y luz cálida',
            caption: 'Sala / Estar'
          },
          {
            src: patioImage('interiores', 'interior-02'),
            alt: 'Comedor y cocina de Casa Patio Horizonte con revestimientos de madera y apertura al paisaje',
            caption: 'Cocina y comedor'
          },
          {
            src: patioImage('interiores', 'interior-03'),
            alt: 'Dormitorio de Casa Patio Horizonte con textiles naturales, madera y luz lateral',
            caption: 'Dormitorio'
          }
        ]
      }
    ],
    sections: [
      {
        title: 'Integración con el paisaje',
        text: 'Las visuales y las condiciones naturales del lugar orientan la organización de los espacios. Las aperturas estratégicas incorporan luz, vegetación y paisaje al interior.',
        image: {
          src: patioImage('exteriores', 'exterior-03'),
          alt: 'Vista cercana de la fachada de Casa Patio Horizonte con materiales naturales y vegetación',
          caption: 'La vivienda y su paisaje'
        }
      },
      {
        title: 'Continuidad espacial',
        text: 'Patios, terrazas y aperturas construyen una transición gradual entre interior y exterior. Los espacios se conectan y se extienden hacia el paisaje.',
        image: {
          src: patioImage('exteriores', 'exterior-07'),
          alt: 'Vista de Casa Patio Horizonte desde el jardín, con terraza, piscina y ventanales que conectan la vivienda con el exterior',
          caption: 'Terraza / Interior y exterior'
        }
      },
      {
        title: 'Materialidad honesta',
        text: 'Los volúmenes horizontales y los materiales expresivos construyen una arquitectura sobria y atemporal. La materialidad conserva su carácter y refuerza la relación de la vivienda con el lugar.',
        image: {
          src: patioImage('exteriores', 'exterior-04'),
          alt: 'Detalle de Casa Patio Horizonte con aleros de madera, transparencias y luz del atardecer',
          caption: 'Materia y atmósfera'
        }
      }
    ],
    archive: [
      {
        title: 'Planos y exploraciones',
        description: 'Una planta arquitectónica, un esquema de organización de espacios y estudios volumétricos del proyecto.',
        images: [
          {
            src: patioImage('archivo', 'planta-arquitectonica'),
            alt: 'Planta arquitectónica de Casa Patio Horizonte con la distribución de espacios y los contornos del terreno',
            caption: 'Planta arquitectónica'
          },
          {
            src: patioImage('archivo', 'esquema-funcional'),
            alt: 'Esquema tridimensional que identifica áreas funcionales de Casa Patio Horizonte',
            caption: 'Organización espacial'
          },
          {
            src: patioImage('archivo', 'modelo-volumetrico'),
            alt: 'Lámina con seis esquemas volumétricos de Casa Patio Horizonte',
            caption: 'Estudio volumétrico'
          }
        ]
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
    gallery: [
      caboImage('exteriores-04'),
      caboImage('exteriores-01'),
      caboImage('exteriores-02'),
      caboImage('exteriores-05'),
      caboImage('exteriores-06'),
      caboImage('exteriores-07'),
      caboImage('exteriores-08')
    ],
    galleryLabel: 'Exteriores y fachada',
    statement: 'Un edificio de vivienda en relación con el paisaje de Guatapé.',
    closingText: 'Si buscas desarrollar la fachada de un proyecto o comunicar su propuesta mediante visualizaciones arquitectónicas, conversemos sobre el alcance y el material disponible.',
    intro: 'Cabo San Miguel es un edificio de vivienda en Guatapé, Antioquia. El trabajo de Rizzoma comprende el diseño de fachada y la visualización comercial; no el diseño integral del edificio.',
    tour: [
      {
        title: 'Espacios interiores',
        description: 'Recorre los ambientes residenciales a través de sus visualizaciones comerciales: espacios sociales, habitaciones y detalles de materialidad.',
        display: 'gallery',
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
    typology: 'Vivienda',
    cover: umbralImage('principal', 'sala-integrada'),
    coverAlt: 'Sala de Casa El Umbral, con sofá claro, cocina al fondo, escalera de madera y luz natural',
    galleryLabel: 'Interiores / Espacios de la vivienda',
    gallery: [
      umbralImage('principal', 'sala-integrada'),
      umbralImage('principal', 'cocina-comedor'),
      umbralImage('principal', 'dormitorio-principal'),
      umbralImage('principal', 'espacio-de-trabajo'),
      umbralImage('principal', 'bano')
    ],
    statement: 'Interiores en los que la luz y los materiales construyen atmósferas distintas.',
    intro: 'Casa El Umbral reúne visualizaciones de espacios interiores residenciales: sala, cocina, dormitorios, lugares de trabajo y bienestar. Las imágenes permiten observar las relaciones entre el mobiliario, la entrada de luz natural y las texturas de cada ambiente.',
    closingText: 'Si tienes un espacio interior que necesitas desarrollar o visualizar, podemos conversar sobre sus usos, referencias y el alcance del trabajo.',
    tour: [
      {
        title: 'Ambientes para habitar',
        description: 'Otras perspectivas de la sala y de los dormitorios, con distintas condiciones de iluminación y materialidad.',
        display: 'gallery',
        images: [
          {
            src: umbralImage('ambientes', 'sala-con-vistas'),
            alt: 'Sala luminosa con sofá claro, muebles bajos y ventanal hacia el paisaje',
            caption: 'Sala / Vistas al exterior'
          },
          {
            src: umbralImage('ambientes', 'dormitorio-calido'),
            alt: 'Dormitorio con paneles de madera, cuadros y cabecero en tonos cálidos',
            caption: 'Dormitorio / Texturas'
          },
          {
            src: umbralImage('ambientes', 'dormitorio-soleado'),
            alt: 'Dormitorio con piso de madera, cama central y luz natural proyectada sobre una pared',
            caption: 'Dormitorio / Luz natural'
          },
          {
            src: umbralImage('ambientes', 'dormitorio-natural'),
            alt: 'Dormitorio con ventanal, tonos neutros, cuadros y vegetación interior',
            caption: 'Dormitorio / Paisaje'
          }
        ]
      }
    ],
    sections: [
      {
        title: 'Luz y atmósfera',
        text: 'Las entradas de luz natural permiten apreciar los acabados y las proporciones de los espacios. En el ambiente de trabajo, la luz lateral cambia la lectura de los muebles y las superficies.',
        image: {
          src: umbralImage('mirada', 'oficina-luminosa'),
          alt: 'Oficina con dos puestos de trabajo junto a un ventanal y luz cálida sobre las superficies',
          caption: 'Luz natural / Área de trabajo'
        }
      },
      {
        title: 'Materiales y detalles',
        text: 'Los revestimientos, la madera y los mosaicos verdes aportan contraste y textura. La visualización de este baño permite examinar esas relaciones a escala del interior.',
        image: {
          src: umbralImage('mirada', 'bano-mosaicos'),
          alt: 'Baño con mosaicos verdes, espejo circular, mueble de madera y luz cálida',
          caption: 'Baño / Materialidad'
        }
      },
      {
        title: 'Distintas maneras de usar el espacio',
        text: 'El archivo también presenta un espacio destinado al ejercicio. Su representación permite observar cómo el equipamiento y la luz se integran a un ambiente residencial.',
        image: {
          src: umbralImage('mirada', 'gimnasio'),
          alt: 'Gimnasio residencial con caminadora, pesas, madera y entrada de luz natural',
          caption: 'Espacio de ejercicio'
        }
      }
    ],
    available: true
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
