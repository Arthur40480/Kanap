//Création de l'array (tableau) qui représente le contenue du panier actuel NUMBER_OF_ITEMS
const cart = [];

//Création des constantes pour les données saisies dans le formulaire
const INPUT_NAME_ELT = document.getElementById("firstName");
const INPUT_LAST_NAME_ELT = document.getElementById("lastName");
const INPUT_ADRESS_ELT = document.getElementById("address");
const INPUT_CITY_ELT = document.getElementById("city");
const INPUT_MAIL_ELT = document.getElementById("email");
const BTN_ORDER_ELT = document.querySelector('#order');
const SECTION_CART_ELT = document.getElementById("cart__items");

//Création des constantes pour les éléments du DOM qui vont accueillir les message d'erreur du formulaire
const ERROR_FIRST_NAME_FORM_ELT = document.getElementById("firstNameErrorMsg");
const ERROR_LAST_NAME_FORM_ELT = document.getElementById("lastNameErrorMsg");
const ERROR_ADDRESS_FORM_ELT = document.getElementById("addressErrorMsg");
const ERROR_CITY_FORM_ELT = document.getElementById("cityErrorMsg");
const ERROR_MAIL_FORM_ELT = document.getElementById("emailErrorMsg");

//Création des RegExp " Expression régulière " pour étudier les correspondances de texte des inputs du formulaire
let emailRegExp = new RegExp("^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$");
let addressRegExp = new RegExp("^[0-9]{1,3}(?:(?:[,. ]){1}[-a-zA-Zàâäéèêëïîôöùûüç]+)+");
let texteRegExp = new RegExp("^[a-zA-Z ,.'-]+$");

// Fonction pour récupérer les items du localstorage pour les mettres dans le panier
function retrieveLocalStorageItems() {
    const NUMBER_OF_ITEMS = localStorage.length;
    for( x = 0; x < NUMBER_OF_ITEMS; x++)  {
        const ITEM = localStorage.getItem(localStorage.key(x))
        const item_object = JSON.parse(ITEM)
        console.log(item_object)
        cart.push(item_object)
        console.log(cart)
    }console.log(cart);
};

//Fonction permettant de récupérer l'ID des produits séléctionner
function getIdsFromCache() {
    const NUMBER_OF_PRODUCTS = localStorage.length
    const idsOrder = []
    for (let i = 0; i < NUMBER_OF_PRODUCTS; i++) {
      const KEY = localStorage.key(i)
      const ID = KEY.split("-")[0]
      idsOrder.push(ID);
    }
    return idsOrder
};

//Fonction pour la validation du champ prénom
function firstNameValid() {
    if(!texteRegExp.test(INPUT_NAME_ELT.value)) {
        ERROR_FIRST_NAME_FORM_ELT.innerHTML = "Prénom incorrect"
        return false
    }else {
        ERROR_FIRST_NAME_FORM_ELT.innerHTML = "Prénom correct"
        return true
    }
};

//Fonction pour la validation du champ prénom
function lastNameValid() {
    if(!texteRegExp.test(INPUT_LAST_NAME_ELT.value)) {
        ERROR_LAST_NAME_FORM_ELT.innerHTML = "Nom incorrect"
        return false
    }else {
        ERROR_LAST_NAME_FORM_ELT.innerHTML = "Nom correct"
        return true
    }
};

//Fonction pour la validation du champ prénom
function addressNameValid() {
    if(!addressRegExp.test(INPUT_ADRESS_ELT.value)) {
        ERROR_ADDRESS_FORM_ELT.innerHTML = "Adresse incorrect"
        return false
    }else {
        ERROR_ADDRESS_FORM_ELT.innerHTML = "Adresse correct"
        return true
    }
};

//Fonction pour la validation du champ prénom
function cityValid() {
    if(!texteRegExp.test(INPUT_CITY_ELT.value)) {
        ERROR_CITY_FORM_ELT.innerHTML = "Nom de Ville incorrect"
        return false
    }else {
        ERROR_CITY_FORM_ELT.innerHTML = "Nom de Ville correct"
        return true
    }
};

