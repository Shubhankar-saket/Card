/* Bougainvillea corner generator (shared by both pages). buildCorner(seed) returns an SVG string. */

/* ---------- Seeded random so the flowers look the same every load ---------- */
function rng(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const PINKS  = ["#e3155f", "#d40f55", "#ee2a74", "#f0478a", "#c80c4f", "#e81e6a", "#b80a48"];
const GREENS = ["#2f5a1c", "#3d6f25", "#4c7e2e", "#5b8a35", "#28501a"];

/* point on a quadratic bezier */
function qb(p0, c, p1, t) {
  const u = 1 - t;
  return [
    u * u * p0[0] + 2 * u * t * c[0] + t * t * p1[0],
    u * u * p0[1] + 2 * u * t * c[1] + t * t * p1[1],
  ];
}

function petalPath(r) {
  // a rounded, slightly heart-tipped bract
  return `M0,0 C${r * 0.35},${-r * 0.75} ${r * 1.05},${-r * 0.6} ${r},${-r * 0.05}
          C${r * 1.08},${r * 0.55} ${r * 0.4},${r * 0.72} 0,0Z`;
}

function flowerSVG(x, y, r, rot, color) {
  let s = `<g transform="translate(${x.toFixed(1)},${y.toFixed(1)}) rotate(${rot.toFixed(0)})">`;
  for (let i = 0; i < 3; i++) {
    const a = i * 120;
    s += `<g transform="rotate(${a})">
            <path d="${petalPath(r)}" fill="rgba(90,0,30,.35)" transform="translate(.7,.9)"/>
            <path d="${petalPath(r)}" fill="${color}"/>
            <path d="M${r * 0.15},0 L${r * 0.8},${-r * 0.05}" stroke="rgba(120,0,40,.35)" stroke-width="${(r * 0.08).toFixed(2)}" fill="none"/>
            <path d="M${r * 0.3},${-r * 0.25} Q${r * 0.6},${-r * 0.45} ${r * 0.85},${-r * 0.3}" stroke="rgba(255,190,215,.45)" stroke-width="${(r * 0.07).toFixed(2)}" fill="none"/>
          </g>`;
  }
  // tiny cream florets in the middle
  const d = r * 0.16;
  s += `<circle cx="${d}" cy="0" r="${r * 0.12}" fill="#fff4dc"/>
        <circle cx="${-d * 0.6}" cy="${d * 0.8}" r="${r * 0.1}" fill="#fff4dc"/>
        <circle cx="${-d * 0.6}" cy="${-d * 0.8}" r="${r * 0.1}" fill="#fff0cc"/>`;
  return s + `</g>`;
}

function leafSVG(x, y, len, rot, color) {
  const w = len * 0.32;
  return `<g transform="translate(${x.toFixed(1)},${y.toFixed(1)}) rotate(${rot.toFixed(0)})">
            <path d="M0,0 Q${len * 0.45},${-w} ${len},0 Q${len * 0.45},${w} 0,0Z" fill="${color}"/>
            <path d="M0,0 L${len * 0.9},0" stroke="rgba(200,230,150,.35)" stroke-width=".5"/>
          </g>`;
}

/* Builds one corner arrangement. Origin (0,0) is the card corner. */
function buildCorner(seed) {
  const R = rng(seed);
  const W = 220, H = 240;

  const branches = [
    { p0: [0, 0],  c: [70, 6],   p1: [188, 6]   }, // along top edge
    { p0: [0, 0],  c: [6, 90],   p1: [8, 212]   }, // down the side edge
    { p0: [0, 8],  c: [45, 55],  p1: [92, 138]  }, // diagonal
    { p0: [14, 0], c: [75, 28],  p1: [138, 52]  },
    { p0: [0, 36], c: [26, 95],  p1: [44, 178]  },
    { p0: [30, 0], c: [80, 12],  p1: [112, 26]  },
  ];

  let stems = "", leaves = [], flowers = [];

  branches.forEach((b, bi) => {
    // stem
    const pts = [];
    for (let t = 0; t <= 1.001; t += 0.1) pts.push(qb(b.p0, b.c, b.p1, t));
    stems += `<path d="M${pts.map(p => p.map(n => n.toFixed(1)).join(",")).join(" L")}" stroke="#5a3a22" stroke-width="${bi < 2 ? 1.4 : 1}" fill="none" opacity=".45"/>`;

    for (let t = 0.02; t <= 1; t += 0.03) {
      const density = 1 - t * 0.55;
      if (R() > density) continue;

      const [x, y] = qb(b.p0, b.c, b.p1, t);
      const [x2, y2] = qb(b.p0, b.c, b.p1, Math.min(1, t + 0.01));
      const dir = Math.atan2(y2 - y, x2 - x) * 180 / Math.PI;
      const scale = 1 - t * 0.35;

      // leaves either side of stem
      const nl = 2 + Math.floor(R() * 2);
      for (let i = 0; i < nl; i++) {
        const side = R() > 0.5 ? 1 : -1;
        leaves.push(leafSVG(
          x + (R() - 0.5) * 6, y + (R() - 0.5) * 6,
          (13 + R() * 9) * scale,
          dir + side * (35 + R() * 50),
          GREENS[Math.floor(R() * GREENS.length)]
        ));
      }

      // flower cluster
      const nf = 1 + Math.floor(R() * (t < 0.5 ? 3 : 2));
      for (let i = 0; i < nf; i++) {
        flowers.push(flowerSVG(
          x + (R() - 0.5) * 14 * scale, y + (R() - 0.5) * 14 * scale,
          (6 + R() * 5.5) * scale,
          R() * 360,
          PINKS[Math.floor(R() * PINKS.length)]
        ));
      }
    }
  });

  // dense filling right in the corner
  for (let i = 0; i < 40; i++) {
    const x = R() * 55, y = R() * 55;
    if (x + y > 75) continue;
    if (R() < 0.45) leaves.push(leafSVG(x, y, 10 + R() * 7, R() * 360, GREENS[Math.floor(R() * GREENS.length)]));
    flowers.push(flowerSVG(x, y, 7 + R() * 5, R() * 360, PINKS[Math.floor(R() * PINKS.length)]));
  }

  // shuffle flowers so overlaps look natural
  for (let i = flowers.length - 1; i > 0; i--) {
    const j = Math.floor(R() * (i + 1));
    [flowers[i], flowers[j]] = [flowers[j], flowers[i]];
  }

  return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            ${stems}${leaves.join("")}${flowers.join("")}
          </svg>`;
}

