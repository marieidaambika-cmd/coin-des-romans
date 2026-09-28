// COIN DES ROMANS - SCRIPT

// MODE SOMBRE
const themeButton = document.getElementById("themeButton");

if (themeButton) {
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark");
        themeButton.textContent = "☀️";
    }

    themeButton.addEventListener("click", () => {
        document.body.classList.toggle("dark");
        const dark = document.body.classList.contains("dark");
        localStorage.setItem("theme", dark ? "dark" : "light");
        themeButton.textContent = dark ? "☀️" : "🌙";
    });
}

// FAVORIS
function getFavorites() {
    return JSON.parse(localStorage.getItem("favorites")) || [];
}

function saveFavorites(favorites) {
    localStorage.setItem("favorites", JSON.stringify(favorites));
}

function toggleFavorite(title) {
    let favorites = getFavorites();

    if (favorites.includes(title)) {
        favorites = favorites.filter(book => book !== title);
    } else {
        favorites.push(title);
    }

    saveFavorites(favorites);
    updateFavoriteButtons();
    renderFavoritesPage();
}

function updateFavoriteButtons() {
    const favorites = getFavorites();

    document.querySelectorAll(".favorite-btn").forEach(button => {
        const title = button.dataset.title;
        const active = favorites.includes(title);
        button.textContent = active ? "❤️" : "♡";
        button.classList.toggle("active", active);
        button.onclick = () => toggleFavorite(title);
    });
}

// RECHERCHE + FILTRE
const searchInput = document.getElementById("searchInput");
const romanCards = document.querySelectorAll(".roman-card");
let selectedGenre = "Tous";

function filterRomans() {
    const search = searchInput ? searchInput.value.toLowerCase().trim() : "";

    romanCards.forEach(card => {
        const text = card.textContent.toLowerCase();
        const genre = card.dataset.genre;
        const matchesSearch = text.includes(search);
        const matchesGenre = selectedGenre === "Tous" || genre === selectedGenre;
        card.style.display = matchesSearch && matchesGenre ? "" : "none";
    });
}

if (searchInput) {
    searchInput.addEventListener("input", filterRomans);
}

document.querySelectorAll(".filter-btn").forEach(button => {
    button.addEventListener("click", () => {
        document.querySelectorAll(".filter-btn").forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");
        selectedGenre = button.dataset.genre;
        filterRomans();
    });
});

// FENÊTRE DES RÉSUMÉS
const modal = document.getElementById("romanModal");
const modalTitle = document.getElementById("modalTitle");
const modalAuthor = document.getElementById("modalAuthor");
const modalSummary = document.getElementById("modalSummary");
const closeModal = document.querySelector(".close-modal");

document.querySelectorAll(".read-more").forEach(button => {
    button.addEventListener("click", () => {
        if (!modal) return;
        modalTitle.textContent = button.dataset.title;
        modalAuthor.textContent = "✍️ " + button.dataset.author;
        modalSummary.textContent = button.dataset.summary;
        modal.classList.add("show");
    });
});

if (closeModal) {
    closeModal.addEventListener("click", () => modal.classList.remove("show"));
}

if (modal) {
    window.addEventListener("click", event => {
        if (event.target === modal) modal.classList.remove("show");
    });
}

// FORMULAIRE
const contactForm = document.getElementById("contactForm");

if (contactForm) {
    contactForm.addEventListener("submit", event => {
        event.preventDefault();
        alert("✨ Merci pour ton message ! Nous avons bien reçu ta demande.");
        contactForm.reset();
    });
}

// PAGE FAVORIS
function renderFavoritesPage() {
    const container = document.getElementById("favoritesContainer");
    const empty = document.getElementById("emptyFavorites");
    if (!container || !empty) return;

    const allBooks = [
        {title:"Le Secret de la Maison", author:"Emma Laurent", genre:"Mystère", cover:"🏚️", cls:"cover-1"},
        {title:"Un Été Inoubliable", author:"Clara Martin", genre:"Romance", cover:"🌅", cls:"cover-2"},
        {title:"Le Royaume Perdu", author:"Lucas Bernard", genre:"Fantastique", cover:"🏰", cls:"cover-3"},
        {title:"Les Ombres du Passé", author:"Sophie Morel", genre:"Drame", cover:"🌑", cls:"cover-4"},
        {title:"La Porte Fermée", author:"Julie Moreau", genre:"Mystère", cover:"🚪", cls:"cover-5"},
        {title:"Le Monde Caché", author:"Nicolas Roy", genre:"Fantastique", cover:"🌌", cls:"cover-6"}
    ];

    const favorites = getFavorites();
    container.innerHTML = "";

    allBooks.filter(book => favorites.includes(book.title)).forEach(book => {
        const card = document.createElement("article");
        card.className = "roman-card";
        card.innerHTML = `
            <div class="roman-cover ${book.cls}">${book.cover}</div>
            <div class="roman-info">
                <span class="genre">${book.genre}</span>
                <h3>${book.title}</h3>
                <p>${book.author}</p>
                <button class="favorite-btn active" data-title="${book.title}">❤️</button>
            </div>
        `;
        container.appendChild(card);
    });

    empty.style.display = favorites.length ? "none" : "block";
    updateFavoriteButtons();
}

updateFavoriteButtons();
renderFavoritesPage();
