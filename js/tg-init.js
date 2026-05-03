// Инициализация Telegram Mini App
window.Telegram.WebApp.ready();
window.Telegram.WebApp.expand();

const tg = window.Telegram.WebApp;
const themeParams = tg.themeParams;

// Применяем тему к CSS переменным
const root = document.documentElement;
root.style.setProperty('--tg-theme-bg', themeParams.bg_color || '#ffffff');
root.style.setProperty('--tg-theme-text', themeParams.text_color || '#000000');
root.style.setProperty('--tg-theme-hint', themeParams.hint_color || '#999999');
root.style.setProperty('--tg-theme-link', themeParams.link_color || '#2481cc');
root.style.setProperty('--tg-theme-button', themeParams.button_color || '#2481cc');
root.style.setProperty('--tg-theme-button-text', themeParams.button_text_color || '#ffffff');
root.style.setProperty('--tg-theme-secondary-bg', themeParams.secondary_bg_color || '#f0f0f0');

// Определяем цветовую схему (light/dark)
document.body.classList.add(tg.colorScheme);