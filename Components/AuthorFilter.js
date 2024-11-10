class AuthorOptions extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
    }

    render() { //Similar to GenreOptions, render() builds the authors dropdown by iterating over the authors data. It includes a default "All Authors" option and then iterates over the author data.
        const authorsHtml = document.createDocumentFragment();
        const firstAuthorElement = this.createOptionElement('any', 'All Authors');
        authorsHtml.appendChild(firstAuthorElement);
        for (const [id, name] of Object.entries(authors)) {
            authorsHtml.appendChild(this.createOptionElement(id, name));
        }
        document.querySelector('[data-search-authors]').appendChild(authorsHtml);
    }

    createOption(value, text) { //A helper function for generating <option> elements.
        const option = document.createElement('option');
        option.value = value;
        option.innerText = text;
        return option;
    }
}

customElements.define('author-options', AuthorOptions);
