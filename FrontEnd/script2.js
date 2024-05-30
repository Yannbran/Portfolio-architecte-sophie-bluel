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

