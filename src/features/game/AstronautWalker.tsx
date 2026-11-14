import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { type HeritageObject, type Planet } from "@/lib/missionData";

// ─────────────────────────────────────────────────────────────────
// CONFIG (tuned for Moon vs Mars)
// ─────────────────────────────────────────────────────────────────
export interface WalkerConfig {
  gravity: number; // m/s² (1.62 for Moon, 3.72 for Mars)
  walkSpeed: number;
  runSpeed: number;
  thrustAccel: number;
  maxClimb: number;
  radius: number;
  footLife: number;
}

export const DEFAULT_MARS_CFG: WalkerConfig = {
  gravity: 3.72,
  walkSpeed: 3.2,
  runSpeed: 6.8,
  thrustAccel: 9.0,
  maxClimb: 5.5,
  radius: 0.28,
  footLife: 40,
};

export const DEFAULT_MOON_CFG: WalkerConfig = {
  gravity: 1.62,
  walkSpeed: 3.4,
  runSpeed: 7.2,
  thrustAccel: 7.5,
  maxClimb: 6.2,
  radius: 0.28,
  footLife: 50,
};

// ─────────────────────────────────────────────────────────────────
// UTILS
// ─────────────────────────────────────────────────────────────────
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const damp = (cur: number, tgt: number, lambda: number, dt: number) =>
  lerp(cur, tgt, 1 - Math.exp(-lambda * dt));

export function dampAngle(cur: number, tgt: number, lambda: number, dt: number) {
  const d = ((((tgt - cur) % (Math.PI * 2)) + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
  return cur + d * (1 - Math.exp(-lambda * dt));
}

const UP = new THREE.Vector3(0, 1, 0);

// ─────────────────────────────────────────────────────────────────
// INPUT HANDLER
// ─────────────────────────────────────────────────────────────────
class InputHandler {
  private _keys = new Set<string>();
  public drag = { dx: 0, dy: 0 };
  public wheel = 0;
  private _mouse = { down: false, x: 0, y: 0 };
  private canvas: HTMLElement;

  private _onKey = (e: KeyboardEvent) => {
    // Prevent scrolling when pressing Space / Arrow keys in game
    if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.code)) {
      e.preventDefault();
    }
    this._keys[e.type === "keydown" ? "add" : "delete"](e.code);
  };

  private _onDown = (e: MouseEvent) => {
    this._mouse = { down: true, x: e.clientX, y: e.clientY };
  };

  private _onMove = (e: MouseEvent) => {
    if (!this._mouse.down) return;
    this.drag.dx += e.clientX - this._mouse.x;
    this.drag.dy += e.clientY - this._mouse.y;
    this._mouse.x = e.clientX;
    this._mouse.y = e.clientY;
  };

  private _onUp = () => {
    this._mouse.down = false;
  };

  private _onWheel = (e: WheelEvent) => {
    this.wheel += e.deltaY;
  };

  // Touch support for mobile
  private _touchStart = { x: 0, y: 0 };
  private _onTouchStart = (e: TouchEvent) => {
    const t = e.touches[0];
    if (t) {
      this._touchStart = { x: t.clientX, y: t.clientY };
    }
  };
  private _onTouchMove = (e: TouchEvent) => {
    const t = e.touches[0];
    if (t) {
      const dx = t.clientX - this._touchStart.x;
      const dy = t.clientY - this._touchStart.y;
      this.drag.dx += dx * 1.5;
      this.drag.dy += dy * 1.5;
      this._touchStart = { x: t.clientX, y: t.clientY };
    }
  };

  constructor(canvas: HTMLElement) {
    this.canvas = canvas;
    window.addEventListener("keydown", this._onKey, { passive: false });
    window.addEventListener("keyup", this._onKey, { passive: false });
    canvas.addEventListener("mousedown", this._onDown);
    canvas.addEventListener("mousemove", this._onMove);
    window.addEventListener("mouseup", this._onUp);
    canvas.addEventListener("wheel", this._onWheel, { passive: true });
    canvas.addEventListener("touchstart", this._onTouchStart, { passive: true });
    canvas.addEventListener("touchmove", this._onTouchMove, { passive: true });
  }

  down(code: string) {
    return this._keys.has(code);
  }

  axis() {
    let x = 0;
    let y = 0;
    if (this.down("KeyA") || this.down("ArrowLeft")) x -= 1;
    if (this.down("KeyD") || this.down("ArrowRight")) x += 1;
    if (this.down("KeyW") || this.down("ArrowUp")) y += 1;
    if (this.down("KeyS") || this.down("ArrowDown")) y -= 1;
    const l = Math.hypot(x, y) || 1;
    return { x: x / l, y: y / l };
  }

  flush() {
    this.drag.dx = 0;
    this.drag.dy = 0;
    this.wheel = 0;
  }

  dispose() {
    window.removeEventListener("keydown", this._onKey);
    window.removeEventListener("keyup", this._onKey);
    window.removeEventListener("mouseup", this._onUp);
    this.canvas.removeEventListener("mousedown", this._onDown);
    this.canvas.removeEventListener("mousemove", this._onMove);
    this.canvas.removeEventListener("wheel", this._onWheel);
    this.canvas.removeEventListener("touchstart", this._onTouchStart);
    this.canvas.removeEventListener("touchmove", this._onTouchMove);
  }
}

// ─────────────────────────────────────────────────────────────────
// PROCEDURAL EXOSUIT BODY
// ─────────────────────────────────────────────────────────────────
export class Exosuit {
  public root: THREE.Group;
  public hips: THREE.Group;
  public torso: THREE.Group;
  public head: THREE.Group;
  public tip: THREE.Mesh;
  public flames: THREE.Group[] = [];
  public thrustLight: THREE.PointLight;
  public aura: THREE.PointLight;
  public lamp: THREE.SpotLight;
  public arms: Array<{ sh: THREE.Group; el: THREE.Group; side: number; scannerTip?: THREE.Group }> =
    [];
  public legs: Array<{ th: THREE.Group; kn: THREE.Group; an: THREE.Group; side: number }> = [];

  public mat: {
    armor: THREE.Material;
    armor2: THREE.Material;
    under: THREE.Material;
    accent: THREE.Material;
    metal: THREE.Material;
    visor: THREE.Material;
    glow: THREE.Material;
    lamp: THREE.Material;
    status: THREE.Material;
    tip: THREE.Material;
  };
  public phase = 0;
  public amp = 0;
  public run = 0;
  public air = 0;
  public land = 0;
  public thr = 0;
  public t = 0;
  public lampOn = true;
  public lampK = 1;
  public events: any[] = [];

