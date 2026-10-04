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
  'Diseño arquitectónico',
  'Remodelación',
  'Diseño + visualización',
  'Visualización',
  'Otro'
]);

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
  const ubicacion = cleanSingleLine(data.get('ubicacion'), 120);
  const mensaje = cleanMultiline(data.get('mensaje'), 1800);

  if (nombre.length < 2 || mensaje.length < 10 || !isValidEmail(email) || !isValidPhone(telefono) || !allowedServices.has(servicio)) {
    if (note) note.textContent = 'Revisa los datos del formulario antes de continuar.';
    return;
  }

  const message = [
    'Hola, Juan José. Quiero conversar con Rizzoma sobre un proyecto.',
    '',
    `Nombre: ${nombre}`,
    `Correo: ${email}`,
    telefono ? `Teléfono: ${telefono}` : '',
    `Servicio: ${servicio}`,
    ubicacion ? `Ubicación: ${ubicacion}` : '',
    '',
    'Proyecto:',
    mensaje
  ].filter(Boolean).join('\n');

  recordSubmission(recentAttempts);

  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  if (note) note.textContent = 'WhatsApp se abrirá con tu mensaje preparado.';
  window.open(url, '_blank', 'noopener,noreferrer');
});

if (!reduceMotion) {
  document.documentElement.classList.add('motion-ready');

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -6% 0px' }
  );

  document.querySelectorAll<HTMLElement>('.reveal').forEach((element) => revealObserver.observe(element));

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
