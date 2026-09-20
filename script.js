const header = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('.nav-menu');
const navLinks = [...document.querySelectorAll('.nav-link')];
const sections = [...document.querySelectorAll('main section[id]')];
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Keep navigation immediate instead of forcing slow smooth scrolling.
document.documentElement.style.scrollBehavior = 'auto';

const closeMenu = () => {
    menu.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open menu');
};

menuToggle.addEventListener('click', () => {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Open menu' : 'Close menu');
    menu.classList.toggle('open', !isOpen);
});

navLinks.forEach((link) => link.addEventListener('click', closeMenu));
document.addEventListener('click', (event) => {
    if (menu.classList.contains('open') && !menu.contains(event.target) && !menuToggle.contains(event.target)) closeMenu();
});

let headerTick = false;
const updateHeader = () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
    headerTick = false;
};
updateHeader();
window.addEventListener('scroll', () => {
    if (!headerTick) {
        headerTick = true;
        requestAnimationFrame(updateHeader);
    }
}, { passive: true });

if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            navLinks.forEach((link) => link.classList.toggle('is-active', link.getAttribute('href') === `#${entry.target.id}`));
        });
    }, { rootMargin: '-35% 0px -55% 0px' });
    sections.forEach((section) => sectionObserver.observe(section));

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));
} else {
    document.querySelectorAll('.reveal').forEach((element) => element.classList.add('visible'));
}

// Lightweight pointer/touch 3D tilt. requestAnimationFrame prevents transform work on every event.
if (!reduceMotion) {
    const tiltTargets = document.querySelectorAll('.skill-card, .project-card, .info-card, .contact-card, .button, .joke-card');
    tiltTargets.forEach((card) => {
        let frame = 0;
        let pendingEvent;
        const reset = () => {
            card.style.transform = '';
            card.style.setProperty('--pointer-x', '50%');
            card.style.setProperty('--pointer-y', '50%');
        };
        const applyTilt = () => {
            frame = 0;
            if (!pendingEvent) return;
            const event = pendingEvent;
            pendingEvent = null;
            const rect = card.getBoundingClientRect();
            const x = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
            const y = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height));
            const amount = card.matches('.button') ? 4 : 9;
            card.style.setProperty('--pointer-x', `${x * 100}%`);
            card.style.setProperty('--pointer-y', `${y * 100}%`);
            card.style.transform = `perspective(850px) rotateX(${(0.5 - y) * amount}deg) rotateY(${(x - 0.5) * amount}deg) translateZ(${card.matches('.button') ? 5 : 8}px)`;
        };
        card.addEventListener('pointermove', (event) => {
            pendingEvent = event;
            if (!frame) frame = requestAnimationFrame(applyTilt);
        }, { passive: true });
        card.addEventListener('pointerleave', reset, { passive: true });
        card.addEventListener('pointercancel', reset, { passive: true });
    });
}

const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();
