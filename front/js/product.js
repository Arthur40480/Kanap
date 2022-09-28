const IMG_PRODUCT_ELT = document.querySelector(".item__img");
const NAME_PRODUCT_ELT = document.getElementById("title");
const PRICE_PRODUCT_ELT = document.getElementById("price");
const DESCRIPTION_PRODUCT_ELT = document.getElementById("description");
const COLOR_PRODUCT_ELT = document.getElementById("colors");
const QUANTITY_PRODUCT_ELT = document.getElementById("quantity")
const BTN_AD_TO_CART_ELT = document.getElementById("addToCart");

// Création de constante pour récupérer l'URL de chaques id
const URL_ID = window.location.search;
const URL_PARAMS = new URLSearchParams(URL_ID);
const ID_ITEM = URL_PARAMS.get("id");

//Fonction pour rediriger vers la page du panier
function redirectToCart() {
    window.location.href = "cart.html"
};

/**
 * Fonction pour sauvegarder le panier dans le localStorage
 * @param {object} product 
 */
 function saveOrder(product) {
    let orderKey = `${ID_ITEM}-${COLOR_PRODUCT_ELT.value}`
    let order = localStorage.getItem(orderKey)
    if( order == null ){
        localStorage.setItem(orderKey, JSON.stringify({
            id: product._id,
            name: product.name,
            color: COLOR_PRODUCT_ELT.value,
            price: product.price,
            quantity: Number(QUANTITY_PRODUCT_ELT.value),
            imageUrl: product.imageUrl,
            description: product.description,
            altTxt: product.altTxt
        }))
        return
    }
    let orderUpdate = JSON.parse(order)
    orderUpdate.quantity = orderUpdate.quantity + Number(QUANTITY_PRODUCT_ELT.value);
    localStorage.setItem(orderKey, JSON.stringify(orderUpdate))   
};

/**
 * //Fonction pour que le client valide un panier correct
 * @param {string} color 
 * @param {number} quantity 
 * @returns true => Si jamais les conditions sont respectées, la fonction retourne la valeur true
  */
 function invalidOrder(color, quantity) {
    if( quantity === 0 ) {
        alert("Veuillez choisir une quantité pour cet article")
        return true
    }else if ( quantity > 100 ) {
        alert("La quantité maximum pour cet article est de 100 exemplaires")
        return true
    }else if ( color === null || color === '' ) {
        alert(" Veuillez choisir une couleur disponible pour cet article")
        return true
    } 
};

/**
 * Fonction permettant d'ajouter le choix des couleurs pour chaques items
 * @param {object} product 
 */
function getColors(product) {
    for( let color of product.colors) {
        const CHOICE_COLORS_ELT = document.createElement("option");
        CHOICE_COLORS_ELT.value = `${color}`
        CHOICE_COLORS_ELT.innerText = `${color}`
        COLOR_PRODUCT_ELT.appendChild(CHOICE_COLORS_ELT);
    } 
};

/**
 * Fonction pour ajouter les éléments de manière dynamique dans le HTML
 * @param {object} product 
 */
function displayProduct(product) {
    IMG_PRODUCT_ELT.innerHTML = `<img src="${product.imageUrl}" alt="${product.altTxt}"></img>`;
    NAME_PRODUCT_ELT.innerHTML = `<h1 id="title">${product.name}</h1>`;
    PRICE_PRODUCT_ELT.innerHTML = `<span id="price">${product.price}</span>`;
    DESCRIPTION_PRODUCT_ELT.innerHTML = `<p id="description">${product.description}</p>`;
    getColors(product); // On apelle la fonction getColors pour l'ajouter dans le DOM
}

//Fonction pour récupérer les données des produits et les utiliser dans la fonction displayProduct que l'on apelle
function recoverDataProduct() {
fetch(`http://localhost:3000/api/products/${ID_ITEM}`)
    .then(response => response.json())
    .then((product) => displayProduct(product)) 
    .catch((error) => console.log(error)) 
};

//Fonction pour l'événement.
function validItemInCart() {
    fetch(`http://localhost:3000/api/products/${ID_ITEM}`)
    .then(response => response.json())
    .then((product) => {
        let colorProduct = document.getElementById("colors").value;
        let quantityProduct = Number(document.getElementById("quantity").value);
        if(invalidOrder(colorProduct, quantityProduct) === true) {
            return
        } 
            saveOrder(product)
            alert(`Votre produit ${product.name} en ${QUANTITY_PRODUCT_ELT.value} exemplaire(s) à bien été ajouter a votre panier !`)
            redirectToCart();
    }
)};

//Evénement sur le bouton "Ajouter au panier"
function EventBtnAddToCart() {
BTN_AD_TO_CART_ELT.addEventListener('click', validItemInCart);
};

// On appelle la fonction
recoverDataProduct();

// On appelle la fonction
EventBtnAddToCart();
