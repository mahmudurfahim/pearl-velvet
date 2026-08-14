# Pearl Velvet — static e-commerce site

A complete static site: home, shop with filters, product detail pages, cart,
and a Cash-on-Delivery checkout. Pure HTML/CSS/JS — no build step, no backend.

## Deploy to Vercel

**Fastest path — GitHub → Vercel auto-deploy:**

1. Open this folder in VS Code, then push it to a new GitHub repo:
   ```
   git init
   git add .
   git commit -m "Pearl Velvet storefront"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo>.git
   git push -u origin main
   ```
2. Go to [vercel.com/new](https://vercel.com/new), import that repo.
3. Framework preset: **Other**. Leave Build Command and Output Directory
   blank — there's no build step, it's plain static files at the repo root.
4. Click Deploy. Every future push to `main` auto-deploys.

Or skip GitHub entirely and deploy straight from this folder via CLI:

```
npm i -g vercel
vercel
```

`vercel.json` (included) just sets long-cache headers for the CSS/JS files —
nothing that affects routing or behavior.

## File structure

Everything lives in one flat folder — no subfolders — which is the
simplest possible layout for Vercel (or any static host) to serve:

```
index.html
shop.html
product.html
cart.html
checkout.html
order-success.html
style.css
data.js
cart.js
chrome.js
render.js
main.js
shop.js
product.js
cart-page.js
checkout.js
success.js
vercel.json
.gitignore
README.md
```

## What's included

- **index.html** — hero, category strip, featured products, about, testimonials,
  FAQ accordion, contact form, newsletter signup.
- **shop.html** — full catalog with category / material / price filters and sorting.
- **product.html?id=...** — dynamic product detail (reads the `id` query param),
  quantity stepper, add-to-bag, related products.
- **cart.html** — bag with quantity controls, order summary, free-shipping threshold.
- **checkout.html** — Cash-on-Delivery-only checkout form (contact info + shipping
  address), client-side validation, order review panel.
- **order-success.html** — confirmation page with order number and full order recap.
- **data.js** — the product catalog. Edit this array to add/remove/change products.
- **cart.js** — cart state, stored in `localStorage`.
- **checkout.js** — validation + order creation, stored in `localStorage`
  under the key `pearlvelvet_orders`.

## No backend — and how orders / messages reach you

There's no payment gateway (by design — COD only) and no server. By default
a static site has **nowhere of its own** to keep what visitors submit — an
order or a contact message only exists in that visitor's own browser unless
it's sent somewhere.

Two things happen with every order right now:

1. It's saved to the browser's `localStorage` (key `pearlvelvet_orders`) —
   this is only what lets `order-success.html` show a confirmation right
   after checkout. It is **not** a place you, the store owner, can log in
   and view — it's local to that one visitor's device.
2. It's POSTed to a Formspree endpoint — **but only once you set one up**
   (see below). Until then, step 2 is skipped silently and orders exist
   only per step 1.

The same applies to the "Get in touch" contact form and the newsletter
signup on the homepage.

### Turn on email delivery (2 minutes, free)

1. Go to **[formspree.io](https://formspree.io)**, sign up free, and click
   "New Form". Do this **three times** — once each for orders, contact
   messages, and newsletter signups (or reuse one form for all three if you
   don't need them separated).
2. Each form gives you an endpoint like `https://formspree.io/f/abcdwxyz`.
3. Paste them in:
   - `checkout.js` → `PV_ORDERS_ENDPOINT`
   - `main.js` → `PV_CONTACT_ENDPOINT` and `PV_NEWSLETTER_ENDPOINT`
4. Formspree will send a confirmation email the first time each form is
   used — verify it, and from then on every order/message/signup lands in
   your inbox.

Other options if you'd rather not use Formspree: **Getform**, a **Google
Sheet via a webhook** (e.g. SheetDB, Sheet.best) so every order becomes a
row, or a small **Vercel Function** if you want it fully in-house.

## Swapping in real photography

Every product currently renders as a velvet-toned gradient swatch (see the
`swatch` field in `data.js`) since no product photos were supplied. To use
real photos, add an `image: "path/or/url.jpg"` field per product and update
`pvProductCardHTML()` / the product page template in `render.js` and
`product.js` to render an `<img>` when `image` is present, falling back to
the gradient otherwise.

## Colors & type

- Plum `#2B1B2E`, Burgundy `#4A1942`, Ink `#1A1420`, Ivory `#F5EFE6`,
  Gold `#C6A15B`, Blush `#E8C4C0` — defined as CSS variables at the top of
  `style.css`.
- Display type: Fraunces. Body: Outfit. Utility/mono (prices, labels): JetBrains Mono.

No banner or brand colors were attached when this was built, so the palette
above was designed around the name "Pearl Velvet" itself. If you have brand
assets, drop the image in and the CSS variables can be swapped to match.

## Region

Set up for Bangladesh: prices in Taka (৳), checkout collects a district
(all 64 listed) and 4-digit postcode, phone validation expects an 11-digit
Bangladeshi mobile number (`01XXXXXXXXX`), and the studio address/contact
details are Dhaka-based placeholders — update them in `chrome.js` and
`index.html` with your real details before launch.
