const themeToggle = document.querySelector('.theme-toggle');

function updateToggleLabel(theme) {
    themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
}

themeToggle.addEventListener('click', () => {
    const theme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    updateToggleLabel(theme);
});

updateToggleLabel(document.documentElement.getAttribute('data-theme'));

const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
});

document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

document.querySelectorAll('.email-link').forEach(link => {
    function assembleEmail() {
        return link.dataset.u + '@' + link.dataset.d;
    }

    link.addEventListener('click', function(e) {
        e.preventDefault();
        window.location.href = 'mailto:' + assembleEmail();
    });

    link.addEventListener('mouseenter', function() {
        const email = assembleEmail();
        const textEl = this.querySelector('.email-text');
        if (textEl) textEl.textContent = email;
        this.href = 'mailto:' + email;
    });
});

document.querySelector('.footer-year').textContent = new Date().getFullYear();

const navLinks = new Map(
    [...document.querySelectorAll('.nav-menu a[href^="#"]')].map(link => [link.getAttribute('href').slice(1), link])
);

const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        const link = navLinks.get(entry.target.id);
        if (!link) return;
        if (entry.isIntersecting) {
            navLinks.forEach(other => other.classList.remove('active'));
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}, { rootMargin: '-40% 0px -55% 0px' });

document.querySelectorAll('main section[id]').forEach(section => sectionObserver.observe(section));
