//Mettre le code JavaScript lié à la page photographer.html

// Pattern Module pour l'application photographe
const PhotographerApp = (function() {
    // Variables privées
    let currentPhotographer = null;
    let mediaData = [];
    
    // Méthode pour obtenir les données du photographe
    async function getPhotographerData() {
        try {
            const response = await fetch("./data/photographers.json");
            const data = await response.json();
            
            const urlParams = new URLSearchParams(window.location.search);
            const photographerId = parseInt(urlParams.get("id"));
            
            currentPhotographer = data.photographers.find(p => p.id === photographerId);
            mediaData = data.media.filter(m => m.photographerId === photographerId);
            
            return { photographer: currentPhotographer, media: mediaData };
        } catch (error) {
            console.error("Erreur lors de la récupération des données:", error);
        }
    }
    
    // Fonction utilitaire pour obtenir le dossier du photographe
    function getPhotographerFolder(photographerName) {
        const folderMapping = {
            "Mimi Keel": "Mimi",
            "Ellie-Rose Wilkens": "Ellie Rose",
            "Tracy Galindo": "Tracy",
            "Nabeel Bradford": "Nabeel",
            "Rhode Dubois": "Rhode",
            "Marcel Nikolic": "Marcel",
        };
        return folderMapping[photographerName] || photographerName;
    }
    
    // Gestionnaire d'affichage des informations du photographe
    const PhotographerInfoDisplay = {
        display(photographer) {
            const header = document.querySelector(".photograph-header");
            const name = header.querySelector(".photographer-name");
            const location = header.querySelector(".photographer-location");
            const tagline = header.querySelector(".photographer-tagline");
            const portrait = header.querySelector(".photographer-portrait");
            const pricePerDay = document.querySelector(".price-per-day");
            
            name.textContent = photographer.name;
            location.textContent = `${photographer.city}, ${photographer.country}`;
            tagline.textContent = photographer.tagline;
            portrait.src = `assets/portrait/${photographer.portrait}`;
            portrait.alt = photographer.name;
            pricePerDay.textContent = `${photographer.price}€ / jour`;
        }
    };
    
    // Factory Method pour créer des éléments média
    const MediaFactory = {
        createMediaElement(media) {
            const article = document.createElement("article");
            article.className = "media-card";
            
            const photographerFolder = getPhotographerFolder(currentPhotographer.name);
            const mediaPath = `assets/Sample Photos/${photographerFolder}/${media.image || media.video}`;
            
            const mediaElement = media.image
                ? `<img src="${mediaPath}" alt="${media.title}">`
                : `<video src="${mediaPath}" controls></video>`;
            
            article.innerHTML = `
            <a href="#" class="media-link">
                ${mediaElement}
                <div class="media-info">
                    <h2 class="media-title">${media.title}</h2>
                    <div class="likes-container">
                        <span class="likes-count">${media.likes}</span>
                        <i class="fas fa-heart" data-media-id="${media.id}"></i>
                    </div>
                </div>
                </a>
            `;
            
            // Ajout de l'événement pour la lightbox
            article.querySelector("img, video").addEventListener("click", () => {
                LightboxManager.open(media);
            });
            
            // Ajout de l'événement pour les likes
            const likeBtn = article.querySelector(".fa-heart");
            likeBtn.addEventListener("click", () => {
                LikesManager.toggle(media.id);
            });
            
            return article;
        }
    };
    
    // Gestionnaire d'affichage des médias
    const MediaDisplay = {
        displayAll(mediaList) {
            const mediaGrid = document.querySelector(".media-grid");
            mediaGrid.innerHTML = "";
            
            mediaList.forEach(media => {
                const mediaElement = MediaFactory.createMediaElement(media);
                mediaGrid.appendChild(mediaElement);
            });
            
            LikesManager.updateTotalLikes();
        }
    };
    
    // Gestionnaire des likes
    const LikesManager = {
        toggle(mediaId) {
            const media = mediaData.find(m => m.id === mediaId);
            if (media) {
                media.likes = media.isLiked ? media.likes - 1 : media.likes + 1;
                media.isLiked = !media.isLiked;
                
                // Mise à jour de l'affichage
                const likesElement = document.querySelector(`[data-media-id="${mediaId}"]`).previousElementSibling;
                likesElement.textContent = media.likes;
                
                this.updateTotalLikes();
            }
        },
        
        updateTotalLikes() {
            const totalLikes = mediaData.reduce((sum, media) => sum + media.likes, 0);
            document.querySelector(".total-likes .likes-count").textContent = totalLikes;
        }
    };
    
    // Gestionnaire de lightbox
    const LightboxManager = {
        currentMediaIndex: 0,
        
        init() {
            document.querySelector(".lightbox-close").addEventListener("click", () => {
                document.getElementById("lightbox").style.display = "none";
            });
            
            document.querySelector(".lightbox-prev").addEventListener("click", () => {
                this.currentMediaIndex = (this.currentMediaIndex - 1 + mediaData.length) % mediaData.length;
                this.updateContent();
            });
            
            document.querySelector(".lightbox-next").addEventListener("click", () => {
                this.currentMediaIndex = (this.currentMediaIndex + 1) % mediaData.length;
                this.updateContent();
            });
        },
        
        open(media) {
            const lightbox = document.getElementById("lightbox");
            
            this.currentMediaIndex = mediaData.findIndex(m => m.id === media.id);
            this.updateContent();
            lightbox.style.display = "block";
        },
        
        updateContent() {
            const media = mediaData[this.currentMediaIndex];
            const content = document.querySelector(".lightbox-content");
            
            const photographerFolder = getPhotographerFolder(currentPhotographer.name);
            const mediaPath = `assets/Sample Photos/${photographerFolder}/${media.image || media.video}`;
            
            const mediaElement = media.image
                ? `<img src="${mediaPath}" alt="${media.title}">`
                : `<video src="${mediaPath}" controls></video>`;
            
            // Ajout du titre du média sous l'image/vidéo
            content.innerHTML = `
                <div class="lightbox-media-container">
                    ${mediaElement}
                    <h2 class="lightbox-media-title">${media.title}</h2>
                </div>
            `;
        }
    };
    
    // Fonction pour initialiser le dropdown custom
    function initCustomDropdown() {
        const dropdown = document.getElementById('custom-sort');
        const selectedBtn = dropdown.querySelector('.dropdown-selected');
        const selectedText = dropdown.querySelector('.dropdown-selected-text');
        const list = dropdown.querySelector('.dropdown-list');
        const allOptions = Array.from(dropdown.querySelectorAll('.dropdown-option'));

        // Valeur par défaut
        let currentValue = 'popularity';

        // Fonction pour afficher uniquement les options non sélectionnées
        function updateDropdownOptions() {
            list.innerHTML = '';
            allOptions.forEach(option => {
                if (option.dataset.value !== currentValue) {
                    const li = option.cloneNode(true);
                    li.addEventListener('click', () => {
                        currentValue = li.dataset.value;
                        selectedText.textContent = li.textContent;
                        dropdown.classList.remove('open');
                        selectedBtn.setAttribute('aria-expanded', 'false');
                        updateDropdownOptions();
                        
                        // Tri direct
                        sortBy(currentValue);
                    });
                    list.appendChild(li);
                }
            });
        }

        // Ouvre/ferme le menu
        selectedBtn.addEventListener('click', () => {
            dropdown.classList.toggle('open');
            selectedBtn.setAttribute('aria-expanded', dropdown.classList.contains('open'));
        });

        // Ferme si clic en dehors
        document.addEventListener('click', (e) => {
            if (!dropdown.contains(e.target)) {
                dropdown.classList.remove('open');
                selectedBtn.setAttribute('aria-expanded', 'false');
            }
        });

        // Initialisation
        updateDropdownOptions();
    }
    
    // Initialisation de l'application
    async function init() {
        const { photographer, media } = await getPhotographerData();
        
        if (photographer) {
            PhotographerInfoDisplay.display(photographer);
            MediaDisplay.displayAll(media);
        }
        
        LightboxManager.init();
        initCustomDropdown();
    }
    
    // Fonction de tri
    function sortBy(sortBy) {
        mediaData.sort((a, b) => {
            switch (sortBy) {
                case "popularity":
                    return b.likes - a.likes;
                case "date":
                    return new Date(b.date) - new Date(a.date);
                case "title":
                    return a.title.localeCompare(b.title);
                default:
                    return 0;
            }
        });
        MediaDisplay.displayAll(mediaData);
    }
    
    // API publique
    return {
        init: init,
        sortBy: sortBy
    };
})();

// Démarrage de l'application
PhotographerApp.init();
