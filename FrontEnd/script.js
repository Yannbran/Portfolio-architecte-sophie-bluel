


// Récupération de l'élément "gallery" dans le DOM
const gallery = document.getElementById('gallery');

// Fonction pour créer et ajouter un élément de photo à la galerie
function addPhotoToGallery(photoElement) {
    // Création d'un conteneur pour chaque photo
    const container = document.createElement('div');
    container.classList.add('icon-of-works', 'active');
    container.dataset.category = photoElement.categoryId;

    // Création de l'élément image
    const image = document.createElement('img');
    image.src = photoElement.imageUrl;

    // Création de l'élément titre
    const title = document.createElement('p');
    title.textContent = photoElement.title;

    // Ajout des éléments image et titre au conteneur
    container.appendChild(image);
    container.appendChild(title);

    // Ajout du conteneur à la galerie
    gallery.appendChild(container);
}

// Fonction asynchrone pour récupérer les données de l'API
const getWorks = async () => {
    try {
        const apiURL = 'http://localhost:5678/api/works';

        // Envoi de la requête avec fetch()
        const res = await fetch(apiURL);

        // Vérification du statut de la réponse
        if (!res.ok) {
            throw new Error(`Erreur lors de la récupération des données depuis ${apiURL}. Statut : ${res.status}`);
        }

        // Conversion de la réponse en JSON
        const data = await res.json();

        // Réinitialisation du contenu de la galerie
        gallery.innerHTML = "";

        // Parcours des données reçues de l'API
        data.forEach(addPhotoToGallery);
    } 
    catch (error) {
        // Gestion de l'erreur
        const errorMsg = document.getElementById('error-works');
        const messageErreur = "Une erreur s'est produite : " + error.message;
    
        // Vérification de l'existence de l'élément errorMsg et affichage du message
        if (errorMsg) {
            errorMsg.textContent = messageErreur;
        } else {
            console.error("L'élément 'error-works' n'a pas été trouvé dans le DOM. " + messageErreur);
        }
    }
};
// Appel de la fonction pour récupérer les données
getWorks();

// PARTIE FILTRES
// Récupération des boutons de filtres a partir du DOM
const boutonsFiltres = document.querySelectorAll('.filtres button');

// Gère l'affichage du bouton au click
// Ajout d'un écouteur d'événement à chaque bouton de filtre
boutonsFiltres.forEach(bouton => {
    bouton.addEventListener('click', function() {
        // Supprime  la classe "filtre-on" de tous les boutons
        boutonsFiltres.forEach(bouton => {
            bouton.classList.remove('filtre-on');    
        });
        // Ajoute la classe "filtre-on" uniquement au bouton cliqué
        this.classList.add('filtre-on');
    });
});

//Gère l'affichage des travaux filtrés par categorie
// Récupération des éléments de filtre avec la catégorie
const filters = document.querySelectorAll('.filtres div');

// Ajout d'un écouteur d'événement à chaque bouton filtre en identifiant l'ID
filters.forEach(filtre => {
    filtre.addEventListener('click', function(){
        // Récupère et enregistre la catégorie du filtre pendant l'itération
        const tag = this.getAttribute('data-category');

        // Récupération de tous les éléments de la galerie
        const figures = document.querySelectorAll('#gallery .icon-of-works');

        // Parcours de tous les éléments de la galerie
        figures.forEach(figure => {
            // Remplacement de la classe 'active' par 'inactive'
            figure.classList.replace('active', 'inactive');

            // Si la catégorie du filtre correspond à celle de l'élément, ou si le filtre est '0', remplacement de la classe 'inactive' par 'active'
            if(tag === figure.dataset.category || tag === '0'){
                figure.classList.replace('inactive', 'active');
            };
        });
    });
});

// PARTIE LOGIN
const form = document.querySelector('form');

// Soumission du formulaire //
form.addEventListener('submit', async function(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const data = {
            email: email,
            password: password
        };

        // Envoi des données à l'API //
    try {
        const resp = await fetch('http://localhost:5678/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!resp.ok) {
            throw new Error("Erreur lors de la requête API");
        }

        const respData = await resp.json ();
        console.log(respData);

        const token = respData.token;

        if (token) {
            localStorage.setItem("token", token);
            window.location.href = "index.html";
        }
        //Gestion erreur //
    } catch (error) {
        console.error(error);
        MsgErreur("Erreur d’identifiant ou de mot de passe");
    }
});

