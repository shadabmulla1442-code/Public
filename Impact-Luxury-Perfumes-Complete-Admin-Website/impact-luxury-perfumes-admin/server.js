require("dotenv").config();
const express = require("express");
const session = require("express-session");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const multer = require("multer");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const app = express();
const PORT = Number(process.env.PORT || 3000);
const ROOT = __dirname;
const DATA = path.join(ROOT, "data");
const PRODUCTS_FILE = path.join(DATA, "products.json");
const ORDERS_FILE = path.join(DATA, "orders.json");
const UPLOADS = path.join(ROOT, "public", "uploads");

for (const dir of [DATA, UPLOADS]) fs.mkdirSync(dir, { recursive: true });
if (!fs.existsSync(PRODUCTS_FILE)) fs.writeFileSync(PRODUCTS_FILE, "[]");
if (!fs.existsSync(ORDERS_FILE)) fs.writeFileSync(ORDERS_FILE, "[]");

const appSecret = process.env.SESSION_SECRET;
if (!appSecret || appSecret === "replace-this-with-a-long-random-secret") {
  console.warn("WARNING: Set a unique SESSION_SECRET in your .env file before production use.");
}
if (!process.env.ADMIN_PASSWORD || process.env.ADMIN_PASSWORD === "ChangeMe123!") {
  console.warn("WARNING: Change ADMIN_PASSWORD in .env before using this dashboard publicly.");
}

app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(session({
  name: "impact.sid",
  secret: appSecret || "local-development-secret-change-me",
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, sameSite: "lax", secure: false, maxAge: 1000 * 60 * 60 * 8 }
}));
app.use(express.static(path.join(ROOT, "public")));

const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: "draft-7", legacyHeaders: false });
const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, UPLOADS),
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      cb(null, `${Date.now()}-${crypto.randomBytes(5).toString("hex")}${ext}`);
    }
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.mimetype)) {
      return cb(new Error("Only JPG, PNG, WEBP or GIF images are allowed."));
    }
    cb(null, true);
  }
});

function readJson(file) {
  try { return JSON.parse(fs.readFileSync(file, "utf8")); }
  catch { return []; }
}
function writeJson(file, value) {
  fs.writeFileSync(file, JSON.stringify(value, null, 2));
}
function requireAdmin(req, res, next) {
  if (!req.session.admin) return res.status(401).json({ error: "Please log in as admin." });
  next();
}
function safeProduct(p) {
  return {
    id: p.id, name: p.name, category: p.category || "Perfume",
    description: p.description || "", price: Number(p.price),
    stock: Number(p.stock || 0), image: p.image || "", featured: Boolean(p.featured)
  };
}

app.get("/api/products", (_req, res) => {
  const products = readJson(PRODUCTS_FILE).map(safeProduct);
  res.json(products);
});

app.post("/api/admin/login", loginLimiter, async (req, res) => {
  const { username, password } = req.body || {};
  const expectedUser = process.env.ADMIN_USERNAME || "admin";
  const expectedPassword = process.env.ADMIN_PASSWORD || "ChangeMe123!";
  if (username !== expectedUser || typeof password !== "string" ||
      !(await bcrypt.compare(password, await bcrypt.hash(expectedPassword, 10)))) {
    return res.status(401).json({ error: "Incorrect username or password." });
  }
  req.session.admin = true;
  res.json({ ok: true });
});
app.post("/api/admin/logout", (req, res) => {
  req.session.destroy(() => res.json({ ok: true }));
});
app.get("/api/admin/me", (req, res) => res.json({ authenticated: Boolean(req.session.admin) }));

app.post("/api/admin/upload", requireAdmin, (req, res) => {
  upload.single("image")(req, res, (err) => {
    if (err) return res.status(400).json({ error: err.message });
    if (!req.file) return res.status(400).json({ error: "Choose an image first." });
    res.json({ image: `/uploads/${req.file.filename}` });
  });
});

app.post("/api/admin/products", requireAdmin, (req, res) => {
  const { name, category, description, price, stock, image, featured } = req.body || {};
  if (!name || !Number.isFinite(Number(price)) || Number(price) < 0) {
    return res.status(400).json({ error: "Product name and a valid non-negative price are required." });
  }
  const products = readJson(PRODUCTS_FILE);
  const product = safeProduct({
    id: crypto.randomUUID(), name: String(name).trim(), category, description,
    price: Number(price), stock: Number(stock || 0), image, featured
  });
  products.unshift(product);
  writeJson(PRODUCTS_FILE, products);
  res.status(201).json(product);
});

