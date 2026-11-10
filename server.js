const express = require("express");
const session = require("express-session");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

const app = express();
const PORT = process.env.PORT || 3000;
const ROOT = __dirname;
const DATA_DIR = path.resolve(process.env.DATA_DIR || path.join(ROOT, "data"));
const UPLOADS_DIR = path.resolve(process.env.UPLOADS_DIR || path.join(ROOT, "public", "uploads"));
const PRODUCTS_FILE = path.join(DATA_DIR, "products.json");
const ORDERS_FILE = path.join(DATA_DIR, "orders.json");

fs.mkdirSync(DATA_DIR, { recursive: true });
fs.mkdirSync(UPLOADS_DIR, { recursive: true });
function readJson(file, fallback) {
  try { return JSON.parse(fs.readFileSync(file, "utf8")); } catch { return fallback; }
}
function writeJson(file, data) {
  const temp = file + ".tmp";
  fs.writeFileSync(temp, JSON.stringify(data, null, 2));
  fs.renameSync(temp, file);
}
const getProducts = () => readJson(PRODUCTS_FILE, []);
const getOrders = () => readJson(ORDERS_FILE, []);
const saveProducts = (items) => writeJson(PRODUCTS_FILE, items);
const saveOrders = (items) => writeJson(ORDERS_FILE, items);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.set("trust proxy", 1);
app.use(session({
  name: "impact.sid",
  secret: process.env.SESSION_SECRET || "development-only-change-this-secret",
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", maxAge: 8 * 60 * 60 * 1000 }
}));
app.use(express.static(path.join(ROOT, "public")));

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase().replace(/[^.a-z0-9]/g, "");
    cb(null, crypto.randomBytes(12).toString("hex") + ext);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => cb(null, /^image\/(jpeg|png|webp|gif)$/.test(file.mimetype))
});
const requireAdmin = (req, res, next) => req.session && req.session.admin ? next() : res.status(401).json({ error: "Please sign in as admin." });

app.get("/api/products", (_req, res) => res.json(getProducts()));
app.post("/api/orders", (req, res) => {
  const { customer, items, address, phone, email, notes } = req.body || {};
  if (!customer || !phone || !address || !Array.isArray(items) || !items.length) return res.status(400).json({ error: "Please complete your name, phone, address and cart." });
  const products = getProducts();
  let total = 0;
  const safeItems = [];
  for (const item of items) {
    const product = products.find(p => p.id === item.id);
    const qty = Math.max(1, Math.min(20, Number(item.qty) || 1));
    if (!product) return res.status(400).json({ error: "A selected product is no longer available." });
    total += Number(product.price) * qty;
    safeItems.push({ id: product.id, name: product.name, price: Number(product.price), qty });
  }
  const orders = getOrders();
  const order = {
    id: "IP-" + Date.now().toString().slice(-8),
    createdAt: new Date().toISOString(),
    customer: String(customer).slice(0,100), phone: String(phone).slice(0,30),
    email: String(email || "").slice(0,120), address: String(address).slice(0,600),
    notes: String(notes || "").slice(0,500), items: safeItems, total, paymentMethod: "Cash on Delivery", status: "New"
  };
  orders.unshift(order); saveOrders(orders);
  res.status(201).json({ message: "Order placed successfully.", orderId: order.id });
});

app.post("/api/admin/login", (req, res) => {
  const username = process.env.ADMIN_USERNAME || "admin";
  const password = process.env.ADMIN_PASSWORD || "ChangeThisPassword123!";
  if (req.body.username !== username || req.body.password !== password) return res.status(401).json({ error: "Incorrect username or password." });
  req.session.admin = true;
  res.json({ ok: true });
});
app.post("/api/admin/logout", requireAdmin, (req, res) => req.session.destroy(() => res.json({ ok: true })));
app.get("/api/admin/me", (req, res) => res.json({ authenticated: !!(req.session && req.session.admin) }));
app.get("/api/admin/orders", requireAdmin, (_req, res) => res.json(getOrders()));
app.patch("/api/admin/orders/:id", requireAdmin, (req, res) => {
  const orders = getOrders();
  const order = orders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: "Order not found." });
  const allowed = ["New", "Processing", "Shipped", "Completed", "Cancelled"];
  if (!allowed.includes(req.body.status)) return res.status(400).json({ error: "Invalid status." });
  order.status = req.body.status; saveOrders(orders); res.json(order);
});
app.post("/api/admin/products", requireAdmin, upload.single("image"), (req, res) => {
  const { name, category, price, oldPrice, description, featured, imageUrl } = req.body;
  if (!name || !Number.isFinite(Number(price))) return res.status(400).json({ error: "Product name and valid price are required." });
  const products = getProducts();
  const product = {
    id: "p" + crypto.randomBytes(7).toString("hex"),
    name: String(name).slice(0,100), category: String(category || "Signature").slice(0,60),
    price: Number(price), oldPrice: Number(oldPrice) || 0,
    description: String(description || "").slice(0,500),
    image: req.file ? "/uploads/" + req.file.filename : String(imageUrl || "").slice(0,1000),
    featured: featured === "true" || featured === "on"
  };
  products.unshift(product); saveProducts(products); res.status(201).json(product);
});
app.put("/api/admin/products/:id", requireAdmin, upload.single("image"), (req, res) => {
  const products = getProducts(); const p = products.find(x => x.id === req.params.id);
  if (!p) return res.status(404).json({ error: "Product not found." });
  const b = req.body;
  if (b.name) p.name = String(b.name).slice(0,100);
  if (b.category !== undefined) p.category = String(b.category).slice(0,60);
  if (b.price !== undefined && Number.isFinite(Number(b.price))) p.price = Number(b.price);
  if (b.oldPrice !== undefined) p.oldPrice = Number(b.oldPrice) || 0;
  if (b.description !== undefined) p.description = String(b.description).slice(0,500);
  if (b.featured !== undefined) p.featured = b.featured === "true" || b.featured === "on";
  if (req.file) p.image = "/uploads/" + req.file.filename;
  else if (b.imageUrl) p.image = String(b.imageUrl).slice(0,1000);
  saveProducts(products); res.json(p);
});
app.delete("/api/admin/products/:id", requireAdmin, (req, res) => {
  const products = getProducts(); const next = products.filter(p => p.id !== req.params.id);
  if (next.length === products.length) return res.status(404).json({ error: "Product not found." });
  saveProducts(next); res.json({ ok: true });
});
app.get("/health", (_req, res) => res.json({ ok: true }));
app.get("/admin", (_req, res) => res.sendFile(path.join(ROOT, "public", "admin.html")));
app.get("*", (_req, res) => res.sendFile(path.join(ROOT, "public", "index.html")));

app.listen(PORT, () => console.log(`Impact Luxury Perfumes running on http://localhost:${PORT}`));
