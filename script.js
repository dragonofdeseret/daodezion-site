const nav = document.querySelector('#site-nav');
const menuToggle = document.querySelector('.menu-toggle');

if (menuToggle && nav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });
}

const rsvpLinks = document.querySelectorAll('[data-rsvp]');
rsvpLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    if (link.getAttribute('href') === '#') {
      event.preventDefault();
      window.alert(link.dataset.rsvp);
    }
  });
});

const bookLinks = document.querySelectorAll('[data-book-link]');
bookLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    if (link.getAttribute('href') === '#') {
      event.preventDefault();
      window.alert('Replace this placeholder with your preferred external edition or translation link.');
    }
  });
});
