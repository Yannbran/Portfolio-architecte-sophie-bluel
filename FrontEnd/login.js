
// Authentification de l’utilisateur //


const form = document.querySelector('form');

// Click du bouton //
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
            throw new Error('Erreur lors de la requête API');
        }

        const respData = await resp.json ();
        console.log(respData);

        const token = respData.token;

        if (token) {
            localStorage.setItem('token', token);
            window.location.href = 'index.html';
        }
    }

// Gestion erreur //

    catch (error) {
        console.error(error);
        MsgErreur("Mot de passe ou identifiant érroné");
    }
});

function MsgErreur(ErreurMessage) {
    const Erreur = document.getElementById('error');
    Erreur.textContent = ErreurMessage;
}