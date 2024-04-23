

// Intégration dees travaux avec fetch //

const gallery = document.getElementById("gallery")

/// fonction - Appel API avec fetch et intégration HTML ///

// Appel API works avec fetch

const getWorks = async () => {
    const res = await fetch("http://localhost:5678/api/works");
    const data = await res.json();
    gallery.innerHTML = "";

// Fonction - Ajout HTML selon data dans page accueil

    data.forEach(photo => {
        let conteneur = document.createElement("div");
        conteneur.classList.add("photo-conteneur");
        conteneur.classList.add("active");
        conteneur.dataset.category = photo.categoryId;

        let image = document.createElement("img");
        image.src = photo.imageUrl;

        let titre = document.createElement("p");
        titre.textContent = photo.title;

        conteneur.appendChild(image);
        conteneur.appendChild(titre);
        gallery.appendChild(conteneur);
    });
};

getWorks()