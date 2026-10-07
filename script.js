/* =========================================
   COIN DES ROMANS — JAVASCRIPT
========================================= */


/* =========================================
   THÈME
========================================= */

const themeButton = document.getElementById("themeButton");

const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
    document.body.classList.add("dark");

    if (themeButton) {
        themeButton.textContent = "☀️";
    }
}

if (themeButton) {

    themeButton.addEventListener("click", () => {

        document.body.classList.toggle("dark");

        const isDark =
            document.body.classList.contains("dark");

        localStorage.setItem(
            "theme",
            isDark ? "dark" : "light"
        );

        themeButton.textContent =
            isDark ? "☀️" : "🌙";

    });

}


/* =========================================
   FAVORIS
========================================= */

function getFavorites() {

    try {

        return JSON.parse(
            localStorage.getItem("favorites")
        ) || [];

    } catch {

        return [];

    }

}


function saveFavorites(favorites) {

    localStorage.setItem(
        "favorites",
        JSON.stringify(favorites)
    );

}


function updateFavoriteCount() {

    const countElement =
        document.getElementById("favoriteCount");

    if (!countElement) return;

    countElement.textContent =
        getFavorites().length;

}


function isFavorite(title) {

    return getFavorites().some(
        book => book.title === title
    );

}


function updateFavoriteButtons() {

    const buttons =
        document.querySelectorAll(".favorite-btn");

    buttons.forEach(button => {

        const title =
            button.dataset.title;

        if (isFavorite(title)) {

            button.classList.add("active");

            button.textContent =
                "❤️ Retirer";

        } else {

            button.classList.remove("active");

            button.textContent =
                "❤️ Favori";

        }

    });

}


/* =========================================
   AJOUT / SUPPRESSION FAVORI
========================================= */

document.addEventListener("click", event => {

    const button =
        event.target.closest(".favorite-btn");

    if (!button) return;

    const book = {

        title: button.dataset.title,

        author: button.dataset.author,

        genre: button.dataset.genre,

        image: button.dataset.image

    };

    let favorites = getFavorites();


    const index =
        favorites.findIndex(
            item => item.title === book.title
        );


    if (index !== -1) {

        favorites.splice(index, 1);

    } else {

        favorites.push(book);

    }


    saveFavorites(favorites);

    updateFavoriteCount();

    updateFavoriteButtons();

    renderFavorites();

});


/* =========================================
   MODAL
========================================= */

const modal =
    document.getElementById("romanModal");

const modalImage =
    document.getElementById("modalImage");

const modalTitle =
    document.getElementById("modalTitle");

const modalAuthor =
    document.getElementById("modalAuthor");

const modalGenre =
    document.getElementById("modalGenre");

const modalSummary =
    document.getElementById("modalSummary");

const modalFavorite =
    document.getElementById("modalFavorite");

const modalShare =
    document.getElementById("modalShare");

let currentBook = null;


function openModal(book) {

    if (!modal) return;

    currentBook = book;

    modalImage.src = book.image;

    modalImage.alt =
        "Couverture de " + book.title;

    modalTitle.textContent =
        book.title;

    modalAuthor.textContent =
        book.author;

    modalGenre.textContent =
        book.genre;

    modalSummary.textContent =
        book.summary || "Aucun résumé disponible.";

    modalGenre.className =
        "tag " + getGenreClass(book.genre);


    if (isFavorite(book.title)) {

        modalFavorite.textContent =
            "❤️ Retirer des favoris";

    } else {

        modalFavorite.textContent =
            "❤️ Ajouter aux favoris";

    }


    modal.classList.add("show");

    document.body.style.overflow = "hidden";

}


function closeModal() {

    if (!modal) return;

    modal.classList.remove("show");

    document.body.style.overflow = "";

}


document.addEventListener("click", event => {

    const button =
        event.target.closest(".read-more");

    if (!button) return;


    const book = {

        title: button.dataset.title,

        author: button.dataset.author,

        genre: button.dataset.genre,

        image: button.dataset.image,

        summary: button.dataset.summary

    };


    openModal(book);

});


document.addEventListener("click", event => {

    if (
        event.target.classList.contains("close-modal") ||
        event.target === modal
    ) {

        closeModal();

    }

});


document.addEventListener("keydown", event => {

    if (event.key === "Escape") {

        closeModal();

    }

});


/* =========================================
   FAVORI DEPUIS LE MODAL
========================================= */

if (modalFavorite) {

    modalFavorite.addEventListener("click", () => {

        if (!currentBook) return;


        let favorites =
            getFavorites();


        const index =
            favorites.findIndex(
                book =>
                    book.title === currentBook.title
            );


        if (index !== -1) {

            favorites.splice(index, 1);

            modalFavorite.textContent =
                "❤️ Ajouter aux favoris";

        } else {

            favorites.push(currentBook);

            modalFavorite.textContent =
                "❤️ Retirer des favoris";

        }


        saveFavorites(favorites);

        updateFavoriteCount();

        updateFavoriteButtons();

        renderFavorites();

    });

}


