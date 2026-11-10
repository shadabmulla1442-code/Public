const $ = (s) => document.querySelector(s);
let products = [];
let cart = JSON.parse(localStorage.getItem("impact-cart") || "[]");
const money = (n) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
function toast(message) { const el=$("#toast"); el.textContent=message; el.classList.add("show"); setTimeout(()=>el.classList.remove("show"),2600); }
function saveCart(){ localStorage.setItem("impact-cart",JSON.stringify(cart)); renderCart(); }
async function loadProducts(){
  try { const r=await fetch("/api/products"); products=await r.json(); renderProducts(); }
  catch { $("#productGrid").innerHTML="<p>Unable to load products. Please refresh.</p>"; }
}
function renderProducts(){
  $("#productGrid").innerHTML=products.map(p=>`
    <article class="product-card">
      <div class="product-photo">${p.image?`<img src="${p.image}" alt="${escapeHtml(p.name)}">`:`<div class="product-placeholder">IMPACT</div>`}</div>
      <div class="product-info"><small>${escapeHtml(p.category)}</small><h3>${escapeHtml(p.name)}</h3>
      <p>${escapeHtml(p.description)}</p><div class="product-bottom"><strong class="price">${money(p.price)}</strong>
      <button class="add-button" data-add="${p.id}" ${p.stock<=0?"disabled":""}>${p.stock<=0?"SOLD OUT":"ADD TO BAG"}</button></div></div>
    </article>`).join("");
  document.querySelectorAll("[data-add]").forEach(b=>b.addEventListener("click",()=>addToCart(b.dataset.add)));
}
function escapeHtml(s=""){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function addToCart(id){const p=products.find(x=>x.id===id);if(!p)return;const row=cart.find(x=>x.id===id);if(row)row.quantity++;else cart.push({id,quantity:1});saveCart();openCart();toast("Added to your bag.");}
function renderCart(){
  const count=cart.reduce((n,x)=>n+x.quantity,0);$("#cartCount").textContent=count;
  let total=0;
  $("#cartItems").innerHTML=cart.map(item=>{const p=products.find(x=>x.id===item.id);if(!p)return "";total+=p.price*item.quantity;return `<div class="cart-line"><span>${escapeHtml(p.name)} × ${item.quantity}<br>${money(p.price*item.quantity)}</span><button data-remove="${p.id}">REMOVE</button></div>`;}).join("")||"<p>Your bag is empty.</p>";
  $("#cartTotal").textContent=money(total);
  document.querySelectorAll("[data-remove]").forEach(b=>b.addEventListener("click",()=>{cart=cart.filter(x=>x.id!==b.dataset.remove);saveCart();}));
}
function openCart(){$("#cartDrawer").classList.add("open");$("#drawerBackdrop").classList.add("open");}
function closeCart(){$("#cartDrawer").classList.remove("open");$("#drawerBackdrop").classList.remove("open");}
$("#cartOpen").addEventListener("click",openCart);$("#cartClose").addEventListener("click",closeCart);$("#drawerBackdrop").addEventListener("click",closeCart);
$("#checkoutForm").addEventListener("submit",async e=>{
  e.preventDefault();if(!cart.length)return toast("Your bag is empty.");
  const form=new FormData(e.currentTarget);const customer=Object.fromEntries(form.entries());
  try{
    const r=await fetch("/api/orders",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({customer,items:cart,paymentMethod:"COD"})});
    const data=await r.json();if(!r.ok)throw new Error(data.error||"Could not place order.");
    cart=[];saveCart();e.currentTarget.reset();closeCart();alert(`Thank you! Your order ${data.orderId} is confirmed. Total: ${money(data.total)}. Payment: Cash on Delivery.`);await loadProducts();
  }catch(err){toast(err.message);}
});
$("#year").textContent=new Date().getFullYear();loadProducts();renderCart();
