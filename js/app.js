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
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                    class="bi bi-heart-fill" viewBox="0 0 16 16">
                    <path fill-rule="evenodd"
                        d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z" />
                </svg>
                <span>${recommendation.numOfLikes}</span>
            </div>
            <a href="#">${recommendation.numOfComments} comentarios</a>
        </div>
        <div class="botones  d-flex">
            <button class="me-gusta">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                    class="bi bi-hand-thumbs-up" viewBox="0 0 16 16">
                    <path
                        d="M8.864.046C7.908-.193 7.02.53 6.956 1.466c-.072 1.051-.23 2.016-.428 2.59-.125.36-.479 1.013-1.04 1.639-.557.623-1.282 1.178-2.131 1.41C2.685 7.288 2 7.87 2 8.72v4.001c0 .845.682 1.464 1.448 1.545 1.07.114 1.564.415 2.068.723l.048.03c.272.165.578.348.97.484.397.136.861.217 1.466.217h3.5c.937 0 1.599-.477 1.934-1.064a1.86 1.86 0 0 0 .254-.912c0-.152-.023-.312-.077-.464.201-.263.38-.578.488-.901.11-.33.172-.762.004-1.149.069-.13.12-.269.159-.403.077-.27.113-.568.113-.857 0-.288-.036-.585-.113-.856a2.144 2.144 0 0 0-.138-.362 1.9 1.9 0 0 0 .234-1.734c-.206-.592-.682-1.1-1.2-1.272-.847-.282-1.803-.276-2.516-.211a9.84 9.84 0 0 0-.443.05 9.365 9.365 0 0 0-.062-4.509A1.38 1.38 0 0 0 9.125.111L8.864.046zM11.5 14.721H8c-.51 0-.863-.069-1.14-.164-.281-.097-.506-.228-.776-.393l-.04-.024c-.555-.339-1.198-.731-2.49-.868-.333-.036-.554-.29-.554-.55V8.72c0-.254.226-.543.62-.65 1.095-.3 1.977-.996 2.614-1.708.635-.71 1.064-1.475 1.238-1.978.243-.7.407-1.768.482-2.85.025-.362.36-.594.667-.518l.262.066c.16.04.258.143.288.255a8.34 8.34 0 0 1-.145 4.725.5.5 0 0 0 .595.644l.003-.001.014-.003.058-.014a8.908 8.908 0 0 1 1.036-.157c.663-.06 1.457-.054 2.11.164.175.058.45.3.57.65.107.308.087.67-.266 1.022l-.353.353.353.354c.043.043.105.141.154.315.048.167.075.37.075.581 0 .212-.027.414-.075.582-.05.174-.111.272-.154.315l-.353.353.353.354c.047.047.109.177.005.488a2.224 2.224 0 0 1-.505.805l-.353.353.353.354c.006.005.041.05.041.17a.866.866 0 0 1-.121.416c-.165.288-.503.56-1.066.56z" />
                </svg>
                Me gusta
            </button>
            <button class="comentar">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                    class="bi bi-chat-left" viewBox="0 0 16 16">
                    <path
                        d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
                </svg>
                Comentar
            </button>
            <button class="comentar">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                    class="bi bi-share" viewBox="0 0 16 16">
                    <path
                        d="M13.5 1a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.499 2.499 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5zm-8.5 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm11 5.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z" />
                </svg>
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

addRecommendation({
    userPicture : "images/integrate-project_miguel.jpg",
    userName : "Miguel Santiago", 
    userLocation : "Tepic, Nayarit", 
    createdAt : "29 de septiembre de 2021",
    recommendationText : "Aquí paseando en la loma.",
    uploadedPicture : "https://hotelfrayjunipero.com/wp-content/uploads/2021/02/LaLoma.jpg",
    numOfLikes : "1000",
    numOfComments : "50"
    
});

addRecommendation({
    userPicture : "images/integrate-project_neferti.jpg",
    userName : "Neferti Martínez", 
    userLocation : "La Rumorosa, Jalisco", 
    createdAt : "29 de septiembre de 2021",
    recommendationText : "Un escenario espectacular.",
    uploadedPicture : "https://mexicali.travel/wp-content/uploads/2018/03/rumorosa-bajacalifornia-head-1.jpg",
    numOfLikes : "80",
    numOfComments : "3"
    
});

