// Scroll-driven spiral-to-film-sequence: one passive scroll listener and one RAF.
const section = document.querySelector<HTMLElement>('[data-cinema-scroll]');
const cards = Array.from(section?.querySelectorAll<HTMLElement>('[data-cinema-card]') ?? []);
const counter = section?.querySelector<HTMLElement>('[data-cinema-counter]');
const heading = section?.querySelector<HTMLElement>('.rz-cinema-heading');
const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
const desktop = window.matchMedia('(min-width: 901px)');
const clamp = (v: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));
const smooth = (v: number) => { const t = clamp(v); return t * t * (3 - 2 * t); };
let raf = 0;
let active = false;
let lastIndex = -1;

function render() {
  raf = 0;
  if (!section || !active) return;
  const rect = section.getBoundingClientRect();
  const travel = Math.max(1, section.offsetHeight - window.innerHeight);
  const progress = clamp(-rect.top / travel);
  const morph = smooth(progress / .18);
  if (heading) { heading.style.opacity = String(1-smooth(progress/.14)); heading.style.transform = `translate(-50%, ${(-35*smooth(progress/.14)).toFixed(1)}px)`; }
  const focus = clamp((progress - .18) / .82) * Math.max(0, cards.length - 1);
  const nearest = Math.min(cards.length - 1, Math.round(focus));
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const radiusX = Math.min(vw * .24, 350);
  const radiusY = Math.min(vh * .17, 145);
  cards.forEach((card, i) => {
    const angle = -Math.PI * .85 + i * (Math.PI * 1.65 / Math.max(1, cards.length - 1));
    const depth = (Math.sin(angle + .65) + 1) / 2;
    const spiralX = Math.cos(angle) * radiusX;
    const spiralY = Math.sin(angle) * radiusY;
    const spiralScale = .28 + depth * .23;
    const spiralRotate = -11 + i * 4.5;
    const distance = i - focus;
    // Neighboring frames remain visible as a continuous vertical reel.
    const listX = 0;
    const listY = distance * Math.min(vh * .65, 510);
    const listScale = clamp(1.05 - Math.abs(distance) * .38, .25, 1.05);
    const x = spiralX * (1 - morph) + listX * morph;
    const y = spiralY * (1 - morph) + listY * morph;
    const scale = spiralScale * (1 - morph) + listScale * morph;
    const rotate = spiralRotate * (1 - morph);
    const opacity = (1 - morph) + morph * clamp(1.15 - Math.abs(distance) * .25, .38, 1);
    card.style.transform = `translate3d(calc(-50% + ${x.toFixed(1)}px),calc(-50% + ${y.toFixed(1)}px),0) rotate(${rotate.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
    card.style.opacity = opacity.toFixed(3);
    card.style.zIndex = String(100 - Math.round(Math.abs(distance) * 8) + (i === nearest ? 20 : 0));
    const current = i === nearest;
    card.classList.toggle('is-active',current);
    const interactive = card.querySelector<HTMLElement>('a,button');
    if (interactive) interactive.tabIndex = current ? 0 : -1;
  });
  if (nearest !== lastIndex) {
    lastIndex = nearest;
    if (counter) counter.textContent = `${String(nearest + 1).padStart(2,'0')} / ${String(cards.length).padStart(2,'0')}`;
  }
}
function schedule(){ if (!raf) raf = requestAnimationFrame(render); }
function configure(){
  if (!section) return;
  active = desktop.matches && !motion.matches && cards.length > 1;
  section.classList.toggle('is-cinematic',active);
  section.style.setProperty('--rz-count',String(cards.length));
  if (!active){
    cards.forEach(card=>{
      card.style.removeProperty('transform');card.style.removeProperty('opacity');card.style.removeProperty('z-index');
      card.classList.remove('is-active');
      const interactive=card.querySelector<HTMLElement>('a,button');
      if(interactive) interactive.removeAttribute('tabindex');
    });
    if(heading){heading.style.removeProperty('opacity');heading.style.removeProperty('transform');}
    if(counter)counter.textContent=`01 / ${String(cards.length).padStart(2,'0')}`;
    return;
  }
  schedule();
}
if(section && cards.length){
  configure();
  window.addEventListener('scroll',schedule,{passive:true});
  window.addEventListener('resize',()=>{configure();schedule()},{passive:true});
  motion.addEventListener('change',configure);
  desktop.addEventListener('change',configure);
  // Keyboard focus never gets stranded inside frames that are visually behind.
  section.addEventListener('focusin',event=>{
    if(!active)return;
    const target=event.target as HTMLElement;
    const card=target.closest<HTMLElement>('[data-cinema-card]');
    if(!card)return;
    const index=cards.indexOf(card);
    if(index < 0)return;
    const focusPosition=.18+.82*(index/Math.max(1,cards.length-1));
    const top=section.getBoundingClientRect().top+window.scrollY+focusPosition*(section.offsetHeight-window.innerHeight);
    window.scrollTo({top,behavior:'auto'});
  });
}
