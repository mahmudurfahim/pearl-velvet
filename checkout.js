/* Pearl Velvet — checkout page
   No payment gateway: this is Cash on Delivery only. On submit we
   validate the form, build an order record, store it in localStorage
   (key: pearlvelvet_orders) so order-success.html can read it back,
   clear the cart, and redirect.

   DELIVERING ORDERS TO YOU
   A static site has nowhere of its own to keep this data — it only
   lives in the customer's browser unless it's sent somewhere. The
   line below POSTs each order to Formspree (free), which forwards it
   to your email. To turn this on:
     1. Create a free form at https://formspree.io (sign up, "New Form").
     2. Copy the endpoint it gives you, looks like
        https://formspree.io/f/abcdwxyz
     3. Paste it in place of the placeholder below.
   Until you do, orders still work and still show the confirmation
   page — they just aren't emailed anywhere yet. */
const PV_ORDERS_ENDPOINT = "https://formspree.io/f/REPLACE_WITH_YOUR_ORDERS_FORM_ID";

function pvSendOrderNotification(order) {
  if (PV_ORDERS_ENDPOINT.includes("REPLACE_WITH_YOUR")) return; // not configured yet
  const itemsSummary = order.items.map((i) => `${i.qty} × ${i.name} (${pvFormatPrice(i.subtotal)})`).join("\n");
  fetch(PV_ORDERS_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      subject: `New order ${order.id} — ${pvFormatPrice(order.totals.total)} (COD)`,
      orderId: order.id,
      name: order.customer.name,
      phone: order.customer.phone,
      email: order.customer.email,
      address: `${order.shipping.address1}${order.shipping.address2 ? ", " + order.shipping.address2 : ""}, ${order.shipping.city}, ${order.shipping.state} – ${order.shipping.pincode}`,
      notes: order.shipping.notes || "—",
      items: itemsSummary,
      total: pvFormatPrice(order.totals.total)
    })
  }).catch(() => {
    /* Silent by design: the order is already saved locally and the
       customer's confirmation page doesn't depend on this call. */
  });
}

const PV_DISTRICTS = [
  "Bagerhat","Bandarban","Barguna","Barisal","Bhola","Bogura","Brahmanbaria","Chandpur",
  "Chapainawabganj","Chattogram","Chuadanga","Cox's Bazar","Cumilla","Dhaka","Dinajpur","Faridpur",
  "Feni","Gaibandha","Gazipur","Gopalganj","Habiganj","Jamalpur","Jashore","Jhalokati","Jhenaidah",
  "Joypurhat","Khagrachhari","Khulna","Kishoreganj","Kurigram","Kushtia","Lakshmipur","Lalmonirhat",
  "Madaripur","Magura","Manikganj","Meherpur","Moulvibazar","Munshiganj","Mymensingh","Naogaon",
  "Narail","Narayanganj","Narsingdi","Natore","Netrokona","Nilphamari","Noakhali","Pabna",
  "Panchagarh","Patuakhali","Pirojpur","Rajbari","Rajshahi","Rangamati","Rangpur","Satkhira",
  "Shariatpur","Sherpur","Sirajganj","Sunamganj","Sylhet","Tangail","Thakurgaon"
];

