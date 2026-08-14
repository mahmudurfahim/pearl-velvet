/* Pearl Velvet — order confirmation page */

document.addEventListener("DOMContentLoaded", () => {
  const orderId = new URLSearchParams(location.search).get("order");
  const allOrders = JSON.parse(localStorage.getItem("pearlvelvet_orders") || "[]");
  const order = allOrders.find((o) => o.id === orderId);
  const root = document.getElementById("success-root");

  if (!order) {
    root.innerHTML = `
      <div class="success-wrap">
        <h1>We couldn't find that order</h1>
        <p>It may have already been viewed on a different device, or the link is incomplete.</p>
        <div class="success-actions" style="margin-top:30px;">
          <a href="shop.html" class="btn btn-gold">Continue shopping</a>
        </div>
      </div>
    `;
    return;
  }

  const eta = new Date(Date.now() + 5 * 86400000).toLocaleDateString("en-GB", { day: "numeric", month: "long" });

  root.innerHTML = `
    <div class="success-wrap">
      <div class="success-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6 9 17l-5-5"/></svg>
      </div>
      <span class="eyebrow" style="justify-content:center;">Order confirmed</span>
      <h1 style="margin-top:16px;">Thank you, ${order.customer.name.split(" ")[0]}.</h1>
      <p>Your order is confirmed and will be prepared for dispatch. Pay ${pvFormatPrice(order.totals.total)} in cash when it arrives.</p>
      <div class="order-id">Order ${order.id}</div>

      <div class="success-summary">
        <h4>Delivery details</h4>
        <dl class="success-detail-grid">
          <div><dt>Name</dt><dd>${order.customer.name}</dd></div>
          <div><dt>Phone</dt><dd>${order.customer.phone}</dd></div>
          <div><dt>Email</dt><dd>${order.customer.email}</dd></div>
          <div><dt>Estimated delivery</dt><dd>By ${eta}</dd></div>
          <div style="grid-column:1/-1;"><dt>Address</dt><dd>${order.shipping.address1}${order.shipping.address2 ? ", " + order.shipping.address2 : ""}, ${order.shipping.city}, ${order.shipping.state} – ${order.shipping.pincode}</dd></div>
          ${order.shipping.notes ? `<div style="grid-column:1/-1;"><dt>Delivery notes</dt><dd>${order.shipping.notes}</dd></div>` : ""}
        </dl>
      </div>

      <div class="success-summary">
        <h4>Items (${order.items.reduce((s, i) => s + i.qty, 0)})</h4>
        ${order.items.map((i) => `
          <div class="review-line">
            <div>
              <div class="rl-name">${i.name}</div>
              <div class="rl-qty">Qty ${i.qty}</div>
            </div>
            <div class="rl-price">${pvFormatPrice(i.subtotal)}</div>
          </div>
        `).join("")}
        <div class="summary-row" style="margin-top:16px;"><span>Subtotal</span><span>${pvFormatPrice(order.totals.subtotal)}</span></div>
        <div class="summary-row"><span>Shipping</span><span>Free</span></div>
        <div class="summary-row total"><span>Total due on delivery</span><span>${pvFormatPrice(order.totals.total)}</span></div>
      </div>

      <div class="success-actions">
        <a href="shop.html" class="btn btn-gold">Continue shopping</a>
        <a href="index.html" class="btn btn-outline-dark">Back to home</a>
      </div>
    </div>
  `;
});
