/**
 * FRIDAY CHARM - LIVE SEARCH, AUTOCOMPLETE & FILTER ENGINE
 * Real-time product search, Brand matching, Olfactory sorting, and Indian INR Price brackets
 */

const FridayFilter = {
  activeCategory: 'all',
  activeFamily: 'all',
  activePriceBracket: 'all',
  activeGender: 'all',
  sortBy: 'featured',
  searchQuery: '',

  init() {
    this.bindSearchEvents();
    this.bindFilterEvents();
    this.renderProductsGrid();
  },

  bindSearchEvents() {
    const searchInput = document.getElementById('headerSearchInput');
    const searchDropdown = document.getElementById('searchSuggestionsBox');

    if (!searchInput || !searchDropdown) return;

    searchInput.addEventListener('input', (e) => {
      const q = e.target.value.trim().toLowerCase();
      this.searchQuery = q;

      if (q.length < 2) {
        searchDropdown.classList.remove('active');
        searchDropdown.innerHTML = '';
        this.renderProductsGrid();
        return;
      }

      // Find matching products
      const matches = FRIDAY_PRODUCTS.filter(p => {
        return p.name.toLowerCase().includes(q) ||
               p.brand.toLowerCase().includes(q) ||
               p.olfactoryFamily.toLowerCase().includes(q) ||
               p.gender.toLowerCase().includes(q) ||
               p.notes.top.some(n => n.toLowerCase().includes(q)) ||
               p.notes.middle.some(n => n.toLowerCase().includes(q)) ||
               p.notes.base.some(n => n.toLowerCase().includes(q));
      });

      // Matching brands
      const matchingBrands = POPULAR_BRANDS.filter(b => b.toLowerCase().includes(q));

      if (matches.length === 0 && matchingBrands.length === 0) {
        searchDropdown.innerHTML = `
          <div class="search-empty-state">
            <span>No authentic fragrances found for "<strong>${q}</strong>"</span>
            <small>Try searching "Dior", "Armaf", "Khamrah", "Oud", or "Sauvage"</small>
          </div>
        `;
      } else {
        searchDropdown.innerHTML = `
          ${matchingBrands.length > 0 ? `
            <div class="search-section-header">Fragrance Houses</div>
            <div class="search-brands-row">
              ${matchingBrands.map(b => `
                <button type="button" class="search-brand-chip" onclick="FridayFilter.searchBrand('${b}')">
                  ${b}
                </button>
              `).join('')}
            </div>
          ` : ''}

          <div class="search-section-header">Products (${matches.length})</div>
          <div class="search-results-list">
            ${matches.slice(0, 5).map(p => `
              <div class="search-item-row" onclick="FridayApp.openQuickView('${p.id}'); FridayFilter.closeSearch();">
                <div class="search-item-bottle" style="background: ${p.bottleStyle.color};">
                  <span class="search-mini-badge">${p.brand[0]}</span>
                </div>
                <div class="search-item-meta">
                  <span class="search-item-brand">${p.brand}</span>
                  <h5 class="search-item-title">${p.name}</h5>
                  <span class="search-item-notes">${p.olfactoryFamily} &bull; ${p.concentration}</span>
                </div>
                <div class="search-item-pricing">
                  <span class="search-price-inr">${FridayCart.formatINR(p.priceINR)}</span>
                  <span class="search-mrp-inr">${FridayCart.formatINR(p.mrpINR)}</span>
                  <span class="search-disc-badge">${p.discountPct}% OFF</span>
                </div>
              </div>
            `).join('')}
          </div>
        `;
      }

      searchDropdown.classList.add('active');
      this.renderProductsGrid();
    });

    // Close search dropdown on click outside
    document.addEventListener('click', (e) => {
      if (!searchInput.contains(e.target) && !searchDropdown.contains(e.target)) {
        this.closeSearch();
      }
    });
  },

  closeSearch() {
    const searchDropdown = document.getElementById('searchSuggestionsBox');
    if (searchDropdown) searchDropdown.classList.remove('active');
  },

  searchBrand(brandName) {
    const searchInput = document.getElementById('headerSearchInput');
    if (searchInput) searchInput.value = brandName;
    this.searchQuery = brandName.toLowerCase();
    this.closeSearch();
    this.renderProductsGrid();
    document.getElementById('catalogSection').scrollIntoView({ behavior: 'smooth' });
  },

  bindFilterEvents() {
    // Category tabs
    const categoryBtns = document.querySelectorAll('.cat-nav-btn');
    categoryBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        categoryBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.activeCategory = btn.getAttribute('data-category');
        this.renderProductsGrid();
      });
    });

    // Olfactory Family pills
    const familyPills = document.querySelectorAll('.family-filter-pill');
    familyPills.forEach(pill => {
      pill.addEventListener('click', () => {
        familyPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        this.activeFamily = pill.getAttribute('data-family');
        this.renderProductsGrid();
      });
    });

    // Price bracket dropdown / selector
    const priceSelect = document.getElementById('filterPriceSelect');
    if (priceSelect) {
      priceSelect.addEventListener('change', (e) => {
        this.activePriceBracket = e.target.value;
        this.renderProductsGrid();
      });
    }

    // Sort selector
    const sortSelect = document.getElementById('filterSortSelect');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        this.sortBy = e.target.value;
        this.renderProductsGrid();
      });
    }

    // Gender filter dropdown
    const genderSelect = document.getElementById('filterGenderSelect');
    if (genderSelect) {
      genderSelect.addEventListener('change', (e) => {
        this.activeGender = e.target.value;
        this.renderProductsGrid();
      });
    }
  },

  filterProducts() {
    return FRIDAY_PRODUCTS.filter(p => {
      // 1. Search query
      if (this.searchQuery) {
        const q = this.searchQuery;
        const matchName = p.name.toLowerCase().includes(q);
        const matchBrand = p.brand.toLowerCase().includes(q);
        const matchFamily = p.olfactoryFamily.toLowerCase().includes(q);
        const matchNotes = p.notes.top.concat(p.notes.middle, p.notes.base).some(n => n.toLowerCase().includes(q));
        if (!matchName && !matchBrand && !matchFamily && !matchNotes) return false;
      }

      // 2. Category
      if (this.activeCategory !== 'all') {
        if (this.activeCategory === 'middle-eastern' && !p.isMiddleEastern) return false;
        if (this.activeCategory === 'designer' && !p.isDesigner) return false;
        if (this.activeCategory === 'niche' && !p.isNiche) return false;
        if (this.activeCategory === 'bestseller' && !p.isBestseller) return false;
        if (this.activeCategory === 'men' && p.gender !== 'Men') return false;
        if (this.activeCategory === 'women' && p.gender !== 'Women') return false;
        if (this.activeCategory === 'unisex' && p.gender !== 'Unisex') return false;
      }

      // 3. Gender
      if (this.activeGender !== 'all') {
        if (p.gender.toLowerCase() !== this.activeGender.toLowerCase()) return false;
      }

      // 4. Olfactory Family
      if (this.activeFamily !== 'all') {
        if (!p.olfactoryFamily.toLowerCase().includes(this.activeFamily.toLowerCase())) return false;
      }

      // 5. Price Bracket (INR)
      if (this.activePriceBracket !== 'all') {
        const pr = p.priceINR;
        if (this.activePriceBracket === 'under-3000' && pr >= 3000) return false;
        if (this.activePriceBracket === '3000-8000' && (pr < 3000 || pr > 8000)) return false;
        if (this.activePriceBracket === '8000-18000' && (pr < 8000 || pr > 18000)) return false;
        if (this.activePriceBracket === 'above-18000' && pr <= 18000) return false;
      }

      return true;
    });
  },

  sortProducts(list) {
    const cloned = [...list];
    switch (this.sortBy) {
      case 'price-asc':
        return cloned.sort((a, b) => a.priceINR - b.priceINR);
      case 'price-desc':
        return cloned.sort((a, b) => b.priceINR - a.priceINR);
      case 'rating':
        return cloned.sort((a, b) => b.rating - a.rating);
      case 'discount':
        return cloned.sort((a, b) => b.discountPct - a.discountPct);
      case 'featured':
      default:
        // Prioritize bestsellers first
        return cloned.sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0));
    }
  },

  renderProductsGrid() {
    const grid = document.getElementById('fridayProductsGrid');
    const countEl = document.getElementById('catalogResultsCount');
    if (!grid) return;

    const filtered = this.filterProducts();
    const sorted = this.sortProducts(filtered);

    if (countEl) {
      countEl.textContent = `Showing ${sorted.length} 100% Authentic Perfumes`;
    }

    if (sorted.length === 0) {
      grid.innerHTML = `
        <div class="no-products-found">
          <div class="no-prod-icon">🔍</div>
          <h3>No matching fragrances found</h3>
          <p>Try resetting your price bracket or selecting "All Fragrances".</p>
          <button class="btn-reset-filters" onclick="FridayFilter.resetFilters()">Reset All Filters</button>
        </div>
      `;
      return;
    }

    grid.innerHTML = sorted.map(p => `
      <article class="friday-product-card" data-id="${p.id}">
        <!-- Badges & Wishlist Trigger -->
        <div class="card-head-badges">
          <div class="badges-left">
            <span class="discount-pill">${p.discountPct}% OFF</span>
            ${p.isBestseller ? '<span class="bestseller-pill">BESTSELLER</span>' : ''}
          </div>
          <button class="btn-card-wishlist" onclick="FridayApp.toggleWishlist('${p.id}', this)" title="Add to Wishlist">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </button>
        </div>

        <!-- Bottle Stage Preview -->
        <div class="card-bottle-stage" onclick="FridayApp.openQuickView('${p.id}')">
          <div class="card-flacon-preview" style="background: ${p.bottleStyle.color}; border: 1px solid ${p.bottleStyle.badgeColor}55;">
            <div class="flacon-cap" style="background: ${p.bottleStyle.capColor};"></div>
            <div class="flacon-reflection"></div>
            <div class="flacon-label-tag">
              <span class="brand-sub">${p.brand}</span>
              <span class="name-sub">${p.bottleStyle.label}</span>
            </div>
          </div>
        </div>

        <!-- Card Body Content -->
        <div class="card-body">
          <div class="card-brand-row">
            <span class="card-brand-name">${p.brand}</span>
            <div class="card-rating-chip">
              <span>★ ${p.rating}</span>
              <small>(${p.reviewsCount})</small>
            </div>
          </div>

          <h3 class="card-product-name" onclick="FridayApp.openQuickView('${p.id}')" title="${p.name}">
            ${p.name}
          </h3>

          <div class="card-meta-line">
            <span class="meta-tag">${p.concentration}</span>
            <span class="meta-tag">${p.gender}</span>
            <span class="meta-tag family-tag">${p.olfactoryFamily}</span>
          </div>

          <!-- Price & Savings in Indian INR -->
          <div class="card-pricing-block">
            <div class="prices-wrap">
              <span class="current-price-inr">${FridayCart.formatINR(p.priceINR)}</span>
              <span class="mrp-strikethrough">${FridayCart.formatINR(p.mrpINR)}</span>
            </div>
            <span class="savings-amount">Save ${FridayCart.formatINR(p.mrpINR - p.priceINR)}</span>
          </div>

          <!-- Quick Action Buttons -->
          <div class="card-footer-btns">
            <button class="btn-quick-view" onclick="FridayApp.openQuickView('${p.id}')">
              Quick View
            </button>
            <button class="btn-add-to-bag" onclick="FridayCart.addItem(FRIDAY_PRODUCTS.find(x => x.id === '${p.id}'))">
              Add To Bag
            </button>
          </div>
        </div>
      </article>
    `).join('');
  },

  resetFilters() {
    this.activeCategory = 'all';
    this.activeFamily = 'all';
    this.activePriceBracket = 'all';
    this.activeGender = 'all';
    this.sortBy = 'featured';
    this.searchQuery = '';

    const searchInput = document.getElementById('headerSearchInput');
    if (searchInput) searchInput.value = '';

    const priceSelect = document.getElementById('filterPriceSelect');
    if (priceSelect) priceSelect.value = 'all';

    const genderSelect = document.getElementById('filterGenderSelect');
    if (genderSelect) genderSelect.value = 'all';

    const sortSelect = document.getElementById('filterSortSelect');
    if (sortSelect) sortSelect.value = 'featured';

    document.querySelectorAll('.cat-nav-btn').forEach(b => b.classList.remove('active'));
    document.querySelector('.cat-nav-btn[data-category="all"]').classList.add('active');

    document.querySelectorAll('.family-filter-pill').forEach(p => p.classList.remove('active'));
    document.querySelector('.family-filter-pill[data-family="all"]').classList.add('active');

    this.renderProductsGrid();
  }
};

window.FridayFilter = FridayFilter;
