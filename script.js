/* =============================================
   CUSTOM CURSOR — requestAnimationFrame
   ============================================= */
const cursor = document.getElementById('cursor');
let mouseX = 0, mouseY = 0;
let rafId = null;

if (cursor && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!rafId) {
      rafId = requestAnimationFrame(() => {
        cursor.style.left = mouseX + 'px';
        cursor.style.top  = mouseY + 'px';
        rafId = null;
      });
    }
  });

  document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
  });
}

/* =============================================
   STICKY NAV — .scrolled class on scroll
   ============================================= */
const nav = document.querySelector('nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
}

/* =============================================
   HAMBURGER MENU
   ============================================= */
const navToggle = document.querySelector('.nav-toggle');
const navMenu   = document.getElementById('nav-menu');

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!isOpen));
    navMenu.classList.toggle('is-open', !isOpen);
  });

  // Close on nav link click
  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.setAttribute('aria-expanded', 'false');
      navMenu.classList.remove('is-open');
    });
  });

  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && navMenu.classList.contains('is-open')) {
      navToggle.setAttribute('aria-expanded', 'false');
      navMenu.classList.remove('is-open');
      navToggle.focus();
    }
  });
}

/* =============================================
   MENU TABS — keyboard accessible (ARIA pattern)
   ============================================= */
const tabBtns   = Array.from(document.querySelectorAll('.tab-btn[role="tab"]'));
const tabPanels = Array.from(document.querySelectorAll('.menu-panel[role="tabpanel"]'));

function activateTab(btn) {
  tabBtns.forEach(b => {
    b.classList.remove('active');
    b.setAttribute('aria-selected', 'false');
    b.setAttribute('tabindex', '-1');
  });
  tabPanels.forEach(p => {
    p.classList.remove('active');
    p.hidden = true;
  });

  btn.classList.add('active');
  btn.setAttribute('aria-selected', 'true');
  btn.setAttribute('tabindex', '0');

  const panel = document.getElementById('tab-' + btn.dataset.tab);
  if (panel) {
    panel.classList.add('active');
    panel.hidden = false;
  }
}

tabBtns.forEach((btn, index) => {
  btn.addEventListener('click', () => {
    activateTab(btn);
    btn.focus();
  });

  btn.addEventListener('keydown', e => {
    let newIndex = null;
    if (e.key === 'ArrowRight') newIndex = (index + 1) % tabBtns.length;
    if (e.key === 'ArrowLeft')  newIndex = (index - 1 + tabBtns.length) % tabBtns.length;
    if (e.key === 'Home')       newIndex = 0;
    if (e.key === 'End')        newIndex = tabBtns.length - 1;

    if (newIndex !== null) {
      e.preventDefault();
      activateTab(tabBtns[newIndex]);
      tabBtns[newIndex].focus();
    }
  });
});

/* =============================================
   SCROLL REVEAL — respects prefers-reduced-motion
   ============================================= */
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const revealEls = document.querySelectorAll(
    '.menu-category, .gallery-item, .info-block, .feature-card, .event-card'
  );

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealEls.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
}

/* =============================================
   BACK TO TOP
   ============================================= */
const backToTop = document.getElementById('backToTop');
if (backToTop) {
  backToTop.removeAttribute('hidden');
  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* =============================================
   ACTIVE NAV LINK ON SCROLL
   ============================================= */
const sections = document.querySelectorAll('main section[id]');
const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

if (sections.length && navLinks.length) {
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.toggle(
            'active-section',
            link.getAttribute('href') === '#' + entry.target.id
          );
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => navObserver.observe(s));
}

/* =============================================
   CURSOR TRAIL
   ============================================= */
if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  const TRAIL_COUNT = 7;
  const trailDots = [];
  const positions = Array.from({ length: TRAIL_COUNT }, () => ({ x: 0, y: 0 }));

  for (let i = 0; i < TRAIL_COUNT; i++) {
    const dot = document.createElement('div');
    dot.className = 'cursor-trail';
    const size = Math.max(3, 10 - i * 1.2);
    dot.style.cssText = `width:${size}px;height:${size}px;opacity:${(1 - i / TRAIL_COUNT) * 0.35}`;
    document.body.appendChild(dot);
    trailDots.push(dot);
  }

  function animateTrail() {
    // Shift positions: each dot follows the previous one
    for (let i = positions.length - 1; i > 0; i--) {
      positions[i].x += (positions[i - 1].x - positions[i].x) * 0.4;
      positions[i].y += (positions[i - 1].y - positions[i].y) * 0.4;
    }
    positions[0].x = mouseX;
    positions[0].y = mouseY;

    trailDots.forEach((dot, i) => {
      dot.style.left = positions[i].x + 'px';
      dot.style.top  = positions[i].y + 'px';
    });
    requestAnimationFrame(animateTrail);
  }
  requestAnimationFrame(animateTrail);
}

/* =============================================
   ANIMATED COUNTERS
   ============================================= */
const counterEls = document.querySelectorAll('.stat-num[data-count]');

if (counterEls.length) {
  const easeOut = t => 1 - Math.pow(1 - t, 3);

  function animateCounter(el) {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1800;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const value = Math.round(easeOut(progress) * target);
      el.textContent = value + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counterEls.forEach(el => counterObserver.observe(el));
}

/* =============================================
   VIEW TRANSITIONS API — menu tabs
   ============================================= */
// Patch activateTab to use View Transitions when available
if (typeof activateTab === 'function' && document.startViewTransition) {
  const _original = activateTab;
  // Redefine with View Transitions wrapper
  window.activateTab = function(btn) {
    document.startViewTransition(() => _original(btn));
  };
}

/* =============================================
   SERVICE WORKER REGISTRATION
   ============================================= */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // SW registration failed silently — site still works
    });
  });
}