app.put("/api/admin/products/:id", requireAdmin, (req, res) => {
  const products = readJson(PRODUCTS_FILE);
  const index = products.findIndex(p => p.id === req.params.id);
  if (index < 0) return res.status(404).json({ error: "Product not found." });
  const old = products[index];
  const body = req.body || {};
  const price = body.price === undefined ? old.price : Number(body.price);
  if (!body.name || !Number.isFinite(price) || price < 0) {
    return res.status(400).json({ error: "Product name and a valid price are required." });
  }
  products[index] = safeProduct({
    ...old, ...body, id: old.id, name: String(body.name).trim(),
    price, stock: Number(body.stock ?? old.stock), featured: Boolean(body.featured)
  });
  writeJson(PRODUCTS_FILE, products);
  res.json(products[index]);
});

app.delete("/api/admin/products/:id", requireAdmin, (req, res) => {
  const products = readJson(PRODUCTS_FILE);
  const next = products.filter(p => p.id !== req.params.id);
  if (next.length === products.length) return res.status(404).json({ error: "Product not found." });
  writeJson(PRODUCTS_FILE, next);
  res.json({ ok: true });
});

app.post("/api/orders", (req, res) => {
  const { customer, items, paymentMethod } = req.body || {};
  if (!customer || !customer.name || !customer.phone || !customer.address || !Array.isArray(items) || !items.length) {
    return res.status(400).json({ error: "Please provide contact, delivery details and cart items." });
  }
  if (paymentMethod !== "COD") {
    return res.status(400).json({ error: "Online payment is not enabled yet. Choose Cash on Delivery." });
  }
  const products = readJson(PRODUCTS_FILE);
  const orderItems = [];
  let total = 0;
  for (const item of items) {
    const product = products.find(p => p.id === item.id);
    const qty = Math.max(1, Math.min(20, Number(item.quantity) || 1));
    if (!product || Number(product.stock) < qty) return res.status(400).json({ error: `Product unavailable or insufficient stock: ${item.id}` });
    orderItems.push({ id: product.id, name: product.name, price: Number(product.price), quantity: qty });
    total += Number(product.price) * qty;
  }
  for (const item of orderItems) {
    const product = products.find(p => p.id === item.id);
    product.stock = Number(product.stock) - item.quantity;
  }
  writeJson(PRODUCTS_FILE, products);
  const orders = readJson(ORDERS_FILE);
  const order = {
    id: `IMP-${Date.now().toString().slice(-8)}`,
    createdAt: new Date().toISOString(),
    customer: {
      name: String(customer.name).slice(0, 100),
      phone: String(customer.phone).slice(0, 25),
      email: String(customer.email || "").slice(0, 120),
      address: String(customer.address).slice(0, 500)
    },
    items: orderItems, total, paymentMethod: "Cash on Delivery", status: "New"
  };
  orders.unshift(order);
  writeJson(ORDERS_FILE, orders);
  res.status(201).json({ ok: true, orderId: order.id, total });
});

app.get("/api/admin/orders", requireAdmin, (_req, res) => res.json(readJson(ORDERS_FILE)));
app.patch("/api/admin/orders/:id", requireAdmin, (req, res) => {
  const allowed = ["New", "Confirmed", "Packed", "Shipped", "Delivered", "Cancelled"];
  if (!allowed.includes(req.body.status)) return res.status(400).json({ error: "Invalid order status." });
  const orders = readJson(ORDERS_FILE);
  const order = orders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: "Order not found." });
  order.status = req.body.status;
  writeJson(ORDERS_FILE, orders);
  res.json(order);
});

app.get("/admin", (_req, res) => res.sendFile(path.join(ROOT, "public", "admin.html")));
app.get("/health", (_req, res) => res.json({ ok: true }));

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Server error. Check the VS Code terminal." });
});

app.listen(PORT, () => {
  console.log(`Impact Luxury Perfumes running at http://localhost:${PORT}`);
  console.log(`Admin dashboard: http://localhost:${PORT}/admin`);
});
