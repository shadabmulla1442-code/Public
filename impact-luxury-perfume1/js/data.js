/**
 * IMPACT LUXURY PERFUME - CATALOG DATABASE
 * 100% Authentic Designer, Niche, Viral Arabian Fragrances & Exclusive IMPACT Private Reserve
 */

const FRIDAY_PRODUCTS = [
  // --- IMPACT EXCLUSIVE PRIVATE RESERVE (FLAGSHIP HOUSE CREATIONS) ---
  {
    id: "impact-noir-absolu",
    brand: "IMPACT Haute Parfumerie",
    name: "Impact Noir Absolu (Extrait 32%)",
    gender: "Unisex",
    category: "niche",
    concentration: "Extrait de Parfum (32%)",
    priceINR: 12500,
    mrpINR: 16000,
    discountPct: 22,
    rating: 5.0,
    reviewsCount: 420,
    volume: "100ml",
    sizes: [
      { size: "10ml Travel Decant", price: 1850, mrp: 2400 },
      { size: "50ml Flacon", price: 8200, mrp: 10500 },
      { size: "100ml Crystal Flacon", price: 12500, mrp: 16000, default: true }
    ],
    inStock: true,
    isBestseller: true,
    isNiche: true,
    olfactoryFamily: "Woody Spicy",
    tagline: "Wild 12-Year Assam Agarwood, Black Amber & Taif Rose",
    description: "The signature masterpiece of Maison IMPACT. Crafted with 12-year-old Assamese agarwood aged in toasted French oak casks, enveloped by Venezuelan tonka bean and smoked black rose petals.",
    notes: {
      top: ["Calabrian Bergamot", "Cardamom CO2", "Pink Peppercorn"],
      middle: ["Midnight Taif Rose", "Smoked Labdanum", "Smoked Birch"],
      base: ["Vintage Assam Oud", "Golden Ambergris", "Bourbon Vanilla"]
    },
    bottleStyle: {
      color: "radial-gradient(circle at 40% 30%, #303038, #111116 80%, #050507)",
      capColor: "#d4af37",
      badgeColor: "#d4af37",
      label: "IMPACT NOIR"
    }
  },
  {
    id: "impact-l-or-sublime",
    brand: "IMPACT Haute Parfumerie",
    name: "Impact L'Or Sublime Extrait",
    gender: "Unisex",
    category: "niche",
    concentration: "Extrait de Parfum (28%)",
    priceINR: 13900,
    mrpINR: 17500,
    discountPct: 20,
    rating: 4.9,
    reviewsCount: 315,
    volume: "100ml",
    sizes: [
      { size: "10ml Travel Decant", price: 1950, mrp: 2500 },
      { size: "100ml Flacon", price: 13900, mrp: 17500, default: true }
    ],
    inStock: true,
    isBestseller: true,
    isNiche: true,
    olfactoryFamily: "Oriental/Amber",
    tagline: "Liquid Gold Honey, Persian Saffron & Grasse Jasmine",
    description: "Sunlight crystallized into French heavy crystal. Pure Grasse Jasmine Sambac hand-harvested at dawn, folded into rich Persian saffron threads and Australian sandalwood.",
    notes: {
      top: ["Saffron Threads", "Blood Orange Nectar", "Neroli"],
      middle: ["Grasse Jasmine Grandiflorum", "May Rose", "Wild Honeycomb"],
      base: ["White Musk", "Cedarwood Virginia", "Cashmere Wood"]
    },
    bottleStyle: {
      color: "radial-gradient(circle at 45% 35%, #927529, #4a3b12 75%, #1f1807)",
      capColor: "#f7d774",
      badgeColor: "#f7d774",
      label: "L'OR SUBLIME"
    }
  },

  // --- VIRAL MIDDLE EASTERN MASTERPIECES ---
  {
    id: "armaf-club-de-nuit-intense-man",
    brand: "Armaf",
    name: "Club de Nuit Intense Man (Pure Parfum)",
    gender: "Men",
    category: "middle-eastern",
    concentration: "Pure Parfum",
    priceINR: 3450,
    mrpINR: 5200,
    discountPct: 34,
    rating: 4.9,
    reviewsCount: 842,
    volume: "150ml",
    sizes: [
      { size: "10ml Decant", price: 399, mrp: 550 },
      { size: "105ml EDP", price: 2950, mrp: 4500 },
      { size: "150ml Pure Parfum", price: 3450, mrp: 5200, default: true }
    ],
    inStock: true,
    isBestseller: true,
    isMiddleEastern: true,
    olfactoryFamily: "Woody Spicy",
    tagline: "The World-Renowned Smoky Pineapple & Birch Beast",
    description: "The crown jewel of Middle Eastern perfumery. Crisp Calabrian lemon and smoky blackcurrant open into a birch wood and ambergris dry-down with nuclear projection.",
    notes: {
      top: ["Lemon", "Pineapple", "Blackcurrant", "Apple", "Bergamot"],
      middle: ["Birch", "Jasmine", "Rose"],
      base: ["Ambergris", "Musk", "Patchouli", "Vanilla"]
    },
    bottleStyle: {
      color: "linear-gradient(135deg, #1b1b1f, #0a0a0c)",
      capColor: "#222",
      badgeColor: "#d4af37",
      label: "CLUB DE NUIT"
    }
  },
  {
    id: "lattafa-khamrah",
    brand: "Lattafa",
    name: "Khamrah Eau de Parfum",
    gender: "Unisex",
    category: "middle-eastern",
    concentration: "Eau de Parfum",
    priceINR: 2350,
    mrpINR: 3800,
    discountPct: 38,
    rating: 4.9,
    reviewsCount: 620,
    volume: "100ml",
    sizes: [
      { size: "10ml Decant", price: 349, mrp: 499 },
      { size: "100ml EDP", price: 2350, mrp: 3800, default: true }
    ],
    inStock: true,
    isBestseller: true,
    isMiddleEastern: true,
    olfactoryFamily: "Gourmand/Sweet",
    tagline: "Sweet Dates, Boozy Cognac & Warm Praline Vanilla",
    description: "An irresistible oriental sweet elixir presented in a cut-crystal whisky glass flacon. Sweet Medjool dates, cinnamon spice, praline, and creamy tonka bean.",
    notes: {
      top: ["Cinnamon", "Nutmeg", "Bergamot"],
      middle: ["Dates", "Praline", "Tuberose", "Mahonial"],
      base: ["Vanilla", "Tonka Bean", "Benzoin", "Myrrh", "Amberwood"]
    },
    bottleStyle: {
      color: "linear-gradient(135deg, #caa15a, #825b1e)",
      capColor: "#eed18f",
      badgeColor: "#caa15a",
      label: "KHAMRAH"
    }
  },
  {
    id: "rasasi-hawas-for-him",
    brand: "Rasasi",
    name: "Hawas for Him Eau de Parfum",
    gender: "Men",
    category: "middle-eastern",
    concentration: "Eau de Parfum",
    priceINR: 3799,
    mrpINR: 5900,
    discountPct: 36,
    rating: 4.8,
    reviewsCount: 512,
    volume: "100ml",
    sizes: [
      { size: "10ml Decant", price: 449, mrp: 600 },
      { size: "100ml EDP", price: 3799, mrp: 5900, default: true }
    ],
    inStock: true,
    isBestseller: true,
    isMiddleEastern: true,
    olfactoryFamily: "Fresh/Aquatic",
    tagline: "Fresh Cinnamon Plum, Marine Salinity & Golden Amber",
    description: "The ultimate warm-weather compliment magnet. Features an energetic blend of juicy Italian citrus, cinnamon-dusted plum, sea breeze, and rich driftwood.",
    notes: {
      top: ["Apple", "Bergamot", "Lemon", "Cinnamon"],
      middle: ["Watery Notes", "Plum", "Orange Blossom", "Cardamom"],
      base: ["Ambergris", "Musk", "Patchouli", "Driftwood"]
    },
    bottleStyle: {
      color: "linear-gradient(135deg, #7c9eb2, #416788)",
      capColor: "#a0aab2",
      badgeColor: "#416788",
      label: "RASASI HAWAS"
    }
  },
  {
    id: "afnan-9pm",
    brand: "Afnan",
    name: "9PM Eau de Parfum",
    gender: "Men",
    category: "middle-eastern",
    concentration: "Eau de Parfum",
    priceINR: 2499,
    mrpINR: 3600,
    discountPct: 31,
    rating: 4.8,
    reviewsCount: 430,
    volume: "100ml",
    sizes: [
      { size: "10ml Decant", price: 320, mrp: 450 },
      { size: "100ml EDP", price: 2499, mrp: 3600, default: true }
    ],
    inStock: true,
    isBestseller: true,
    isMiddleEastern: true,
    olfactoryFamily: "Gourmand/Sweet",
    tagline: "Sweet Crisp Apple, Wild Lavender & Intoxicating Vanilla",
    description: "The definitive nightlife fragrance. Opens with tart green apples and spicy cinnamon, melting into sweet bubblegum lavender, vanilla bean, and amber.",
    notes: {
      top: ["Apple", "Cinnamon", "Wild Lavender", "Bergamot"],
      middle: ["Orange Blossom", "Lily of the Valley"],
      base: ["Vanilla", "Tonka Bean", "Amber", "Patchouli"]
    },
    bottleStyle: {
      color: "linear-gradient(135deg, #2b2b36, #121216)",
      capColor: "#d4af37",
      badgeColor: "#fff",
      label: "AFNAN 9PM"
    }
  },

  // --- ICONIC DESIGNER PERFUMES ---
  {
    id: "dior-sauvage-elixir",
    brand: "Dior",
    name: "Sauvage Elixir Concentrated Perfume",
    gender: "Men",
    category: "designer",
    concentration: "Elixir / Pure Parfum",
    priceINR: 14800,
    mrpINR: 17500,
    discountPct: 15,
    rating: 5.0,
    reviewsCount: 389,
    volume: "60ml",
    sizes: [
      { size: "10ml Decant", price: 2850, mrp: 3400 },
      { size: "60ml Flacon", price: 14800, mrp: 17500, default: true },
      { size: "100ml Flacon", price: 19800, mrp: 23000 }
    ],
    inStock: true,
    isBestseller: true,
    isDesigner: true,
    olfactoryFamily: "Spicy/Leather",
    tagline: "Unprecedented Concentration of Wild Spices & Bleached Lavender",
    description: "A nocturnal masterpiece of intoxicating richness. Crafted with rare spices, custom-tailored Nyons lavender, and a rich liquor-like woods base.",
    notes: {
      top: ["Nutmeg", "Cinnamon", "Cardamom", "Grapefruit"],
      middle: ["Bleached Lavender Essence"],
      base: ["Licorice", "Sandalwood", "Amber", "Patchouli", "Haitian Vetiver"]
    },
    bottleStyle: {
      color: "linear-gradient(135deg, #101424, #05070f)",
      capColor: "#1d2338",
      badgeColor: "#d4af37",
      label: "SAUVAGE ELIXIR"
    }
  },
  {
    id: "bleu-de-chanel-parfum",
    brand: "Chanel",
    name: "Bleu de Chanel Parfum Pour Homme",
    gender: "Men",
    category: "designer",
    concentration: "Parfum",
    priceINR: 16500,
    mrpINR: 18900,
    discountPct: 13,
    rating: 4.9,
    reviewsCount: 295,
    volume: "100ml",
    sizes: [
      { size: "10ml Decant", price: 2490, mrp: 2990 },
      { size: "100ml Parfum", price: 16500, mrp: 18900, default: true }
    ],
    inStock: true,
    isBestseller: true,
    isDesigner: true,
    olfactoryFamily: "Woody Spicy",
    tagline: "Pure Aristocratic Sandalwood, Zest of Lemon & Frankincense",
    description: "The most intense expression of the iconic Bleu de Chanel. A majestic aromatic woody trail powered by rare New Caledonian sandalwood.",
    notes: {
      top: ["Lemon Zest", "Bergamot", "Mint", "Artemisia"],
      middle: ["Lavender", "Geranium", "Green Notes", "Pineapple"],
      base: ["Sandalwood", "Cedar", "Amberwood", "Iso E Super", "Tonka Bean"]
    },
    bottleStyle: {
      color: "linear-gradient(135deg, #0e1626, #060912)",
      capColor: "#060912",
      badgeColor: "#d4af37",
      label: "BLEU DE CHANEL"
    }
  },
  {
    id: "tom-ford-black-orchid",
    brand: "Tom Ford",
    name: "Black Orchid Parfum (Gold Flacon)",
    gender: "Unisex",
    category: "designer",
    concentration: "Parfum",
    priceINR: 15900,
    mrpINR: 19500,
    discountPct: 18,
    rating: 4.9,
    reviewsCount: 310,
    volume: "100ml",
    sizes: [
      { size: "10ml Decant", price: 2350, mrp: 2800 },
      { size: "50ml Parfum", price: 11500, mrp: 13900 },
      { size: "100ml Parfum", price: 15900, mrp: 19500, default: true }
    ],
    inStock: true,
    isBestseller: true,
    isDesigner: true,
    olfactoryFamily: "Oriental/Amber",
    tagline: "Black Truffle, Elusive Black Orchids & Rum-Drenched Plum",
    description: "A hypnotic, voluptuous potion. Rich dark accords of black truffle and ylang-ylang are bathed in golden rum, dark plum, and earthy patchouli.",
    notes: {
      top: ["Truffle", "Plum", "Rum", "Ylang-Ylang"],
      middle: ["Black Orchid", "Black Plum", "Patchouli"],
      base: ["Patchouli", "Amber", "Vanilla", "Woody Notes"]
    },
    bottleStyle: {
      color: "linear-gradient(135deg, #d4af37, #8c6d1d)",
      capColor: "#eed18f",
      badgeColor: "#111",
      label: "TOM FORD"
    }
  },
  {
    id: "versace-eros-flame",
    brand: "Versace",
    name: "Eros Flame Eau de Parfum",
    gender: "Men",
    category: "designer",
    concentration: "Eau de Parfum",
    priceINR: 7450,
    mrpINR: 9800,
    discountPct: 24,
    rating: 4.8,
    reviewsCount: 388,
    volume: "100ml",
    sizes: [
      { size: "10ml Decant", price: 999, mrp: 1350 },
      { size: "100ml EDP", price: 7450, mrp: 9800, default: true },
      { size: "200ml Jumbo", price: 10500, mrp: 13900 }
    ],
    inStock: true,
    isBestseller: false,
    isDesigner: true,
    olfactoryFamily: "Woody Spicy",
    tagline: "Fiery Chinotto Citrus, Madagascar Black Pepper & Vanilla",
    description: "A fragrance for a strong, passionate, confident man. Vibrant Italian fruits contrasted with warming spices, Texas cedar, and Haitian vetiver.",
    notes: {
      top: ["Mandarin Orange", "Black Pepper", "Chinotto", "Lemon", "Rosemary"],
      middle: ["Pepper", "Geranium", "Rose"],
      base: ["Vanilla", "Tonka Bean", "Sandalwood", "Texas Cedar", "Oakmoss"]
    },
    bottleStyle: {
      color: "linear-gradient(135deg, #88141e, #3d050a)",
      capColor: "#d4af37",
      badgeColor: "#d4af37",
      label: "EROS FLAME"
    }
  },

  // --- NICHE & HAUTE PARFUMERIE ---
  {
    id: "creed-aventus",
    brand: "Creed",
    name: "Aventus Millésime (Authentic Paris Batch)",
    gender: "Men",
    category: "niche",
    concentration: "Eau de Parfum",
    priceINR: 28500,
    mrpINR: 34000,
    discountPct: 16,
    rating: 5.0,
    reviewsCount: 460,
    volume: "100ml",
    sizes: [
      { size: "10ml Decant", price: 3950, mrp: 4800 },
      { size: "50ml Flacon", price: 19500, mrp: 23500 },
      { size: "100ml Flacon", price: 28500, mrp: 34000, default: true }
    ],
    inStock: true,
    isBestseller: true,
    isNiche: true,
    olfactoryFamily: "Woody Spicy",
    tagline: "The Sovereign King of Niche Perfumery",
    description: "Celebrating strength, power, and success. Juicy blackcurrant, Italian bergamot, French apples, and royal birch married to Creed's signature ambergris.",
    notes: {
      top: ["Bergamot", "Blackcurrant Leaves", "Apple", "Pineapple"],
      middle: ["Pinkberries", "Birch", "Patchouli", "Jasmine"],
      base: ["Musk", "Oakmoss", "Ambergris", "Vanilla"]
    },
    bottleStyle: {
      color: "linear-gradient(135deg, #26262b, #0f0f12)",
      capColor: "#111",
      badgeColor: "#d4af37",
      label: "CREED AVENTUS"
    }
  },
  {
    id: "parfums-de-marly-layton",
    brand: "Parfums de Marly",
    name: "Layton Eau de Parfum Royal Essence",
    gender: "Unisex",
    category: "niche",
    concentration: "Eau de Parfum",
    priceINR: 21900,
    mrpINR: 26000,
    discountPct: 16,
    rating: 4.9,
    reviewsCount: 275,
    volume: "125ml",
    sizes: [
      { size: "10ml Decant", price: 2950, mrp: 3600 },
      { size: "125ml Flacon", price: 21900, mrp: 26000, default: true }
    ],
    inStock: true,
    isBestseller: true,
    isNiche: true,
    olfactoryFamily: "Oriental/Amber",
    tagline: "Crisp Green Apple, Velvety Vanilla, Cardamom & Guaiac Wood",
    description: "An aristocratic olfactory signature. Opens with crisp apple and bergamot, leading to a passionate floral heart and caramelized vanilla-wood drydown.",
    notes: {
      top: ["Apple", "Lavender", "Bergamot", "Mandarin Orange"],
      middle: ["Geranium", "Violet", "Jasmine"],
      base: ["Vanilla", "Cardamom", "Sandalwood", "Pepper", "Guaiac Wood"]
    },
    bottleStyle: {
      color: "linear-gradient(135deg, #1b263b, #0d131f)",
      capColor: "#bbb",
      badgeColor: "#d4af37",
      label: "P.D.M. LAYTON"
    }
  },
  {
    id: "mfk-baccarat-rouge-540-extrait",
    brand: "Maison Francis Kurkdjian",
    name: "Baccarat Rouge 540 Extrait de Parfum",
    gender: "Unisex",
    category: "niche",
    concentration: "Extrait de Parfum",
    priceINR: 34900,
    mrpINR: 42000,
    discountPct: 17,
    rating: 5.0,
    reviewsCount: 380,
    volume: "70ml",
    sizes: [
      { size: "10ml Decant", price: 4950, mrp: 6000 },
      { size: "70ml Extrait", price: 34900, mrp: 42000, default: true }
    ],
    inStock: true,
    isBestseller: true,
    isNiche: true,
    olfactoryFamily: "Oriental/Amber",
    tagline: "Liquid Crystal, Egyptian Jasmine & Spiced Ambergris Cloud",
    description: "The peak of modern haute perfumery. Hand-picked Grandiflorum jasmine from Egypt, bitter Moroccan almond, and mineral ambergris crystal.",
    notes: {
      top: ["Bitter Almond", "Saffron"],
      middle: ["Egyptian Jasmine", "Cedar"],
      base: ["Ambergris", "Woody Notes", "Musk"]
    },
    bottleStyle: {
      color: "linear-gradient(135deg, #7b1113, #3f0506)",
      capColor: "#d4af37",
      badgeColor: "#d4af37",
      label: "BR 540 EXTRAIT"
    }
  },
  {
    id: "mancera-red-tobacco",
    brand: "Mancera",
    name: "Red Tobacco Eau de Parfum",
    gender: "Unisex",
    category: "niche",
    concentration: "Eau de Parfum",
    priceINR: 10800,
    mrpINR: 14500,
    discountPct: 25,
    rating: 4.8,
    reviewsCount: 245,
    volume: "120ml",
    sizes: [
      { size: "10ml Decant", price: 1450, mrp: 1900 },
      { size: "120ml Flacon", price: 10800, mrp: 14500, default: true }
    ],
    inStock: true,
    isBestseller: false,
    isNiche: true,
    olfactoryFamily: "Spicy/Leather",
    tagline: "Nuclear Cuban Tobacco, Warm Cinnamon, Nutmeg & Precious Oud",
    description: "An incendiary explosion of warm spices, Cuban tobacco leaves, patchouli, and Madagascar vanilla. Renowned for 24+ hour longevity.",
    notes: {
      top: ["Cinnamon", "Agarwood (Oud)", "Incense", "Saffron", "Nutmeg"],
      middle: ["Patchouli", "Jasmine"],
      base: ["Tobacco", "Madagascar Vanilla", "Amber", "Sandalwood", "Guaiac Wood"]
    },
    bottleStyle: {
      color: "linear-gradient(135deg, #641517, #2c090a)",
      capColor: "#d4af37",
      badgeColor: "#fff",
      label: "RED TOBACCO"
    }
  },

  // --- WOMEN'S LUXURY SIGNATURES ---
  {
    id: "ysl-libre-le-parfum",
    brand: "Yves Saint Laurent",
    name: "Libre Le Parfum Pour Femme",
    gender: "Women",
    category: "women",
    concentration: "Le Parfum",
    priceINR: 11900,
    mrpINR: 14200,
    discountPct: 16,
    rating: 4.9,
    reviewsCount: 320,
    volume: "90ml",
    sizes: [
      { size: "10ml Decant", price: 1850, mrp: 2300 },
      { size: "90ml Parfum", price: 11900, mrp: 14200, default: true }
    ],
    inStock: true,
    isBestseller: true,
    isDesigner: true,
    olfactoryFamily: "Floral",
    tagline: "Spiced Saffron, Moroccan Orange Blossom & Bourbon Vanilla",
    description: "A fiery floral interpretation of liberation. Precious saffron harvested from the Ourika Community Gardens of Morocco blended with sweet honey and vanilla.",
    notes: {
      top: ["Ginger", "Saffron", "Mandarin Orange", "Bergamot"],
      middle: ["Orange Blossom", "Lavender"],
      base: ["Bourbon Vanilla", "Honey", "Tonka Bean", "Vetiver"]
    },
    bottleStyle: {
      color: "linear-gradient(135deg, #a45318, #592505)",
      capColor: "#111",
      badgeColor: "#d4af37",
      label: "YSL LIBRE"
    }
  },
  {
    id: "carolina-herrera-good-girl-supreme",
    brand: "Carolina Herrera",
    name: "Good Girl Suprême Eau de Parfum",
    gender: "Women",
    category: "women",
    concentration: "Eau de Parfum",
    priceINR: 9800,
    mrpINR: 12500,
    discountPct: 21,
    rating: 4.8,
    reviewsCount: 290,
    volume: "80ml",
    sizes: [
      { size: "10ml Decant", price: 1490, mrp: 1900 },
      { size: "80ml Stiletto", price: 9800, mrp: 12500, default: true }
    ],
    inStock: true,
    isBestseller: false,
    isDesigner: true,
    olfactoryFamily: "Gourmand/Sweet",
    tagline: "Juicy Forest Berries, Egyptian Jasmine & Roasted Tonka",
    description: "The stiletto icon reinvented. Succulent berries and Egyptian jasmine give way to an overdose of roasted tonka bean and sparkling vetiver.",
    notes: {
      top: ["Forest Fruits", "Egyptian Jasmine"],
      middle: ["Tonka Bean", "Tuberose"],
      base: ["Vetiver"]
    },
    bottleStyle: {
      color: "linear-gradient(135deg, #1c182d, #08070d)",
      capColor: "#d4af37",
      badgeColor: "#d4af37",
      label: "GOOD GIRL"
    }
  }
];

// Popular Brands for Marquee & Filter
const POPULAR_BRANDS = [
  "IMPACT Haute Parfumerie", "Dior", "Tom Ford", "Creed", "Armaf", "Lattafa", 
  "Parfums de Marly", "Chanel", "Rasasi", "Afnan", 
  "Versace", "Maison Francis Kurkdjian", "Mancera", "YSL"
];
