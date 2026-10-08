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

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const worldWidth = 1200;
  const worldHeight = 720;
  const centerX = worldWidth / 2;
  const centerY = worldHeight / 2;

  const holdDuration = reduceMotion ? 0 : 620;
  const itemDelay = reduceMotion ? 0 : 105;
  const moveDuration = reduceMotion ? 1 : 1550;
  const spiralTurns = 2.05;
  const animationStart = performance.now();

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

  const clamp = (value: number, min: number, max: number) =>
    Math.min(max, Math.max(min, value));

  const easeOutQuint = (value: number) =>
    1 - Math.pow(1 - value, 5);

  const renderBoardTransform = () => {
    world.style.transform =
      `translate3d(${panX}px, ${panY}px, 0) scale(${fitScale})`;
  };

  const fitWorldToStage = (resetPan = false) => {
    const rect = stage.getBoundingClientRect();
    const horizontalPadding = window.innerWidth < 600 ? 28 : 84;
    const verticalPadding = window.innerWidth < 600 ? 36 : 72;

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
      item.style.opacity = '1';
      item.style.zIndex = String(100 - index);
      item.style.transform =
        `translate(-50%, -50%) scale(${1 - index * 0.008}) rotate(${index % 2 === 0 ? -.4 : .4}deg)`;
    });
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
  };

  const animateEntry = (now: number) => {
    const elapsed = now - animationStart;

    if (elapsed < holdDuration) {
      requestAnimationFrame(animateEntry);
      return;
    }

    let complete = true;

    items.forEach((item, index) => {
      const localElapsed = elapsed - holdDuration - index * itemDelay;
      const progress = clamp(localElapsed / moveDuration, 0, 1);

      if (progress < 1) complete = false;

      const eased = easeOutQuint(progress);
      const finalX = Number(item.dataset.finalX ?? centerX);
      const finalY = Number(item.dataset.finalY ?? centerY);
      const finalRotate = Number(item.dataset.finalRotate ?? 0);
      const finalZ = Number(item.dataset.finalZ ?? 10);

      const dx = finalX - centerX;
      const dy = finalY - centerY;
      const radius = Math.hypot(dx, dy);
      const finalAngle = Math.atan2(dy, dx);

      const turns = index === 0 ? spiralTurns + .28 : spiralTurns;
      const angle = finalAngle - (1 - eased) * Math.PI * 2 * turns;
      const currentRadius = radius * eased;

      const x = centerX + Math.cos(angle) * currentRadius;
      const y = centerY + Math.sin(angle) * currentRadius;
      const scale = .84 + eased * .16;
      const rotation =
        finalRotate * eased +
        (1 - eased) * (index === 0 ? -6 : -11 - index * .65);

      item.style.left = `${x}px`;
      item.style.top = `${y}px`;
      item.style.opacity = String(.84 + eased * .16);
      item.style.zIndex = String(progress < 1 ? 120 - index : finalZ);
      item.style.transform =
        `translate(-50%, -50%) scale(${scale}) rotate(${rotation}deg)`;
    });

    if (!complete) {
      requestAnimationFrame(animateEntry);
    } else {
      renderFinalState();
    }
  };

  const openFocus = (item: HTMLButtonElement) => {
    if (
      !focus ||
      !focusVisual ||
      !focusTitle ||
      !focusCategory ||
      !focusStatement ||
      !focusText
    ) {
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

        focusSections.hidden = sections.length === 0;
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

  focusClose?.addEventListener('click', closeFocus);

  focus?.addEventListener('click', (event) => {
    if (event.target === focus) closeFocus();
  });

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeFocus();
  });

  window.addEventListener('resize', () => fitWorldToStage(false));

  fitWorldToStage(true);
  renderInitialStack();

  if (reduceMotion) {
    renderFinalState();
  } else {
    requestAnimationFrame(animateEntry);
  }
}
