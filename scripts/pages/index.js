async function getPhotographers() {
  try {
    const response = await fetch("data/photographers.json");
    const data = await response.json();
    return data.photographers;
  } catch (error) {
    console.error("Erreur lors de la récupération des photographes:", error);
    return [];
  }
}

async function displayData(photographers) {
  const photographersSection = document.querySelector(".photographer_section");

  photographers.forEach((photographer) => {
    const photographerModel = photographerTemplate(photographer);
    const userCardDOM = photographerModel.getUserCardDOM();
    photographersSection.appendChild(userCardDOM);
  });
}

async function init() {
  // Récupère les photographes
  const photographers = await getPhotographers();
  // Affiche les photographes
  displayData(photographers);
}

init();
