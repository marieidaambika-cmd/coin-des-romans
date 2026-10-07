/* ==========================================
   COIN DES ROMANS
   JavaScript principal
========================================== */


/* =========================
   THÈME CLAIR / SOMBRE
========================= */

const themeButton = document.getElementById("themeButton");

function updateTheme() {
    const theme = localStorage.getItem("theme");

    if (theme === "dark") {
        document.body.classList.add("dark");

        if (themeButton) {
            themeButton.textContent = "☀️";
        }
    } else {
        document.body.classList.remove("dark");

        if (themeButton) {
            themeButton.textContent = "🌙";
        }
    }
}

updateTheme();

if (themeButton) {
    themeButton.addEventListener("click", () => {

        document.body.classList.toggle("dark");

        if (document.body.classList.contains("dark")) {
            localStorage.setItem("theme", "dark");
            themeButton.textContent = "☀️";
        } else {
            localStorage.setItem("theme", "light");
            themeButton.textContent = "🌙";
        }
    });
}


/* =========================
   FAVORIS
========================= */

function getFavorites() {
    return JSON.parse(localStorage.getItem("favorites")) || [];
}

function saveFavorites(favorites) {
    localStorage.setItem("favorites", JSON.stringify(favorites));
}

function updateFavoriteCount() {

    const countElement = document.getElementById("favoriteCount");

    if (countElement) {
        countElement.textContent = getFavorites().length;
    }
}

updateFavoriteCount();


function getBookData(card) {

    return {
        title: card.dataset.title,
        author: card.dataset.author,
        genre: card.dataset.genre,
        image: card.dataset.image,
        summary: card.dataset.summary
    };
}


function isFavorite(title) {

    return getFavorites().some(book => book.title === title);
}


function updateFavoriteButtons() {

    document.querySelectorAll(".book-card").forEach(card => {

        const button = card.querySelector(".favorite-btn");

        if (!button) return;

        if (isFavorite(card.dataset.title)) {
            button.classList.add("active");
            button.textContent = "♥";
        } else {
            button.classList.remove("active");
            button.textContent = "♡";
        }
    });
}


document.querySelectorAll(".favorite-btn").forEach(button => {

    button.addEventListener("click", (event) => {

        event.stopPropagation();

        const card = button.closest(".book-card");

        if (!card) return;

        const book = getBookData(card);

        let favorites = getFavorites();

        const index = favorites.findIndex(item => item.title === book.title);

        if (index !== -1) {

            favorites.splice(index, 1);

        } else {

            favorites.push(book);
        }

        saveFavorites(favorites);

        updateFavoriteCount();
        updateFavoriteButtons();

        if (document.getElementById("favoritesGrid")) {
            renderFavorites();
        }
    });
});


updateFavoriteButtons();


/* =========================
   RECHERCHE
========================= */

const searchInput = document.getElementById("searchInput");
const filterButtons = document.querySelectorAll(".filter-btn");

let currentFilter = "Tous";

function filterBooks() {

    const cards = document.querySelectorAll("#booksGrid .book-card");
    const noResults = document.getElementById("noResults");

    if (!cards.length) return;

    const search = searchInput
        ? searchInput.value.toLowerCase().trim()
        : "";

    let visible = 0;

    cards.forEach(card => {

        const title = card.dataset.title.toLowerCase();
        const author = card.dataset.author.toLowerCase();
        const genre = card.dataset.genre;

        const matchesSearch =
            title.includes(search) ||
            author.includes(search);

        const matchesGenre =
            currentFilter === "Tous" ||
            genre === currentFilter;

        if (matchesSearch && matchesGenre) {
            card.style.display = "";
            visible++;
        } else {
            card.style.display = "none";
        }
    });

    if (noResults) {
        noResults.style.display = visible === 0 ? "block" : "none";
    }
}


if (searchInput) {
    searchInput.addEventListener("input", filterBooks);
}


filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        filterButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        currentFilter = button.dataset.filter;

        filterBooks();
    });
});


/* =========================
   GENRE DANS L'URL
========================= */

const params = new URLSearchParams(window.location.search);
const genreFromURL = params.get("genre");

if (genreFromURL && filterButtons.length) {

    const matchingButton = [...filterButtons].find(
        button => button.dataset.filter === genreFromURL
    );

    if (matchingButton) {

        filterButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        matchingButton.classList.add("active");

        currentFilter = genreFromURL;

        filterBooks();
    }
}


/* =========================
   MODAL
========================= */

const modal = document.getElementById("romanModal");
const modalClose = document.querySelector(".modal-close");

