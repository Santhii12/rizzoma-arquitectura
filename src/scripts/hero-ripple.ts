// Lightweight localized water ripple for the homepage only.
// Falls back to the original image when WebGL, cross-origin textures,
// a pointer, or reduced-motion support is unavailable.
const hero = document.querySelector<HTMLElement>('[data-ripple-hero]');
const image = hero?.querySelector<HTMLImageElement>('[data-ripple-image]');
const canvas = hero?.querySelector<HTMLCanvasElement>('[data-ripple-canvas]');
const interactive = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (hero && image && canvas && interactive && !reduced) {
  const gl = canvas.getContext('webgl', { alpha: false, antialias: false, powerPreference: 'low-power' });
  if (gl) {
    const vert = `attribute vec2 position;
    varying vec2 uv;
    void main() {uv = vec2((position.x+1.0)*0.5, 1.0-(position.y+1.0)*0.5);gl_Position=vec4(position,0.,1.);}`;
    const frag = `precision mediump float;
    varying vec2 uv;
    uniform sampler2D tex;
    uniform vec2 resolution;
    uniform vec2 imageSize;
    uniform vec2 pointer;
    uniform float strength;
    uniform float time;
    void main(){
      vec2 p=uv;
      float viewportRatio=resolution.x/resolution.y;
      vec2 delta=vec2((p.x-pointer.x)*viewportRatio,p.y-pointer.y);
      float dist=length(delta);
      float envelope=exp(-dist*dist*28.0);
      float waveA=sin(dist*78.0-time*10.5)*envelope;
      float waveB=sin(dist*46.0-time*7.0)*envelope*0.65;
      float ripple=(waveA+waveB)*strength*0.0095;
      p+=normalize(delta+vec2(0.00001))*ripple/vec2(viewportRatio,1.0);
      float fit=max(resolution.x/imageSize.x,resolution.y/imageSize.y);
      vec2 shown=imageSize*fit;
      vec2 texUV=(p*resolution-(resolution-shown)*0.5)/shown;
      gl_FragColor=texture2D(tex,clamp(texUV,vec2(0.001),vec2(0.999)));
    }`;
    const shader=(type:number,source:string)=>{
      const s=gl.createShader(type);
      if(!s)return null;
      gl.shaderSource(s,source);gl.compileShader(s);
      if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)){gl.deleteShader(s);return null;}
      return s;
    };
    const vs=shader(gl.VERTEX_SHADER,vert);
    const fs=shader(gl.FRAGMENT_SHADER,frag);
    if(vs&&fs){
      const program=gl.createProgram();
      if(program){
        gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);
        if(gl.getProgramParameter(program,gl.LINK_STATUS)){
          const buffer=gl.createBuffer();
          gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
          gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
          gl.useProgram(program);
          const loc=gl.getAttribLocation(program,'position');
          gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);
          const texture=gl.createTexture();
          gl.bindTexture(gl.TEXTURE_2D,texture);
          gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
          gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
          gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
          const resolution=gl.getUniformLocation(program,'resolution');
          const imageSize=gl.getUniformLocation(program,'imageSize');
          const pointer=gl.getUniformLocation(program,'pointer');
          const strength=gl.getUniformLocation(program,'strength');
          const time=gl.getUniformLocation(program,'time');
          let ready=false,frame=0,intensity=0,last=0,active=false;
          let mouseX=0.5,mouseY=0.5,followX=0.5,followY=0.5;
          const resize=()=>{
            const box=hero.getBoundingClientRect();
            const dpr=Math.min(window.devicePixelRatio||1,1.5);
            canvas.width=Math.max(1,Math.round(box.width*dpr));
            canvas.height=Math.max(1,Math.round(box.height*dpr));
            gl.viewport(0,0,canvas.width,canvas.height);
          };
          const render=(now:number)=>{
            frame=0;
            if(!ready)return;
            const dt=Math.min((now-last)||16,48);last=now;
            const damping=1-Math.exp(-dt/90);
            followX+=(mouseX-followX)*damping;
            followY+=(mouseY-followY)*damping;
            intensity+=(Number(active)-intensity)*(1-Math.exp(-dt/(active?180:260)));
            gl.uniform2f(resolution,canvas.width,canvas.height);
            gl.uniform2f(imageSize,image.naturalWidth,image.naturalHeight);
            gl.uniform2f(pointer,followX,followY);
            gl.uniform1f(strength,intensity);
            gl.uniform1f(time,now/1000);
            gl.drawArrays(gl.TRIANGLES,0,6);
            if(intensity>0.005||active) frame=requestAnimationFrame(render);
          };
          const wake=()=>{if(!frame)frame=requestAnimationFrame(render);};
          const loadTexture=()=>{
            // Remote Framer image must support CORS for canvas access.
            const source=new Image();
            source.crossOrigin='anonymous';
            source.onload=()=>{
              try{
                gl.bindTexture(gl.TEXTURE_2D,texture);
                gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,source);
                ready=true;resize();canvas.classList.add('is-ready');wake();
              }catch{canvas.classList.remove('is-ready');}
            };
            source.onerror=()=>{canvas.classList.remove('is-ready');};
            source.src=image.currentSrc||image.src;
          };
          hero.addEventListener('pointermove',event=>{
            const r=hero.getBoundingClientRect();
            mouseX=(event.clientX-r.left)/r.width;
            mouseY=(event.clientY-r.top)/r.height;
            active=true;wake();
          },{passive:true});
          hero.addEventListener('pointerleave',()=>{active=false;wake();});
          window.addEventListener('resize',()=>{if(ready){resize();wake();}},{passive:true});
          document.addEventListener('visibilitychange',()=>{if(document.hidden){active=false;}else wake();});
          if(image.complete&&image.naturalWidth)loadTexture();
          else image.addEventListener('load',loadTexture,{once:true});
        }
      }
    }
  }
}
