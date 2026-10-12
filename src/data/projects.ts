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

const santuarioImage = (category: 'exteriores' | 'interiores' | 'mirada' | 'archivo', filename: string) =>
  withBase(`/images/projects/casa-el-santuario/${category}/${filename}.webp`);

const oquedadImage = (category: 'exteriores' | 'interiores' | 'mirada' | 'archivo', filename: string) =>
  withBase(`/images/projects/casa-oquedad/${category}/${filename}.webp`);

const caboImage = (name: string) => withBase(`/images/projects/cabo-san-miguel/${name}.webp`);
const umbralImage = (category: 'principal' | 'ambientes' | 'mirada', filename: string) =>
  withBase(`/images/projects/casa-el-umbral/${category}/${filename}.webp`);

export const projects: Project[] = [
  {
    slug: 'cabo-san-miguel',
    title: 'Cabo San Miguel',
    category: 'Visualización comercial · Diseño de fachada',
    year: '2026',
    location: 'Guatapé',
    region: 'Antioquia',
    typology: 'Edificio de vivienda',
    participation: 'Modelado 3D, diseño de fachada y visualización comercial',
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
    intro: 'Cabo San Miguel es un edificio de vivienda en Guatapé, Antioquia. Rizzoma desarrolló el modelado 3D, el diseño de fachada y la visualización comercial del edificio; el diseño arquitectónico integral no corresponde al estudio.',
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
    slug: 'casa-patio-horizonte',
    title: 'Casa Patio Horizonte',
    category: 'Diseño arquitectónico',
    year: '2025',
    location: 'San Vicente de Ferrer',
    region: 'Antioquia',
    typology: 'Vivienda',
    participation: 'Diseño arquitectónico, modelado 3D, renders y dibujos',
    cover: patioCover,
    coverAlt: 'Vista exterior de Casa Patio Horizonte, una vivienda de volúmenes horizontales integrada al paisaje',
    gallery: patioGallery,
    galleryLabel: 'Exteriores y arquitectura',
    statement: 'Habitar entre el interior y el paisaje.',
    closingText: 'Si tienes un lugar por habitar o una idea de vivienda por desarrollar, conversemos sobre sus necesidades, el paisaje y las posibilidades del proyecto.',
    intro: 'Diseñada y representada por Juan José Quintero Tobón desde Rizzoma, Casa Patio Horizonte explora la continuidad entre habitar y contemplar. Patios, aperturas y terrazas vinculan los espacios de la vivienda con el territorio. El estudio realizó el diseño arquitectónico, el modelado, las visualizaciones y los dibujos del proyecto.',
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
    slug: 'casa-el-umbral',
    title: 'Casa El Umbral',
    category: 'Interiorismo',
    year: '2025',
    typology: 'Vivienda',
    participation: 'Diseño de interiores, modelado 3D, renders y dibujos',
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
    intro: 'Casa El Umbral es un proyecto residencial de diseño interior desarrollado por Juan José Quintero Tobón en Rizzoma. El diseño, modelado, renders y dibujos exploran salas, cocina, dormitorios y espacios de trabajo y bienestar, con especial atención a la luz, el mobiliario y las texturas.',
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
    slug: 'casa-el-santuario',
    title: 'Casa El Santuario',
    category: 'Diseño arquitectónico',
    typology: 'Vivienda',
    participation: 'Diseño arquitectónico, modelado 3D, renders y dibujos',
    cover: santuarioImage('exteriores', 'fachada-panoramica'),
    coverAlt: 'Visualización exterior de Casa El Santuario entre vegetación, con fachadas de ladrillo, vidrio y una cubierta inclinada',
    galleryLabel: 'Exteriores / Arquitectura y entorno',
    gallery: [
      santuarioImage('exteriores', 'fachada-panoramica'),
      santuarioImage('exteriores', 'fachada-entre-vegetacion'),
      santuarioImage('exteriores', 'fachada-en-ladrillo'),
      santuarioImage('exteriores', 'volumen-entre-arboles')
    ],
    statement: 'Una lectura de la vivienda a través de sus espacios, la luz y el paisaje.',
    intro: 'Casa El Santuario es una propuesta de vivienda diseñada y representada por Juan José Quintero Tobón desde Rizzoma. Sus dibujos, modelos y renders documentan la composición de fachadas, la doble altura, las relaciones entre ambientes y el encuentro de la arquitectura con la vegetación.',
    closingText: 'Si tienes una idea de vivienda que quieres desarrollar o representar, podemos conversar sobre el lugar, las necesidades y el alcance del proyecto.',
    tour: [
      {
        title: 'Espacios interiores',
        description: 'Un recorrido por la entrada, las áreas sociales y el dormitorio, donde se aprecian las aperturas, los materiales y la luz natural.',
        display: 'gallery',
        images: [
          {
            src: santuarioImage('interiores', 'vestibulo-cocina'),
            alt: 'Visualización de espacio interior de doble altura con ladrillo, ventanales, escalera y cocina',
            caption: 'Acceso / Cocina y doble altura'
          },
          {
            src: santuarioImage('interiores', 'sala-panoramica'),
            alt: 'Sala de Casa El Santuario con ventanales hacia el bosque, techo de madera y mobiliario claro',
            caption: 'Sala / Vistas al paisaje'
          },
          {
            src: santuarioImage('interiores', 'comedor'),
            alt: 'Comedor cálido integrado con la sala, estructura de madera, vidrio y mobiliario de tonos neutros',
            caption: 'Comedor / Área social'
          },
          {
            src: santuarioImage('interiores', 'dormitorio'),
            alt: 'Dormitorio con cama central, cabecero de madera, arte de pared y ventanal lateral hacia el paisaje',
            caption: 'Dormitorio / Luz y texturas'
          }
        ]
      }
    ],
    sections: [
      {
        title: 'Arquitectura y entorno',
        text: 'Una de las vistas exteriores permite apreciar la escala de la vivienda entre árboles y superficies verdes. La imagen pone en relación el volumen construido, la cubierta y la vegetación inmediata.',
        image: {
          src: santuarioImage('mirada', 'volumen-y-entorno'),
          alt: 'Perspectiva exterior de una vivienda de dos niveles con cubierta inclinada y árboles alrededor',
          caption: 'Volumen / Vegetación'
        }
      },
      {
        title: 'Luz y altura',
        text: 'La perspectiva de la escalera destaca la altura interior, los muros de ladrillo y los vanos acristalados. Estos elementos permiten leer la entrada de luz y la continuidad visual entre niveles.',
        image: {
          src: santuarioImage('mirada', 'escalera-y-luz'),
          alt: 'Escalera interior junto a muro de ladrillo, arco acristalado y ventanales de doble altura',
          caption: 'Escalera / Luz natural'
        }
      },
      {
        title: 'Espacios conectados',
        text: 'En el área social, la doble altura, la escalera y las aperturas conectan visualmente los ambientes. La representación permite apreciar las proporciones y la relación entre mobiliario y arquitectura.',
        image: {
          src: santuarioImage('mirada', 'sala-doble-altura'),
          alt: 'Sala residencial de doble altura con escalera interior, sofá claro, ventanas y detalles de ladrillo',
          caption: 'Sala / Continuidad espacial'
        }
      }
    ],
    archive: [
      {
        title: 'Planos y exploraciones',
        description: 'Láminas del proyecto que muestran la planta, la volumetría y su relación con el terreno. Se presentan como documentación visual, sin asignarles etapas de diseño no confirmadas.',
        images: [
          {
            src: santuarioImage('archivo', 'modelo-general'),
            alt: 'Modelo tridimensional blanco de la vivienda sobre su terreno, con la cubierta y los accesos',
            caption: 'Modelo / Vista general'
          },
          {
            src: santuarioImage('archivo', 'planta'),
            alt: 'Planta arquitectónica en blanco y gris que muestra la distribución espacial de la vivienda',
            caption: 'Planta / Organización espacial'
          },
          {
            src: santuarioImage('archivo', 'estudio-volumetrico'),
            alt: 'Esquema axonométrico de la vivienda y su relación con la pendiente del terreno',
            caption: 'Volumetría / Terreno'
          }
        ]
      }
    ],
    available: true
  },
  {
    slug: 'casa-oquedad',
    title: 'Casa Oquedad',
    category: 'Diseño arquitectónico',
    typology: 'Vivienda',
    participation: 'Diseño arquitectónico, modelado 3D, renders y dibujos',
    cover: oquedadImage('exteriores', 'fachada-principal'),
    coverAlt: 'Vista frontal diurna de Casa Oquedad, vivienda de dos niveles con celosías de madera, ventanales, jardín y cielo azul',
    galleryLabel: 'Exteriores / Arquitectura y paisaje',
    gallery: [
      oquedadImage('exteriores', 'fachada-principal'),
      oquedadImage('exteriores', 'acceso-y-volumen'),
      oquedadImage('exteriores', 'fachada-jardin'),
      oquedadImage('exteriores', 'terraza-y-piscina')
    ],
    statement: 'Volúmenes sobrios, madera y espacios abiertos al paisaje.',
    intro: 'Casa Oquedad es un proyecto de vivienda desarrollado por Juan José Quintero Tobón en Rizzoma: diseño arquitectónico, modelado, dibujos y renders. Las vistas exteriores e interiores muestran sus volúmenes, la conexión con el jardín y el contraste entre materiales, luz y vegetación.',
    closingText: 'Si tienes una vivienda por desarrollar o un proyecto que necesitas visualizar, podemos conversar sobre sus necesidades, referencias y el alcance del trabajo.',
    tour: [{
      title: 'Espacios interiores',
      description: 'Vistas de la sala, cocina, dormitorios y baño, con diferentes atmósferas y entradas de luz natural.',
      display: 'gallery',
      images: [
        { src: oquedadImage('interiores', 'sala-con-ventana-circular'), alt: "Sala con acabados de madera, chimenea, sofás y una ventana circular hacia la vegetación", caption: "Sala / Ventana al paisaje" },
        { src: oquedadImage('interiores', 'cocina-pasillo'), alt: "Cocina longitudinal con isla, revestimientos de madera, luminarias colgantes y luz natural", caption: "Cocina / Recorrido interior" },
        { src: oquedadImage('interiores', 'dormitorio-oscuro'), alt: "Dormitorio en tonos oscuros y madera con iluminación cálida y ventana lateral", caption: "Dormitorio / Atmósfera" },
        { src: oquedadImage('interiores', 'dormitorio-ventana-circular'), alt: "Dormitorio con cama central, mobiliario cálido y ventana circular hacia el exterior", caption: "Dormitorio / Relación con el exterior" },
        { src: oquedadImage('interiores', 'bano-spa'), alt: "Baño con madera, piedra, ducha acristalada y mosaicos oscuros", caption: "Baño / Piedra y madera" }
      ]
    }],
    sections: [
      { title: "Cocina y espacio cotidiano", text: "La perspectiva de la isla permite observar la organización del mobiliario, las superficies de trabajo y la continuidad de los revestimientos de madera.", image: { src: oquedadImage('mirada', 'cocina-isla'), alt: "Cocina con isla central, sillas claras, carpintería de madera y una ventana hacia el exterior", caption: "Cocina / Escala y material" } },
      { title: "Luz y atmósfera", text: "La luz natural atraviesa el baño y acentúa el contraste entre superficies claras, madera y vegetación.", image: { src: oquedadImage('mirada', 'luz-en-bano'), alt: "Baño con bañera blanca, vegetación, ducha acristalada y luz natural proyectada sobre los acabados", caption: "Baño / Luz natural" } },
      { title: "Materialidad interior", text: "El encuentro entre mosaicos verdes, madera y luz localizada permite observar la textura y el tono de los materiales.", image: { src: oquedadImage('mirada', 'materialidad-bano'), alt: "Baño con mueble de madera, espejos y revestimiento de mosaicos verdes oscuros", caption: "Baño / Texturas y contrastes" } }
    ],
    archive: [{
      title: 'Planta y exploraciones',
      description: 'Láminas de organización espacial y volumetría. No se presentan como fases de diseño ni como resultados construidos.',
      images: [
        { src: oquedadImage('archivo', 'planta'), alt: "Planta arquitectónica de la vivienda con distribución de ambientes y espacios exteriores", caption: "Planta / Distribución" },
        { src: oquedadImage('archivo', 'distribucion-volumetrica'), alt: "Vista axonométrica de Casa Oquedad con distribución interior y espacios abiertos", caption: "Modelo / Organización espacial" },
        { src: oquedadImage('archivo', 'modelo-emplazamiento'), alt: "Modelo axonométrico blanco de una vivienda sobre una plataforma de terreno", caption: "Volumetría / Terreno" }
      ]
    }],
    available: true
  }

];

export const availableProjects = projects.filter((project) => project.available);
export const featuredProject = projects.find((project) => project.featured) ?? availableProjects[0];