  constructor(scene: THREE.Object3D, envMap: THREE.Texture | null) {
    const M = THREE.MeshStandardMaterial;
    this.mat = {
      armor: new M({ color: 0xe4ded4, roughness: 0.5, metalness: 0.08, envMap }),
      armor2: new M({ color: 0xb4ada2, roughness: 0.6, metalness: 0.12, envMap }),
      under: new M({ color: 0x2c2724, roughness: 0.85 }),
      accent: new M({ color: 0xff6a2a, roughness: 0.45 }),
      metal: new M({ color: 0x8e939a, roughness: 0.3, metalness: 0.9, envMap }),
      visor: new THREE.MeshPhysicalMaterial({
        color: 0xffbf6a,
        metalness: 1,
        roughness: 0.07,
        clearcoat: 1,
        clearcoatRoughness: 0.04,
        emissive: new THREE.Color(0x0b2630),
        envMap,
        envMapIntensity: 1.6,
      }),
      glow: new M({
        color: 0x000000,
        emissive: new THREE.Color(0x66eaff),
        emissiveIntensity: 1.6,
      }),
      lamp: new M({
        color: 0x000000,
        emissive: new THREE.Color(0xfff1d6),
        emissiveIntensity: 0.4,
      }),
      status: new M({
        color: 0x000000,
        emissive: new THREE.Color(0x3dff7a),
        emissiveIntensity: 2,
      }),
      tip: new M({
        color: 0x000000,
        emissive: new THREE.Color(0xff2a10),
        emissiveIntensity: 2,
      }),
    };

    const rb = (w: number, h: number, d: number) => new THREE.BoxGeometry(w, h, d);
    const G = (parent: THREE.Object3D, x = 0, y = 0, z = 0) => {
      const g = new THREE.Group();
      g.position.set(x, y, z);
      parent.add(g);
      return g;
    };
    const mesh = (
      parent: THREE.Object3D,
      geo: THREE.BufferGeometry,
      mat: THREE.Material,
      x = 0,
      y = 0,
      z = 0,
      cast = true,
    ) => {
      const m = new THREE.Mesh(geo, mat);
      m.position.set(x, y, z);
      m.castShadow = cast;
      m.receiveShadow = true;
      parent.add(m);
      return m;
    };

    const root = (this.root = new THREE.Group());
    scene.add(root);
    const body = G(root);
    body.scale.setScalar(0.94);

    // Hips
    const hips = (this.hips = G(body, 0, 1.1, 0));
    mesh(hips, rb(0.46, 0.22, 0.3), this.mat.armor2);
    mesh(hips, rb(0.5, 0.06, 0.33), this.mat.accent, 0, 0.1, 0);

    // Torso
    const torso = (this.torso = G(hips, 0, 0.12, 0));
    mesh(torso, new THREE.CylinderGeometry(0.17, 0.2, 0.24, 12), this.mat.under, 0, 0.1, 0);
    mesh(torso, rb(0.64, 0.46, 0.42), this.mat.armor, 0, 0.42, 0);
    mesh(torso, rb(0.52, 0.1, 0.06), this.mat.accent, 0, 0.5, 0.21);
    mesh(torso, rb(0.13, 0.035, 0.02), this.mat.glow, -0.15, 0.33, 0.215, false);
    mesh(torso, rb(0.06, 0.035, 0.02), this.mat.status, 0.17, 0.33, 0.215, false);

    const neckRing = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.045, 8, 22), this.mat.metal);
    neckRing.rotation.x = Math.PI / 2;
    neckRing.position.set(0, 0.66, 0);
    torso.add(neckRing);

    // Life-support pack (backpack)
    const pack = G(torso, 0, 0.44, -0.3);
    mesh(pack, rb(0.58, 0.64, 0.26), this.mat.armor2);
    mesh(pack, rb(0.36, 0.05, 0.02), this.mat.glow, 0, 0.18, -0.135, false);
    mesh(
      pack,
      new THREE.CylinderGeometry(0.012, 0.012, 0.5, 6),
      this.mat.metal,
      0.22,
      0.52,
      -0.05,
    );
    this.tip = mesh(
      pack,
      new THREE.SphereGeometry(0.026, 8, 6),
      this.mat.tip,
      0.22,
      0.78,
      -0.05,
      false,
    );

    const flameMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(0xff8a3a).multiplyScalar(3),
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const coreMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(0xbfeaff).multiplyScalar(4),
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const coneGeo = (r: number, h: number) => {
      const g = new THREE.ConeGeometry(r, h, 12, 1, true);
      g.rotateX(Math.PI);
      g.translate(0, -h / 2, 0);
      return g;
    };
    for (const sx of [-1, 1]) {
      mesh(
        pack,
        new THREE.CylinderGeometry(0.075, 0.075, 0.52, 12),
        this.mat.metal,
        sx * 0.17,
        0,
        -0.15,
      );
      mesh(
        pack,
        new THREE.CylinderGeometry(0.05, 0.085, 0.12, 12, 1, true),
        this.mat.under,
        sx * 0.17,
        -0.38,
        -0.05,
      );
      const f = G(pack, sx * 0.17, -0.44, -0.05);
      f.add(new THREE.Mesh(coneGeo(0.08, 0.75), flameMat));
      f.add(new THREE.Mesh(coneGeo(0.04, 0.38), coreMat));
      f.scale.set(1, 0.001, 1);
      f.visible = false;
      this.flames.push(f);
    }
    this.thrustLight = new THREE.PointLight(0xff8a3a, 0, 9, 2);
    this.thrustLight.position.set(0, -0.8, -0.05);
    pack.add(this.thrustLight);

    this.aura = new THREE.PointLight(0xbfdfff, 0.4, 8, 2);
    this.aura.position.set(0, 1.9, 0.6);
    root.add(this.aura);

    // Helmet
    const head = (this.head = G(torso, 0, 0.74, 0.02));
    const shell = mesh(
      head,
      new THREE.SphereGeometry(0.245, 28, 20),
      this.mat.armor,
      0,
      0.12,
      0,
    );
    shell.scale.set(1, 1.02, 1.06);

    const visor = mesh(
      head,
      new THREE.SphereGeometry(0.253, 28, 16, Math.PI / 2 - 0.95, 1.9, 0.62, 1.12),
      this.mat.visor,
      0,
      0.12,
      0.012,
    );
    visor.scale.set(1, 1.02, 1.06);

    for (const sx of [-1, 1]) {
      mesh(head, rb(0.07, 0.15, 0.15), this.mat.armor2, sx * 0.25, 0.1, -0.01);
    }
    mesh(head, rb(0.08, 0.06, 0.26), this.mat.accent, 0, 0.37, -0.02);

    const lampCyl = mesh(
      head,
      new THREE.CylinderGeometry(0.035, 0.04, 0.12, 12),
      this.mat.metal,
      -0.27,
      0.2,
      0.05,
    );
    lampCyl.rotation.x = Math.PI / 2;
    mesh(head, new THREE.CircleGeometry(0.032, 16), this.mat.lamp, -0.27, 0.2, 0.111, false);

    const lamp = (this.lamp = new THREE.SpotLight(0xffeedd, 0.8, 14, 0.6, 0.6, 1.8));
    lamp.position.set(-0.27, 0.2, 0.13);
    lamp.target.position.set(-0.15, -0.9, 6);
    head.add(lamp, lamp.target);

    // Arms
    for (const sd of [1, -1]) {
      const sh = G(torso, sd * 0.38, 0.56, 0);
      const shMesh = mesh(sh, rb(0.27, 0.19, 0.32), this.mat.armor, sd * 0.05, 0.05, 0);
      shMesh.rotation.z = sd * 0.28;
      const acMesh = mesh(sh, rb(0.2, 0.04, 0.33), this.mat.accent, sd * 0.08, 0.15, 0);
      acMesh.rotation.z = sd * 0.28;
      mesh(sh, new THREE.CapsuleGeometry(0.08, 0.22, 4, 10), this.mat.under, 0, -0.2, 0);
      mesh(sh, rb(0.17, 0.2, 0.18), this.mat.armor2, 0, -0.22, 0);
      const el = G(sh, 0, -0.38, 0);
      mesh(el, new THREE.SphereGeometry(0.075, 12, 10), this.mat.metal);
      mesh(el, rb(0.17, 0.28, 0.18), this.mat.armor, 0, -0.16, 0);
      mesh(el, rb(0.18, 0.05, 0.19), this.mat.accent, 0, -0.27, 0);
      mesh(el, rb(0.1, 0.13, 0.09), this.mat.under, 0, -0.37, 0.01);
      const arm: { sh: THREE.Group; el: THREE.Group; side: number; scannerTip?: THREE.Group } = {
        sh,
        el,
        side: sd,
      };
      if (sd === 1) {
        mesh(el, rb(0.07, 0.16, 0.11), this.mat.metal, 0.1, -0.15, 0.02);
        mesh(el, rb(0.012, 0.1, 0.07), this.mat.glow, 0.138, -0.15, 0.02, false);
        arm.scannerTip = G(el, 0.02, -0.47, 0.05);
      }
      this.arms.push(arm);
    }

    // Legs
    for (const sd of [1, -1]) {
      const th = G(hips, sd * 0.135, -0.06, 0);
      mesh(th, new THREE.CapsuleGeometry(0.095, 0.3, 4, 10), this.mat.under, 0, -0.22, 0);
      mesh(th, rb(0.21, 0.32, 0.23), this.mat.armor, 0, -0.2, 0.01);
      const kn = G(th, 0, -0.44, 0);
      mesh(kn, new THREE.SphereGeometry(0.085, 12, 10), this.mat.metal);
      mesh(kn, rb(0.15, 0.14, 0.08), this.mat.accent, 0, 0, 0.1);
      mesh(kn, rb(0.19, 0.38, 0.21), this.mat.armor, 0, -0.22, 0);
      const an = G(kn, 0, -0.44, 0);
      mesh(an, rb(0.2, 0.13, 0.33), this.mat.armor2, 0, -0.07, 0.05);
      mesh(an, rb(0.21, 0.04, 0.35), this.mat.under, 0, -0.135, 0.05);
      this.legs.push({ th, kn, an, side: sd });
    }
  }

  animate(dt: number, s: { speed: number; grounded: boolean; thrusting: boolean }, cfg: WalkerConfig) {
    this.t += dt;
    const sp = s.grounded ? s.speed : 0;
    const ev = this.events;
    ev.length = 0;

    this.amp = damp(this.amp, clamp(sp / cfg.walkSpeed, 0, 1), 7, dt);
    this.run = damp(
      this.run,
      clamp((sp - cfg.walkSpeed * 1.15) / (cfg.runSpeed - cfg.walkSpeed * 1.15), 0, 1),
      5,
      dt,
    );
    this.air = damp(this.air, s.grounded ? 0 : 1, 6, dt);
    this.land = damp(this.land, 0, 4.5, dt);

    const prev = this.phase;
    if (s.grounded) {
      this.phase += (dt * Math.PI * 2 * sp) / (1.7 + this.run * 1.6);
    }

    const ph = this.phase;
    const a = this.amp;
    const r = this.run;
    const air = this.air;
    const A = 1 - air;
    const sinp = Math.sin(ph);

    // Detect foot-plant
    if (s.grounded && sp > 0.3) {
      const crossed = (p0: number, p1: number) =>
        Math.floor((p1 - Math.PI / 2) / (Math.PI * 2)) >
        Math.floor((p0 - Math.PI / 2) / (Math.PI * 2));
      if (crossed(prev, ph)) ev.push(this.legs[0]);
      if (crossed(prev + Math.PI, ph + Math.PI)) ev.push(this.legs[1]);
    }

    // Leg IK
    for (const L of this.legs) {
      const p = ph + (L.side === 1 ? 0 : Math.PI);
      const sn = Math.sin(p);
      const cs = Math.cos(p);
      const thigh = -sn * (0.42 + 0.3 * r) * a;
      const knee = (0.1 + Math.pow(Math.max(0, cs), 1.4) * (0.85 + 0.5 * r)) * a + 0.06;
      L.th.rotation.x = lerp(thigh, L.side === 1 ? -0.55 : -0.15, air) - this.land * 0.55;
      L.kn.rotation.x = lerp(knee, L.side === 1 ? 0.85 : 0.45, air) + this.land * 1.1;
      L.an.rotation.x = -(L.th.rotation.x + L.kn.rotation.x) * 0.85 * A + air * 0.3;
      L.th.rotation.z = L.side * 0.04;
    }

    // Hip bob & sway
    const bob = (0.035 + 0.07 * r) * a;
    this.hips.position.y = 1.1 + bob * (0.5 - Math.abs(sinp)) - this.land * 0.24;
    this.hips.rotation.y = sinp * 0.08 * a;
    this.hips.rotation.z = Math.cos(ph) * 0.03 * a;

    // Torso counter-rotation
    this.torso.rotation.x = 0.06 * a + 0.3 * r + 0.12 * air + this.land * 0.25;
    this.torso.rotation.y = -sinp * 0.14 * a;
    this.torso.position.y = 0.12 + Math.sin(this.t * 1.7) * 0.007 * (1 - a);

    // Arms
    for (const Ar of this.arms) {
      const sw = Math.sin(ph + (Ar.side === 1 ? 0 : Math.PI)) * (0.45 + 0.35 * r) * a;
      const rx = lerp(sw, -0.25, air);
      const rz = lerp(Ar.side * (0.13 + 0.05 * a), Ar.side * 0.55, air);
      const ex = lerp(-(0.25 + 0.7 * r) * a - 0.18, -0.5, air);
      Ar.sh.rotation.set(rx, 0, rz);
      Ar.el.rotation.x = ex;
    }

    // Head
    this.head.rotation.x = -0.04 + 0.12 * r;
    this.head.rotation.y = Math.sin(this.t * 0.37) * 0.28 * (1 - a) * A;

    // Thrusters
    this.thr = damp(this.thr, s.thrusting ? 1 : 0, 14, dt);
    for (const f of this.flames) {
      const k = this.thr * (0.75 + 0.5 * Math.random());
      f.scale.y = Math.max(k, 0.001);
      f.visible = k > 0.02;
    }
    this.thrustLight.intensity = this.thr * (7 + Math.random() * 4);

    // Lamp
    this.lampK = damp(this.lampK, this.lampOn ? 1 : 0, 10, dt);
    this.lamp.intensity = this.lampK * 0.8;

    // Tip blink
    if (this.tip && this.tip.material instanceof THREE.MeshStandardMaterial) {
      this.tip.material.emissiveIntensity = this.t % 2 < 0.1 ? 5 : 0.3;
    }

    return ev;
  }

  landed(impact: number) {
    this.land = Math.max(this.land, clamp(impact / 7, 0.25, 1));
  }

  dispose() {
    this.root.traverse((obj: any) => {
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        if (Array.isArray(obj.material)) obj.material.forEach((m: any) => m.dispose());
        else obj.material.dispose();
      }
    });
  }
}

