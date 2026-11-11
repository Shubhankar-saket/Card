/* ============================================================
   Wedding invitation – inside page
   Edit the data below to change content.
   ============================================================ */

const EVENTS = [
  { name: "Tilak",      day: "Monday",    date: 23, time: "10:00 AM" },
  { name: "Haldi",      day: "Monday",    date: 23, time: "7:00 PM"  },
  { name: "Mehndi",     day: "Tuesday",   date: 24, time: "9:00 AM"  },
  { name: "Sangeet",    day: "Tuesday",   date: 24, time: "6:30 PM"  },
  { name: "Subh Vivah", day: "Wednesday", date: 25, time: "6:00 PM"  },
  { name: "Reception",  day: "Thursday",  date: 26, time: "7:00 PM"  },
];

const SCHEDULE = [
  { time: "6:30 PM",  what: "Dwar Puja & Groom’s Welcome" },
  { time: "7:30 PM",  what: "Bridal Entry" },
  { time: "8:00 PM",  what: "Varmala", key: true },
  { time: "9:00 PM",  what: "Dinner" },
  { time: "10:30 PM", what: "Shubh Vivah & Pheras Begin", key: true },
  { time: "2:00 AM",  what: "Vidaai" },
];

// Put your 14 photos here (any of .jpg / .jpeg / .png / .webp — just match the names)
const GALLERY = Array.from({ length: 14 }, (_, i) => `assets/gallery/${i + 1}.jpg`);

// Countdown target: Subh Vivah, 25 Nov 2026, 6:00 PM IST
const WEDDING = new Date("2026-11-25T18:00:00+05:30");

/* ---------- Events ---------- */
document.getElementById("events").innerHTML = EVENTS.map(e => `
  <div class="event reveal">
    <span class="event__name">${e.name.toUpperCase()}</span>
    <p class="event__at">At ${e.time}</p>
    <div class="dateline">
      <span>${e.day}</span><span class="bar"></span><b>${e.date}</b><span class="bar"></span><span>November</span>
    </div>
    <div class="year">2026</div>
  </div>`).join("");

/* ---------- Timeline ---------- */
document.getElementById("timeline").innerHTML = SCHEDULE.map(s => `
  <li class="${s.key ? "key" : ""}">
    <time>${s.time}</time><span class="dot"></span><span class="what">${s.what}</span>
  </li>`).join("");

/* ---------- Flowers ---------- */
document.getElementById("heroFlowers").innerHTML = buildCorner(11);
document.getElementById("footFlowers").innerHTML = buildCorner(23);

/* ---------- Gallery ---------- */
(function gallery() {
  const stage = document.getElementById("galleryStage");
  const count = document.getElementById("galCount");
  let active = 0;
  const loaded = []; // index -> bool (has real photo)

  const cards = GALLERY.map((src, i) => {
    const card = document.createElement("div");
    card.className = "gallery__card placeholder";
    card.innerHTML = `<div>Photo ${i + 1}<small>coming soon</small></div>`;
    const img = new Image();
    img.onload = () => {
      card.className = "gallery__card";
      card.innerHTML = "";
      card.style.setProperty("--bg", `url("${src}")`); // blurred fill behind the photo
      card.appendChild(img);
      loaded[i] = true;
    };
    img.alt = `Shubhra & Henil – photo ${i + 1}`;
    img.src = src;
    card.addEventListener("click", () => (i === active ? openLightbox(i) : go(i)));
    stage.appendChild(card);
    return card;
  });

  const n = cards.length;
  function layout() {
    cards.forEach((c, i) => {
      let o = i - active;
      if (o > n / 2) o -= n;
      if (o < -n / 2) o += n;
      const a = Math.abs(o);
      c.style.transform = `translateX(${o * 62}px) rotate(${o * 5}deg) scale(${1 - a * 0.12})`;
      c.style.zIndex = 20 - a;
      c.style.opacity = a > 2 ? 0 : 1;
      c.style.filter = a ? `brightness(${1 - a * 0.08})` : "none";
      c.style.pointerEvents = a > 2 ? "none" : "auto";
    });
    count.textContent = `${active + 1} / ${n}`;
  }
  function go(i) { active = (i + n) % n; layout(); }

  document.getElementById("galPrev").onclick = () => go(active - 1);
  document.getElementById("galNext").onclick = () => go(active + 1);

  // swipe
  let x0 = null;
  stage.addEventListener("pointerdown", e => (x0 = e.clientX));
  stage.addEventListener("pointerup", e => {
    if (x0 === null) return;
    const dx = e.clientX - x0; x0 = null;
    if (Math.abs(dx) > 40) go(active + (dx < 0 ? 1 : -1));
  });
  layout();

  // lightbox
  const lb = document.getElementById("lightbox");
  const lbImg = document.getElementById("lbImg");
  const lbCount = document.getElementById("lbCount");
  let lbi = 0;
  const real = () => GALLERY.map((_, i) => i).filter(i => loaded[i]);

  function openLightbox(i) {
    if (!loaded[i]) return;
    lbi = i; showLb(); lb.hidden = false; document.body.style.overflow = "hidden";
  }
  function showLb() {
    lbImg.src = GALLERY[lbi];
    const r = real();
    lbCount.textContent = `${r.indexOf(lbi) + 1} / ${r.length}`;
  }
  function stepLb(d) {
    const r = real(); if (!r.length) return;
    lbi = r[(r.indexOf(lbi) + d + r.length) % r.length]; showLb();
  }
  function closeLb() { lb.hidden = true; document.body.style.overflow = ""; }

  document.getElementById("lbClose").onclick = closeLb;
  document.getElementById("lbPrev").onclick = () => stepLb(-1);
  document.getElementById("lbNext").onclick = () => stepLb(1);
  lb.addEventListener("click", e => { if (e.target === lb) closeLb(); });
  document.addEventListener("keydown", e => {
    if (lb.hidden) return;
    if (e.key === "Escape") closeLb();
    if (e.key === "ArrowLeft") stepLb(-1);
    if (e.key === "ArrowRight") stepLb(1);
  });
})();

