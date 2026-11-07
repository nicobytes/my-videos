/* Reel v3: Three.js builders shared by the two WebGL layers (scene-base.html, scene-top.html).
 * The camera and every value come from window.Reel (view.js): this file only turns them into meshes.
 * GL space is (x, -y, z) in canvas px.
 */
import * as THREE from "three";
import { SVGLoader } from "three/addons/loaders/SVGLoader.js";

const R = window.Reel;

export function makeRenderer(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(1);
  renderer.setSize(R.W, R.H, false);
  renderer.setClearColor(0x000000, 0);
  return renderer;
}

// A camera that never computes anything itself: it wears view.js's matrices.
export function makeCamera() {
  const camera = new THREE.PerspectiveCamera();
  camera.matrixAutoUpdate = false;
  camera.matrixWorldAutoUpdate = false;
  return camera;
}
export function applyView(camera, t) {
  const c = R.camera3(t);
  camera.projectionMatrix.fromArray(c.proj);
  camera.projectionMatrixInverse.copy(camera.projectionMatrix).invert();
  camera.matrixWorldInverse.fromArray(c.view);
  camera.matrixWorld.copy(camera.matrixWorldInverse).invert();
  camera.matrix.copy(camera.matrixWorld);
}

// Everything that rides on the slab (the slab, the pill, their shadows on it) lives in this group.
export function makeSlabGroup(scene) {
  const group = new THREE.Group();
  group.matrixAutoUpdate = false;
  scene.add(group);
  return group;
}
export function applyTilt(group, t) {
  group.matrix.fromArray(R.camera3(t).tilt);
  group.matrixWorldNeedsUpdate = true;
}

export function addLights(scene) {
  const L = R.LIGHT;
  const key = new THREE.DirectionalLight(0xffffff, 1.6);
  key.position.set(L[0] * 1000, L[1] * 1000, L[2] * 1000);
  key.target.position.set(0, 0, 0);
  scene.add(key, key.target);
  // Fill standing in for the room's bounce light: warm cream from above, the brand green from below.
  scene.add(new THREE.HemisphereLight(0xfffdf7, 0xc9d8cf, 1.4));
}

// Rounded rectangle in canvas px (y down), as a GL shape (y up).
export function roundedRect(g) {
  const x0 = g.l;
  const x1 = g.r;
  const y0 = -g.b;
  const y1 = -g.t;
  const r = Math.max(0, Math.min(g.rad, (x1 - x0) / 2 - 0.01, (y1 - y0) / 2 - 0.01));
  const s = new THREE.Shape();
  if (r < 0.5) {
    s.moveTo(x0, y0);
    s.lineTo(x1, y0);
    s.lineTo(x1, y1);
    s.lineTo(x0, y1);
    s.closePath();
    return s;
  }
  s.moveTo(x0 + r, y0);
  s.lineTo(x1 - r, y0);
  s.absarc(x1 - r, y0 + r, r, -Math.PI / 2, 0, false);
  s.lineTo(x1, y1 - r);
  s.absarc(x1 - r, y1 - r, r, 0, Math.PI / 2, false);
  s.lineTo(x0 + r, y1);
  s.absarc(x0 + r, y1 - r, r, Math.PI / 2, Math.PI, false);
  s.lineTo(x0, y0 + r);
  s.absarc(x0 + r, y0 + r, r, Math.PI, Math.PI * 1.5, false);
  return s;
}