// ─────────────────────────────────────────────────────────────────
// FOOTPRINTS (Instanced Decals)
// ─────────────────────────────────────────────────────────────────
class Footprints {
  public mesh: THREE.InstancedMesh;
  private _fadeArr: Float32Array;
  private _fadeAttr: THREE.InstancedBufferAttribute;
  private _count: number;
  private _life: number;
  private _i = 0;
  private _birth: Float32Array;
  private _acc = 0;
  private _q1 = new THREE.Quaternion();
  private _q2 = new THREE.Quaternion();
  private _m = new THREE.Matrix4();
  private _s = new THREE.Vector3(1, 1, 1);
  private _p = new THREE.Vector3();
  private _n = new THREE.Vector3();
  private sampleHeight: (x: number, z: number) => number;

  constructor(
    scene: THREE.Scene,
    color = 0x7a5540,
    life = 40,
    count = 520,
    sampleHeight: (x: number, z: number) => number = () => 0,
  ) {
    this.sampleHeight = sampleHeight;
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 128;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, 64, 128);
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.ellipse(32, 98, 16, 22, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(32, 42, 20, 32, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#4a4a4a";
    for (let y = 14; y < 122; y += 9) ctx.fillRect(10, y, 44, 3);
    const tex = new THREE.CanvasTexture(canvas);

    const geo = new THREE.PlaneGeometry(0.25, 0.43);
    geo.rotateX(-Math.PI / 2);
    geo.rotateY(Math.PI);

    this._fadeArr = new Float32Array(count);
    const fadeAttr = new THREE.InstancedBufferAttribute(this._fadeArr, 1);
    geo.setAttribute("aFade", fadeAttr);
    this._fadeAttr = fadeAttr;

    const mat = new THREE.MeshStandardMaterial({
      color,
      roughness: 1,
      transparent: true,
      depthWrite: false,
      alphaMap: tex,
      polygonOffset: true,
      polygonOffsetFactor: -2,
      polygonOffsetUnits: -2,
    });
    mat.onBeforeCompile = (sh) => {
      sh.vertexShader = sh.vertexShader
        .replace("#include <common>", "#include <common>\nattribute float aFade; varying float vFade;")
        .replace("#include <begin_vertex>", "#include <begin_vertex>\nvFade = aFade;");
      sh.fragmentShader = sh.fragmentShader
        .replace("#include <common>", "#include <common>\nvarying float vFade;")
        .replace(
          "#include <alphamap_fragment>",
          "#include <alphamap_fragment>\ndiffuseColor.a *= vFade;",
        );
    };

    this.mesh = new THREE.InstancedMesh(geo, mat, count);
    this.mesh.frustumCulled = false;
    this.mesh.receiveShadow = true;
    const zero = new THREE.Matrix4().makeScale(0, 0, 0);
    for (let i = 0; i < count; i++) this.mesh.setMatrixAt(i, zero);
    scene.add(this.mesh);

    this._count = count;
    this._life = life;
    this._birth = new Float32Array(count).fill(-1e9);
  }

  stamp(x: number, z: number, heading: number, side: number, t: number) {
    const hAt = (dx: number, dz: number) => this.sampleHeight(x + dx, z + dz);
    this._n.set(hAt(-0.3, 0) - hAt(0.3, 0), 0.6, hAt(0, -0.3) - hAt(0, 0.3)).normalize();
    this._q1.setFromUnitVectors(UP, this._n);
    this._q2.setFromAxisAngle(UP, heading + side * 0.06);
    this._q1.multiply(this._q2);
    this._p.set(x, this.sampleHeight(x, z) + 0.012, z);
    this._m.compose(this._p, this._q1, this._s);
    this.mesh.setMatrixAt(this._i, this._m);
    this.mesh.instanceMatrix.needsUpdate = true;
    this._birth[this._i] = t;
    this._i = (this._i + 1) % this._count;
  }

  update(dt: number, t: number) {
    if ((this._acc += dt) < 0.2) return;
    this._acc = 0;
    const a = this._fadeArr;
    const L = this._life;
    for (let i = 0; i < this._count; i++) {
      const b = this._birth[i] ?? 0;
      const age = t - b;
      a[i] = age < 0 || age > L ? 0 : 0.8 * clamp((L - age) / (L * 0.4), 0, 1);
    }
    this._fadeAttr.needsUpdate = true;
  }

  dispose() {
    this.mesh.geometry.dispose();
    if (Array.isArray(this.mesh.material)) {
      this.mesh.material.forEach((m) => m.dispose());
    } else {
      this.mesh.material.dispose();
    }
  }
}

// ─────────────────────────────────────────────────────────────────
// DUST PUFFS SYSTEM
// ─────────────────────────────────────────────────────────────────
class Puffs {
  private _n: number;
  private _i = 0;
  private _p: Float32Array;
  private _v: Float32Array;
  private _life: Float32Array;
  private _max: Float32Array;
  private _aLife: THREE.BufferAttribute;
  private _aSize: THREE.BufferAttribute;
  public pts: THREE.Points;
  private _geo: THREE.BufferGeometry;

