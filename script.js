const themeBtn = document.getElementById('themeBtn');
        const themeIcon = document.getElementById('themeIcon');
        const body = document.body;

        themeBtn.addEventListener('click', () => {
            if (body.getAttribute('data-theme') === 'dark') {
                body.removeAttribute('data-theme');
                themeIcon.className = 'ri-moon-line';
            } else {
                body.setAttribute('data-theme', 'dark');
                themeIcon.className = 'ri-sun-line';
            }
        });