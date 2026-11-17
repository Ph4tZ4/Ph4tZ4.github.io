import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Group,
  IcosahedronGeometry,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Points,
  Scene as ThreeScene,
  ShaderMaterial,
  TorusGeometry,
  Vector2,
  Timer,
  WebGLRenderer,
} from 'three';

/** Values tweened by ScrollTrigger; the render loop eases toward them. */
export interface SceneState {
  x: number;
  y: number;
  scale: number;
  hue: number;
  amp: number;
  spin: number;
  dim: number;
}

const NOISE = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;}
vec4 mod289(vec4 x){return x-floor(x*(1./289.))*289.;}
vec4 permute(vec4 x){return mod289(((x*34.)+1.)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1./6.,1./3.);const vec4 D=vec4(0.,.5,1.,2.);
  vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.-g;vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.,i1.z,i2.z,1.))+i.y+vec4(0.,i1.y,i2.y,1.))+i.x+vec4(0.,i1.x,i2.x,1.));
  float n_=.142857142857;vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.*floor(p*ns.z*ns.z);vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.*x_);
  vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.+1.;vec4 s1=floor(b1)*2.+1.;vec4 sh=-step(h,vec4(0.));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);m=m*m;
  return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}`;

const ORB_VERTEX = /* glsl */ `
uniform float uTime;
uniform float uAmp;
uniform vec2 uMouse;
varying vec3 vNormal;
varying vec3 vView;
varying float vDisp;
${NOISE}
void main(){
  vec3 p=position;
  float slow=snoise(p*.75+vec3(uTime*.12));
  float fine=snoise(p*1.9+vec3(0.,uTime*.22,0.))*.18;
  float pull=dot(normalize(p),normalize(vec3(uMouse,.8)))*.5+.5;
  float d=(slow+fine)*uAmp*(.75+pull*.5);
  vDisp=d;
  p+=normal*d;
  vec4 mv=modelViewMatrix*vec4(p,1.);
  vNormal=normalize(normalMatrix*normal);
  vView=normalize(-mv.xyz);
  gl_Position=projectionMatrix*mv;
}`;

const ORB_FRAGMENT = /* glsl */ `
uniform float uTime;
uniform float uHue;
uniform float uDim;
varying vec3 vNormal;
varying vec3 vView;
varying float vDisp;
// Brand palette loop: violet -> teal -> gold -> ember -> violet
vec3 pal(float t){
  t=fract(t+uHue)*4.;
  vec3 c1=vec3(.6,.48,1.);vec3 c2=vec3(.37,.92,.83);vec3 c3=vec3(.96,.78,.42);vec3 c4=vec3(1.,.54,.36);
  if(t<1.)return mix(c1,c2,smoothstep(0.,1.,t));
  if(t<2.)return mix(c2,c3,smoothstep(1.,2.,t));
  if(t<3.)return mix(c3,c4,smoothstep(2.,3.,t));
  return mix(c4,c1,smoothstep(3.,4.,t));
}
void main(){
  float fres=pow(1.-max(dot(vNormal,vView),0.),2.4);
  vec3 irid=pal(vDisp*1.2+fres*.45+uTime*.025);
  vec3 deep=vec3(.02,.01,.06);
  float bands=sin(vDisp*48.+uTime*.6)*.5+.5;
  vec3 col=mix(deep,irid,.18+fres*.8);
  col+=irid*bands*.06;
  col+=vec3(1.,.86,.62)*pow(fres,6.)*.45;
  gl_FragColor=vec4(col*uDim,1.);
}`;

const STAR_VERTEX = /* glsl */ `
uniform float uTime;
uniform float uPixel;
attribute float aSeed;
varying float vAlpha;
void main(){
  vec3 p=position;
  float a=uTime*.02*(.5+aSeed);
  p.xz=mat2(cos(a),-sin(a),sin(a),cos(a))*p.xz;
  vec4 mv=modelViewMatrix*vec4(p,1.);
  gl_PointSize=(1.2+aSeed*2.6)*uPixel*(8./-mv.z);
  vAlpha=.35+.65*(sin(uTime*(1.+aSeed*2.)+aSeed*40.)*.5+.5);
  gl_Position=projectionMatrix*mv;
}`;

const STAR_FRAGMENT = /* glsl */ `
uniform float uDim;
varying float vAlpha;
void main(){
  float d=length(gl_PointCoord-.5);
  float a=smoothstep(.5,0.,d);
  gl_FragColor=vec4(vec3(1.,.93,.82)*a*vAlpha*uDim,a*vAlpha);
}`;

export interface Scene {
  state: SceneState;
  destroy(): void;
}

export function createScene(canvas: HTMLCanvasElement, opts: { reducedMotion: boolean }): Scene | null {
  let renderer: WebGLRenderer;
  try {
    renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  } catch {
    return null; // WebGL unavailable — CSS gradient backdrop still shows.
  }

  const isSmall = window.innerWidth < 768;
  const dpr = Math.min(window.devicePixelRatio, isSmall ? 1.5 : 2);
  renderer.setPixelRatio(dpr);
  renderer.setSize(window.innerWidth, window.innerHeight, false);
  renderer.setClearColor(0x000000, 0);

  const scene = new ThreeScene();
  const camera = new PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 0, 6);

  const group = new Group();
  scene.add(group);

  // --- Orb
  const uniforms = {
    uTime: { value: 0 },
    uAmp: { value: 0.26 },
    uHue: { value: 0 },
    uDim: { value: 1 },
    uMouse: { value: new Vector2(0, 0) },
  };
  const orb = new Mesh(
    new IcosahedronGeometry(1.25, isSmall ? 28 : 56),
    new ShaderMaterial({ vertexShader: ORB_VERTEX, fragmentShader: ORB_FRAGMENT, uniforms }),
  );
  group.add(orb);

  // --- Rings
  const ringMat = (color: number, opacity: number) =>
    new MeshBasicMaterial({ color, transparent: true, opacity, blending: AdditiveBlending, depthWrite: false });
  const ringA = new Mesh(new TorusGeometry(2.15, 0.006, 8, 256), ringMat(0xf5c76a, 0.75));
  const ringB = new Mesh(new TorusGeometry(2.6, 0.003, 8, 256), ringMat(0x9a7bff, 0.6));
  const ringC = new Mesh(new TorusGeometry(3.2, 0.002, 8, 256), ringMat(0x5eead4, 0.35));
  ringA.rotation.set(1.2, 0.2, 0);
  ringB.rotation.set(1.0, -0.5, 0.3);
  ringC.rotation.set(1.45, 0.3, -0.2);
  group.add(ringA, ringB, ringC);

  // --- Starfield
  const STAR_COUNT = isSmall ? 1200 : 2600;
  const positions = new Float32Array(STAR_COUNT * 3);
  const seeds = new Float32Array(STAR_COUNT);
  for (let i = 0; i < STAR_COUNT; i++) {
    const r = 3.5 + Math.random() * 14;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.6;
    positions[i * 3 + 2] = r * Math.cos(phi) - 4;
    seeds[i] = Math.random();
  }
  const starGeo = new BufferGeometry();
  starGeo.setAttribute('position', new BufferAttribute(positions, 3));
  starGeo.setAttribute('aSeed', new BufferAttribute(seeds, 1));
  const starUniforms = { uTime: uniforms.uTime, uDim: uniforms.uDim, uPixel: { value: dpr } };
  const stars = new Points(
    starGeo,
    new ShaderMaterial({
      vertexShader: STAR_VERTEX,
      fragmentShader: STAR_FRAGMENT,
      uniforms: starUniforms,
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
    }),
  );
  scene.add(stars);

  // --- State
  const state: SceneState = { x: 2.1, y: -0.1, scale: 0.95, hue: 0, amp: 0.26, spin: 0, dim: 0.9 };
  const live = { ...state };
  const mouse = new Vector2();
  const mouseTarget = new Vector2();

  const onPointer = (e: PointerEvent) => {
    mouseTarget.set((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1);
  };
  const onResize = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    camera.aspect = w / h;
    // Keep the orb comfortably framed on portrait screens.
    camera.position.z = w / h < 0.8 ? 8.5 : 6;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  };
  onResize();
  window.addEventListener('pointermove', onPointer, { passive: true });
  window.addEventListener('resize', onResize);

  const timer = new Timer();
  const speed = opts.reducedMotion ? 0.15 : 1;
  let raf = 0;
  let running = true;

  const tick = (now?: number) => {
    raf = requestAnimationFrame(tick);
    timer.update(now);
    const dt = Math.min(timer.getDelta(), 0.05);
    const t = (uniforms.uTime.value += dt * speed);
    const k = 1 - Math.pow(0.0025, dt); // frame-rate independent ease

    (Object.keys(state) as (keyof SceneState)[]).forEach((key) => {
      live[key] += (state[key] - live[key]) * k;
    });
    mouse.lerp(mouseTarget, k * 0.6);

    uniforms.uAmp.value = live.amp;
    uniforms.uHue.value = live.hue;
    uniforms.uDim.value = live.dim;
    uniforms.uMouse.value.copy(mouse);

    group.position.set(live.x + mouse.x * 0.15, live.y + mouse.y * 0.1, 0);
    group.scale.setScalar(live.scale);
    orb.rotation.y = t * 0.12 + live.spin;
    orb.rotation.x = Math.sin(t * 0.2) * 0.2 + mouse.y * 0.25;
    ringA.rotation.z = t * 0.18 + live.spin * 0.5;
    ringB.rotation.z = -t * 0.12 - live.spin * 0.3;
    ringC.rotation.z = t * 0.06;
    stars.rotation.x = mouse.y * 0.05;
    stars.rotation.y = mouse.x * 0.08 + live.spin * 0.1;

    renderer.render(scene, camera);
  };
  tick();

  const onVisibility = () => {
    if (document.hidden && running) {
      cancelAnimationFrame(raf);
      running = false;
    } else if (!document.hidden && !running) {
      running = true;
      timer.reset();
      tick();
    }
  };
  document.addEventListener('visibilitychange', onVisibility);

  return {
    state,
    destroy() {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onPointer);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
      renderer.dispose();
    },
  };
}
