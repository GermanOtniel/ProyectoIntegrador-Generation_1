const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };

function addRecommendation(recommendation) {  
  const dateRecommendation = new Date(recommendation.createdAt).toLocaleDateString('es-MX', dateOptions);
  const newRecommendation = `
    <div class="publicacion">
        <div class="header mb-4">
            <a class="foto" href="#">
                <img src=${recommendation.userPicture} alt="">
            </a>
            <div class="datos">
                <a class="nombre" href="#">${recommendation.userName}</a>
                <small><i class="fas fa-map-marker-alt me-1"></i>${recommendation.location}</small>
                <a class="hora" href="#">${dateRecommendation}</a>
            </div>
        </div>
        <div class="body">
            <p>${recommendation.summary}</p>
            <img src=${recommendation.uploadedMedia} alt="">
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
    fetch('http://localhost:8080/recommendations',{
        method: "GET",
        headers: {
             'Content-Type' : 'application/json'
        }

    })
    .then((res) => res.json())
    .then((data) => {
        console.log (data);
        data.forEach((recommendation) =>{
            addRecommendation(recommendation);
        }) 
        // data.sort((a,b) => {
        //     return new Date(b.createdAt) - new Date(a.createdAt);
        // }).forEach(recommendation => {
        //     addRecommendation(recommendation);
        // });
    })
    .catch((err) => console.log(err))
}

function onSaveRecommendationClicked() {
    document.getElementById('save-recommendation').addEventListener('click', saveRecommendation);
}

function validateNewRecommendationForm(textSm, location, category) {
    const textContainer = document.querySelector('#recommendation-text+div');
    let noError = true;

    [textSm, location, category].forEach((input) => {
        if ( !validateMessage(input.value.trim()) ) {
            input.classList.add('is-invalid');
            noError = false;
        } else {
            input.classList.remove('is-invalid');
        }
    });

    if ( !validateMessage(tinymce.get('recommendation-text').getContent()) ) {
        textContainer.classList.add('is-invalid');
        noError = false;
    } else {
        textContainer.classList.remove('is-invalid');
    }

    return noError;
}

function saveRecommendation() {
    const msgOK = document.getElementById('toast-ok');
    const msgError = document.getElementById('toast-error');
    let msgToShow = null;


    const recommendationSm = document.getElementById('recommendation-sm');
    const locationRec = document.querySelector("#location input");
    const category = document.getElementById("category");
    /** validación de campos **/

    if (!validateNewRecommendationForm(recommendationSm, locationRec, category)) {
        return;
    }

    /** crear objeto con la recomendación **/
    const now = new Date();
    
    const media = [];
    document.querySelectorAll("#recommendation-media img").forEach((img)=>{
        media.push(img.src);
    })

    const recommendation = {
        "userPicture" : "images/integrate-project-diana.jpeg",
        "userName" : "Diana Manriquez",
        "location" : locationRec.value, 
        "createdAt" : now,
        "category": category.value,
        "recommendationSm": recommendationSm.value,
        "recommendationText" : tinymce.get("recommendation-text").getContent(),
        "uploadedMedia" : media,
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
    .then((res) => res.json())
    .then((data) =>  {msgToShow = msgOK
    console.log(msgToShow)})
    .catch((err) => {msgToShow = msgError
    console.log("error")})
    .finally(() => {
        const toast = new bootstrap.Toast(msgToShow);
        toast.show();
        // reset form
        document.getElementById("cancel-recommendation").click();
    });
}

window.addEventListener('load', () => {
    /* Transferir click, desde el anchor (botón visual) de añadir imagen, al input-file (cargar imagen) */
    document.querySelector('#btn-add-image').addEventListener('click', () => {
        document.querySelector('#my-image').click();
    })

    document.querySelector('#btn-add-video').addEventListener('click', () => {
        document.querySelector('#my-video').click();
    })

    document.getElementById("cancel-recommendation").addEventListener('click',()=>{
        document.querySelector("#newRecommendationModal form").reset();
        tinymce.get("recommendation-text").setContent("");
        document.getElementById("recommendation-media").innerHTML="";

    })

    /* Al hacer click en cualquier elemento de nuestro formulario, se ejecuta lo siguiente */
    document.querySelector('.publicar').addEventListener('click', (event) => {
        /* Transferir click al botón que mostrará el modal */
        let toggleModalButton = document.getElementById('newRecommendationButton'); // este es el botón
        toggleModalButton.click();

        /* Verificar si se realizó click en un campo en específico, para transferir dicha acción */
        switch (event.target.dataset.type) {
            case 'load-image':
                document.querySelector('#btn-add-image').click();
                break;
            case 'load-video':
                    document.querySelector('#btn-add-video').click();
                    break;
            case 'text':
                setTimeout(function (){
                    document.getElementById('recommendation-text').focus();
                }, 500);
                break;
            default:
                break;
        }

    })
    /* Event Listener para publicar recomendación */
    onSaveRecommendationClicked();

    /* Cargar recomendaciones */
    loadRecommendations();

    /*Texto enriquecido modal recomendaciones */
    richTxt();

    uploadedMedia();
    mediaSortable();
    
});


function uploadedMedia(){
    let mediaBtn = document.getElementById("my-image");
    let mediaContainer =document.getElementById("recommendation-media");

    mediaBtn.addEventListener("change", ()=>{
        let media=mediaBtn.files;

        if (FileReader && media && media.length) {    
            for (let i=0;i<media.length;i++){
                readMedia(mediaContainer,media[i]);
            }
            
        }
    })
}

function readMedia(mediaContainer,mediaFile){
    let mediaScanner = new FileReader();
    mediaScanner.onload = function () {
        let image = document.createElement("img");
        image.classList.add("media-thumbnail");
        image.src = mediaScanner.result;
        mediaContainer.appendChild(image);
    }
    mediaScanner.readAsDataURL(mediaFile);
}

function richTxt(){
    tinymce.init({
        selector: '#recommendation-text',
        menubar: false,
    plugins: [
      'advlist image lists charmap hr',
      'wordcount insertdatetime nonbreaking',
      'table emoticons paste help'
    ],
    toolbar: 'undo redo | bold italic underline strikethrough | fontselect fontsizeselect  forecolor backcolor | align | bullist numlist outdent indent | table | insertdatetime | emoticons charmap hr',
    });

    // Patch table not working
    document.addEventListener('focusin', (e) => {
        if (e.target.closest('.tox-tinymce, .tox-tinymce-aux, .moxman-window, .tam-assetmanager-root')) {
            e.stopImmediatePropagation();
        }
    })
}

function mediaSortable(){
    new Sortable(document.getElementById("recommendation-media"), {
        ghostClass: 'media-ghost'
    });
}
