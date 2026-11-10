const money = n => new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:0}).format(n);
const $ = s => document.querySelector(s);
let products = [], cart = JSON.parse(localStorage.getItem("impactCart") || "[]");
const toast = msg => { const el=$("#toast"); el.textContent=msg; el.classList.add("show"); setTimeout(()=>el.classList.remove("show"),2400); };
function saveCart(){localStorage.setItem("impactCart",JSON.stringify(cart));renderCart();}
function renderProducts(){
  const track=$("#productTrack");
  if(!products.length){track.innerHTML='<p class="loading">Our collection is being refreshed. Please check back soon.</p>';return;}
  track.innerHTML=products.map(p=>`<article class="product-card"><div class="product-image"><img loading="lazy" src="${escapeAttr(p.image)}" alt="${escapeAttr(p.name)}" onerror="this.src='https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=900&q=80'">${p.featured?'<span class="product-tag">SIGNATURE</span>':''}</div><div class="product-info"><small>${escapeHtml(p.category||"Signature")}</small><h3>${escapeHtml(p.name)}</h3><p>${escapeHtml(p.description||"A distinctive fragrance for every occasion.")}</p><div class="product-bottom"><div class="price">${money(Number(p.price))}${p.oldPrice?`<span class="old-price">${money(Number(p.oldPrice))}</span>`:""}</div><button class="add-btn" data-add="${escapeAttr(p.id)}">ADD TO BAG +</button></div></div></article>`).join("");
  const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add("visible");observer.unobserve(e.target)}}),{threshold:.08});
  document.querySelectorAll(".product-card").forEach(c=>observer.observe(c));
}
function escapeHtml(v=""){return String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function escapeAttr(v=""){return escapeHtml(v);}
function renderCart(){
  $("#cartCount").textContent=cart.reduce((s,x)=>s+x.qty,0);
  const host=$("#cartItems");
  if(!cart.length)host.innerHTML='<p class="empty-cart">Your bag is waiting for something special.</p>';
  else host.innerHTML=cart.map(x=>`<div class="cart-row"><img src="${escapeAttr(x.image)}" alt=""><div><h4>${escapeHtml(x.name)}</h4><small>${money(x.price)}</small><div class="qty-controls"><button data-qty="${x.id}" data-delta="-1">−</button><span>${x.qty}</span><button data-qty="${x.id}" data-delta="1">+</button></div></div><button class="remove-item" data-remove="${x.id}">Remove</button></div>`).join("");
  $("#cartTotal").textContent=money(cart.reduce((s,x)=>s+x.price*x.qty,0));
}
document.addEventListener("click",e=>{
  const add=e.target.closest("[data-add]");if(add){const p=products.find(x=>x.id===add.dataset.add);if(!p)return;const found=cart.find(x=>x.id===p.id);if(found)found.qty++;else cart.push({id:p.id,name:p.name,price:Number(p.price),image:p.image,qty:1});saveCart();toast(p.name+" added to your bag.");}
  const qty=e.target.closest("[data-qty]");if(qty){const item=cart.find(x=>x.id===qty.dataset.qty);if(item){item.qty+=Number(qty.dataset.delta);if(item.qty<=0)cart=cart.filter(x=>x.id!==item.id);saveCart();}}
  const rem=e.target.closest("[data-remove]");if(rem){cart=cart.filter(x=>x.id!==rem.dataset.remove);saveCart();}
});
function openCart(open){$("#cartDrawer").classList.toggle("open",open);$("#cartOverlay").classList.toggle("open",open);}
$("#cartOpen").onclick=()=>openCart(true);$("#cartClose").onclick=()=>openCart(false);$("#cartOverlay").onclick=()=>openCart(false);
$("#checkoutOpen").onclick=()=>{if(!cart.length){toast("Your bag is empty.");return;}openCart(false);$("#checkoutModal").classList.add("open");};
$("#checkoutClose").onclick=()=>$("#checkoutModal").classList.remove("open");
$("#checkoutModal").addEventListener("click",e=>{if(e.target.id==="checkoutModal")$("#checkoutModal").classList.remove("open");});
$("#checkoutForm").addEventListener("submit",async e=>{
  e.preventDefault();const btn=e.submitter;btn.disabled=true;btn.textContent="PLACING ORDER…";const msg=$("#checkoutMessage");msg.textContent="";
  const form=Object.fromEntries(new FormData(e.target).entries());
  try{const res=await fetch("/api/orders",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({...form,items:cart.map(x=>({id:x.id,qty:x.qty}))})});const data=await res.json();if(!res.ok)throw new Error(data.error||"Could not place order.");cart=[];saveCart();e.target.reset();$("#checkoutModal").classList.remove("open");toast("Order confirmed: "+data.orderId); }
  catch(err){msg.textContent=err.message;}finally{btn.disabled=false;btn.innerHTML='PLACE MY ORDER <span>→</span>';}
});
let slide=0;const slides=[...document.querySelectorAll(".hero-slide")],dots=[...document.querySelectorAll("#sliderDots button")];
function showSlide(n){slide=(n+slides.length)%slides.length;slides.forEach((s,i)=>s.classList.toggle("active",i===slide));dots.forEach((d,i)=>d.classList.toggle("selected",i===slide));}
$("#prevSlide").onclick=()=>showSlide(slide-1);$("#nextSlide").onclick=()=>showSlide(slide+1);dots.forEach((d,i)=>d.onclick=()=>showSlide(i));
let sliderTimer=setInterval(()=>showSlide(slide+1),6000);
$(".hero").addEventListener("mouseenter",()=>clearInterval(sliderTimer));$(".hero").addEventListener("mouseleave",()=>sliderTimer=setInterval(()=>showSlide(slide+1),6000));
$("#productsPrev").onclick=()=>$("#productTrack").scrollBy({left:-320,behavior:"smooth"});$("#productsNext").onclick=()=>$("#productTrack").scrollBy({left:320,behavior:"smooth"});
$("#year").textContent=new Date().getFullYear();
fetch("/api/products").then(r=>r.json()).then(data=>{products=data;renderProducts();}).catch(()=>{$("#productTrack").innerHTML='<p class="loading">Unable to load products right now.</p>';});
renderCart();