function MsgErreur(ErreurMessage) {
    const Erreur = document.getElementById("error");
    Erreur.textContent = ErreurMessage;
}
// Changements quand user connecté //
const token = localStorage.getItem('token');

// Masquer la div Filtre //
function MasquerFiltres() {
    if (token) {
        const divFiltres = document.querySelector('.filtres');
        const divBandeau = document.querySelector('.header-edition');
        const divModal = document.querySelector('#modal')

        if (divFiltres) {
            divFiltres.classList.add('inactive');
            }
        if (divBandeau) {
            divBandeau.classList.remove('inactive');
            }
        if (divModal) {
            divModal.classList.remove('inactive')
        }
        }
    }
MasquerFiltres();

// Changement sur le nav "Login / Logout" //
function LogOut () {

    if (token) {
    const Log = document.querySelector(".Log");

        if(Log) {
            Log.textContent = "Logout";

            Log.removeAttribute("href");

            Log.addEventListener("click", function () {
                localStorage.removeItem("token")
                location.reload();
                })
        }
    }
}
LogOut ();

// PARTIES MODALES
// Modale galerie photo
// Sélection des éléments nécessaires
const clickModal = document.querySelector('#modal');
const modalPop = document.querySelector('.modal-pop');
const overlay = document.querySelector('.overlay');
const closeModalPop = document.querySelector('.close-pop');
const addModalAjout = document.querySelector('.add-modal')

// Fonction pour activer/désactiver l'affichage des modales
function toggleModal(modal, isActive) {
    modal.classList.replace(isActive ? 'inactive' : 'active', isActive ? 'active' : 'inactive');
    overlay.classList.replace(isActive ? 'inactive' : 'active', isActive ? 'active' : 'inactive');
}

// Ajout d'un écouteur d'événements au bouton d'ouverture de la galerie
clickModal.addEventListener('click', function() {
    toggleModal(modalPop, true);
});

// Ajout d'un écouteur d'événements au bouton de fermeture de la galerie
closeModalPop.addEventListener('click', function() {
    toggleModal(modalPop, false);
    
});

// Fermeture de la modal lorsque l'overlay est cliqué
overlay.addEventListener("click", function(event) {
    // Si mon click est égal a overlay alors execute
    if (event.target === overlay) {
        toggleModal(modalPop, false);
        toggleModal(addModalAjout, false);
    }
});
// Affichage des travaux de la galerie modale
// Sélection de l'élément avec l'ID 'modal-gallery' et stockage dans la variable modalGallery
const modalGallery = document.querySelector('.modal-gallery-ajout');

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
        } 
    });
});
} catch (error) {
// En cas d'erreur lors de la récupération des données, affiche l'erreur dans la console
console.error('Erreur lors de récupération des données:', error);
// Affiche un message d'erreur à l'utilisateur
modalGallery.innerHTML = "<p>Une erreur s'est produite lors de la récupération des photos. Veuillez réessayer plus tard.</p>";
}
};
// Appel de la fonction pour mettre à jour l'affichage de la modale
getModalWorks();

// Confirme la suppression
// Sélectionne l'élément avec l'ID 'modal-confirmation' et stockage dans la variable modalConfirmation
const modalConfirmation = document.querySelector('#modal-delete');

// Fonction pour confirmer la suppression 
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
    });
    
 // Sélection de l'élément avec l'ID 'preview-del-img' et stockage dans la variable previewDelImg
 const previewDelImg = document.querySelector('#preview-del-img');

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
            return true;
        } else {
            throw new Error ('Erreur lors de la suppression');
        }
    } catch (error) {
        console.error('Erreur lors de la suppression :',error);
        modalGallery.innerHTML = "<p>Une erreur s'est produite lors de la supression des photos. Veuillez réessayer plus tard.</p>";
    }
};

// Ouverture et Fermeture Modale ajout photo étape3.3
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

// Ajout de travaux
// Sélection des éléments
const photoInput = document.querySelector('#photoInput');
const previewImg = document.querySelector('#previewImg');
const photoTitle = document.querySelector('#photoTitle');
const photoCategory = document.querySelector('#photoCategory');
const addPhotoButton = document.querySelector('.button-add-photo');
const addPhotoConfirm = document.querySelector('.add-photo-confirm');
const image = document.querySelector('.img');
const acceptedFiles = document.querySelector('.accepted-files-description');
const closePop = document.querySelector('.close-pop');