// A body with real thickness: top cap in the exact brand colour (unlit), sides lit.
// Its outline is the rect; the bevel rounds the top edge inwards, so the cap is the rect inset by `bevel`.
// With a bevel of half its depth on a circle, the body is a ball.
export class Body {
  constructor(parent, depth, bevel) {
    this.depth = depth;
    this.bevel = bevel;
    this.cap = new THREE.MeshBasicMaterial({ color: 0xffffff });
    this.side = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.82, metalness: 0 });
    this.mesh = new THREE.Mesh(new THREE.BufferGeometry(), [this.cap, this.side]);
    this.mesh.matrixAutoUpdate = false;
    parent.add(this.mesh);
  }
  // o: { depth, bevel, model, litCap } (model: a GL world matrix from view.js, e.g. the coin's flip;
  // litCap: a ball has no flat face, so its top takes the light like its sides).
  update(g, base, capColor, sideColor, o = {}) {
    this.mesh.material[0] = o.litCap ? this.side : this.cap;
    const depth = o.depth ?? this.depth;
    const bevel = Math.min(o.bevel ?? this.bevel, depth * 0.49);
    const round = bevel > 8;
    this.mesh.geometry.dispose();
    this.mesh.geometry = new THREE.ExtrudeGeometry(roundedRect(g), {
      depth: Math.max(0.01, depth - 2 * bevel),
      bevelEnabled: true,
      bevelThickness: bevel,
      bevelSize: bevel,
      bevelOffset: -bevel,
      bevelSegments: round ? 10 : 3,
      curveSegments: round ? 24 : 16,
    });
    const raise = new THREE.Matrix4().makeTranslation(0, 0, base + bevel);
    this.mesh.matrix.copy(o.model ? new THREE.Matrix4().fromArray(o.model).multiply(raise) : raise);
    this.mesh.matrixWorldNeedsUpdate = true;
    this.cap.color.setStyle(capColor);
    this.side.color.setStyle(sideColor);
  }
}

// The disc's rim as a clock: the side is inked from 12 o'clock clockwise over `frac` of the turn (state 4).
export function rimClock(material) {
  const u = {
    uRimOn: { value: 0 },
    uRimC: { value: new THREE.Vector2() },
    uRimFrac: { value: 1 },
    uRimInk: { value: new THREE.Color("#2C2C2A") },
  };
  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, u);
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", "#include <common>\nvarying vec3 vRimP;")
      .replace("#include <begin_vertex>", "#include <begin_vertex>\nvRimP = position;");
    shader.fragmentShader = shader.fragmentShader
      .replace("#include <common>", "#include <common>\nvarying vec3 vRimP;\nuniform float uRimOn; uniform vec2 uRimC; uniform float uRimFrac; uniform vec3 uRimInk;")
      .replace(
        "vec4 diffuseColor = vec4( diffuse, opacity );",
        `vec4 diffuseColor = vec4( diffuse, opacity );
        {
          vec2 d = vRimP.xy - uRimC;
          float a = atan(d.x, d.y);
          if (a < 0.0) a += 6.28318530718;
          float end = uRimFrac * 6.28318530718;
          float ink = 1.0 - smoothstep(end - 0.015, end + 0.015, a);
          diffuseColor.rgb = mix(diffuseColor.rgb, uRimInk, ink * uRimOn);
        }`,
      );
  };
  material.customProgramCacheKey = () => "rim-clock";
  return u;
}

