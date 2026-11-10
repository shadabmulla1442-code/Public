# Impact Luxury Perfumes — Windows 11 + VS Code

A responsive perfume storefront with a password-protected admin dashboard. Built with HTML, CSS, browser JavaScript, Node.js and Express.

## Features

- Luxury dark storefront with responsive layout
- Product listing loaded from the server
- Shopping bag/cart stored in the browser
- Cash on Delivery checkout
- Admin login
- Add, edit and delete products
- Upload product photos (JPG, PNG, WEBP, GIF; max 5 MB)
- Change prices, descriptions, categories and stock
- View orders and update order status
- JSON file storage for starter/local use

## Requirements

- Windows 10/11
- Node.js 18 or newer (LTS recommended)
- VS Code

## Run on Windows

1. Extract the ZIP file to a folder, for example `C:\Projects\impact-luxury-perfumes`.
2. Open VS Code → File → Open Folder → choose the extracted project folder.
3. Open Terminal → New Terminal.
4. Check installation:

   ```powershell
   node -v
   npm -v
   ```

5. Install dependencies:

   ```powershell
   npm install
   ```

   If PowerShell blocks the npm script, use:

   ```powershell
   npm.cmd install
   ```

6. Copy `.env.example` to a new file named `.env` in the project root.
7. Edit `.env`. Change `ADMIN_PASSWORD` and `SESSION_SECRET` before using the admin dashboard. Example:

   ```env
   PORT=3000
   SESSION_SECRET=put-a-long-random-secret-here
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=YourStrongPasswordHere
   ```

8. Start the app:

   ```powershell
   npm start
   ```

9. Open the storefront: http://localhost:3000
10. Open the admin dashboard: http://localhost:3000/admin

Keep the terminal open while testing. Press `Ctrl+C` in the terminal to stop the server.

## Admin dashboard

- Default username: `admin`
- Default password in the example environment: `ChangeMe123!`
- Change the password in `.env` before logging in, especially before exposing the site to the internet.
- In the dashboard, choose **Products** → **Add Product** or **Edit**.
- Upload a photo, set the price and stock, then save.
- Use **Orders** to view COD orders and update their status.

## Where data is stored

- Product records: `data/products.json`
- Order records: `data/orders.json`
- Uploaded product images: `public/uploads/`

Back up these files and the uploads folder regularly. This JSON storage is intended for local testing and a small starter deployment, not high-traffic production.

## PhonePe / online payments

This starter currently supports Cash on Delivery. Online payment is intentionally not enabled in checkout. PhonePe credentials and API integration must be configured and tested with your merchant account before accepting online payments. Do not paste merchant secrets into `public/app.js`, HTML, or any browser-side file. Keep credentials on the server in `.env`. For production, follow PhonePe's current merchant documentation and complete payment status verification on the server before marking an order paid.

## Before production deployment

This project is a learning/starter implementation. Before accepting real customer orders online:
- Use HTTPS.
- Use a production session store (not Express's default in-memory store).
- Add CSRF protection and stronger authentication/MFA.
- Use a database such as PostgreSQL or MongoDB instead of JSON files.
- Add backups, monitoring, privacy/return/shipping policies and tax-compliant invoices.
- Configure secure cookies behind HTTPS.
- Review file upload security and payment integration.
- Test order, stock, and payment workflows.

## Troubleshooting

**`npm` is not recognized:** close and reopen VS Code after Node.js installation. Check `node -v` and `npm -v` in Command Prompt. Reinstall Node.js LTS and ensure npm package manager is selected if needed.

**PowerShell says scripts are disabled:** use `npm.cmd install` instead of `npm install`.

**Port 3000 is already in use:** change `PORT=3001` in `.env`, restart, then visit http://localhost:3001.

**Cannot log in:** confirm the `.env` file is in the same folder as `server.js`, check `ADMIN_USERNAME` and `ADMIN_PASSWORD`, then restart `npm start`.

**Image upload fails:** use JPG, PNG, WEBP or GIF under 5 MB.
