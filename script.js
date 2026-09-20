const header = document.querySelector('.site-header');
const nav = document.querySelector('.nav');
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelectorAll('.nav a');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const updateHeader = () => {
  header.classList.toggle('scrolled', window.scrollY > 16);
};

window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();

menuToggle.addEventListener('click', () => {
  const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!isExpanded));
  nav.classList.toggle('open');
});

navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    navLinks.forEach((item) => item.classList.toggle('active', item === link));
  });
});

const revealItems = document.querySelectorAll('.reveal');
revealItems.forEach((item, index) => {
  item.style.transitionDelay = `${index * 0.08}s`;
  item.classList.add('visible');
});

if (!reduceMotion) {
  const scene = document.querySelector('.scene');
  const terminal = document.querySelector('.terminal-shell');

  const handlePointerMove = (event) => {
    const x = (event.clientX / window.innerWidth) - 0.5;
    const y = (event.clientY / window.innerHeight) - 0.5;

    if (scene) {
      scene.style.transform = `translate(${x * 18}px, ${y * 18}px)`;
    }

    if (terminal) {
      terminal.style.transform = `perspective(1200px) rotateX(${12 - y * 18}deg) rotateY(${(-16) + x * 24}deg) translateZ(0)`;
    }
  };

  window.addEventListener('pointermove', handlePointerMove, { passive: true });
}
