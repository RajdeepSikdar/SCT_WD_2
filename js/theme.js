class ThemeManager {
    constructor() {
        this.themes = ['dark', 'light', 'neon', 'oled'];
        this.currentTheme = localStorage.getItem('stopwatchTheme') || 'dark';
        this.init();
    }

    init() {
        this.setTheme(this.currentTheme);
        this.setupThemeSwitcher();
    }

    setTheme(theme) {
        if (!this.themes.includes(theme)) return;
        
        this.currentTheme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('stopwatchTheme', theme);
        
        // Update theme button text
        const themeBtn = document.getElementById('themeBtn');
        if (themeBtn) {
            themeBtn.textContent = this.getNextTheme();
        }
    }

    getNextTheme() {
        const currentIndex = this.themes.indexOf(this.currentTheme);
        const nextIndex = (currentIndex + 1) % this.themes.length;
        return this.themes[nextIndex].charAt(0).toUpperCase() + this.themes[nextIndex].slice(1);
    }

    cycleTheme() {
        const currentIndex = this.themes.indexOf(this.currentTheme);
        const nextIndex = (currentIndex + 1) % this.themes.length;
        this.setTheme(this.themes[nextIndex]);
    }

    setupThemeSwitcher() {
        const themeBtn = document.getElementById('themeBtn');
        if (themeBtn) {
            themeBtn.textContent = this.getNextTheme();
            themeBtn.addEventListener('click', () => this.cycleTheme());
        }
    }
}

const themeManager = new ThemeManager();