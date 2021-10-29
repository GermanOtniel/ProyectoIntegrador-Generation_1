/**
 * Opciones para dar formato a una fecha, utilizando los campos año, mes y día
 */
const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };

/**
 * Devuelve una fecha con el formato '{dia} de {mes} de {año}'
 * Ej: 10 de Octubre de 2021
 * @param {Date} date
 * @returns String
 */
function getDateOfRecommendation(date) {
    const dateRecom = new Date(date).toLocaleDateString('es-MX', dateOptions);
    return dateRecom;
};

/**
 * Verifica si el usuario con la sesión actualmente activa le ha dado o no like a una recomendación
 * @param {Array} likesList - Lista con usuarios que le han dado like a la recomendación
 * @returns Boolean
 */
function checkLikes(likesList){
    const currentUserId = currentSession().userId;
    for(let likes of likesList){
        if (likes.userId == currentUserId){
            return true;
        }
    }
    return false;
}

/**
 * Realiza una petición POST al backend para añadir un registro de like, con el usuario actual y la recomendación en cuestión
 * @param {Integer} recommId
 */
function hitLike(recommId) {
    const currentUserId = currentSession().userId;

    fetch(`http://localhost:8080/likes`, {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json',
            'Authorization': currentSession().authToken
        },
        body: JSON.stringify({
            userId: currentUserId,
            recommendationId: recommId
        })
    })
    .then((res) => res.json())
    .then((data) => {
        const likeIndicator = document.getElementById(`recomm-${recommId}`);
        const likeButton = document.getElementById(`btn-like-${recommId}`);
        const likesNumberSpan = document.getElementById(`likes-number-${recommId}`);
        /* actualizar indicador de like a un corazón relleno */
        likeIndicator.classList.remove('bi-heart');
        likeIndicator.classList.add('bi-heart-fill');
        likesNumberSpan.innerText ++;
        /* cambiar el evento de click del botón de like */
        likeButton.onclick = hitUnLikeClosure(recommId);
    })
    .catch((err) => console.log(err))
}

/**
 * Realiza una petición DELETE al backend para eliminar un registro de like
 * @param {Integer} recommId
 */
