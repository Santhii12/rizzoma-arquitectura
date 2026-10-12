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
  openingCategory?: string;
  discipline?: string;
  introDetail?: string;
  tourIntro?: string;
  archiveTitle?: string;
  archiveIntro?: string;
  closingEyebrow?: string;
  closingTitle?: string;
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
    openingCategory: 'Visualización arquitectónica · Diseño de fachada',
    discipline: 'Diseño de fachada · Visualización arquitectónica',
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
    statement: 'La arquitectura como presencia en el paisaje de Guatapé.',
    closingEyebrow: 'Rizzoma / Arquitectura + visualización',
    closingTitle: '¿Tienes un proyecto que necesita ser contado?',
    closingText: 'Desarrollamos visualizaciones arquitectónicas y propuestas de fachada que ayudan a comunicar las cualidades de un proyecto. Conversemos sobre tu idea, el alcance del trabajo y el material disponible.',
    intro: 'Cabo San Miguel es un proyecto de vivienda ubicado en Guatapé, Antioquia. Desde Rizzoma se desarrollaron el modelado tridimensional, el diseño de fachada y las visualizaciones arquitectónicas para comunicar la propuesta del edificio.',
    introDetail: 'El trabajo se concentra en la expresión exterior y en la representación de sus espacios, haciendo legibles la composición de la fachada, la volumetría y los ambientes interiores.',
    tourIntro: 'Un recorrido visual por los ambientes y perspectivas de Cabo San Miguel, desde la experiencia de los espacios interiores hasta los detalles que construyen su atmósfera.',
    tour: [
      {
        title: 'Espacios interiores',
        description: 'Sala, cocina, circulaciones y habitaciones se presentan a través de imágenes que permiten reconocer la organización de los ambientes y la relación entre materiales, iluminación y mobiliario.',
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
        title: 'Una fachada que da identidad',
        text: 'Los arcos, los balcones y la vegetación construyen la expresión exterior del edificio. El diseño de fachada desarrollado por Rizzoma busca dar coherencia a estos elementos y definir una presencia reconocible en el paisaje de Guatapé.',
        image: { src: caboImage('exteriores-03'), alt: 'Vista detallada de la fachada, sus arcos, balcones y vegetación', caption: 'Composición de fachada' }
      },
      {
        title: 'Hacer legible la vida interior',
        text: 'Las visualizaciones permiten recorrer los ambientes y comprender la relación entre la sala, la cocina y las circulaciones. La luz, las texturas y el mobiliario ayudan a comunicar la atmósfera de los espacios y la experiencia que proponen.',
        image: { src: caboImage('interiores-01'), alt: 'Interior del edificio con cocina y sala abiertas, materiales cálidos y luz natural', caption: 'Visualización de espacios interiores' }
      },
      {
        title: 'El edificio desde su llegada',
        text: 'La vista desde el acceso muestra cómo se presenta el conjunto al aproximarse desde la vía. Esta perspectiva complementa las vistas generales y permite entender la fachada desde una escala más cercana.',
        image: { src: caboImage('exteriores-09'), alt: 'Acceso desde la vía hacia la fachada principal del edificio', caption: 'Vista desde el acceso' }
      }
    ],
    archiveTitle: 'El proyecto en volumen',
    archiveIntro: 'Las vistas del modelo tridimensional permiten observar el volumen del edificio y su relación con el terreno desde diferentes perspectivas, complementando las imágenes finales de visualización.',
    archive: [
      {
        title: 'Vistas del modelo tridimensional',
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
    closingEyebrow: 'Rizzoma / Arquitectura + visualización',
    closingText: 'Si tienes una idea de vivienda o un lugar por habitar, conversemos sobre sus necesidades, su relación con el entorno y las posibilidades de desarrollar una propuesta arquitectónica.',
    intro: 'Casa Patio Horizonte es una propuesta de vivienda desarrollada por Juan José Quintero Tobón desde Rizzoma. El proyecto explora cómo los patios, las aperturas y las terrazas pueden construir una relación continua entre los espacios habitables y el paisaje.',
    introDetail: 'A través del diseño arquitectónico, el modelado tridimensional, las visualizaciones y los dibujos, se desarrolló una propuesta que busca integrar la vida cotidiana con la luz, la vegetación y las condiciones del lugar.',
    tourIntro: 'Un recorrido por los espacios y las perspectivas de Casa Patio Horizonte. Las imágenes permiten reconocer la propuesta desde su relación con el entorno hasta los ambientes que dan forma a la vida cotidiana.',
    tour: [
      {
        title: 'Espacios interiores',
        description: 'La sala, la cocina-comedor y el dormitorio muestran distintas formas de experimentar la vivienda. La iluminación, las texturas y las aperturas contribuyen a construir ambientes conectados con el exterior, sin perder su intimidad.',
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
        title: 'La casa y el paisaje',
        text: 'La relación con el entorno orienta la manera de abrir y organizar la vivienda. Esta vista muestra cómo la fachada, los ventanales y la vegetación acercan los espacios de la casa al exterior.',
        image: {
          src: patioImage('exteriores', 'exterior-03'),
          alt: 'Vista cercana de la fachada de Casa Patio Horizonte con materiales naturales y vegetación',
          caption: 'La vivienda y su paisaje'
        }
      },
      {
        title: 'Una transición entre espacios',
        text: 'La terraza, los ventanales y la piscina crean un espacio intermedio para estar al aire libre. Desde esta perspectiva, el interior se abre a las áreas exteriores y amplía las maneras de habitar la vivienda.',
        image: {
          src: patioImage('exteriores', 'exterior-07'),
          alt: 'Vista de Casa Patio Horizonte desde el jardín, con terraza, piscina y ventanales que conectan la vivienda con el exterior',
          caption: 'Terraza / Interior y exterior'
        }
      },
      {
        title: 'La expresión de la materia',
        text: 'La madera del techo, el revestimiento de piedra y las amplias superficies acristaladas aparecen juntos en esta vista desde el interior. La luz del atardecer destaca sus texturas y enmarca el paisaje lejano.',
        image: {
          src: patioImage('exteriores', 'exterior-04'),
          alt: 'Vista interior de Casa Patio Horizonte con techo de madera, muro revestido en piedra, ventanales y paisaje lejano al atardecer',
          caption: 'Materialidad / Vista desde el interior'
        }
      }
    ],
    archiveIntro: 'Además de las imágenes finales, los dibujos y esquemas permiten comprender cómo se organiza la vivienda y cómo se relacionan sus volúmenes y espacios.',
    archive: [
      {
        title: 'Planos y exploraciones',
        description: 'La planta arquitectónica, el esquema de organización espacial y los estudios volumétricos ofrecen distintas lecturas del proyecto: desde la distribución de los ambientes hasta la composición general de la vivienda.',
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
    location: 'San Vicente de Ferrer',
    region: 'Antioquia',
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
    statement: 'Convivir, trabajar y descansar en una misma vivienda.',
    intro: 'Casa El Umbral es una propuesta de diseño interior residencial desarrollada por Juan José Quintero Tobón desde Rizzoma. La sala se conecta visualmente con la cocina y la escalera; los dormitorios, el estudio, el baño y el área de ejercicio responden a otros usos de la vida cotidiana.',
    introDetail: 'El trabajo de Rizzoma comprende el diseño de interiores, el modelado tridimensional, los renders y los dibujos. Los distintos ambientes comparten una presencia marcada de madera, superficies de tonos claros y detalles textiles, con tratamientos particulares según la actividad de cada espacio.',
    closingEyebrow: 'Rizzoma / Arquitectura + visualización',
    closingText: 'Conversemos sobre tu proyecto, sus necesidades y las posibilidades de comunicarlo a través de la arquitectura y la visualización.',
    tourIntro: 'Las perspectivas principales presentan los distintos usos de la vivienda, desde la sala integrada con la cocina y la escalera hasta los ambientes más personales. La galería siguiente se detiene en una sala junto al ventanal y en diferentes vistas del dormitorio.',
    tour: [
      {
        title: 'Sala y dormitorio',
        description: 'La primera imagen muestra una sala abierta hacia el exterior. Las siguientes se acercan al dormitorio desde varios ángulos, destacando el trabajo de carpintería, las texturas del cabecero y la luz que entra por la ventana.',
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
        title: 'Un espacio para concentrarse',
        text: 'En el estudio, una mesa continua organiza dos puestos de trabajo junto a un ventanal. La carpintería, las superficies minerales y la entrada lateral de luz dan forma a un ambiente de uso cotidiano sin sobrecargarlo.',
        image: {
          src: umbralImage('mirada', 'oficina-luminosa'),
          alt: 'Oficina con dos puestos de trabajo junto a un ventanal y luz cálida sobre las superficies',
          caption: 'Luz natural / Área de trabajo'
        }
      },
      {
        title: 'El detalle a escala cotidiana',
        text: 'En el baño, una franja de mosaico verde contrasta con el mueble de madera, las superficies claras y el espejo circular. La imagen permite apreciar cómo los encuentros entre revestimientos definen el carácter de una estancia pequeña.',
        image: {
          src: umbralImage('mirada', 'bano-mosaicos'),
          alt: 'Baño con mosaicos verdes, espejo circular, mueble de madera y luz cálida',
          caption: 'Baño / Materialidad'
        }
      },
      {
        title: 'Lugar para el movimiento',
        text: 'La zona de ejercicio incorpora una caminadora, pesas y equipamiento de entrenamiento sobre un suelo de madera. Los ventanales y las lamas verticales acercan la vista al exterior y equilibran la presencia de los aparatos.',
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
    location: 'El Santuario',
    region: 'Antioquia',
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
    location: 'San Vicente de Ferrer',
    region: 'Antioquia',
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
