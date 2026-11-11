/**
 * IMPACT LUXURY PERFUME - CART STATE & INDIAN INR PAYMENT GATEWAY SYSTEM
 * Full INR (₹) Currency, UPI (GPay/PhonePe/Paytm), RuPay Cards, Netbanking & COD Support
 */

const FridayCart = {
  items: [],
  paymentMode: 'prepaid', // 'prepaid' (extra 5% off) or 'cod'
  freeShippingThresholdINR: 999,
  freeGiftThresholdINR: 2999,
  appliedPromo: null,
  validPromos: {
    'IMPACT10': { type: 'percent', value: 0.10, label: 'IMPACT10 - Flat 10% Luxury Privilege' },
    'IMPACT20': { type: 'percent', value: 0.20, label: 'IMPACT20 - 20% Maison VIP Privilege' },
    'FRIDAY10': { type: 'percent', value: 0.10, label: 'FRIDAY10 - Flat 10% Festive Off' },
    'WELCOME150': { type: 'fixed', value: 150, minSpend: 1500, label: 'WELCOME150 - ₹150 Off First Order' },
    'NICHE500': { type: 'fixed', value: 500, minSpend: 6000, label: 'NICHE500 - ₹500 Luxury Privilege' }
  },

  init() {
    this.loadCart();
    this.bindEvents();
    this.renderCartUI();
  },

  loadCart() {
    try {
      const saved = localStorage.getItem('impact_perfume_cart');
      if (saved) {
        this.items = JSON.parse(saved);
      }
    } catch (e) {
      this.items = [];
    }
  },

  saveCart() {
    try {
      localStorage.setItem('impact_perfume_cart', JSON.stringify(this.items));
    } catch (e) {
      console.warn('Could not save cart', e);
    }
  },

  formatINR(amount) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(Math.round(amount));
  },

  addItem(product, chosenSizeTitle = null) {
    const sizeObj = chosenSizeTitle
      ? product.sizes.find(s => s.size === chosenSizeTitle) || product.sizes[0]
      : (product.sizes.find(s => s.default) || product.sizes[0]);

    const itemKey = `${product.id}-${sizeObj.size.replace(/\s+/g, '')}`;

    const existingIndex = this.items.findIndex(it => it.key === itemKey);
    if (existingIndex > -1) {
      this.items[existingIndex].quantity += 1;
    } else {
      this.items.push({
        key: itemKey,
        id: product.id,
        brand: product.brand,
        name: product.name,
        size: sizeObj.size,
        priceINR: sizeObj.price,
        mrpINR: sizeObj.mrp,
        bottleStyle: product.bottleStyle,
        quantity: 1
      });
    }

    this.saveCart();
    this.renderCartUI();
    this.openDrawer();
    this.showToast(`Added ${product.name} (${sizeObj.size}) to your IMPACT Bag!`);
  },

  updateQuantity(itemKey, delta) {
    const index = this.items.findIndex(it => it.key === itemKey);
    if (index === -1) return;

    this.items[index].quantity += delta;
    if (this.items[index].quantity <= 0) {
      this.items.splice(index, 1);
      this.showToast('Item removed from shopping bag.');
    }
    this.saveCart();
    this.renderCartUI();
  },

  removeItem(itemKey) {
    this.items = this.items.filter(it => it.key !== itemKey);
    this.saveCart();
    this.renderCartUI();
    this.showToast('Item removed.');
  },

  clearCart() {
    this.items = [];
    this.appliedPromo = null;
    this.saveCart();
    this.renderCartUI();
  },

  setPaymentMode(mode) {
    this.paymentMode = mode;
    this.renderCartUI();
  },

  getSubtotalINR() {
    return this.items.reduce((sum, it) => sum + (it.priceINR * it.quantity), 0);
  },

  getMrpTotalINR() {
    return this.items.reduce((sum, it) => sum + (it.mrpINR * it.quantity), 0);
  },

  getPromoDiscountINR() {
    if (!this.appliedPromo) return 0;
    const subtotal = this.getSubtotalINR();
    const promo = this.appliedPromo;
    if (promo.type === 'percent') {
      return subtotal * promo.value;
    }
    if (promo.type === 'fixed') {
      return Math.min(promo.value, subtotal);
    }
    return 0;
  },

  getPrepaidDiscountINR() {
    // 5% Extra Instant Discount when paying via UPI / Netbanking / RuPay / Cards
    if (this.paymentMode === 'prepaid') {
      const discountedSubtotal = this.getSubtotalINR() - this.getPromoDiscountINR();
      return Math.max(0, discountedSubtotal * 0.05);
    }
    return 0;
  },

  getShippingINR() {
    const subtotal = this.getSubtotalINR();
    if (subtotal === 0) return 0;
    if (subtotal >= this.freeShippingThresholdINR) return 0;
    return 99; // Express shipping flat ₹99 below ₹999
  },

  getCodHandlingFeeINR() {
    if (this.paymentMode === 'cod') {
      const subtotal = this.getSubtotalINR();
      return subtotal > 0 && subtotal < 1500 ? 50 : 0; // ₹50 COD convenience if below ₹1,500
    }
    return 0;
  },

  getTotalINR() {
    const subtotal = this.getSubtotalINR();
    const promoDisc = this.getPromoDiscountINR();
    const prepaidDisc = this.getPrepaidDiscountINR();
    const shipping = this.getShippingINR();
    const codFee = this.getCodHandlingFeeINR();

    return Math.max(0, subtotal - promoDisc - prepaidDisc + shipping + codFee);
  },

  applyPromoCode(code) {
    const clean = code.trim().toUpperCase();
    if (this.validPromos[clean]) {
      const promo = this.validPromos[clean];
      const subtotal = this.getSubtotalINR();
      if (promo.minSpend && subtotal < promo.minSpend) {
        return { success: false, message: `Minimum cart value of ₹${promo.minSpend} required for ${clean}` };
      }
      this.appliedPromo = { ...promo, code: clean };
      this.renderCartUI();
      return { success: true, message: `Privilege code applied: ${promo.label}` };
    }
    return { success: false, message: 'Invalid or expired privilege coupon code.' };
  },

  removePromo() {
    this.appliedPromo = null;
    this.renderCartUI();
  },

  openDrawer() {
    const drawer = document.getElementById('bagDrawer');
    const overlay = document.getElementById('bagOverlay');
    if (drawer && overlay) {
      drawer.classList.add('open');
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  },

  closeDrawer() {
    const drawer = document.getElementById('bagDrawer');
    const overlay = document.getElementById('bagOverlay');
    if (drawer && overlay) {
      drawer.classList.remove('open');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  },

  showToast(message, duration = 3000) {
    let container = document.getElementById('fridayToastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'fridayToastContainer';
      container.className = 'friday-toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'friday-toast';
    toast.innerHTML = `
      <div class="toast-indicator"></div>
      <div class="toast-body">
        <span class="toast-check">✔</span>
        <span class="toast-msg">${message}</span>
      </div>
    `;

    container.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 350);
    }, duration);
  },

  renderCartUI() {
    const badge = document.getElementById('bagItemCountBadge');
    const totalCount = this.items.reduce((acc, it) => acc + it.quantity, 0);
    if (badge) {
      badge.textContent = totalCount;
      badge.style.display = totalCount > 0 ? 'inline-flex' : 'none';
    }

    const subtotalINR = this.getSubtotalINR();
    const mrpTotalINR = this.getMrpTotalINR();
    const promoDisc = this.getPromoDiscountINR();
    const prepaidDisc = this.getPrepaidDiscountINR();
    const shippingINR = this.getShippingINR();
    const codFeeINR = this.getCodHandlingFeeINR();
    const finalTotalINR = this.getTotalINR();
    const totalSavings = (mrpTotalINR - subtotalINR) + promoDisc + prepaidDisc;

    // Free Express Courier Progress Bar
    const progressFill = document.getElementById('bagProgressFill');
    const progressText = document.getElementById('bagProgressText');
    if (progressFill && progressText) {
      const remaining = Math.max(0, this.freeShippingThresholdINR - subtotalINR);
      const pct = Math.min(100, (subtotalINR / this.freeShippingThresholdINR) * 100);
      progressFill.style.width = `${pct}%`;
      if (remaining === 0 && subtotalINR > 0) {
        progressText.innerHTML = `🎉 <strong>Congratulations! You have Unlocked FREE Express Shipping!</strong>`;
      } else {
        progressText.innerHTML = `Add <strong>${this.formatINR(remaining)}</strong> more for <strong>FREE Express Pan-India Delivery!</strong>`;
      }
    }

    // Free Gift Sample Vial Banner (> ₹2,999)
    const giftBanner = document.getElementById('freeGiftBanner');
    if (giftBanner) {
      if (subtotalINR >= this.freeGiftThresholdINR) {
        giftBanner.style.display = 'flex';
        giftBanner.innerHTML = `
          <span class="gift-icon">🎁</span>
          <div class="gift-text">
            <strong>Complimentary 5ml IMPACT Niche Decant Vial Unlocked!</strong>
            <small>Included automatically in your luxury package</small>
          </div>
        `;
      } else {
        const giftRemaining = this.freeGiftThresholdINR - subtotalINR;
        giftBanner.style.display = 'flex';
        giftBanner.innerHTML = `
          <span class="gift-icon">🎁</span>
          <div class="gift-text">
            Add <strong>${this.formatINR(giftRemaining)}</strong> more to get a <strong>FREE 5ml Luxury Sample Vial!</strong>
          </div>
        `;
      }
    }

    const itemsContainer = document.getElementById('bagItemsContainer');
    const emptyState = document.getElementById('bagEmptyState');
    const footer = document.getElementById('bagFooter');

    if (this.items.length === 0) {
      if (itemsContainer) itemsContainer.innerHTML = '';
      if (emptyState) emptyState.style.display = 'flex';
      if (footer) footer.style.display = 'none';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';
    if (footer) footer.style.display = 'block';

    if (itemsContainer) {
      itemsContainer.innerHTML = this.items.map(it => `
        <div class="bag-item" data-key="${it.key}">
          <div class="bag-item-bottle-thumb" style="background: ${it.bottleStyle.color}; border: 1px solid ${it.bottleStyle.badgeColor}44;">
            <div class="thumb-cap" style="background: ${it.bottleStyle.capColor};"></div>
            <span class="thumb-lbl">${it.bottleStyle.label}</span>
          </div>
          <div class="bag-item-info">
            <div class="bag-item-head">
              <div>
                <span class="bag-brand-tag">${it.brand}</span>
                <h4 class="bag-item-name">${it.name}</h4>
                <span class="bag-item-size">${it.size} &bull; 100% Authentic Flacon</span>
              </div>
              <button class="bag-btn-remove" onclick="FridayCart.removeItem('${it.key}')" title="Remove">&times;</button>
            </div>
            <div class="bag-item-bottom">
              <div class="bag-qty-stepper">
                <button type="button" onclick="FridayCart.updateQuantity('${it.key}', -1)">-</button>
                <span>${it.quantity}</span>
                <button type="button" onclick="FridayCart.updateQuantity('${it.key}', 1)">+</button>
              </div>
              <div class="bag-item-prices">
                <span class="bag-item-mrp">${this.formatINR(it.mrpINR * it.quantity)}</span>
                <span class="bag-item-selling">${this.formatINR(it.priceINR * it.quantity)}</span>
              </div>
            </div>
          </div>
        </div>
      `).join('');
    }

    // Calculation Lines
    const subtotalEl = document.getElementById('bagSubtotal');
    const shippingEl = document.getElementById('bagShipping');
    const discountRow = document.getElementById('bagPromoRow');
    const discountEl = document.getElementById('bagPromoVal');
    const prepaidRow = document.getElementById('bagPrepaidRow');
    const prepaidEl = document.getElementById('bagPrepaidVal');
    const codRow = document.getElementById('bagCodFeeRow');
    const codEl = document.getElementById('bagCodFeeVal');
    const totalEl = document.getElementById('bagFinalTotal');
    const savingsEl = document.getElementById('bagTotalSavingsNote');

    if (subtotalEl) subtotalEl.textContent = this.formatINR(subtotalINR);
    if (shippingEl) shippingEl.textContent = shippingINR === 0 ? 'FREE' : this.formatINR(shippingINR);
    if (totalEl) totalEl.textContent = this.formatINR(finalTotalINR);

    // Promo code line
    if (discountRow && discountEl) {
      if (promoDisc > 0 && this.appliedPromo) {
        discountRow.style.display = 'flex';
        discountEl.innerHTML = `-${this.formatINR(promoDisc)} <button onclick="FridayCart.removePromo()" class="btn-remove-coupon">&times;</button>`;
      } else {
        discountRow.style.display = 'none';
      }
    }

    // Prepaid Extra 5% Discount
    if (prepaidRow && prepaidEl) {
      if (this.paymentMode === 'prepaid' && prepaidDisc > 0) {
        prepaidRow.style.display = 'flex';
        prepaidEl.textContent = `-${this.formatINR(prepaidDisc)}`;
      } else {
        prepaidRow.style.display = 'none';
      }
    }

    // COD handling line
    if (codRow && codEl) {
      if (this.paymentMode === 'cod' && codFeeINR > 0) {
        codRow.style.display = 'flex';
        codEl.textContent = this.formatINR(codFeeINR);
      } else {
        codRow.style.display = 'none';
      }
    }

    // Total Savings Callout
    if (savingsEl) {
      if (totalSavings > 0) {
        savingsEl.style.display = 'block';
        savingsEl.innerHTML = `🎉 Total Savings on this order: <strong>${this.formatINR(totalSavings)}</strong>`;
      } else {
        savingsEl.style.display = 'none';
      }
    }
  },

  bindEvents() {
    const trigger = document.getElementById('bagTriggerBtn');
    const overlay = document.getElementById('bagOverlay');
    const closeBtn = document.getElementById('closeBagDrawer');

    if (trigger) trigger.addEventListener('click', () => this.openDrawer());
    if (overlay) overlay.addEventListener('click', () => this.closeDrawer());
    if (closeBtn) closeBtn.addEventListener('click', () => this.closeDrawer());

    // Payment mode radios inside drawer
    const prepaidRadio = document.getElementById('payModePrepaid');
    const codRadio = document.getElementById('payModeCod');
    if (prepaidRadio) {
      prepaidRadio.addEventListener('change', () => this.setPaymentMode('prepaid'));
    }
    if (codRadio) {
      codRadio.addEventListener('change', () => this.setPaymentMode('cod'));
    }

    // Coupon code form
    const applyBtn = document.getElementById('btnApplyBagCoupon');
    const input = document.getElementById('bagCouponInput');
    if (applyBtn && input) {
      applyBtn.addEventListener('click', () => {
        const val = input.value;
        if (!val) return;
        const res = this.applyPromoCode(val);
        this.showToast(res.message);
        if (res.success) input.value = '';
      });
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          applyBtn.click();
        }
      });
    }

    // Checkout button
    const checkoutBtn = document.getElementById('btnBagProceedCheckout');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => {
        if (this.items.length === 0) return;
        this.openIndianCheckoutGateway();
      });
    }
  },

  openIndianCheckoutGateway() {
    this.closeDrawer();
    const modal = document.getElementById('indianPaymentModal');
    if (!modal) return;

    // Populate checkout figures
    const finalAmt = this.getTotalINR();
    const totalEl = document.getElementById('checkoutTotalAmount');
    const subtotalEl = document.getElementById('checkoutSubtotalAmount');
    const finalBtnEl = document.getElementById('checkoutPayButtonLabel');

    if (totalEl) totalEl.textContent = this.formatINR(finalAmt);
    if (subtotalEl) subtotalEl.textContent = this.formatINR(this.getSubtotalINR());
    if (finalBtnEl) finalBtnEl.textContent = `Pay ${this.formatINR(finalAmt)} securely`;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
};

window.FridayCart = FridayCart;
