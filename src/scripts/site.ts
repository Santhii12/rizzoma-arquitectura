export {};

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const menuToggle = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
const menu = document.querySelector<HTMLElement>('[data-menu]');

const closeMenu = () => {
  menuToggle?.setAttribute('aria-expanded', 'false');
  menu?.classList.remove('is-open');
  document.body.classList.remove('menu-open');
};

menuToggle?.addEventListener('click', () => {
  const willOpen = menuToggle.getAttribute('aria-expanded') !== 'true';
  menuToggle.setAttribute('aria-expanded', String(willOpen));
  menu?.classList.toggle('is-open', willOpen);
  document.body.classList.toggle('menu-open', willOpen);
});

menu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMenu();
});

const form = document.querySelector<HTMLFormElement>('[data-contact-form]');
const formLoadedAt = Date.now();

// Los enlaces de Inicio seleccionan el propósito, sin enviar información automáticamente.
const entryType = new URLSearchParams(window.location.search).get('tipo');
const requestedType = entryType === 'colaboracion'
  ? 'Colaboración con arquitecto o estudio'
  : entryType === 'proyecto-propio'
    ? 'Proyecto propio'
    : null;
const typeSelect = form?.elements.namedItem('tipo_encargo');
if (requestedType && typeSelect instanceof HTMLSelectElement) {
  typeSelect.value = requestedType;
}

const cleanSingleLine = (value: FormDataEntryValue | null, maxLength: number) =>
  String(value ?? '')
    .normalize('NFKC')
    .replace(/[\u0000-\u001F\u007F<>]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength);

const cleanMultiline = (value: FormDataEntryValue | null, maxLength: number) =>
  String(value ?? '')
    .normalize('NFKC')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F<>]/g, ' ')
    .replace(/\r\n?/g, '\n')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
    .slice(0, maxLength);

const isValidEmail = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(value) && value.length <= 160;

const isValidPhone = (value: string) =>
  value === '' || /^[0-9+() .-]{7,24}$/.test(value);

const allowedServices = new Set([
  'Desarrollo arquitectónico',
  'Modelado y documentación arquitectónica',
  'Visualización arquitectónica',
  'Diseño arquitectónico',
  'Remodelación',
  'Diseño + visualización',
  'Visualización',
  'Otro'
]);

const allowedTypes = new Set(['Colaboración con arquitecto o estudio', 'Proyecto propio', 'Consulta inicial']);

const getRecentSubmissions = () => {
  try {
    const stored = sessionStorage.getItem('rizzoma-contact-attempts');
    const values = stored ? JSON.parse(stored) : [];
    if (!Array.isArray(values)) return [];
    const now = Date.now();
    return values.filter((time) => Number.isFinite(time) && now - Number(time) < 60_000);
  } catch {
    return [];
  }
};

const recordSubmission = (attempts: number[]) => {
  try {
    sessionStorage.setItem('rizzoma-contact-attempts', JSON.stringify([...attempts, Date.now()]));
  } catch {
    // El formulario sigue funcionando aunque el navegador bloquee sessionStorage.
  }
};