function pvRenderCheckout() {
  const root = document.getElementById("checkout-root");
  const lines = pvCartLines();

  if (!lines.length) {
    root.innerHTML = `
      <div class="empty-cart">
        <span class="eyebrow">Checkout</span>
        <h2>Your bag is empty</h2>
        <p>Add something to your bag before checking out.</p>
        <a href="shop.html" class="btn btn-gold">Start shopping</a>
      </div>
    `;
    return;
  }

  const totals = pvCartTotals();

  root.innerHTML = `
    <div class="checkout-layout">
      <div>
        <div class="checkout-steps">
          <span>Bag</span> → <span class="active">Details</span> → <span>Confirmation</span>
        </div>

        <form id="checkout-form" novalidate>
          <div class="form-section">
            <h3>Contact information</h3>
            <p class="hint">We'll use this to confirm your order.</p>
            <div class="form-grid">
              <div class="form-field">
                <label for="f-name">Full name <span class="req">*</span></label>
                <input type="text" id="f-name" name="name" autocomplete="name" placeholder="Ananya Sharma">
                <span class="form-error" data-error-for="name"></span>
              </div>
              <div class="form-field">
                <label for="f-phone">Phone number <span class="req">*</span></label>
                <input type="tel" id="f-phone" name="phone" autocomplete="tel" placeholder="01712-345678">
                <span class="form-error" data-error-for="phone"></span>
              </div>
              <div class="form-field full">
                <label for="f-email">Email address <span class="req">*</span></label>
                <input type="email" id="f-email" name="email" autocomplete="email" placeholder="you@example.com">
                <span class="form-error" data-error-for="email"></span>
              </div>
            </div>
          </div>

          <div class="form-section">
            <h3>Shipping address</h3>
            <p class="hint">Where should we deliver this order?</p>
            <div class="form-grid">
              <div class="form-field full">
                <label for="f-address1">Address line 1 <span class="req">*</span></label>
                <input type="text" id="f-address1" name="address1" autocomplete="address-line1" placeholder="House no., building, street">
                <span class="form-error" data-error-for="address1"></span>
              </div>
              <div class="form-field full">
                <label for="f-address2">Address line 2</label>
                <input type="text" id="f-address2" name="address2" autocomplete="address-line2" placeholder="Landmark, apartment, floor (optional)">
              </div>
              <div class="form-field">
                <label for="f-city">City / Upazila <span class="req">*</span></label>
                <input type="text" id="f-city" name="city" autocomplete="address-level2" placeholder="Dhanmondi">
                <span class="form-error" data-error-for="city"></span>
              </div>
              <div class="form-field">
                <label for="f-state">District <span class="req">*</span></label>
                <select id="f-state" name="state" autocomplete="address-level1">
                  <option value="">Select district</option>
                  ${PV_DISTRICTS.map((s) => `<option value="${s}">${s}</option>`).join("")}
                </select>
                <span class="form-error" data-error-for="state"></span>
              </div>
              <div class="form-field">
                <label for="f-pincode">Postcode <span class="req">*</span></label>
                <input type="text" id="f-pincode" name="pincode" inputmode="numeric" autocomplete="postal-code" placeholder="1209">
                <span class="form-error" data-error-for="pincode"></span>
              </div>
              <div class="form-field">
                <label for="f-landmark">Landmark</label>
                <input type="text" id="f-landmark" name="landmark" placeholder="Optional">
              </div>
              <div class="form-field full">
                <label for="f-notes">Delivery notes</label>
                <textarea id="f-notes" name="notes" placeholder="Gate code, preferred delivery time, gift note, etc. (optional)"></textarea>
              </div>
            </div>
          </div>

          <div class="form-section">
            <h3>Payment</h3>
            <p class="hint">Only Cash on Delivery is available right now.</p>
            <label class="payment-option">
              <input type="radio" name="payment" value="cod" checked disabled>
              <span>
                <strong>Cash on Delivery (COD)</strong>
                <span class="desc">Pay in cash (or UPI, if your courier supports it) when your order arrives. No extra charges — shipping is free.</span>
              </span>
            </label>
          </div>

          <div class="form-section" style="margin-bottom:0;">
            <label style="display:flex;gap:10px;align-items:flex-start;font-size:13.5px;color:rgba(26,20,32,0.7);">
              <input type="checkbox" id="f-terms" style="margin-top:3px;">
              I confirm the details above are correct and agree to pay ${pvFormatPrice(totals.total)} in cash on delivery.
            </label>
            <span class="form-error" data-error-for="terms"></span>
          </div>
        </form>
      </div>

      <div class="order-review">
        <h3>Order review</h3>
        ${lines.map((l) => `
          <div class="review-line">
            <div class="sw" style="background:${l.product.swatch}"></div>
            <div>
              <div class="rl-name">${l.product.name}</div>
              <div class="rl-qty">Qty ${l.qty}</div>
            </div>
            <div class="rl-price">${pvFormatPrice(l.subtotal)}</div>
          </div>
        `).join("")}
        <div class="summary-row" style="margin-top:20px;"><span>Subtotal</span><span>${pvFormatPrice(totals.subtotal)}</span></div>
        <div class="summary-row"><span>Shipping</span><span>Free</span></div>
        <div class="summary-row total"><span>Total due on delivery</span><span>${pvFormatPrice(totals.total)}</span></div>
        <button type="submit" form="checkout-form" class="btn btn-gold btn-block" style="margin-top:22px;" id="place-order-btn">Place order — Pay on delivery</button>
        <p class="summary-note" style="text-align:center;">No payment is taken now. You'll pay the courier when your order arrives.</p>
      </div>
    </div>
  `;

  document.getElementById("checkout-form").addEventListener("submit", pvSubmitOrder);
}

