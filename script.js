(() => {
  'use strict';
  const header = document.querySelector('.site-header');
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const backToTop = document.querySelector('.back-to-top');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Load final premium visual layer and image layout styles.
  ['portfolio-assets.css', 'premium.css'].forEach((href) => {
    const stylesheet = document.createElement('link');
    stylesheet.rel = 'stylesheet';
    stylesheet.href = href;
    document.head.append(stylesheet);
  });

  // Requested brand image in the upper-left header and footer.
  document.querySelectorAll('.brand').forEach((brand) => {
    const logo = document.createElement('img');
    logo.className = 'brand-logo-image';
    logo.src = '1000038108.jpg';
    logo.alt = '';
    logo.width = 220;
    logo.height = 72;
    logo.decoding = 'async';
    brand.replaceChildren(logo);
    brand.setAttribute('aria-label', 'Fandy Mukty Decoration, beranda');
  });

  // Brand message ticker. It pauses on hover/focus and respects reduced motion.
  const ticker = document.createElement('div');
  ticker.className = 'brand-ticker';
  ticker.setAttribute('role', 'marquee');
  ticker.setAttribute('aria-label', 'FM Decoration berpengalaman lebih dari 20 tahun, melayani dengan hati dan menyentuh dengan tulus');
  const tickerTrack = document.createElement('div');
  tickerTrack.className = 'brand-ticker-track';
  const tickerCopy = 'FM Decoration berpengalaman lebih dari 20 tahun · melayani dengan hati dan menyentuh dengan tulus';
  for (let index = 0; index < 4; index += 1) {
    const item = document.createElement('span');
    item.className = 'brand-ticker-item';
    item.textContent = tickerCopy;
    if (index > 0) item.setAttribute('aria-hidden', 'true');
    tickerTrack.append(item);
  }
  ticker.append(tickerTrack);
  header.prepend(ticker);

  // Add the supplied repository photos to the editorial portfolio.
  const gallery = document.querySelector('.gallery-editorial');
  const extraImages = [
    { src: '20260911_230639.jpg', alt: 'Dekorasi pelaminan dengan tirai dan rangkaian bunga warna-warni', label: '03 / A CELEBRATION IN BLOOM' },
    { src: '1794226408848.jpg', alt: 'Inspirasi dekorasi pernikahan dari koleksi visual Fandy Mukty Decoration', label: '04 / DETAILS & ATMOSPHERE' },
    { src: '1789961566895.png', alt: 'Papan inspirasi desain dekorasi pernikahan elegan', label: '05 / DESIGN INSPIRATION' }
  ];
  extraImages.forEach((asset, index) => {
    const item = document.createElement('button');
    item.className = `gallery-item gallery-extra gallery-extra-${index + 1} reveal`;
    item.type = 'button';
    item.setAttribute('aria-label', `Perbesar foto portofolio: ${asset.label}`);
    const image = document.createElement('img');
    image.src = asset.src;
    image.alt = asset.alt;
    image.loading = 'lazy';
    image.decoding = 'async';
    const label = document.createElement('span');
    label.className = 'gallery-label';
    label.textContent = asset.label;
    const open = document.createElement('span');
    open.className = 'gallery-open';
    open.setAttribute('aria-hidden', 'true');
    open.textContent = '↗';
    item.append(image, label, open);
    gallery.append(item);
  });

  const updateScrollUI = () => {
    const scrolled = window.scrollY > 24;
    header.classList.toggle('scrolled', scrolled);
    backToTop.classList.toggle('visible', window.scrollY > 500);
  };
  updateScrollUI();
  window.addEventListener('scroll', updateScrollUI, { passive: true });

  menuToggle.addEventListener('click', () => {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Buka menu navigasi' : 'Tutup menu navigasi');
    navMenu.classList.toggle('is-open', !isOpen);
  });
  navMenu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Buka menu navigasi');
    navMenu.classList.remove('is-open');
  }));
  document.addEventListener('click', (event) => {
    if (!navMenu.contains(event.target) && !menuToggle.contains(event.target)) {
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Buka menu navigasi');
      navMenu.classList.remove('is-open');
    }
  });

  const filterButtons = document.querySelectorAll('.filter-button');
  const packages = document.querySelectorAll('.package-card');
  filterButtons.forEach((button) => button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    filterButtons.forEach((item) => {
      const active = item === button;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    packages.forEach((card) => {
      card.hidden = filter !== 'all' && card.dataset.category !== filter;
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

  const sectionLinks = [...document.querySelectorAll('.nav-menu a[href^="#"]')];
  const sections = sectionLinks.map((link) => document.querySelector(link.getAttribute('href'))).filter(Boolean);
  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        sectionLinks.forEach((link) => {
          const active = link.getAttribute('href') === `#${entry.target.id}`;
          link.classList.toggle('is-current', active);
          if (active) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-30% 0px -60% 0px' });
    sections.forEach((section) => sectionObserver.observe(section));
  }

  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduceMotion ? 'instant' : 'smooth' }));
  document.getElementById('year').textContent = new Date().getFullYear();

  const galleryItems = [...document.querySelectorAll('[data-lightbox]'), ...document.querySelectorAll('.gallery-extra')];
  galleryItems.forEach((item, index) => { item.dataset.lightbox = String(index); });
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
