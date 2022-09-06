// Utilisation du mode strict
"use strict"

const imgProductElt = document.querySelector(".item__img");
const nameProductElt = document.getElementById("title");
const priceProductElt = document.getElementById("price");
const descriptionProductElt = document.getElementById("description");
const colorProductElt = document.getElementById("colors");
const quantityProductElt = document.getElementById("quantity")
const btnAddToCartElt = document.getElementById("addToCart");

// Création de constante pour récupérer l'URL de chaques id
const url = window.location.search;
const urlParams = new URLSearchParams(url);
const idItem = urlParams.get("id");



//Fonction pour rediriger vers la page du panier
function redirectToCart() {
    window.location.href = "cart.html"
};

fetch(`http://localhost:3000/api/products/${idItem}`)
    .then(response => response.json())
    .then(product => {

        document.title = product.name; // On ajoute le nom du produit dans le titre de la page ( balise <title> )

        // Fonction permettant d'ajouter le choix des couleurs pour chaques items
        function getColors() {
            for( let color of product.colors) {
                const choiceColorsElt = document.createElement("option");
                choiceColorsElt.value = `${color}`
                choiceColorsElt.innerText = `${color}`
                colorProductElt.appendChild(choiceColorsElt);
            } 
        }

        //Fonction pour ajouter les éléments de manière dynamique dans le HTML
        function displayProduct() {
            imgProductElt.innerHTML = `<img src="${product.imageUrl}" alt="${product.altTxt}"></img>`;
            nameProductElt.innerHTML = `<h1 id="title">${product.name}</h1>`;
            priceProductElt.innerHTML = `<span id="price">${product.price}</span>`;
            descriptionProductElt.innerHTML = `<p id="description">${product.description}</p>`;
            getColors(); // On apelle la fonction getColors pour l'ajouter dans le DOM
        }

        displayProduct(); // On apelle la fonction
        
        /**
         * //Fonction pour que le client valide un panier correct
         * @param {*string} color 
         * @param {*Number.value} quantity 
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
        
        // Fonction pour sauvegarder le panier dans le localStorage
        function saveOrder() {
            let order = {
                id: product._id,
                name: product.name,
                color: colorProductElt.value,
                price: product.price,
                quantity: Number(quantityProductElt.value),
                imageUrl: product.imageUrl,
                description: product.description,
                altTxt: product.altTxt
            }
            localStorage.setItem(idItem, JSON.stringify(order))
        }

        
        btnAddToCartElt.addEventListener('click', function() {
            let colorProduct = document.getElementById("colors").value;
            let quantityProduct = Number(document.getElementById("quantity").value);
            if(invalidOrder(colorProduct, quantityProduct) === true) {
                return
            }else{
                saveOrder();
                redirectToCart();
            }
        })

    })
    


   


