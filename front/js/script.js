/**
 * Fonction nous permettant d'afficher dynamiquement les articles contenue dans la réponse de notre FETCH
 * @param {object} product => contenant la réponse de notre FETCH ( les articles )
 */
function displayArticlesInIndex(product) {
    const NB_ARTICLE = product.length
    for(let x = 0; x < NB_ARTICLE; x += 1) {
        const ITEMS = document.getElementById('items')
        ITEMS.innerHTML +=
        `<a href="./product.html?id=${product[x]._id}">
            <article>
                <img src="${product[x].imageUrl}" alt=${product[x].altTxt}>
                <h3 class="productName">${product[x].name}</h3>
                <p class="productDescription">${product[x].description}</p>
            </article>
        </a>`
    }
};

function getArticle () {
    // Méthode fetch pour récupérer les données des canapés
    fetch('http://localhost:3000/api/products')
    .then( response => response.json() )
    .then( product => displayArticlesInIndex(product))
    .catch(error => console.log(error));
};  

// On apelle notre fonction
getArticle();

