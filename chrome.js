/* Pearl Velvet — shared header/footer, injected into every page via
   <div id="site-header-root"></div> / <div id="site-footer-root"></div>
   so nav markup lives in one place. Pass the active page key via
   document.body.dataset.page (e.g. "home", "shop", "cart"...). */

function pvHeaderHTML(active) {
  const link = (href, label, key) =>
    `<a href="${href}" class="${active === key ? "active" : ""}">${label}</a>`;
  return `
    <div class="announce-bar">
      <strong>Free shipping</strong> and Cash on Delivery available across Bangladesh
    </div>
    <header class="site-header">
      <div class="wrap header-row">
        <a href="index.html" class="logo">Pearl <em>Velvet</em></a>
        <nav aria-label="Main">
          <ul class="main-nav">
            <li>${link("index.html", "Home", "home")}</li>
            <li>${link("shop.html", "Shop", "shop")}</li>
            <li>${link("index.html#about", "About", "about")}</li>
            <li>${link("index.html#contact", "Contact", "contact")}</li>
          </ul>
        </nav>
        <div class="header-actions">
          <a href="shop.html" class="btn btn-outline-light" style="padding:10px 20px;">Shop now</a>
          <a href="cart.html" class="icon-btn" aria-label="View cart">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 4h2l2.4 12.4a2 2 0 0 0 2 1.6h7.2a2 2 0 0 0 2-1.6L21 8H6"/><circle cx="9" cy="21" r="1"/><circle cx="18" cy="21" r="1"/></svg>
            <span class="cart-badge" data-cart-count>0</span>
          </a>
          <button class="nav-toggle" aria-label="Open menu" data-drawer-open>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
          </button>
        </div>
      </div>
    </header>
    <div class="mobile-drawer" data-drawer>
      <div class="scrim" data-drawer-close></div>
      <div class="panel">
        <button class="close-btn" data-drawer-close aria-label="Close menu">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 6l12 12M18 6L6 18"/></svg>
        </button>
        <ul>
          <li><a href="index.html">Home</a></li>
          <li><a href="shop.html">Shop</a></li>
          <li><a href="index.html#about">About</a></li>
          <li><a href="index.html#contact">Contact</a></li>
          <li><a href="cart.html">Cart</a></li>
        </ul>
      </div>
    </div>
  `;
}

function pvFooterHTML() {
  const year = new Date().getFullYear();
  return `
    <footer class="site-footer">
      <div class="wrap footer-grid">
        <div class="footer-brand">
          <a href="index.html" class="logo">Pearl <em>Velvet</em></a>
          <p>Pearl and velvet jewellery & hair accessories, made in small batches. Designed in Dhaka, worn everywhere.</p>
        </div>
        <div class="footer-col">
          <h4>Shop</h4>
          <ul>
            <li><a href="shop.html?cat=Necklaces">Necklaces</a></li>
            <li><a href="shop.html?cat=Earrings">Earrings</a></li>
            <li><a href="shop.html?cat=Hair">Hair accessories</a></li>
            <li><a href="shop.html?cat=Rings">Rings</a></li>
            <li><a href="shop.html?cat=Bracelets">Bracelets</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Help</h4>
          <ul>
            <li><a href="index.html#contact">Contact us</a></li>
            <li><a href="index.html#faq">Shipping & returns</a></li>
            <li><a href="index.html#faq">Order tracking</a></li>
            <li><a href="index.html#faq">FAQ</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Visit</h4>
          <address>
            House 12, Road 5, Dhanmondi<br>
            Dhaka 1209, Bangladesh
          </address>
          <ul style="margin-top:14px;">
            <li><a href="tel:+8801712345678">+880 1712-345678</a></li>
            <li><a href="mailto:hello@pearlvelvet.example">hello@pearlvelvet.example</a></li>
          </ul>
        </div>
      </div>
      <div class="wrap footer-bottom">
        <span>© ${year} Pearl Velvet. All rights reserved.</span>
        <div class="footer-social">
          <a href="#" aria-label="Instagram">Instagram</a>
          <a href="#" aria-label="Pinterest">Pinterest</a>
          <a href="#" aria-label="Facebook">Facebook</a>
        </div>
      </div>
    </footer>
  `;
}

function pvInitChrome() {
  const headerRoot = document.getElementById("site-header-root");
  const footerRoot = document.getElementById("site-footer-root");
  const active = document.body.dataset.page || "";
  if (headerRoot) headerRoot.innerHTML = pvHeaderHTML(active);
  if (footerRoot) footerRoot.innerHTML = pvFooterHTML();

  const drawer = document.querySelector("[data-drawer]");
  document.querySelectorAll("[data-drawer-open]").forEach((btn) =>
    btn.addEventListener("click", () => drawer && drawer.classList.add("open"))
  );
  document.querySelectorAll("[data-drawer-close]").forEach((btn) =>
    btn.addEventListener("click", () => drawer && drawer.classList.remove("open"))
  );

  pvUpdateCartBadge();
}

document.addEventListener("DOMContentLoaded", pvInitChrome);

/* ---------- toast ---------- */
let pvToastTimer = null;
function pvShowToast(message, actionHref, actionLabel) {
  let toast = document.querySelector(".pv-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "pv-toast";
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<span>${message}</span>${actionHref ? `<a href="${actionHref}">${actionLabel}</a>` : ""}`;
  toast.classList.add("show");
  clearTimeout(pvToastTimer);
  pvToastTimer = setTimeout(() => toast.classList.remove("show"), 3200);
}
