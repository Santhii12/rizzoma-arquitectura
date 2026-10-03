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
form?.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;

  const data = new FormData(form);
  const phone = form.dataset.whatsapp;
  if (!phone) return;

  const field = (name: string) => String(data.get(name) ?? '').trim();
  const message = [
    'Hola, Juan José. Quiero conversar con Rizzoma sobre un proyecto.',
    '',
    `Nombre: ${field('nombre')}`,
    `Correo: ${field('email')}`,
    field('telefono') ? `Teléfono: ${field('telefono')}` : '',
    `Servicio: ${field('servicio')}`,
    field('ubicacion') ? `Ubicación: ${field('ubicacion')}` : '',
    '',
    'Proyecto:',
    field('mensaje')
  ].filter(Boolean).join('\n');

  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  const note = form.querySelector<HTMLElement>('[data-form-note]');
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
