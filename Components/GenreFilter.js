class GenreOptions extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
    }

    render() { //Creates the genre options dropdown dynamically using data from genres. It adds an "All Genres" option by default and then iterates over each genre in the genres object.
        const genreHtml = document.createDocumentFragment();
        const firstGenreElement = this.createOptionElement('any', 'All Genres');
        genreHtml.appendChild(firstGenreElement);
        for (const [id, name] of Object.entries(genres)) {
            genreHtml.appendChild(this.createOptionElement(id, name));
        }
        document.querySelector('[data-search-genres]').appendChild(genreHtml);
    }

    createOption(id, name) { //This helper function generates individual <option> elements with id and display name.
        const option = document.createElement('option');
        option.id = id;
        option.innerText = name;
        return option;
    }
}

customElements.define('genre-options', GenreOptions);
