function photographerTemplate(data) {
  const { name, id, city, country, tagline, price, portrait } = data;

  // Utiliser le portrait du JSON qui contient le nom exact du fichier
  const picture = `assets/portrait/${portrait}`;

  function getUserCardDOM() {
    const article = document.createElement("article");

    const link = document.createElement("a");
    link.setAttribute("href", `photographer.html?id=${id}`);
    link.setAttribute("aria-label", `${name}`);

    const img = document.createElement("img");
    img.setAttribute("src", picture);
    img.setAttribute("alt", `Portrait de ${name}`);

    const h2 = document.createElement("h2");
    h2.textContent = name;

    const location = document.createElement("p");
    location.textContent = `${city}, ${country}`;
    location.className = "location";

    const taglineElement = document.createElement("p");
    taglineElement.textContent = tagline;
    taglineElement.className = "tagline";

    const priceElement = document.createElement("p");
    priceElement.textContent = `${price}€/jour`;
    priceElement.className = "price";

    link.appendChild(img);
    link.appendChild(h2);
    article.appendChild(link);
    article.appendChild(location);
    article.appendChild(taglineElement);
    article.appendChild(priceElement);

    return article;
  }
  return { getUserCardDOM };
}
