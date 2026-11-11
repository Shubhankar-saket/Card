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

/* ---------- Palace skyline (drawn) ---------- */
(function drawPalace() {
  const arch = (x, y, w, h) =>
    `M${x},${y + h} L${x},${y + w * 0.6} C${x},${y + w * 0.15} ${x + w / 2},${y + w * 0.05} ${x + w / 2},${y - w * 0.2}
     C${x + w / 2},${y + w * 0.05} ${x + w},${y + w * 0.15} ${x + w},${y + w * 0.6} L${x + w},${y + h} Z`;

  const dome = (cx, base, w, h) =>
    `<path d="M${cx - w / 2},${base} C${cx - w / 2},${base - h * 0.75} ${cx - w * 0.15},${base - h * 0.85} ${cx},${base - h}
              C${cx + w * 0.15},${base - h * 0.85} ${cx + w / 2},${base - h * 0.75} ${cx + w / 2},${base} Z"/>
     <rect x="${cx - 0.8}" y="${base - h - 9}" width="1.6" height="10"/>
     <circle cx="${cx}" cy="${base - h - 10}" r="2.2"/>`;

  const chhatri = (cx, base, w) => {
    const ph = w * 0.55, top = base - ph;
    let s = `<rect x="${cx - w / 2 - 3}" y="${top - 4}" width="${w + 6}" height="5"/>`;
    for (let i = 0; i < 4; i++) s += `<rect x="${cx - w / 2 + i * (w - 3) / 3}" y="${top}" width="3" height="${ph}"/>`;
    s += `<rect x="${cx - w / 2 - 2}" y="${base - 3}" width="${w + 4}" height="4"/>`;
    return s + dome(cx, top - 4, w * 0.82, w * 0.7);
  };

  const crenel = (x1, x2, y) => {
    let s = "";
    for (let x = x1; x < x2 - 4; x += 10) s += `<rect x="${x}" y="${y - 6}" width="6" height="6"/>`;
    return s;
  };

  const windows = (x1, x2, y, w, h, gap) => {
    let s = "";
    for (let x = x1; x + w <= x2; x += w + gap) s += `<path d="${arch(x, y, w, h)}"/>`;
    return s;
  };

  const svg = `
    <defs>
      <linearGradient id="stone" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#ecd3a8"/><stop offset="1" stop-color="#d3aa72"/>
      </linearGradient>
      <linearGradient id="stoneBack" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#f1dfc2"/><stop offset="1" stop-color="#e3c69c"/>
      </linearGradient>
      <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0.55" stop-color="#f7e3cd" stop-opacity="0"/><stop offset="1" stop-color="#f7e3cd"/>
      </linearGradient>
    </defs>

    <!-- back layer -->
    <g fill="url(#stoneBack)">
      <rect x="0" y="128" width="480" height="82"/>
      ${crenel(0, 480, 128)}
      ${dome(36, 128, 40, 34)} ${dome(444, 128, 40, 34)}
      ${chhatri(150, 128, 30)} ${chhatri(330, 128, 30)}
    </g>
    <g fill="#c9a274" opacity=".35">${windows(10, 470, 150, 12, 22, 18)}</g>

    <!-- side towers -->
    <g fill="url(#stone)">
      <rect x="60" y="118" width="78" height="92"/>
      <rect x="342" y="118" width="78" height="92"/>
      ${chhatri(99, 118, 46)} ${chhatri(381, 118, 46)}
      <rect x="138" y="150" width="204" height="60"/>
      ${crenel(138, 342, 150)}
    </g>
    <g fill="#b98a55" opacity=".5">
      ${windows(72, 138, 140, 14, 26, 9)} ${windows(354, 420, 140, 14, 26, 9)}
    </g>

    <!-- central palace -->
    <g fill="url(#stone)">
      <rect x="176" y="96" width="128" height="114"/>
      <rect x="170" y="92" width="140" height="6"/>
      ${dome(240, 92, 104, 66)}
      ${dome(184, 92, 18, 18)} ${dome(296, 92, 18, 18)}
    </g>
    <g fill="#b98a55" opacity=".55">
      <path d="${arch(222, 150, 36, 60)}"/>
      ${windows(186, 220, 112, 13, 26, 8)} ${windows(260, 300, 112, 13, 26, 8)}
    </g>

    <rect x="0" y="0" width="480" height="210" fill="url(#fade)"/>`;

  document.getElementById("palace").innerHTML = svg;
})();

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
