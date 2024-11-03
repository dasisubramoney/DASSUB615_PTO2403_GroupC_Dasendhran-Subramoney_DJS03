import { books, authors, genres, BOOKS_PER_PAGE } from './data.js'


class BookList {
    constructor(){
        this.page = 1;
        this.matches = books;
        this.intializelist();
    }

    intializelist(){
        this.renderBookPreviews();
        this.renderGenreOptions();
        this.renderAuthorOptions();
        this.applyTheme();
        this.setButtonState();
        this.addEventListeners();
    }

    renderBookPreviews() { // Method for sorting book reviews 
        const starting = document.createDocumentFragment();
        for (const { author, id, image, title } of this.matches.slice(0, BOOKS_PER_PAGE)) {
            const element = this.createBookPreviewElement(id, image, title, author);
            starting.appendChild(element);
        }
        document.querySelector('[data-list-items]').appendChild(starting);
    }

    createBookPreviewElement(id, image, title, author) { // Function takes in the input valuesa and adds then to the HTML
        const element = document.createElement('button');
        element.classList = 'preview';
        element.setAttribute('data-preview', id);
        element.innerHTML = `
            <img class="preview__image" src="${image}" />
            <div class="preview__info">
                <h3 class="preview__title">${title}</h3>
                <div class="preview__author">${authors[author]}</div>
            </div>
        `;
        return element; // Result is being returned
    }    

    renderGenreOptions() { // Method goes through the different genres in the database 
        const genreHtml = document.createDocumentFragment();
        const firstGenreElement = this.createOptionElement('any', 'All Genres');
        genreHtml.appendChild(firstGenreElement);
        for (const [id, name] of Object.entries(genres)) {
            genreHtml.appendChild(this.createOptionElement(id, name));
        }
        document.querySelector('[data-search-genres]').appendChild(genreHtml);
    }

    renderAuthorOptions() { // Method goes through the different authors in the database
        const authorsHtml = document.createDocumentFragment();
        const firstAuthorElement = this.createOptionElement('any', 'All Authors');
        authorsHtml.appendChild(firstAuthorElement);
        for (const [id, name] of Object.entries(authors)) {
            authorsHtml.appendChild(this.createOptionElement(id, name));
        }
        document.querySelector('[data-search-authors]').appendChild(authorsHtml);
    }

    createOptionElement(id, name) { // Function takes in the input valuesa and adds then to the HTML
        const element = document.createElement('option');
        element.value = id;
        element.innerText = name;
        return element; // Result is being returned
    }

    applyTheme() { // Add ths theme when a condition is met 
        const theme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'night' : 'day';
        document.querySelector('[data-settings-theme]').value = theme;
        this.updateTheme(theme);
    }

    updateTheme(theme) { // Updates the theme with the condition being met 
        const dark = theme === 'night' ? '255, 255, 255' : '10, 10, 20';
        const light = theme === 'night' ? '10, 10, 20' : '255, 255, 255';
        document.documentElement.style.setProperty('--color-dark', dark);
        document.documentElement.style.setProperty('--color-light', light);
    }

    // Set button method
    setButtonState() {
        const remaining = this.matches.length - BOOKS_PER_PAGE;
        document.querySelector('[data-list-button]').innerHTML = `
            <span>Show more</span>
            <span class="list__remaining"> (${remaining > 0 ? remaining : 0})</span>
        `;
        document.querySelector('[data-list-button]').disabled = remaining <= 0;
    }

    addEventListeners() { // Method which holds all the event listeners 
        document.querySelector('[data-search-cancel]').addEventListener('click', () => this.closeOverlay('[data-search-overlay]'));
        document.querySelector('[data-settings-cancel]').addEventListener('click', () => this.closeOverlay('[data-settings-overlay]'));
        document.querySelector('[data-header-search]').addEventListener('click', () => this.openOverlay('[data-search-overlay]', '[data-search-title]'));
        document.querySelector('[data-header-settings]').addEventListener('click', () => this.openOverlay('[data-settings-overlay]'));
        document.querySelector('[data-list-close]').addEventListener('click', () => this.closeOverlay('[data-list-active]'));
        document.querySelector('[data-settings-form]').addEventListener('submit', (event) => this.handleSettingsSubmit(event));
        document.querySelector('[data-search-form]').addEventListener('submit', (event) => this.handleSearchSubmit(event));
        document.querySelector('[data-list-button]').addEventListener('click', () => this.loadMoreBooks());
        document.querySelector('[data-list-items]').addEventListener('click', (event) => this.showBookDetails(event));
    }

