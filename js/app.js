function addRecommendation(recommendation) {
  const newRecommendation = `
    <div class="publicacion">
        <div class="header mb-4">
            <a class="foto" href="#">
                <img src=${recommendation.userPicture} alt="">
            </a>
            <div class="datos">
                <a class="nombre" href="#">${recommendation.userName}</a>
                <small><i class="fas fa-map-marker-alt me-1"></i>${recommendation.userLocation}</small>
                <a class="hora" href="#">${recommendation.createdAt}</a>
            </div>
        </div>
        <div class="body">
            <p>${recommendation.recommendationText}</p>
            <img src=${recommendation.uploadedPicture} alt="">
        </div>
        <div class="comentarios d-flex justify-content-between">
            <div class="me-gusta d-flex justify-content-start align-items-center">
                <i class="bi bi-heart-fill me-gusta"></i>
                <span>${recommendation.numOfLikes}</span>
            </div>
            <a href="#">${recommendation.numOfComments} comentarios</a>
        </div>
        <div class="botones  d-flex">
            <button class="me-gusta">
                <i class="bi bi-hand-thumbs-up me-2"></i>
                Me gusta
            </button>
            <button class="comentar">
                <i class="bi bi-chat-left me-2"></i>
                Comentar
            </button>
            <button class="comentar">
                <i class="bi bi-share me-2"></i>
                Compartir
            </button>
        </div>
        <div class="d-grid gap-2 mt-1">
        <button class="btn btn-primary travelly-primary-action" type="button">Conoce más</button>
        </div>
    </div>
    `;
    const recommendationSection = document.querySelector(".publicaciones");
    recommendationSection.innerHTML += newRecommendation;
}

/**
 * -- Instalar globalmente JSON SERVER --
 * npm install -g json-server
 * -- Iniciar JSON SERVER, con nuestro archivo .json
 * json-server --watch db/recommendations.json
 */
function loadRecommendations() {
    fetch('http://localhost:3000/recommendations')
    .then((res) => res.json())
    .then((data) => {
        data.forEach(recommendation => {
            addRecommendation(recommendation);
        });
    })
    .catch((err) => console.log(err))
}

function onSaveRecommendationClicked() {
    document.getElementById('save-recommendation').addEventListener('click', saveRecommendation);
}

function saveRecommendation() {
    const recommendationText = document.getElementById('recommendation-text');
    /** validación de campos **/

    /** crear objeto con la recomendación **/
    const now = new Date();
    const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };

    const recommendation = {
        "userPicture" : "images/integrate-project-diana.jpeg",
        "userName" : "Diana Manriquez",
        "userLocation" : "Xochimilco, Ciudad de México", 
        "createdAt" : now.toLocaleDateString('es-MX', dateOptions),
        "recommendationText" : recommendationText.value,
        "uploadedPicture" : "https://www.gustoxmexico.com/images/mexico2020xochimilco.jpg",
        "numOfLikes" : "0",
        "numOfComments" : "0"
    }

    /* Publicar recomendación, mediante petición POST */
    fetch('http://localhost:3000/recommendations', {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify(recommendation)
    })
    .then((res) => res.json)
    .then((data) => console.log(data))
    .catch((err) => console.log(err));
}

window.addEventListener('load', () => {
    /* Transferir click, desde el anchor (botón visual) de añadir imagen, al input-file (cargar imagen) */
    document.querySelector('#btn-add-image').addEventListener('click', () => {
        document.querySelector('#my-image').click();
    })

    /* Al hacer click en cualquier elemento de nuestro formulario, se ejecuta lo siguiente */
    document.querySelector('.publicar').addEventListener('click', (event) => {
        /* Transferir click al botón que mostrará el modal */
        let toggleModalButton = document.getElementById('newRecommendationButton'); // este es el botón
        toggleModalButton.click();

        /* Verificar si se realizó click en un campo en específico, para transferir dicha acción */
        if (event.target.dataset.type == 'load-image') {
            console.log('Imagen');
            document.querySelector('#btn-add-image').click();
        }
    })
    /* Event Listener para publicar recomendación */
    onSaveRecommendationClicked();

    /* Cargar recomendaciones */
    loadRecommendations();
});

