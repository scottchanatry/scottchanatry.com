/* ============================================================
   The crayon engine.
   One idea, used twice: a stroke is a list of points, and we
   render it in two slightly-jittered passes with soft alpha,
   which is enough to read as wax on paper.
   ============================================================ */

const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const jitter = amp => (Math.random() - 0.5) * amp;

function crayonPath(ctx, pts, color, width, amp) {
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.strokeStyle = color;
  for (const [alpha, w] of [[0.6, width], [0.32, width * 0.65]]) {
    ctx.globalAlpha = alpha;
    ctx.lineWidth = w;
    ctx.beginPath();
    ctx.moveTo(pts[0].x + jitter(amp), pts[0].y + jitter(amp));
    for (let i = 1; i < pts.length - 1; i++) {
      const mx = (pts[i].x + pts[i + 1].x) / 2 + jitter(amp);
      const my = (pts[i].y + pts[i + 1].y) / 2 + jitter(amp);
      ctx.quadraticCurveTo(pts[i].x + jitter(amp), pts[i].y + jitter(amp), mx, my);
    }
    const last = pts[pts.length - 1];
    ctx.lineTo(last.x + jitter(amp * 0.5), last.y + jitter(amp * 0.5));
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
}

function fitCanvas(canvas) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const r = canvas.getBoundingClientRect();
  canvas.width = Math.max(1, Math.round(r.width * dpr));
  canvas.height = Math.max(1, Math.round(r.height * dpr));
  const ctx = canvas.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return ctx;
}

/* ---------- 1. The underline draws itself ---------- */

function drawUnderline() {
  const canvas = document.getElementById("underline");
  const ctx = fitCanvas(canvas);
  const w = canvas.getBoundingClientRect().width;
  const h = canvas.getBoundingClientRect().height;
  const pts = [];
  const n = 26;
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    pts.push({
      x: t * w,
      y: h * 0.55 + Math.sin(t * Math.PI * 2.2) * h * 0.18 + jitter(h * 0.14)
    });
  }
  const width = Math.max(3.5, h * 0.42);

  if (reduceMotion) {
    crayonPath(ctx, pts, "#2C55D4", width, 1.1);
    return;
  }
  const t0 = performance.now();
  const dur = 650;
  (function frame(now) {
    const p = Math.min(1, (now - t0) / dur);
    const upto = Math.max(3, Math.floor(pts.length * p));
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    crayonPath(ctx, pts.slice(0, upto), "#2C55D4", width, 1.1);
    if (p < 1) requestAnimationFrame(frame);
  })(t0);
}

if (document.getElementById("underline")) drawUnderline();
let resizeTimer = null;
addEventListener("resize", () => {
  if (!resizeTimer) resizeTimer = setTimeout(() => {
    resizeTimer = null;
    if (document.getElementById("underline")) drawUnderline();
    if (!scribble.hidden) redrawStrokes();
  }, 150);
});

/* ---------- 2. The crayon you can hold ---------- */

const toggle = document.getElementById("crayonToggle");
const kit = document.getElementById("crayonKit");
const scribble = document.getElementById("scribble");
const strokes = [];            // every drawing survives resize + Done/reopen
let sctx = null;
let color = "#2C55D4";
let current = null;

function redrawStrokes() {
  sctx = fitCanvas(scribble);
  for (const s of strokes) {
    if (s.pts.length > 1) crayonPath(sctx, s.pts, s.color, 5, 1.4);
  }
}

function setCrayon(on) {
  toggle.setAttribute("aria-pressed", String(on));
  toggle.hidden = on;                    // Done / Esc close crayon mode
  scribble.hidden = !on;
  kit.hidden = !on;
  if (on) {
    redrawStrokes();
    document.getElementById("done").focus();
  } else {
    toggle.focus();
  }
}

toggle.addEventListener("click", () =>
  setCrayon(toggle.getAttribute("aria-pressed") !== "true"));

document.getElementById("done").addEventListener("click", () => setCrayon(false));

document.getElementById("wipe").addEventListener("click", () => {
  strokes.length = 0;
  sctx.clearRect(0, 0, scribble.width, scribble.height);
});

addEventListener("keydown", e => {
  if (e.key === "Escape" && !scribble.hidden) setCrayon(false);
});

for (const sw of kit.querySelectorAll(".swatch")) {
  sw.addEventListener("click", () => {
    color = sw.dataset.color;
    kit.querySelectorAll(".swatch").forEach(b =>
      b.setAttribute("aria-pressed", String(b === sw)));
  });
}

scribble.addEventListener("pointerdown", e => {
  scribble.setPointerCapture(e.pointerId);
  current = { color, pts: [{ x: e.clientX, y: e.clientY }] };
  strokes.push(current);
});

scribble.addEventListener("pointermove", e => {
  if (!current) return;
  const last = current.pts[current.pts.length - 1];
  const dx = e.clientX - last.x, dy = e.clientY - last.y;
  if (dx * dx + dy * dy < 9) return;      // thin out points
  current.pts.push({ x: e.clientX, y: e.clientY });
  const n = current.pts.length;
  crayonPath(sctx, current.pts.slice(n - 2), current.color, 5, 1.4);
});

const endStroke = () => { current = null; };
scribble.addEventListener("pointerup", endStroke);
scribble.addEventListener("pointercancel", endStroke);