    closeOverlay(selector) { // method for query selector 
        document.querySelector(selector).open = false;
    }

    openOverlay(selector, focusSelector) {  // method for query selector 
        document.querySelector(selector).open = true;
        document.querySelector(focusSelector).focus();
    }

    handleSettingsSubmit(event) { // Method fot the settings form 
        event.preventDefault();
        const { theme } = Object.fromEntries(formData)

        if (theme === 'night') {
            document.documentElement.style.setProperty('--color-dark', '255, 255, 255');
            document.documentElement.style.setProperty('--color-light', '10, 10, 20');
        } else {
            document.documentElement.style.setProperty('--color-dark', '10, 10, 20');
            document.documentElement.style.setProperty('--color-light', '255, 255, 255');
        }
        
        document.querySelector('[data-settings-overlay]').open = false
    }

    handleSearchSubmit(event) { // Method for the search form 
        event.preventDefault();
        const formData = new FormData(event.target)
    const filters = Object.fromEntries(formData)
    const result = []

    for (const book of books) {
        let genreMatch = filters.genre === 'any'

        for (const singleGenre of book.genres) {
            if (genreMatch) break;
            if (singleGenre === filters.genre) { genreMatch = true }
        }

        if (
            (filters.title.trim() === '' || book.title.toLowerCase().includes(filters.title.toLowerCase())) && 
            (filters.author === 'any' || book.author === filters.author) && 
            genreMatch
        ) {
            result.push(book)
        }
    }

    page = 1;
    matches = result

    if (result.length < 1) {
        document.querySelector('[data-list-message]').classList.add('list__message_show')
    } else {
        document.querySelector('[data-list-message]').classList.remove('list__message_show')
    }

    document.querySelector('[data-list-items]').innerHTML = ''
    const newItems = document.createDocumentFragment()

    for (const { author, id, image, title } of result.slice(0, BOOKS_PER_PAGE)) {
        const element = document.createElement('button')
        element.classList = 'preview'
        element.setAttribute('data-preview', id)
    
        element.innerHTML = `
            <img
                class="preview__image"
                src="${image}"
            />
            
            <div class="preview__info">
                <h3 class="preview__title">${title}</h3>
                <div class="preview__author">${authors[author]}</div>
            </div>
        `

        newItems.appendChild(element)
        }
    }


    loadMoreBooks() { // Method for the list button  
        const fragment = document.createDocumentFragment();
        this.matches.slice(this.page * BOOKS_PER_PAGE, (this.page + 1) * BOOKS_PER_PAGE).forEach((book) => fragment.appendChild(this.createBookPreviewElement(book.id, book.image, book.title, book.author)));
        document.querySelector('[data-list-items]').appendChild(fragment);
        this.page += 1;
        this.setButtonState();
    }

    showBookDetails(event) { // Method for the list items 
        const pathArray = Array.from(event.path || event.composedPath())
        let active = null
    
        for (const node of pathArray) {
            if (active) break
    
            if (node?.dataset?.preview) {
                let result = null
        
                for (const singleBook of books) {
                    if (result) break;
                    if (singleBook.id === node?.dataset?.preview) result = singleBook
                } 
            
                active = result
            }
        }
        
        if (active) {
            document.querySelector('[data-list-active]').open = true
            document.querySelector('[data-list-blur]').src = active.image
            document.querySelector('[data-list-image]').src = active.image
            document.querySelector('[data-list-title]').innerText = active.title
            document.querySelector('[data-list-subtitle]').innerText = `${authors[active.author]} (${new Date(active.published).getFullYear()})`
            document.querySelector('[data-list-description]').innerText = active.description
        }
    }

}

new BookList();