  constructor(scene: THREE.Scene, n = 220, color = 0xd4a87c, alpha = 0.45) {
    this._n = n;
    this._p = new Float32Array(n * 3);
    this._v = new Float32Array(n * 3);
    this._life = new Float32Array(n);
    this._max = new Float32Array(n).fill(1);

    this._aLife = new THREE.BufferAttribute(new Float32Array(n), 1);
    this._aSize = new THREE.BufferAttribute(new Float32Array(n), 1);

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(this._p, 3));
    geo.setAttribute("aLife", this._aLife);
    geo.setAttribute("aSize", this._aSize);

    const mat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: {
        uColor: { value: new THREE.Color(color) },
        uAlpha: { value: alpha },
        uScale: { value: 600 },
      },
      vertexShader: `
        attribute float aLife; attribute float aSize;
        uniform float uScale;
        varying float vA;
        void main(){
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          float g = 1.0 - aLife;
          gl_PointSize = aLife <= 0.0 ? 0.0
            : min(aSize * (0.4 + g * 1.5) * uScale / max(-mv.z, 0.3), 180.0);
          gl_Position = projectionMatrix * mv;
          vA = aLife <= 0.0 ? 0.0 : min(1.0, g * 6.0) * aLife;
        }`,
      fragmentShader: `
        uniform vec3 uColor; uniform float uAlpha; varying float vA;
        void main(){
          gl_FragColor = vec4(uColor,
            smoothstep(0.5, 0.0, length(gl_PointCoord - 0.5)) * vA * uAlpha);
        }`,
    });

    const pts = new THREE.Points(geo, mat);
    pts.frustumCulled = false;
    scene.add(pts);
    this.pts = pts;
    this._geo = geo;
  }

  emit(pos: THREE.Vector3, count = 4, spread = 0.6, up = 0.5, size = 0.5, life = 1.4) {
    for (let k = 0; k < count; k++) {
      const i = this._i;
      const j = i * 3;
      this._i = (i + 1) % this._n;
      const a = Math.random() * 6.283;
      const r = Math.random() * spread;
      this._p[j] = pos.x + Math.cos(a) * r * 0.3;
      this._p[j + 1] = pos.y + 0.05;
      this._p[j + 2] = pos.z + Math.sin(a) * r * 0.3;
      this._v[j] = Math.cos(a) * r;
      this._v[j + 1] = up * (0.4 + Math.random() * 0.8);
      this._v[j + 2] = Math.sin(a) * r;
      this._life[i] = this._max[i] = life * (0.6 + Math.random() * 0.6);
      this._aSize.array[i] = size * (0.6 + Math.random() * 0.8);
    }
  }

  update(dt: number) {
    const drag = Math.exp(-2.2 * dt);
    const lifeArr = this._life;
    const maxArr = this._max;
    const v = this._v;
    const p = this._p;
    const aLife = this._aLife.array as Float32Array;

    for (let i = 0; i < this._n; i++) {
      const curLife = lifeArr[i] ?? 0;
      if (curLife <= 0) {
        aLife[i] = 0;
        continue;
      }
      const j = i * 3;
      const newLife = curLife - dt;
      lifeArr[i] = newLife;
      const vj0 = (v[j] ?? 0) * drag;
      const vj1 = (v[j + 1] ?? 0) * drag - 0.25 * dt;
      const vj2 = (v[j + 2] ?? 0) * drag;
      v[j] = vj0;
      v[j + 1] = vj1;
      v[j + 2] = vj2;
      p[j] = (p[j] ?? 0) + vj0 * dt;
      p[j + 1] = (p[j + 1] ?? 0) + vj1 * dt;
      p[j + 2] = (p[j + 2] ?? 0) + vj2 * dt;
      const maxL = maxArr[i] ?? 1;
      aLife[i] = Math.max(newLife / maxL, 0);
    }
    const posAttr = this._geo.attributes.position;
    if (posAttr) posAttr.needsUpdate = true;
    this._aLife.needsUpdate = true;
    this._aSize.needsUpdate = true;
  }

  dispose() {
    this._geo.dispose();
    if (Array.isArray(this.pts.material)) {
      this.pts.material.forEach((m) => m.dispose());
    } else {
      this.pts.material.dispose();
    }
  }
}

