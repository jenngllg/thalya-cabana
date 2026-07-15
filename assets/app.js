(function () {
  "use strict";

  const I18N = window.ThalyaI18n;
  const MENU = window.ThalyaMenu || [];
  const STORAGE_KEY = "thalya-cabana-language";
  const BISTROT_WIDE_SCREEN = window.matchMedia("(min-width: 760px)");
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
  const allowed = I18N.locales.map((locale) => locale.code);
  let language = getSavedLanguage();
  let observer = null;
  let bistrotObserver = null;

  function getSavedLanguage() {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      return allowed.includes(saved) ? saved : "fr";
    } catch (_error) {
      return "fr";
    }
  }

  function saveLanguage(value) {
    try { window.localStorage.setItem(STORAGE_KEY, value); } catch (_error) { /* Browsing still works without storage. */ }
  }

  function text(key) {
    return (I18N.ui[language] && I18N.ui[language][key]) || I18N.ui.fr[key] || key;
  }

  function interpolate(value, variables) {
    return Object.keys(variables || {}).reduce((result, key) => result.replace(`{${key}}`, variables[key]), value);
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

  function icon(name, className) {
    return `<svg class="${className || "section-icon"}" aria-hidden="true"><use href="assets/icons.svg#${name}"></use></svg>`;
  }

  function lucideIcon(name, className) {
    const fileName = LUCIDE_ICON_MAP[name] || "sandwich";
    return `<span class="${className || "section-icon"} lucide-icon" style="--lucide-icon: url('lucide/${fileName}.svg')" aria-hidden="true"></span>`;
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

  function renderLanguageSwitchers() {
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

  function createItem(menuItem) {
    const article = document.createElement("article");
    article.className = "menu-item";
    const details = menuItem.details.map(term).join(menuItem.join === "plus" ? " + " : " · ");
    article.innerHTML = `
      <div class="item-main">
        <span class="item-name">${itemName(menuItem)}</span>
        <span class="item-price">${formatPrice(menuItem.price)}</span>
      </div>
      ${details ? `<p class="item-details">${details}</p>` : ""}
    `;
    return article;
  }

  function createHeading(category) {
    const wrapper = document.createElement("div");
    wrapper.className = "section-heading";
    const subtitle = category.subtitleKey ? `<p class="section-subtitle">${text(category.subtitleKey)}</p>` : "";
    wrapper.innerHTML = `${icon(category.icon)}<div><h2>${categoryTitle(category)}</h2>${subtitle}</div>`;
    return wrapper;
  }

  function createSection(category) {
    const section = document.createElement("section");
    section.id = category.id;
    section.className = `menu-section${category.compact ? " compact-section" : ""}`;
    section.appendChild(createHeading(category));
    const list = document.createElement("div");
    list.className = "items-list";
    category.items.forEach((menuItem) => list.appendChild(createItem(menuItem)));
    section.appendChild(list);
    return section;
  }

  function renderRiviera() {
    const navigation = document.querySelector("[data-category-tabs]");
    const root = document.querySelector("[data-menu-root]");
    navigation.innerHTML = "";
    root.innerHTML = "";
    MENU.forEach((category, index) => {
      const link = document.createElement("a");
      link.className = "category-tab";
      link.href = `#${category.id}`;
      link.textContent = categoryTitle(category);
      if (index === 0) link.setAttribute("aria-current", "true");
      navigation.appendChild(link);
      root.appendChild(createSection(category));
    });
    setUpScrollSpy();
  }

  function createBistrotContent(category) {
    const content = document.createElement("div");
    content.className = "accordion-content";
    category.items.forEach((menuItem) => content.appendChild(createItem(menuItem)));
    return content;
  }

  function setActiveBistrotCategory(categoryId) {
    document.querySelectorAll(".bistrot-category-tab").forEach((tab) => {
      if (tab.getAttribute("href") === `#${categoryId}`) {
        tab.setAttribute("aria-current", "true");
        tab.scrollIntoView({ behavior: "auto", block: "nearest", inline: "center" });
      } else {
        tab.removeAttribute("aria-current");
      }
    });
  }

  function setUpBistrotScrollSpy() {
    if (bistrotObserver) bistrotObserver.disconnect();
    if (BISTROT_WIDE_SCREEN.matches || !("IntersectionObserver" in window)) return;
    bistrotObserver = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (visible) setActiveBistrotCategory(visible.target.id);
    }, { rootMargin: "-76px 0px -64%", threshold: 0 });
    document.querySelectorAll(".menu-accordion").forEach((section) => bistrotObserver.observe(section));
  }

  function renderBistrot() {
    const root = document.querySelector("[data-menu-root]");
    const tabs = document.querySelector("[data-bistrot-category-tabs]");
    if (!root) return;
    root.innerHTML = "";
    if (tabs) tabs.innerHTML = "";
    const isWide = BISTROT_WIDE_SCREEN.matches;

    MENU.forEach((category, index) => {
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
          if (BISTROT_WIDE_SCREEN.matches) return;
          event.preventDefault();
          const target = document.getElementById(category.id);
          if (!target) return;
          target.open = true;
          setActiveBistrotCategory(category.id);
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
        section.append(heading, createBistrotContent(category));
        root.appendChild(section);
        return;
      }

      const details = document.createElement("details");
      details.className = "menu-accordion";
      details.id = category.id;
      details.open = index === 0;
      const summary = document.createElement("summary");
      summary.innerHTML = `${lucideIcon(category.icon)}<span class="accordion-label"><span class="accordion-title">${categoryTitle(category)}</span>${importantNote}</span><span class="accordion-arrow" aria-hidden="true"></span>`;
      details.addEventListener("toggle", () => {
        if (!details.open || BISTROT_WIDE_SCREEN.matches) return;
        setActiveBistrotCategory(category.id);
      });
      details.append(summary, createBistrotContent(category));
      root.appendChild(details);
    });
    setUpBistrotScrollSpy();
  }

  function renderIllustrated() {
    const board = document.querySelector("[data-category-grid]");
    const root = document.querySelector("[data-menu-root]");
    board.innerHTML = "";
    root.innerHTML = "";
    MENU.forEach((category) => {
      const link = document.createElement("a");
      link.className = "category-tile";
      link.href = `#${category.id}`;
      link.setAttribute("aria-label", interpolate(text("openCategory"), { category: categoryTitle(category) }));
      link.innerHTML = `${icon(category.icon)}<span>${categoryTitle(category)}</span>`;
      board.appendChild(link);
      root.appendChild(createSection(category));
    });
  }

  function setUpScrollSpy() {
    if (observer) observer.disconnect();
    if (!("IntersectionObserver" in window)) return;
    const tabs = [...document.querySelectorAll(".category-tab")];
    observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      tabs.forEach((tab) => {
        if (tab.getAttribute("href") === `#${visible.target.id}`) {
          tab.setAttribute("aria-current", "true");
          tab.scrollIntoView({ inline: "center", block: "nearest" });
        } else {
          tab.removeAttribute("aria-current");
        }
      });
    }, { rootMargin: "-25% 0px -60%", threshold: [0, .2, .5] });
    MENU.forEach((category) => {
      const section = document.getElementById(category.id);
      if (section) observer.observe(section);
    });
  }

  function renderMenuVariant() {
    const variant = document.body.dataset.variant;
    if (variant === "riviera") renderRiviera();
    if (variant === "bistrot") renderBistrot();
    if (variant === "illustre") renderIllustrated();
  }

  function setLanguage(nextLanguage) {
    if (!allowed.includes(nextLanguage)) return;
    language = nextLanguage;
    saveLanguage(language);
    translateStaticPage();
    renderLanguageSwitchers();
    renderMenuVariant();
  }

  function initialise() {
    translateStaticPage();
    renderLanguageSwitchers();
    renderMenuVariant();
    if (document.body.dataset.variant === "bistrot") {
      BISTROT_WIDE_SCREEN.addEventListener("change", renderBistrot);
    }
  }

  document.addEventListener("DOMContentLoaded", initialise);
})();