form?.addEventListener('submit', (event) => {
  event.preventDefault();

  const note = form.querySelector<HTMLElement>('[data-form-note]');
  const honeypot = form.elements.namedItem('empresa_web') as HTMLInputElement | null;

  if (honeypot?.value.trim()) {
    if (note) note.textContent = 'No fue posible procesar la solicitud.';
    return;
  }

  if (Date.now() - formLoadedAt < 1500) {
    if (note) note.textContent = 'Espera un momento antes de enviar el formulario.';
    return;
  }

  const recentAttempts = getRecentSubmissions();
  if (recentAttempts.length >= 3) {
    if (note) note.textContent = 'Has intentado enviar varias veces. Espera un minuto y vuelve a intentarlo.';
    return;
  }

  if (!form.reportValidity()) return;

  const data = new FormData(form);
  const phone = form.dataset.whatsapp;
  if (!phone || !/^\d{10,15}$/.test(phone)) return;

  const nombre = cleanSingleLine(data.get('nombre'), 80);
  const email = cleanSingleLine(data.get('email'), 160);
  const telefono = cleanSingleLine(data.get('telefono'), 24);
  const servicio = cleanSingleLine(data.get('servicio'), 80);
  const tipoEncargo = cleanSingleLine(data.get('tipo_encargo'), 80);
  const ubicacion = cleanSingleLine(data.get('ubicacion'), 120);
  const mensaje = cleanMultiline(data.get('mensaje'), 1800);

  if (nombre.length < 2 || mensaje.length < 10 || (email !== '' && !isValidEmail(email)) || !isValidPhone(telefono) || !allowedServices.has(servicio) || !allowedTypes.has(tipoEncargo)) {
    if (note) note.textContent = 'Revisa los datos del formulario antes de continuar.';
    return;
  }

  const message = [
    'Hola, Juan José. Quiero conversar con Rizzoma sobre un proyecto.',
    '',
    `Nombre: ${nombre}`,
    email ? `Correo: ${email}` : '',
    telefono ? `Teléfono: ${telefono}` : '',
    `Tipo de encargo: ${tipoEncargo}`,
    `Servicio: ${servicio}`, 
    ubicacion ? `Ubicación: ${ubicacion}` : '',
    '',
    'Proyecto:',
    mensaje
  ].filter(Boolean).join('\n');

  recordSubmission(recentAttempts);

  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  if (note) note.textContent = 'Continuarás a WhatsApp con el mensaje preparado. Tú decides si lo envías.';
  window.location.assign(url);
});

if (!reduceMotion) {
  document.documentElement.classList.add('motion-ready');

  // Scroll entrances are now handled by the progressive, fail-visible motion system.
  // Never hide .reveal elements with CSS while waiting for an observer.

  const heroTitle = document.querySelector<HTMLElement>('[data-hero-title]');
  requestAnimationFrame(() => heroTitle?.classList.add('is-ready'));

  const parallaxMedia = Array.from(document.querySelectorAll<HTMLElement>('.parallax-media'));
  let ticking = false;

  const updateParallax = () => {
    const viewport = window.innerHeight;
    parallaxMedia.forEach((container) => {
      const image = container.querySelector('img') as HTMLImageElement | null;
      if (!image) return;
      const rect = container.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > viewport) return;
      const progress = (rect.top + rect.height / 2 - viewport / 2) / viewport;
      image.style.transform = `scale(1.04) translate3d(0, ${progress * -18}px, 0)`;
    });
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(updateParallax);
  }, { passive: true });

  updateParallax();
}


