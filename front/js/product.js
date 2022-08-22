// Récupération de l'URL de chaques id
const produit = window.location.search;
const urlParams = new URLSearchParams(produit);
const id = urlParams.get("id");

// Récupération des éléments HTML
let imgProduct = document.querySelector(".item__img");
let nameProduct = document.getElementById("title");
let priceProduct = document.getElementById("price");
let descriptionProduct = document.getElementById("description");
let colorProduct = document.getElementById("colors");

// Récupérations des éléments PAR ID avec la méthode Fetch via l'API
function getProduct() {
    fetch(`http://localhost:3000/api/products/${id}`)
    .then( response => response.json())
    .then( product => { displayProduct(product) })
    .catch(() => console.log("Une erreur est survenue !"))
    
}
getProduct();

// Fonction pour le choix des couleurs de chaques items
function getColors(product) {
    // Pour chaques couleurs de product.colors
    for( let color of product.colors) {
        const choice = document.createElement('option');
        // Ajout de la valeur de l'option
        choice.value = `${color}`
        // Ajout du texte de l'option
        choice.innerText = `${color}`
        colorProduct.appendChild(choice);
    }
}

// Fonction pour ajouter les éléments de manière dynamique dans le HTML
function displayProduct(product) {
    imgProduct.innerHTML = `<img src="${product.imageUrl}" alt="${product.altTxt}"></img>`;
    nameProduct.innerHTML = `<h1 id="title">${product.name}</h1>`;
    priceProduct.innerHTML = `<span id="price">${product.price}</span>`;
    descriptionProduct.innerHTML = `<p id="description">${product.description}</p>`;
    getColors(product);
}




