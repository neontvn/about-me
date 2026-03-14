'use strict';

/* ── Loader ───────────────────────────────────────────────── */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  if (loader) {
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.classList.add('loaded');
    }, 400);
  }
});

/* ── Navbar scroll state ──────────────────────────────────── */
const nav = document.getElementById('nav');
function onScroll() {
  if (!nav) return;
  nav.classList.toggle('scrolled', window.scrollY > 60);
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ── Nav link active highlight ────────────────────────────── */
const navLinks = document.querySelectorAll('[data-nav-link]');
let manualNav = false;

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    manualNav = true;
    navLinks.forEach(l => l.classList.remove('active'));
    link.classList.add('active');
    setTimeout(() => { manualNav = false; }, 1200);
  });
});

const sectionObserver = new IntersectionObserver(entries => {
  if (manualNav) return;
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navLinks.forEach(l => {
        l.classList.toggle('active', l.getAttribute('href') === '#' + id);
      });
    }
  });
}, { rootMargin: '-20% 0px -70% 0px', threshold: 0 });

document.querySelectorAll('#experience, #projects, #writing, #contact').forEach(s => {
  sectionObserver.observe(s);
});

/* ── Mobile menu toggle ───────────────────────────────────── */
const toggle = document.getElementById('nav-toggle');
const mobileMenu = document.getElementById('mobile-menu');

if (toggle && mobileMenu) {
  toggle.addEventListener('click', () => {
    const open = toggle.classList.toggle('open');
    mobileMenu.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('open');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

/* ── Scroll reveal ────────────────────────────────────────── */
(function initReveal() {
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('[data-reveal]').forEach(el => {
      el.classList.add('revealed');
    });
    return;
  }

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('[data-reveal]').forEach((el, i) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.9) {
      requestAnimationFrame(() => el.classList.add('revealed'));
    } else {
      // Stagger siblings within a grid (groups of 3)
      const parent = el.parentElement;
      if (parent) {
        const siblings = Array.from(parent.querySelectorAll(':scope > [data-reveal]'));
        const idx = siblings.indexOf(el);
        el.style.setProperty('--reveal-d', `${(idx % 3) * 0.08}s`);
      }
    }
    revealObserver.observe(el);
  });
})();

/* ── Smooth anchor scrolling (offset for fixed nav) ───────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 72;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});