// Discreet architectural motion: progressive enhancement, not a visibility gate.
// Every element stays readable if JavaScript, IntersectionObserver or Web Animations fails.
const motionMedia = window.matchMedia('(prefers-reduced-motion: reduce)');
if (!motionMedia.matches && 'IntersectionObserver' in window && 'animate' in Element.prototype) {
  const easing = 'cubic-bezier(.22, 1, .36, 1)';
  const animated = new Set<Animation>();
  const targets = [
    '.reveal',
    '.nuestra-mirada__eyebrow',
    '.nuestra-mirada__title',
    '.nuestra-mirada__body',
    '.nuestra-mirada__visual',
    '.rz-home-feature__figure',
    '.rz-home-feature__caption',
    '.rz-home-project',
    '.rizzoma-offer__headline',
    '.rizzoma-offer__intro-copy',
    '.rizzoma-offer__path',
    '.rizzoma-offer__featured-visual',
    '.rizzoma-offer__featured-copy',
    '.rizzoma-offer__secondary-card',
    '.rz-services-guide__hero-heading',
    '.rz-services-guide__hero-intro',
    '.rz-services-guide__chapter',
    '.rz-services-guide__collaboration-inner',
    '.rz-services-guide__method-intro',
    '.studio-profile',
    '.rz-studio-values',
    '.rz-studio-case__opening',
    '.rz-studio-case__feature',
    '.rz-studio-contact-inner',
    '.rz-pe__intro-grid',
    '.rz-pe__overview',
    '.rz-pe__section-header',
    '.rz-pe__insight-copy',
    '.rz-pe__insight-figure',
    '.rz-pe__group-intro',
    '.rz-pe__ending-inner',
    '.contact-direct',
    '.contact-form',
    '.rz-portfolio-editorial'
  ];

  const once = new WeakSet<Element>();
  const observer = new IntersectionObserver((entries, watching) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting || once.has(entry.target)) return;
      once.add(entry.target);
      watching.unobserve(entry.target);

      const element = entry.target as HTMLElement;
      // A very short sequence only for closely related cards; no layout changes.
      const card = element.matches('.rizzoma-offer__path, .rizzoma-offer__secondary-card, .rz-home-project, .rz-studio-principle');
      const siblings = card ? Array.from(element.parentElement?.children ?? []) : [];
      const delay = card ? Math.min(siblings.indexOf(element), 2) * 75 : 0;
      const animation = element.animate(
        [
          { opacity: 0.8, transform: 'translateY(10px)' },
          { opacity: 1, transform: 'translateY(0px)' }
        ],
        { duration: 590, easing, delay, fill: 'backwards' }
      );
      animated.add(animation);
      animation.finished.catch(() => {}).finally(() => animated.delete(animation));
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -3% 0px' });

  document.querySelectorAll<HTMLElement>(targets.join(',')).forEach((element) => {
    // Already visible on first paint: no late opacity reset or flash.
    const bounds = element.getBoundingClientRect();
    if (bounds.bottom > 0 && bounds.top < window.innerHeight - 24) return;
    observer.observe(element);
  });

  // Text, buttons and the image remain visible until their brief entrance begins.
  const hero = document.querySelector<HTMLElement>('.rizzoma-immersive-hero');
  if (hero) {
    const selectors = [
      '.rizzoma-hero-overline',
      '.rizzoma-hero-name',
      '.rizzoma-hero-statement',
      '.rizzoma-hero-description',
      '.rizzoma-hero-actions'
    ];
    requestAnimationFrame(() => {
      if (motionMedia.matches) return;
      selectors.forEach((selector, index) => {
        const el = hero.querySelector<HTMLElement>(selector);
        if (!el) return;
        const animation = el.animate(
          [
            { opacity: 0.88, transform: 'translateY(7px)' },
            { opacity: 1, transform: 'translateY(0px)' }
          ],
          { duration: 570, easing, delay: index * 75, fill: 'backwards' }
        );
        animated.add(animation);
        animation.finished.catch(() => {}).finally(() => animated.delete(animation));
      });
    });
  }
  motionMedia.addEventListener('change', () => {
    if (!motionMedia.matches) return;
    observer.disconnect();
    animated.forEach((animation) => animation.cancel());
    animated.clear();
  });
}

const shareButtons = document.querySelectorAll<HTMLButtonElement>('[data-share-project]');
shareButtons.forEach((button) => {
  button.addEventListener('click', async () => {
    const status = button.parentElement?.querySelector<HTMLElement>('[data-share-status]');
    const title = button.dataset.shareTitle || document.title;
    const text = button.dataset.shareText || '';
    const url = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({ title, text, url });
        if (status) status.textContent = 'Proyecto compartido.';
        return;
      }

      await navigator.clipboard.writeText(url);
      if (status) status.textContent = 'Enlace copiado.';
    } catch (error) {
      if ((error as DOMException)?.name === 'AbortError') return;

      try {
        await navigator.clipboard.writeText(url);
        if (status) status.textContent = 'Enlace copiado.';
      } catch {
        if (status) status.textContent = 'Copia la dirección del navegador para compartir el proyecto.';
      }
    }
  });
});
