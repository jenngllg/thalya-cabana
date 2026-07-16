(function () {
  "use strict";

  const I18N = window.ThalyaI18n;
  const MENU = window.ThalyaMenu || [];
  const STORAGE_KEY = "thalya-cabana-language";
  const WIDE_SCREEN = window.matchMedia("(min-width: 760px)");
  const REDUCED_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)");
  const LUCIDE_ICON_MAP = {
    sandwich: "sandwich",
    bowl: "soup",
    toast: "hamburger",
    wrap: "wheat",
    panini: "sandwich",
    salad: "salad",
    fries: "carrot",
    plus: "circle-plus",
    dessert: "cake-slice",
    topping: "ice-cream-bowl",
    "hot-drink": "coffee",
    "cold-drink": "cup-soda",
    breakfast: "croissant"
  };
  const CATEGORY_ORDER = [
    "sandwichs-froids",
    "sandwichs-chauds",
    "panini",
    "wraps",
    "bowls",
    "salades",
    "frites",
    "toppings-sales",
    "desserts",
    "toppings-sucres",
    "boissons-chaudes",
    "boissons-froides",
    "petits-dejeuners"
  ];
  const WIDE_CATEGORY_GROUPS = [
    {
      name: "savoury",
      columns: [
        ["sandwichs-froids", "sandwichs-chauds", "panini", "frites"],
        ["wraps", "bowls", "salades", "toppings-sales"]
      ]
    },
    {
      name: "sweet",
      columns: [["desserts"], ["toppings-sucres"]]
    },
    {
      name: "drinks-and-breakfast",
      columns: [["boissons-chaudes", "petits-dejeuners"], ["boissons-froides"]]
    }
  ];
  const ORDERED_MENU = CATEGORY_ORDER
    .map((categoryId) => MENU.find((category) => category.id === categoryId))
    .filter(Boolean);
  const allowedLanguages = I18N.locales.map((locale) => locale.code);
  let language = getSavedLanguage();
  let categoryObserver = null;

  function getSavedLanguage() {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      return allowedLanguages.includes(saved) ? saved : "fr";
    } catch (_error) {
      return "fr";
    }
  }

  function saveLanguage(value) {
    try {
      window.localStorage.setItem(STORAGE_KEY, value);
    } catch (_error) {
      /* The menu still works when storage is unavailable. */
    }
  }

  function text(key) {
    return (I18N.ui[language] && I18N.ui[language][key]) || I18N.ui.fr[key] || key;
  }

  function interpolate(value, variables) {
    return Object.keys(variables || {}).reduce(
      (result, key) => result.replace(`{${key}}`, variables[key]),
      value
    );
  }

  function categoryTitle(category) {
    return I18N.fromArray(I18N.categories[category.titleKey], language);
  }

  function term(key) {
    return I18N.fromArray(I18N.terms[key], language);
  }

  function itemName(menuItem) {
    return menuItem.nameKey ? term(menuItem.nameKey) : menuItem.name;
  }

  function formatPrice(cents) {
    const locale = I18N.locales.find((candidate) => candidate.code === language);
    return new Intl.NumberFormat(locale.intl, { style: "currency", currency: "EUR" }).format(cents / 100);
  }

  function lucideIcon(name) {
    const fileName = LUCIDE_ICON_MAP[name] || "sandwich";
    return `<span class="section-icon lucide-icon" style="--lucide-icon: url('lucide/${fileName}.svg')" aria-hidden="true"></span>`;
  }

  function translateStaticPage() {
    document.documentElement.lang = language;
    document.querySelectorAll("[data-i18n]").forEach((element) => {
      element.textContent = text(element.dataset.i18n);
    });
    document.querySelectorAll("[data-i18n-aria]").forEach((element) => {
      element.setAttribute("aria-label", text(element.dataset.i18nAria));
    });
  }

  function renderLanguageSwitcher() {
    document.querySelectorAll("[data-language-switcher]").forEach((container) => {
      container.innerHTML = "";
      I18N.locales.forEach((locale) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "language-button";
        button.dataset.language = locale.code;
        button.setAttribute("aria-pressed", String(language === locale.code));
        button.setAttribute("aria-label", interpolate(text("currentLanguage"), { language: locale.label }));
        button.title = locale.label;
        button.innerHTML = `<img src="${locale.flag}" alt="" width="30" height="20">`;
        button.addEventListener("click", () => setLanguage(locale.code));
        container.appendChild(button);
      });
    });
  }

  function createMenuItem(menuItem) {
    const article = document.createElement("article");
    article.className = "menu-item";
    const separator = menuItem.join === "plus" ? " + " : " · ";
    const details = menuItem.details.map(term).join(separator);
    article.innerHTML = `
      <div class="item-main">
        <span class="item-name">${itemName(menuItem)}</span>
        <span class="item-price">${formatPrice(menuItem.price)}</span>
      </div>
      ${details ? `<p class="item-details">${details}</p>` : ""}
    `;
    return article;
  }

  function createCategoryContent(category) {
    const content = document.createElement("div");
    content.className = "accordion-content";
    category.items.forEach((menuItem) => content.appendChild(createMenuItem(menuItem)));
    return content;
  }

  function setActiveCategory(categoryId) {
    document.querySelectorAll(".bistrot-category-tab").forEach((tab) => {
      if (tab.getAttribute("href") === `#${categoryId}`) {
        tab.setAttribute("aria-current", "true");
        tab.scrollIntoView({ behavior: "auto", block: "nearest", inline: "center" });
      } else {
        tab.removeAttribute("aria-current");
      }
    });
  }

  function setUpCategoryScrollSpy() {
    if (categoryObserver) categoryObserver.disconnect();
    if (WIDE_SCREEN.matches || !("IntersectionObserver" in window)) return;
    categoryObserver = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (visible) setActiveCategory(visible.target.id);
    }, { rootMargin: "-76px 0px -64%", threshold: 0 });
    document.querySelectorAll(".menu-accordion").forEach((section) => categoryObserver.observe(section));
  }

  function renderMenu() {
    const root = document.querySelector("[data-menu-root]");
    const tabs = document.querySelector("[data-bistrot-category-tabs]");
    if (!root) return;

    root.innerHTML = "";
    if (tabs) tabs.innerHTML = "";
    const isWide = WIDE_SCREEN.matches;
    const wideGroupContainers = new Map();

    if (isWide) {
      WIDE_CATEGORY_GROUPS.forEach((group) => {
        const container = document.createElement("div");
        container.className = "menu-category-group";
        container.dataset.categoryGroup = group.name;
        root.appendChild(container);
        group.columns.forEach((categoryIds) => {
          const column = document.createElement("div");
          column.className = "menu-category-column";
          container.appendChild(column);
          categoryIds.forEach((categoryId) => wideGroupContainers.set(categoryId, column));
        });
      });
    }

    ORDERED_MENU.forEach((category, index) => {
      const importantNote = category.subtitleKey
        ? `<span class="bistrot-important-note">${text(category.subtitleKey)}</span>`
        : "";

      if (tabs) {
        const tab = document.createElement("a");
        tab.className = "bistrot-category-tab";
        tab.href = `#${category.id}`;
        tab.textContent = categoryTitle(category);
        if (index === 0) tab.setAttribute("aria-current", "true");
        tab.addEventListener("click", (event) => {
          if (WIDE_SCREEN.matches) return;
          event.preventDefault();
          const target = document.getElementById(category.id);
          if (!target) return;
          target.open = true;
          setActiveCategory(category.id);
          window.requestAnimationFrame(() => target.scrollIntoView({
            behavior: REDUCED_MOTION.matches ? "auto" : "smooth",
            block: "start"
          }));
        });
        tabs.appendChild(tab);
      }

      if (isWide) {
        const section = document.createElement("section");
        section.className = "menu-accordion menu-static-section";
        section.id = category.id;
        const heading = document.createElement("div");
        heading.className = "bistrot-section-heading";
        heading.innerHTML = `${lucideIcon(category.icon)}<div class="accordion-label"><h2 class="accordion-title">${categoryTitle(category)}</h2>${importantNote}</div>`;
        section.append(heading, createCategoryContent(category));
        (wideGroupContainers.get(category.id) || root).appendChild(section);
        return;
      }

      const details = document.createElement("details");
      details.className = "menu-accordion";
      details.id = category.id;
      details.open = index === 0;
      const summary = document.createElement("summary");
      summary.innerHTML = `${lucideIcon(category.icon)}<span class="accordion-label"><span class="accordion-title">${categoryTitle(category)}</span>${importantNote}</span><span class="accordion-arrow" aria-hidden="true"></span>`;
      details.addEventListener("toggle", () => {
        if (details.open && !WIDE_SCREEN.matches) setActiveCategory(category.id);
      });
      details.append(summary, createCategoryContent(category));
      root.appendChild(details);
    });

    setUpCategoryScrollSpy();
  }

  function setLanguage(nextLanguage) {
    if (!allowedLanguages.includes(nextLanguage)) return;
    language = nextLanguage;
    saveLanguage(language);
    translateStaticPage();
    renderLanguageSwitcher();
    renderMenu();
  }

  function initialise() {
    translateStaticPage();
    renderLanguageSwitcher();
    renderMenu();
    WIDE_SCREEN.addEventListener("change", renderMenu);
  }

  document.addEventListener("DOMContentLoaded", initialise);
})();
