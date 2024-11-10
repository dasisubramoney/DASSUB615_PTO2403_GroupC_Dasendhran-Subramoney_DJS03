class BookList extends HTMLElement {
    constructor() {
        super();
        this.page = 1;
        this.matches = books;
        this.attachShadow({ mode: 'open' });
        this.render();
    }

    connectedCallback() {
        this.applyTheme();
        this.addEventListeners();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                /* Add your CSS styles here */
            </style>
            <div>
                <genre-options></genre-options>
                <author-options></author-options>
                <div data-list-items></div>
                <button data-list-button>Show more</button>
            </div>
        `;
        this.renderBookPreviews();
        this.setButtonState();
    }

    renderBookPreviews() {
        const container = this.shadowRoot.querySelector('[data-list-items]');
        container.innerHTML = ''; // Clear current previews
        const fragment = document.createDocumentFragment();
        this.matches.slice(0, BOOKS_PER_PAGE).forEach(({ id, image, title, author }) => {
            const preview = document.createElement('book-preview');
            preview.setAttribute('data-id', id);
            preview.setAttribute('data-image', image);
            preview.setAttribute('data-title', title);
            preview.setAttribute('data-author', author);
            fragment.appendChild(preview);
        });
        container.appendChild(fragment);
    }

    setButtonState() {
        const button = this.shadowRoot.querySelector('[data-list-button]');
        const remaining = this.matches.length - BOOKS_PER_PAGE * this.page;
        button.textContent = `Show more (${remaining > 0 ? remaining : 0})`;
        button.disabled = remaining <= 0;
    }

    applyTheme() {
        const theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'night' : 'day';
        document.documentElement.style.setProperty('--color-dark', theme === 'night' ? '255, 255, 255' : '10, 10, 20');
        document.documentElement.style.setProperty('--color-light', theme === 'night' ? '10, 10, 20' : '255, 255, 255');
    }

    addEventListeners() {
        this.shadowRoot.querySelector('[data-list-button]').addEventListener('click', () => this.loadMoreBooks());
    }

    loadMoreBooks() {
        this.page += 1;
        this.renderBookPreviews();
        this.setButtonState();
    }
}

customElements.define('book-list', BookList);