// ─────────────────────────────────────────────────────────────────
// PLAYER PHYSICS
// ─────────────────────────────────────────────────────────────────
class Player {
  public pos = new THREE.Vector3(0, 0, 0);
  public vel = new THREE.Vector3();
  private _old = new THREE.Vector3();
  public heading = Math.PI;
  public grounded = true;
  public thrusting = false;
  public sprint = false;
  public speed = 0;
  public impact = 0;
  private sampleHeight: (x: number, z: number) => number;

  constructor(sampleHeight: (x: number, z: number) => number) {
    this.sampleHeight = sampleHeight;
  }

  update(dt: number, input: InputHandler, camYaw: number, cfg: WalkerConfig) {
    const ax = input.axis();
    let dx = 0;
    let dz = 0;
    if (ax.x || ax.y) {
      const s = Math.sin(camYaw);
      const c = Math.cos(camYaw);
      dx = -s * ax.y + c * ax.x;
      dz = -c * ax.y - s * ax.x;
      const l = Math.hypot(dx, dz) || 1;
      dx /= l;
      dz /= l;
    }
    const moving = !!(dx || dz);
    this.sprint = moving && (input.down("ShiftLeft") || input.down("ShiftRight"));
    const want = moving ? (this.sprint ? cfg.runSpeed : cfg.walkSpeed) : 0;
    const rate = this.grounded ? 9 : 1.6;
    this.vel.x = damp(this.vel.x, dx * want, rate, dt);
    this.vel.z = damp(this.vel.z, dz * want, rate, dt);

    this.thrusting = input.down("Space");
    if (this.thrusting && this.grounded) {
      this.vel.y = Math.max(this.vel.y, 2.4);
      this.grounded = false;
    }
    this.vel.y -= cfg.gravity * dt;
    if (this.thrusting) {
      this.vel.y = Math.min(this.vel.y + cfg.thrustAccel * dt, cfg.maxClimb);
    }

    const o = this._old.copy(this.pos);
    const nx = o.x + this.vel.x * dt;
    const nz = o.z + this.vel.z * dt;
    if (this.grounded) {
      const step = Math.hypot(nx - o.x, nz - o.z);
      const rise = this.sampleHeight(nx, nz) - this.sampleHeight(o.x, o.z);
      if (step > 1e-5 && rise > 0.04 && rise / step > 1.25) {
        this.vel.x *= 0.3;
        this.vel.z *= 0.3;
      } else {
        this.pos.x = nx;
        this.pos.z = nz;
      }
    } else {
      this.pos.x = nx;
      this.pos.z = nz;
    }

    this.pos.y += this.vel.y * dt;
    this.impact = 0;
    const floor = this.sampleHeight(this.pos.x, this.pos.z);
    if (this.pos.y <= floor) {
      if (!this.grounded && this.vel.y < -1.2) this.impact = -this.vel.y;
      this.pos.y = floor;
      if (this.vel.y < 0) this.vel.y = 0;
      this.grounded = !this.thrusting || this.vel.y <= 0;
    } else if (this.grounded) {
      if (this.pos.y - floor < 0.4 && !this.thrusting) {
        this.pos.y = floor;
        this.vel.y = 0;
      } else {
        this.grounded = false;
      }
    }

    this.speed = Math.hypot(this.vel.x, this.vel.z);
    if (moving) this.heading = dampAngle(this.heading, Math.atan2(dx, dz), 10, dt);
  }
}

