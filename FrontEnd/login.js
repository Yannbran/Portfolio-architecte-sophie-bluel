// Récupération du formulaire dans le DOM
const form = document.querySelector('form');

// Ajout d'un écouteur d'événement sur le formulaire pour gérer la soumission
form.addEventListener('submit', async function(event) {
    // Prévention du comportement par défaut de la soumission du formulaire
    event.preventDefault();

    // Récupération des valeurs des champs email et mot de passe
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Création de l'objet data contenant les informations de l'utilisateur
    const data = {
            email: email,
            password: password,
        };

    // Tentative d'envoi des données à l'API
    try {
        // Envoi de la requête POST à l'API avec les données de l'utilisateur
        const resp = await fetch('http://localhost:5678/api/users/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        });

        // Si la réponse n'est pas OK (statut 200), lance une erreur
        if (!resp.ok) {
            throw new Error('Erreur lors de la requête API');
        }

        // Conversion de la réponse en JSON
        const respData = await resp.json ();
        console.log(respData);

        // Récupération du token dans la réponse
        const token = respData.token;

        // Si un token est présent dans la réponse, le stocke dans le localStorage et redirige vers la page d'accueil
        if (token) {
            localStorage.setItem('token', token);
            window.location.href = 'index.html';
        }
    }

    // Gestion des erreurs
    catch (error) {
        // Affichage de l'erreur dans la console
        console.error(error);
        // Appel de la fonction MsgErreur avec un message d'erreur
        MsgErreur('Utilisateur non trouvé');
    }
});

// Fonction pour afficher un message d'erreur dans le DOM
function MsgErreur(ErreurMessage) {
    // Récupération de l'élément pour afficher l'erreur
    const Erreur = document.getElementById('error');
    // Affichage du message d'erreur
    Erreur.textContent = ErreurMessage;
}