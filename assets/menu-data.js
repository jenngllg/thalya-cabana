(function () {
  "use strict";

  const item = (name, price, details, extra) => Object.assign({ name, price, details: details || [] }, extra || {});
  const keyed = (nameKey, price, details, extra) => Object.assign({ nameKey, price, details: details || [] }, extra || {});

  window.ThalyaMenu = [
    {
      id: "sandwichs-froids", titleKey: "coldSandwiches", icon: "sandwich",
      items: [
        item("Bagnat Cabana", 850, ["painBagnat"]),
        item("Milos", 900, ["tzatziki", "marinatedChicken", "cucumber", "redOnion", "feta"]),
        item("Saint-Barth", 900, ["caesarSauce", "breadedChicken", "romaine", "tomato", "bacon"]),
        item("Capri", 1100, ["pesto", "tomato", "arugula", "burrata", "basil"]),
        item("Cali", 1150, ["pesto", "curedHam", "sunDriedTomatoes", "arugula", "burrata"])
      ]
    },
    {
      id: "bowls", titleKey: "bowls", icon: "bowl",
      items: [
        item("Churros Bowl", 900, ["choiceTopping"]),
        item("Matcha Bowl", 1300, ["matchaCream", "granola", "mango", "coconut", "honey"]),
        item("Açaï Bowl", 1300, ["acaiBase", "granola", "redBerries", "banana", "honey", "chia"]),
        item("Burrata Bowl", 1300, ["pesto", "burrata", "roastedTomatoes", "arugula", "croutons"]),
        item("That Girl", 1400, ["quinoa", "grilledChicken", "avocado", "tomato", "edamame", "pumpkinSeeds"])
      ]
    },
    {
      id: "sandwichs-chauds", titleKey: "hotSandwiches", icon: "toast",
      items: [
        item("Cheeseburger", 800),
        item("Double Cheeseburger", 1100),
        item("Pita Cabana", 1000, ["tzatziki", "chicken", "redCabbage", "tomatoes", "mint", "pomegranate"]),
        item("Croque Cabana", 1100, ["pistachioPesto", "mortadella", "burrata", "pistachios"]),
        item("Sayolita", 1150, ["truffleCream", "doubleSteak", "mushrooms", "arugula", "cheddar"])
      ]
    },
    {
      id: "wraps", titleKey: "wraps", icon: "wrap",
      items: [
        item("César", 800, ["caesarSauce", "grilledChicken", "parmesan", "croutons", "romaine"]),
        item("Thalya", 900, ["yuzu", "avocado", "edamame", "cucumber", "spinach", "feta", "seeds"]),
        item("Gustavia", 850, ["tzatziki", "chicken", "sunDriedTomatoes", "redOnion", "mint", "pomegranate"]),
        item("Oslo", 1000, ["creamCheese", "smokedSalmon", "cucumber"])
      ]
    },
    {
      id: "panini", titleKey: "panini", icon: "panini",
      items: [
        item("Amalfi", 650, ["pesto", "tomato", "mozzarella", "basil"]),
        item("Quattro", 700, ["mozzarella", "goatCheese", "emmental", "parmesan"]),
        item("Chicken & Cheese", 800, ["cheddarSauce", "crispyChicken", "redOnion"]),
        item("Le Truffe", 950, ["truffleCream", "curedHam", "arugula", "parmesan"])
      ]
    },
    {
      id: "salades", titleKey: "salads", icon: "salad",
      items: [
        item("Zion", 1200, ["babySpinach", "yuzuTruffle", "parmesan", "kadaif"]),
        item("Riviera", 1300, ["mixedLeaves", "tuna", "tomatoes", "cucumber", "egg", "olives"]),
        item("César", 1400, ["romaine", "caesarSauce", "crispyChicken", "parmesan", "croutons"])
      ]
    },
    {
      id: "frites", titleKey: "fries", icon: "fries", compact: true,
      items: [
        keyed("fries", 450),
        keyed("fries", 500, ["sweetPotato"]),
        keyed("fries", 600, ["cheddar"]),
        keyed("chickenCrispy", 700)
      ]
    },
    {
      id: "toppings-sales", titleKey: "savouryToppings", icon: "plus", compact: true,
      items: [
        keyed("cheddarSauce", 200), keyed("egg", 200), keyed("bacon", 200),
        keyed("curedHam", 200), keyed("avocado", 300), keyed("burrata", 300)
      ]
    },
    {
      id: "desserts", titleKey: "desserts", icon: "dessert", compact: true,
      items: [
        keyed("sugarCrepe", 300), keyed("nutellaCrepe", 400), keyed("granita", 450),
        keyed("mochis", 500), keyed("nutellaPanini", 550), keyed("lemonTart", 600),
        keyed("raspberryTart", 600), keyed("tiramisu", 650)
      ]
    },
    {
      id: "toppings-sucres", titleKey: "sweetToppings", icon: "topping", compact: true,
      items: [
        keyed("vanilla", 100), keyed("speculoos", 100), keyed("pistachio", 100),
        keyed("whippedCream", 100), keyed("nutella", 100), keyed("fruitCoulis", 100), keyed("plantMilk", 100)
      ]
    },
    {
      id: "boissons-chaudes", titleKey: "hotDrinks", icon: "hot-drink", compact: true,
      items: [
        keyed("espresso", 180), keyed("doubleEspresso", 300), keyed("macchiato", 350),
        keyed("hotChocolate", 400), keyed("latte", 550), keyed("cappuccino", 550),
        keyed("matchaLatte", 600), keyed("chaiLatte", 600), keyed("tea", 300)
      ]
    },
    {
      id: "boissons-froides", titleKey: "coldDrinks", icon: "cold-drink", compact: true,
      items: [
        keyed("mineralWater", 200, ["volume50cl"]), keyed("sparklingWater", 250, ["volume50cl"]), keyed("sodas", 250, ["volume33cl"]),
        keyed("fruitJuice", 250), keyed("orangeJuice", 450), keyed("smoothie", 600),
        keyed("milkshake", 600), keyed("energyDrink", 500), keyed("coronaDesperados", 400),
        keyed("beerSelection", 300), keyed("wine25", 300, ["volume25cl"]), keyed("wine50", 500, ["volume50cl"]), keyed("wine75", 1800, ["volume75cl"])
      ]
    },
    {
      id: "petits-dejeuners", titleKey: "breakfasts", icon: "breakfast",
      subtitleKey: "breakfastUntil",
      items: [
        keyed("pastry", 180, ["croissantOrPain"]),
        item("Morning", 350, ["espresso", "pastry"], { join: "plus" }),
        item("Cabana", 550, ["espresso", "pastry", "orangeJuice"], { join: "plus" }),
        item("Healthy", 1490, ["acaiOrMatcha", "espresso", "orangeJuice"], { join: "plus" })
      ]
    }
  ];
})();
