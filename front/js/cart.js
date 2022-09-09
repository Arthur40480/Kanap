//Création de l'array (tableau) qui représente le contenue du panier actuel
const cart = [];

//Création des constantes pour les données saisies dans le formulaire
const inputNameElt = document.getElementById("firstName");
const inputLastNameElt = document.getElementById("lastName");
const inputAdressElt = document.getElementById("address");
const inputCityElt = document.getElementById("city");
const inputMailElt = document.getElementById("email");

console.log(inputMailElt)

// Fonction pour récupérer les items du localstorage pour les mettres dans le panier
function retrieveLocalStorageItems() {
    const numberOfItems = localStorage.length;
    for( x = 0; x < numberOfItems; x++) {
        const item = localStorage.getItem(localStorage.key(x))
        const itemObject = JSON.parse(item)
        cart.push(itemObject)
    }
};

//Fonction pour calculer le nombre total d'article dans le panier
function totalItemsInCart() {
    let itemQuantity = 0
    const totalItemsInCartElt = document.getElementById("totalQuantity")
    /**
     * .reduce fonction "accumulatrice" => pour traiter chaques valeurs d'une liste afin de le réduire à une seule.
     * cart.reduce((previousValue, currentValue))
     */
    const totalQuantity = cart.reduce((total, item) => total + item.quantity, itemQuantity)
    totalItemsInCartElt.textContent = totalQuantity   
};

//Fonction pour calculer le prix total du panier
function totalCartPrice() {
    let total = 0
    const totalPriceElt = document.getElementById("totalPrice");
    cart.forEach((item) => {        //Fonction pour chaques objet d'un tableau
        const itemPrice = item.price * item.quantity
        total += itemPrice
    })
    totalPriceElt.innerText = Number(total)
};

/**
 * Fonction pour supprimer l'élément du LocalStorage ainsi que sont "article" dans le DOM
 * @param {object} item => Ici on récupère "item" qui est un objet avec toutes les données relative à l'article
 */
function removeItemFromLocalStorageAndDom(item) {
    localStorage.removeItem(item.id)
    const itemArticleToDeleteElt = document.querySelector(
        `article[data-id="${item.id}"]`)
        console.log("Deleting article", itemArticleToDeleteElt)
        itemArticleToDeleteElt.remove()
        alert("Votre produit a bien été supprimé du panier !");
};

/**
 * Fonction pour supprimer un élément du panier => cart[]
 * @param {*object} item => Ici on récupère "item" qui est un objet avec toutes les données relative à l'article
 */
function removeItemFromCart(item) {
    const itemToDelete = cart.find(product => product.id === item.id)
    /**Utilisation de la méthode ".splice( 0(indice à partir duquel commencer à changer le tableau), nbASupprimer, élem1 à ajouter, etc ...)"
     * Elle modifie le contenu d'un  tableau en retirant et/ou ajoutant de nouveaux éléments. */
    const itemToDeleteFromCart = cart.splice(itemToDelete, 1)
    totalCartPrice(); // => On rapelle les deux fonction pour pouvoir recalculer le prix et la quantité total lors de l'evènement
    totalItemsInCart();
    removeItemFromLocalStorageAndDom(item);
}

/**
 * Fonction permettant la mise à jour du prix total et de la quantité total lors de l'evènement
 * @param {*string} id  => Ici on viens chercher l'id de l'item à qui l'on veut modifier la quantité
 * @param {*number.value} updateQuantity => Ici on viens récupérer la valeur de l'input "inputQuantityElt" qui est un nombre
 * @param {*object} item => Ici on récupère "item" qui est un objet avec toutes les données relative à l'article 
 */
 function updateQuantityAndPrice(id, updateQuantity, item) {
    const itemToUpdate = cart.find(item => item.id === id);
    itemToUpdate.quantity = Number(updateQuantity);
    const newItemToSave = JSON.stringify(item);
    localStorage.setItem(item.id, newItemToSave);
    totalItemsInCart(); // => On rapelle les deux fonction pour pouvoir recalculer le prix et la quantité total lors de l'evènement
    totalCartPrice();
    };

/**
 * Fonction afficher les éléments de chaques article dans le panier
 * @param {*object} item => Ici on récupère "item" qui est un objet avec toutes les données relative à l'article 
 */
function displayArticleElt(item) {

        // Création de la balise article class= "cart__item"
        let articleElt = document.createElement("article");
        articleElt.classList.add("cart__item");
        articleElt.dataset.id = item.id;
        articleElt.dataset.color = item.color;
        const sectionElt = document.getElementById("cart__items")
        sectionElt.appendChild(articleElt);    // <= On l'ajoute en tant qu'enfant à la section id="cart__items"

        // Création de la div class= "cart__item__img"
        let divImgElt = document.createElement("div");
        divImgElt.classList.add("cart__item__img");
        articleElt.appendChild(divImgElt); 

        //Création de l'image du produit
        let imgElt = document.createElement("img");
        imgElt.src = item.imageUrl
        imgElt.alt = item.altTxt
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
        colorProductElt.innerText = item.color; 
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
        inputQuantityElt.value = Number(item.quantity);
        divQuantityElt.appendChild(inputQuantityElt);
        inputQuantityElt.addEventListener('input', () => updateQuantityAndPrice(item.id, inputQuantityElt.value, item))

        // Création de la div class="cart__item__content__settings__delete" pour supprimer l'article du panier
        let divDeleteElt = document.createElement("div");
        divDeleteElt.classList.add("cart__item__content__settings__delete");
        divSettingsElt.appendChild(divDeleteElt);

        // Création de la balise <p> class="deleteItem"
        let deleteItemElt = document.createElement("p");
        deleteItemElt.classList.add("deleteItem");
        deleteItemElt.innerText = "Supprimer";
        divDeleteElt.appendChild(deleteItemElt);
        deleteItemElt.addEventListener('click', () => removeItemFromCart(item));
        totalItemsInCart();
        totalCartPrice();
};

retrieveLocalStorageItems(); // On apelle la fonction

/**Utilisation de la méthode .forEach pour permettre d'exécuter
 * la fonction displayArticleElt sur chaque élément du tableau => chaque "item" de mon tableau "cart" */
 cart.forEach((item) => displayArticleElt(item));

//Evènement pour écouter la modification du champ email
inputMailElt.addEventListener('change', function() {
    validEmail(this);
});

/**
 * 
 * @param {*} inputEmail 
 */ 
const validEmail = function(inputEmail) {
    console.log(inputEmail)
    let emailRegExp = new RegExp("^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$")
    let testEmail = emailRegExp.test(inputEmail.value);
    console.log(testEmail)
    let small = inputEmail.nextElementSibling;

    if (testEmail) {
        small.innerHTML = 'Adresse valide !'
    }else{
        small.innerHTML = 'Adresse non valide !'
    }
}