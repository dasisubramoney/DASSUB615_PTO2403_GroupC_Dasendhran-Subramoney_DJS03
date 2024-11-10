class GenreOptions extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
    }

    render() {
        const fragment = document.createDocumentFragment();
        const defaultOption = this.createOption('any', 'All Genres');
        fragment.appendChild(defaultOption);
        Object.entries(genres).forEach(([id, name]) => {
            fragment.appendChild(this.createOption(id, name));
        });

        this.shadowRoot.innerHTML = `<select data-search-genres></select>`;
        this.shadowRoot.querySelector('select').appendChild(fragment);
    }

    createOption(value, text) {
        const option = document.createElement('option');
        option.value = value;
        option.innerText = text;
        return option;
    }
}

customElements.define('genre-options', GenreOptions);