addRecommendation({
    userPicture : "images/integrate-project-diana.jpeg",
    userName : "Diana Manriquez", 
    userLocation : "Mazamitla, Jalisco", 
    createdAt : "29 de septiembre de 2021",
    recommendationText : "Pueblito mágico.",
    uploadedPicture : "https://cdn.forbes.com.mx/2021/07/Mazamitla-Pueblo-Ma%CC%81gico-e1626201250705.jpg",
    numOfLikes : "38",
    numOfComments : "5"
    
});

addRecommendation({
    userPicture : "images/integrate-project-german.png",
    userName : "Germán Gutiérrez", 
    userLocation : "Ecatepec de Morelos, Estado de México", 
    createdAt : "29 de septiembre de 2021",
    recommendationText : "Mejor conocido como Ecatepunk, será una experiencia que solo podrás vivir una vez en tu vida.",
    uploadedPicture : "https://ecatepec.sapase.gob.mx/images/cabildo/jhv.jpg",
    numOfLikes : "1",
    numOfComments : "0"
    
});

addRecommendation({
    userPicture : "images/integrate-project_liz.png",
    userName : "Lizbeth García", 
    userLocation : "Mazatlán, Sinaloa", 
    createdAt : "29 de septiembre de 2021",
    recommendationText : "Disfrutando del malecón más grande del mundo :D",
    uploadedPicture : "https://cdn2.excelsior.com.mx/media/styles/image800x600/public/pictures/2021/08/09/2624402.jpg",
    numOfLikes : "30",
    numOfComments : "5"
    
});

addRecommendation({
    userPicture : "images/integrate-project-paloma.jpg",
    userName : "Paloma Jaramillo", 
    userLocation : "Chapala, Jalisco", 
    createdAt : "29 de septiembre de 2021",
    recommendationText : "¡Disfrutando de la mejor vista!",
    uploadedPicture : "https://upload.wikimedia.org/wikipedia/commons/e/e6/Chapala_jalisco.jpg",
    numOfLikes : "15",
    numOfComments : "5"
    
});

addRecommendation({
    userPicture : "images/integrate-project-ricardo.jpg",
    userName : "Ricardo Peralta", 
    userLocation : "Zapopan, Jalisco", 
    createdAt : "29 de septiembre de 2021",
    recommendationText : "Deliciosa comida, excelente servicio 😁",
    uploadedPicture : "https://media.istockphoto.com/photos/three-carne-asada-mexican-street-tacos-in-corn-tortilla-with-lime-picture-id1272532786?b=1&k=6&m=1272532786&s=170667a&w=0&h=GJ2jnqq0xNU9C9n4ZstB6apT-ouyQoON9CXY3ZwP1s4=",
    numOfLikes : "37",
    numOfComments : "13"
    
});

addRecommendation({
    userPicture : "images/integrate-project-german.png",
    userName : "Germán Gutiérrez", 
    userLocation : "Torreón, Coahuila", 
    createdAt : "29 de septiembre de 2021",
    recommendationText : "Un pueblo pequeño y caluroso pero acogedor.",
    uploadedPicture : "https://lh4.googleusercontent.com/8FeMWpZlj8CH48tlGrkzPVlYWIaSS7OWQOUFPc_NK7_V7M3Z7Xf8BwxGFA-31l7vQF_0wOJbG4-46dklURibXqcpqyn532919Jj5eUYWP4csxQbsTfUKjp8WzsWiMFUFn3VSUtEN",
    numOfLikes : "0",
    numOfComments : "1"
    
});

addRecommendation({
    userPicture : "images/integrate-project-paloma.jpg",
    userName : "Paloma Jaramillo", 
    userLocation : "Xochimilco, Ciudad de México", 
    createdAt : "29 de septiembre de 2021",
    recommendationText : "Dando un paseo en las famosas chinampas.",
    uploadedPicture : "https://www.gustoxmexico.com/images/mexico2020xochimilco.jpg",
    numOfLikes : "30",
    numOfComments : "8"
    
});

addRecommendation({
    userPicture : "images/integrate-project-diana.jpeg",
    userName : "Diana Manriquez", 
    userLocation : "Punta Negra, Puerto Vallarta", 
    createdAt : "29 de septiembre de 2021",
    recommendationText : "Pasando el rato.",
    uploadedPicture : "https://puertovallartaproperties.net/wp-content/uploads/2019/02/pnegra902_beach8.jpg",
    numOfLikes : "35",
    numOfComments : "5"
    
});


