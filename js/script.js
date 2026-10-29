/* =========================================================
   JAVASCRIPT — interacciones de StreetSync
   ========================================================= */

// Número de WhatsApp de contacto 
const WHATSAPP_NUMBER = '573238028475';

// Año automático en el footer
document.getElementById('year').textContent = new Date().getFullYear();

// --- Navbar: cambia de estilo al hacer scroll ---
const navbar = document.getElementById('navbar');
const onScrollNav = () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
};
window.addEventListener('scroll', onScrollNav, { passive: true });
onScrollNav();

// --- Menú móvil ---
const navToggle = document.getElementById('navToggle');
const mobileMenu = document.getElementById('mobileMenu');
navToggle.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  navToggle.classList.toggle('active', isOpen);
  navToggle.setAttribute('aria-expanded', isOpen);
});
// Cierra el menú móvil al elegir un enlace
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    navToggle.classList.remove('active');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// --- Resalta el enlace de navegación activo según la sección visible ---
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');
const highlightNav = () => {
  let current = sections[0]?.id;
  sections.forEach(sec => {
    const top = sec.getBoundingClientRect().top;
    if (top <= window.innerHeight * 0.4) current = sec.id;
  });
  navAnchors.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
};
window.addEventListener('scroll', highlightNav, { passive: true });

// --- Revelado gradual de elementos al hacer scroll ---
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal').forEach((el, i) => {
  // pequeño escalonado dentro de una misma cuadrícula, sin exagerar
  el.style.transitionDelay = (i % 3) * 90 + 'ms';
  revealObserver.observe(el);
});

// --- Contadores animados de la sección de estadísticas ---
// Admite decimales con data-decimals (ej. data-target="4.8" data-decimals="1")
const counters = document.querySelectorAll('.counter');
const animateCounter = (el) => {
  const target = parseFloat(el.dataset.target);
  const decimals = parseInt(el.dataset.decimals || '0', 10);
  const format = (n) => n.toLocaleString('es-CO', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
  const duration = 1600;
  const start = performance.now();

  const step = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    // easing suave de salida
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = format(eased * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = format(target);
  };
  requestAnimationFrame(step);
};

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.6 });

counters.forEach(c => counterObserver.observe(c));

// --- Filtros de la sección Emprendimientos ---
const filterButtons = document.querySelectorAll('.filter-btn');
const ventureCards = document.querySelectorAll('.venture-card');
filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    filterButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const category = btn.textContent.trim();

    ventureCards.forEach(card => {
      const tag = card.querySelector('.venture-tag').textContent.trim();
      const show = category === 'Todos' || category === tag;
      card.style.display = show ? '' : 'none';
    });
  });
});

// --- Formulario de contacto: arma el mensaje y abre WhatsApp ---
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();

  if (!contactForm.checkValidity()) {
    formStatus.textContent = 'Por favor completa tu nombre y tu mensaje.';
    return;
  }

  const name = document.getElementById('name').value.trim();
  const venture = document.getElementById('venture').value.trim();
  const message = document.getElementById('message').value.trim();

  const intro = venture
    ? `Hola, soy ${name} y tengo un emprendimiento: ${venture}.`
    : `Hola, soy ${name}.`;
  const text = `${intro}\n\n${message}`;

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank', 'noopener');

  formStatus.textContent = `¡Gracias, ${name}! Abrimos WhatsApp para que envíes tu mensaje.`;
  contactForm.reset();
});
