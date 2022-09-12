//Fonction pour récupérer et afficher le numéro de commande
function getIdCommand() {
    const urlParams = new URLSearchParams(window.location.search);
    orderId.innerText = urlParams.get("_id");
  }
  getIdCommand();