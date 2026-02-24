// =============================
// Mini-Book Final Script
// Flip + Swipe + Confetti + Reveal + Music
// =============================

const pages = Array.from(document.querySelectorAll(".page"));
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const confettiBtn = document.getElementById("confettiBtn");

let current = 0;

// =============================
// Flip Logic
// =============================

function flipTo(nextIndex) {
  pages.forEach((p, i) => {
    if (i < nextIndex) p.classList.add("flipped");
    else p.classList.remove("flipped");
  });
  current = nextIndex;
}

function next() {
  if (current < pages.length - 1) flipTo(current + 1);
}

function prev() {
  if (current > 0) flipTo(current - 1);
}

// Desktop: Click to flip
pages.forEach((p, idx) => {
  p.addEventListener("click", (e) => {

    // On mobile disable tap-to-flip
    if (window.matchMedia("(max-width: 760px)").matches) return;

    if (e.target.closest("button")) return;

    if (p.classList.contains("flipped")) prev();
    else if (idx === current) next();
  });
});

// Button Navigation
document.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-action]");
  if (!btn) return;

  const action = btn.getAttribute("data-action");
  if (action === "next") next();
  if (action === "prev") prev();
});

startBtn?.addEventListener("click", next);
restartBtn?.addEventListener("click", () => flipTo(0));

// =============================
// Confetti
// =============================

const canvas = document.getElementById("confetti");
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

let confetti = [];
let animating = false;

function burst() {
  confetti = [];
  for (let i = 0; i < 140; i++) {
    confetti.push({
      x: canvas.width / 2,
      y: canvas.height * 0.25,
      vx: (Math.random() - 0.5) * 10,
      vy: Math.random() * -8 - 4,
      g: 0.22 + Math.random() * 0.12,
      r: 3 + Math.random() * 4,
      a: 1,
      hue: Math.floor(Math.random() * 360),
    });
  }
  animate();
}

function animate() {
  if (animating) return;
  animating = true;

  function frame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    confetti.forEach((c) => {
      c.vy += c.g;
      c.x += c.vx;
      c.y += c.vy;
      c.a -= 0.008;

      ctx.globalAlpha = Math.max(c.a, 0);
      ctx.fillStyle = `hsl(${c.hue} 90% 60%)`;
      ctx.beginPath();
      ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
      ctx.fill();
    });

    confetti = confetti.filter(c => c.a > 0 && c.y < canvas.height + 40);

    if (confetti.length > 0) {
      requestAnimationFrame(frame);
    } else {
      animating = false;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  requestAnimationFrame(frame);
}

confettiBtn?.addEventListener("click", burst);

// =============================
// Proud Reveal + Foto Effekt
// =============================

const proudBtn = document.getElementById("proudBtn");
const hiddenMessage = document.getElementById("hiddenMessage");
const couplePhoto = document.getElementById("couplePhoto");

proudBtn?.addEventListener("click", () => {
  hiddenMessage.style.display = "block";
  burst();
});

couplePhoto?.addEventListener("click", () => {
  if (couplePhoto.classList.contains("is-bw")) {
    couplePhoto.classList.remove("is-bw");
    couplePhoto.classList.add("is-color");
    burst();
  } else {
    couplePhoto.classList.remove("is-color");
    couplePhoto.classList.add("is-bw");
  }
});

// =============================
// Mobile Swipe Navigation
// =============================

const isMobile = window.matchMedia("(max-width: 760px)").matches;

let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

function isHorizontalSwipe() {
  const dx = touchEndX - touchStartX;
  const dy = touchEndY - touchStartY;
  return Math.abs(dx) > 60 && Math.abs(dy) < 40;
}

if (isMobile) {
  document.addEventListener("touchstart", (e) => {
    const t = e.touches[0];
    touchStartX = t.clientX;
    touchStartY = t.clientY;
  }, { passive: true });

  document.addEventListener("touchend", (e) => {
    const t = e.changedTouches[0];
    touchEndX = t.clientX;
    touchEndY = t.clientY;

    if (!isHorizontalSwipe()) return;

    const dx = touchEndX - touchStartX;
    if (dx < 0) next();
    else prev();
  }, { passive: true });
}

// =============================
// 🎵 Background Piano Music
// =============================

const bgMusic = document.getElementById("bgMusic");

function startMusic() {
  if (!bgMusic) return;

  bgMusic.volume = 0.25;
  bgMusic.play().catch(() => {});
}

// iPhone-safe autoplay
document.addEventListener("click", startMusic, { once: true });
document.addEventListener("touchstart", startMusic, { once: true });