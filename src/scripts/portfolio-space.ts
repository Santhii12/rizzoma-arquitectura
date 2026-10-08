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
  const backLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>('[data-back-site]'));

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const minScale = 0.28;
  const maxScale = 2.2;
  const entryDuration = 2300;
  const startedAt = performance.now();

  let x = 0;
  let y = 0;
  let scale = 0.72;
  let targetX = x;
  let targetY = y;
  let targetScale = scale;
  let dragging = false;
  let moved = false;
  let lastX = 0;
  let lastY = 0;
  let activePointer: number | null = null;
  let pinchDistance = 0;
  let pinchScale = scale;
  const pointers = new Map<number, PointerEvent>();

  const clamp = (value: number, min: number, max: number) =>
    Math.min(max, Math.max(min, value));

  const easeOutQuart = (value: number) => 1 - Math.pow(1 - value, 4);

  const viewportCenter = () => ({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2
  });

  const cameraScale = () => {
    if (window.innerWidth < 520) return 0.62;
    if (window.innerWidth < 800) return 0.68;
    if (window.innerWidth < 1200) return 0.76;
    return 0.82;
  };

  const radiusFactor = () => {
    if (window.innerWidth < 520) return 0.58;
    if (window.innerWidth < 800) return 0.72;
    return 1;
  };

  const centerWorld = (instant = false) => {
    const center = viewportCenter();
    const worldW = world.offsetWidth;
    const worldH = world.offsetHeight;

    targetScale = cameraScale();
    targetX = center.x - worldW * targetScale / 2;
    targetY = center.y - worldH * targetScale / 2;

    if (instant || reduceMotion) {
      x = targetX;
      y = targetY;
      scale = targetScale;
    }
  };

  const updateCamera = () => {
    const ease = reduceMotion ? 1 : 0.15;
    x += (targetX - x) * ease;
    y += (targetY - y) * ease;
    scale += (targetScale - scale) * ease;
    world.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
  };

  const updateVortex = (now: number) => {
    const elapsed = now - startedAt;
    const seconds = elapsed / 1000;
    const rawEntry = clamp(elapsed / entryDuration, 0, 1);
    const entry = reduceMotion ? 1 : easeOutQuart(rawEntry);
    const radiusMult = radiusFactor();
    const cx = world.offsetWidth / 2;
    const cy = world.offsetHeight / 2;

    items.forEach((item, index) => {
      const baseAngle = Number(item.dataset.angle ?? 0);
      const baseRadius = Number(item.dataset.radius ?? 0) * radiusMult;
      const speed = reduceMotion ? 0 : Number(item.dataset.speed ?? 0);
      const phase = Number(item.dataset.phase ?? 0);

      const spiralTurns = (1 - entry) * Math.PI * 6.2;
      const theta = baseAngle + seconds * speed + spiralTurns;
      const pulse = reduceMotion ? 1 : 1 + Math.sin(seconds * 0.72 + phase) * 0.018;
      const radius = baseRadius * entry * pulse;

      const posX = cx + Math.cos(theta) * radius;
      const posY = cy + Math.sin(theta) * radius * 0.66;

      const depth = baseRadius === 0
        ? 0.72
        : (Math.sin(theta) + 1) / 2;

      const depthScale = baseRadius === 0
        ? 1 + (reduceMotion ? 0 : Math.sin(seconds * 0.8) * 0.012)
        : 0.77 + depth * 0.25;

      const entryScale = 0.62 + entry * 0.38;
      const rotation = reduceMotion
        ? 0
        : Math.sin(theta + phase) * (baseRadius === 0 ? 0.4 : 1.8);

      const opacity = clamp(
        (0.24 + entry * 0.76) * (baseRadius === 0 ? 1 : 0.66 + depth * 0.34),
        0,
        1
      );

      item.style.left = `${posX}px`;
      item.style.top = `${posY}px`;
      item.style.opacity = String(opacity);
      item.style.zIndex = String(10 + Math.round(depth * 40) + (baseRadius === 0 ? 35 : 0));
      item.style.transform = `translate(-50%, -50%) scale(${depthScale * entryScale}) rotate(${rotation}deg)`;
    });

    if (rawEntry >= 1) root.classList.remove('is-vortex-loading');
  };

  const frame = (now: number) => {
    updateCamera();
    updateVortex(now);
    requestAnimationFrame(frame);
  };

  const zoomAt = (clientX: number, clientY: number, multiplier: number) => {
    const nextScale = clamp(targetScale * multiplier, minScale, maxScale);
    const worldX = (clientX - targetX) / targetScale;
    const worldY = (clientY - targetY) / targetScale;

    targetX = clientX - worldX * nextScale;
    targetY = clientY - worldY * nextScale;
    targetScale = nextScale;
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
  };

  const closeFocus = () => {
    if (!focus) return;
    focus.classList.remove('is-open');
    focus.setAttribute('aria-hidden', 'true');
  };

  backLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();

      const destination = link.href;

      if (window.opener && !window.opener.closed) {
        try {
          window.opener.focus();
          window.close();

          window.setTimeout(() => {
            window.location.assign(destination);
          }, 180);
          return;
        } catch {
          window.location.assign(destination);
          return;
        }
      }

      window.location.assign(destination);
    });
  });

  root.addEventListener('wheel', (event) => {
    if ((event.target as HTMLElement).closest('[data-space-controls], [data-back-site]')) return;
    event.preventDefault();
    const factor = Math.exp(-event.deltaY * 0.00125);
    zoomAt(event.clientX, event.clientY, factor);
  }, { passive: false });

  root.addEventListener('pointerdown', (event) => {
    const target = event.target as HTMLElement;

    if (
      target.closest('[data-space-controls]') ||
      target.closest('[data-back-site]') ||
      target.closest('[data-focus-close]') ||
      target.closest('[data-focus-link]')
    ) {
      return;
    }

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
        zoomAt(centerX, centerY, desired / targetScale);
      }

      moved = true;
      return;
    }

    if (!dragging || activePointer !== event.pointerId) return;

    const dx = event.clientX - lastX;
    const dy = event.clientY - lastY;

    if (Math.abs(dx) + Math.abs(dy) > 3) moved = true;

    targetX += dx;
    targetY += dy;
    lastX = event.clientX;
    lastY = event.clientY;
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

      if (counter) {
        counter.textContent = `${String(index + 1).padStart(2, '0')} / ${String(items.length).padStart(2, '0')}`;
      }

      openFocus(item);
    });
  });

  zoomIn?.addEventListener('click', () => {
    const c = viewportCenter();
    zoomAt(c.x, c.y, 1.22);
  });

  zoomOut?.addEventListener('click', () => {
    const c = viewportCenter();
    zoomAt(c.x, c.y, 0.82);
  });

  reset?.addEventListener('click', () => centerWorld(false));
  focusClose?.addEventListener('click', closeFocus);

  focus?.addEventListener('click', (event) => {
    if (event.target === focus) closeFocus();
  });

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeFocus();
      return;
    }

    if (focus?.classList.contains('is-open')) return;

    const step = 72;
    if (event.key === 'ArrowLeft') targetX += step;
    if (event.key === 'ArrowRight') targetX -= step;
    if (event.key === 'ArrowUp') targetY += step;
    if (event.key === 'ArrowDown') targetY -= step;
  });

  window.addEventListener('resize', () => centerWorld(true));

  centerWorld(true);
  requestAnimationFrame(frame);
}
