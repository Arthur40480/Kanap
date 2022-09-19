//Création de l'array (tableau) qui représente le contenue du panier actuel
const cart = [];

//Création des constantes pour les données saisies dans le formulaire
const inputNameElt = document.getElementById("firstName");
const inputLastNameElt = document.getElementById("lastName");
const inputAdressElt = document.getElementById("address");
const inputCityElt = document.getElementById("city");
const inputMailElt = document.getElementById("email");
const btnOrderElt = document.querySelector('#order');
const sectionCartElt = document.getElementById("cart__items");

//Création des constantes pour les éléments du DOM qui vont accueillir les message d'erreur du formulaire
const errorFirstNameFormElt = document.getElementById("firstNameErrorMsg");
const errorLastNameFormElt = document.getElementById("lastNameErrorMsg");
const errorAddressFormElt = document.getElementById("addressErrorMsg");
const errorCityFormElt = document.getElementById("cityErrorMsg");
const errorEmailFormElt = document.getElementById("emailErrorMsg");

//Création des RegExp " Expression régulière " pour étudier les correspondances de texte des inputs du formulaire
let emailRegExp = new RegExp("^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$");
let addressRegExp = new RegExp("^[0-9]{1,3}(?:(?:[,. ]){1}[-a-zA-Zàâäéèêëïîôöùûüç]+)+");
let texteRegExp = new RegExp("^[a-zA-Z ,.'-]+$");

//Fonction pour la validation du champ prénom
function firstNameValid() {
    if(!texteRegExp.test(inputNameElt.value)) {
        errorFirstNameFormElt.innerHTML = "Prénom incorrect"
        return false
    }else {
        errorFirstNameFormElt.innerHTML = "Prénom correct"
        return true
    }
}

//Fonction pour la validation du champ prénom
function lastNameValid() {
    if(!texteRegExp.test(inputLastNameElt.value)) {
        errorLastNameFormElt.innerHTML = "Nom incorrect"
        return false
    }else {
        errorLastNameFormElt.innerHTML = "Nom correct"
        return true
    }
}

//Fonction pour la validation du champ prénom
function addressNameValid() {
    if(!addressRegExp.test(inputAdressElt.value)) {
        errorAddressFormElt.innerHTML = "Adresse incorrect"
        return false
    }else {
        errorAddressFormElt.innerHTML = "Adresse correct"
        return true
    }
}

//Fonction pour la validation du champ prénom
function cityValid() {
    if(!texteRegExp.test(inputCityElt.value)) {
        errorCityFormElt.innerHTML = "Nom de Ville incorrect"
        return false
    }else {
        errorCityFormElt.innerHTML = "Nom de Ville correct"
        return true
    }
}

//Fonction pour la validation du champ prénom
function emailValid() {
    if(!emailRegExp.test(inputMailElt.value)) {
        errorEmailFormElt.innerHTML = "Email incorrect"
        return false
    }else {
        errorEmailFormElt.innerHTML = "Email correct"
        return true
    }
}

//Fonction = Si le formulaire et correctement rempli, return true
function formValid() {
    if(
        firstNameValid()=== true &&
        lastNameValid()=== true &&
        addressNameValid()=== true &&
        cityValid() === true &&
        emailValid() === true
    ) {
        return true
    }
}

//Fonction permettant de récupérer l'ID des produits séléctionner
function getIdsFromCache() {
    const numberOfProducts = localStorage.length
    const idsOrder = []
    for (let i = 0; i < numberOfProducts; i++) {
      const key = localStorage.key(i)
      const id = key
      idsOrder.push(id)
    }
    return idsOrder
}

//Création de la fonction avec un objet qui contient les informations des clients
function makeBodyRequest() {
    const body = {
        contact:{
          firstName: inputNameElt.value,
          lastName: inputLastNameElt.value,
          address: inputAdressElt.value,
          city: inputCityElt.value,
          email: inputMailElt.value 
        },
        products: getIdsFromCache()
    };
    return body
}

//A l'aide de la méthode POST, on envoie les données du client et l'id des produits à l'API
function orderRequest() {
    const order = makeBodyRequest()
    fetch('http://localhost:3000/api/products/order', {
        method: "POST",
        body: JSON.stringify(order),
        headers: {
            "Content-Type": "application/json",
        }
    })
        .then((res) => res.json())
        .then((data) => {
            localStorage.clear()
            document.location.href = `confirmation.html?_id=${data.orderId}`
        })
    }

