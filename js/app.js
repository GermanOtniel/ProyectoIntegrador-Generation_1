const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };

function getDateOfRecommendation(date) {
    const dateRecom = new Date(date).toLocaleDateString('es-MX', dateOptions);
    return dateRecom;
};

function addRecommendation(recommendation) {  

  const newRecommendation = `
    <div class="publicacion">
        <div class="header mb-4">
            <a class="foto" href="#">
                <img src=${
                    recommendation.user.profilePicture ||
                    'http://cdn.onlinewebfonts.com/svg/img_568657.png'
                }>
            </a>
            <div class="datos">
                <a class="nombre" href="#">${recommendation.user.name}</a>
                <small><i class="fas fa-map-marker-alt me-1"></i>${recommendation.location}</small>
                <a class="hora" href="#">${getDateOfRecommendation(recommendation.createdAt)}</a>
            </div>
        </div>
        <div class="body">
            <p>${recommendation.summary}</p>
            ${recommendation.uploadedMedia.length > 0
                ? `<img src=${recommendation.uploadedMedia[0].content}>`
                :""}
        </div>
        <div class="comentarios d-flex justify-content-between">
            <div class="me-gusta d-flex justify-content-start align-items-center">
                <i class="bi bi-heart-fill me-gusta"></i>
                <span>${recommendation.likes.length}</span>
            </div>
            <a href="#">${recommendation.comments.length} comentarios</a>
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
        <button onclick="getRecommendationData('${recommendation.id}')" class="btn btn-primary travelly-primary-action" type="button">Conoce más</button>
        </div>
    </div>
    `;
    const recommendationSection = document.querySelector(".publicaciones");
    recommendationSection.innerHTML += newRecommendation;
}

const getRecommendationData = (recommId) => {
    const modalButton = document.getElementById('knowMoreButton');
    fetch(`http://localhost:3000/recommendations?id=${recommId}`)
    .then((res) => res.json())
    .then((data) => {
        if (data && data.length > 0) {
            const recommendation = data[0];
            const bodyModal = document.getElementById('knowMoreBodyModal');
            bodyModal.innerHTML = `
            <div>
                <h4>${recommendation.location}</h4>
                <p>
                    ${recommendation.userName + ' (' + getDateOfRecommendation(recommendation.createdAt) + ')'}
                </p>
                <small>
                    ${recommendation.recommendationText}
                </small>
                <div id="carouselExampleIndicators" class="carousel slide" data-bs-ride="carousel">
                    <div class="carousel-indicators">
                        ${ recommendation.uploadedMedia.map((media, i) => (
                            `
                                <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="${i}" class="${i === 0 ? "active" : ""}" aria-current="true" aria-label="${'Archivo ' + (i + 1)}"></button>
                            `
                        )) }
                    </div>
                    <div class="carousel-inner">
                        ${ recommendation.uploadedMedia.map((media, i) => (
                            `
                                <div class="${i === 0 ? "carousel-item active" : "carousel-item"}">
                                    <img src=${media} class="d-block w-100" alt=${'Archivo #' + (i + 1)}>
                                </div>
                            `
                        )) }
                    </div>
                    
                    <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
                        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Previous</span>
                    </button>
                    <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
                        <span class="carousel-control-next-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Next</span>
                    </button>
                </div>
            </div>
            `;
            console.log(data);
        }
    })
    .catch((err) => console.log(err))
    .finally(() => {
        modalButton.click();
    });
};

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
             'Content-Type' : 'application/json',
             'Authorization': currentSession().authToken
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

function currentSession() {
    return JSON.parse(localStorage.getItem('userSession'));
}

function loadCurrentUserData() {
    const user = currentSession();
    const avatarList = document.getElementsByClassName('user-avatar');
    const usernameList = document.getElementsByClassName('currentUserName');
    const inputPlaceholder = document.getElementById('recomm-input');

    [...avatarList].forEach(avatar => (
        avatar.src = user.profilePicture || 
        'http://cdn.onlinewebfonts.com/svg/img_568657.png'
    ));
    [...usernameList].forEach(uname => (uname.innerHTML = user.name));
    inputPlaceholder.placeholder = inputPlaceholder.placeholder.replace('USER_NAME', user.name.split(" ")[0])
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
    const user = currentSession();
    
    const media = [];
    document.querySelectorAll("#recommendation-media img").forEach((img)=>{
        media.push({
            userId: user.userId,
            content: img.src,
            mediaType: "photo"
        });
    })

    const recommendation = {
        user : {
            userId: user.userId
        },
        location : locationRec.value, 
        category: {
            categoryId: category.value
        },
        summary: recommendationSm.value,
        text : tinymce.get("recommendation-text").getContent(),
        uploadedMedia : media,
    }

    /* Publicar recomendación, mediante petición POST */
    fetch('http://localhost:8080/recommendations', {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json',
            'Authorization': currentSession().authToken
        },
        body: JSON.stringify(recommendation)
    })
    .then((res) => res.json())
    .then((data) =>  msgToShow = msgOK)
    .catch((err) => {
        msgToShow = msgError
        console.log(err)
    })
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
    loadCurrentUserData();
    loadCategories();
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

function loadCategories() {
    const selectCategory = document.getElementById('category');
    fetch('http://localhost:8080/categories', {
        headers: {
            'Content-Type' : 'application/json',
            'Authorization': currentSession().authToken
        },
    })
    .then((res) => res.json())
    .then((categories) => {
        categories.forEach((category) => {
            selectCategory.innerHTML += `<option value=${category.categoryId}>${category.name}</option>`;
        });
    })
    .catch((err) => console.log(err))
}