//Fonction pour la validation du champ prénom
function emailValid() {
    if(!emailRegExp.test(INPUT_MAIL_ELT.value)) {
        ERROR_MAIL_FORM_ELT.innerHTML = "Email incorrect"
        return false
    }else {
        ERROR_MAIL_FORM_ELT.innerHTML = "Email correct"
        return true
    }
};

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
};

//Création de la fonction avec un objet qui contient les informations des clients
function makeBodyRequest() {
    const BODY = {
        contact:{
          firstName: INPUT_NAME_ELT.value,
          lastName: INPUT_LAST_NAME_ELT.value,
          address: INPUT_ADRESS_ELT.value,
          city: INPUT_CITY_ELT.value,
          email: INPUT_MAIL_ELT.value 
        },
        products: getIdsFromCache()
    };
    return BODY
};

//A l'aide de la méthode POST, on envoie les données du client et l'id des produits à l'API
function orderRequest() {
    const ORDER = makeBodyRequest()
    fetch('http://localhost:3000/api/products/order', {
        method: "POST",
        body: JSON.stringify(ORDER),
        headers: {
            "Content-Type": "application/json",
        }
    })
        .then((res) => res.json())
        .then((data) => {
            localStorage.clear()
            document.location.href = `confirmation.html?_id=${data.orderId}`
        })
    };

//Création de la fonction pour utiliser la méthode POST et envoyer les données des clients au serveur
function submitForm(e) {
    e.preventDefault()
    if(cart.length === 0) { 
        alert(" Veuillez remplir votre panier car celui-ci est vide !")
        return
    }else if(formValid()) {
    orderRequest();
    }
};

//Evénement sur la bouton "confirmer" du formulaire, au click, on apelle la fonction submitForm
BTN_ORDER_ELT.addEventListener('click', (e) => submitForm(e))

//Fonction pour calculer le nombre total d'article dans le panier
function totalItemsInCart() {
    let itemQuantity = 0
    const TOTAL_ITEMS_IN_CART_ELT = document.getElementById("totalQuantity")
    
    /**.reduce fonction "accumulatrice" => pour traiter chaques valeurs d'une liste afin de le réduire à une seule.
    cart.reduce((previousValue, currentValue))*/ 
    const TOTAL_QUANTITY = cart.reduce((total, item) => total + item.quantity, itemQuantity)
    TOTAL_ITEMS_IN_CART_ELT.textContent = TOTAL_QUANTITY   
};

//Fonction pour calculer le prix total du panier
function totalCartPrice() {
    let total = 0
    const TOTAL_PRICE_ELT = document.getElementById("totalPrice");
    cart.forEach((item) => {        //Fonction pour chaques objet d'un tableau
        const ITEM_PRICE = item.price * item.quantity
        total += ITEM_PRICE
    })
    TOTAL_PRICE_ELT.innerText = Number(total)
};

/**
 * Fonction permettant la mise à jour du prix total et de la quantité total lors de l'evènement
 * @param {string} id  => Ici on viens chercher l'id de l'item à qui l'on veut modifier la quantité
 * @param {number} updateQuantity => Ici on viens récupérer la valeur de l'input "inputQuantityElt" qui est un nombre
 * @param {object} item => Ici on récupère "item" qui est un objet avec toutes les données relative à l'article 
 */
 function updateQuantityAndPrice(id, updateQuantity, item) {
    const ITEM_TO_UPDATE = cart.find(item => item.id === id);
    ITEM_TO_UPDATE.quantity = Number(updateQuantity);
    item.quantity = ITEM_TO_UPDATE.quantity;
    const NEW_ITEM_TO_SAVE = JSON.stringify(item);
    const ORDER_KEY = `${item.id}-${item.color}`;
    localStorage.setItem(ORDER_KEY, NEW_ITEM_TO_SAVE);
    totalItemsInCart(); // => On rapelle les deux fonction pour pouvoir recalculer le prix et la quantité total lors de l'evènement
    totalCartPrice();
    };

/**
 * Fonction pour supprimer l' "article" de l'élément supprimer dans le DOM
 * @param {object} item => Ici on récupère "item" qui est un objet avec toutes les données relative à l'article
 */
