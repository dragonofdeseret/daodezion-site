const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('#site-nav');

if (menuToggle && siteNav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = siteNav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });
}

const placeholderLinks = document.querySelectorAll('a[data-rsvp], .book-link[href="#"]');

placeholderLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    if (link.getAttribute('href') === '#') {
      event.preventDefault();
      if (link.dataset.rsvp) {
        window.alert(link.dataset.rsvp);
      } else {
        window.alert('Replace this placeholder # with the external link you want readers to use.');
      }
    }
  });
});
