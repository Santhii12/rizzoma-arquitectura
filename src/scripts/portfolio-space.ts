
const root = document.querySelector<HTMLElement>('[data-space-gallery]');
const world = root?.querySelector<HTMLElement>('[data-space-world]');

if (root && world) {
  const items = Array.from(world.querySelectorAll<HTMLButtonElement>('[data-space-item]'));
  const focus = document.querySelector<HTMLElement>('[data-space-focus]');
  const focusVisual = focus?.querySelector<HTMLElement>('[data-focus-visual]');
  const focusTitle = focus?.querySelector<HTMLElement>('[data-focus-title]');
  const focusMeta = focus?.querySelector<HTMLElement>('[data-focus-meta]');
  const focusText = focus?.querySelector<HTMLElement>('[data-focus-text]');
  const focusLink = focus?.querySelector<HTMLAnchorElement>('[data-focus-link]');
  const focusClose = focus?.querySelector<HTMLButtonElement>('[data-focus-close]');
  const counter = document.querySelector<HTMLElement>('[data-space-counter]');
  const zoomIn = document.querySelector<HTMLButtonElement>('[data-space-zoom-in]');
  const zoomOut = document.querySelector<HTMLButtonElement>('[data-space-zoom-out]');
  const reset = document.querySelector<HTMLButtonElement>('[data-space-reset]');

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let x = 0;
  let y = 0;
  let scale = 0.68;
  let targetX = x;
  let targetY = y;
  let targetScale = scale;
  let raf = 0;
  let dragging = false;
  let moved = false;
  let lastX = 0;
  let lastY = 0;
  let activePointer: number | null = null;
  const pointers = new Map<number, PointerEvent>();
  let pinchDistance = 0;
  let pinchScale = scale;

  const minScale = 0.28;
  const maxScale = 2.25;

  const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

  const viewportCenter = () => ({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2
  });

  const centerWorld = (animated = false) => {
    const center = viewportCenter();
    const rect = world.getBoundingClientRect();
    const worldW = world.offsetWidth;
    const worldH = world.offsetHeight;
    targetScale = window.innerWidth < 800 ? 0.46 : 0.62;
    targetX = center.x - worldW * targetScale / 2;
    targetY = center.y - worldH * targetScale / 2;
    if (!animated || reduceMotion) {
      x = targetX;
      y = targetY;
      scale = targetScale;
      render();
    } else {
      startAnimation();
    }
  };

  const render = () => {
    world.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
  };

  const animate = () => {
    const ease = reduceMotion ? 1 : 0.16;
    x += (targetX - x) * ease;
    y += (targetY - y) * ease;
    scale += (targetScale - scale) * ease;
    render();

    if (
      Math.abs(targetX - x) > 0.08 ||
      Math.abs(targetY - y) > 0.08 ||
      Math.abs(targetScale - scale) > 0.0005
    ) {
      raf = requestAnimationFrame(animate);
    } else {
      x = targetX;
      y = targetY;
      scale = targetScale;
      render();
      raf = 0;
    }
  };

  const startAnimation = () => {
    if (!raf) raf = requestAnimationFrame(animate);
  };

  const zoomAt = (clientX: number, clientY: number, multiplier: number) => {
    const nextScale = clamp(targetScale * multiplier, minScale, maxScale);
    const worldX = (clientX - targetX) / targetScale;
    const worldY = (clientY - targetY) / targetScale;
    targetX = clientX - worldX * nextScale;
    targetY = clientY - worldY * nextScale;
    targetScale = nextScale;
    startAnimation();
  };

  const openFocus = (item: HTMLButtonElement) => {
    if (!focus || !focusVisual || !focusTitle || !focusMeta || !focusText) return;

    const image = item.dataset.image || '';
    const title = item.dataset.title || '';
    const meta = item.dataset.meta || '';
    const text = item.dataset.text || '';
    const href = item.dataset.href || '';

    focusTitle.textContent = title;
    focusMeta.textContent = meta;
    focusText.textContent = text;

    focusVisual.replaceChildren();
    if (image) {
      const img = document.createElement('img');
      img.src = image;
      img.alt = title;
      img.decoding = 'async';
      focusVisual.appendChild(img);
    } else {
      const placeholder = document.createElement('div');
      placeholder.className = 'portfolio-space__focus-placeholder';

      const mark = document.createElement('img');
      mark.src = focus.dataset.monogram || '';
      mark.alt = '';

      const name = document.createElement('strong');
      name.textContent = title;

      placeholder.append(mark, name);
      focusVisual.appendChild(placeholder);
    }

    if (focusLink) {
      if (href) {
        focusLink.href = href;
        focusLink.hidden = false;
      } else {
        focusLink.hidden = true;
      }
    }

    focus.classList.add('is-open');
    focus.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeFocus = () => {
    if (!focus) return;
    focus.classList.remove('is-open');
    focus.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  root.addEventListener('wheel', (event) => {
    event.preventDefault();
    const factor = Math.exp(-event.deltaY * 0.0013);
    zoomAt(event.clientX, event.clientY, factor);
  }, { passive: false });

  root.addEventListener('pointerdown', (event) => {
    if ((event.target as HTMLElement).closest('[data-space-controls]')) return;
    pointers.set(event.pointerId, event);
    root.setPointerCapture(event.pointerId);

    if (pointers.size === 1) {
      dragging = true;
      moved = false;
      activePointer = event.pointerId;
      lastX = event.clientX;
      lastY = event.clientY;
      root.classList.add('is-dragging');
    } else if (pointers.size === 2) {
      const [a, b] = Array.from(pointers.values());
      pinchDistance = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
      pinchScale = targetScale;
    }
  });

  root.addEventListener('pointermove', (event) => {
    if (!pointers.has(event.pointerId)) return;
    pointers.set(event.pointerId, event);

    if (pointers.size === 2) {
      const [a, b] = Array.from(pointers.values());
      const distance = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
      if (pinchDistance > 0) {
        const centerX = (a.clientX + b.clientX) / 2;
        const centerY = (a.clientY + b.clientY) / 2;
        const desired = clamp(pinchScale * (distance / pinchDistance), minScale, maxScale);
        const factor = desired / targetScale;
        zoomAt(centerX, centerY, factor);
      }
      moved = true;
      return;
    }

    if (!dragging || activePointer !== event.pointerId) return;

    const dx = event.clientX - lastX;
    const dy = event.clientY - lastY;
    if (Math.abs(dx) + Math.abs(dy) > 2) moved = true;

    targetX += dx;
    targetY += dy;
    lastX = event.clientX;
    lastY = event.clientY;
    startAnimation();
  });

  const releasePointer = (event: PointerEvent) => {
    pointers.delete(event.pointerId);
    if (event.pointerId === activePointer) {
      activePointer = null;
      dragging = false;
      root.classList.remove('is-dragging');
    }
    if (pointers.size < 2) pinchDistance = 0;
  };

  root.addEventListener('pointerup', releasePointer);
  root.addEventListener('pointercancel', releasePointer);

  items.forEach((item, index) => {
    item.addEventListener('click', (event) => {
      if (moved) {
        event.preventDefault();
        moved = false;
        return;
      }
      if (counter) counter.textContent = `${String(index + 1).padStart(2, '0')} / ${String(items.length).padStart(2, '0')}`;
      openFocus(item);
    });

    item.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        if (counter) counter.textContent = `${String(index + 1).padStart(2, '0')} / ${String(items.length).padStart(2, '0')}`;
        openFocus(item);
      }
    });
  });

  zoomIn?.addEventListener('click', () => {
    const c = viewportCenter();
    zoomAt(c.x, c.y, 1.24);
  });

  zoomOut?.addEventListener('click', () => {
    const c = viewportCenter();
    zoomAt(c.x, c.y, 0.8);
  });

  reset?.addEventListener('click', () => centerWorld(true));
  focusClose?.addEventListener('click', closeFocus);

  focus?.addEventListener('click', (event) => {
    if (event.target === focus) closeFocus();
  });

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeFocus();

    if (!focus?.classList.contains('is-open')) {
      const step = 70;
      if (event.key === 'ArrowLeft') targetX += step;
      if (event.key === 'ArrowRight') targetX -= step;
      if (event.key === 'ArrowUp') targetY += step;
      if (event.key === 'ArrowDown') targetY -= step;
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) startAnimation();
    }
  });

  window.addEventListener('resize', () => centerWorld(false));
  centerWorld(false);
}