//Création de la fonction pour utiliser la méthode POST et envoyer les données des clients au serveur
function submitForm(e) {
    e.preventDefault()
    if(cart.length === 0) { 
        alert(" Veuillez remplir votre panier car celui-ci est vide !")
        return
    }else if(formValid()) {
    orderRequest();
    }
}

//Evénement sur la bouton "confirmer" du formulaire, au click, on apelle la fonction submitForm
btnOrderElt.addEventListener('click', (e) => submitForm(e))

// Fonction pour récupérer les items du localstorage pour les mettres dans le panier
function retrieveLocalStorageItems() {
    const numberOfItems = localStorage.length;
    for( x = 0; x < numberOfItems; x++)  {
        console.log(localStorage.key(x));
        const item = localStorage.getItem(localStorage.key(x))
        const itemObject = JSON.parse(item)
        cart.push(itemObject)
    }console.log(cart);
};

//Fonction pour calculer le nombre total d'article dans le panier
function totalItemsInCart() {
    let itemQuantity = 0
    const totalItemsInCartElt = document.getElementById("totalQuantity")
    
    /**.reduce fonction "accumulatrice" => pour traiter chaques valeurs d'une liste afin de le réduire à une seule.
    cart.reduce((previousValue, currentValue))*/ 
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
 * Fonction permettant la mise à jour du prix total et de la quantité total lors de l'evènement
 * @param {*string} id  => Ici on viens chercher l'id de l'item à qui l'on veut modifier la quantité
 * @param {*number.value} updateQuantity => Ici on viens récupérer la valeur de l'input "inputQuantityElt" qui est un nombre
 * @param {*object} item => Ici on récupère "item" qui est un objet avec toutes les données relative à l'article 
 */
 function updateQuantityAndPrice(id, updateQuantity, item) {
    const itemToUpdate = cart.find(item => item.id === id);
    itemToUpdate.quantity = Number(updateQuantity);
    item.quantity = itemToUpdate.quantity;
    const newItemToSave = JSON.stringify(item);
    const orderKey = `${item.id}-${item.color}`;
    localStorage.setItem(orderKey, newItemToSave);
    totalItemsInCart(); // => On rapelle les deux fonction pour pouvoir recalculer le prix et la quantité total lors de l'evènement
    totalCartPrice();
    };

/**
 * Fonction pour supprimer l'élément du LocalStorage ainsi que sont "article" dans le DOM
 * @param {object} item => Ici on récupère "item" qui est un objet avec toutes les données relative à l'article
 */
function removeItemFromDom(item) {
    const itemArticleToDeleteElt = document.querySelector(
        `article[data-id="${item.id}"][data-color="${item.color}"]`);
        console.log("Deleting article", itemArticleToDeleteElt);
        itemArticleToDeleteElt.remove();
        alert("Votre produit a bien été supprimé du panier !");
};

function removeItemFromLocalStorage(item) {
    const orderKey = `${item.id}-${item.color}`;
    localStorage.removeItem(orderKey);
}

/**
 * Fonction pour supprimer un élément du panier => cart[]
 * @param {*object} item => Ici on récupère "item" qui est un objet avec toutes les données relative à l'article
 */
function removeItemFromCart(item) {
    const itemToDelete = cart.find((product) => product.id === item.id && product.color === item.color)
    console.log(itemToDelete);
    /**Utilisation de la méthode ".splice( 0(indice à partir duquel commencer à changer le tableau), nbASupprimer, élem1 à ajouter, etc ...)"
     * Elle modifie le contenu d'un  tableau en retirant et/ou ajoutant de nouveaux éléments. */
    const itemToDeleteFromCart = cart.splice(itemToDelete, 1)
    totalCartPrice(); // => On rapelle les deux fonction pour pouvoir recalculer le prix et la quantité total lors de l'evènement
    totalItemsInCart();
    removeItemFromLocalStorage(item);
    removeItemFromDom(item);
};

/**
 * Fonction afficher les éléments de chaques article dans le panier
 * @param {*object} item => Ici on récupère "item" qui est un objet avec toutes les données relative à l'article 
 */
 function makeDivDescriptionElt(item) {
    const divElt = document.createElement("div");
    divElt.classList.add("cart__item__content__description");
  
    const titleElt = document.createElement("h2");
    titleElt.innerText = item.name;
    const colorElt = document.createElement("p");
    colorElt.innerText = item.color;
    const priceElt = document.createElement("p");
    priceElt.innerText = item.price + " €";
  
    divElt.appendChild(titleElt);
    divElt.appendChild(colorElt);
    divElt.appendChild(priceElt);
    return divElt
  };
  
/**
   * Fonction pour créer l'article dans le DOM
   * @param {*object} item => Ici on récupère "item" qui est un objet avec toutes les données relative à l'article 
   */
  function makeArticleElt(item) {
    const article = document.createElement("article");
    article.classList.add("cart__item");
    article.dataset.id = item.id;
    article.dataset.color = item.color;
    return article
  };
  
/**
   * Fonction pour créer la div class"cart__item__img" dans le DOM
   * @param {*object} item => Ici on récupère "item" qui est un objet avec toutes les données relative à l'article 
   */
  function makeDivImgElt(item) {
    const divElt = document.createElement("div");
    divElt.classList.add("cart__item__img");
    const imgElt = document.createElement("img");
    imgElt.src = item.imageUrl;
    imgElt.alt = item.altTxt;
    divElt.appendChild(imgElt);
    return divElt
  };

/**
 * Fonction afficher les éléments de chaques article dans le panier
 * @param {*object} item => Ici on récupère "item" qui est un objet avec toutes les données relative à l'article 
 */
function makeDivDeleteElt(divSettingsElt, item) {
    const divDeleteElt = document.createElement("div");
    divDeleteElt.classList.add("cart__item__content__settings__delete");
  
    const deleteItemElt = document.createElement("p");
    deleteItemElt.classList.add("deleteItem");
    deleteItemElt.innerText = "Supprimer";
    deleteItemElt.addEventListener('click', () => removeItemFromCart(item));
    
    divDeleteElt.appendChild(deleteItemElt);
    divSettingsElt.appendChild(divDeleteElt);
  };
  
/**
   * Fonction afficher les éléments de chaques article dans le panier
   * @param {*object} item => Ici on récupère "item" qui est un objet avec toutes les données relative à l'article 
   */
  function makeDivQuantityElt(divSettingsElt, item) {
    const divQuantityElt = document.createElement("div");
    divQuantityElt.classList.add("cart__item__content__settings__quantity");
  
    const quantityElt = document.createElement("p");
    quantityElt.innerText = "Qté : ";
  
    const inputQuantityElt = document.createElement("input");
    inputQuantityElt.classList.add("itemQuantity");
    inputQuantityElt.type = "number";
    inputQuantityElt.name = "itemQuantity";
    inputQuantityElt.min = 1;
    inputQuantityElt.max = 100;
    inputQuantityElt.value = Number(item.quantity);
    inputQuantityElt.addEventListener('input', () => updateQuantityAndPrice(item.id, inputQuantityElt.value, item));
    
    divQuantityElt.appendChild(quantityElt);
    divQuantityElt.appendChild(inputQuantityElt);
    divSettingsElt.appendChild(divQuantityElt);
  }
  
/**
 * Fonction afficher les éléments de chaques article dans le panier
 * @param {*object} item => Ici on récupère "item" qui est un objet avec toutes les données relative à l'article 
 */
function displayArticleElt(item) {

  const articleElt = makeArticleElt(item);
  sectionCartElt.appendChild(articleElt);

  const divImageElt = makeDivImgElt(item);
  articleElt.appendChild(divImageElt);

  const divContentElt = makeDivContentElt(item); 
  articleElt.appendChild(divContentElt);

  totalItemsInCart();
  totalCartPrice();
};

/**
 * Fonction afficher les éléments de chaques article dans le panier
 * @param {*object} item => Ici on récupère "item" qui est un objet avec toutes les données relative à l'article 
 */
function makeDivContentElt(item) {
  const divContentElt = document.createElement("div");
  divContentElt.classList.add("cart__item__content");
  const divDescriptionElt = makeDivDescriptionElt(item);
  const divSettingsElt = makeDivSettingsElt(item);

  divContentElt.appendChild(divDescriptionElt);
  divContentElt.appendChild(divSettingsElt);
  return divContentElt
};

/**
 * Fonction afficher les éléments de chaques article dans le panier
 * @param {*object} item => Ici on récupère "item" qui est un objet avec toutes les données relative à l'article 
 */
function makeDivSettingsElt(item) {
  const divSettingsElt = document.createElement("div");
  divSettingsElt.classList.add("cart__item__content__settings");

  makeDivQuantityElt(divSettingsElt, item);
  makeDivDeleteElt(divSettingsElt, item);
  return divSettingsElt
};

retrieveLocalStorageItems(); // On apelle la fonction

/**Utilisation de la méthode .forEach pour permettre d'exécuter
 * la fonction displayArticleElt sur chaque élément du tableau => chaque "item" de mon tableau "cart" */
 cart.forEach((item) => displayArticleElt(item));