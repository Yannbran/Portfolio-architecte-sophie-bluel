
// Récupération des éléments works dans l API

const gallery = document.getElementById("gallery");

// Envoi de le requete avec fetch(), fonction asynchrone (promesse)

const getWorks = async () => {
    try {
        const res = await fetch("http://localhost:5678/api/works");
        if (!res.ok) {
            throw new Error("Erreur lors de la récupération des données.");
        }
        const data = await res.json();
        gallery.innerHTML = "";

// Récupère les données API et les transforme en éléments HTML
        data.forEach(photo => {
            let container = document.createElement('div');
            container.classList.add('icon');
            container.classList.add('active');
            container.dataset.category = photo.categoryId;

            let image = document.createElement('img');
            image.src = photo.imageUrl;

            let titre = document.createElement('p');
            titre.textContent = photo.title;

// Affiche les éléments récupérés dans le HTML
            container.appendChild(image);
            container.appendChild(titre);
            gallery.appendChild(container);
        });

    } catch (error) {
        console.error("Une erreur s'est produite :", error.message);
        
    }
};

getWorks();


// Création des filtres dynamiques par catégorie 

let filtres = document.querySelectorAll('#filtres div');


for(let filtre of filtres){
    filtre.addEventListener('click', function(){
        let tag = this.getAttribute('data-category');

        let figures = document.querySelectorAll('#gallery .icon');

        for(let figure of figures){
            figure.classList.replace('active', 'inactive');

            if(tag === figure.dataset.category || tag ==='0'){
                figure.classList.replace('inactive', 'active');
            };
        };
    });
};

// Fonction bouton actif
const boutonsFiltres = document.querySelectorAll('#filtres button');

    boutonsFiltres.forEach(bouton => {
        bouton.addEventListener('click', function() {

// Supprime la classe "filtre-actif" de tous les boutons
            boutonsFiltres.forEach(b => {
                b.classList.remove('filtre-on');
                b.classList.add('filtre-off');
            });

// Ajoute la classe "filtre-actif" uniquement au bouton cliqué
            this.classList.remove('filtre-off');
            this.classList.add('filtre-on');
        });
    });