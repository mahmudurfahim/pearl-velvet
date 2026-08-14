/* Pearl Velvet — cart
   Cart lives in localStorage so it survives across the static pages
   without a backend. Structure: { "pv-01": qty, "pv-04": qty, ... } */

const PV_CART_KEY = "pearlvelvet_cart";

function pvGetCart() {
  try {
    const raw = localStorage.getItem(PV_CART_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

function pvSaveCart(cart) {
  localStorage.setItem(PV_CART_KEY, JSON.stringify(cart));
  pvUpdateCartBadge();
}

function pvAddToCart(id, qty = 1) {
  const cart = pvGetCart();
  cart[id] = (cart[id] || 0) + qty;
  pvSaveCart(cart);
}

function pvSetQty(id, qty) {
  const cart = pvGetCart();
  if (qty <= 0) {
    delete cart[id];
  } else {
    cart[id] = qty;
  }
  pvSaveCart(cart);
}

function pvRemoveFromCart(id) {
  const cart = pvGetCart();
  delete cart[id];
  pvSaveCart(cart);
}

function pvClearCart() {
  localStorage.removeItem(PV_CART_KEY);
  pvUpdateCartBadge();
}

function pvCartCount() {
  const cart = pvGetCart();
  return Object.values(cart).reduce((sum, q) => sum + q, 0);
}

function pvCartLines() {
  const cart = pvGetCart();
  return Object.entries(cart)
    .map(([id, qty]) => {
      const product = pvGetProduct(id);
      if (!product) return null;
      return { product, qty, subtotal: product.price * qty };
    })
    .filter(Boolean);
}

function pvCartTotals() {
  const lines = pvCartLines();
  const subtotal = lines.reduce((sum, l) => sum + l.subtotal, 0);
  const total = subtotal;
  return { subtotal, total, lineCount: lines.length };
}

function pvUpdateCartBadge() {
  document.querySelectorAll("[data-cart-count]").forEach((el) => {
    const count = pvCartCount();
    el.textContent = count;
    el.style.display = count > 0 ? "flex" : "none";
  });
}

document.addEventListener("DOMContentLoaded", pvUpdateCartBadge);
