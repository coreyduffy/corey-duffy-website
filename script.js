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

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        if (this.classList.contains('email-link')) return;
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const navHeight = document.querySelector('.nav').offsetHeight;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
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
