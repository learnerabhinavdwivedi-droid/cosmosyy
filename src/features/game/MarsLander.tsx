import { useEffect } from "react";

const marsCSS = `
/* ============================================================
   MARS LANDER — structure 1:1 from original CodePen
   Only colors, shading, lighting, smoke, dust changed.
   Mars palette derived from MRO reference image.
   Scoped to .mars-lander-root
   ============================================================ */

.mars-lander-root * { box-sizing: border-box; }

.mars-lander-root {
  /* ── original bg tokens ── */
  --bg-white: rgba(255,255,255,1);
  --bg-main-color: rgba(220,228,228,1);
  --bg-accent-color: rgba(67,134,156,1);
  --bg-black: rgba(0,0,0,1);
  --bg-transparent: rgba(0,0,0,0);

  /* ── Mars sky / environment ── */
  --mars-sky-top:    rgba(10,4,2,1);
  --mars-sky-mid:    rgba(38,15,8,1);
  --mars-sky-haze:   rgba(90,36,14,1);
  --mars-horizon:    rgba(140,62,22,1);

  /* ── Mars surface ── */
  --mars-surface-dark:  rgba(72,30,10,1);
  --mars-surface-mid:   rgba(115,50,18,1);
  --mars-surface-light: rgba(165,80,30,1);
  --mars-regolith:      rgba(195,110,55,1);
  --mars-highlight:     rgba(220,145,80,1);

  /* ── Mars dust / smoke ── */
  --mars-dust-dark:   rgba(130,65,25,0.85);
  --mars-dust-mid:    rgba(180,100,45,0.70);
  --mars-dust-light:  rgba(215,145,75,0.50);
  --mars-dust-plume:  rgba(200,120,55,0.40);

  /* ── Lander body — keep original teal/silver spirit
        but warm-shift slightly under Mars red sunlight ── */
  --me-accent-color:    rgba(80,145,160,1);
  --me-accent-shade-1:  rgba(72,135,150,1);
  --me-accent-shade-2:  rgba(65,120,138,1);
  --me-accent-shade-3:  rgba(58,105,124,1);
  --me-accent-shade-4:  rgba(52,90,110,1);
  --me-accent-shade-5:  rgba(46,75,96,1);
  --me-accent-shade-6:  rgba(40,60,80,1);
  --me-accent-shade-7:  rgba(34,46,68,1);
  --me-accent-shade-8:  rgba(28,38,60,1);
  --me-accent-shade-9:  rgba(22,30,52,1);

  --me-black:        rgba(0,0,0,1);
  --me-dark-grey:    rgba(40,20,10,1);
  --me-grey:         rgba(90,55,35,1);
  --me-medium-grey:  rgba(130,80,50,1);

  /* Doppler radar — warm the greys toward rust */
  --me-doppler-radar-1: rgba(175,155,138,1);
  --me-doppler-radar-2: rgba(134,113,96,1);
  --me-doppler-radar-3: rgba(122,103,88,1);
  --me-doppler-radar-4: rgba(98,78,62,1);
  --me-doppler-radar-5: rgba(205,175,148,1);
  --me-doppler-radar-6: rgba(238,218,195,1);
  --me-doppler-radar-7: rgba(188,165,145,1);
  --me-doppler-radar-8: rgba(142,120,102,1);
  --me-doppler-radar-9: rgba(170,138,112,1);

  --me-flag-red:   rgba(204,0,0,1);
  --me-flag-white: rgba(243,243,243,1);

  /* Lander main panels — warm silver under Mars orange sun */
  --me-interior-shade-top:    rgba(145,120,100,1);
  --me-interior-shade-bottom: rgba(72,48,32,1);
  --me-main-color:    rgba(228,218,205,1);
  --me-main-shade-1:  rgba(212,200,185,1);
  --me-main-shade-2:  rgba(196,183,166,1);
  --me-main-shade-3:  rgba(180,165,146,1);
  --me-main-shade-4:  rgba(163,147,126,1);
  --me-main-shade-5:  rgba(146,130,108,1);
  --me-main-shade-6:  rgba(130,112,90,1);
  --me-main-shade-7:  rgba(112,95,74,1);
  --me-main-shade-8:  rgba(95,78,58,1);
  --me-main-shade-9:  rgba(78,60,42,1);

  /* Propulsion — Mars dust-orange flame */
  --me-propulsion:        rgba(255,120,20,1);
  --me-propulsion-bright: rgba(255,170,60,1);
  --me-propusion-dark:    rgba(180,65,10,1);

  --me-satelllite-gold:        rgba(140,106,65,1);
  --me-satelllite-gold-shadow: rgba(90,56,22,1);
  --me-secondary-color:        rgba(215,205,190,1);
  --me-transparent:            rgba(0,0,0,0);
  --me-white:                  rgba(255,255,255,1);

  /* Vernier nozzles — bronze/rust tones */
  --me-vernier-nozzle-light:       rgba(155,125,100,1);
  --me-vernier-nozzle-medium:      rgba(118,92,70,1);
  --me-vernier-nozzle-dark-medium: rgba(95,70,50,1);
  --me-vernier-nozzle-dark:        rgba(70,45,28,1);

  /* Measurements — identical to original */
  --stripe: 0.538461538461539em;
  --star-x-one:   0em;  --star-x-two:   1em;  --star-x-three: 2em;
  --star-x-four:  3em;  --star-x-five:  4em;  --star-x-six:   5em;
  --star-x-seven: 6em;  --star-x-eight: 7em;  --star-x-nine:  8em;
  --star-x-ten:   9em;  --star-x-eleven:10em;
  --star-y-one: 0em;    --star-y-two:   0.85em; --star-y-three: 1.7em;
  --star-y-four:2.55em; --star-y-five:  3.4em;  --star-y-six:   4.25em;
  --star-y-seven:5.1em; --star-y-eight: 5.95em; --star-y-nine:  6.8em;
  --middle-height: 16.6699029126214em;
  --middle-top:    26.7326732673267%;
  --window-top:    29.7029702970297%;
  --me-bottom-width:  1.79038461538462em;
  --me-window-height: 10.5515533980583em;
  --me-panel-width:   1.6em;

  font-size: clamp(10px, 1.25vw, 18px);
  font-family: Arial, Helvetica, sans-serif;
  width: 100%;
  height: 100%;
  background-color: var(--mars-sky-top);
  overflow: hidden;
  position: absolute;
  inset: 0;
  user-select: none;
}

.mars-lander-root #crater_one { overflow: hidden }
.mars-lander-root #space, .mars-lander-root #moon_background { overflow: visible }

/* ── SPACE / SCENE layout ── */
.mars-lander-root #space, .mars-lander-root #earth_rise_glow, .mars-lander-root #label_container, 
.mars-lander-root #me_label_1, .mars-lander-root #me_label_2, .mars-lander-root #moon,
.mars-lander-root #moon_atmosphere, .mars-lander-root #moon_surface, .mars-lander-root #moon_background, 
.mars-lander-root #moon_foreground, .mars-lander-root .craters, .mars-lander-root #crater_one, 
.mars-lander-root #crater_one::before, .mars-lander-root #crater_two, .mars-lander-root #crater_three,
.mars-lander-root #hills, .mars-lander-root #hills::before, .mars-lander-root #craters { position: absolute }

.mars-lander-root #space, .mars-lander-root #earth_rise_glow, .mars-lander-root #label_container, 
.mars-lander-root #me_label_1, .mars-lander-root #me_label_2, .mars-lander-root #moon,
.mars-lander-root #moon_atmosphere, .mars-lander-root #moon_surface, .mars-lander-root #moon_foreground, 
.mars-lander-root .craters, .mars-lander-root #crater_one, .mars-lander-root #crater_three, 
.mars-lander-root #hills, .mars-lander-root #hills::before, .mars-lander-root #craters { display: block }

.mars-lander-root #earth_rise_glow, .mars-lander-root #label_container, .mars-lander-root #me_label_1, 
.mars-lander-root #me_label_2, .mars-lander-root #moon, .mars-lander-root #moon_atmosphere, 
.mars-lander-root #moon_surface, .mars-lander-root #moon_background, .mars-lander-root #hills, 
.mars-lander-root #hills::before, .mars-lander-root #moon_foreground, .mars-lander-root .craters, 
.mars-lander-root #crater_one, .mars-lander-root #crater_one::before, .mars-lander-root #crater_two, 
.mars-lander-root #crater_three, .mars-lander-root #craters { transform-style: preserve-3d }

.mars-lander-root #earth_rise_glow, .mars-lander-root #crater_one, .mars-lander-root #crater_one::before, 
.mars-lander-root #crater_two, .mars-lander-root #crater_three {
  border-radius: 50%
}
.mars-lander-root #crater_one::before, .mars-lander-root #hills::before { content: "" }
.mars-lander-root #space, .mars-lander-root #hills::before { top: 0 }
.mars-lander-root #moon, .mars-lander-root #moon_atmosphere, .mars-lander-root #moon_surface, 
.mars-lander-root #moon_foreground, .mars-lander-root .craters, .mars-lander-root #crater_one::before, 
.mars-lander-root #craters { bottom: 0 }
.mars-lander-root #space, .mars-lander-root #label_container, .mars-lander-root #moon, 
.mars-lander-root #moon_atmosphere, .mars-lander-root #moon_surface, .mars-lander-root #moon_foreground, 
.mars-lander-root .craters, .mars-lander-root #moon_background, .mars-lander-root #craters { left: 0 }
.mars-lander-root #space, .mars-lander-root #moon, .mars-lander-root #moon_atmosphere, 
.mars-lander-root #moon_surface, .mars-lander-root #moon_background, .mars-lander-root #moon_foreground { width: 100% }
.mars-lander-root #space, .mars-lander-root #label_container, .mars-lander-root #moon, 
.mars-lander-root #moon_surface, .mars-lander-root #moon_foreground { height: 100% }

/* ── MARS ATMOSPHERE glow ── */
.mars-lander-root #moon_atmosphere {
  opacity: 0;
  height: 140vh;
  perspective: 60em;
  perspective-origin: 100% 40%;
  transform: translateZ(-2em);
  animation: mars_fade_in 6s ease-in-out 3s forwards
}

.mars-lander-root #earth_rise_glow {
  left: -30em; bottom: 19em;
  width: 170em; height: 20em;
  background: linear-gradient(
    0deg,
    rgba(180,80,20,.95)   0%,
    rgba(210,105,30,.85)  10%,
    rgba(170,70,15,.75)   25%,
    rgba(130,50,10,.55)   50%,
    rgba(80,25,5,.20)     75%,
    var(--bg-transparent) 100%
  );
}

@keyframes mars_fade_in {
  0%   { opacity: 0 }
  100% { opacity: 1 }
}

/* ── LABEL ── */
.mars-lander-root #label_container {
  bottom: 11em; width: 50em; will-change: opacity
}
.mars-lander-root #me_label_1 {
  left:1em; bottom:0.5em; width:10em; height:50%;
  font-size:5em; color:var(--bg-white); font-weight: bold;
}
.mars-lander-root #me_label_2 {
  left:0.8em; bottom:-0.3em; width:10em; height:50%;
  font-size:6.2em; color:var(--bg-white); font-weight: bold;
}

/* ── MARS SURFACE ── */
.mars-lander-root #moon_surface {
  background:
    linear-gradient(90deg, var(--bg-transparent) 0%, var(--bg-transparent) 100%) no-repeat,
    linear-gradient(90deg, rgba(90,38,14,1) 0%, rgba(60,22,6,1) 100%) no-repeat;
  background-size: 100% 40%, 100% 60%;
  background-position: left top, left bottom;
}

.mars-lander-root #moon_background {
  bottom:35%; left:-10%; height:30%; width:120%;
  border-radius: 40% 40% 0 0;
  background: linear-gradient(
    90deg, rgba(120,55,20,1) 0%, rgba(80,32,10,1) 100%
  ) no-repeat;
  background-size: 100% 40%;
  background-position: left top;
  transform: translateZ(1em);
}

.mars-lander-root #hills {
  bottom:10em; right:0; height:10em; width:50em;
  border-radius: 40% 50% 0 0 / 80% 20% 0 0;
  background: linear-gradient(
    90deg, rgba(100,42,14,1) 0%, rgba(50,16,4,1) 100%
  ) no-repeat;
  transform: translateZ(-2em);
}
.mars-lander-root #hills::before {
  left:-50em; top:4em; height:8em; width:30em;
  border-radius: 40% 50% 0 0 / 80% 60% 0 0;
  background: linear-gradient(
    90deg, rgba(90,38,12,1) 0%, rgba(45,14,4,1) 100%
  ) no-repeat;
}

/* ── CRATERS ── */
.mars-lander-root #craters {
  width:100em; height:80em; margin-bottom:0;
  transform: translateZ(2.5em) rotateX(30deg)
}

.mars-lander-root #crater_one {
  width:40em; height:10em; bottom:4em; left:-9em;
  background:
    repeating-radial-gradient(
      ellipse at 0 0,
      var(--bg-transparent) 0,
      rgba(40,10,2,.7) .01em,
      rgba(130,60,22,.7) .2em,
      var(--bg-transparent) .3em
    ) no-repeat,
    radial-gradient(
      ellipse at 10% -5%,
      rgba(60,22,6,1) 5%,
      rgba(40,12,2,1) 10%,
      rgba(70,28,8,1) 20%,
      rgba(145,70,28,.8) 85%,
      rgba(165,82,32,1) 100%
    );
  background-size: 40em 10em, 100% 100%;
  background-position: 0 0, 0 0;
  box-shadow:
    inset 1.2em 1em 1.2em -1em rgba(60,22,6,.7),
    1.3em 1.1em 10em 0 rgba(100,42,15,.7),
    0 -.1em 1em .5em rgba(110,48,18,.7),
    0 -.3em 5em 0 rgba(130,60,22,1);
  filter: blur(.03em)
}

.mars-lander-root #crater_two {
  bottom:15em; right:-4em; width:20em; height:3.8em;
  background: radial-gradient(
    ellipse at 10% -5%,
    rgba(75,30,8,1) 10%,
    rgba(55,18,4,1) 20%,
    rgba(130,58,20,.8) 85%,
    rgba(150,72,26,1) 100%
  );
  background-size: 100% 100%; background-position: 0 0;
  box-shadow:
    inset 1.2em 1em 1.2em -1em rgba(55,18,4,.7),
    inset 1.2em 1.2em 1em 0 rgba(40,10,2,.9),
    .5em .5em 1em 0 rgba(100,40,14,.7),
    0 -.1em 1em .5em rgba(80,30,8,.7),
    0 -.3em 5em 0 rgba(90,34,10,1);
}

.mars-lander-root #crater_three {
  width:40em; height:10em; bottom:17em; left:5em;
  background:
    repeating-radial-gradient(
      ellipse at 0 0,
      var(--bg-transparent) 0,
      rgba(40,10,2,.7) .01em,
      rgba(130,60,22,.7) .2em,
      var(--bg-transparent) .3em
    ) no-repeat,
    radial-gradient(
      ellipse at 10% -5%,
      rgba(60,22,6,1) 5%,
      rgba(40,12,2,1) 10%,
      rgba(70,28,8,1) 20%,
      rgba(145,70,28,.8) 85%,
      rgba(165,82,32,1) 100%
    );
  background-size: 40em 10em, 100% 100%;
  background-position: 0 0, 0 0;
  box-shadow:
    inset 1.2em 1em 1.2em -1em rgba(60,22,6,.7),
    1.3em 1.1em 10em 0 rgba(100,42,15,.7),
    0 -.1em 1em .5em rgba(110,48,18,.7),
    0 -.3em 5em 0 rgba(130,60,22,1);
  filter: blur(.05em)
}

/* ── STARS ── */
.mars-lander-root #stars {
  font-size:100%;
  width:.1em; height:.1em;
  border-radius:50%; color:var(--bg-white);
  box-shadow:
    6em 4em 0em .05em rgba(180,130,100,1),
    18em 8em 0em .05em rgba(255,210,180,1),
    38em 21em 0em .05em rgba(255,200,170,1),
    62em 20em 0em .05em rgba(255,195,165,1),
    69em 17em 0em 0em rgba(160,80,50,1),
    11em 1em 0em .05em rgba(140,100,80,1),
    72em 16em 0em .05em rgba(255,205,175,1),
    66em 2em 0em 0em rgba(140,70,45,1),
    30em 7em 0em .05em rgba(150,105,80,1),
    40em 0em 0em 0em rgba(150,70,40,1),
    116em 4em 0em .05em rgba(140,105,85,1),
    54em 11em 0em 0em rgba(200,120,80,1),
    8em 2em 0em 0em rgba(145,70,45,1),
    57em 1em 0em 0em rgba(195,115,78,1),
    37em 20em 0em .05em rgba(140,105,85,1),
    75em 15em 0em .05em rgba(140,105,85,1),
    5em 8em 0em 0em rgba(190,110,74,1),
    28em 6em 0em 0em rgba(145,70,45,1),
    77em 15em 0em .05em rgba(140,105,85,1),
    101em 16em 0em .05em rgba(190,160,140,1),
    90em 4em 0em .05em rgba(140,105,85,1),
    132em 2em 0em .05em rgba(140,105,85,1),
    122em 1em 0em 0em rgba(195,110,76,1),
    96em 17em 0em .05em rgba(140,105,85,1),
    7em 2em 0em .05em rgba(255,205,175,1),
    14em 8em 0em .05em rgba(190,160,140,1),
    41em 8em 0em 0em rgba(195,112,76,1),
    120em 1em 0em .05em rgba(190,160,140,1),
    40em 1em 0em .05em rgba(255,220,195,1),
    40em 23em 0em .05em rgba(255,220,195,1)
}

.mars-lander-root #moon_lander, 
.mars-lander-root #cylinder_container .cylinder_side .cylinder_middle.panel_filler .hinge .pneumatic_arm_assembly,
.mars-lander-root #cylinder_container .cylinder_side .cylinder_middle.panel_filler .hinge .pneumatic_arm_assembly .pneumatic_hinge,
.mars-lander-root #cylinder_container .cylinder_side .cylinder_middle.panel_filler .hinge .pneumatic_arm_assembly .pneumatic_arm,
.mars-lander-root #cylinder_container .cylinder_side .cylinder_middle.panel_filler .hinge .leg {
  will-change: transform;
}

.mars-lander-root #moon_lander_container, .mars-lander-root #moon_lander, .mars-lander-root #climate_controller, 
.mars-lander-root #climate_controller::before, .mars-lander-root #satellite_dish_container, 
.mars-lander-root #satellite_dish, .mars-lander-root .vernier_3way_front::before,
.mars-lander-root #satellite_dish::before, .mars-lander-root #satellite_pole, .mars-lander-root .label_ME, 
.mars-lander-root .solar_panel_left, .mars-lander-root .solar_panel_center, .mars-lander-root .solar_panel_right, 
.mars-lander-root .hex_arm, .mars-lander-root .hinge::before, .mars-lander-root .vernier_3way_front_left::after,
.mars-lander-root .leg, .mars-lander-root .leg_top, .mars-lander-root .composite_top_container, 
.mars-lander-root .composite_top_top::before, .mars-lander-root .composite_top_top::after, 
.mars-lander-root .vernier_3way_nozzles, .mars-lander-root .vernier_injector, 
.mars-lander-root .pneumatic_arm_assembly, .mars-lander-root .pneumatic_arm,
.mars-lander-root #top_shading_1, .mars-lander-root #top_shading_2, .mars-lander-root #top_shading_3, 
.mars-lander-root #top_shading_4, .mars-lander-root #top_shading_5, .mars-lander-root .composite_bottom_container_left, 
.mars-lander-root #top_shading_6, .mars-lander-root #top_shading_7, .mars-lander-root #top_shading_8, 
.mars-lander-root .vernier_3way_left {
  display: block
}

.mars-lander-root #router, .mars-lander-root #doppler_radar, .mars-lander-root #flag::before, 
.mars-lander-root #flag::after, .mars-lander-root .solar_panel_center::before, 
.mars-lander-root .composite_top_top:after, .mars-lander-root .interior_shade, 
.mars-lander-root .interior_shade.window_left, .mars-lander-root #satellite_pole::before,
.mars-lander-root #flag, .mars-lander-root .foot::after, .mars-lander-root .vernier_3way_front::after, 
.mars-lander-root .doppler_transponder, .mars-lander-root #doppler_plate, .mars-lander-root .doppler_transponder_2, 
.mars-lander-root .composite_top_bottom:after, .mars-lander-root .composite_top_bottom_2:after,
.mars-lander-root .composite_top_bottom_3:after, .mars-lander-root .composite_bottom_container_right, 
.mars-lander-root #mid_shading_2::after {
  display: block
}

.mars-lander-root #cylinder_container, .mars-lander-root #cylinder_container .cylinder_side, 
.mars-lander-root #cylinder_container .cylinder_side .rocket_bracket, .mars-lander-root #cylinder_top_silver, 
.mars-lander-root .cylinder_top, .mars-lander-root #cylinder_interior, .mars-lander-root .nozzle_side,
.mars-lander-root #top_instruments, .mars-lander-root #satellite_dish::after, .mars-lander-root .cylinder_middle, 
.mars-lander-root .cylinder_middle.window_left, .mars-lander-root .cylinder_middle.window_dot, 
.mars-lander-root .cylinder_middle.window_right, .mars-lander-root .cylinder_middle.panel_filler,
.mars-lander-root .cylinder_middle::before, .mars-lander-root #ME_logo, .mars-lander-root #ME_logo::before, 
.mars-lander-root #ME_logo::after, .mars-lander-root .cylinder_bottom.bottom_panel_filler, 
.mars-lander-root .cylinder_bottom.rounded_corners_left,
.mars-lander-root .cylinder_bottom.rounded_corners_right, .mars-lander-root .hook, .mars-lander-root #nozzle, 
.mars-lander-root .cylinder_bottom, .mars-lander-root .hinge, .mars-lander-root .vernier_thruster, 
.mars-lander-root .vernier_nozzle, .mars-lander-root .circular_side, .mars-lander-root .vernier_nozzle_side, 
.mars-lander-root .vernier_bracket {
  display: flex
}

.mars-lander-root .vernier_plate, .mars-lander-root #propulsion, .mars-lander-root #propulsion::before, 
.mars-lander-root #propulsion::after, .mars-lander-root #fuel_tank, .mars-lander-root .vernier_3way, 
.mars-lander-root .vernier_3way::before, .mars-lander-root .vernier_3way_bottom, .mars-lander-root .vernier_thrust, 
.mars-lander-root #doppler_power_supply, .mars-lander-root #doppler_power_supply::before, 
.mars-lander-root #doppler_power_supply::after, .mars-lander-root #doppler_arm, .mars-lander-root .composite_top, 
.mars-lander-root .composite_top_top, .mars-lander-root .composite_top_bottom,
.mars-lander-root .composite_top_bottom::before, .mars-lander-root .composite_top_bottom_2, 
.mars-lander-root .composite_top_bottom_3 {
  display: flex
}

.mars-lander-root #moon_lander_container, .mars-lander-root #moon_lander, .mars-lander-root #cylinder_container, 
.mars-lander-root #cylinder_container .cylinder_side, .mars-lander-root .cylinder_top, 
.mars-lander-root #cylinder_container .cylinder_side .rocket_bracket,
.mars-lander-root #cylinder_top_silver, .mars-lander-root #cylinder_interior, .mars-lander-root .nozzle_side, 
.mars-lander-root #top_instruments, .mars-lander-root #climate_controller, .mars-lander-root #climate_controller::before, 
.mars-lander-root #satellite_dish_container, .mars-lander-root .vernier_3way_bottom,
.mars-lander-root #satellite_dish, .mars-lander-root #satellite_dish::before, .mars-lander-root #satellite_dish::after, 
.mars-lander-root #satellite_pole, .mars-lander-root .vernier_3way, .mars-lander-root .vernier_3way::before, 
.mars-lander-root .vernier_3way::after,
.mars-lander-root .cylinder_middle, .mars-lander-root .cylinder_middle.window_left, .mars-lander-root .cylinder_middle.window_dot {
  position: absolute
}

.mars-lander-root .cylinder_middle.window_right, .mars-lander-root .cylinder_middle.panel_filler, 
.mars-lander-root .cylinder_middle::before, .mars-lander-root .label_ME, .mars-lander-root #ME_logo, 
.mars-lander-root #ME_logo::before, .mars-lander-root #ME_logo::after, .mars-lander-root .solar_panel_left,
.mars-lander-root .solar_panel_center, .mars-lander-root .solar_panel_right, .mars-lander-root .cylinder_bottom, 
.mars-lander-root .cylinder_bottom.bottom_panel_filler, .mars-lander-root .cylinder_bottom.rounded_corners_left, 
.mars-lander-root .cylinder_bottom.rounded_corners_right,
.mars-lander-root .hook, .mars-lander-root #nozzle, .mars-lander-root #propulsion, 
.mars-lander-root #propulsion::before, .mars-lander-root #propulsion::after, .mars-lander-root .vernier_3way_right, 
.mars-lander-root .pneumatic_arm_assembly, .mars-lander-root .pneumatic_hinge,
.mars-lander-root .pneumatic_hinge_top, .mars-lander-root .pneumatic_hinge_left, .mars-lander-root .pneumatic_hinge_right, 
.mars-lander-root .pneumatic_hinge_front, .mars-lander-root .pneumatic_arm, .mars-lander-root .hex_arm, 
.mars-lander-root .hinge, .mars-lander-root .hinge::before {
  position: absolute
}

.mars-lander-root .slots_top, .mars-lander-root .slots_top::before, .mars-lander-root .slots_bottom, 
.mars-lander-root .slots_bottom::before, .mars-lander-root .leg, .mars-lander-root .leg_top, 
.mars-lander-root .composite_top, .mars-lander-root .composite_top_container, .mars-lander-root .composite_top_top, 
.mars-lander-root .composite_top_top::before,
.mars-lander-root .composite_top_top::after, .mars-lander-root .composite_top_bottom_3, .mars-lander-root .vernier_thruster, 
.mars-lander-root .vernier_bracket, .mars-lander-root .vernier_plate, .mars-lander-root .vernier_injector, 
.mars-lander-root .vernier_nozzle, .mars-lander-root .circular_side, .mars-lander-root .vernier_nozzle_side,
.mars-lander-root .vernier_thrust, .mars-lander-root #flag, .mars-lander-root #flag::before, .mars-lander-root #flag::after, 
.mars-lander-root #top_shading_1, .mars-lander-root #top_shading_2, .mars-lander-root #top_shading_3, 
.mars-lander-root #top_shading_4, .mars-lander-root #top_shading_5, .mars-lander-root #top_shading_6, 
.mars-lander-root #top_shading_7, .mars-lander-root #top_shading_8,
.mars-lander-root #fuel_tank, .mars-lander-root .vernier_3way_left, .mars-lander-root .vernier_3way_front, 
.mars-lander-root #hard_drive::before, .mars-lander-root #router, .mars-lander-root #router::before, 
.mars-lander-root #router::after, .mars-lander-root #doppler_radar {
  position: absolute
}

.mars-lander-root .solar_panel_center::before, .mars-lander-root #vernier_3Way_thrust, 
.mars-lander-root .interior_shade.window_left, .mars-lander-root .interior_shade, 
.mars-lander-root #satellite_pole::before, .mars-lander-root #left_foot, .mars-lander-root #right_foot, 
.mars-lander-root .foot, .mars-lander-root .foot::after,
.mars-lander-root #doppler_power_supply, .mars-lander-root #doppler_power_supply::before, 
.mars-lander-root #doppler_power_supply::after, .mars-lander-root #wifi::before, .mars-lander-root #wifi::after, 
.mars-lander-root #doppler_arm, .mars-lander-root #doppler_yoke, .mars-lander-root #doppler_yoke::before,
.mars-lander-root #doppler_yoke::after, .mars-lander-root .doppler_transponder, .mars-lander-root .vernier_3way_nozzles, 
.mars-lander-root .vernier_3way_right, .mars-lander-root #doppler_plate, .mars-lander-root .doppler_transponder_2, 
.mars-lander-root .composite_top_bottom, .mars-lander-root .composite_top_bottom::before,
.mars-lander-root .composite_top_bottom_2, .mars-lander-root .composite_bottom_container_right {
  position: absolute
}

.mars-lander-root .composite_bottom_container_left, .mars-lander-root .hex_arm_3::before, 
.mars-lander-root .hex_arm_6::before, .mars-lander-root .cylinder_middle.window_left::after, 
.mars-lander-root #mid_shading_2::after {
  position: absolute
}

.mars-lander-root #propulsion, .mars-lander-root #propulsion::before, 
.mars-lander-root #propulsion::after, .mars-lander-root #vernier_3Way_thrust { opacity: 0 }

.mars-lander-root #climate_controller::before, .mars-lander-root #satellite_dish::before, 
.mars-lander-root #satellite_dish::after, .mars-lander-root .vernier_3way::before, 
.mars-lander-root .vernier_3way::after,
.mars-lander-root .cylinder_middle::before, .mars-lander-root #ME_logo::before, 
.mars-lander-root #ME_logo::after, .mars-lander-root #propulsion::before, 
.mars-lander-root #propulsion::after, .mars-lander-root .hinge::before, .mars-lander-root .slots_top::before,
.mars-lander-root .slots_bottom::before, .mars-lander-root .composite_top_top::before, 
.mars-lander-root .composite_top_top::after, .mars-lander-root #hard_drive::before, 
.mars-lander-root #router::before, .mars-lander-root #router::after, .mars-lander-root .solar_panel_center::before, 
.mars-lander-root #satellite_pole::before,
.mars-lander-root .foot::after, .mars-lander-root .vernier_3way_front::after, 
.mars-lander-root .vernier_3way_front::before, .mars-lander-root .vernier_3way_front_left::after, 
.mars-lander-root #doppler_power_supply::before, .mars-lander-root #doppler_power_supply::after, 
.mars-lander-root #wifi::before {
  content: ""
}

.mars-lander-root #wifi::after, .mars-lander-root #doppler_yoke::before, 
.mars-lander-root #doppler_yoke::after, .mars-lander-root .composite_top_bottom::before, 
.mars-lander-root .hex_arm_3::before, .mars-lander-root .hex_arm_6::before, 
.mars-lander-root .cylinder_middle.window_left::after,
.mars-lander-root #mid_shading_2::after { content: "" }

.mars-lander-root #cylinder_container, .mars-lander-root #cylinder_container .cylinder_side, 
.mars-lander-root #cylinder_container .cylinder_side .rocket_bracket, .mars-lander-root #cylinder_top_silver, 
.mars-lander-root .cylinder_top, .mars-lander-root #cylinder_interior, .mars-lander-root .nozzle_side,
.mars-lander-root #top_instruments, .mars-lander-root #satellite_dish::after, .mars-lander-root .cylinder_middle, 
.mars-lander-root .cylinder_middle.window_left, .mars-lander-root .cylinder_middle.window_dot, 
.mars-lander-root .cylinder_middle.window_right, .mars-lander-root .cylinder_middle.panel_filler,
.mars-lander-root .cylinder_middle::before, .mars-lander-root #ME_logo, .mars-lander-root #ME_logo::before, 
.mars-lander-root #ME_logo::after, .mars-lander-root .cylinder_bottom, .mars-lander-root .cylinder_bottom.bottom_panel_filler, 
.mars-lander-root .cylinder_bottom.rounded_corners_left,
.mars-lander-root .cylinder_bottom.rounded_corners_right, .mars-lander-root .hook, .mars-lander-root #nozzle, 
.mars-lander-root .hinge, .mars-lander-root .vernier_thruster, .mars-lander-root .vernier_nozzle, 
.mars-lander-root .circular_side, .mars-lander-root .vernier_nozzle_side, .mars-lander-root .vernier_bracket, 
.mars-lander-root .vernier_plate {
  justify-content: center
}

.mars-lander-root #propulsion, .mars-lander-root #propulsion::before, .mars-lander-root #propulsion::after, 
.mars-lander-root #fuel_tank, .mars-lander-root .vernier_3way_bottom, .mars-lander-root .vernier_thrust,
.mars-lander-root #doppler_power_supply, .mars-lander-root #doppler_power_supply::before, 
.mars-lander-root #doppler_power_supply::after, .mars-lander-root #doppler_arm, .mars-lander-root .composite_top, 
.mars-lander-root .composite_top_top,
.mars-lander-root .composite_top_bottom, .mars-lander-root .composite_top_bottom::before, 
.mars-lander-root .composite_top_bottom_2, .mars-lander-root .composite_top_bottom_3 { justify-content: center }

.mars-lander-root #cylinder_top_silver, .mars-lander-root #ME_logo, .mars-lander-root #ME_logo::before, 
.mars-lander-root #ME_logo::after { align-items: center }

.mars-lander-root #cylinder_container, .mars-lander-root #nozzle, .mars-lander-root .leg_top, 
.mars-lander-root .composite_top, .mars-lander-root .composite_top_top, .mars-lander-root .vernier_thruster, 
.mars-lander-root .vernier_nozzle, .mars-lander-root #propulsion, .mars-lander-root #propulsion::before, 
.mars-lander-root #propulsion::after,
.mars-lander-root #left_foot, .mars-lander-root #right_foot, .mars-lander-root .foot, 
.mars-lander-root .composite_top_bottom, .mars-lander-root .composite_top_bottom_2, 
.mars-lander-root .composite_top_bottom_3 { overflow: visible }

.mars-lander-root #satellite_dish::after, .mars-lander-root .vernier_thrust, 
.mars-lander-root .composite_top_container, .mars-lander-root .composite_top_top::after, 
.mars-lander-root .composite_top_bottom::before,
.mars-lander-root .composite_bottom_container_right, .mars-lander-root .composite_bottom_container_left, 
.mars-lander-root .composite_bottom {
  overflow: hidden
}

.mars-lander-root #cylinder_container .cylinder_side .rocket_bracket, .mars-lander-root #cylinder_top_silver, 
.mars-lander-root .cylinder_top, .mars-lander-root #cylinder_interior, .mars-lander-root .nozzle_side, 
.mars-lander-root .cylinder_middle, .mars-lander-root .cylinder_middle.window_left,
.mars-lander-root .cylinder_middle.window_dot, .mars-lander-root .cylinder_middle.window_right, 
.mars-lander-root .cylinder_middle.panel_filler, .mars-lander-root .cylinder_middle::before, 
.mars-lander-root .cylinder_bottom, .mars-lander-root #vernier_3Way_thrust,
.mars-lander-root .cylinder_bottom.bottom_panel_filler, .mars-lander-root .cylinder_bottom.rounded_corners_left, 
.mars-lander-root .cylinder_bottom.rounded_corners_right, .mars-lander-root .hook, 
.mars-lander-root .hex_arm, .mars-lander-root .leg, .mars-lander-root .leg_top,
.mars-lander-root .composite_top_top::before, .mars-lander-root .vernier_nozzle, 
.mars-lander-root .vernier_nozzle_side, .mars-lander-root #fuel_tank { backface-visibility: visible }

.mars-lander-root .pneumatic_arm_assembly, .mars-lander-root .pneumatic_hinge_top, 
.mars-lander-root .pneumatic_hinge_left, .mars-lander-root .pneumatic_hinge_right, 
.mars-lander-root .pneumatic_hinge_front, .mars-lander-root .pneumatic_arm, .mars-lander-root .hinge, 
.mars-lander-root .hinge::before, .mars-lander-root .slots_top, .mars-lander-root .slots_top::before,
.mars-lander-root .slots_bottom, .mars-lander-root .slots_bottom::before, .mars-lander-root .composite_top_top, 
.mars-lander-root .vernier_thruster, .mars-lander-root .vernier_bracket, .mars-lander-root .vernier_plate, 
.mars-lander-root .vernier_injector, .mars-lander-root #fuel_tank, .mars-lander-root #flag_container,
.mars-lander-root .vernier_3way_right, .mars-lander-root .vernier_3way_bottom, .mars-lander-root .composite_top_bottom, 
.mars-lander-root .composite_top_bottom::before, .mars-lander-root .composite_top_bottom_2, 
.mars-lander-root .composite_top_bottom_3 { backface-visibility: hidden }

.mars-lander-root #cylinder_top_silver, .mars-lander-root #satellite_dish, 
.mars-lander-root #satellite_dish::after, .mars-lander-root #left_foot, 
.mars-lander-root #right_foot, .mars-lander-root .foot, .mars-lander-root .foot::after { border-radius: 50% }

.mars-lander-root #moon_lander_container, .mars-lander-root #moon_lander, .mars-lander-root #top_instruments, 
.mars-lander-root #cylinder_container, .mars-lander-root #cylinder_container .cylinder_side, 
.mars-lander-root #cylinder_container .cylinder_side .rocket_bracket,
.mars-lander-root #cylinder_top_silver, .mars-lander-root .cylinder_top, .mars-lander-root #cylinder_interior, 
.mars-lander-root .nozzle_side, .mars-lander-root #climate_controller, .mars-lander-root #climate_controller::before, 
.mars-lander-root #satellite_dish_container, .mars-lander-root #satellite_dish,
.mars-lander-root #satellite_dish::before, .mars-lander-root #satellite_dish::after, 
.mars-lander-root #satellite_pole, .mars-lander-root .vernier_3way, .mars-lander-root .vernier_3way_front, 
.mars-lander-root .vernier_3way_left, .mars-lander-root .cylinder_middle, .mars-lander-root .cylinder_middle::before,
.mars-lander-root .label_ME, .mars-lander-root #ME_logo, .mars-lander-root #ME_logo::before, 
.mars-lander-root #router, .mars-lander-root #router::before, .mars-lander-root #router::after, 
.mars-lander-root #doppler_radar, .mars-lander-root #flag_container, .mars-lander-root #flag, 
.mars-lander-root #flag::before, .mars-lander-root #flag::after, .mars-lander-root .solar_panel_center::before {
  transform-style: preserve-3d
}

.mars-lander-root #ME_logo::after, .mars-lander-root .solar_panel_left, .mars-lander-root .solar_panel_center, 
.mars-lander-root .solar_panel_right, .mars-lander-root .cylinder_bottom, .mars-lander-root .cylinder_bottom.bottom_panel_filler, 
.mars-lander-root .cylinder_bottom.rounded_corners_left,
.mars-lander-root .cylinder_bottom.rounded_corners_right, .mars-lander-root .hook, .mars-lander-root #propulsion, 
.mars-lander-root #propulsion::before, .mars-lander-root #propulsion::after, .mars-lander-root .pneumatic_arm_assembly, 
.mars-lander-root .pneumatic_hinge, .mars-lander-root .pneumatic_hinge_top,
.mars-lander-root .pneumatic_hinge_left, .mars-lander-root .pneumatic_hinge_right, .mars-lander-root .pneumatic_hinge_front, 
.mars-lander-root .pneumatic_arm, .mars-lander-root .hex_arm, .mars-lander-root .hinge, .mars-lander-root .hinge::before, 
.mars-lander-root .slots_top, .mars-lander-root .slots_top::before, .mars-lander-root .slots_bottom,
.mars-lander-root .slots_bottom::before, .mars-lander-root .leg, .mars-lander-root #mid_shading_2::after, 
.mars-lander-root .leg_top, .mars-lander-root .composite_top, .mars-lander-root .composite_top_container, 
.mars-lander-root .composite_top_top, .mars-lander-root .composite_top_top::before, .mars-lander-root .composite_top_top::after {
  transform-style: preserve-3d
}

.mars-lander-root .vernier_thruster, .mars-lander-root .vernier_bracket, .mars-lander-root .vernier_plate, 
.mars-lander-root .vernier_injector, .mars-lander-root .vernier_nozzle, .mars-lander-root .circular_side, 
.mars-lander-root .vernier_nozzle_side, .mars-lander-root .vernier_thrust, .mars-lander-root #top_shading_1, 
.mars-lander-root #top_shading_2,
.mars-lander-root #top_shading_3, .mars-lander-root #top_shading_4, .mars-lander-root #top_shading_5, 
.mars-lander-root #top_shading_6, .mars-lander-root #top_shading_7, .mars-lander-root #top_shading_8, 
.mars-lander-root #fuel_tank, .mars-lander-root #hard_drive::before, .mars-lander-root .cylinder_top,
.mars-lander-root .interior_shade, .mars-lander-root .interior_shade.window_left, .mars-lander-root #satellite_pole::before, 
.mars-lander-root #left_foot, .mars-lander-root #right_foot, .mars-lander-root .foot, .mars-lander-root .foot::after, 
.mars-lander-root #doppler_power_supply, .mars-lander-root #doppler_power_supply::before,
.mars-lander-root #doppler_power_supply::after, .mars-lander-root #wifi::before, .mars-lander-root #wifi::after, 
.mars-lander-root #doppler_arm, .mars-lander-root #doppler_yoke, .mars-lander-root #doppler_yoke::before, 
.mars-lander-root #doppler_yoke::after, .mars-lander-root .doppler_transponder, .mars-lander-root #doppler_plate {
  transform-style: preserve-3d
}

.mars-lander-root .doppler_transponder_2, .mars-lander-root .composite_top_bottom, 
.mars-lander-root .composite_top_bottom::before, .mars-lander-root .composite_top_bottom_2, 
.mars-lander-root .composite_top_bottom_3, .mars-lander-root .composite_bottom_container_right,
.mars-lander-root .composite_bottom_container_left, .mars-lander-root .composite_bottom, 
.mars-lander-root .composite_bottom.curved, .mars-lander-root .hex_arm_3::before, 
.mars-lander-root .hex_arm_6::before, .mars-lander-root .cylinder_middle.window_left::after {
  transform-style: preserve-3d
}

.mars-lander-root #hard_drive::before, .mars-lander-root #satellite_dish, 
.mars-lander-root .cylinder_bottom.bottom_panel_filler, .mars-lander-root #fuel_tank, 
.mars-lander-root .foot::after { background-size: 100% 100% }

.mars-lander-root #nozzle, .mars-lander-root .hex_arm, .mars-lander-root .hex_arm_1, 
.mars-lander-root .hex_arm_3, .mars-lander-root .composite_top_top::after, 
.mars-lander-root .vernier_3way_front { background-color: var(--me-black) }

.mars-lander-root .cylinder_top, .mars-lander-root #router::before, 
.mars-lander-root .vernier_3way_bottom, .mars-lander-root .vernier_3way_left, 
.mars-lander-root .vernier_3way_top_left { background-color: var(--me-main-color) }

.mars-lander-root .label_ME, .mars-lander-root .pneumatic_hinge_top, 
.mars-lander-root .pneumatic_hinge_front, .mars-lander-root .pneumatic_arm, 
.mars-lander-root .composite_top, .mars-lander-root .vernier_bracket, 
.mars-lander-root .vernier_plate { width: 100% }

.mars-lander-root #satellite_dish::before, .mars-lander-root #satellite_pole, 
.mars-lander-root .vernier_3way_left, .mars-lander-root .vernier_3way_top_left, 
.mars-lander-root .solar_panel_center::before, .mars-lander-root .vernier_nozzle, 
.mars-lander-root .pneumatic_hinge_left, .mars-lander-root .pneumatic_hinge_right,
.mars-lander-root .vernier_thrust { width: 0.5em }

.mars-lander-root #cylinder_container .cylinder_side .rocket_bracket, 
.mars-lander-root #vernier_3Way_thrust, .mars-lander-root .pneumatic_arm_assembly { width: 1em }

.mars-lander-root #satellite_pole::before, .mars-lander-root .vernier_3way, 
.mars-lander-root .vernier_3way_front, .mars-lander-root .vernier_3way_front::before, 
.mars-lander-root .vernier_3way_front::after, .mars-lander-root .vernier_3way_front_left, 
.mars-lander-root .vernier_3way_nozzles, .mars-lander-root .vernier_3way_bottom {
  width: 1.2em
}

.mars-lander-root .leg_top, .mars-lander-root .composite_top_container, 
.mars-lander-root .composite_top_top, .mars-lander-root .composite_top_top::after, 
.mars-lander-root .vernier_thruster, .mars-lander-root #hard_drive::before, 
.mars-lander-root #router::before, .mars-lander-root #ME_logo::after, 
.mars-lander-root .hinge, .mars-lander-root .composite_top_bottom,
.mars-lander-root .composite_top_bottom_2, .mars-lander-root .composite_top_bottom_3 { width: 1.5em }

.mars-lander-root .cylinder_bottom { width: var(--me-bottom-width) }
.mars-lander-root .nozzle_side, .mars-lander-root .interior_shade, 
.mars-lander-root .cylinder_middle { width: var(--me-panel-width) }

.mars-lander-root .interior_shade.window_left.dark_side, .mars-lander-root #flag_container, 
.mars-lander-root #flag, .mars-lander-root #flag::after, 
.mars-lander-root .cylinder_middle.window_left { width: 1.9em }

.mars-lander-root #top_shading_1, .mars-lander-root #top_shading_2, 
.mars-lander-root #top_shading_3, .mars-lander-root #top_shading_4, 
.mars-lander-root #top_shading_5, .mars-lander-root #top_shading_6, 
.mars-lander-root #top_shading_7, .mars-lander-root #top_shading_8, 
.mars-lander-root .cylinder_top, .mars-lander-root #router, 
.mars-lander-root #satellite_dish::after,
.mars-lander-root #doppler_power_supply::before, .mars-lander-root #doppler_power_supply::after, 
.mars-lander-root .leg, .mars-lander-root #propulsion, 
.mars-lander-root .composite_bottom_container_right, .mars-lander-root .composite_bottom_container_left { width: 2em }

.mars-lander-root #cylinder_container .cylinder_side .rocket_bracket, 
.mars-lander-root #router::after, .mars-lander-root #flag_container, 
.mars-lander-root .vernier_3way_left, .mars-lander-root .hook, 
.mars-lander-root .foot::after, .mars-lander-root .vernier_thrust, 
.mars-lander-root #doppler_power_supply,
.mars-lander-root #doppler_power_supply::before, .mars-lander-root #doppler_power_supply::after, 
.mars-lander-root #wifi, .mars-lander-root #wifi::before, .mars-lander-root #doppler_brace { height: 1em }

.mars-lander-root .vernier_3way, .mars-lander-root .vernier_3way_front, 
.mars-lander-root .vernier_3way_front_left, .mars-lander-root .vernier_3way_right { height: 1.2em }

.mars-lander-root .cylinder_middle, .mars-lander-root .interior_shade { height: var(--middle-height) }

.mars-lander-root .cylinder_top, .mars-lander-root #hard_drive, 
.mars-lander-root #hard_drive::before, .mars-lander-root #router, 
.mars-lander-root #router::before, .mars-lander-root #satellite_dish::before, 
.mars-lander-root .vernier_thruster { height: 2.5em }

.mars-lander-root .composite_bottom_container_right, 
.mars-lander-root .composite_bottom_container_left, 
.mars-lander-root .composite_bottom.curved { height: 3em }

.mars-lander-root #propulsion, .mars-lander-root #satellite_pole, 
.mars-lander-root .cylinder_bottom { height: 5em }

.mars-lander-root .label_ME, .mars-lander-root .pneumatic_hinge_front, 
.mars-lander-root .pneumatic_arm, .mars-lander-root .hex_arm, .mars-lander-root .leg { height: 100% }

.mars-lander-root #top_shading_2, .mars-lander-root #top_shading_3, 
.mars-lander-root #top_shading_4, .mars-lander-root #top_shading_5, 
.mars-lander-root #top_shading_6, .mars-lander-root #top_shading_7, 
.mars-lander-root #top_shading_8, .mars-lander-root #climate_controller::before, 
.mars-lander-root #router::after, .mars-lander-root #satellite_dish,
.mars-lander-root #flag_container, .mars-lander-root #label_M, 
.mars-lander-root .leg, .mars-lander-root .leg_top, 
.mars-lander-root .pneumatic_hinge_top, .mars-lander-root .pneumatic_hinge_front, 
.mars-lander-root .vernier_3way, .mars-lander-root .vernier_3way_front, 
.mars-lander-root .vernier_3way_left, .mars-lander-root .composite_bottom,
.mars-lander-root .composite_top_top::before, .mars-lander-root .foot::after, 
.mars-lander-root .vernier_3way_bottom, .mars-lander-root .vernier_3way_front::before, 
.mars-lander-root .vernier_3way_front::after, .mars-lander-root .vernier_3way_nozzles, 
.mars-lander-root .composite_bottom_container_left,
.mars-lander-root .vernier_3way_front_left::after, .mars-lander-root #doppler_power_supply, 
.mars-lander-root .composite_bottom_container_right {
  left: 0
}

.mars-lander-root #doppler_yoke::before, .mars-lander-root .hex_arm_3::before, 
.mars-lander-root .hex_arm_6::before { left: 0 }
.mars-lander-root .composite_bottom.curved { left: -0.6em }
.mars-lander-root #moon_lander, .mars-lander-root .vernier_3way_right { right: 0 }

.mars-lander-root #moon_lander, .mars-lander-root .interior_shade, 
.mars-lander-root #flag_container, .mars-lander-root #ME_logo::before, 
.mars-lander-root #ME_logo::after, .mars-lander-root .vernier_3way_bottom, 
.mars-lander-root .vernier_3way_front, .mars-lander-root .pneumatic_hinge, 
.mars-lander-root .composite_top, .mars-lander-root .pneumatic_hinge_top,
.mars-lander-root .pneumatic_hinge_front, .mars-lander-root .hinge::before, 
.mars-lander-root .composite_top_top, .mars-lander-root .composite_top_top::before, 
.mars-lander-root .vernier_bracket, .mars-lander-root .vernier_nozzle, 
.mars-lander-root .vernier_3way_right, .mars-lander-root .vernier_3way_front::before,
.mars-lander-root .vernier_3way_front::after, .mars-lander-root .vernier_3way_nozzles, 
.mars-lander-root .vernier_3way_front_left::after, .mars-lander-root #doppler_power_supply::before, 
.mars-lander-root #doppler_power_supply::after, .mars-lander-root #wifi::before, 
.mars-lander-root #wifi, .mars-lander-root .composite_top_bottom, 
.mars-lander-root .composite_bottom { top: 0 }

.mars-lander-root #top_shading_1, .mars-lander-root #top_shading_2, 
.mars-lander-root #top_shading_3, .mars-lander-root #top_shading_4, 
.mars-lander-root #top_shading_5, .mars-lander-root #top_shading_6, 
.mars-lander-root #top_shading_7, .mars-lander-root #top_shading_8, 
.mars-lander-root #flag::after, .mars-lander-root .vernier_3way_left { top: 0.1em }

.mars-lander-root .cylinder_middle { top: 9.05em }
.mars-lander-root #propulsion, .mars-lander-root .cylinder_bottom { top: 18em }

.mars-lander-root #cylinder_container, .mars-lander-root #hard_drive, 
.mars-lander-root #router, .mars-lander-root #climate_controller, 
.mars-lander-root #climate_controller::before, .mars-lander-root #satellite_pole, 
.mars-lander-root #satellite_pole::before, .mars-lander-root .slots_bottom::before,
.mars-lander-root #satellite_dish_container, .mars-lander-root .leg, 
.mars-lander-root .leg_top, .mars-lander-root #doppler_yoke::before, 
.mars-lander-root .composite_bottom.curved, .mars-lander-root .doppler_transponder_2, 
.mars-lander-root #doppler_plate, .mars-lander-root .hex_arm_3::before, 
.mars-lander-root .hex_arm_6::before {
  bottom: 0
}

.mars-lander-root .interior_shade { transform: translateZ(-0.1em) }

.mars-lander-root #top_shading_1, .mars-lander-root #top_shading_2, 
.mars-lander-root #top_shading_3, .mars-lander-root #top_shading_4, 
.mars-lander-root #top_shading_5, .mars-lander-root #top_shading_6, 
.mars-lander-root #top_shading_7, .mars-lander-root #top_shading_8 {
  height: 101%; transform: translateZ(0.05em)
}

.mars-lander-root .hinge, .mars-lander-root #satellite_dish::after { transform: translateZ(0.1em) }
.mars-lander-root .cylinder_middle, .mars-lander-root #ME_logo { transform: translateZ(8.8em) }

.mars-lander-root #moon_lander_container {
  right: 8em; top: 5em; width: 40em; height: 40em;
  transform: translateZ(8em); perspective: 60em
}

.mars-lander-root #moon_lander {
  width: 40em; height: 40em;
  animation: mars_landing 16s ease-in-out -1s forwards
}

@keyframes mars_landing {
  0%   { transform: translateY(-50em) rotateY(30deg) }
  96%  { transform: translateY(.3em) rotateY(-30deg) }
  99%  { transform: translateY(-.15em) rotateY(-30deg) }
  100% { transform: translateY(0em) rotateY(-30deg) }
}

.mars-lander-root #cylinder_container { left: 11.5em; width: 17em; height: 40em }

.mars-lander-root #cylinder_container .cylinder_side .rocket_bracket {
  top: 29.2em;
  background-color: var(--me-grey);
  transform: rotateX(20deg) translateZ(2em)
}

.mars-lander-root #circular_side_1  { transform: rotateY(0deg)   }
.mars-lander-root #circular_side_2  { transform: rotateY(45deg)  }
.mars-lander-root #circular_side_3  { transform: rotateY(90deg)  }
.mars-lander-root #circular_side_4  { transform: rotateY(135deg) }
.mars-lander-root #circular_side_5  { transform: rotateY(180deg) }
.mars-lander-root #circular_side_6  { transform: rotateY(225deg) }
.mars-lander-root #circular_side_7  { transform: rotateY(270deg) }
.mars-lander-root #circular_side_8  { transform: rotateY(315deg) }

.mars-lander-root #cylinder_side_1  { transform: rotateY(10deg)  }
.mars-lander-root #cylinder_side_2  { transform: rotateY(20deg)  }
.mars-lander-root #cylinder_side_3  { transform: rotateY(30deg)  }
.mars-lander-root #cylinder_side_4  { transform: rotateY(40deg)  }
.mars-lander-root #cylinder_side_5  { transform: rotateY(50deg)  }
.mars-lander-root #cylinder_side_6  { transform: rotateY(60deg)  }
.mars-lander-root #cylinder_side_7  { transform: rotateY(70deg)  }
.mars-lander-root #cylinder_side_8  { transform: rotateY(80deg)  }
.mars-lander-root #cylinder_side_9  { transform: rotateY(90deg)  }
.mars-lander-root #cylinder_side_10 { transform: rotateY(100deg) }
.mars-lander-root #cylinder_side_11 { transform: rotateY(110deg) }
.mars-lander-root #cylinder_side_12 { transform: rotateY(120deg) }
.mars-lander-root #cylinder_side_13 { transform: rotateY(130deg) }
.mars-lander-root #cylinder_side_14 { transform: rotateY(140deg) }
.mars-lander-root #cylinder_side_15 { transform: rotateY(150deg) }
.mars-lander-root #cylinder_side_16 { transform: rotateY(160deg) }
.mars-lander-root #cylinder_side_17 { transform: rotateY(170deg) }
.mars-lander-root #cylinder_side_18 { transform: rotateY(180deg) }
.mars-lander-root #cylinder_side_19 { transform: rotateY(190deg) }
.mars-lander-root #cylinder_side_20 { transform: rotateY(200deg) }
.mars-lander-root #cylinder_side_21 { transform: rotateY(210deg) }
.mars-lander-root #cylinder_side_22 { transform: rotateY(220deg) }
.mars-lander-root #cylinder_side_23 { transform: rotateY(230deg) }
.mars-lander-root #cylinder_side_24 { transform: rotateY(240deg) }
.mars-lander-root #cylinder_side_25 { transform: rotateY(250deg) }
.mars-lander-root #cylinder_side_26 { transform: rotateY(260deg) }
.mars-lander-root #cylinder_side_27 { transform: rotateY(270deg) }
.mars-lander-root #cylinder_side_28 { transform: rotateY(280deg) }
.mars-lander-root #cylinder_side_29 { transform: rotateY(290deg) }
.mars-lander-root #cylinder_side_30 { transform: rotateY(300deg) }
.mars-lander-root #cylinder_side_31 { transform: rotateY(310deg) }
.mars-lander-root #cylinder_side_32 { transform: rotateY(320deg) }
.mars-lander-root #cylinder_side_33 { transform: rotateY(330deg) }
.mars-lander-root #cylinder_side_34 { transform: rotateY(340deg) }
.mars-lander-root #cylinder_side_35 { transform: rotateY(350deg) }
.mars-lander-root #cylinder_side_36 { transform: rotateY(0deg)   }

.mars-lander-root #cylinder_top_silver {
  top: -1em; width: 15.7em; height: 15.7em;
  background-color: rgba(195,175,150,1);
  transform: rotateX(-90deg)
}

.mars-lander-root .cylinder_top {
  top: 11.0472399445215em;
  border-bottom: 0.1em solid var(--me-main-color);
  transform: rotateX(28deg) translateZ(9.25em)
}

.mars-lander-root #cylinder_interior {
  top: 26.5em; width: 5em; height: 6em;
  background:
    linear-gradient(70deg, var(--me-transparent) 0%, var(--me-transparent) 50%, var(--me-main-shade-3) 50%, var(--me-main-shade-3) 100%) no-repeat,
    linear-gradient(110deg, var(--me-main-shade-3) 0%, var(--me-main-shade-3) 50%, var(--me-transparent) 50%, var(--me-transparent) 100%) no-repeat,
    linear-gradient(110deg, var(--me-transparent) 0%, var(--me-transparent) 50%, var(--me-main-shade-3) 50%, var(--me-main-shade-3) 100%) no-repeat,
    linear-gradient(70deg, var(--me-main-shade-3) 0%, var(--me-main-shade-3) 50%, var(--me-transparent) 50%, var(--me-transparent) 100%) no-repeat;
  transform: translateZ(1em);
  background-size: 2.75em 1.3em, 2.75em 1.3em, 3.1em 1.3em, 3.1em 1.3em;
  background-position: 0.1em 0, 2.85em 0, 0 1.3em, 3.1em 1.3em
}

.mars-lander-root .nozzle_side {
  top: 27em; height: 8em;
  background:
    linear-gradient(180deg, var(--me-main-shade-3) 0%, var(--me-main-shade-3) 100%) no-repeat,
    linear-gradient(180deg, var(--me-black) 0%, var(--me-black) 100%);
  background-size: 3em 2.5em, var(--me-panel-width) 5.5em;
  background-position: 0 0, 0 2.5em;
  transform: rotateX(20deg) translateZ(0.75em);
  animation: mars_fuel_tank_glow 10s forwards 5s ease-in-out
}

@keyframes mars_fuel_tank_glow {
  0%   { box-shadow: none }
  50%  { box-shadow: 0 0 1.5em 0.5em rgba(200,100,30,0.4) }
  100% { box-shadow: 0 0 0.5em 0.1em rgba(180,80,20,0.2) }
}

.mars-lander-root .interior_shade {
  background: linear-gradient(
    180deg,
    var(--me-interior-shade-top) 0%,
    var(--me-interior-shade-top) var(--window-top),
    var(--me-transparent) var(--window-top),
    var(--me-transparent) 93%,
    var(--me-interior-shade-bottom) 93%,
    var(--me-interior-shade-bottom) 100%
  );
}

.mars-lander-root .interior_shade.panel_filler {
  background: linear-gradient(180deg, var(--me-interior-shade-top) 0%, var(--me-interior-shade-bottom) 100%) no-repeat;
}
.mars-lander-root .interior_shade.panel_filler.dark_side {
  background: linear-gradient(180deg, var(--me-interior-shade-bottom) 0%, var(--me-interior-shade-bottom) 100%) no-repeat;
}

.mars-lander-root #top_instruments { top:-2em; width:15em; height:9.25em }

.mars-lander-root #satellite_dish_container { left:6em; width:6em; height:8em; transform:rotateY(30deg) }
.mars-lander-root #satellite_dish {
  bottom:3em; width:6em; height:6em;
  background-color:rgba(130,105,80,1);
  background: radial-gradient(.23em .23em ellipse at 30% 90%, rgba(30,15,5,1) 1.5em, rgba(55,35,15,1) 3em, rgba(118,95,70,1) 5.8em, rgba(118,95,70,1) 6em) no-repeat;
  box-shadow: inset .05em .05em 0 0 rgba(35,20,8,1), inset -.1em -.1em 0 0 rgba(50,30,12,1);
  transform: translateZ(.1em) rotateX(40deg) rotateY(10deg) rotateZ(20deg)
}

.mars-lander-root .leg { height:17.25em; transform-origin:bottom center; animation:mars_dropping_leg 15s ease-in-out 0s forwards }
@keyframes mars_dropping_leg {
  0%   { transform:translateZ(0) }
  100% { transform:translateX(.05em) translateY(-.25em) translateZ(0) rotateX(-130deg) }
}

.mars-lander-root .foot {
  top:3em; left:-.35em; height:1.5em; width:2.5em;
  background:
    linear-gradient(180deg, var(--me-black) 50%, var(--me-transparent) 50%) no-repeat,
    radial-gradient(2em .25em ellipse at 50% 50%, var(--me-transparent) .25em, rgba(55,28,10,1) .25em, var(--me-medium-grey) 1em, var(--me-transparent) 1.5em) no-repeat;
}
.mars-lander-root #left_foot   { transform:rotateX(-50deg) rotateY(60deg) translateZ(1em) }
.mars-lander-root #center_foot { transform:rotateX(-50deg) rotateY(-30deg) translateZ(-.1em) }
.mars-lander-root #right_foot  { transform:rotateX(-40deg) rotateY(-80deg) translateZ(1em) }

.mars-lander-root #propulsion {
  background-color: rgba(220,90,20,.75);
  border-radius:0 0 50% 50% / 0 0 80% 80%;
  box-shadow:
    inset 0 0 6em 6em rgba(240,110,30,1),
    0 4em 6em 6em rgba(200,70,10,1);
  animation: mars_nozzle_propulsion 15s ease-in-out 0s forwards
}
@keyframes mars_nozzle_propulsion {
  0%   { opacity:.5 }
  25%  { opacity:.8 }
  50%  { opacity:.3 }
  75%  { opacity:.8 }
  100% { opacity:0 }
}
`;

