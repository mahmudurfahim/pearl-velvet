/* Pearl Velvet — cart page */

function pvRenderCartPage() {
  const root = document.getElementById("cart-root");
  const lines = pvCartLines();

  if (!lines.length) {
    root.innerHTML = `
      <div class="empty-cart">
        <span class="eyebrow">Bag</span>
        <h2>Your bag is empty</h2>
        <p>Nothing here yet — go find something in pearl or velvet.</p>
        <a href="shop.html" class="btn btn-gold">Start shopping</a>
      </div>
    `;
    return;
  }

  const totals = pvCartTotals();

  root.innerHTML = `
    <div class="cart-layout">
      <div class="cart-lines">
        ${lines.map((l) => `
          <div class="cart-line" data-line="${l.product.id}">
            <a href="product.html?id=${l.product.id}" class="cart-line-swatch" style="background:${l.product.swatch};display:block;"></a>
            <div>
              <div class="cart-line-cat">${l.product.category}</div>
              <a href="product.html?id=${l.product.id}" class="cart-line-name" style="display:block;">${l.product.name}</a>
              <div class="qty-stepper" style="margin-top:10px;">
                <button type="button" data-step="-1">−</button>
                <span>${l.qty}</span>
                <button type="button" data-step="1">+</button>
              </div>
              <button class="cart-line-remove" data-remove style="margin-top:10px;">Remove</button>
            </div>
            <div></div>
            <div class="cart-line-price">${pvFormatPrice(l.subtotal)}</div>
          </div>
        `).join("")}
        <div style="padding-top:24px;">
          <a href="shop.html" class="btn-ghost">← Continue shopping</a>
        </div>
      </div>

      <div class="summary-card">
        <h3>Order summary</h3>
        <div class="summary-row"><span>Subtotal</span><span>${pvFormatPrice(totals.subtotal)}</span></div>
        <div class="summary-row"><span>Shipping</span><span>Free</span></div>
        <div class="summary-row total"><span>Total (pay on delivery)</span><span>${pvFormatPrice(totals.total)}</span></div>
        <p class="summary-note">Free shipping and Cash on Delivery on every order, anywhere in Bangladesh.</p>
        <a href="checkout.html" class="btn btn-gold btn-block">Proceed to checkout</a>
      </div>
    </div>
  `;

  root.querySelectorAll("[data-step]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.closest("[data-line]").dataset.line;
      const cart = pvGetCart();
      const next = (cart[id] || 0) + Number(btn.dataset.step);
      pvSetQty(id, next);
      pvRenderCartPage();
    });
  });

  root.querySelectorAll("[data-remove]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.closest("[data-line]").dataset.line;
      pvRemoveFromCart(id);
      pvRenderCartPage();
    });
  });
}

document.addEventListener("DOMContentLoaded", pvRenderCartPage);
