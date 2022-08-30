const cart = [];

function retrieveLocalStorageItems() {
    const numberOfItems = localStorage.length;
    for( x = 0; x < numberOfItems; x++) {
        const item = localStorage.getItem(localStorage.key(x))
        const itemObject = JSON.parse(item)
        cart.push(itemObject)
        console.log(cart)
    }
}

retrieveLocalStorageItems();
cart.forEach((item) => displayItems(item));

// Fonction pour créer un article
function createArticle(item) {
    const section = document.getElementById("cart__items")
    const article = document.createElement("article")
    article.classList.add("cart__item")
    article.dataset.id = item.id
    article.dataset.color = item.color
    section.appendChild(article)
}

function displayArticle(article) {
    document.querySelector("#cart__items").appendChild(article)
}

function createImageDiv(item) {
    const div = document.createElement("div")
    div.classList.add("cart__item__img")

    const image = document.createElement("img")
    image.src = item.imageURL
    image.alt = item.altTxt
    div.appendChild(image)
}

/**
 * 
 * @param {object} item 
 */
function displayItems(item) {
    createArticle(item)
    displayArticle(article)
    createImageDiv(item)
}