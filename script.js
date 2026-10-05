document.addEventListener("DOMContentLoaded", () => {

    /* ================= THÈME ================= */
    const themeButton = document.getElementById("themeButton");
    if (themeButton) {
        if (localStorage.getItem("theme") === "dark") {
            document.body.classList.add("dark");
            themeButton.textContent = "☀️";
        }

        themeButton.addEventListener("click", () => {
            document.body.classList.toggle("dark");
            const isDark = document.body.classList.contains("dark");
            localStorage.setItem("theme", isDark ? "dark" : "light");
            themeButton.textContent = isDark ? "☀️" : "🌙";
        });
    }

    /* ================= BASE DE DONNÉES DES ROMANS ================= */
    const booksData = [
        {
            title: "Le Secret de la Maison",
            author: "Emma Laurent",
            genre: "Mystère",
            image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop",
            summary: "Une jeune fille découvre une vieille maison abandonnée et cherche à découvrir les secrets de son passé."
        },
        {
            title: "Un Été Inoubliable",
            author: "Clara Martin",
            genre: "Romance",
            image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop",
            summary: "Un été rempli de rencontres et de découvertes qui va changer la vie de deux jeunes personnes."
        },
        {
            title: "Le Royaume Perdu",
            author: "Lucas Bernard",
            genre: "Fantastique",
            image: "https://images.unsplash.com/photo-1514539079130-25950c84af65?q=80&w=800&auto=format&fit=crop",
            summary: "Un royaume oublié réapparaît mystérieusement et révèle une ancienne histoire à une jeune aventurière."
        },
        {
            title: "Les Ombres du Passé",
            author: "Sophie Morel",
            genre: "Drame",
            image: "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?q=80&w=800&auto=format&fit=crop",
            summary: "Une jeune femme revient dans sa ville natale et doit affronter les souvenirs qu'elle avait laissés derrière elle."
        },
        {
            title: "La Porte Fermée",
            author: "Julie Moreau",
            genre: "Mystère",
            image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800&auto=format&fit=crop",
            summary: "Une porte mystérieuse apparaît dans une ancienne demeure. Personne ne sait ce qu'elle cache."
        },
        {
            title: "Le Monde Caché",
            author: "Nicolas Roy",
            genre: "Fantastique",
            image: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=800&auto=format&fit=crop",
            summary: "Un monde invisible aux yeux des humains existe juste à côté du nôtre. Un jeune étudiant découvre comment y entrer."
        }
    ];

    /* ================= GESTION DES FAVORIS ================= */
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    const favoriteCount = document.getElementById("favoriteCount");
    const favoritesGrid = document.getElementById("favoritesGrid");
    const noFavorites = document.getElementById("noFavorites");

    function updateFavoriteCount() {
        if (favoriteCount) favoriteCount.textContent = favorites.length;
    }

    function renderFavoritesPage() {
        if (!favoritesGrid) return;

        favoritesGrid.innerHTML = "";

        if (favorites.length === 0) {
            if (noFavorites) noFavorites.style.display = "block";
            return;
        }

        if (noFavorites) noFavorites.style.display = "none";

        const favBooks = booksData.filter(book => favorites.includes(book.title));

        favBooks.forEach(book => {
            const card = document.createElement("article");
            card.className = "roman-card";
            card.dataset.genre = book.genre;

            card.innerHTML = `
                <div class="roman-cover">
                    <button class="favorite-btn active" data-title="${book.title}">❤️</button>
                    <img src="${book.image}" alt="${book.title}" class="book-img" loading="lazy">
                </div>
                <div class="roman-info">
                    <span class="genre">${book.genre}</span>
                    <h3>${book.title}</h3>
                    <p>${book.author}</p>
                    <button class="read-more" 
                            data-title="${book.title}" 
                            data-author="${book.author}" 
                            data-summary="${book.summary}">Lire le résumé</button>
                </div>
            `;
            favoritesGrid.appendChild(card);
        });

        attachEvents();
    }

    function attachEvents() {
        // Boutons favoris (Ajout/Retrait)
        document.querySelectorAll(".favorite-btn").forEach(button => {
            button.addEventListener("click", () => {
                const title = button.dataset.title;

                if (favorites.includes(title)) {
                    favorites = favorites.filter(item => item !== title);
                    button.classList.remove("active");
                    button.textContent = "♡";
                } else {
                    favorites.push(title);
                    button.classList.add("active");
                    button.textContent = "❤️️";
                }

                localStorage.setItem("favorites", JSON.stringify(favorites));
                updateFavoriteCount();

                // Si nous sommes sur la page favoris.html, on rafraîchit la grille
                if (favoritesGrid) renderFavoritesPage();
            });
        });

        // Boutons lire la suite (Modal)
        document.querySelectorAll(".read-more").forEach(button => {
            button.addEventListener("click", () => {
                if (!modal) return;
                if (modalTitle) modalTitle.textContent = button.dataset.title || "";
                if (modalAuthor) modalAuthor.textContent = "✍️ " + (button.dataset.author || "");
                if (modalSummary) modalSummary.textContent = button.dataset.summary || "";
                modal.classList.add("show");
            });
        });
    }

    updateFavoriteCount();
    renderFavoritesPage();
    attachEvents();

    /* ================= MODAL ================= */
    const modal = document.getElementById("romanModal");
    const closeModal = document.querySelector(".close-modal");
    const modalTitle = document.getElementById("modalTitle");
    const modalAuthor = document.getElementById("modalAuthor");
    const modalSummary = document.getElementById("modalSummary");

    if (closeModal && modal) {
        closeModal.addEventListener("click", () => modal.classList.remove("show"));
    }

    if (modal) {
        modal.addEventListener("click", event => {
            if (event.target === modal) modal.classList.remove("show");
        });
        window.addEventListener("keydown", event => {
            if (event.key === "Escape") modal.classList.remove("show");
        });
    }

    /* ================= RECHERCHE & FILTRES (catalogue) ================= */
    const searchInput = document.getElementById("searchInput");
    const filterButtons = document.querySelectorAll(".filter-btn");
    const romanCards = document.querySelectorAll(".roman-card");
    let currentFilter = "Tous";

    function filterCards() {
        const query = searchInput ? searchInput.value.toLowerCase().trim() : "";

        romanCards.forEach(card => {
            const matchesText = card.textContent.toLowerCase().includes(query);
            const matchesGenre = (currentFilter === "Tous") || (card.dataset.genre === currentFilter);

            card.style.display = (matchesText && matchesGenre) ? "" : "none";
        });
    }

    if (searchInput) searchInput.addEventListener("input", filterCards);

    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            filterButtons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");
            currentFilter = button.dataset.genre;
            filterCards();
        });
    });
});