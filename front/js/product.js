"use strict";

// Récupération de l'URL de chaques id
const url = window.location.search;
const urlParams = new URLSearchParams(url);
const id = urlParams.get("id");

// Récupération des éléments HTML
const imgProductElt = document.querySelector(".item__img");
const nameProductElt = document.getElementById("title");
const priceProductElt = document.getElementById("price");
const descriptionProductElt = document.getElementById("description");
const colorProductElt = document.getElementById("colors");
const quantityProductElt = document.getElementById("quantity")
const btnAddToCartElt = document.getElementById("addToCart");

/**
 * Fonction pour le choix des couleurs de chaques items
 * @param {string} product - choix des couleurs
 */
function getColors(product) {
    // Pour chaques couleurs de product.colors
    for( let color of product.colors) {
        const choiceElt = document.createElement('option');
        // Ajout de la valeur de l'option
        choiceElt.value = `${color}`
        // Ajout du texte de l'option
        choiceElt.innerText = `${color}`
        colorProductElt.appendChild(choiceElt);
    }
};

/**
 * Fonction pour ajouter les éléments de manière dynamique dans le HTML
 * @param {string} product - Ajout des produit dans les éléments HTML
 */
function displayProduct(product) {
    imgProductElt.innerHTML = `<img src="${product.imageUrl}" alt="${product.altTxt}"></img>`;
    nameProductElt.innerHTML = `<h1 id="title">${product.name}</h1>`;
    priceProductElt.innerHTML = `<span id="price">${product.price}</span>`;
    descriptionProductElt.innerHTML = `<p id="description">${product.description}</p>`;
    const imgProductUrl = product.imageUrl;
    console.log(imgProductUrl)
    getColors(product);
};

// const monProduit = getProduct();
// console.log(monProduit);
// Récupérations des éléments PAR ID avec la méthode Fetch via l'API
function getProduct() {
    fetch(`http://localhost:3000/api/products/${id}`)
    .then( response => response.json())
    .then( product => { displayProduct(product) })
    .catch(() => console.log("Une erreur est survenue !"))
};

// On apelle la fonction
getProduct();

// Fonction pour panier incorect
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

// Fonction pour sauvegarder la commande
function saveOrder(colorProduct, quantityProduct, idProduct, priceProduct, nameProduct, imgProduct) {
    const order = {
        id: idProduct,
        color: colorProduct,
        quantity: Number(quantityProduct),
        price: priceProduct,
        name: nameProduct,
        image: imgProduct
    }
    localStorage.setItem("id", JSON.stringify(order))
};

//Fonction pour rediriger vers la page du panier
function redirectToCart() {
    window.location.href = "cart.html"
};

// Evènement pour écouter lors d'un clique
btnAddToCartElt.addEventListener('click', function() {
    const colorProduct = document.getElementById("colors").value;
    const quantityProduct = document.getElementById("quantity").value;
    const idProduct = id;
    const priceProduct = priceProductElt.innerText;
    const nameProduct = nameProductElt.innerText;
    const imgProduct = imgProductElt.innerHTML;
    if (invalidOrder(colorProduct, quantityProduct) === true) {
        return
    }else{
    saveOrder(colorProduct, quantityProduct, idProduct, priceProduct, nameProduct, imgProduct)
    redirectToCart()  
}});