// The Parlana mark in relief: the bubble's outline extruded (its face stays the crisp HTML logo on top).
// Paths from assets/brand/parlana-logo.svg (viewBox 50 65 230 220): the bubble and its tail.
const LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="50 65 230 220">
<path d="M159.733 71.0696C216.213 68.8381 263.812 112.806 266.06 169.284C268.31 225.763 224.356 273.376 167.878 275.641C111.376 277.908 63.7383 233.932 61.4888 177.429C59.2391 120.926 103.23 73.3021 159.733 71.0696Z" fill="#155B3F"/>
<path d="M57.6803 271.356L126.322 187.953L165.605 275.833L57.6803 271.356Z" fill="#155B3F"/>
</svg>`;
export class LogoRelief {
  // box: where the HTML logo sits on the slab (canvas px): { l, t, w }.
  constructor(parent, box) {
    const s = box.w / 230;
    this.cx = box.l + box.w / 2;
    this.cy = box.t + (220 * s) / 2;
    const side = new THREE.MeshStandardMaterial({ color: "#155B3F", roughness: 0.7, metalness: 0, side: THREE.DoubleSide });
    this.group = new THREE.Group();
    this.group.matrixAutoUpdate = false;
    const inner = new THREE.Group(); // SVG units → canvas px → GL (y flipped)
    inner.matrixAutoUpdate = false;
    inner.matrix.makeTranslation(box.l - 50 * s, -(box.t - 65 * s), 0).multiply(new THREE.Matrix4().makeScale(s, -s, 1));
    new SVGLoader().parse(LOGO_SVG).paths.forEach((path) => {
      SVGLoader.createShapes(path).forEach((shape) => {
        const geo = new THREE.ExtrudeGeometry(shape, { depth: 1, bevelEnabled: false, curveSegments: 24 });
        inner.add(new THREE.Mesh(geo, side));
      });
    });
    this.group.add(inner);
    parent.add(this.group);
  }
  // h: height above the slab top (px); k: the HTML logo's pop scale, about the logo's centre.
  update(h, k) {
    this.group.visible = h > 0.3;
    const c = new THREE.Vector3(this.cx, -this.cy, R.SLAB_TOP);
    this.group.matrix
      .makeTranslation(c.x, c.y, c.z)
      .multiply(new THREE.Matrix4().makeScale(k, k, Math.max(h, 0.001)))
      .multiply(new THREE.Matrix4().makeTranslation(-c.x, -c.y, 0));
    this.group.matrixWorldNeedsUpdate = true;
  }
}

// A soft shadow: the rounded-rect distance field of its caster, blurred, on a receiver plane at height z.
// Optionally kept inside a receiver shape (a shadow on the slab's top stays on the slab).
const SHADOW_VS = `
varying vec2 vP;
void main() {
  vP = position.xy;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;
const SHADOW_FS = `
uniform vec2 uC; uniform vec2 uH; uniform float uR; uniform float uBlur; uniform float uAlpha; uniform vec3 uColor;
uniform vec2 uKC; uniform vec2 uKH; uniform float uKR; uniform float uK;
varying vec2 vP;
float sdBox(vec2 p, vec2 h, float r) { vec2 q = abs(p) - h + r; return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r; }
void main() {
  float d = sdBox(vP - uC, uH, uR);
  float a = uAlpha * (1.0 - smoothstep(-uBlur * 0.6, uBlur, d));
  if (uK > 0.5) a *= 1.0 - smoothstep(-0.75, 0.75, sdBox(vP - uKC, uKH, uKR));
  gl_FragColor = vec4(uColor, a);
  #include <colorspace_fragment>
}`;
const SHADOW_INK = new THREE.Color("#155B3F");

export class SoftShadow {
  constructor(parent, z) {
    this.uniforms = {
      uC: { value: new THREE.Vector2() },
      uH: { value: new THREE.Vector2() },
      uR: { value: 0 },
      uBlur: { value: 10 },
      uAlpha: { value: 0 },
      uColor: { value: SHADOW_INK },
      uKC: { value: new THREE.Vector2() },
      uKH: { value: new THREE.Vector2() },
      uKR: { value: 0 },
      uK: { value: 0 },
    };
    const mat = new THREE.ShaderMaterial({ uniforms: this.uniforms, vertexShader: SHADOW_VS, fragmentShader: SHADOW_FS, transparent: true, depthWrite: false });
    // One plane over the whole stage (with margin); the shader draws only the shadow.
    const plane = new THREE.PlaneGeometry(R.W + 1200, R.H + 1200);
    plane.translate(R.W / 2, -R.H / 2, 0);
    this.mesh = new THREE.Mesh(plane, mat);
    this.mesh.position.z = z;
    this.mesh.renderOrder = 1;
    parent.add(this.mesh);
  }
  // g: caster rect (canvas px); s: R.shadowOf(height) or an explicit { dx, dy, blur, alpha }; keep: receiver rect.
  update(g, s, keep) {
    const u = this.uniforms;
    u.uC.value.set((g.l + g.r) / 2 + s.dx, -((g.t + g.b) / 2 + s.dy));
    u.uH.value.set((g.r - g.l) / 2, (g.b - g.t) / 2);
    u.uR.value = Math.min(g.rad, (g.r - g.l) / 2, (g.b - g.t) / 2);
    u.uBlur.value = s.blur;
    u.uAlpha.value = s.alpha;
    u.uK.value = keep ? 1 : 0;
    if (keep) {
      u.uKC.value.set((keep.l + keep.r) / 2, -(keep.t + keep.b) / 2);
      u.uKH.value.set((keep.r - keep.l) / 2, (keep.b - keep.t) / 2);
      u.uKR.value = Math.min(keep.rad, (keep.r - keep.l) / 2, (keep.b - keep.t) / 2);
    }
  }
}

export function inset(g, d) {
  return { l: g.l + d, r: g.r - d, t: g.t + d, b: g.b - d, rad: Math.max(0, g.rad - d) };
}

// Mount a full-length WebGL layer on the reel's clock (and on the adapter's seek, for good measure).
export function mount(id, render) {
  window.__timelines[id] = R.mountFull(render);
  window.addEventListener("hf-seek", (e) => render(e.detail.time));
}
