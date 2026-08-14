/* Pearl Velvet — product detail page */

document.addEventListener("DOMContentLoaded", () => {
  const id = new URLSearchParams(location.search).get("id");
  const product = pvGetProduct(id) || PV_PRODUCTS[0];
  let qty = 1;

  document.title = `${product.name} — Pearl Velvet`;
  document.getElementById("pd-breadcrumb").innerHTML =
    `<a href="index.html">Home</a> / <a href="shop.html">Shop</a> / <a href="shop.html?cat=${encodeURIComponent(product.category)}">${product.category}</a> / ${product.name}`;

  const root = document.getElementById("product-detail-root");
  root.innerHTML = `
    <div class="pd-media" style="background:${product.swatch}">
      ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ""}
      <span class="pv-mono">PV · ${product.id}</span>
    </div>
    <div class="pd-info">
      <span class="product-cat">${product.category}</span>
      <h1>${product.name}</h1>
      <div class="pd-price-row">
        <span class="pd-price">${pvFormatPrice(product.price)}</span>
        ${product.compareAt ? `<span class="pd-compare">${pvFormatPrice(product.compareAt)}</span>` : ""}
      </div>
      <div class="pd-stock">${product.stock > 5 ? "● In stock, ready to ship" : `● Only ${product.stock} left`}</div>
      <p class="pd-desc">${product.description}</p>

      <div class="pd-qty-row">
        <div class="qty-stepper">
          <button type="button" id="qty-minus" aria-label="Decrease quantity">−</button>
          <span id="qty-value">1</span>
          <button type="button" id="qty-plus" aria-label="Increase quantity">+</button>
        </div>
        <span style="font-family:var(--font-mono);font-size:12px;color:rgba(26,20,32,0.5);">Max ${product.stock} per order</span>
      </div>

      <div class="pd-actions">
        <button class="btn btn-gold" id="add-to-cart-btn">Add to bag</button>
        <a href="cart.html" class="btn btn-outline-dark" id="buy-now-btn">Buy now</a>
      </div>

      <div class="pd-badges">
        <span>✓ Cash on delivery</span>
        <span>✓ 7-day returns</span>
        <span>✓ Hand-packed</span>
      </div>

      <div class="pd-accordion" style="margin-top:34px;">
        <div class="acc-item open">
          <button class="acc-trigger">The details <span class="plus">+</span></button>
          <div class="acc-panel" style="max-height:300px;">
            <ul>${product.details.map((d) => `<li>${d}</li>`).join("")}</ul>
          </div>
        </div>
        <div class="acc-item">
          <button class="acc-trigger">Shipping & returns <span class="plus">+</span></button>
          <div class="acc-panel"><ul>
            <li>Free shipping on every order — no minimum spend.</li>
            <li>Delivered in 2–7 business days depending on location.</li>
            <li>7-day returns on unworn pieces; earrings are final sale.</li>
          </ul></div>
        </div>
        <div class="acc-item">
          <button class="acc-trigger">Care instructions <span class="plus">+</span></button>
          <div class="acc-panel"><ul>
            <li>Keep away from perfume, lotion and water where possible.</li>
            <li>Store flat in the included pouch, away from sunlight.</li>
            <li>Wipe with a soft dry cloth after wearing.</li>
          </ul></div>
        </div>
      </div>
    </div>
  `;

  // qty stepper
  const qtyValue = document.getElementById("qty-value");
  document.getElementById("qty-minus").addEventListener("click", () => {
    qty = Math.max(1, qty - 1);
    qtyValue.textContent = qty;
  });
  document.getElementById("qty-plus").addEventListener("click", () => {
    qty = Math.min(product.stock, qty + 1);
    qtyValue.textContent = qty;
  });

  document.getElementById("add-to-cart-btn").addEventListener("click", () => {
    pvAddToCart(product.id, qty);
    pvShowToast(`Added ${qty} × "${product.name}" to your bag.`, "cart.html", "View bag");
  });

  document.getElementById("buy-now-btn").addEventListener("click", (e) => {
    e.preventDefault();
    pvAddToCart(product.id, qty);
    location.href = "checkout.html";
  });

  // accordion behaviour
  document.querySelectorAll(".acc-trigger").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const item = trigger.closest(".acc-item");
      const panel = item.querySelector(".acc-panel");
      const isOpen = item.classList.contains("open");
      item.classList.toggle("open");
      panel.style.maxHeight = isOpen ? null : panel.scrollHeight + "px";
    });
  });

  pvRenderPearlStrand(document.getElementById("pd-strand"), 22);

  // related products: same category, excluding current
  const related = PV_PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);
  const fallback = related.length ? related : PV_PRODUCTS.filter((p) => p.id !== product.id).slice(0, 4);
  pvRenderProductGrid(document.getElementById("related-grid"), fallback);
});
