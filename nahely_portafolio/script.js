const root = document.documentElement;
const body = document.body;
const header = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');
const themeToggle = document.querySelector('.theme-toggle');
const navLinks = document.querySelectorAll('.nav-panel a');

window.addEventListener('load', () => {
  setTimeout(() => document.querySelector('.loader')?.classList.add('hidden'), 650);
});

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 30);
});

menuToggle?.addEventListener('click', () => {
  const open = body.classList.toggle('menu-open');
  menuToggle.setAttribute('aria-expanded', String(open));
});
navLinks.forEach(link => link.addEventListener('click', () => {
  body.classList.remove('menu-open');
  menuToggle?.setAttribute('aria-expanded', 'false');
}));

const savedTheme = localStorage.getItem('nm-theme');
if (savedTheme) root.dataset.theme = savedTheme;
themeToggle?.addEventListener('click', () => {
  const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
  root.dataset.theme = next;
  localStorage.setItem('nm-theme', next);
});

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.13 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

const statObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = Number(el.dataset.count || 0);
    const duration = 1200;
    const start = performance.now();
    function animate(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased);
      if (progress < 1) requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
    statObserver.unobserve(el);
  });
}, { threshold: 0.7 });
document.querySelectorAll('.stat-number').forEach(el => statObserver.observe(el));

const words = ['Arquitecta', 'Docente universitaria', 'Investigadora', 'Consultora', 'Impulsora de innovación'];
const typed = document.querySelector('.typed-text');
let wordIndex = 0;
let letterIndex = 0;
let deleting = false;
function typeLoop() {
  if (!typed) return;
  const word = words[wordIndex];
  typed.textContent = word.slice(0, letterIndex);
  if (!deleting && letterIndex < word.length) {
    letterIndex++;
    setTimeout(typeLoop, 75);
  } else if (!deleting && letterIndex === word.length) {
    deleting = true;
    setTimeout(typeLoop, 1400);
  } else if (deleting && letterIndex > 0) {
    letterIndex--;
    setTimeout(typeLoop, 38);
  } else {
    deleting = false;
    wordIndex = (wordIndex + 1) % words.length;
    setTimeout(typeLoop, 250);
  }
}
setTimeout(typeLoop, 1100);

document.getElementById('current-year').textContent = new Date().getFullYear();

const dot = document.querySelector('.cursor-dot');
const ring = document.querySelector('.cursor-ring');
let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;
window.addEventListener('mousemove', e => {
  mouseX = e.clientX; mouseY = e.clientY;
  if (dot) dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
});
function moveRing() {
  ringX += (mouseX - ringX) * .14;
  ringY += (mouseY - ringY) * .14;
  if (ring) ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
  requestAnimationFrame(moveRing);
}
moveRing();
document.querySelectorAll('a, button, .expertise-card').forEach(el => {
  el.addEventListener('mouseenter', () => ring?.classList.add('hover'));
  el.addEventListener('mouseleave', () => ring?.classList.remove('hover'));
});

const photo = document.querySelector('.photo-frame');
window.addEventListener('scroll', () => {
  if (!photo || window.innerWidth < 900) return;
  const offset = Math.min(window.scrollY * .035, 26);
  photo.style.transform = `translateY(${offset}px)`;
}, { passive: true });
