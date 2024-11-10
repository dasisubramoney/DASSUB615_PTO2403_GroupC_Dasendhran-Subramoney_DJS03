class BookList extends HTMLElement {
    constructor() { 
        super();
        this.page = 1; // Track the current page and the filtered list of books
        this.matches = books;
        this.attachShadow({ mode: 'open' });
        this.render();
    }

    connectedCallback() { // Called when the component is added to the DOM. It initializes the theme and sets up event listeners.
        this.applyTheme();
        this.addEventListeners();
    }

    render() {// Sets up the main HTML structure, placing components (genre-options, author-options, and the book previews) in the layout.
        this.shadowRoot.innerHTML = `
            <style>
                .wrapper{
                    position: fixed;
                    bottom: 0;
                    left: 0;
                    width: 100%;
                    border-width: 0;
                    box-shadow: 0px 3px 3px -2px rgba(0,0,0,0.2), 0px 3px 4px 0px rgba(0,0,0,0.14), 0px 1px 8px 0px rgba(0,0,0,0.12);
                    animation-name: enter;
                    animation-duration: 0.6s;
                    z-index: 10;
                    background-color: rgba(var(--color-light), 1);
                    }

                    @media (min-width: 30rem) {
                    .wrapper {
                        max-width: 30rem;
                        left: 0%;
                        top: 0;
                        border-radius: 8px;;
                    }
                    }

                    .form {
                    padding-bottom: 0.5rem;
                    margin: 0 auto;
                    }

                    .row {
                    display: flex;
                    gap: 0.5rem;
                    margin: 0 auto;
                    justify-content: center;
                    }

                    .button {
                    font-family: Roboto, sans-serif;
                    background-color: rgba(var(--color-blue), 0.1);
                    transition: background-color 0.1s;
                    border-width: 0;
                    border-radius: 6px;
                    height: 2.75rem;
                    cursor: pointer;
                    width: 50%;
                    color: rgba(var(--color-blue), 1);
                    font-size: 1rem;
                    border: 1px solid rgba(var(--color-blue), 1);
                    }

                    .button_primary {
                    background-color: rgba(var(--color-blue), 1);
                    color: rgba(var(--color-force-light), 1);
                    }

                    .button:hover {
                    background-color: rgba(var((var(--color-blue))), 0.2);
                    }


                    .button_primary:hover {
                    background-color: rgba(var(--color-blue), 0.8);
                    color: rgba(var(--color-force-light), 1);
                    }

                    .input {
                    width: 100%;
                    margin-bottom: 0.5rem;
                    background-color: rgba(var(--color-dark), 0.05);
                    border-width: 0;
                    border-radius: 6px;
                    width: 100%;
                    height: 4rem;
                    color: rgba(var(--color-dark), 1);
                    padding: 1rem 0.5rem 0 0.75rem;
                    font-size: 1.1rem;
                    font-weight: bold;
                    font-family: Roboto, sans-serif;
                    cursor: pointer;
                    }

                    .input_select {
                    padding-left: 0.5rem;
                    }

                    .field {
                    position: relative;
                    display: block;
                    }

                    .label {
                    position: absolute;
                    top: 0.75rem;
                    left: 0.75rem;
                    font-size: 0.85rem;
                    color: rgba(var(--color-dark), 0.4);
                    }

                    .input:hover {
                    background-color: rgba(var(--color-dark), 0.1);
                    }

                    .title {
                    padding: 1rem 0 0.25rem;
                    font-size: 1.25rem;
                    font-weight: bold;
                    line-height: 1;
                    letter-spacing: -0.1px;
                    max-width: 25rem;
                    margin: 0 auto;
                    color: rgba(var(--color-dark), 0.8)
                    }

                    .blur {
                    width: 100%;
                    height: 200px;
                    filter: blur(10px);
                    opacity: 0.5;
                    transform: scale(2);
                    }

                    .image {
                    max-width: 10rem;
                    position: absolute;
                    top: 1.5m;
                    left: calc(50% - 5rem);
                    border-radius: 2px;
                    box-shadow: 0px 3px 3px -2px rgba(0,0,0,0.2), 0px 3px 4px 0px rgba(0,0,0,0.14), 0px 1px 8px 0px rgba(0,0,0,0.12);
                    }

                    .data {
                    font-size: 0.9rem;
                    display: -webkit-box;
                    -webkit-line-clamp: 6;
                    -webkit-box-orient: vertical;  
                    overflow: hidden;
                    color: rgba(var(--color-dark), 0.8)
                    }

                    .data_secondary {
                    color: rgba(var(--color-dark), 0.6)
                    }

                    .content {
                    padding: 2rem 1.5rem;
                    text-align: center;
                    padding-top: 3rem;
                    }

                    .preview {
                    overflow: hidden;
                    margin: -1rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    }

                    .background {
                    background: rgba(var(--color-dark), 0.6);
                    position: fixed;
                    top: 0;
                    left: 0;
                    height: 100vh;
                    width: 100vw;
                    }
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

    renderBookPreviews() { // Creates BookPreview components dynamically for each book and appends them to the [data-list-items] container. This allows book previews to be generated independently and displayed in a modular way.
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

    setButtonState() { //Updates the state and text of the "Show more" button, calculating the remaining books based on the current page.
        const remaining = this.matches.length - BOOKS_PER_PAGE;
        document.querySelector('[data-list-button]').innerHTML = `
            <span>Show more</span>
            <span class="list__remaining"> (${remaining > 0 ? remaining : 0})</span>
        `;
        document.querySelector('[data-list-button]').disabled = remaining <= 0;
    }

    applyTheme() { //Checks the user's preferred color scheme and applies it to the document.
        const theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'night' : 'day';
        document.documentElement.style.setProperty('--color-dark', theme === 'night' ? '255, 255, 255' : '10, 10, 20');
        document.documentElement.style.setProperty('--color-light', theme === 'night' ? '10, 10, 20' : '255, 255, 255');
    }

    addEventListeners() { //Sets up the event listener for the "Show more" button, linking it to loadMoreBooks() to incrementally load more books as requested.
        this.shadowRoot.querySelector('[data-list-button]').addEventListener('click', () => this.loadMoreBooks());
    }

    loadMoreBooks() {
        this.page += 1;
        this.renderBookPreviews();
        this.setButtonState();
    }
}

customElements.define('book-list', BookList);