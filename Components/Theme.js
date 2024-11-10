class ThemeSettings extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <label>Theme:
                <select data-settings-theme>
                    <option value="day">Day</option>
                    <option value="night">Night</option>
                </select>
            </label>
        `;

        this.shadowRoot.querySelector('select').addEventListener('change', (e) => {
            const theme = e.target.value;
            this.updateTheme(theme);
        });
    }

    updateTheme(theme) {
        const dark = theme === 'night' ? '255, 255, 255' : '10, 10, 20';
        const light = theme === 'night' ? '10, 10, 20' : '255, 255, 255';
        document.documentElement.style.setProperty('--color-dark', dark);
        document.documentElement.style.setProperty('--color-light', light);
    }
}

customElements.define('theme-settings', ThemeSettings);
