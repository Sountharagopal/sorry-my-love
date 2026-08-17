/* ==========================================================
   I'm Sorry — vanilla JS only, no build step, no backend.
   Handles: page navigation, the chaotic NO button on page 1,
   ambient floating hearts, background music, and the finale.
   ========================================================== */

(() => {
  'use strict';

  const TOTAL_PAGES = 5;
  let currentPage = 1;

  const pages = Array.from(document.querySelectorAll('.page'));
  const dots = Array.from(document.querySelectorAll('.dot'));

  /* ---------------- page navigation ---------------- */

  function goToPage(n) {
    if (n < 1 || n > TOTAL_PAGES) return;
    currentPage = n;

    pages.forEach(page => {
      const isTarget = Number(page.dataset.page) === n;
      page.classList.toggle('page--active', isTarget);
    });

    dots.forEach(dot => {
      dot.classList.toggle('active', Number(dot.dataset.dot) === n);
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (n === 5) {
      // give the finale a beat to settle in before it's interactive
      setTimeout(() => document.getElementById('forgiveBtn')?.focus(), 400);
    }
  }

  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-action="advance"]');
    if (trigger) {
      goToPage(currentPage + 1);
    }
  });

  /* ---------------- page 1: chaotic NO button ---------------- */

  const noBtn = document.getElementById('noBtn');
  const chaosLayer = document.getElementById('chaosLayer');
  const chaosMessage = document.getElementById('chaosMessage');
  const apologyCard = document.getElementById('apologyCard');
  const page1 = document.getElementById('page1');

  const funnyMessages = [
    'Are you sure? 🥺',
    "That button seems to be broken... 😭",
    'Maybe try the green one? ❤️',
    'Hmm, wrong button again? 👀',
    'The universe wants YES, honestly ✨',
    'Okay but the heart button looks lonely 💌',
    "Statistically, YES is the better choice 😌",
  ];

  let noClickCount = 0;
  let yesButtonsSpawned = 0;
  const MAX_YES_BUTTONS = 14;

  function randomBetween(min, max) {
    return Math.min(min + Math.random() * (max - min), max);
  }

  function getSafeZone() {
    const rect = page1.getBoundingClientRect();
    const pad = 24;
    const btnW = 150;
    const btnH = 56;
    return {
      minX: pad,
      maxX: Math.max(pad, rect.width - btnW - pad),
      minY: 90,
      maxY: Math.max(140, rect.height - btnH - 40),
    };
  }

  function showChaosMessage() {
    const msg = funnyMessages[Math.min(noClickCount - 1, funnyMessages.length - 1)];
    chaosMessage.textContent = msg;
    chaosMessage.classList.add('show');
  }

  function spawnYesButton() {
    if (yesButtonsSpawned >= MAX_YES_BUTTONS) return;
    yesButtonsSpawned++;

    const zone = getSafeZone();
    const x = randomBetween(zone.minX, zone.maxX);
    const y = randomBetween(zone.minY, zone.maxY);

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn btn-yes';
    btn.textContent = 'YES ❤️';
    btn.style.left = `${x}px`;
    btn.style.top = `${y}px`;
    btn.dataset.action = 'advance';

    // slight random scale so the swarm feels organic, not gridded
    const scale = randomBetween(0.85, 1.05).toFixed(2);
    btn.style.transform = `scale(${scale})`;

    chaosLayer.appendChild(btn);
  }

  function fleeNoButton() {
    const zone = getSafeZone();
    const x = randomBetween(zone.minX, zone.maxX);
    const y = randomBetween(zone.minY, zone.maxY);

    if (!noBtn.classList.contains('fleeing')) {
      // move NO into the absolutely-positioned chaos layer on first flee
      const rect = noBtn.getBoundingClientRect();
      const pageRect = page1.getBoundingClientRect();
      noBtn.classList.add('fleeing');
      chaosLayer.appendChild(noBtn);
      noBtn.style.left = `${rect.left - pageRect.left}px`;
      noBtn.style.top = `${rect.top - pageRect.top}px`;
      // force reflow so the transition below actually animates
      void noBtn.offsetWidth;
    }

    noBtn.style.left = `${x}px`;
    noBtn.style.top = `${y}px`;
  }

  noBtn.addEventListener('click', () => {
    noClickCount++;
    fleeNoButton();
    spawnYesButton();
    spawnYesButton();
    showChaosMessage();
    spawnAmbientHearts(3);
  });

  // in case the pointer catches it on hover before a click on touch-hybrid devices
  noBtn.addEventListener('touchstart', () => {
    noBtn.style.transition = 'left 0.35s ease, top 0.35s ease';
  }, { passive: true });

  /* ---------------- ambient floating hearts ---------------- */

  const heartsField = document.getElementById('heartsField');
  const heartEmojis = ['❤️', '💗', '💕', '💖', '🩷'];

  function spawnAmbientHearts(count = 1) {
    for (let i = 0; i < count; i++) {
      const heart = document.createElement('span');
      heart.className = 'floating-heart';
      heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
      heart.style.left = `${randomBetween(2, 96)}vw`;
      heart.style.setProperty('--size', `${randomBetween(1, 2.1).toFixed(2)}rem`);
      heart.style.setProperty('--dur', `${randomBetween(6, 11).toFixed(1)}s`);
      heart.style.setProperty('--drift', `${randomBetween(-60, 60).toFixed(0)}px`);
      heartsField.appendChild(heart);
      setTimeout(() => heart.remove(), 12000);
    }
  }

  // gentle continuous drizzle of hearts across the whole experience
  setInterval(() => spawnAmbientHearts(1), 2200);
  spawnAmbientHearts(4);

  /* ---------------- background music ---------------- */

  const musicBtn = document.getElementById('musicBtn');
  const ourSong = document.getElementById('ourSong');
  const musicLabel = musicBtn.querySelector('.music-label');
  let isPlaying = false;

  musicBtn.addEventListener('click', async () => {
    try {
      if (!isPlaying) {
        await ourSong.play();
        isPlaying = true;
        musicBtn.classList.add('playing');
        musicLabel.textContent = 'Playing our song';
      } else {
        ourSong.pause();
        isPlaying = false;
        musicBtn.classList.remove('playing');
        musicLabel.textContent = 'Play our song';
      }
    } catch (err) {
      // autoplay / missing file — fail quietly, this is a nice-to-have
      musicLabel.textContent = 'Add audio/our-song.mp3';
    }
  });

  /* ---------------- page 5: finale ---------------- */

  const forgiveBtn = document.getElementById('forgiveBtn');
  const celebration = document.getElementById('celebration');

  function burstHearts(originEl) {
    const rect = originEl.getBoundingClientRect();
    const originX = rect.left + rect.width / 2;
    const originY = rect.top + rect.height / 2;
    const count = 26;

    for (let i = 0; i < count; i++) {
      const heart = document.createElement('span');
      heart.className = 'burst-heart';
      heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
      heart.style.left = `${originX}px`;
      heart.style.top = `${originY}px`;

      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.4;
      const distance = randomBetween(120, 320);
      const bx = Math.cos(angle) * distance;
      const by = Math.sin(angle) * distance - 60; // bias upward

      heart.style.setProperty('--bx', `${bx}px`);
      heart.style.setProperty('--by', `${by}px`);
      heart.style.setProperty('--br', `${randomBetween(-90, 90).toFixed(0)}deg`);
      heart.style.fontSize = `${randomBetween(1.1, 2).toFixed(2)}rem`;

      document.body.appendChild(heart);
      setTimeout(() => heart.remove(), 1700);
    }
  }

  forgiveBtn.addEventListener('click', () => {
    burstHearts(forgiveBtn);
    forgiveBtn.hidden = true;
    celebration.hidden = false;

    // a little continued sparkle after the initial burst
    let bursts = 0;
    const extra = setInterval(() => {
      spawnAmbientHearts(4);
      bursts++;
      if (bursts >= 5) clearInterval(extra);
    }, 500);
  });

  /* ---------------- init ---------------- */

  goToPage(1);
})();
