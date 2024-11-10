class BookPreview extends HTMLElement {
    static get observedAttributes() {
        return ['data-id', 'data-image', 'data-title', 'data-author'];
    }

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    attributeChangedCallback() {
        this.render();
    }

    render() {
        const id = this.getAttribute('data-id');
        const image = this.getAttribute('data-image');
        const title = this.getAttribute('data-title');
        const author = this.getAttribute('data-author');

        this.shadowRoot.innerHTML = `
            <style>
                /* Add your CSS for preview styling */
            </style>
            <button class="preview" data-preview="${id}">
                <img class="preview__image" src="${image}" />
                <div class="preview__info">
                    <h3 class="preview__title">${title}</h3>
                    <div class="preview__author">${authors[author]}</div>
                </div>
            </button>
        `;
    }
}

customElements.define('book-preview', BookPreview);
