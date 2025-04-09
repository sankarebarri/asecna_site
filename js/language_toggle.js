document.addEventListener("DOMContentLoaded", () => {
  const languageSelector = document.getElementById("languageSelector");
  const languageOptions = document.querySelectorAll(".lang-option");
  const translatableElements = document.querySelectorAll(
    "[data-translate-key]"
  );
  const htmlTag = document.documentElement; // Get the <html> tag

  const defaultLanguage = "en"; // Set your default language
  let currentTranslations = {}; // To hold the loaded translations

  // Function to fetch translation file
  async function fetchTranslations(lang) {
    try {
      // Add cache-busting query parameter for development/testing
      const cacheBuster = Date.now();
      const response = await fetch(`locales/${lang}.json?v=${cacheBuster}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Could not load ${lang}.json:`, error);
      return null; // Return null if fetch fails
    }
  }

  // Function to apply translations to the page
  function applyTranslations() {
    if (!currentTranslations) return; // Don't apply if loading failed

    translatableElements.forEach((element) => {
      const key = element.dataset.translateKey;
      let translation = currentTranslations[key];

      if (translation !== undefined && translation !== null) {
        // Check if key exists
        // Handle dynamic year in copyright
        if (key === "footerCopyright") {
          translation = translation.replace("{year}", new Date().getFullYear());
        }

        // Use innerHTML for keys explicitly known to contain HTML
        // This list should be maintained carefully.
        const keysWithHtml = ["introText"];
        if (keysWithHtml.includes(key)) {
          element.innerHTML = translation;
        } else {
          // Use textContent for all other elements for safety and performance
          element.textContent = translation;
        }
      }
      // Optional: Log missing keys during development
      // else if (key) { console.warn(`Translation key not found: ${key}`); }
    });

    // Update the language selector display text
    if (languageSelector && currentTranslations["langSelector"]) {
      languageSelector.querySelector("span").textContent =
        currentTranslations["langSelector"];
    }

    // Update the HTML lang attribute
    const currentLang =
      localStorage.getItem("selectedLanguage") || defaultLanguage;
    htmlTag.setAttribute("lang", currentLang);
  }

  // Function to set the language
  async function setLanguage(lang) {
    if (!["en", "fr"].includes(lang)) {
      console.warn(
        `Unsupported language selected: ${lang}. Defaulting to ${defaultLanguage}.`
      );
      lang = defaultLanguage;
    }

    currentTranslations = await fetchTranslations(lang);
    if (currentTranslations) {
      // Only proceed if translations loaded successfully
      localStorage.setItem("selectedLanguage", lang);
      applyTranslations();
    } else {
      // Attempt to load default language if preferred one failed
      if (lang !== defaultLanguage) {
        console.warn(
          `Failed to load ${lang}, attempting to load default ${defaultLanguage}.`
        );
        currentTranslations = await fetchTranslations(defaultLanguage);
        if (currentTranslations) {
          localStorage.setItem("selectedLanguage", defaultLanguage); // Update storage
          applyTranslations();
        } else {
          console.error(
            `Failed to load default language ${defaultLanguage} as well.`
          );
          // Handle failure - e.g., show an error message to the user
        }
      } else {
        console.error(
          `Failed to load the default language ${defaultLanguage}.`
        );
        // Handle critical failure
      }
    }
  }

  // Add event listeners to language options
  languageOptions.forEach((option) => {
    option.addEventListener("click", (event) => {
      event.preventDefault(); // Prevent default link behavior
      const selectedLang = event.target.dataset.lang;
      if (selectedLang) {
        setLanguage(selectedLang);
      }
    });
  });

  // Initial load: Check local storage or use default
  const preferredLanguage = localStorage.getItem("selectedLanguage");
  setLanguage(preferredLanguage || defaultLanguage);
}); // End DOMContentLoaded
