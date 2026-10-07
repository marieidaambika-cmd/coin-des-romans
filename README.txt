COIN DES ROMANS
================

Fichiers du projet :
- index.html       -> page d'accueil
- romans.html      -> bibliothèque, recherche, filtres, favoris et résumés
- auteurs.html     -> page des auteurs
- favoris.html     -> bibliothèque personnelle
- contact.html     -> page de contact
- style.css        -> tout le design
- script.js        -> mode sombre, recherche, filtres, favoris, fenêtres et formulaire

OUVRIR DANS VS CODE
===================
1. Décompresser le dossier.
2. Dans VS Code : File > Open Folder.
3. Sélectionner le dossier "coin-des-romans".
4. Vérifier que les 7 fichiers sont au même niveau.
5. Installer l'extension "Live Server" de Ritwick Dey.
6. Ouvrir index.html.
7. Cliquer sur "Go Live" en bas à droite.
8. Le site s'ouvre dans le navigateur.

IMPORTANT
=========
Les fichiers HTML, CSS et JS restent séparés. Ne mets pas tout dans un seul fichier.
Les liens entre eux sont déjà configurés.

RENDER
======
Pour ce projet HTML/CSS/JS, choisir "Static Site" sur Render.
Le dépôt Git doit contenir les fichiers à la racine.
Build Command : laisser vide.
Publish Directory : .
Render peut connecter GitHub, GitLab ou Bitbucket.
document.addEventListener("DOMContentLoaded", () => {

    /* =========================
       MODE SOMBRE
    ========================= */

    const themeButton = document.getElementById("themeButton");

    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");

        if (themeButton) {
            themeButton.textContent = "☀️";
        }
    }

    if (themeButton) {

        themeButton.addEventListener("click", () => {

            document.body.classList.toggle("dark-mode");

            const darkMode =
                document.body.classList.contains("dark-mode");

            localStorage.setItem(
                "theme",
                darkMode ? "dark" : "light"
            );

            themeButton.textContent =
                darkMode ? "☀️" : "🌙";
        });
    }


    /* =========================
       FAVORIS
    ========================= */

    let favorites =
        JSON.parse(localStorage.getItem("favorites")) || [];


    function updateFavoriteCount() {

        const counters =
            document.querySelectorAll("#favoriteCount");

        counters.forEach(counter => {
            counter.textContent = favorites.length;
        });
    }


    function updateFavoriteButtons() {

        const buttons =
            document.querySelectorAll(".favorite-btn");

        buttons.forEach(button => {

            const title = button.dataset.title;

            if (favorites.includes(title)) {

                button.textContent = "♥";
                button.classList.add("active");

            } else {

                button.textContent = "♡";
                button.classList.remove("active");
            }
        });
    }


    document.querySelectorAll(".favorite-btn")
        .forEach(button => {

            button.addEventListener("click", () => {

                const title =
                    button.dataset.title;

                if (favorites.includes(title)) {

                    favorites =
                        favorites.filter(
                            item => item !== title
                        );

                } else {

                    favorites.push(title);
                }

                localStorage.setItem(
                    "favorites",
                    JSON.stringify(favorites)
                );

                updateFavoriteCount();
                updateFavoriteButtons();

                if (
                    document.getElementById("favoritesList")
                ) {
                    renderFavorites();
                }
            });
        });


    updateFavoriteCount();
    updateFavoriteButtons();


    /* =========================
       MODAL
    ========================= */

    const modal =
        document.getElementById("romanModal");

    const modalTitle =
        document.getElementById("modalTitle");

    const modalAuthor =
        document.getElementById("modalAuthor");

    const modalGenre =
        document.getElementById("modalGenre");

    const modalSummary =
        document.getElementById("modalSummary");


    document.querySelectorAll(".read-more")
        .forEach(button => {

            button.addEventListener("click", () => {

                if (!modal) return;

                modalTitle.textContent =
                    button.dataset.title;

                modalAuthor.textContent =
                    button.dataset.author;

                modalGenre.textContent =
                    button.dataset.genre;

                modalSummary.textContent =
                    button.dataset.summary;

                modal.classList.add("show");
            });
        });


    const closeModal =
        document.querySelector(".close-modal");


    if (closeModal) {

        closeModal.addEventListener("click", () => {
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
       RECHERCHE
    ========================= */

    const searchInput =
        document.getElementById("searchInput");

    const cards =
        document.querySelectorAll(".roman-card");


    if (searchInput) {

        searchInput.addEventListener("input", () => {

            const search =
                searchInput.value
                    .toLowerCase()
                    .trim();

            cards.forEach(card => {

                const text =
                    card.textContent.toLowerCase();

                card.style.display =
                    text.includes(search)
                        ? ""
                        : "none";
            });
        });
    }


    /* =========================
       FILTRES
    ========================= */

    const filterButtons =
        document.querySelectorAll(".filter-btn");


    filterButtons.forEach(button => {

        button.addEventListener("click", () => {

            filterButtons.forEach(btn => {
                btn.classList.remove("active");
            });

            button.classList.add("active");

            const genre =
                button.dataset.genre;

            cards.forEach(card => {

                if (
                    genre === "Tous" ||
                    card.dataset.genre === genre
                ) {

                    card.style.display = "";

                } else {

                    card.style.display = "none";
                }
            });

            if (searchInput) {
                searchInput.value = "";
            }
        });
    });


    /* =========================
       FILTRE DEPUIS ACCUEIL
    ========================= */

    const params =
        new URLSearchParams(window.location.search);

    const selectedGenre =
        params.get("genre");


    if (selectedGenre) {

        filterButtons.forEach(button => {

            if (
                button.dataset.genre === selectedGenre
            ) {

                button.click();
            }
        });
    }


    /* =========================
       PAGE FAVORIS
    ========================= */

    function renderFavorites() {

        const favoritesList =
            document.getElementById("favoritesList");

        const emptyFavorites =
            document.getElementById("emptyFavorites");

        if (!favoritesList) return;

        favoritesList.innerHTML = "";


        if (favorites.length === 0) {

            if (emptyFavorites) {
                emptyFavorites.style.display = "block";
            }

            return;
        }


        if (emptyFavorites) {
            emptyFavorites.style.display = "none";
        }


        favorites.forEach(title => {

            const card =
                document.createElement("article");

            card.className =
                "roman-card favorite-result";


            card.innerHTML = `
                <div class="book-cover cover-purple">
                    <span>❤️</span>
                    <strong>${title}</strong>
                    <small>COIN DES ROMANS</small>
                </div>

                <div class="roman-info">
                    <span class="tag favorite-tag">
                        Mon favori
                    </span>

                    <h3>${title}</h3>

                    <p>Roman enregistré dans tes favoris.</p>

                    <button
                        class="favorite-btn active"
                        data-title="${title}"
                    >
                        ♥
                    </button>

                    <a
                        href="romans.html"
                        class="read-more-link"
                    >
                        Voir les romans
                    </a>
                </div>
            `;


            favoritesList.appendChild(card);
        });


        favoritesList
            .querySelectorAll(".favorite-btn")
            .forEach(button => {

                button.addEventListener("click", () => {

                    const title =
                        button.dataset.title;

                    favorites =
                        favorites.filter(
                            item => item !== title
                        );

                    localStorage.setItem(
                        "favorites",
                        JSON.stringify(favorites)
                    );

                    updateFavoriteCount();
                    renderFavorites();
                });
            });
    }


    renderFavorites();


    /* =========================
       FORMULAIRE CONTACT
    ========================= */

    const contactForm =
        document.getElementById("contactForm");


    if (contactForm) {

        contactForm.addEventListener("submit", event => {

            event.preventDefault();

            alert(
                "✨ Merci pour ton message ! Il a bien été pris en compte."
            );

            contactForm.reset();
        });
    }

});