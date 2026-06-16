// app.js — Vanilla JS prototype for Fruit Shop
// - Manages product listing, details, cart (localStorage), and a simple checkout flow

const STORAGE_KEY = 'fruitshop_cart'

// Fallback placeholder (SVG data URI) used when an image fails to load
const PLACEHOLDER_IMAGE = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600"><rect width="100%" height="100%" fill="%23f3f4f6"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23999" font-family="Arial, Helvetica, sans-serif" font-size="24">Image unavailable</text></svg>'

// Sample product data (could be moved to data/products.json)
const PRODUCTS = [
  {
    id: 'gala-apple',
    name: 'Gala Apple',
    price: 1.29,
    unit: 'each',
    image: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=800',
    shortDescription: 'Sweet, crisp Gala apples.'
  },
  {
    id: 'banana',
    name: 'Banana',
    price: 0.39,
    unit: 'each',
    image: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=800',
    shortDescription: 'Ripe bananas, perfect for smoothies.'
  },
  {
    id: 'navel-orange',
    name: 'Navel Orange',
    price: 0.79,
    unit: 'each',
    image: 'https://images.unsplash.com/photo-1547514701-42782101795e?w=800',
    shortDescription: 'Juicy navel oranges.'
  },
  {
    id: 'strawberries',
    name: 'Strawberries (pint)',
    price: 3.99,
    unit: 'pint',
    image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=800',
    shortDescription: 'Fresh strawberries.'
  },
  {
    id: 'blueberries',
    name: 'Blueberries (pint)',
    price: 4.49,
    unit: 'pint',
    image: 'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=800',
    shortDescription: 'Organic blueberries.'
  },
  {
    id: 'pineapple',
    name: 'Pineapple',
    price: 2.99,
    unit: 'each',
    image: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=800',
    shortDescription: 'Tropical pineapple.'
  },
  {
    id: 'kiwi',
    name: 'Kiwi',
    price: 0.79,
    unit: 'each',
    image: 'https://images.unsplash.com/photo-1585059895524-72359e06133a?w=800',
    shortDescription: 'Tangy kiwi fruits.'
  },
  {
    id: 'mango',
    name: 'Mango',
    price: 1.49,
    unit: 'each',
    image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=800',
    shortDescription: 'Juicy mango.'
  }
]
// -----------------------------
// Cart utilities
// -----------------------------
function loadCart(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw? JSON.parse(raw) : []
  }catch(e){
    console.warn('Failed to load cart from storage', e)
    return []
  }
}
// track last known cart count to animate badge on change
let lastCartCount = 0
function saveCart(cart){
  try{
    localStorage.setItem(STORAGE_KEY,JSON.stringify(cart))
  }catch(e){
    console.warn('Failed to save cart to storage', e)
  }
}
function findProduct(id){return PRODUCTS.find(p=>p.id===id)}

// Adds product with qty (merge if exists)
function addToCart(productId, qty=1){
  const cart = loadCart()
  const idx = cart.findIndex(i=>i.productId===productId)
  if(idx>-1){cart[idx].quantity += qty}
  else{const p=findProduct(productId); if(!p) return; cart.push({productId:p.id,name:p.name,price:p.price,quantity:qty,image:p.image,unit:p.unit})}
  saveCart(cart); renderCartCount();
}
function updateCartQuantity(productId, quantity){
  const cart = loadCart()
  const idx = cart.findIndex(i=>i.productId===productId)
  if(idx>-1){
    if(quantity<=0){cart.splice(idx,1)} else {cart[idx].quantity = quantity}
    saveCart(cart); renderCartView(); renderCartCount();
  }
}
function removeFromCart(productId){
  const cart = loadCart().filter(i=>i.productId!==productId)
  saveCart(cart); renderCartView(); renderCartCount();
}

// -----------------------------
// Rendering
// -----------------------------
const $ = sel => document.querySelector(sel)

function renderProductGrid(){
  const grid = $('#product-grid'); grid.innerHTML=''
  PRODUCTS.forEach(p=>{
    const card = document.createElement('div'); card.className='product-card'
    card.innerHTML = `
      <img src="${p.image}" alt="${p.name}">
      <div class="product-title">${p.name}</div>
      <div class="product-price">$${p.price.toFixed(2)}</div>
      <div class="muted">${p.shortDescription}</div>
      <div class="card-actions">
        <input class="qty-input" type="number" value="1" min="1" max="99" aria-label="Quantity for ${p.name}">
        <button class="btn add-btn">Add</button>
        <button class="btn" data-id="${p.id}" data-action="view">View</button>
      </div>`
    grid.appendChild(card)
    // ensure image fallback if a remote image fails
    const imgEl = card.querySelector('img')
    imgEl.onerror = () => { imgEl.onerror = null; imgEl.src = PLACEHOLDER_IMAGE }
    // attach handlers
    const addBtn = card.querySelector('.add-btn')
    addBtn.addEventListener('click',()=>{
      const qty = parseInt(card.querySelector('.qty-input').value)||1
      addToCart(p.id,qty)
      showToast(`${p.name} added to cart`,'success')
    })
    const viewBtn = card.querySelector('button[data-action="view"]')
    viewBtn.addEventListener('click',()=>showDetails(p.id))
  })
}

