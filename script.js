/* Darshan Math Tutoring — mobile navigation, subtle animation, and Formspree form. */
const menuButton = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('#nav-links');

function closeMenu() {
  navLinks.classList.remove('is-open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open menu');
}
menuButton.addEventListener('click', () => {
  const expanded = menuButton.getAttribute('aria-expanded') === 'true';
  navLinks.classList.toggle('is-open', !expanded);
  menuButton.setAttribute('aria-expanded', String(!expanded));
  menuButton.setAttribute('aria-label', expanded ? 'Open menu' : 'Close menu');
});
navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });

// Quick contact choices on small screens (email and Facebook only).
const quickButton = document.querySelector('.quick-toggle');
const quickOptions = document.querySelector('#quick-options');
quickButton.addEventListener('click', () => {
  quickOptions.hidden = !quickOptions.hidden;
  quickButton.setAttribute('aria-expanded', String(!quickOptions.hidden));
  quickButton.setAttribute('aria-label', quickOptions.hidden ? 'Open quick contact options' : 'Close quick contact options');
});
document.addEventListener('click', event => {
  if (!event.target.closest('.quick-contact')) {
    quickOptions.hidden = true;
    quickButton.setAttribute('aria-expanded', 'false');
  }
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    quickOptions.hidden = true;
    quickButton.setAttribute('aria-expanded', 'false');
  }
});

// Reveal sections when they enter the viewport; keep all content visible in older browsers.
const animated = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  animated.forEach(element => observer.observe(element));
} else {
  animated.forEach(element => element.classList.add('is-visible'));
}

// Static websites need a form service. Replace YOUR_FORM_ID in index.html to enable Formspree.
const form = document.querySelector('#contact-form');
const status = document.querySelector('#form-status');
form.addEventListener('submit', async event => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  if (form.action.includes('YOUR_FORM_ID')) {
    status.textContent = 'Form setup is not complete yet. Please email ramanidarshan18@gmail.com instead.';
    status.style.color = '#a24625';
    return;
  }
  const submit = form.querySelector('button[type="submit"]');
  submit.disabled = true;
  submit.textContent = 'Sending…';
  status.textContent = '';
  try {
    const response = await fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' }
    });
    if (!response.ok) throw new Error('Form submission failed');
    status.textContent = 'Thanks! Your message was sent. I’ll reply by email soon.';
    status.style.color = '#126477';
    form.reset();
  } catch {
    status.textContent = 'The message could not be sent. Please email ramanidarshan18@gmail.com directly.';
    status.style.color = '#a24625';
  } finally {
    submit.disabled = false;
    submit.textContent = 'Send My Request →';
  }
});
