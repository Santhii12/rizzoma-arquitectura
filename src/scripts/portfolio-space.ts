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

  const burstDelay = reduceMotion ? 0 : 650;
  const burstDuration = reduceMotion ? 1 : 360;
  const stagger = reduceMotion ? 0 : 16;

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
  let burstStarted = false;
  let soundBlocked = false;
  let soundEnabled = true;
  let animations: Animation[] = [];

  try {
    soundEnabled = localStorage.getItem('rizzoma-portfolio-sound') !== 'off';
  } catch {
    soundEnabled = true;
  }

  const burstSound = new Howl({
    src: [PORTFOLIO_BURST_SOUND],
    volume: 0.42,
    preload: true,
    html5: false,
    onplayerror: () => {
      soundBlocked = true;
      root.classList.add('is-sound-blocked');
      if (hint) hint.textContent = 'Clic para abrir · arrastra para moverte · toca “Sonido” para activarlo';
    },
    onunlock: () => {
      soundBlocked = false;
      root.classList.remove('is-sound-blocked');
    }
  });

  const setSoundButtonState = () => {
    if (!soundButton) return;
    soundButton.setAttribute('aria-pressed', String(soundEnabled));
    soundButton.classList.toggle('is-muted', !soundEnabled);
    soundButton.innerHTML = soundEnabled
      ? 'Sonido <span aria-hidden="true">↻</span>'
      : 'Sonido off <span aria-hidden="true">○</span>';
  };

  setSoundButtonState();

  const renderBoardTransform = () => {
    world.style.transform = `translate3d(${panX}px, ${panY}px, 0) scale(${fitScale})`;
  };

  const fitWorldToStage = (resetPan = false) => {
    const rect = stage.getBoundingClientRect();
    const horizontalPadding = window.innerWidth < 600 ? 34 : 110;
    const verticalPadding = window.innerWidth < 600 ? 44 : 92;

    const scaleX = Math.max(0.1, (rect.width - horizontalPadding * 2) / worldWidth);
    const scaleY = Math.max(0.1, (rect.height - verticalPadding * 2) / worldHeight);
    fitScale = Math.min(scaleX, scaleY, 1);

    if (resetPan) {
      panX = 0;
      panY = 0;
    }

    renderBoardTransform();
  };

  const finalTransform = (item: HTMLButtonElement) => {
    const finalRotate = Number(item.dataset.finalRotate ?? 0);
    return `translate(-50%, -50%) scale(1) rotate(${finalRotate}deg)`;
  };

  const renderInitialSingleCard = () => {
    animations.forEach((animation) => animation.cancel());
    animations = [];

    items.forEach((item, index) => {
      item.style.left = `${centerX}px`;
      item.style.top = `${centerY}px`;

      if (index === 0) {
        item.style.opacity = '1';
        item.style.zIndex = '120';
        item.style.transform = 'translate(-50%, -50%) scale(1) rotate(0deg)';
      } else {
        item.style.opacity = '0';
        item.style.zIndex = String(110 - index);
        item.style.transform = 'translate(-50%, -50%) scale(.58) rotate(0deg)';
      }
    });

    root.classList.add('is-entry-playing');
    root.classList.remove('is-entry-complete');
  };

  const renderFinalState = () => {
    items.forEach((item) => {
      const finalX = Number(item.dataset.finalX ?? centerX);
      const finalY = Number(item.dataset.finalY ?? centerY);
      const finalZ = Number(item.dataset.finalZ ?? 10);

      item.style.left = `${finalX}px`;
      item.style.top = `${finalY}px`;
      item.style.opacity = '1';
      item.style.zIndex = String(finalZ);
      item.style.transform = finalTransform(item);
    });

    root.classList.remove('is-entry-playing');
    root.classList.add('is-entry-complete');
    if (hint) hint.textContent = 'Clic para abrir · mantén clic y arrastra para moverte';
  };

  const playBurstSound = () => {
    if (!soundEnabled || reduceMotion) return;

    try {
      burstSound.stop();
      burstSound.play();
    } catch {
      soundBlocked = true;
    }
  };

  const animateBurst = (withSound = true) => {
    renderInitialSingleCard();

    const lead = items[0];

    if (lead && !reduceMotion) {
      const leadAnimation = lead.animate(
        [
          { transform: 'translate(-50%, -50%) scale(1) rotate(0deg)', offset: 0 },
          { transform: 'translate(-50%, -50%) scale(.965) rotate(-.6deg)', offset: .38 },
          { transform: 'translate(-50%, -50%) scale(1.025) rotate(-1.2deg)', offset: .72 },
          { transform: finalTransform(lead), offset: 1 }
        ],
        {
          duration: burstDuration + 80,
          delay: burstDelay,
          easing: 'cubic-bezier(.2,.82,.24,1)',
          fill: 'forwards'
        }
      );
      animations.push(leadAnimation);
    }

    items.slice(1).forEach((item, index) => {
      const finalX = Number(item.dataset.finalX ?? centerX);
      const finalY = Number(item.dataset.finalY ?? centerY);
      const finalRotate = Number(item.dataset.finalRotate ?? 0);

      const dx = finalX - centerX;
      const dy = finalY - centerY;
      const distance = Math.max(1, Math.hypot(dx, dy));

      const normalX = dx / distance;
      const normalY = dy / distance;
      const tangentX = -normalY;
      const tangentY = normalX;

      const direction = index % 2 === 0 ? 1 : -1;
      const curve = Math.min(95, 34 + distance * .12) * direction;

      const p1x = centerX + dx * .16 + tangentX * curve;
      const p1y = centerY + dy * .16 + tangentY * curve;
      const p2x = centerX + dx * .72 + tangentX * curve * .38;
      const p2y = centerY + dy * .72 + tangentY * curve * .38;
      const overshootX = finalX + normalX * Math.min(18, distance * .035);
      const overshootY = finalY + normalY * Math.min(18, distance * .035);

      const startRotate = direction * (18 + index * 2.4);

      const animation = item.animate(
        [
          {
            left: `${centerX}px`,
            top: `${centerY}px`,
            opacity: 0,
            transform: `translate(-50%, -50%) scale(.56) rotate(${startRotate}deg)`,
            offset: 0
          },
          {
            left: `${p1x}px`,
            top: `${p1y}px`,
            opacity: 1,
            transform: `translate(-50%, -50%) scale(.82) rotate(${startRotate * .56}deg)`,
            offset: .24
          },
          {
            left: `${p2x}px`,
            top: `${p2y}px`,
            opacity: 1,
            transform: `translate(-50%, -50%) scale(1.04) rotate(${finalRotate + direction * 2.5}deg)`,
            offset: .68
          },
          {
            left: `${overshootX}px`,
            top: `${overshootY}px`,
            opacity: 1,
            transform: `translate(-50%, -50%) scale(1.018) rotate(${finalRotate + direction * .8}deg)`,
            offset: .86
          },
          {
            left: `${finalX}px`,
            top: `${finalY}px`,
            opacity: 1,
            transform: finalTransform(item),
            offset: 1
          }
        ],
        {
          duration: burstDuration,
          delay: burstDelay + index * stagger,
          easing: 'cubic-bezier(.16,.88,.24,1)',
          fill: 'forwards'
        }
      );

      animations.push(animation);
    });

    if (withSound) {
      window.setTimeout(playBurstSound, burstDelay + 5);
    }

    const completeAfter =
      burstDelay +
      burstDuration +
      Math.max(0, items.length - 2) * stagger +
      40;

    window.setTimeout(renderFinalState, completeAfter);
  };

  const openFocus = (item: HTMLButtonElement) => {
    if (!focus || !focusVisual || !focusTitle || !focusCategory || !focusStatement || !focusText) return;

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
        const sections = JSON.parse(item.dataset.sections || '[]') as Array<{ title?: string; text?: string }>;

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

    if (Math.hypot(dx, dy) > 5) dragMoved = true;
    if (!dragMoved) return;

    panX = startPanX + dx;
    panY = startPanY + dy;
    renderBoardTransform();
  });

  const endDrag = (event: PointerEvent) => {
    if (!dragging || activePointer !== event.pointerId) return;

    if (dragMoved) suppressClickUntil = performance.now() + 260;

    dragging = false;
    activePointer = null;
    root.classList.remove('is-board-dragging');

    if (stage.hasPointerCapture(event.pointerId)) stage.releasePointerCapture(event.pointerId);
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
    soundEnabled = true;

    try {
      localStorage.setItem('rizzoma-portfolio-sound', 'on');
    } catch {
      // Ignore storage errors.
    }

    setSoundButtonState();

    try {
      if (Howler.ctx?.state === 'suspended') await Howler.ctx.resume();
    } catch {
      // Howler will retry through its own unlock flow.
    }

    burstSound.stop();
    soundBlocked = false;
    root.classList.remove('is-sound-blocked');
    panX = 0;
    panY = 0;
    renderBoardTransform();
    animateBurst(true);
  });

  soundButton?.addEventListener('contextmenu', (event) => {
    event.preventDefault();
    soundEnabled = false;

    try {
      localStorage.setItem('rizzoma-portfolio-sound', 'off');
    } catch {
      // Ignore storage errors.
    }

    burstSound.stop();
    setSoundButtonState();
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
  renderInitialSingleCard();

  if (reduceMotion) {
    renderFinalState();
  } else {
    window.setTimeout(() => {
      if (!burstStarted) {
        burstStarted = true;
        animateBurst(true);
      }
    }, 80);
  }

  if (soundBlocked && hint) {
    hint.textContent = 'Clic para abrir · arrastra para moverte · toca “Sonido” para repetir con audio';
  }
}
