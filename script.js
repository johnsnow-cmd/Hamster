const header = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('.nav-menu');
const navLinks = [...document.querySelectorAll('.nav-link')];
const sections = [...document.querySelectorAll('main section[id]')];

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

const updateHeader = () => header.classList.toggle('scrolled', window.scrollY > 20);
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

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

document.getElementById('year').textContent = new Date().getFullYear();
