/* ============================================================
   Wedding card – opening page
   ------------------------------------------------------------
   • Corner flowers are drawn as SVG (bougainvillea style).
     To use real flower photos instead, put transparent PNGs at
       assets/flowers-top-left.png  and  assets/flowers-bottom-right.png
     and set USE_IMAGES = true.
   • Personalise the greeting with  ?to=Sharma%20Family  in the URL.
   • "Open" starts the music and reveals the inside of the card.
   • Link straight to the inside with  index.html?open=1
   ============================================================ */

const USE_IMAGES = false;

/* ---------- Render corners ---------- */
const tl = document.getElementById("flowersTL");
const br = document.getElementById("flowersBR");

if (USE_IMAGES) {
  tl.innerHTML = `<img src="assets/flowers-top-left.png" alt="">`;
  br.innerHTML = `<img src="assets/flowers-bottom-right.png" alt="">`;
} else {
  tl.innerHTML = buildCorner(7);
  br.innerHTML = buildCorner(42);
  br.firstElementChild.style.transform = "rotate(180deg)"; // mirror into bottom-right
}

/* ---------- Personalised greeting:  ?to=Name ---------- */
const to = new URLSearchParams(location.search).get("to");
if (to) document.getElementById("greeting").textContent = `Dear ${to}`;

/* ---------- Open button: start music + reveal the inside ---------- */
const card = document.getElementById("card");
const stage = document.querySelector(".stage");
const inside = document.getElementById("inviteWrap");

function showInside() {
  stage.hidden = true;
  inside.hidden = false;
  window.scrollTo(0, 0);
}

document.getElementById("openBtn").addEventListener("click", () => {
  if (window.startMusic) window.startMusic(); // must happen during the tap
  card.classList.add("is-opening");
  setTimeout(showInside, 900);
});

// Direct link to the inside:  index.html?open=1
if (new URLSearchParams(location.search).has("open")) showInside();
