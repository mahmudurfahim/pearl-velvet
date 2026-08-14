/* Pearl Velvet — shared render helpers */

function pvProductCardHTML(p) {
  return `
    <a class="product-card" href="product.html?id=${p.id}" data-id="${p.id}">
      <div class="product-swatch" style="background:${p.swatch}">
        ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ""}
        <span class="pv-mono">PV · ${p.id.split("-")[1]}</span>
        <button class="product-quick" data-quick-add="${p.id}" aria-label="Add ${p.name} to cart" title="Quick add to cart">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 5v14M5 12h14"/></svg>
        </button>
      </div>
      <span class="product-cat">${p.category}</span>
      <h3 class="product-name">${p.name}</h3>
      <div class="product-price">
        <span>${pvFormatPrice(p.price)}</span>
        ${p.compareAt ? `<span class="compare">${pvFormatPrice(p.compareAt)}</span>` : ""}
      </div>
    </a>
  `;
}

function pvRenderProductGrid(container, products) {
  if (!container) return;
  if (!products.length) {
    container.innerHTML = `<div class="empty-state">No pieces match those filters yet. Try clearing one.</div>`;
    return;
  }
  container.innerHTML = products.map(pvProductCardHTML).join("");
  container.querySelectorAll("[data-quick-add]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      pvAddToCart(btn.dataset.quickAdd, 1);
      const p = pvGetProduct(btn.dataset.quickAdd);
      pvShowToast(`Added "${p.name}" to your bag.`, "cart.html", "View bag");
    });
  });
}

function pvRenderPearlStrand(el, count = 24, dark = false) {
  if (!el) return;
  el.classList.add("pearl-strand");
  if (dark) el.classList.add("dark");
  let html = "";
  for (let i = 0; i < count; i++) {
    html += `<span style="animation-delay:${(i * 0.03).toFixed(2)}s"></span>`;
  }
  el.innerHTML = html;
}