// ─────────────────────────────────────────────────────────────────
// CAMERA RIG
// ─────────────────────────────────────────────────────────────────
class CameraRig {
  public cam: THREE.PerspectiveCamera;
  public yaw = 0;
  public pitch = 0.3;
  public dist = 7.5;
  public cur = 7.5;
  public shake = 0;
  public fov = 55;
  public target = new THREE.Vector3();
  private _off = new THREE.Vector3();

  constructor(cam: THREE.PerspectiveCamera) {
    this.cam = cam;
  }

  snap(player: Player) {
    this.target.set(player.pos.x, player.pos.y + 1.65, player.pos.z);
    this.cur = this.dist;
  }

  update(dt: number, input: InputHandler, player: Player) {
    const d = input.drag;
    if (d.dx || d.dy) {
      this.yaw -= d.dx * 0.0055;
      this.pitch = clamp(this.pitch + d.dy * 0.004, -0.25, 1.25);
    }
    if (input.wheel) {
      this.dist = clamp(this.dist * Math.pow(1.0012, input.wheel), 2.4, 16);
    }

    const T = this.target;
    T.x = damp(T.x, player.pos.x, 12, dt);
    T.z = damp(T.z, player.pos.z, 12, dt);
    T.y = damp(T.y, player.pos.y + 1.65, 7, dt);

    const cp = Math.cos(this.pitch);
    this._off.set(Math.sin(this.yaw) * cp, Math.sin(this.pitch), Math.cos(this.yaw) * cp);
    this.cur = damp(this.cur, this.dist, 2.5, dt);
    this.cam.position.copy(T).addScaledVector(this._off, this.cur);
    this.cam.lookAt(T.x, T.y + 0.1, T.z);

    this.shake = Math.max(0, this.shake - dt * 1.8);
    if (this.shake > 0) {
      const k = this.shake * this.shake * 0.05;
      this.cam.rotation.x += (Math.random() - 0.5) * k;
      this.cam.rotation.y += (Math.random() - 0.5) * k;
    }

    this.fov = damp(
      this.fov,
      player.sprint && player.speed > 4 ? 61 : player.thrusting ? 58 : 55,
      4,
      dt,
    );
    if (Math.abs(this.cam.fov - this.fov) > 0.01) {
      this.cam.fov = this.fov;
      this.cam.updateProjectionMatrix();
    }
  }
}

// ─────────────────────────────────────────────────────────────────
// ASTRONAUT WALKER HUD OVERLAY
// ─────────────────────────────────────────────────────────────────
export interface WalkerHUDProps {
  speed: number;
  grounded: boolean;
  thrusting: boolean;
  sprint: boolean;
  footCount: number;
  planet: Planet;
  gravity: number;
  onSwitchView?: () => void;
  nearestObj?: { id: string; name: string; dist: number } | null;
  onInspectObject?: (id: string) => void;
  onOpenStory?: (id: string) => void;
}

