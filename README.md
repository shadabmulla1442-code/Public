# Impact Luxury Perfumes — Premium Animated Edition

A responsive black-and-gold perfume storefront with:
- Automatic hero banner slider and manual arrows/dots
- Product carousel with arrow and touch/trackpad scrolling
- Animated product cards, hover zoom, reveal effects and smooth transitions
- Shopping cart stored in the customer's browser
- Cash on Delivery checkout and order storage
- Admin login, product create/edit/delete, photo upload and order status management
- Configurable storage paths for deployment with a persistent disk

## 1. Windows 11 installation (VS Code)

1. Install Node.js LTS from https://nodejs.org/ if it is not installed.
2. Extract this ZIP file.
3. Open the extracted `Impact-Luxury-Perfumes-Premium` folder in VS Code.
4. In VS Code select **Terminal → New Terminal**.
5. Check Node and npm:
   ```powershell
   node -v
   npm -v
   ```
6. Install dependencies:
   ```powershell
   npm install
   ```
   If PowerShell blocks npm scripts, try:
   ```powershell
   npm.cmd install
   ```
7. Copy `.env.example` and name the copy `.env`.
8. Open `.env` and change `ADMIN_PASSWORD` and `SESSION_SECRET` to private values.
9. Start the website:
   ```powershell
   npm start
   ```
10. Open:
    - Store: http://localhost:3000
    - Admin: http://localhost:3000/admin

Default local admin username is `admin`. The example password in `.env.example` is only a setup placeholder. Change it before using the site.

To stop the server, return to the VS Code terminal and press `Ctrl + C`.

## 2. Add and manage products

1. Open `http://localhost:3000/admin`.
2. Sign in using the values from `.env`.
3. Select **Add Product** or edit an existing product.
4. Upload a JPG, PNG, WEBP or GIF image (maximum 5 MB), or enter an image URL.
5. Save. Orders appear in the Orders tab.

## 3. Publish with Render

This project is prepared for a Node web service. You must complete the deployment in your own Render account:

1. Upload this project to a private GitHub repository, or use Render's supported ZIP/Git deployment flow if available in your account.
2. In Render, create a **New → Web Service** and connect the repository.
3. Build command: `npm install`
4. Start command: `npm start`
5. Add environment variables:
   - `NODE_ENV` = `production`
   - `ADMIN_USERNAME` = your chosen admin username
   - `ADMIN_PASSWORD` = a strong, unique password
   - `SESSION_SECRET` = a long random secret (at least 32 random characters)
   - `DATA_DIR` = `/var/data`
   - `UPLOADS_DIR` = `/var/data/uploads`
6. Attach a persistent disk to the service, mounted at `/var/data`.
7. Deploy. Render will provide your public `https://...onrender.com` address after a successful deployment.

**Important:** Do not publish the `.env` file or share passwords/secrets in chat. This project stores product and order data in JSON files; use one persistent disk and one running service instance. Back up `/var/data` regularly. The built-in Express session store is in memory, so admin sessions are cleared on service restarts; for high-traffic production, replace it with a persistent session store.

## 4. Payments

Cash on Delivery is implemented. PhonePe online payment is **not integrated** in this edition. Do not collect online payments until a real PhonePe merchant account, credentials, server-side payment verification, webhook handling and production testing are configured.

## 5. Notes

- Product images initially use remote Unsplash image URLs. Replace them with your own licensed product photography in the admin dashboard.
- Uploaded product images are stored in `public/uploads` locally or in the configured `UPLOADS_DIR`.
- The site requires an internet connection for Google Fonts and the sample remote product photography.