/* =========================================
   PARTAGER
========================================= */

if (modalShare) {

    modalShare.addEventListener("click", async () => {

        if (!currentBook) return;


        const shareData = {

            title: currentBook.title,

            text:
                currentBook.title +
                " — découvert sur Coin des Romans",

            url: window.location.href

        };


        try {

            if (navigator.share) {

                await navigator.share(shareData);

            } else {

                await navigator.clipboard.writeText(
                    window.location.href
                );

                alert(
                    "🔗 Le lien a été copié !"
                );

            }

        } catch {

            // L'utilisateur a simplement annulé le partage.

        }

    });

}


/* =========================================
   CLASSE DES GENRES
========================================= */

function getGenreClass(genre) {

    const classes = {

        "Romance": "romance",

        "Fantasy": "fantasy",

        "Fantastique": "fantastic",

        "Mystère": "mystery",

        "Drame": "drama",

        "Dark Romance": "dark-romance"

    };

    return classes[genre] || "";

}


/* =========================================
   RECHERCHE + FILTRES
========================================= */

const searchInput =
    document.getElementById("searchInput");

const filterButtons =
    document.querySelectorAll(".filter-btn");

const cards =
    document.querySelectorAll(
        "#bookGrid .roman-card"
    );

const noResults =
    document.getElementById("noResults");

let activeFilter = "Tous";


function filterBooks() {

    if (!cards.length) return;


    const search =
        searchInput
            ? searchInput.value
                .toLowerCase()
                .trim()
            : "";


    let visibleCount = 0;


    cards.forEach(card => {

        const title =
            card
                .querySelector("h3")
                ?.textContent
                .toLowerCase() || "";


        const author =
            card
                .querySelector(".author")
                ?.textContent
                .toLowerCase() || "";


        const genre =
            card.dataset.genre || "";


        const matchesSearch =
            title.includes(search) ||
            author.includes(search);


        const matchesGenre =
            activeFilter === "Tous" ||
            genre === activeFilter;


        if (
            matchesSearch &&
            matchesGenre
        ) {

            card.style.display = "";

            visibleCount++;

        } else {

            card.style.display = "none";

        }

    });


    if (noResults) {

        noResults.style.display =
            visibleCount === 0
                ? "block"
                : "none";

    }

}


if (searchInput) {

    searchInput.addEventListener(
        "input",
        filterBooks
    );

}


filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        filterButtons.forEach(btn =>
            btn.classList.remove("active")
        );

        button.classList.add("active");

        activeFilter =
            button.dataset.filter;

        filterBooks();

    });

});


/* =========================================
   FILTRE DEPUIS L'URL
========================================= */

const params =
    new URLSearchParams(
        window.location.search
    );

const urlGenre =
    params.get("genre");


if (urlGenre && filterButtons.length) {

    const matchingButton =
        [...filterButtons].find(
            button =>
                button.dataset.filter === urlGenre
        );


    if (matchingButton) {

        filterButtons.forEach(btn =>
            btn.classList.remove("active")
        );

        matchingButton.classList.add("active");

        activeFilter = urlGenre;

        filterBooks();

    }

}


/* =========================================
   PAGE FAVORIS
========================================= */

function renderFavorites() {

    const grid =
        document.getElementById("favoritesGrid");

    const empty =
        document.getElementById("emptyFavorites");


    if (!grid) return;


    const favorites =
        getFavorites();


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

        const card =
            document.createElement("article");

        card.className =
            "roman-card visible";


        card.innerHTML = `

            <div class="book-cover">

                <img
                    src="${book.image}"
                    alt="Couverture de ${book.title}"
                >

            </div>

            <div class="roman-info">

                <span class="tag ${getGenreClass(book.genre)}">
                    ${book.genre}
                </span>

                <h3>${book.title}</h3>

                <p class="author">
                    ${book.author}
                </p>

                <div class="card-buttons">

                    <button
                        class="favorite-btn active"
                        data-title="${book.title}"
                        data-author="${book.author}"
                        data-genre="${book.genre}"
                        data-image="${book.image}"
                    >
                        ❤️ Retirer
                    </button>

                </div>

            </div>

        `;


        grid.appendChild(card);

    });

}


/* =========================================
   FORMULAIRE CONTACT
========================================= */

const contactForm =
    document.getElementById("contactForm");


if (contactForm) {

    contactForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();

            alert(
                "✨ Merci pour ton message !"
            );

            contactForm.reset();

        }
    );

}


/* =========================================
   INITIALISATION
========================================= */

updateFavoriteCount();

updateFavoriteButtons();

renderFavorites();

filterBooks();


/* =========================================
   ANIMATION DES CARTES
========================================= */

const animatedElements =
    document.querySelectorAll(
        ".roman-card, .genre-card, .featured-book, .author-card"
    );


const observer =
    new IntersectionObserver(
        entries => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.classList.add(
                        "visible"
                    );

                    observer.unobserve(
                        entry.target
                    );

                }

            });

        },
        {
            threshold: 0.12
        }
    );


animatedElements.forEach(element => {

    observer.observe(element);

});