function removeArticleFromDom(item) {
    const ITEM_ARTICLE_TO_DELETE_ELT = document.querySelector(
        `article[data-id="${item.id}"][data-color="${item.color}"]`);
        console.log("Deleting article", ITEM_ARTICLE_TO_DELETE_ELT);
        ITEM_ARTICLE_TO_DELETE_ELT.remove();
        alert("Votre produit a bien été supprimé du panier !");
};

/**
 * Fonction pour supprimer l'élément du LocalStorage 
 * @param {object} item => Ici on récupère "item" qui est un objet avec toutes les données relative à l'article
 */
function removeItemFromLocalStorage(item) {
    const ORDER_KEY = `${item.id}-${item.color}`;
    localStorage.removeItem(ORDER_KEY);
};

/**
 * Fonction pour supprimer un élément du panier => cart[]
 * @param {object} item => Ici on récupère "item" qui est un objet avec toutes les données relative à l'article
 */
function removeItemFromCart(item) {
    const ITEM_TO_DELETE = cart.find((product) => product.id === item.id && product.color === item.color)
    /**Utilisation de la méthode ".splice( 0(indice à partir duquel commencer à changer le tableau), nbASupprimer, élem1 à ajouter, etc ...)"
     * Elle modifie le contenu d'un  tableau en retirant et/ou ajoutant de nouveaux éléments. */
    const ITEM_TO_DELETE_FROM_CART = cart.splice(ITEM_TO_DELETE, 1)
    totalCartPrice(); // => On rapelle les deux fonction pour pouvoir recalculer le prix et la quantité total lors de l'evènement
    totalItemsInCart();
    removeItemFromLocalStorage(item);
    removeArticleFromDom(item);
};

/**
 * Fonction afficher les éléments de chaques article dans le panier
 * @param {object} item => Ici on récupère "item" qui est un objet avec toutes les données relative à l'article 
 */
 function makeDivDescriptionElt(item) {
    const DIV_ELT = document.createElement("div");
    DIV_ELT.classList.add("cart__item__content__description");
  
    const TITLE_ELT = document.createElement("h2");
    TITLE_ELT.innerText = item.name;
    const COLOR_ELT = document.createElement("p");
    COLOR_ELT.innerText = item.color;
    const PRICE_ELT = document.createElement("p");
    PRICE_ELT.innerText = item.price + " €";
  
    DIV_ELT.appendChild(TITLE_ELT);
    DIV_ELT.appendChild(COLOR_ELT);
    DIV_ELT.appendChild(PRICE_ELT);
    return DIV_ELT
  };
  
/**
   * Fonction pour créer l'article dans le DOM
   * @param {object} item => Ici on récupère "item" qui est un objet avec toutes les données relative à l'article 
   */
  function makeArticleElt(item) {
    const ARTICLE = document.createElement("article");
    ARTICLE.classList.add("cart__item");
    ARTICLE.dataset.id = item.id;
    ARTICLE.dataset.color = item.color;
    return ARTICLE
  };
  
/**
   * Fonction pour créer la div class"cart__item__img" dans le DOM
   * @param {object} item => Ici on récupère "item" qui est un objet avec toutes les données relative à l'article 
   */
  function makeDivImgElt(item) {
    const DIV_ELT = document.createElement("div");
    DIV_ELT.classList.add("cart__item__img");
    const IMG_ELT = document.createElement("img");
    IMG_ELT.src = item.imageUrl;
    IMG_ELT.alt = item.altTxt;
    DIV_ELT.appendChild(IMG_ELT);
    return DIV_ELT
  };

/**
 * Fonction afficher les éléments de chaques article dans le panier
 * @param {object} item => Ici on récupère "item" qui est un objet avec toutes les données relative à l'article 
 */
function makeDivDeleteElt(DIV_SETTINGS_ELT, item) {
    const DIV_DELETE_ELT = document.createElement("div");
    DIV_DELETE_ELT.classList.add("cart__item__content__settings__delete");
  
    const DELETE_ITEM_ELT = document.createElement("p");
    DELETE_ITEM_ELT.classList.add("deleteItem");
    DELETE_ITEM_ELT.innerText = "Supprimer";
    DELETE_ITEM_ELT.addEventListener('click', () => removeItemFromCart(item));
    
    DIV_DELETE_ELT.appendChild(DELETE_ITEM_ELT);
    DIV_SETTINGS_ELT.appendChild(DIV_DELETE_ELT);
  };
  