function renderDetails(productId){
  const p = findProduct(productId); if(!p) return showListing()
  const out = $('#details-content'); out.innerHTML = `
    <img src="${p.image}" alt="${p.name}">
    <div>
      <h2>${p.name}</h2>
      <div class="product-price">$${p.price.toFixed(2)}</div>
      <p class="muted">${p.shortDescription}</p>
      <p>Lorem ipsum dolor sit amet — full description placeholder.</p>
      <div class="card-actions">
        <input id="details-qty" class="qty-input" type="number" value="1" min="1" max="99">
        <button id="details-add" class="btn primary">Add to cart</button>
      </div>
    </div>`
  $('#details-add').addEventListener('click',()=>{const q = parseInt($('#details-qty').value)||1; addToCart(p.id,q); showToast(`${p.name} added to cart`,'success');})
  // image fallback
  const detImg = out.querySelector('img')
  if(detImg){ detImg.onerror = () => { detImg.onerror = null; detImg.src = PLACEHOLDER_IMAGE } }
}

function cartTotals(cart){
  const subtotal = cart.reduce((s,i)=>s + i.price * i.quantity,0)
  // simple tax and shipping placeholders
  const tax = +(subtotal * 0.07).toFixed(2)
  const shipping = subtotal > 20 || subtotal===0? 0 : 4.99
  const total = +(subtotal + tax + shipping).toFixed(2)
  return {subtotal: +subtotal.toFixed(2), tax, shipping, total}
}