function hitUnlike(recommId) {
    const currentUserId = currentSession().userId;

    fetch(`http://localhost:8080/likes/user/${currentUserId}/recommendation/${recommId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type' : 'application/json',
            'Authorization': currentSession().authToken
        },
        body: JSON.stringify({
            userId: currentUserId,
            recommendationId: recommId
        })
    })
    .then((res) => res.json())
    .then((data) => {
        const likeIndicator = document.getElementById(`recomm-${recommId}`);
        const likeButton = document.getElementById(`btn-like-${recommId}`);
        const likesNumberSpan = document.getElementById(`likes-number-${recommId}`);
        /* actualizar indicador de like a un corazón vacío */
        likeIndicator.classList.remove('bi-heart-fill');
        likeIndicator.classList.add('bi-heart');
        likesNumberSpan.innerText --;
        /* cambiar el evento de dislike a like */
        likeButton.onclick = hitLikeClosure(recommId);
    })
    .catch((err) => console.log(err))
}

/**
 * Closure. Nos permite añadir una función que recibe un parámetro en un eventlistener
 * @param {Integer} recommId
 * @returns function
 */
function hitUnLikeClosure(recommId) {
  return function() {
    hitUnlike(recommId);
  }
}

/**
 * Closure. Nos permite añadir una función que recibe un parámetro en un eventlistener
 * @param {Integer} recommId
 * @returns function
 */
function hitLikeClosure(recommId) {
  return function() {
    hitLike(recommId);
  }
}

/**
 * Añade una recomendación a nuestro feed, en la página principal.
 * @param {Object} recommendation - Contiene los datos de nuestra recomendación
 */
function addRecommendation(recommendation) {
    /* Verificar si el usuario le ha dado like a esta recomendación */
    const userLikedThis = checkLikes(recommendation.likes);
    /* Crear una cadena en html con los datos de nuestra recomendación */
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
                <i class="bi ${userLikedThis ? "bi-heart-fill": "bi-heart"} me-gusta" id="recomm-${recommendation.recommID}"></i>
                <span id="likes-number-${recommendation.recommID}">${recommendation.likes.length}</span>
            </div>
            <a onclick="getComments('${recommendation.recommID}')">${recommendation.comments.length} comentarios</a>
        </div>
        <div class="botones  d-flex">
            <button class="me-gusta" onclick="${ userLikedThis ? "hitUnlike" : "hitLike" }('${recommendation.recommID}')" id="btn-like-${recommendation.recommID}">
                <i class="bi bi-hand-thumbs-up me-2"></i>
                Me gusta
            </button>
            <button onclick="getComments('${recommendation.recommID}')"class="comentar">
                <i class="bi bi-chat-left me-2"></i>
                Comentar
            </button>
            <button class="compartir">
                <i class="bi bi-share me-2"></i>
                Compartir
            </button>
        </div>
        <div class="d-grid gap-2 mt-1">
        <button onclick="getRecommendationData('${recommendation.recommID}')" class="btn btn-primary travelly-primary-action" type="button">Conoce más</button>
        </div>
    </div>
    `;

    /* Seleccionar el contenedor principal, dónde vamos a añadir las recomendaciones */
    const recommendationSection = document.querySelector(".publicaciones");

    /* Añadir nuestra recomendación al contenedor anterior*/
    recommendationSection.innerHTML += newRecommendation;
}

/**
 * Obtiene y muestra los comentarios efectuados en una recomendación dada.
 * @param {Integer} recommId
 * @param {Boolean} openModal - desplegar o no el modal, al ejecutar esta función.
 */
const getComments=(recommId, openModal=true) =>{
    const commentsModal= document.getElementById('commentsButton');
    fetch(`http://localhost:8080/recommendations/${recommId}/comments`,{
        method: 'GET',
        headers: {
            'Content-Type' : 'application/json',
            'Authorization': currentSession().authToken
        },
    })
    .then((res) => res.json())
    .then((comments) => {
        const modalComments= document.querySelector('#comments-modal .modal-body');
        modalComments.innerHTML=`
        <div class="container">
            <div class="row d-flex justify-content-center">
            <div class="col">
            ${ comments.map((comment, i) => (
                `<div class="p-3 comment-card" >
                    <div class="d-flex justify-content-between align-items-center">
                        <div class="user d-flex flex-row align-items-center"> 
                        <img src=${comment.user.profilePicture} width="30" class="user-img rounded-circle mr-2" style="margin-right:10px;"> <span><small class="font-weight-bold text-primary ml-2">${comment.user.name}</small>
                        </div>
                    </div>
                    <small>${getDateOfRecommendation(comment.createdAt)}</small>
                    <div class="action d-flex justify-content-between mt-2 align-items-center">
                        <small class="font-weight-bold">${comment.comment}</small></span> 
                        
                    </div>
                </div>`
            )).join('')}
            </div>
            </div>
        </div>`

    })
    .catch((err) => console.log(err))
    .finally(() => {
        if (openModal){
            commentsModal.click();
        }
        document.getElementById('send-comment').onclick=addCommentsClosure(recommId);
    });

}

/**
 * Closure. Nos permite utilizar una función con parámetros, en un event listener.
 * @param {Integer} recommId 
 * @returns function
 */
function addCommentsClosure(recommId) {
    return function() {
        addComments(recommId);
    }
}

/**
 * Añadir un nuevo comentario a una recomendación.
 * @param {Integer} recommId 
 */
function addComments(recommId){
    const commentsModal= document.getElementById('new-comment');
    /* Si no es un comentario vacío, realiza una petición POST para la creación del comentario en la recomendación */
    if (commentsModal.value.trim() !== '') {
        fetch(`http://localhost:8080/comments`,{
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json',
                'Authorization': currentSession().authToken
            },
            body: JSON.stringify({
                user : {
                    userId: currentSession().userId
                },
                recommendationId : recommId,
                comment : commentsModal.value
            })
        })
        .catch((err) => {
            console.log(err)
        })
        .finally(() => {
            /* Actualizar comentarios */
            getComments(recommId, false);
            /* Limpiar campo de texto del nuevo comentario */
            commentsModal.value='';
    
        })  
    }  
}

/**
 * Obtiene y despliega información detallada de una recomendación
 * @param {Integer} recommId 
 */
