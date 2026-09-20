document.addEventListener('DOMContentLoaded', () => {
  const linkedInUrl = 'https://www.linkedin.com/in/santhosh-m-35a59a3ab?utm_source=share_via&utm_content=profile&utm_medium=member_android';
  const header = document.querySelector('.site-header');
  const menuToggle = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.nav-menu');
  const navLinks = [...document.querySelectorAll('.nav-link')];
  const sections = [...document.querySelectorAll('main section[id]')];

  // Keep every LinkedIn CTA in sync from one source of truth.
  document.querySelectorAll('a[href="YOUR_LINKEDIN_URL"]').forEach((link) => {
    link.href = linkedInUrl;
  });

  const closeMenu = () => {
    if (!menu || !menuToggle) return;
    menu.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open menu');
  };

  if (menuToggle && menu) {
    menuToggle.addEventListener('click', () => {
      const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', String(!isOpen));
      menuToggle.setAttribute('aria-label', isOpen ? 'Open menu' : 'Close menu');
      menu.classList.toggle('open', !isOpen);
    });
  }

  navLinks.forEach((link) => link.addEventListener('click', closeMenu));

  const updateHeader = () => {
    if (!header) return;
    header.classList.toggle('scrolled', window.scrollY > 18);
  };

  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          navLinks.forEach((link) => {
            link.classList.toggle('is-active', link.getAttribute('href') === `#${entry.target.id}`);
          });
        });
      },
      { rootMargin: '-35% 0px -55% 0px' }
    );
    sections.forEach((section) => sectionObserver.observe(section));

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12 }
    );
    document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));
  } else {
    document.querySelectorAll('.reveal').forEach((element) => element.classList.add('visible'));
  }

  const yearNode = document.getElementById('year');
  if (yearNode) yearNode.textContent = new Date().getFullYear();

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Smooth pointer-driven 3D tilt with a reset on exit.
  document.querySelectorAll('.tilt-card').forEach((card) => {
    let frame = 0;
    let pointerEvent;

    const reset = () => {
      card.style.transform = '';
      card.style.removeProperty('--pointer-x');
      card.style.removeProperty('--pointer-y');
    };

    const renderTilt = () => {
      frame = 0;
      if (!pointerEvent) return;
      const rect = card.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (pointerEvent.clientX - rect.left) / rect.width));
      const y = Math.max(0, Math.min(1, (pointerEvent.clientY - rect.top) / rect.height));
      card.style.setProperty('--pointer-x', `${x * 100}%`);
      card.style.setProperty('--pointer-y', `${y * 100}%`);
      card.style.transform = `perspective(1000px) rotateX(${(0.5 - y) * 12}deg) rotateY(${(x - 0.5) * 12}deg) translateY(-6px) translateZ(8px)`;
    };

    card.addEventListener('pointermove', (event) => {
      pointerEvent = event;
      if (!frame) frame = requestAnimationFrame(renderTilt);
    }, { passive: true });
    card.addEventListener('pointerleave', reset, { passive: true });
    card.addEventListener('pointercancel', reset, { passive: true });
  });

  // Add a subtle 3D parallax layer to the hero artwork.
  const heroVisual = document.querySelector('.hero-visual');
  if (heroVisual) {
    heroVisual.addEventListener('pointermove', (event) => {
      const rect = heroVisual.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      heroVisual.style.transform = `perspective(1200px) rotateX(${y * -3}deg) rotateY(${x * 4}deg)`;
    }, { passive: true });
    heroVisual.addEventListener('pointerleave', () => {
      heroVisual.style.transform = '';
    }, { passive: true });
  }
});