function renderCartView(){
  const container = $('#cart-contents');
  const cart = loadCart()
  if(cart.length===0){container.innerHTML='<p>Your cart is empty.</p>'; return}
  container.innerHTML=''
  cart.forEach(item=>{
    const row = document.createElement('div'); row.className='cart-row'
    row.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div class="meta"><div><strong>${item.name}</strong></div><div class="muted">$${item.price.toFixed(2)} ${item.unit||''}</div></div>
      <div>
        <input class="qty-input" type="number" min="1" max="99" value="${item.quantity}" data-id="${item.productId}">
      </div>
      <div>$${(item.price * item.quantity).toFixed(2)}</div>
      <div><button class="btn remove-btn" data-id="${item.productId}">Remove</button></div>`
    container.appendChild(row)
    // image fallback for cart rows
    const imgEl = row.querySelector('img')
    if(imgEl){ imgEl.onerror = () => { imgEl.onerror = null; imgEl.src = PLACEHOLDER_IMAGE } }
  })
  // totals
  const t = cartTotals(cart)
  const totalsNode = document.createElement('div'); totalsNode.className='cart-totals'
  totalsNode.innerHTML = `
    <div>Subtotal: $${t.subtotal.toFixed(2)}</div>
    <div>Tax: $${t.tax.toFixed(2)}</div>
    <div>Shipping: $${t.shipping.toFixed(2)}</div>
    <div><strong>Total: $${t.total.toFixed(2)}</strong></div>
    <div style="margin-top:8px"><button id="continue-shopping" class="btn">Continue Shopping</button> <button id="to-checkout" class="btn primary">Proceed to Checkout</button></div>`
  container.appendChild(totalsNode)

  // attach qty handlers
  container.querySelectorAll('.qty-input').forEach(input=>{
    input.addEventListener('change',e=>{
      const id = e.target.dataset.id; const q = parseInt(e.target.value)||1
      updateCartQuantity(id,q)
    })
  })
  container.querySelectorAll('.remove-btn').forEach(b=>b.addEventListener('click',e=>{removeFromCart(e.target.dataset.id); showToast('Item removed','info')}))
  $('#continue-shopping').addEventListener('click',showListing)
  $('#to-checkout').addEventListener('click',()=>showView('checkout'))
}

function renderCartCount(){
  const cnt = loadCart().reduce((s,i)=>s+i.quantity,0)
  const el = $('#cart-count')
  if(!el) return
  el.textContent = cnt
  // animate when the count changes
  if(cnt !== lastCartCount){
    el.classList.remove('cart-count-animate')
    // force reflow to restart animation
    void el.offsetWidth
    el.classList.add('cart-count-animate')
    // remove class after animation duration
    setTimeout(()=> el.classList.remove('cart-count-animate'), 380)
  }
  lastCartCount = cnt
}

// -----------------------------
// UI helpers & routing
// -----------------------------
function showView(viewId){
  document.querySelectorAll('.view').forEach(v=>v.classList.add('hidden'))
  document.getElementById(viewId+'-view')?.classList.remove('hidden')
  if(viewId==='cart') renderCartView()
  if(viewId==='listing') renderProductGrid()
  if(viewId==='checkout') renderOrderSummary()
}
function showListing(){ showView('listing') }
function showDetails(id){ showView('details'); renderDetails(id) }
function showCart(){ showView('cart') }

function showToast(message, type='info', timeout=2800){
  // Ensure container
  let container = document.querySelector('.toast-container')
  if(!container){ container = document.createElement('div'); container.className = 'toast-container'; document.body.appendChild(container) }

  const item = document.createElement('div')
  item.className = `toast-item ${type}`
  item.textContent = message
  // dismiss on click
  item.addEventListener('click', ()=>{ item.remove() })
  container.appendChild(item)

  // auto-dismiss with a slight exit transition
  setTimeout(()=>{
    item.style.transition = 'opacity .18s, transform .18s'
    item.style.opacity = '0'
    item.style.transform = 'translateY(12px)'
    setTimeout(()=>item.remove(), 180)
  }, timeout)
}

// Checkout helpers
function renderOrderSummary(){
  const aside = $('#order-summary'); const cart = loadCart()
  if(!aside) return
  if(cart.length===0){aside.innerHTML='<p>Cart is empty.</p>'; return}
  const t = cartTotals(cart)
  aside.innerHTML = '<h3>Order Summary</h3>' + cart.map(i=>`<div>${i.name} x${i.quantity} — $${(i.price*i.quantity).toFixed(2)}</div>`).join('') + `<hr><div><strong>Total: $${t.total.toFixed(2)}</strong></div>`
}

// Place order (demo)
function placeOrder(formData){
  const cart = loadCart(); if(cart.length===0) return showToast('Cart empty')
  // compute totals before clearing cart
  const totals = cartTotals(cart)
  // Simple client-side validation already handled by form; create order ref
  const ref = 'FS-' + Math.random().toString(36).slice(2,9).toUpperCase()
  // clear cart
  saveCart([]); renderCartCount()
  // show confirmation with totals and order reference
  showView('confirmation')
  $('#confirmation-content').innerHTML = `
    <p><strong>Order ${ref}</strong> received.</p>
    <p>We've sent a confirmation to <strong>${escapeHtml(formData.get('email')||'')}</strong>.</p>
    <p><strong>Total:</strong> $${totals.total.toFixed(2)}</p>
  `
}

// small helper to avoid HTML injection from form values
function escapeHtml(str){
  if(!str) return ''
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;')
}

// Event wiring
function wireUp(){
  // nav links
  document.querySelectorAll('[data-view]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault(); const v = a.dataset.view; if(v==='cart') showView('cart'); else showView(v); closeMobileNavIfOpen() }))
  $('#cart-button').addEventListener('click',showCart)
  $('#back-to-list').addEventListener('click',showListing)
  $('#continue-shopping')?.addEventListener('click',showListing)

  // hamburger menu toggle for mobile
  const hamburger = document.getElementById('hamburger')
  const mainNav = document.querySelector('.main-nav')
  if(hamburger && mainNav){
    hamburger.addEventListener('click',()=>{
      const isOpen = mainNav.classList.toggle('open')
      hamburger.setAttribute('aria-expanded', String(isOpen))
    })
    // close menu on escape
    document.addEventListener('keydown', (e)=>{ if(e.key==='Escape' && mainNav.classList.contains('open')){ mainNav.classList.remove('open'); hamburger.setAttribute('aria-expanded','false') } })
  }

  // checkout form
  $('#checkout-form').addEventListener('submit',e=>{e.preventDefault(); const fd = new FormData(e.target); placeOrder(fd) })

  // simple search
  $('#search-input').addEventListener('input',e=>{
    const q = e.target.value.toLowerCase()
    document.querySelectorAll('.product-card').forEach(card=>{
      const t = card.querySelector('.product-title').textContent.toLowerCase()
      card.style.display = t.includes(q)? '' : 'none'
    })
  })

  // continue shopping button on confirmation
  $('#continue-shopping').addEventListener('click',showListing)
}

function closeMobileNavIfOpen(){
  const mainNav = document.querySelector('.main-nav')
  const hamburger = document.getElementById('hamburger')
  if(mainNav && mainNav.classList.contains('open')){ mainNav.classList.remove('open'); if(hamburger) hamburger.setAttribute('aria-expanded','false') }
}

// Init
function init(){ renderProductGrid(); renderCartCount(); wireUp(); showListing() }

document.addEventListener('DOMContentLoaded',init)
