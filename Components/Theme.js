class ThemeSettings extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
    }

    render() { //Creates a dropdown for theme selection with "Day" and "Night" options.
        this.shadowRoot.innerHTML = `
            <label>Theme:
                <select data-settings-theme>
                    <option value="day">Day</option>
                    <option value="night">Night</option>
                </select>
            </label>
        `;

        this.shadowRoot.querySelector('select').addEventListener('change', (event) => { //Adds an event listener to detect changes in the dropdown, triggering updateTheme() when a user changes the theme.
            const theme = event.target.value;
            this.updateTheme(theme);
        });
    }

    updateTheme(theme) { //Updates CSS custom properties to switch between light and dark themes dynamically.
        const dark = theme === 'night' ? '255, 255, 255' : '10, 10, 20';
        const light = theme === 'night' ? '10, 10, 20' : '255, 255, 255';
        document.documentElement.style.setProperty('--color-dark', dark);
        document.documentElement.style.setProperty('--color-light', light);
    }
}

customElements.define('theme-settings', ThemeSettings);
