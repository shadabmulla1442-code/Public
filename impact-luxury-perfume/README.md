# IMPACT LUXURY PERFUME &mdash; Premium Fragrance Store (India)

A premier, high-converting luxury perfume e-commerce store branded as **IMPACT Luxury Perfume**, built with the world-class shopping architecture inspired by **[FridayCharm.com](https://www.fridaycharm.com)**.

Engineered with 100% **Indian Rupee (INR ₹)** pricing, authentic Indian payment methods (UPI, GPay, PhonePe, Paytm, RuPay, Net Banking, and Pan-India Cash on Delivery), real-time search autocomplete, 6-digit Indian PIN code delivery checkers, and batch code authenticity verification.

---

## 🇮🇳 Indian Payment Methods (All in INR ₹)

1. **Instant UPI Payments**:
   - Google Pay (GPay), PhonePe, Paytm, BHIM, and Cred UPI.
   - Dynamic QR code generation & UPI ID / VPA field (`mobile@upi` or `user@okhdfcbank`).
   - **Automatic 5% Instant Discount** applied on prepaid UPI & Card orders!

2. **Cash on Delivery (COD)**:
   - Available Pan-India with automated SMS/WhatsApp OTP verification note and tamper-proof security courier dispatch.

3. **Debit & Credit Cards**:
   - RuPay, Visa, and Mastercard with 16-digit card validation, expiry, and CVV.

4. **Net Banking**:
   - Direct integration for HDFC Bank, State Bank of India (SBI), ICICI Bank, Axis Bank, Kotak, and PNB.

---

## ✨ Features & Architecture

- **Store Name**: **IMPACT LUXURY PERFUME** (*Haute Parfumerie &bull; 100% Authentic &bull; India*)
- **Catalog**:
  - Exclusive House Creations: **Impact Noir Absolu (32% Extrait)** and **Impact L'Or Sublime Extrait**.
  - Viral Middle Eastern Hits: **Armaf Club de Nuit Pure Parfum**, **Lattafa Khamrah**, **Rasasi Hawas**, **Afnan 9PM**.
  - Iconic Designer Scents: **Dior Sauvage Elixir**, **Bleu de Chanel Parfum**, **Tom Ford Black Orchid**, **Versace Eros Flame**.
  - Haute Niche: **Creed Aventus (Paris Batch)**, **Parfums de Marly Layton**, **Baccarat Rouge 540 Extrait**, **Mancera Red Tobacco**.
- **Live Search & Autocomplete**:
  - Instant suggestions matching brands (IMPACT, Dior, Creed, Armaf, Lattafa), perfume names, and olfactory notes with real-time thumbnail previews and discount badges.
- **Indian Postal PIN Code Delivery Estimator**:
  - Enter any 6-digit Indian PIN code (e.g. `110001` or `400001`) to check BlueDart / Delhivery Air transit speeds in real time.
- **Batch Code Authenticity Verification Tool**:
  - Enter perfume batch codes to verify CDSCO compliance, authorized importation, and shelf life.
- **Free Express Courier Meter**:
  - Automatically calculates threshold to unlock free shipping on orders above ₹999.
- **Free 5ml Luxury Sample Decant**:
  - Automatically unlocked on cart values above ₹2,999.
- **Decant & Travel Atomizer Switcher**:
  - Switch between 10ml travel decants and full 100ml/150ml flacons with instant price recalculations.
- **GST-Compliant Invoicing**:
  - HSN code `33030090` (Perfumery Products) with 18% GST calculation included and simulated delivery dispatch receipt.

---

## 📍 File Locations & Project Structure

* **Project Directory:**  
  `C:\Users\Admin\.gemini\antigravity\scratch\fridaycharm-perfume-store`

* **Main Entry File (Website):**  
  `C:\Users\Admin\.gemini\antigravity\scratch\fridaycharm-perfume-store\index.html`

```
fridaycharm-perfume-store/
├── index.html              # Main IMPACT Luxury Perfume storefront and modals
├── css/
│   ├── style.css           # Header, live search, hero slider, cards, trust bar, footer
│   └── components.css      # Cart drawer, Indian payment gateway, quick view, modals, toasts
├── js/
│   ├── data.js             # Authentic perfume database with Indian MRPs, selling prices in ₹
│   ├── cart.js             # Bag state, UPI 5% discount, COD fee logic, and INR currency formatter
│   ├── filter.js           # Search autocomplete, olfactory families, and price filters
│   └── app.js              # Hero slider, quick view, PIN checker, batch checker, payment gateway
└── README.md               # Complete documentation
```

---

## 🚀 How to Run the Website

### Option 1: Instant Launch (PowerShell)
```powershell
Start-Process "C:\Users\Admin\.gemini\antigravity\scratch\fridaycharm-perfume-store\index.html"
```

### Option 2: Local HTTP Server (Python)
```powershell
cd "C:\Users\Admin\.gemini\antigravity\scratch\fridaycharm-perfume-store"
python -m http.server 8080
```
Then visit **`http://localhost:8080`** in your browser.

---

## 🎁 Active Test Coupon Codes
- `IMPACT10` &mdash; Flat 10% Luxury Privilege
- `IMPACT20` &mdash; Flat 20% Maison VIP Privilege
- `WELCOME150` &mdash; Flat ₹150 Off on orders above ₹1,500
- `NICHE500` &mdash; Flat ₹500 Off on orders above ₹6,000
