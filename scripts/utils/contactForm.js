function displayModal() {
  const modal = document.getElementById("contact_modal");
  modal.style.display = "block";

  // Mettre à jour le titre avec le nom du photographe
  const modalTitle = modal.querySelector("h2");
  const photographerName = document.querySelector(".photographer-name").textContent;
  modalTitle.textContent = `Contactez-moi ${photographerName}`;

  // Focus sur le premier champ
  modal.querySelector("input").focus();
}

function closeModal() {
  const modal = document.getElementById("contact_modal");
  modal.style.display = "none";
}

// Gestion du formulaire
document.getElementById("contact-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const formData = {
    firstname: document.getElementById("firstname").value,
    lastname: document.getElementById("lastname").value,
    email: document.getElementById("email").value,
    message: document.getElementById("message").value,
  };

  // Log des données du formulaire (à remplacer par l'envoi à une API)
  console.log("Données du formulaire:", formData);

  // Réinitialisation du formulaire et fermeture de la modal
  e.target.reset();
  closeModal();
});
