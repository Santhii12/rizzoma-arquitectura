import { Howl, Howler } from 'howler';
import { PORTFOLIO_BURST_SOUND } from './portfolio-sound';

const root = document.querySelector<HTMLElement>('[data-space-gallery]');
const stage = root?.querySelector<HTMLElement>('[data-space-stage]');
const world = root?.querySelector<HTMLElement>('[data-space-world]');

if (root && stage && world) {
  const items = Array.from(world.querySelectorAll<HTMLButtonElement>('[data-space-item]'));

  const focus = document.querySelector<HTMLElement>('[data-space-focus]');
  const focusVisual = focus?.querySelector<HTMLElement>('[data-focus-visual]');
  const focusTitle = focus?.querySelector<HTMLElement>('[data-focus-title]');
  const focusCategory = focus?.querySelector<HTMLElement>('[data-focus-category]');
  const focusStatement = focus?.querySelector<HTMLElement>('[data-focus-statement]');
  const focusText = focus?.querySelector<HTMLElement>('[data-focus-text]');
  const focusLocation = focus?.querySelector<HTMLElement>('[data-focus-location]');
  const focusLocationRow = focus?.querySelector<HTMLElement>('[data-focus-location-row]');
  const focusYear = focus?.querySelector<HTMLElement>('[data-focus-year]');
  const focusYearRow = focus?.querySelector<HTMLElement>('[data-focus-year-row]');
  const focusSections = focus?.querySelector<HTMLElement>('[data-focus-sections]');
  const focusLink = focus?.querySelector<HTMLAnchorElement>('[data-focus-link]');
  const focusClose = focus?.querySelector<HTMLButtonElement>('[data-focus-close]');
  const soundButton = document.querySelector<HTMLButtonElement>('[data-space-sound]');
  const hint = document.querySelector<HTMLElement>('[data-space-hint]');

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const worldWidth = 1200;
  const worldHeight = 720;
  const centerX = worldWidth / 2;
  const centerY = worldHeight / 2;

  const holdDuration = reduceMotion ? 0 : 320;
  const vortexDuration = reduceMotion ? 1 : 1650;
  const stagger = reduceMotion ? 0 : 72;
  const vortexTurns = 2.35;

  let fitScale = 1;
  let panX = 0;
  let panY = 0;
  let dragging = false;
  let dragMoved = false;
  let activePointer: number | null = null;
  let startPointerX = 0;
  let startPointerY = 0;
  let startPanX = 0;
  let startPanY = 0;
  let suppressClickUntil = 0;
  let vortexFrame = 0;
  let vortexToken = 0;
  let soundTimer = 0;

  const burstSound = new Howl({
    src: [PORTFOLIO_BURST_SOUND],
    volume: 0.42,
    preload: true,
    html5: false,
    onplayerror: () => {
      root.classList.add('is-sound-blocked');
      if (hint) {
        hint.textContent = 'Clic para abrir · arrastra para moverte · pulsa “Sonido” para repetir con audio';
      }
    },
    onunlock: () => {
      root.classList.remove('is-sound-blocked');
    }
  });

  const clamp = (value: number, min: number, max: number) =>
    Math.min(max, Math.max(min, value));

  const easeOutCubic = (value: number) =>
    1 - Math.pow(1 - value, 3);

  const easeOutBack = (value: number) => {
    const c1 = 1.15;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(value - 1, 3) + c1 * Math.pow(value - 1, 2);
  };

  const renderBoardTransform = () => {
    world.style.transform = `translate3d(${panX}px, ${panY}px, 0) scale(${fitScale})`;
  };

  const fitWorldToStage = (resetPan = false) => {
    const rect = stage.getBoundingClientRect();
    const horizontalPadding = window.innerWidth < 600 ? 36 : 100;
    const verticalPadding = window.innerWidth < 600 ? 46 : 86;

    const scaleX = Math.max(0.1, (rect.width - horizontalPadding * 2) / worldWidth);
    const scaleY = Math.max(0.1, (rect.height - verticalPadding * 2) / worldHeight);

    fitScale = Math.min(scaleX, scaleY, 1);

    if (resetPan) {
      panX = 0;
      panY = 0;
    }

    renderBoardTransform();
  };

  const renderInitialStack = () => {
    items.forEach((item, index) => {
      item.style.left = `${centerX}px`;
      item.style.top = `${centerY}px`;
      item.style.opacity = index === 0 ? '1' : '.92';
      item.style.zIndex = String(100 - index);
      item.style.transform =
        `translate(-50%, -50%) scale(${1 - index * 0.018}) rotate(${(index - 2.5) * .45}deg)`;
    });

    root.classList.add('is-entry-playing');
    root.classList.remove('is-entry-complete');
  };

  const renderFinalState = () => {
    items.forEach((item) => {
      const finalX = Number(item.dataset.finalX ?? centerX);
      const finalY = Number(item.dataset.finalY ?? centerY);
      const finalRotate = Number(item.dataset.finalRotate ?? 0);
      const finalZ = Number(item.dataset.finalZ ?? 10);

      item.style.left = `${finalX}px`;
      item.style.top = `${finalY}px`;
      item.style.opacity = '1';
      item.style.zIndex = String(finalZ);
      item.style.transform =
        `translate(-50%, -50%) scale(1) rotate(${finalRotate}deg)`;
    });

    root.classList.remove('is-entry-playing');
    root.classList.add('is-entry-complete');

    if (hint) {
      hint.textContent = 'Clic para abrir · mantén clic y arrastra para moverte';
    }
  };

  const playVortexSound = async () => {
    try {
      if (Howler.ctx?.state === 'suspended') {
        await Howler.ctx.resume();
      }
    } catch {
      // If autoplay is blocked Howler will unlock on the next user gesture.
    }

    try {
      burstSound.stop();
      burstSound.play();
    } catch {
      root.classList.add('is-sound-blocked');
    }
  };

  const runVortex = (withSound = true) => {
    vortexToken += 1;
    const token = vortexToken;

    cancelAnimationFrame(vortexFrame);
    window.clearTimeout(soundTimer);

    renderInitialStack();

    const startedAt = performance.now();
    const sharedStartAngle = -Math.PI / 2;

    if (withSound && !reduceMotion) {
      soundTimer = window.setTimeout(() => {
        if (token === vortexToken) playVortexSound();
      }, holdDuration + 40);
    }

    const frame = (now: number) => {
      if (token !== vortexToken) return;

      const elapsed = now - startedAt;
      let allDone = true;

      items.forEach((item, index) => {
        const localElapsed = elapsed - holdDuration - index * stagger;
        const raw = clamp(localElapsed / vortexDuration, 0, 1);

        if (raw < 1) allDone = false;

        const finalX = Number(item.dataset.finalX ?? centerX);
        const finalY = Number(item.dataset.finalY ?? centerY);
        const finalRotate = Number(item.dataset.finalRotate ?? 0);
        const finalZ = Number(item.dataset.finalZ ?? 10);

        const dx = finalX - centerX;
        const dy = finalY - centerY;
        const finalRadius = Math.hypot(dx, dy);
        const finalAngle = Math.atan2(dy, dx);

        // All cards leave through the same stream. The final slot angle is
        // introduced progressively, so they visibly follow one another.
        const progress = raw;
        const radiusProgress = Math.pow(progress, 1.18);
        const settle = progress > .84
          ? 1 + Math.sin(((progress - .84) / .16) * Math.PI) * .035
          : 1;

        const targetDelta = finalAngle - sharedStartAngle;
        const angle =
          sharedStartAngle +
          progress * Math.PI * 2 * vortexTurns +
          targetDelta * progress;

        const radius = finalRadius * radiusProgress * settle;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;

        const depth = (Math.sin(angle) + 1) / 2;
        const scale =
          .58 +
          progress * .42 +
          depth * .045 +
          (progress > .88 ? Math.sin(((progress - .88) / .12) * Math.PI) * .025 : 0);

        const rotation =
          (1 - progress) * (26 + index * 3.2) +
          finalRotate * progress;

        const opacity =
          raw <= 0
            ? index === 0
              ? 1
              : 0
            : clamp(raw * 4, 0, 1);

        item.style.left = `${x}px`;
        item.style.top = `${y}px`;
        item.style.opacity = String(opacity);
        item.style.zIndex = String(
          progress < 1
            ? 30 + Math.round(depth * 50) + (items.length - index)
            : finalZ
        );
        item.style.transform =
          `translate(-50%, -50%) scale(${scale}) rotate(${rotation}deg)`;
      });

      if (!allDone) {
        vortexFrame = requestAnimationFrame(frame);
      } else {
        renderFinalState();
      }
    };

    vortexFrame = requestAnimationFrame(frame);
  };

  const openFocus = (item: HTMLButtonElement) => {
    if (!focus || !focusVisual || !focusTitle || !focusCategory || !focusStatement || !focusText) {
      return;
    }

    const image = item.dataset.image || '';
    const title = item.dataset.title || '';
    const category = item.dataset.category || '';
    const location = item.dataset.location || '';
    const region = item.dataset.region || '';
    const year = item.dataset.year || '';
    const statement = item.dataset.statement || '';
    const text = item.dataset.text || '';
    const href = item.dataset.href || '';

    focusTitle.textContent = title;
    focusCategory.textContent = category || 'Proyecto Rizzoma';
    focusStatement.textContent = statement;
    focusStatement.hidden = !statement;
    focusText.textContent = text;

    const locationText = [location, region].filter(Boolean).join(', ');

    if (focusLocation && focusLocationRow) {
      focusLocation.textContent = locationText;
      focusLocationRow.hidden = !locationText;
    }

    if (focusYear && focusYearRow) {
      focusYear.textContent = year;
      focusYearRow.hidden = !year;
    }

    if (focusSections) {
      focusSections.replaceChildren();

      try {
        const sections = JSON.parse(item.dataset.sections || '[]') as Array<{
          title?: string;
          text?: string;
        }>;

        sections.forEach((section) => {
          if (!section?.title && !section?.text) return;

          const article = document.createElement('article');

          if (section.title) {
            const heading = document.createElement('h3');
            heading.textContent = section.title;
            article.appendChild(heading);
          }

          if (section.text) {
            const paragraph = document.createElement('p');
            paragraph.textContent = section.text;
            article.appendChild(paragraph);
          }

          focusSections.appendChild(article);
        });

        focusSections.hidden = focusSections.childElementCount === 0;
      } catch {
        focusSections.hidden = true;
      }
    }

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

  stage.addEventListener('pointerdown', (event) => {
    if (!root.classList.contains('is-entry-complete')) return;
    if (event.button !== 0 && event.pointerType === 'mouse') return;

    dragging = true;
    dragMoved = false;
    activePointer = event.pointerId;
    startPointerX = event.clientX;
    startPointerY = event.clientY;
    startPanX = panX;
    startPanY = panY;

    stage.setPointerCapture(event.pointerId);
    root.classList.add('is-board-dragging');
  });

  stage.addEventListener('pointermove', (event) => {
    if (!dragging || activePointer !== event.pointerId) return;

    const dx = event.clientX - startPointerX;
    const dy = event.clientY - startPointerY;

    if (Math.hypot(dx, dy) > 5) {
      dragMoved = true;
    }

    if (!dragMoved) return;

    panX = startPanX + dx;
    panY = startPanY + dy;
    renderBoardTransform();
  });

  const endDrag = (event: PointerEvent) => {
    if (!dragging || activePointer !== event.pointerId) return;

    if (dragMoved) {
      suppressClickUntil = performance.now() + 260;
    }

    dragging = false;
    activePointer = null;
    root.classList.remove('is-board-dragging');

    if (stage.hasPointerCapture(event.pointerId)) {
      stage.releasePointerCapture(event.pointerId);
    }
  };

  stage.addEventListener('pointerup', endDrag);
  stage.addEventListener('pointercancel', endDrag);

  items.forEach((item) => {
    item.addEventListener('click', (event) => {
      if (performance.now() < suppressClickUntil) {
        event.preventDefault();
        return;
      }

      openFocus(item);
    });
  });

  soundButton?.addEventListener('click', async () => {
    panX = 0;
    panY = 0;
    renderBoardTransform();

    try {
      if (Howler.ctx?.state === 'suspended') {
        await Howler.ctx.resume();
      }
    } catch {
      // Howler unlocks on interaction where supported.
    }

    root.classList.remove('is-sound-blocked');
    closeFocus();
    runVortex(true);
  });

  focusClose?.addEventListener('click', closeFocus);

  focus?.addEventListener('click', (event) => {
    if (event.target === focus) closeFocus();
  });

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeFocus();
  });

  window.addEventListener('resize', () => fitWorldToStage(false));

  fitWorldToStage(true);

  if (reduceMotion) {
    renderFinalState();
  } else {
    runVortex(true);
  }
}