function pvValidateField(value, rules) {
  for (const rule of rules) {
    if (!rule.test(value)) return rule.message;
  }
  return "";
}

function pvSubmitOrder(e) {
  e.preventDefault();
  const form = e.target;
  const data = Object.fromEntries(new FormData(form).entries());
  const terms = document.getElementById("f-terms").checked;

  const validations = {
    name: pvValidateField(data.name?.trim() || "", [
      { test: (v) => v.length >= 2, message: "Enter your full name." }
    ]),
    phone: pvValidateField((data.phone || "").replace(/\D/g, ""), [
      { test: (v) => /^01[3-9]\d{8}$/.test(v), message: "Enter a valid 11-digit Bangladeshi mobile number (e.g. 01712345678)." }
    ]),
    email: pvValidateField(data.email?.trim() || "", [
      { test: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), message: "Enter a valid email address." }
    ]),
    address1: pvValidateField(data.address1?.trim() || "", [
      { test: (v) => v.length >= 5, message: "Enter your street address." }
    ]),
    city: pvValidateField(data.city?.trim() || "", [
      { test: (v) => v.length >= 2, message: "Enter your city." }
    ]),
    state: pvValidateField(data.state || "", [
      { test: (v) => v.length > 0, message: "Select your state." }
    ]),
    pincode: pvValidateField(data.pincode?.trim() || "", [
      { test: (v) => /^\d{4}$/.test(v), message: "Enter a valid 4-digit postcode." }
    ]),
    terms: pvValidateField(terms, [
      { test: (v) => v === true, message: "Please confirm to place the order." }
    ])
  };

  let firstInvalid = null;
  Object.entries(validations).forEach(([field, message]) => {
    const errorEl = document.querySelector(`[data-error-for="${field}"]`);
    const fieldEl = document.getElementById(`f-${field}`);
    const wrap = fieldEl ? fieldEl.closest(".form-field") : null;
    if (errorEl) errorEl.textContent = message;
    if (wrap) wrap.classList.toggle("invalid", !!message);
    if (message && !firstInvalid) firstInvalid = fieldEl || document.getElementById("f-terms");
  });

  if (firstInvalid) {
    firstInvalid.focus();
    firstInvalid.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  const lines = pvCartLines();
  const totals = pvCartTotals();
  const orderId = "PV" + Date.now().toString().slice(-8);

  const order = {
    id: orderId,
    createdAt: new Date().toISOString(),
    customer: {
      name: data.name.trim(),
      phone: data.phone.trim(),
      email: data.email.trim()
    },
    shipping: {
      address1: data.address1.trim(),
      address2: (data.address2 || "").trim(),
      city: data.city.trim(),
      state: data.state,
      pincode: data.pincode.trim(),
      landmark: (data.landmark || "").trim(),
      notes: (data.notes || "").trim()
    },
    payment: "Cash on Delivery",
    items: lines.map((l) => ({
      id: l.product.id,
      name: l.product.name,
      category: l.product.category,
      price: l.product.price,
      qty: l.qty,
      subtotal: l.subtotal
    })),
    totals
  };

  // Persist locally so the confirmation page can read it back...
  const allOrders = JSON.parse(localStorage.getItem("pearlvelvet_orders") || "[]");
  allOrders.push(order);
  localStorage.setItem("pearlvelvet_orders", JSON.stringify(allOrders));

  // ...and email it to the studio (see PV_ORDERS_ENDPOINT above).
  pvSendOrderNotification(order);

  pvClearCart();
  location.href = `order-success.html?order=${orderId}`;
}

document.addEventListener("DOMContentLoaded", pvRenderCheckout);