export function WalkerHUD({
  speed,
  grounded,
  thrusting,
  sprint,
  footCount,
  planet,
  gravity,
  onSwitchView,
  nearestObj,
  onInspectObject,
  onOpenStory,
}: WalkerHUDProps) {
  const mode = thrusting
    ? "THRUSTERS"
    : !grounded
      ? "AIRBORNE"
      : sprint
        ? "SPRINT"
        : speed > 0.3
          ? "WALK"
          : "IDLE";
  const modeColor: Record<string, string> = {
    THRUSTERS: "#ff8a3a",
    AIRBORNE: "#72f2ff",
    SPRINT: "#ffcc44",
    WALK: "#a6ffbe",
    IDLE: "#aaa",
  };

  const isMars = planet === "mars";
  const isDeepSpace = planet === "deep-space";
  const accentColor = isMars ? "#ff8a55" : isDeepSpace ? "#c084fc" : "#00d4ff";

  return (
    <div className="absolute inset-0 pointer-events-none select-none font-mono">
      {/* Top Left: Suit Telemetry */}
      <div
        className="absolute top-5 left-5 rounded-2xl border border-white/10 p-3.5 backdrop-blur-xl shadow-2xl"
        style={{
          background: "linear-gradient(135deg, rgba(8,12,22,0.88), rgba(4,6,12,0.94))",
          color: accentColor,
        }}
      >
        <div className="flex items-center gap-2 mb-1.5">
          <span className="h-2 w-2 rounded-full animate-pulse" style={{ background: accentColor }} />
          <span className="text-xs font-black tracking-[0.25em] text-white uppercase">
            {isMars
              ? "ARES EXOSUIT // MARS"
              : isDeepSpace
              ? "VOYAGER EXOSUIT // DEEP SPACE"
              : "APOLLO EXOSUIT // MOON"}
          </span>
        </div>
        <div className="text-[11px] leading-relaxed text-regolith-300">
          <div>
            MODE &nbsp;
            <span style={{ color: modeColor[mode] || "#aaa" }} className="font-bold">
              {mode}
            </span>
          </div>
          <div>
            SPEED &nbsp;<strong className="text-white">{speed.toFixed(1)} m/s</strong>
          </div>
          <div>
            GRAVITY &nbsp;<strong className="text-white">{gravity.toFixed(2)} m/s²</strong>
          </div>
          <div>
            FOOTPRINTS &nbsp;<strong className="text-white">{footCount}</strong>
          </div>
        </div>
      </div>

      {/* Top Right: View Switcher (POV vs Walker) */}
      {onSwitchView && (
        <div className="absolute top-5 right-5 pointer-events-auto">
          <button
            type="button"
            onClick={onSwitchView}
            className="flex items-center gap-2 rounded-full border border-signal/80 bg-space-950/90 px-4 py-2 text-xs font-black uppercase tracking-wider text-signal shadow-[0_0_25px_rgba(0,212,255,0.4)] backdrop-blur transition hover:scale-105 active:scale-95 cursor-pointer"
            title="Switch back to First-Person POV view"
          >
            <span>👁️</span>
            <span>Switch to POV View</span>
            <span className="rounded bg-signal/20 px-1 py-0.5 text-[9px] font-mono text-signal">
              [V]
            </span>
          </button>
        </div>
      )}

      {/* Center Proximity Beacon */}
      {nearestObj && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 rounded-full border border-white/15 bg-space-950/90 px-4 py-1.5 backdrop-blur-xl text-xs font-bold text-white shadow-2xl flex items-center gap-2 pointer-events-auto z-20">
          <span className="text-amber-400">📡 PROXIMITY:</span>
          <span>{nearestObj.name}</span>
          <span className="font-mono text-regolith-400">({nearestObj.dist.toFixed(1)}m)</span>
          {onInspectObject && nearestObj.dist <= 12 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onInspectObject(nearestObj.id);
              }}
              className="ml-2 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-3.5 py-1 text-[11px] font-black text-space-950 shadow-md transition hover:scale-105 active:scale-95 cursor-pointer"
            >
              [E] SCAN &amp; INSPECT
            </button>
          )}
          {onOpenStory && nearestObj.dist <= 12 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenStory(nearestObj.id);
              }}
              className="ml-1.5 rounded-full border border-sky-400 bg-sky-500/30 px-3 py-1 text-[11px] font-black text-sky-200 shadow-md transition hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-1"
            >
              <span>🎬</span>
              <span>[T] 3D STORY</span>
            </button>
          )}
        </div>
      )}

      {/* Bottom Center: Controls Legend */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full border border-white/10 bg-space-950/80 px-5 py-2 backdrop-blur-xl shadow-xl text-[10px] sm:text-[11px] tracking-wider text-regolith-300 text-center">
        <span className="text-white font-bold">WASD / ARROWS</span> Move &nbsp;|&nbsp;{" "}
        <span className="text-white font-bold">SHIFT</span> Sprint &nbsp;|&nbsp;{" "}
        <span className="text-white font-bold">SPACE</span> Thrusters / Jump &nbsp;|&nbsp;{" "}
        <span className="text-white font-bold">DRAG</span> Orbit Camera &nbsp;|&nbsp;{" "}
        <span className="text-white font-bold">V</span> Toggle POV
        {nearestObj && nearestObj.dist <= 12 && (
          <>
            &nbsp;|&nbsp; <span className="text-amber-400 font-bold">E</span> Inspect &nbsp;|&nbsp;{" "}
            <span className="text-sky-300 font-bold">T</span> 3D Story
          </>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// MAIN COMPONENT: AstronautWalker
// ─────────────────────────────────────────────────────────────────
export interface AstronautWalkerProps {
  className?: string;
  style?: React.CSSProperties;
  planet?: Planet;
  objects?: HeritageObject[];
  onSwitchView?: () => void;
  onInspectObject?: (id: string) => void;
}

export default function AstronautWalker({
  className,
  style,
  planet = "mars",
  objects = [],
  onSwitchView,
  onInspectObject,
}: AstronautWalkerProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const cfg = planet === "moon" ? DEFAULT_MOON_CFG : DEFAULT_MARS_CFG;

  // HUD state ref
  const hudRef = useRef({
    speed: 0,
    grounded: true,
    thrusting: false,
    sprint: false,
    footCount: 0,
    nearestObj: null as { id: string; name: string; dist: number } | null,
  });

  const [hudState, setHudState] = useState(hudRef.current);

  // Keyboard shortcut 'V' to toggle POV / Walker and 'E' to inspect
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.code === "KeyV" && onSwitchView) {
        onSwitchView();
      } else if (e.code === "KeyE" && onInspectObject) {
        if (hudRef.current.nearestObj && hudRef.current.nearestObj.dist <= 6) {
          onInspectObject(hudRef.current.nearestObj.id);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onSwitchView, onInspectObject]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = planet === "mars" ? 1.15 : 1.35;
    container.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(
      55,
      container.clientWidth / container.clientHeight,
      0.05,
      800,
    );

    // Build scene based on Moon or Mars
    const scene = new THREE.Scene();
    const isMars = planet === "mars";

    if (isMars) {
      scene.background = new THREE.Color(0x1a0c06);
      scene.fog = new THREE.FogExp2(0x2a1208, 0.026);
      scene.add(new THREE.HemisphereLight(0xffb07a, 0x3a1c08, 0.65));
      const sun = new THREE.DirectionalLight(0xfff2d0, 2.5);
      sun.position.set(60, 80, -40);
      sun.castShadow = true;
      sun.shadow.mapSize.set(2048, 2048);
      scene.add(sun);
    } else {
      scene.background = new THREE.Color(0x020205);
      scene.fog = new THREE.FogExp2(0x06060c, 0.008);
      scene.add(new THREE.HemisphereLight(0xb0c4de, 0x14161a, 0.45));
      const sun = new THREE.DirectionalLight(0xffffff, 2.8);
      sun.position.set(70, 90, -45);
      sun.castShadow = true;
      sun.shadow.mapSize.set(2048, 2048);
      scene.add(sun);
    }

    // Procedural terrain height sampler
    const sampleHeight = (x: number, z: number) => {
      return (
        Math.sin(x * 0.08) * 0.45 +
        Math.sin(z * 0.11) * 0.35 +
        Math.sin(x * 0.3 + z * 0.2) * 0.18
      );
    };

    // Ground plane
    const groundGeo = new THREE.PlaneGeometry(500, 500, 100, 100);
    const pos = groundGeo.attributes.position;
    if (pos) {
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const z = pos.getZ(i);
        pos.setY(i, sampleHeight(x, z));
      }
    }
    groundGeo.computeVertexNormals();

    const groundMat = new THREE.MeshStandardMaterial({
      color: isMars ? 0x8f5a3c : 0x64666a,
      roughness: 0.95,
      metalness: 0.05,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Scattered boulders / lunar rocks
    const rockMat = new THREE.MeshStandardMaterial({
      color: isMars ? 0x6b4030 : 0x424448,
      roughness: 0.9,
      flatShading: true,
    });
    for (let i = 0; i < 50; i++) {
      const s = 0.2 + Math.random() * 1.4;
      const r = new THREE.Mesh(new THREE.IcosahedronGeometry(s, 0), rockMat);
      const rx = (Math.random() - 0.5) * 80;
      const rz = (Math.random() - 0.5) * 80;
      r.position.set(rx, sampleHeight(rx, rz) + s * 0.35, rz);
      r.rotation.set(Math.random(), Math.random(), Math.random());
      r.castShadow = true;
      r.receiveShadow = true;
      scene.add(r);
    }

    // Heritage Object holographic beacons
    const beaconMarkers: Array<{ id: string; name: string; pos: THREE.Vector3 }> = [];
    objects.forEach((obj, idx) => {
      const ox = (idx % 2 === 0 ? 1 : -1) * (8 + idx * 4.5);
      const oz = (idx % 3 === 0 ? -1 : 1) * (10 + idx * 3.5);
      const oy = sampleHeight(ox, oz);

      const beacon = new THREE.Group();
      beacon.position.set(ox, oy, oz);

      // Base column
      const col = new THREE.Mesh(
        new THREE.CylinderGeometry(0.35, 0.45, 0.8, 16),
        new THREE.MeshStandardMaterial({ color: 0x222630, metalness: 0.8, roughness: 0.3 }),
      );
      col.position.y = 0.4;
      beacon.add(col);

      // Glowing crystal / artifact marker
      const crystal = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.35, 0),
        new THREE.MeshBasicMaterial({
          color: isMars ? 0xff7733 : 0x00d4ff,
          wireframe: true,
        }),
      );
      crystal.position.y = 1.6;
      beacon.add(crystal);

      const beaconLight = new THREE.PointLight(isMars ? 0xff7733 : 0x00d4ff, 1.2, 8);
      beaconLight.position.y = 1.6;
      beacon.add(beaconLight);

      scene.add(beacon);
      beaconMarkers.push({ id: obj.id, name: obj.name, pos: new THREE.Vector3(ox, oy, oz) });
    });

    // Systems
    const input = new InputHandler(renderer.domElement);
    const player = new Player(sampleHeight);
    const camRig = new CameraRig(camera);
    const exosuit = new Exosuit(scene, null);
    const footprints = new Footprints(
      scene,
      isMars ? 0x7a5540 : 0x3d3f43,
      cfg.footLife,
      520,
      sampleHeight,
    );
    const puffs = new Puffs(scene, 220, isMars ? 0xd4a87c : 0xa0a0a5);

    player.pos.set(0, sampleHeight(0, 0), 0);
    camRig.snap(player);

    let lastT = performance.now() / 1000;
    let gameT = 0;
    let hudTick = 0;

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(container);

    let raf: number;
    const loop = (nowMs: number) => {
      raf = requestAnimationFrame(loop);
      const now = nowMs / 1000;
      const dt = Math.min(now - lastT, 0.05);
      lastT = now;
      gameT += dt;

      player.update(dt, input, camRig.yaw, cfg);

      if (player.impact > 1.2) {
        exosuit.landed(player.impact);
        puffs.emit(
          player.pos,
          Math.round(6 + player.impact * 2),
          1 + player.impact * 0.25,
          0.5,
          0.7,
          2.2,
        );
        camRig.shake = Math.max(camRig.shake, clamp(player.impact / 12, 0.1, 0.9));
      }

      const plantedLegs = exosuit.animate(
        dt,
        {
          speed: player.speed,
          grounded: player.grounded,
          thrusting: player.thrusting,
        },
        cfg,
      );

      for (const leg of plantedLegs) {
        const side = leg.side;
        const offset = 0.18;
        const fx = player.pos.x + Math.sin(player.heading + Math.PI / 2) * side * offset;
        const fz = player.pos.z + Math.cos(player.heading + Math.PI / 2) * side * offset;
        footprints.stamp(fx, fz, player.heading, side, gameT);
        puffs.emit(
          new THREE.Vector3(fx, sampleHeight(fx, fz), fz),
          3,
          0.5,
          0.3,
          0.3,
          1.0,
        );
        hudRef.current.footCount++;
      }

      exosuit.root.position.copy(player.pos);
      exosuit.root.rotation.y = player.heading;

      footprints.update(dt, gameT);
      puffs.update(dt);
      camRig.update(dt, input, player);

      input.flush();

      // Check nearest beacon
      let closestBeacon: { id: string; name: string; dist: number } | null = null;
      let minDist = Infinity;
      for (const bm of beaconMarkers) {
        const d = player.pos.distanceTo(bm.pos);
        if (d < minDist && d < 25) {
          minDist = d;
          closestBeacon = { id: bm.id, name: bm.name, dist: d };
        }
      }

      hudTick += dt;
      if (hudTick > 0.1) {
        hudTick = 0;
        hudRef.current = {
          ...hudRef.current,
          speed: player.speed,
          grounded: player.grounded,
          thrusting: player.thrusting,
          sprint: player.sprint,
          nearestObj: closestBeacon,
        };
        setHudState({ ...hudRef.current });
      }

      renderer.render(scene, camera);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      input.dispose();
      exosuit.dispose();
      footprints.dispose();
      puffs.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [planet, cfg, objects]);

  return (
    <div
      ref={mountRef}
      className={`relative h-full w-full overflow-hidden ${className || ""}`}
      style={{
        background: planet === "mars" ? "#1a0c06" : "#020205",
        ...style,
      }}
    >
      <WalkerHUD
        speed={hudState.speed}
        grounded={hudState.grounded}
        thrusting={hudState.thrusting}
        sprint={hudState.sprint}
        footCount={hudState.footCount}
        planet={planet}
        gravity={cfg.gravity}
        onSwitchView={onSwitchView}
        nearestObj={hudState.nearestObj}
        onInspectObject={onInspectObject}
      />
    </div>
  );
}