const getRecommendationData = (recommId) => {
    const modalButton = document.getElementById('knowMoreButton');
    /* Realiza una petición al backend para obtener los datos de una recomendación */
    fetch(`http://localhost:8080/recommendations/${recommId}`, {
        method: 'GET',
        headers: {
            'Content-Type' : 'application/json',
            'Authorization': currentSession().authToken
        },
    })
    .then((res) => res.json())
    .then((data) => {
        /* Si es una recomendación que si se encuentra en nuestra base de datos, se despliega un modal con su información */
        if (data) {
            const recommendation = data;
            const bodyModal = document.getElementById('knowMoreBodyModal');
            bodyModal.innerHTML = `
            <div>
                <h4>${recommendation.location}</h4>
                <p class='mb-1'>
                    ${recommendation.user.name + ' (' + getDateOfRecommendation(recommendation.createdAt) + ')'}
                </p>
                <h5><span class="badge bg-secondary">${recommendation.category.name}</span></h5>
                <small>
                    ${recommendation.text}
                </small>
                <br/>
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
                                    <img src=${media.content} class="d-block w-100" alt=${'Archivo #' + (i + 1)}>
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
        }
    })
    .catch((err) => console.log(err))
    .finally(() => {
        modalButton.click();
    });
};

/**
 * Obtener una lista con las recomendaciones para mostrar en el feed de la página principal.
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
        /* Añadir cada recomendación a nuestra página (HTML) */
        data.forEach((recommendation) =>{
            addRecommendation(recommendation);
        }) 
    })
    .catch((err) => console.log(err))
}

/**
 * Añadir un event listener cuando se dé click en el botón para publicar recomendación
 */
function onSaveRecommendationClicked() {
    document.getElementById('save-recommendation').addEventListener('click', saveRecommendation);
}

/**
 * Validar los campos requeridos para la creación de una recomendación.
 * Se verifica que estos no estén vacíos.
 * 
 * @param {Object} textSm - input[type="text"] con el resumen de la recomendación
 * @param {Object} location - input[type="text"] con la ubicación que se recomienda
 * @param {Object} category - select con la categoría seleccionada
 * @returns Boolean
 */
function validateNewRecommendationForm(textSm, location, category) {
    const textContainer = document.querySelector('#recommendation-text+div');
    let noError = true;

    [textSm, location, category].forEach((input) => {
        /* Si el campo está vacío, mostrarlo con un borde rojo */
        if ( !validateMessage(input.value.trim()) ) {
            input.classList.add('is-invalid');
            noError = false;
        } else {
            input.classList.remove('is-invalid');
        }
    });

    /*
     * Si el campo de texto enriquecido está vacío, mostrarlo con un borde rojo.
     */
    if ( !validateMessage(tinymce.get('recommendation-text').getContent({format: "text"}).trim()) ) {
        textContainer.classList.add('is-invalid');
        noError = false;
    } else {
        textContainer.classList.remove('is-invalid');
    }

    return noError;
}

/**
 * Recupera desde localStorage, el usuario con sesión iniciada
 * @returns Object - usuario con la sesión iniciada
 */
function currentSession() {
    return JSON.parse(localStorage.getItem('userSession'));
}

/**
 * Carga los datos del usuario con la sesión iniciada,
 * en los elementos html que requieran mostrar dicha información.
 */
function loadCurrentUserData() {
    const user = currentSession();
    /* Selecciona todos los elementos que requieran que se muestre la foto de perfil del usuario */
    const avatarList = document.getElementsByClassName('user-avatar');
    /* Selecciona todos los elementos que requieran mostrar el nombre del usuario */
    const usernameList = document.getElementsByClassName('currentUserName');
    /**
     * Selecciona el input del formulario principal que requiere de un nombre de usuario.
     * Aquel que dice: 'Tienes una recomendación, NOMBRE_USUARIO ?'
     */
    const inputPlaceholder = document.getElementById('recomm-input');

    [...avatarList].forEach(avatar => (
        /* Cargar la imagen de perfil, si el usuario no tiene foto se le asigna una por defecto */
        avatar.src = user.profilePicture || 
        'http://cdn.onlinewebfonts.com/svg/img_568657.png'
    ));
    [...usernameList].forEach(uname => (uname.innerHTML = user.name));
    /* Reemplazar USER_NAME, por el nombre del usuario que actualmente tiene una sesión iniciada */
    inputPlaceholder.placeholder = inputPlaceholder.placeholder.replace('USER_NAME', user.name.split(" ")[0])
}

/**
 * Publicar una recomendación
 */
function saveRecommendation() {
    /* Mensajes de error o éxito */
    const msgOK = document.getElementById('toast-ok');
    const msgError = document.getElementById('toast-error');
    let msgToShow = null;

    /* Seleccionar los campos dentro del formulario de 'nueva recomendación' */
    const recommendationSm = document.getElementById('recommendation-sm');
    const locationRec = document.querySelector("#location input");
    const category = document.getElementById("category");

    /** validación de campos **/
    if (!validateNewRecommendationForm(recommendationSm, locationRec, category)) {
        return;
    }

    /* Obtener usuario con la sesión activa */
    const user = currentSession();
    
    /* Construir un arreglo (lista) con nuestros archivos de media */
    const media = [];
    document.querySelectorAll("#recommendation-media img").forEach((img)=>{
        media.push({
            userId: user.userId,
            content: img.src,
            mediaType: "photo"
        });
    })

    /* Construir objeto con los datos de nuestra nueva recomendación */
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
    .then((data) =>  {
        /* asignar mensaje de éxito para mostrar después */
        msgToShow = msgOK;
        /* recargar pestaña del navegador */
        window.location.reload();
    })
    .catch((err) => {
        /* asignar mensaje de error para mostrar después */
        msgToShow = msgError;
    })
    .finally(() => {
        /* construir y mostrar el mensaje de éxito o error */
        const toast = new bootstrap.Toast(msgToShow);
        toast.show();
        /* limpiar todos los campos de nuestro formulario */
        document.getElementById("cancel-recommendation").click();
    });
}

/**
 * Comprueba si un usuario ha iniciado sesión
 * @returns Boolean
 */
function verifyUserSession(){
    const credentialUser = currentSession();
    if(!credentialUser) return false;
    return true;
}

/**
 * Limpiar todos los campos del formulario de nueva recomendación
 */
function resetNewFormData() {
    document.querySelector("#newRecommendationModal form").reset();
    tinymce.get("recommendation-text").setContent("");
    document.getElementById("recommendation-media").innerHTML="";
    document.querySelectorAll('#newRecommendationModal .is-invalid').forEach(elem => elem.classList.remove('is-invalid'));
}

/**
 * Cuando todos los elementos de la ventana han terminado de cargar,
 * ejecutar la siguiente secuencia de instrucciones.
 */
window.addEventListener('load', () => {
    /* Si no existe un usuario con sesión activa, redireccionar al login */
    const existUser =  verifyUserSession();
    if(!existUser){
        window.location.href = "/index.html";
        return;
    }
    /* Transferir click, desde el anchor (botón visual) de añadir imagen, al input-file (cargar imagen) */
    document.querySelector('#btn-add-image').addEventListener('click', () => {
        document.querySelector('#my-image').click();
    })

    /* Transferir click, desde el anchor (botón visual) de añadir video, al input-file (cargar video) */
    document.querySelector('#btn-add-video').addEventListener('click', () => {
        document.querySelector('#my-video').click();
    })

    /* Limpiar los campos del formulario de creación de nueva recomendación, al cerrar el formulario */
    document.getElementById("newRecommendationModal").addEventListener('hidden.bs.modal', resetNewFormData);

    /* Al hacer click en cualquier elemento de nuestro formulario, se ejecuta lo siguiente */
    document.querySelector('.publicar').addEventListener('click', (event) => {
        /* Filtrar para mostrar el modal sólo al hacer click en determinados elementos */
        if (!event.target.dataset.openModal) return;

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

    /* Cargar recomendaciones, categorías y datos de usuario con sesión activa */
    loadCurrentUserData();
    loadCategories();
    loadRecommendations();

    /* Texto enriquecido modal recomendaciones */
    richTxt();

    /* Event listener para cargar archivos de media */
    uploadedMedia();
    /* Hacer posible que se puedan reordenar las imágenes */
    mediaSortable();
    
});

/**
 * Event listener para cargar imágenes del usuario
 */
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

/**
 * Leer archivo de media (imagen) y cargarlo en el html
 */
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

/**
 * Configurar tiny para nuestro text-area con texto enriquecido
 */
function richTxt(){
    tinymce.init({
        selector: '#recommendation-text',
        menubar: false,
        plugins: [
            'advlist lists',
            'wordcount nonbreaking',
            'emoticons paste help'
        ],
        toolbar: 'undo redo | bold italic underline | align | bullist numlist | emoticons',
    });

    // Patch table not working
    document.addEventListener('focusin', (e) => {
        if (e.target.closest('.tox-tinymce, .tox-tinymce-aux, .moxman-window, .tam-assetmanager-root')) {
            e.stopImmediatePropagation();
        }
    })
}

/**
 * Inicializar nuestro contenedor de imágenes, para que permita reordenarlas utilizando (drag & drop)
 */
function mediaSortable(){
    new Sortable(document.getElementById("recommendation-media"), {
        ghostClass: 'media-ghost'
    });
}

/**
 * Cargar categorías en nuestro formulario de nueva recomendación
 */
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

const btnOpenModal = document.getElementsByClassName('profile-open-modal');
const editProfileImgBtn = document.getElementById('edit-profile-img');
const inputHiddenUpload = document.getElementById('edit-profile-upload');
const saveEditProfile = document.getElementById('save-edit-profile');
let editProfileName = document.getElementById('edit-profile-name');
let editProfileAbMe = document.getElementById('edit-profile-abMe');
let editProfilePhone = document.getElementById('edit-profile-phone');
let editProfileBirthday = document.getElementById('edit-profile-birthday');
let editProfileShowImg = document.getElementById('edit-profile-showimg');
let errorNameEditText = document.getElementById('error-name-edit');
let errorNamePhoneText = document.getElementById('error-name-phone');

function renderImageUploaded(elementImg, mediaFile){
    let mediaScanner = new FileReader();
    mediaScanner.onload = function () {
        elementImg.src = mediaScanner.result;
    }
    mediaScanner.readAsDataURL(mediaFile);
}

btnOpenModal[0].addEventListener('click', function(e) {
    const user = currentSession();
    editProfileName.value = user.name;
    if (user.aboutMe) {
        editProfileAbMe.value = user.aboutMe;
    }
    editProfilePhone.value = user.telephone;
    editProfileBirthday.value = user.birthday ? user.birthday.slice(0,10) : '';
    editProfileShowImg.src =user.profilePicture || 
        'http://cdn.onlinewebfonts.com/svg/img_568657.png';
});

editProfileImgBtn.addEventListener('click', function(e) {
    inputHiddenUpload.click();
});

inputHiddenUpload.addEventListener('change', function(e) {
    if (e.target.files.length > 0) {
        renderImageUploaded(editProfileShowImg, e.target.files[0]);
    }
});

/**
 * Comprueba si los campos de editar perfil son válidos.
 * Se resaltan en rojo aquellos que no lo son.
 * @returns Boolean
 */
const editProfileValidations = () => {
    let existError = false;

    if (!validateName(editProfileName.value)) {
        existError = true;
        errorNameEditText.innerText = 'El campo nombre no es válido';
        errorNameEditText.classList.add('text-danger');
        editProfileName.classList.add('form-control');
        editProfileName.style.border = '1px solid red';
        editProfileName.style.width = '90%';
        editProfileName.placeholder = 'Agrega tu nombre completo';
    } else {
        errorNameEditText.innerText = '';
        errorNameEditText.classList.remove('text-danger');
        editProfileName.style.border = 'none';
        editProfileName.classList.remove('form-control');
        editProfileName.style.width = 'auto';
        editProfileName.placeholder = '';
    }
    if (!validateTelephone(editProfilePhone.value)) {
        existError = true;
        errorNamePhoneText.innerText = 'El campo teléfono no es válido';
        errorNamePhoneText.classList.add('text-danger');
        editProfilePhone.style.border = '1px solid red';
    } else {
        errorNamePhoneText.innerText = '';
        errorNamePhoneText.classList.remove('text-danger');
        editProfilePhone.style.border = 'none';
    }

    return existError;
};

/**
 * Realizar una petición PUT al backend, para actualizar los datos del usuario
 */
saveEditProfile.addEventListener('click', function() {
    const user = currentSession();
    const userUpdate = {
        aboutMe: editProfileAbMe.value || '',
        birthday: editProfileBirthday.value,
        telephone: editProfilePhone.value,
        name: editProfileName.value,
        email: user.email,
        profilePicture: editProfileShowImg.src || ''
    };
    if (!editProfileValidations()) {
        fetch(`http://localhost:8080/users/${user.userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type' : 'application/json',
                'Authorization': user.authToken
            },
            body: JSON.stringify(userUpdate)
        })
        .then((res) => res.json())
        .then((data) => {
            /* Si fue exitosa la modificación, actualizar en locaStorage los datos del usuario */
            if (data) {
                localStorage.setItem(
                    'userSession',
                    JSON.stringify({
                        ...data,
                        authToken: user.authToken
                    })
                );
                window.location.reload();
            } else {
                /* En caso contrario, mostrar un mensaje de error */
                renderErrorMsg();
            }
        })
        .catch(err => renderErrorMsg())
    }
});

/**
 * Cerrar sesión:
 * 1. Elimina a nuestro usuario de localStorage
 * 2. Redirige hacia el login
 */
const logoutButton = document.getElementById('logout-btn');
logoutButton.addEventListener("click", function(){
    localStorage.removeItem("userSession");
    window.location.href = "/index.html";
})