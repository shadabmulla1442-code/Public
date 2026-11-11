/**
 * IMPACT LUXURY PERFUME - MAIN APPLICATION CONTROLLER
 * Hero Slider, Quick View, Indian Pin Code Validator, Batch Code Checker, Indian Payment Gateway
 */

document.addEventListener('DOMContentLoaded', () => {
  FridayApp.init();
});

const FridayApp = {
  currentHeroIndex: 0,
  heroTimer: null,
  activeQuickViewProduct: null,
  selectedQuickViewSize: null,
  wishlist: [],

  init() {
    this.initHeroSlider();
    this.initWishlist();
    this.initPaymentGateway();
    this.initPincodeChecker();
    this.initBatchChecker();
    this.initMobileNav();

    if (window.FridayCart) window.FridayCart.init();
    if (window.FridayFilter) window.FridayFilter.init();
  },

  /* ------------------------------------------------------------------
   * 1. HERO SLIDER CAROUSEL
   * ------------------------------------------------------------------ */
  initHeroSlider() {
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.hero-dot');
    const prevBtn = document.getElementById('heroPrevBtn');
    const nextBtn = document.getElementById('heroNextBtn');

    if (slides.length === 0) return;

    const showSlide = (idx) => {
      slides.forEach((s, i) => s.classList.toggle('active', i === idx));
      dots.forEach((d, i) => d.classList.toggle('active', i === idx));
      this.currentHeroIndex = idx;
    };

    const nextSlide = () => {
      const nextIdx = (this.currentHeroIndex + 1) % slides.length;
      showSlide(nextIdx);
    };

    const prevSlide = () => {
      const prevIdx = (this.currentHeroIndex - 1 + slides.length) % slides.length;
      showSlide(prevIdx);
    };

    if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetTimer(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetTimer(); });

    dots.forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        showSlide(idx);
        resetTimer();
      });
    });

    const startTimer = () => {
      this.heroTimer = setInterval(nextSlide, 5000);
    };

    const resetTimer = () => {
      clearInterval(this.heroTimer);
      startTimer();
    };

    startTimer();
  },

  /* ------------------------------------------------------------------
   * 2. WISHLIST ENGINE
   * ------------------------------------------------------------------ */
  initWishlist() {
    try {
      const saved = localStorage.getItem('impact_wishlist');
      if (saved) this.wishlist = JSON.parse(saved);
    } catch (e) {
      this.wishlist = [];
    }
    this.updateWishlistCount();
  },

  toggleWishlist(productId, btn) {
    const idx = this.wishlist.indexOf(productId);
    const prod = FRIDAY_PRODUCTS.find(p => p.id === productId);

    if (idx > -1) {
      this.wishlist.splice(idx, 1);
      if (btn) btn.classList.remove('active');
      if (window.FridayCart) window.FridayCart.showToast(`Removed from your wishlist.`);
    } else {
      this.wishlist.push(productId);
      if (btn) btn.classList.add('active');
      if (window.FridayCart) window.FridayCart.showToast(`Saved ${prod ? prod.name : 'product'} to IMPACT Wishlist! ❤️`);
    }

    localStorage.setItem('impact_wishlist', JSON.stringify(this.wishlist));
    this.updateWishlistCount();
  },

  updateWishlistCount() {
    const badge = document.getElementById('wishlistCountBadge');
    if (badge) {
      badge.textContent = this.wishlist.length;
      badge.style.display = this.wishlist.length > 0 ? 'inline-flex' : 'none';
    }
  },

  /* ------------------------------------------------------------------
   * 3. QUICK VIEW MODAL & BOTTLE VARIANT SWITCHER
   * ------------------------------------------------------------------ */
  openQuickView(productId) {
    const product = FRIDAY_PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    this.activeQuickViewProduct = product;
    const defaultSize = product.sizes.find(s => s.default) || product.sizes[0];
    this.selectedQuickViewSize = defaultSize.size;

    const modal = document.getElementById('fridayQuickViewModal');
    const container = document.getElementById('quickViewContent');
    if (!modal || !container) return;

    this.renderQuickViewDetails();
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  },

  closeQuickView() {
    const modal = document.getElementById('fridayQuickViewModal');
    if (modal) modal.classList.remove('active');
    document.body.style.overflow = '';
  },

  renderQuickViewDetails() {
    const p = this.activeQuickViewProduct;
    const container = document.getElementById('quickViewContent');
    if (!p || !container) return;

    const currentSize = p.sizes.find(s => s.size === this.selectedQuickViewSize) || p.sizes[0];

    container.innerHTML = `
      <div class="qv-grid">
        <!-- Visual Flacon Display Column -->
        <div class="qv-bottle-column">
          <div class="qv-flacon-wrapper" style="background: ${p.bottleStyle.color}; border: 1px solid ${p.bottleStyle.badgeColor}66;">
            <div class="flacon-cap" style="background: ${p.bottleStyle.capColor};"></div>
            <div class="flacon-reflection"></div>
            <div class="flacon-label-tag">
              <span class="brand-sub">${p.brand}</span>
              <span class="name-sub">${p.bottleStyle.label}</span>
            </div>
          </div>
          <div class="qv-authenticity-seal">
            <span class="seal-icon">🛡️</span>
            <span>100% Genuine Certified &bull; Official Grasse, UAE &amp; EU Sourcing</span>
          </div>
        </div>

        <!-- Product Information Column -->
        <div class="qv-info-column">
          <div class="qv-top-meta">
            <span class="qv-brand-title">${p.brand}</span>
            <div class="qv-rating-stars">
              <span class="stars-gold">★★★★★</span>
              <span>${p.rating} / 5.0 (${p.reviewsCount} Verified Buyers)</span>
            </div>
          </div>

          <h2 class="qv-product-name">${p.name}</h2>
          <p class="qv-tagline">&ldquo;${p.tagline}&rdquo;</p>
          <p class="qv-description">${p.description}</p>

          <!-- Price & Savings Display in Indian INR -->
          <div class="qv-price-card">
            <div class="qv-price-row">
              <span class="qv-selling-price">${FridayCart.formatINR(currentSize.price)}</span>
              <span class="qv-mrp-price">MRP: ${FridayCart.formatINR(currentSize.mrp)}</span>
              <span class="qv-discount-badge">${Math.round(((currentSize.mrp - currentSize.price) / currentSize.mrp) * 100)}% OFF</span>
            </div>
            <span class="qv-tax-note">Inclusive of all Indian GST Taxes &bull; Free Shipping Unlocked</span>
          </div>

          <!-- Volume / Size Switcher (Decants vs Full Flacons) -->
          <div class="qv-sizes-wrap">
            <label class="qv-sizes-label">Select Flacon Size / Decant:</label>
            <div class="qv-size-buttons-row">
              ${p.sizes.map(s => `
                <button type="button" 
                        class="qv-size-btn ${s.size === this.selectedQuickViewSize ? 'active' : ''}"
                        onclick="FridayApp.selectQuickViewSize('${s.size}')">
                  <span class="size-vol">${s.size}</span>
                  <span class="size-cost">${FridayCart.formatINR(s.price)}</span>
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Olfactory Pyramid Notes -->
          <div class="qv-notes-breakdown">
            <h4 class="qv-notes-head">Fragrance Notes Architecture</h4>
            <div class="notes-tier"><strong class="tier-k">Top Notes:</strong> ${p.notes.top.join(', ')}</div>
            <div class="notes-tier"><strong class="tier-k">Heart Notes:</strong> ${p.notes.middle.join(', ')}</div>
            <div class="notes-tier"><strong class="tier-k">Base Notes:</strong> ${p.notes.base.join(', ')}</div>
          </div>

          <!-- Indian PIN Code Delivery Estimator -->
          <div class="qv-pincode-estimator">
            <label class="pincode-lbl">Check Delivery Speed (India):</label>
            <div class="pincode-input-row">
              <input type="text" id="qvPincodeInput" placeholder="Enter 6-digit PIN (e.g. 110001)" maxlength="6">
              <button type="button" class="btn-check-pincode" onclick="FridayApp.checkPincode()">Check</button>
            </div>
            <div id="qvPincodeFeedback" class="pincode-feedback"></div>
          </div>

          <!-- Action CTA Row -->
          <div class="qv-cta-row">
            <button class="btn-qv-add-bag" onclick="FridayCart.addItem(FRIDAY_PRODUCTS.find(x => x.id === '${p.id}'), '${currentSize.size}'); FridayApp.closeQuickView();">
              Add To Bag &bull; ${FridayCart.formatINR(currentSize.price)}
            </button>
            <button class="btn-qv-buy-now" onclick="FridayCart.addItem(FRIDAY_PRODUCTS.find(x => x.id === '${p.id}'), '${currentSize.size}'); FridayApp.closeQuickView(); FridayCart.openIndianCheckoutGateway();">
              Express Buy Now ⚡
            </button>
          </div>
        </div>
      </div>
    `;
  },

  selectQuickViewSize(sizeTitle) {
    this.selectedQuickViewSize = sizeTitle;
    this.renderQuickViewDetails();
  },

  /* ------------------------------------------------------------------
   * 4. INDIAN PIN CODE CHECKER
   * ------------------------------------------------------------------ */
  initPincodeChecker() {
    // Handled in quick view
  },

  checkPincode() {
    const input = document.getElementById('qvPincodeInput');
    const feedback = document.getElementById('qvPincodeFeedback');
    if (!input || !feedback) return;

    const pin = input.value.trim();
    if (!/^\d{6}$/.test(pin)) {
      feedback.className = 'pincode-feedback error';
      feedback.innerHTML = `⚠️ Please enter a valid 6-digit Indian Postal PIN code.`;
      return;
    }

    feedback.className = 'pincode-feedback success';
    feedback.innerHTML = `
      <span>🚀 Express BlueDart / Delhivery Air service available for <strong>${pin}</strong>!</span>
      <small>Estimated Delivery: <strong>2 - 3 Business Days</strong> &bull; Cash on Delivery Available</small>
    `;
  },

  /* ------------------------------------------------------------------
   * 5. AUTHENTICITY BATCH CODE CHECKER TOOL
   * ------------------------------------------------------------------ */
  initBatchChecker() {
    const btn = document.getElementById('btnVerifyBatchCode');
    const input = document.getElementById('batchCodeInput');
    const feedback = document.getElementById('batchVerificationResult');

    if (!btn || !input || !feedback) return;

    btn.addEventListener('click', () => {
      const code = input.value.trim().toUpperCase();
      if (!code) {
        feedback.innerHTML = `<span class="batch-err">Please enter a valid batch code from your perfume box bottom.</span>`;
        return;
      }

      feedback.innerHTML = `
        <div class="batch-verified-card">
          <div class="batch-badge">✔ 100% ORIGINAL GENUINE BATCH VERIFIED BY IMPACT</div>
          <div class="batch-details">
            <div><strong>Batch Code:</strong> ${code}</div>
            <div><strong>Manufacturing Origin:</strong> Grasse / Paris / Dubai Official Facilities</div>
            <div><strong>Import Inspection:</strong> CDSCO Compliant &bull; Original Hologram Intact</div>
            <div><strong>Shelf Life:</strong> 36 Months remaining</div>
          </div>
        </div>
      `;
    });
  },

  /* ------------------------------------------------------------------
   * 6. INDIAN PAYMENT GATEWAY CHECKOUT MODAL
   * ------------------------------------------------------------------ */
  initPaymentGateway() {
    const modal = document.getElementById('indianPaymentModal');
    const closeBtn = document.getElementById('closePaymentModal');
    const paySubmitBtn = document.getElementById('btnSubmitIndianPayment');

    if (closeBtn && modal) {
      closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      });
    }

    // Payment Tab Switching (UPI vs Cards vs Net Banking vs COD)
    const methodTabs = document.querySelectorAll('.pay-method-tab');
    methodTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        methodTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const method = tab.getAttribute('data-method');
        document.querySelectorAll('.pay-content-panel').forEach(panel => {
          panel.classList.toggle('active', panel.getAttribute('data-method') === method);
        });

        // Update main button label
        const btnLabel = document.getElementById('checkoutPayButtonLabel');
        const finalAmt = FridayCart.getTotalINR();
        if (btnLabel) {
          if (method === 'cod') {
            btnLabel.textContent = `Confirm Cash on Delivery (${FridayCart.formatINR(finalAmt)})`;
          } else {
            btnLabel.textContent = `Pay ${FridayCart.formatINR(finalAmt)} securely via ${method.toUpperCase()}`;
          }
        }
      });
    });

    // Indian Payment Form Submission
    if (paySubmitBtn) {
      paySubmitBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.processIndianOrder();
      });
    }
  },

  processIndianOrder() {
    const nameInput = document.getElementById('custFullName');
    const phoneInput = document.getElementById('custPhone');
    const pinInput = document.getElementById('custPincode');
    const addressInput = document.getElementById('custAddress');

    if (!nameInput || !phoneInput || !pinInput || !addressInput) return;

    if (!nameInput.value.trim() || !phoneInput.value.trim() || !pinInput.value.trim() || !addressInput.value.trim()) {
      FridayCart.showToast('Please fill in your Delivery Address & 10-digit Mobile Number.');
      return;
    }

    if (!/^\d{10}$/.test(phoneInput.value.trim())) {
      FridayCart.showToast('Please enter a valid 10-digit Indian Mobile Number for SMS updates.');
      return;
    }

    // Show simulated loader on button
    const btn = document.getElementById('btnSubmitIndianPayment');
    const originalText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = `<span class="spinner-inline"></span> Connecting to IMPACT Secure Payment Server...`;

    setTimeout(() => {
      btn.disabled = false;
      btn.innerHTML = originalText;

      const modal = document.getElementById('indianPaymentModal');
      if (modal) modal.classList.remove('active');

      // Generate simulated Indian GST Invoice Voucher Modal
      this.showOrderConfirmationSuccess(nameInput.value.trim(), phoneInput.value.trim(), pinInput.value.trim());
      FridayCart.clearCart();
    }, 1800);
  },

  showOrderConfirmationSuccess(name, phone, pin) {
    const modal = document.getElementById('orderSuccessModal');
    if (!modal) return;

    const orderId = 'IMP-IN-' + Math.floor(100000 + Math.random() * 900000);
    const orderIdEl = document.getElementById('successOrderNumber');
    const orderCustomerEl = document.getElementById('successCustomerInfo');

    if (orderIdEl) orderIdEl.textContent = orderId;
    if (orderCustomerEl) {
      orderCustomerEl.innerHTML = `
        <strong>Consignee:</strong> ${name} &bull; +91 ${phone}<br>
        <strong>Delivery Destination:</strong> Pin Code ${pin} (Express Air Dispatch by IMPACT)<br>
        <strong>GST Invoice:</strong> HSN 33030090 (Perfumery Products) &bull; 100% Tax Compliant
      `;
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  },

  initMobileNav() {
    const toggle = document.getElementById('mobileNavToggle');
    const nav = document.getElementById('fridayCategoryNav');
    if (!toggle || !nav) return;

    toggle.addEventListener('click', () => {
      nav.classList.toggle('open');
      toggle.classList.toggle('active');
    });
  }
};

window.FridayApp = FridayApp;
