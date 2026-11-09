(() => {
  'use strict';
  const header = document.querySelector('.site-header');
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const backToTop = document.querySelector('.back-to-top');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const updateScrollUI = () => {
    header.classList.toggle('scrolled', window.scrollY > 24);
    backToTop.classList.toggle('visible', window.scrollY > 500);
  };
  updateScrollUI();
  window.addEventListener('scroll', updateScrollUI, { passive: true });

  const closeMenu = () => {
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Buka menu navigasi');
    navMenu.classList.remove('is-open');
  };
  menuToggle.addEventListener('click', () => {
    const open = menuToggle.getAttribute('aria-expanded') !== 'true';
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Tutup menu navigasi' : 'Buka menu navigasi');
    navMenu.classList.toggle('is-open', open);
  });
  navMenu.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
  document.addEventListener('click', (event) => {
    if (!navMenu.contains(event.target) && !menuToggle.contains(event.target)) closeMenu();
  });

  const filters = document.querySelectorAll('.filter-button');
  const packageCards = document.querySelectorAll('.package-card');
  filters.forEach((button) => button.addEventListener('click', () => {
    filters.forEach((filter) => {
      const active = filter === button;
      filter.classList.toggle('is-active', active);
      filter.setAttribute('aria-pressed', String(active));
    });
    packageCards.forEach((card) => {
      card.hidden = button.dataset.filter !== 'all' && card.dataset.category !== button.dataset.filter;
    });
  }));

  const revealItems = document.querySelectorAll('.reveal');
  if (!reduceMotion && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });
    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  const navLinks = [...document.querySelectorAll('.nav-menu a[href^="#"]')];
  const sections = navLinks.map((link) => document.querySelector(link.getAttribute('href'))).filter(Boolean);
  if ('IntersectionObserver' in window) {
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
          const active = link.getAttribute('href') === `#${entry.target.id}`;
          link.classList.toggle('is-current', active);
          if (active) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-30% 0px -60% 0px' });
    sections.forEach((section) => navObserver.observe(section));
  }

  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }));
  document.getElementById('year').textContent = new Date().getFullYear();

  const galleryItems = [...document.querySelectorAll('[data-lightbox]')];
  const lightbox = document.querySelector('.lightbox');
  const lightboxImage = lightbox.querySelector('figure img');
  const lightboxCaption = lightbox.querySelector('figcaption');
  const lightboxCount = lightbox.querySelector('.lightbox-count');
  let currentImage = 0;
  const showImage = (index) => {
    currentImage = (index + galleryItems.length) % galleryItems.length;
    const image = galleryItems[currentImage].querySelector('img');
    lightboxImage.src = image.currentSrc || image.src;
    lightboxImage.alt = image.alt;
    lightboxCaption.textContent = image.alt;
    lightboxCount.textContent = `${String(currentImage + 1).padStart(2, '0')} / ${String(galleryItems.length).padStart(2, '0')}`;
  };
  galleryItems.forEach((item, index) => item.addEventListener('click', () => {
    showImage(index);
    if (typeof lightbox.showModal === 'function') lightbox.showModal();
  }));
  lightbox.querySelector('.lightbox-close').addEventListener('click', () => lightbox.close());
  lightbox.querySelector('.lightbox-prev').addEventListener('click', () => showImage(currentImage - 1));
  lightbox.querySelector('.lightbox-next').addEventListener('click', () => showImage(currentImage + 1));
  lightbox.addEventListener('click', (event) => { if (event.target === lightbox) lightbox.close(); });
  lightbox.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') showImage(currentImage + 1);
    if (event.key === 'ArrowLeft') showImage(currentImage - 1);
  });
})();
