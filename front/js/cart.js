//Création de tableau qui représente le contenue du panier actuel
const cart = [];

retrieveLocalStorageItems();
cart.forEach((item) => displayArticleElt(item));

// Fonction pour récupérer les items du localstorage pour les mettres dans le panier
function retrieveLocalStorageItems() {
    const numberOfItems = localStorage.length;
    for( x = 0; x < numberOfItems; x++) {
        const item = localStorage.getItem(localStorage.key(x))
        const itemObject = JSON.parse(item)
        cart.push(itemObject)
    }
}

// Fonction afficher les éléments de chaques article dans le panier
function displayArticleElt(item) {
    fetch('http://localhost:3000/api/products')
        .then(response => response.json())
        .then(product => {

            for(let i = 0; i < cart.length; i++){
                let colorCart = cart[i].color;
                let idCart = cart[i].id;
                let quantityCart = cart[i].quantity;

                const dataCart = product.find((element) => element._id === idCart);
                const priceItemCart = dataCart.price
              
    // Création de la balise article class= "cart__item"
    let articleElt = document.createElement("article");
    articleElt.classList.add("cart__item");
    articleElt.dataset.id = item.id;
    articleElt.dataset.color = item.color;
    const sectionElt = document.getElementById("cart__items");
    sectionElt.appendChild(articleElt);    // <= On l'ajoute en tant qu'enfant à la section id="cart__items"

    // Création de la div class= "cart__item__img"
    let divImgElt = document.createElement("div");
    divImgElt.classList.add("cart__item__img");
    articleElt.appendChild(divImgElt); // <= On l'ajoute en tant qu'enfant à l'article class="cart__item"

    //Création de l'image du produit
    let imgElt = document.createElement("img");
    imgElt.src = dataCart.imageUrl
    imgElt.alt = dataCart.altTxt
    divImgElt.appendChild(imgElt);

    // Création de la div class= "cart__item__content"
    let divContentElt = document.createElement("div");
    divContentElt.classList.add("cart__item__content");
    articleElt.appendChild(divContentElt);

    // Création de la div class="cart__item__content__description"
    let divDescriptionElt = document.createElement("div");
    divDescriptionElt.classList.add("cart__item__content__description");
    divContentElt.appendChild(divDescriptionElt);

    // Création du titre <h2> pour le nom de l'article            
    let productTitleElt = document.createElement("h2");
    productTitleElt.innerText = item.name;
    divDescriptionElt.appendChild(productTitleElt);

    // Création de la balise <p> pour la couleur de l'article           
    let colorProductElt = document.createElement("p");
    colorProductElt.innerText = colorCart; 
    divDescriptionElt.appendChild(colorProductElt);

    // Création de la balise <p> pour le prix de l'article          
    let priceProductElt = document.createElement("p");
    priceProductElt.innerText = item.price + "€";
    divDescriptionElt.appendChild(priceProductElt);

    // Création de la div class="cart__item__content__settings"
    let divSettingsElt = document.createElement("div");
    divSettingsElt.classList.add("cart__item__content__settings");
    divContentElt.appendChild(divSettingsElt);

    // Création de la div class="cart__item__content__settings__quantity"
    let divQuantityElt = document.createElement("div");
    divQuantityElt.classList.add("cart__item__content__settings__quantity");
    divSettingsElt.appendChild(divQuantityElt);

    // Création de la balise <p> pour la quantité de l'article
    let quantityProductElt = document.createElement("p");
    quantityProductElt.innerText = "Qté : ";
    divQuantityElt.appendChild(quantityProductElt);

    // Création de l'input permettant de modifier la quantité de l'article dans le panier
    let inputQuantityElt = document.createElement("input");
    inputQuantityElt.classList.add("itemQuantity");
    inputQuantityElt.type = "number";
    inputQuantityElt.name = "itemQuantity";
    inputQuantityElt.min = 1;
    inputQuantityElt.max = 100;
    inputQuantityElt.value = item.quantity;
    divQuantityElt.appendChild(inputQuantityElt);

    // Création de la div class="cart__item__content__settings__delete" pour supprimer l'article du panier
    let divDeleteElt = document.createElement("div");
    divDeleteElt.classList.add("cart__item__content__settings__delete");
    divSettingsElt.appendChild(divDeleteElt);

    // Création de la balise <p> class="deleteItem"
    let deleteItemElt = document.createElement("p");
    deleteItemElt.classList.add("deleteItem");
    deleteItemElt.innerText = "Supprimer";
    divDeleteElt.appendChild(deleteItemElt);
        }
    })
}
//Fonction pour calculer le nombre total d'article dans le panier
function totalItemsInCart() {
    let itemQuantity = 0
    const totalItemsInCartElt = document.getElementById("totalQuantity")
    //.reduce fonction "accumulatrice" => pour traiter chaques valeurs d'un liste afin de le réduire à une seule valeur
    const totalQuantity = cart.reduce((total, item) => total + item.quantity, itemQuantity)
    totalItemsInCartElt.textContent = totalQuantity   
}
totalItemsInCart();