// Fonction pour vérifier les entrées
function checkInputs(){
    // Si le titre et la catégorie de la photo sont remplis et que l'image de prévisualisation est active
    if (photoTitle.value.trim() !== '' && photoCategory.value.trim() !== '' && previewImg.classList.contains('active')){
       // Ajoute l'attribut id et la valeur ok 
        addPhotoConfirm.setAttribute('id');
    }
    else {
        // Supprimme l'attribut et la valeur ok 
        addPhotoConfirm.removeAttribute('id');
    }
}
// Ajout des événements
// Lorsque le bouton d'ajout de photo est cliqué, déclenche un clic sur l'input de photo
addPhotoButton.addEventListener('click', function() {
    photoInput.click();
});
// Lorsqu'un fichier est sélectionné via l'input de photo
photoInput.addEventListener('change', function() {
    // Enregistre dans addWork le premier fichier selectionné
    const addWork = this.files[0];
    // Si un fichier a été sélectionné
    if(addWork) {
        // Créé un nouvel objet FileReader pour lire le contenu du fichier
        const newWork = new FileReader();
        // Lorsque le fichier est lu
        newWork.onload = function(event) {
            // Utilise le contenu du fichier comme source pour l'image de prévisualisation
            previewImg.src = event.target.result;
            previewImg.classList.replace('inactive', 'active');
        }
        // Lecture du fichier avec la méthode readAsDat...
        // Affiche le contenu de addwork
        newWork.readAsDataURL(addWork);
    }
    // Supression et affichage de ces éléments pour la prévisualisation
    closePop.classList.replace('inactive', 'active');
    image.classList.replace('active', 'inactive');
    acceptedFiles.classList.replace('active', 'inactive');
    addPhotoButton.classList.replace('active', 'inactive');
});
// Ajout d'écouteurs d'événements aux éléments du DOM pour vérifier les entrées
// Lorsque l'utilisateur tape dans l'input du titre de la photo, la fonction checkInputs est appelée
photoTitle.addEventListener('input', checkInputs);
// Lorsque l'utilisateur change la catégorie de la photo, la fonction checkInputs est appelée
photoCategory.addEventListener('change',checkInputs);
// Lorsque l'image de prévisualisation est chargée, la fonction checkInputs est appelée
previewImg.addEventListener('load',checkInputs);

// Ajout d'un écouteur d'événements au bouton de confirmation d'ajout de photo
addPhotoConfirm.addEventListener('click', async function(event) {
    // Prévention du comportement par défaut du formulaire (qui est de soumettre le formulaire)
    event.preventDefault();

    // Si le titre de la photo est vide, affichage d'une alerte à l'utilisateur
    if(photoTitle.value.trim() === '') {
        alert('Veuillez ajouter un titre à la photo svp');
        return;
    }
    // Si la catégorie de la photo n'est pas remplie, affichage d'une alerte à l'utilisateur
    if(photoCategory.value.trim() === '' || photoCategory.value.trim() === '0') {
        alert('Veuillez ajouter une catégorie à la photo svp');
        return;
    }
    // Création d'un nouvel objet FormData pour stocker les données du formulaire
    const formData = new FormData();
    // Ajoute une image, un titre et une catégorie à l'objet FormData
    formData.append('image', photoInput.files[0]);
    formData.append('title', photoTitle.value.trim());
    formData.append('category', photoCategory.value.trim());

    try {
        // Envoi des données à une API via une requête fetch
        const resp = await fetch('http://localhost:5678/api/works', {
            method: 'POST',
            body: formData,
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });
        // Si la réponse n'est pas ok, lance une erreur
        if (!resp.ok) {
            throw new Error('Erreur HTTP, statut' + resp.status);
        }
        // Conversion de la réponse en JSON
        const data = await resp.json();
        // Affichage des données dans la console
        console.log('Réponse API', data);

        // Mise à jour de l'affichage
        await getWorks();
        await getModalWorks();
    }
    catch(error) {
        console.error("Erreur lors de l'envoi", error);
        addModal.innerHTML = "<p>Une erreur s'est produite lors de l'envoi des photos. Veuillez réessayer plus tard.</p>";
    }

    // Réinitialisation des champs
    photoInput.value = '';
    previewImg.src = '';
    photoTitle.value = '';
    photoCategory.value = '';
});