const modalImage = document.getElementById("modalImage");
const modalTitle = document.getElementById("modalTitle");
const modalAuthor = document.getElementById("modalAuthor");
const modalGenre = document.getElementById("modalGenre");
const modalSummary = document.getElementById("modalSummary");
const modalFavorite = document.getElementById("modalFavorite");

let selectedBook = null;


document.querySelectorAll(".read-more").forEach(button => {

    button.addEventListener("click", () => {

        const card = button.closest(".book-card");

        if (!card || !modal) return;

        selectedBook = getBookData(card);

        modalImage.src = selectedBook.image;
        modalImage.alt = selectedBook.title;

        modalImage.onerror = function () {
            this.style.display = "none";
        };

        modalTitle.textContent = selectedBook.title;
        modalAuthor.textContent = selectedBook.author;
        modalGenre.textContent = selectedBook.genre;
        modalSummary.textContent = selectedBook.summary;

        updateModalFavoriteButton();

        modal.classList.add("show");
    });
});


function updateModalFavoriteButton() {

    if (!modalFavorite || !selectedBook) return;

    if (isFavorite(selectedBook.title)) {
        modalFavorite.textContent = "♥ Retirer des favoris";
    } else {
        modalFavorite.textContent = "♡ Ajouter aux favoris";
    }
}


if (modalFavorite) {

    modalFavorite.addEventListener("click", () => {

        if (!selectedBook) return;

        let favorites = getFavorites();

        const index = favorites.findIndex(
            book => book.title === selectedBook.title
        );

        if (index !== -1) {
            favorites.splice(index, 1);
        } else {
            favorites.push(selectedBook);
        }

        saveFavorites(favorites);

        updateFavoriteCount();
        updateFavoriteButtons();
        updateModalFavoriteButton();

        if (document.getElementById("favoritesGrid")) {
            renderFavorites();
        }
    });
}


if (modalClose) {
    modalClose.addEventListener("click", () => {
        modal.classList.remove("show");
    });
}


if (modal) {

    modal.addEventListener("click", event => {

        if (event.target === modal) {
            modal.classList.remove("show");
        }
    });
}


/* =========================
   FAVORIS PAGE
========================= */

function renderFavorites() {

    const grid = document.getElementById("favoritesGrid");
    const empty = document.getElementById("emptyFavorites");

    if (!grid) return;

    const favorites = getFavorites();

    grid.innerHTML = "";

    if (favorites.length === 0) {

        if (empty) {
            empty.style.display = "block";
        }

        return;
    }

    if (empty) {
        empty.style.display = "none";
    }

    favorites.forEach(book => {

        const card = document.createElement("article");

        card.className = "book-card";

        card.dataset.title = book.title;
        card.dataset.author = book.author;
        card.dataset.genre = book.genre;
        card.dataset.image = book.image;
        card.dataset.summary = book.summary;

        card.innerHTML = `
            <div class="book-cover">
                <img
                    src="${book.image}"
                    alt="${book.title}"
                    onerror="this.style.display='none'; this.parentElement.classList.add('cover-fallback');"
                >

                <button class="favorite-btn active" aria-label="Retirer des favoris">
                    ♥
                </button>
            </div>

            <div class="book-info">
                <span class="tag">${book.genre}</span>
                <h3>${book.title}</h3>
                <p>${book.author}</p>
                <button class="read-more">Découvrir →</button>
            </div>
        `;

        grid.appendChild(card);
    });


    grid.querySelectorAll(".favorite-btn").forEach(button => {

        button.addEventListener("click", () => {

            const card = button.closest(".book-card");

            let favorites = getFavorites();

            favorites = favorites.filter(
                book => book.title !== card.dataset.title
            );

            saveFavorites(favorites);

            updateFavoriteCount();
            renderFavorites();
        });
    });


    grid.querySelectorAll(".read-more").forEach(button => {

        button.addEventListener("click", () => {

            const card = button.closest(".book-card");

            if (!modal) return;

            selectedBook = getBookData(card);

            modalImage.style.display = "block";
            modalImage.src = selectedBook.image;
            modalImage.alt = selectedBook.title;

            modalTitle.textContent = selectedBook.title;
            modalAuthor.textContent = selectedBook.author;
            modalGenre.textContent = selectedBook.genre;
            modalSummary.textContent = selectedBook.summary;

            updateModalFavoriteButton();

            modal.classList.add("show");
        });
    });
}


renderFavorites();


/* =========================
   CONTACT
========================= */

const contactForm = document.getElementById("contactForm");
const contactMessage = document.getElementById("contactMessage");

if (contactForm) {

    contactForm.addEventListener("submit", event => {

        event.preventDefault();

        contactMessage.textContent =
            "✨ Merci ! Ton message a bien été enregistré.";

        contactForm.reset();
    });
}