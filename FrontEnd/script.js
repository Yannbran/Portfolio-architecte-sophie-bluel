

// Intégration des travaux avec fetch //

const gallery = document.getElementById("gallery")

/// Appel de l'API avec fetch et intégration HTML ///

// Appel de l'API avec fetch //

const getWorks = async () => {
    const res = await fetch("http://localhost:5678/api/works");
    const data = await res.json();
    gallery.innerHTML = "";

//  Ajout du HTML suivant les data dans la page d'accueil //

    data.forEach(photo => {
        let conteneur = document.createElement('div');
        conteneur.classList.add('photo-conteneur');
        conteneur.classList.add('active');
        conteneur.dataset.category = photo.categoryId;

        let image = document.createElement('img');
        image.src = photo.imageUrl;

        let titre = document.createElement('p');
        titre.textContent = photo.title;

        conteneur.appendChild(image);
        conteneur.appendChild(titre);
        gallery.appendChild(conteneur);
    });
};

getWorks()


// Création des filtres dynamiques par catégorie //

let filtres = document.querySelectorAll('#filtres div');


for(let filtre of filtres){
    filtre.addEventListener('click', function(){
        let tag = this.getAttribute('data-category');

        let figures = document.querySelectorAll('#gallery .photo-conteneur');

        for(let figure of figures){
            figure.classList.replace('active', 'inactive');

            if(tag === figure.dataset.category || tag ==='0'){
                figure.classList.replace('inactive', 'active');
            };
        };
    });
};

// fonction bouton actif
const boutonsFiltres = document.querySelectorAll('#filtres button');

    boutonsFiltres.forEach(bouton => {
        bouton.addEventListener('click', function() {
            // Supprimer la classe "filtre-actif" de tous les boutons
            boutonsFiltres.forEach(b => {
                b.classList.remove('filtre-on');
                b.classList.add('filtre-off');
            });

            // Ajouter la classe "filtre-actif" uniquement au bouton cliqué
            this.classList.remove('filtre-off');
            this.classList.add('filtre-on');
        });
    });