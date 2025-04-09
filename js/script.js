document.addEventListener("DOMContentLoaded", () => {
  let translations = {};

  // Fetch the languages.json file
  fetch("languages.json")
    .then((response) => {
      console.log("Languages response status:", response.status);
      return response.json();
    })
    .then((data) => {
      translations = data;
      console.log("Translations loaded:", translations);
      // Set default language to English
      updateLanguage("en");
    })
    .catch((error) => console.error("Error loading languages:", error));

  // Listen for language toggle changes
  document.getElementById("languageToggle").addEventListener("change", (e) => {
    console.log("Language toggle changed to:", e.target.value);
    updateLanguage(e.target.value);
  });

  // Function to update text based on selected language
  function updateLanguage(lang) {
    const translation = translations[lang];
    console.log("Updating language to:", lang, translation);
    if (!translation) {
      console.warn("Translation not available for:", lang);
      return;
    }

    // Update navigation text
    document.getElementById("nav-home").textContent = translation.nav.home;
    document.getElementById("nav-about").textContent = translation.nav.about;
    document.getElementById("nav-director").textContent =
      translation.nav.director;
    document.getElementById("nav-services").textContent =
      translation.nav.services;
    document.getElementById("nav-memberStates").textContent =
      translation.nav.memberStates;
    document.getElementById("nav-careers").textContent =
      translation.nav.careers;
    document.getElementById("nav-publications").textContent =
      translation.nav.publications;
    document.getElementById("nav-contact").textContent =
      translation.nav.contact;

    // Update hero texts
    document.getElementById("hero-title").textContent = translation.hero.title;
    document.getElementById("hero-subtitle").textContent =
      translation.hero.subtitle;

    // Update footer text
    document.getElementById("footer-rights").textContent =
      translation.footer.rights;
    document.getElementById("footer-contact").textContent =
      translation.footer.contact;
  }
});