export interface MarsLanderProps {
  className?: string;
  style?: React.CSSProperties;
  onClose?: () => void;
}

export default function MarsLander({ className, style, onClose }: MarsLanderProps) {
  useEffect(() => {
    const styleEl = document.createElement("style");
    styleEl.innerHTML = marsCSS;
    document.head.appendChild(styleEl);
    return () => {
      if (document.head.contains(styleEl)) {
        document.head.removeChild(styleEl);
      }
    };
  }, []);

  return (
    <div
      className={`mars-lander-root relative w-full h-full overflow-hidden ${className || ""}`}
      style={style}
    >
      {/* Return button if provided */}
      {onClose && (
        <div className="absolute top-5 right-5 z-50 pointer-events-auto">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-2 rounded-full border border-orange-500/80 bg-space-950/90 px-4 py-2 text-xs font-black uppercase tracking-wider text-orange-400 shadow-[0_0_25px_rgba(255,100,20,0.5)] backdrop-blur transition hover:scale-105 active:scale-95 cursor-pointer font-mono"
          >
            <span>✕</span>
            <span>Return to Surface</span>
          </button>
        </div>
      )}

      {/* Info banner */}
      <div className="absolute top-5 left-5 z-40 pointer-events-none font-mono">
        <div className="rounded-2xl border border-orange-500/40 bg-space-950/85 px-4 py-2.5 backdrop-blur-xl shadow-2xl">
          <div className="flex items-center gap-2 text-orange-400 text-xs font-black uppercase tracking-widest">
            <span className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
            <span>MARS DESCENT LANDER MODULE</span>
          </div>
          <p className="text-[10px] text-regolith-400 mt-0.5">
            MRO REFERENCE MATRIX · ATMOSPHERIC DESCENT &amp; TOUCHDOWN
          </p>
        </div>
      </div>

      <div id="space">
        <div id="stars"></div>
        <div id="moon">
          <div id="moon_atmosphere">
            <div id="earth_rise_glow"></div>
            <div id="label_container">
              <div id="me_label_1">REDEFINING</div>
              <div id="me_label_2">POSSIBLE</div>
            </div>
          </div>
          <div id="moon_surface">
            <div id="moon_background">
              <div id="hills"></div>
            </div>
            <div id="moon_foreground">
              <div id="craters">
                <div id="crater_one"></div>
                <div id="crater_two"></div>
                <div id="crater_three"></div>
              </div>
              <div id="moon_lander_container">
                <div id="moon_lander">
                  <div id="cylinder_container">
                    <div id="top_instruments">
                      <div id="climate_controller"></div>
                      <div id="hard_drive"></div>
                      <div id="router"></div>
                      <div id="satellite_dish_container">
                        <div id="satellite_dish"></div>
                        <div id="satellite_pole"></div>
                      </div>
                      <div id="doppler_radar">
                        <div id="doppler_power_supply"></div>
                        <div id="wifi"></div>
                        <div id="doppler_arm">
                          <div id="doppler_yoke"></div>
                          <div id="doppler_brace"></div>
                        </div>
                        <div className="doppler_transponder" id="doppler_radar_two">
                          <div id="doppler_plate"></div>
                          <div className="doppler_transponder_2" id="doppler_radar_two_2"></div>
                          <div className="doppler_transponder_2"></div>
                        </div>
                        <div className="doppler_transponder" id="doppler_radar_one"></div>
                      </div>
                    </div>
                    <div id="cylinder_top_silver"></div>
                    <div id="cylinder_interior"></div>
                    <div id="fuel_tank"></div>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                      <div key={`cs${n}`} className="cylinder_side" id={`circular_side_${n}`}>
                        <div className="nozzle_side"></div>
                      </div>
                    ))}
                    <div className="cylinder_side" id="cylinder_side_1">
                      <div className="cylinder_top"></div>
                      <div className="cylinder_middle window_left closest_left">
                        <div className="label_ME" id="label_N">
                          N
                        </div>
                      </div>
                      <div className="cylinder_bottom"></div>
                    </div>
                    <div className="cylinder_side" id="cylinder_side_2">
                      <div className="cylinder_top"></div>
                      <div className="cylinder_middle window_dot">
                        <div className="label_ME" id="label_E_1">
                          E
                        </div>
                        <div className="label_ME" id="label_X">
                          X
                        </div>
                        <div className="solar_panel_left"></div>
                      </div>
                      <div className="cylinder_bottom rounded_corners_right"></div>
                    </div>
                    <div className="cylinder_side" id="cylinder_side_3">
                      <div className="cylinder_top">
                        <div id="top_shading_1"></div>
                      </div>
                      <div className="cylinder_middle" id="mid_shading_1">
                        <div className="label_ME" id="label_P">
                          P
                        </div>
                        <div className="label_ME" id="label_R">
                          R
                        </div>
                      </div>
                      <div className="cylinder_bottom bottom_panel_filler"></div>
                      <div className="vernier_thruster">
                        <div className="vernier_bracket">
                          <div className="vernier_plate"></div>
                        </div>
                        <div className="vernier_nozzle">
                          <div className="vernier_thrust"></div>
                        </div>
                      </div>
                    </div>
                    <div className="cylinder_side" id="cylinder_side_4">
                      <div className="cylinder_top">
                        <div id="top_shading_2"></div>
                      </div>
                      <div className="cylinder_middle window_right" id="mid_shading_2">
                        <div className="label_ME" id="label_E_2">
                          E
                        </div>
                        <div className="label_ME" id="label_S_1">
                          S
                        </div>
                        <div className="label_ME" id="label_S_2">
                          S
                        </div>
                        <div className="solar_panel_center"></div>
                      </div>
                      <div className="cylinder_bottom rounded_corners_left"></div>
                    </div>
                    <div className="cylinder_side" id="cylinder_side_5">
                      <div className="cylinder_top">
                        <div id="top_shading_3"></div>
                      </div>
                      <div className="cylinder_middle window_left" id="mid_shading_3">
                        <div className="vernier_3way">
                          <div className="vernier_3way_front"></div>
                        </div>
                      </div>
                      <div className="cylinder_bottom"></div>
                      <div className="rocket_bracket"></div>
                    </div>
                    <div className="cylinder_side" id="cylinder_side_6">
                      <div className="cylinder_top">
                        <div id="top_shading_4"></div>
                      </div>
                      <div className="cylinder_middle window_dot" id="mid_shading_4">
                        <div className="solar_panel_right"></div>
                      </div>
                      <div className="cylinder_bottom rounded_corners_right"></div>
                    </div>
                    <div className="cylinder_side" id="cylinder_side_7">
                      <div className="cylinder_top">
                        <div id="top_shading_5"></div>
                      </div>
                      <div className="cylinder_middle" id="mid_shading_5"></div>
                      <div className="cylinder_bottom bottom_panel_filler"></div>
                      <div id="ME_logo"></div>
                    </div>
                    <div className="cylinder_side" id="cylinder_side_8">
                      <div className="cylinder_top">
                        <div id="top_shading_6"></div>
                      </div>
                      <div className="cylinder_middle window_right" id="mid_shading_6"></div>
                      <div className="cylinder_bottom rounded_corners_left"></div>
                    </div>
                    <div className="cylinder_side" id="cylinder_side_9">
                      <div className="cylinder_top">
                        <div id="top_shading_7"></div>
                      </div>
                      <div className="cylinder_middle panel_filler" id="mid_shading_7">
                        <div className="hinge">
                          <div className="slots_top"></div>
                          <div className="slots_bottom"></div>
                          <div className="pneumatic_arm_assembly">
                            <div className="pneumatic_hinge">
                              <div className="pneumatic_hinge_top"></div>
                              <div className="pneumatic_hinge_left"></div>
                              <div className="pneumatic_hinge_right"></div>
                              <div className="pneumatic_hinge_front"></div>
                            </div>
                            <div className="pneumatic_arm">
                              {[1, 2, 3, 4, 5, 6].map((idx) => (
                                <div key={idx} className={`hex_arm hex_arm_${idx}`}></div>
                              ))}
                            </div>
                          </div>
                          <div className="leg">
                            <div className="leg_top">
                              <div className="composite_top">
                                <div className="composite_top_container">
                                  <div className="composite_top_top"></div>
                                </div>
                                <div className="composite_top_bottom"></div>
                                <div className="composite_top_bottom_2"></div>
                                <div className="composite_top_bottom_3"></div>
                              </div>
                              <div className="composite_bottom_container_right">
                                <div className="composite_bottom curved"></div>
                              </div>
                              <div className="composite_bottom_container_left">
                                <div className="composite_bottom curved"></div>
                              </div>
                            </div>
                            <div className="foot" id="right_foot"></div>
                          </div>
                        </div>
                      </div>
                      <div className="cylinder_bottom"></div>
                    </div>
                    {[10, 11, 12, 13, 14, 15, 16, 17].map((n) => (
                      <div key={n} className="cylinder_side" id={`cylinder_side_${n}`}>
                        <div className="cylinder_top">
                          {n <= 17 && n >= 10 ? (
                            <div id={`top_shading_${n - 9 > 8 ? "" : n - 9}`}></div>
                          ) : null}
                        </div>
                        <div
                          className={`cylinder_middle${
                            n === 10
                              ? " window_left"
                              : n === 11
                                ? " window_dot"
                                : n === 12
                                  ? ""
                                  : n === 13
                                    ? " window_right"
                                    : n === 14
                                      ? " window_left"
                                      : n === 15
                                        ? " window_dot"
                                        : n === 16
                                          ? ""
                                          : " window_right"
                          }`}
                          id={n === 10 ? "mid_shading_8" : n === 11 ? "mid_shading_9" : ""}
                        >
                          {n === 11 && <div className="solar_panel_left"></div>}
                          {n === 11 && (
                            <div className="vernier_thruster">
                              <div className="vernier_bracket">
                                <div className="vernier_plate"></div>
                              </div>
                              <div className="vernier_nozzle" id="vernier_right">
                                <div className="vernier_thrust"></div>
                              </div>
                            </div>
                          )}
                          {n === 13 && <div className="solar_panel_center"></div>}
                          {n === 14 && <div className="interior_shade window_left"></div>}
                          {n === 15 && (
                            <>
                              <div className="solar_panel_right"></div>
                              <div className="interior_shade"></div>
                            </>
                          )}
                          {(n === 16 || n === 17) && (
                            <div
                              className={`interior_shade${n === 17 ? " window_right" : ""}`}
                            ></div>
                          )}
                        </div>
                        <div
                          className={`cylinder_bottom${
                            n === 11 || n === 14
                              ? " bottom_panel_filler"
                              : n === 10 || n === 13
                                ? " rounded_corners_right"
                                : n === 12 || n === 15
                                  ? " rounded_corners_left"
                                  : ""
                          }`}
                        ></div>
                        {n === 14 && <div className="rocket_bracket"></div>}
                      </div>
                    ))}
                    {[18, 19, 20, 21, 22, 23, 24, 25, 26].map((n) => (
                      <div key={n} className="cylinder_side" id={`cylinder_side_${n}`}>
                        <div className="cylinder_top"></div>
                        <div
                          className={`cylinder_middle${
                            n === 18
                              ? " panel_filler"
                              : n === 19
                                ? " window_left"
                                : n === 20
                                  ? " window_dot"
                                  : n === 21
                                    ? ""
                                    : n === 22
                                      ? " window_right"
                                      : n === 23
                                        ? " window_left"
                                        : n === 24
                                          ? " window_dot"
                                          : n === 25
                                            ? ""
                                            : " window_right"
                          }`}
                        >
                          {n === 18 && <div className="interior_shade"></div>}
                          {n === 19 && <div className="interior_shade"></div>}
                          {n === 19 && (
                            <div className="vernier_thruster">
                              <div className="vernier_bracket">
                                <div className="vernier_plate"></div>
                              </div>
                              <div className="vernier_nozzle">
                                <div className="vernier_thrust"></div>
                              </div>
                            </div>
                          )}
                          {n === 20 && (
                            <>
                              <div className="solar_panel_left"></div>
                              <div className="interior_shade"></div>
                            </>
                          )}
                          {n === 21 && <div className="interior_shade"></div>}
                          {n === 22 && (
                            <>
                              <div className="solar_panel_center"></div>
                              <div className="interior_shade"></div>
                            </>
                          )}
                          {n === 23 && <div className="interior_shade"></div>}
                          {n === 24 && (
                            <>
                              <div className="solar_panel_right"></div>
                              <div className="interior_shade"></div>
                            </>
                          )}
                          {n === 25 && <div className="interior_shade dark_side"></div>}
                          {n === 26 && (
                            <div className="interior_shade window_right dark_side"></div>
                          )}
                        </div>
                        <div
                          className={`cylinder_bottom${
                            n === 19 || n === 23
                              ? " bottom_panel_filler"
                              : n === 18 || n === 22
                                ? " rounded_corners_right"
                                : n === 20 || n === 24
                                  ? " rounded_corners_left"
                                  : ""
                          }`}
                        ></div>
                        {n === 23 && <div className="rocket_bracket"></div>}
                      </div>
                    ))}
                    <div className="cylinder_side" id="cylinder_side_27">
                      <div className="cylinder_top"></div>
                      <div className="cylinder_middle panel_filler">
                        <div className="hinge">
                          <div className="slots_top"></div>
                          <div className="slots_bottom"></div>
                          <div className="pneumatic_arm_assembly">
                            <div className="pneumatic_hinge">
                              <div className="pneumatic_hinge_top"></div>
                              <div className="pneumatic_hinge_left"></div>
                              <div className="pneumatic_hinge_right"></div>
                              <div className="pneumatic_hinge_front"></div>
                            </div>
                            <div className="pneumatic_arm">
                              {[1, 2, 3, 4, 5, 6].map((idx) => (
                                <div key={idx} className={`hex_arm hex_arm_${idx}`}></div>
                              ))}
                            </div>
                          </div>
                          <div className="leg">
                            <div className="leg_top">
                              <div className="composite_top">
                                <div className="composite_top_container">
                                  <div className="composite_top_top"></div>
                                </div>
                                <div className="composite_top_bottom"></div>
                                <div className="composite_top_bottom_2"></div>
                                <div className="composite_top_bottom_3"></div>
                              </div>
                              <div className="composite_bottom_container_right">
                                <div className="composite_bottom curved"></div>
                              </div>
                              <div className="composite_bottom_container_left">
                                <div className="composite_bottom curved"></div>
                              </div>
                            </div>
                            <div className="foot" id="left_foot"></div>
                          </div>
                        </div>
                        <div className="interior_shade panel_filler dark_side"></div>
                      </div>
                      <div className="cylinder_bottom bottom_panel_filler"></div>
                    </div>
                    {[28, 29, 30].map((n) => (
                      <div key={n} className="cylinder_side" id={`cylinder_side_${n}`}>
                        <div className="cylinder_top"></div>
                        <div
                          className={`cylinder_middle${
                            n === 28 ? " window_left" : n === 29 ? " window_dot" : ""
                          }`}
                        >
                          {n === 28 && <div className="interior_shade window_left dark_side"></div>}
                          {n === 29 && (
                            <>
                              <div className="solar_panel_left"></div>
                              <div className="interior_shade dark_side"></div>
                            </>
                          )}
                        </div>
                        <div
                          className={`cylinder_bottom${
                            n === 28
                              ? " rounded_corners_left"
                              : n === 29
                                ? ""
                                : " rounded_corners_right"
                          }`}
                        ></div>
                      </div>
                    ))}
                    <div className="cylinder_side" id="cylinder_side_31">
                      <div className="cylinder_top"></div>
                      <div className="cylinder_middle window_right">
                        <div className="solar_panel_center" id="spc_angled"></div>
                      </div>
                      <div className="cylinder_bottom bottom_panel_filler"></div>
                      <div className="hook"></div>
                      <div className="vernier_thruster">
                        <div className="vernier_bracket">
                          <div className="vernier_plate"></div>
                        </div>
                        <div className="vernier_nozzle" id="vernier_left">
                          <div className="vernier_thrust"></div>
                        </div>
                      </div>
                    </div>
                    <div className="cylinder_side" id="cylinder_side_32">
                      <div className="cylinder_top"></div>
                      <div className="cylinder_middle window_left">
                        <div className="vernier_3way">
                          <div className="vernier_3way_front_left"></div>
                          <div className="vernier_3way_nozzles"></div>
                          <div className="vernier_3way_right"></div>
                          <div className="vernier_3way_bottom"></div>
                          <div id="vernier_3Way_thrust"></div>
                        </div>
                      </div>
                      <div className="cylinder_bottom rounded_corners_left"></div>
                      <div className="rocket_bracket"></div>
                    </div>
                    <div className="cylinder_side" id="cylinder_side_33">
                      <div className="cylinder_top"></div>
                      <div className="cylinder_middle window_dot">
                        <div className="solar_panel_right" id="spr_angled"></div>
                      </div>
                      <div className="cylinder_bottom"></div>
                    </div>
                    <div className="cylinder_side" id="cylinder_side_34">
                      <div className="cylinder_top"></div>
                      <div className="cylinder_middle">
                        <div className="label_ME" id="label_M">
                          M
                        </div>
                      </div>
                      <div className="cylinder_bottom rounded_corners_right"></div>
                    </div>
                    <div className="cylinder_side" id="cylinder_side_35">
                      <div className="cylinder_top"></div>
                      <div className="cylinder_middle window_right">
                        <div className="label_ME" id="label_O_1">
                          O
                        </div>
                      </div>
                      <div className="cylinder_bottom bottom_panel_filler"></div>
                    </div>
                    <div className="cylinder_side" id="cylinder_side_36">
                      <div className="cylinder_top">
                        <div id="flag_container">
                          <div id="flag"></div>
                        </div>
                      </div>
                      <div className="cylinder_middle panel_filler">
                        <div className="hinge">
                          <div className="slots_top"></div>
                          <div className="slots_bottom"></div>
                          <div className="pneumatic_arm_assembly">
                            <div className="pneumatic_hinge">
                              <div className="pneumatic_hinge_top"></div>
                              <div className="pneumatic_hinge_left"></div>
                              <div className="pneumatic_hinge_right"></div>
                              <div className="pneumatic_hinge_front"></div>
                            </div>
                            <div className="pneumatic_arm">
                              {[1, 2, 3, 4, 5, 6].map((idx) => (
                                <div key={idx} className={`hex_arm hex_arm_${idx}`}></div>
                              ))}
                            </div>
                          </div>
                          <div className="leg">
                            <div className="leg_top">
                              <div className="composite_top">
                                <div className="composite_top_container">
                                  <div className="composite_top_top"></div>
                                </div>
                                <div className="composite_top_bottom"></div>
                                <div className="composite_top_bottom_2"></div>
                                <div className="composite_top_bottom_3"></div>
                              </div>
                              <div className="composite_bottom_container_right">
                                <div className="composite_bottom curved"></div>
                              </div>
                              <div className="composite_bottom_container_left">
                                <div className="composite_bottom curved"></div>
                              </div>
                            </div>
                            <div className="foot" id="center_foot"></div>
                          </div>
                        </div>
                        <div className="label_ME" id="label_O_2">
                          O
                        </div>
                      </div>
                      <div className="cylinder_bottom rounded_corners_left"></div>
                    </div>
                    <div id="propulsion"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