/**
   * Fonction afficher les éléments de chaques article dans le panier
   * @param {object} item => Ici on récupère "item" qui est un objet avec toutes les données relative à l'article 
   */
  function makeDivQuantityElt(DIV_SETTINGS_ELT, item) {
    const DELETE_ITEM_ELT = document.createElement("div");
    DELETE_ITEM_ELT.classList.add("cart__item__content__settings__quantity");
  
    const QUANTITY_ELT = document.createElement("p");
    QUANTITY_ELT.innerText = "Qté : ";
  
    const INPUT_QUANTITY_ELT = document.createElement("input");
    INPUT_QUANTITY_ELT.classList.add("itemQuantity");
    INPUT_QUANTITY_ELT.type = "number";
    INPUT_QUANTITY_ELT.name = "itemQuantity";
    INPUT_QUANTITY_ELT.min = 1;
    INPUT_QUANTITY_ELT.max = 100;
    INPUT_QUANTITY_ELT.value = Number(item.quantity);
    INPUT_QUANTITY_ELT.addEventListener('input', () => updateQuantityAndPrice(item.id, INPUT_QUANTITY_ELT.value, item));
    
    DELETE_ITEM_ELT.appendChild(QUANTITY_ELT);
    DELETE_ITEM_ELT.appendChild(INPUT_QUANTITY_ELT);
    DIV_SETTINGS_ELT.appendChild(DELETE_ITEM_ELT);
  };
  
/**
 * Fonction afficher les éléments de chaques article dans le panier
 * @param {object} item => Ici on récupère "item" qui est un objet avec toutes les données relative à l'article 
 */
function makeDivSettingsElt(item) {
    const DIV_SETTINGS_ELT = document.createElement("div");
    DIV_SETTINGS_ELT.classList.add("cart__item__content__settings");

    makeDivQuantityElt(DIV_SETTINGS_ELT, item);
    makeDivDeleteElt(DIV_SETTINGS_ELT, item);
    return DIV_SETTINGS_ELT
};

/**
 * Fonction afficher les éléments de chaques article dans le panier
 * @param {object} item => Ici on récupère "item" qui est un objet avec toutes les données relative à l'article 
 */
function makeDivContentElt(item) {
    const DIV_CONTENT_ELT = document.createElement("div");
    DIV_CONTENT_ELT.classList.add("cart__item__content");
    const DIV_DESCRIPTION_ELT = makeDivDescriptionElt(item);
    const DIV_SETTINGS_ELT = makeDivSettingsElt(item);
  
    DIV_CONTENT_ELT.appendChild(DIV_DESCRIPTION_ELT );
    DIV_CONTENT_ELT.appendChild(DIV_SETTINGS_ELT);
    return DIV_CONTENT_ELT
};

/**
 * Fonction afficher les éléments de chaques article dans le panier
 * @param {object} item => Ici on récupère "item" qui est un objet avec toutes les données relative à l'article 
 */
function displayArticleElt(item) {

  const ARTICLE_ELT = makeArticleElt(item);
  SECTION_CART_ELT.appendChild(ARTICLE_ELT);

  const DIV_IMAGE_ELT = makeDivImgElt(item);
  ARTICLE_ELT.appendChild(DIV_IMAGE_ELT);

  const DIV_CONTENT_ELT = makeDivContentElt(item); 
  ARTICLE_ELT.appendChild(DIV_CONTENT_ELT);

  totalItemsInCart();
  totalCartPrice();
};

/**Fonction utilisant la méthode .forEach pour permettre d'exécuter
 * la fonction displayArticleElt sur chaque élément du tableau => chaque "item" de mon tableau "cart" (panier) */
function displayArticleEltForEachItemInCart() {
    cart.forEach((item) => displayArticleElt(item));
}

retrieveLocalStorageItems(); 

displayArticleEltForEachItemInCart();