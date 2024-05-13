// Récupération de l'élément "gallery" dans le DOM
const gallery = document.getElementById("gallery");

// Récupération du token de l'utilisateur dans le localStorage
const token = localStorage.getItem('token');

// Fonction asynchrone pour récupérer les données de l'API
const getWorks = async () => {
    try {
        // Envoi de la requête avec fetch()
        const res = await fetch("http://localhost:5678/api/works");

        // Vérification du statut de la réponse
        if (!res.ok) {
            throw new Error("Erreur lors de la récupération des données.");
        }

        // Conversion de la réponse en JSON
        const data = await res.json();

        // Réinitialisation du contenu de la galerie
        gallery.innerHTML = "";

        // Parcours des données reçues de l'API
        data.forEach(photoElement => {
            // Création d'un conteneur pour chaque photo
            let container = document.createElement('div');
            container.classList.add('icon-of-works', 'active');
            container.dataset.category = photoElement.categoryId;

            // Création de l'élément image
            let image = document.createElement('img');
            image.src = photoElement.imageUrl;

            // Création de l'élément titre
            let title = document.createElement('p');
            title.textContent = photoElement.title;

            // Ajout des éléments image et titre au conteneur
            container.appendChild(image);
            container.appendChild(title);

            // Ajout du conteneur à la galerie
            gallery.appendChild(container);
        });

    } 
    catch (error) {
        // Gestion de l'erreur
        const errorMsg = document.getElementById('error-works');
        const messageErreur = "Une erreur s'est produite : " + error.message;
    
        // Vérification de l'existence de l'élément errorMsg et affichage du message
        if (errorMsg) {
            //Return
            errorMsg.textContent = messageErreur;
        } else {
            // Si l'élément n'existe pas, on envoie le message d'erreur dans la console, utile en cas de débogage
            console.error("L'élément 'error-works' n'a pas été trouvé dans le DOM. " + messageErreur);
        }
    }
};

// Appel de la fonction pour récupérer les données
getWorks();

// PARTIE FILTRES
// Récupération des éléments de filtre avec la catégorie
let filters = document.querySelectorAll('#filtres div');

// Ajout d'un écouteur d'événement à chaque filtre en identifiant l'ID
for(let filtre of filters){
    filtre.addEventListener('click', function(){
        // Récupération de la catégorie du filtre
        let tag = this.getAttribute('data-category');

        // Récupération de tous les éléments de la galerie
        let figures = document.querySelectorAll('#gallery .icon-of-works');

        // Parcours de tous les éléments de la galerie
        for(let figure of figures){
            // Remplacement de la classe 'active' par 'inactive'
            figure.classList.replace('active', 'inactive');

            // Si la catégorie du filtre correspond à celle de l'élément, ou si le filtre est '0', remplacement de la classe 'inactive' par 'active'
            if(tag === figure.dataset.category || tag ==='0'){
                figure.classList.replace('inactive', 'active');
            };
        };
    });
};

// Récupération des boutons de filtres
const boutonsFiltres = document.querySelectorAll('#filtres button');

// Ajout d'un écouteur d'événement à chaque bouton de filtre
boutonsFiltres.forEach(bouton => {
    bouton.addEventListener('click', function() {
        // Suppression de la classe "filtre-on" de tous les boutons
        boutonsFiltres.forEach(bouton => {
            bouton.classList.remove('filtre-on');
            bouton.classList.add('filtre-off');
        });

        // Ajout de la classe "filtre-on" uniquement au bouton cliqué
        this.classList.remove('filtre-off');
        this.classList.add('filtre-on');
    });
});



// Fonction pour masquer les filtres quand l'utilisateur est connecté
function MasquerFiltres() {
    // Vérifie si un token existe
    if (token) {
        // Récupération des éléments dans le DOM
        const divFiltres = document.querySelector('#filtres');
        const divHeader = document.querySelector('.header-edition');
        const divModal = document.querySelector('#modal')

        // Si l'élément 'filtres' existe, ajoute la classe 'inactive'
        if (divFiltres) {
            divFiltres.classList.add('inactive');
        }
        // Si l'élément 'bandeau-edition' existe, supprime la classe 'inactive'
        if (divHeader) {
            divHeader.classList.remove('inactive');
        }
        // Si l'élément 'modal' existe, supprime la classe 'inactive'
        if (divModal) {
            divModal.classList.remove('inactive')
        }
    }
}
// Appel de la fonction pour masquer les filtres
MasquerFiltres();


