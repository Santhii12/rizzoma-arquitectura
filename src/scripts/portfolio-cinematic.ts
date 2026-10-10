// A vertical film strip controlled entirely by native page scroll.
// The section supplies scroll distance; its central composition stays sticky.
const section = document.querySelector<HTMLElement>('[data-cinema-scroll]');
const cards = Array.from(section?.querySelectorAll<HTMLElement>('[data-cinema-card]') ?? []);
const counter = section?.querySelector<HTMLElement>('[data-cinema-counter]');
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
const desktop = matchMedia('(min-width: 901px)');
const clamp = (n:number,min=0,max=1)=>Math.min(max,Math.max(min,n));
let active=false;
let frame=0;
let currentIndex=-1;

function paint(){
  frame=0;
  if(!section||!active)return;
  const area=section.getBoundingClientRect();
  const distance=Math.max(1,section.offsetHeight-innerHeight);
  const position=clamp(-area.top/distance);
  const focus=position*(cards.length-1);
  const closest=Math.round(focus);
  // Frame spacing follows the physical card height, not the viewport.
  // Neighboring frames shrink enough to retain a small, consistent film-strip gap.
  const cardHeight=cards[0]?.offsetHeight || 500;
  const frameSpacing=cardHeight*.84 + 18;
  cards.forEach((card,index)=>{
    const delta=index-focus;
    const magnitude=Math.abs(delta);
    const y=delta*frameSpacing;
    const scale=clamp(1-magnitude*.34,.38,1);
    const opacity=clamp(1-magnitude*.27,.18,1);
    card.style.transform=`translate3d(-50%,calc(-50% + ${y.toFixed(1)}px),0) scale(${scale.toFixed(3)})`;
    card.style.opacity=String(opacity);
    card.style.zIndex=String(100-Math.round(magnitude*10));
    const isCurrent=index===closest;
    card.classList.toggle('is-active',isCurrent);
    const link=card.querySelector<HTMLElement>('a,button');
    if(link)link.tabIndex=isCurrent?0:-1;
  });
  if(closest!==currentIndex){
    currentIndex=closest;
    if(counter)counter.textContent=`${String(closest+1).padStart(2,'0')} / ${String(cards.length).padStart(2,'0')}`;
  }
}
function draw(){if(active&&!frame)frame=requestAnimationFrame(paint)}
function setup(){
  if(!section)return;
  active=desktop.matches&&!reduceMotion.matches&&cards.length>1;
  section.classList.toggle('is-cinematic',active);
  section.style.setProperty('--rz-count',String(cards.length));
  if(!active){
    if(frame)cancelAnimationFrame(frame);
    frame=0;
    cards.forEach(card=>{
      card.style.removeProperty('transform');
      card.style.removeProperty('opacity');
      card.style.removeProperty('z-index');
      card.classList.remove('is-active');
      card.querySelector<HTMLElement>('a,button')?.removeAttribute('tabindex');
    });
    currentIndex=-1;
  }else draw();
}
if(section&&cards.length){
  setup();
  addEventListener('scroll',draw,{passive:true});
  addEventListener('resize',()=>{setup();draw()},{passive:true});
  desktop.addEventListener('change',setup);
  reduceMotion.addEventListener('change',setup);
}