/* ---------- Countdown ---------- */
(function countdown() {
  const el = document.getElementById("countdown");
  const u = k => el.querySelector(`[data-u="${k}"]`);
  const pad = v => String(v).padStart(2, "0");
  function tick() {
    let ms = WEDDING - Date.now();
    if (ms <= 0) {
      el.innerHTML = `<p class="closing__script" style="font-family:'Alex Brush',cursive;font-size:30px">Today is the day!</p>`;
      return clearInterval(t);
    }
    const d = Math.floor(ms / 864e5); ms -= d * 864e5;
    const h = Math.floor(ms / 36e5);  ms -= h * 36e5;
    const m = Math.floor(ms / 6e4);   ms -= m * 6e4;
    u("d").textContent = pad(d); u("h").textContent = pad(h);
    u("m").textContent = pad(m); u("s").textContent = pad(Math.floor(ms / 1e3));
  }
  const t = setInterval(tick, 1000); tick();
})();

/* ---------- Calendar ---------- */
(function calendar() {
  const grid = document.getElementById("calendar");
  let html = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map(d => `<div class="dow">${d}</div>`).join("");
  const offset = (new Date(2026, 10, 1).getDay() + 6) % 7;
  for (let i = 0; i < offset; i++) html += `<div></div>`;
  for (let d = 1; d <= 30; d++) html += `<div class="d${d === 25 ? " mark" : ""}"><span>${d}</span></div>`;
  grid.innerHTML = html;

  const p = new URLSearchParams({
    action: "TEMPLATE",
    text: "Shubhra & Henil's Wedding",
    dates: "20261125T123000Z/20261125T203000Z",
    details: "Subh Vivah 25 Nov, 6:00 PM · Pheras 10:30 PM · Reception 26 Nov, 7:00 PM",
    location: "Shri Sai Kripa Vatika, Sharda Colony, near Dungarpur Link Road, Banswara, Rajasthan 327001",
    ctz: "Asia/Kolkata",
  });
  document.getElementById("calBtn").href = `https://calendar.google.com/calendar/render?${p}`;
})();

/* ---------- Music (only shown if assets/music.mp3 exists) ---------- */
(function music() {
  const audio = document.getElementById("music");
  const btn = document.getElementById("musicBtn");
  audio.addEventListener("loadedmetadata", () => (btn.hidden = false));
  audio.preload = "metadata";
  audio.load();
  const play = () => audio.play().then(() => btn.classList.add("playing")).catch(() => {});
  btn.onclick = () => {
    if (audio.paused) play();
    else { audio.pause(); btn.classList.remove("playing"); }
  };
  // Called by the cover's "Open" button – must run inside the tap so the browser allows sound.
  window.startMusic = play;
  // Fallback (e.g. opened via ?open=1): start on the first tap anywhere.
  const start = () => { if (!btn.hidden && audio.paused) btn.click(); };
  document.addEventListener("click", start, { once: true });
  document.addEventListener("touchstart", start, { once: true });
})();

/* ---------- Reveal on scroll ---------- */
const io = new IntersectionObserver(entries => entries.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
}), { threshold: 0.15 });
document.querySelectorAll(".reveal").forEach(el => io.observe(el));