// PARTIE LOGIN
// Fonction pour gérer la déconnexion de l'utilisateur
function LogOut () {
    // Vérifie si un token existe
    if (token) {
        // Récupération de l'élément 'Log' dans le DOM
        const Log = document.querySelector(".Log");

        // Si l'élément 'Log' existe, change le texte en 'logout'
        if(Log) {
            Log.textContent = "Logout";

            // Supprime l'attribut 'href'
            Log.removeAttribute("href");

            // Ajoute un écouteur d'événement pour gérer le clic sur le bouton 'logout'
            Log.addEventListener("click", function () {
                // Supprime le token du localStorage
                localStorage.removeItem("token")
                // Recharge la page
                location.reload();
            })
        }
    }
}

// Appel de la fonction pour gérer la déconnexion
LogOut ();



// PARTIES MODALES

// Sélection de l'élément avec l'ID 'modal-gallery' et stockage dans la variable modalGallery
const modalGallery = document.querySelector('#modal-gallery');

// Sélection de l'élément avec l'ID 'modal-confirmation' et stockage dans la variable modalConfirmation
const modalConfirmation = document.querySelector('#modal-confirmation');

// Sélection de l'élément avec l'ID 'preview-del-img' et stockage dans la variable previewDelImg
const previewDelImg = document.querySelector('#preview-del-img');


// Déclaration d'une fonction asynchrone nommée getModalWorks
const getModalWorks = async () => {
    try {
        // Envoi d'une requête GET à l'API pour récupérer les données
        const res = await fetch("http://localhost:5678/api/works");

        // Variable pour enregistrée la réponse en JSON
        const data = await res.json();

       
        // Réinitialisation du contenu de la galerie
        modalGallery.innerHTML = "";

        // Parcours de chaque élément dans les données récupérées
        data.forEach(photoData => {
            // Ajout de chaque photo à la galerie avec un bouton de suppression
            modalGallery.innerHTML += `
                <figure class="active" data-${photoData.categoryId} >
                    <img src=${photoData.imageUrl} alt=${photoData.title}>
                    <span class="photo-delete" data-id="${photoData.id}"><i class="fa-solid fa-trash-can"></i></span>
                </figure>`;

        });

        // Ajout d'un écouteur d'événements à chaque bouton de suppression
        document.querySelectorAll('.photo-delete').forEach(span => {
            span.addEventListener('click', function () {
                // Récupération de l'ID de la photo à supprimer
                const id = this.getAttribute('data-id');

                // Recherche de la photo correspondante dans les données
                const photoData = data.find(photo => photo.id.toString() === id);

                // Si la photo est trouvée, ouverture de la fenêtre modale de confirmation
                if (photoData) {
                    openConfirmationModal(id, photoData);
                } else {
                    // Si la photo n'est pas trouvée, affichage d'une erreur dans la console
                    console.error('Image non trouvée.');
                }
            });
        });
    } catch (error) {
        // En cas d'erreur lors de la récupération des données, affichage de l'erreur dans la console
        console.error('Erreur lors de récupération des données:', error);
    }
};


// Modale galerie photo

// Sélection des éléments nécessaires
const clickModal = document.querySelector('#modal')
const modalPop = document.querySelector('.modal-pop')
const overlay = document.querySelector('.overlay')

// Ajout d'un écouteur d'événements au bouton d'ouverture de la galerie
clickModal.addEventListener('click', function() {
    // Activation de la fenêtre modale et de l'overlay
    modalPop.classList.replace('inactive', 'active');
    overlay.classList.replace('inactive', 'active');
})

// Sélection du bouton de fermeture de la galerie
const closeModalPop = document.querySelector('.close-pop');

// Ajout d'un écouteur d'événements au bouton de fermeture de la galerie
closeModalPop.addEventListener('click', function() {
    // Désactivation de la fenêtre modale et de l'overlay
    modalPop.classList.replace('active', 'inactive')
    overlay.classList.replace('active', 'inactive')
})

// Ouverture et Fermeture Modale ajout photo 

// Sélection des éléments nécessaires
const ajoutPhotoModal = document.querySelector('.modal-add-photo')
const addModal = document.querySelector('.add-modal')
const arrow = document.querySelector('.arrow')

// Ajout d'un écouteur d'événements au bouton d'ajout de photo
ajoutPhotoModal.addEventListener("click", function() {
    // Activation de la fenêtre modale d'ajout de photo et désactivation de la fenêtre modale de la galerie
    addModal.classList.replace("inactive", "active");
    modalPop.classList.replace("active", "inactive");
})

