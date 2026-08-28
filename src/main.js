import { router } from './router/index.js';

document.addEventListener('DOMContentLoaded', () => {
    // 1. Inicializar el Router
    router();

    // 2. Lógica Global: Cambio de Tema
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            if (htmlElement.getAttribute('data-theme') === 'dark') {
                htmlElement.removeAttribute('data-theme');
                themeToggle.textContent = '🌙 Oscuro';
            } else {
                htmlElement.setAttribute('data-theme', 'dark');
                themeToggle.textContent = '☀️ Claro';
            }
        });
    }
});

window.addEventListener('hashchange', router);