// Ajout d'un écouteur d'événements à la flèche de retour
arrow.addEventListener("click", function() {
    // Désactivation de la fenêtre modale d'ajout de photo et activation de la fenêtre modale de la galerie
    addModal.classList.replace("active", "inactive");
    modalPop.classList.replace("inactive", "active")
})

// Sélection du bouton de fermeture de la fenêtre modale d'ajout de photo
const fermetureModalAjout = document.querySelector(".xmark");

// Ajout d'un écouteur d'événements au bouton de fermeture de la fenêtre modale d'ajout de photo
fermetureModalAjout.addEventListener("click", function() {
    // Désactivation de la fenêtre modale d'ajout de photo et de l'overlay
    addModal.classList.replace("active", "inactive")
    overlay.classList.replace("active", "inactive")
})


// Fermeture de la modal gestion lorsque l'overlay est cliqué
overlay.addEventListener("click", function(event) {
    if (event.target === overlay) {
        modalPop.classList.replace("active", "inactive");
        overlay.classList.replace("active", "inactive");
    }
});

// Fermeture de la modal ajout lorsque l'overlay est cliqué
overlay.addEventListener("click", function(event) {
    if (event.target === overlay) {
        addModal.classList.replace("active", "inactive");
        overlay.classList.replace("active", "inactive");
    }
});


// Fonction pour ouvrir la fenêtre modale pour confirmer la suppression 
const openConfirmationModal = (id, photoData) => {
    // Sélection des boutons de confirmation et d'annulation
    const confirmButton = modalConfirmation.querySelector(".confirm");
    const cancelButton = modalConfirmation.querySelector(".cancel");

    // Attribution de l'ID de l'œuvre au bouton de confirmation
    confirmButton.setAttribute('data-id', id);

    // Affichage de la fenêtre modale
    modalConfirmation.style.display = 'block';

    // Ajout d'un écouteur d'événements au bouton de confirmation
    confirmButton.addEventListener('click', function () {
        // Récupération de l'ID de l'œuvre
        const id = this.getAttribute('data-id');

        // Appel de la fonction de confirmation de suppression
        confirmDelete(id);

        // Mise à jour de l'affichage (ces fonctions ne sont pas définies dans le code fourni)
        getModalWorks();
        getWorks();
    });

    // Ajout d'un écouteur d'événements au bouton d'annulation
    cancelButton.addEventListener('click', function () {
        // Effacement de l'aperçu de l'image à supprimer
        previewDelImg.innerHTML = '';

        // Fermeture de la fenêtre modale
        modalConfirmation.style.display = 'none';
    });

    // Affichage des détails de l'œuvre dans la fenêtre modale
    previewDelImg.innerHTML += `
        <img src=${photoData.imageUrl} alt=${photoData.title}>
        <p class="title">Titre:</p>
        <p class="contenu-title">${photoData.title}</p> 
        <p class="category">Catégorie:</p>
        <p class="contenu-category">${photoData.category.name}</p>`;
};

// Fonction pour confirmer la suppression de l'œuvre
const confirmDelete = (id) => {
    // Fermeture de la fenêtre modale
    modalConfirmation.style.display = 'none';

    // Appel de la fonction de suppression de l'œuvre
    deleteWork(id);
};

// Fonction asynchrone pour supprimer l'œuvre
const deleteWork = async (id) => {
    try {
        // Envoi d'une requête HTTP DELETE au serveur pour supprimer l'œuvre
        const res = await fetch(`http://localhost:5678/api/works/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        // Vérification du statut de la réponse
        if (res.ok) {
            console.log('Photo supprimée');
        } else {
            throw new Error ('Erreur lors de la suppression');
        }
    } catch (error) {
        console.error(error);
    }
};

getModalWorks()


// Ajout de travaux 
const photoInput = document.querySelector('#photoInput');
const previewImg = document.querySelector('#previewImg');
const photoTitle = document.querySelector('#photoTitle');
const photoCategory = document.querySelector('#photoCategory');
const addPhotoButton = document.querySelector('.button-add-photo');
const addPhotoConfirm = document.querySelector('.add-photo-confirm');
const image = document.querySelector('.img');
const acceptedFiles = document.querySelector('.accepted-files-description');
const closePop = document.querySelector('.close-pop');

addPhotoButton.addEventListener('click', function() {
    photoInput.click();
});


