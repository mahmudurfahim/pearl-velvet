/* Pearl Velvet — homepage script

   DELIVERING CONTACT MESSAGES & NEWSLETTER SIGNUPS TO YOU
   Same story as checkout.js: this is a static site, so submissions
   only exist in the visitor's browser unless sent somewhere. Create
   a free form at https://formspree.io and paste its endpoint below
   to have these emailed to you. Leave as-is and the forms still show
   a "sent" confirmation to the visitor — they just won't reach you. */
const PV_CONTACT_ENDPOINT = "https://formspree.io/f/REPLACE_WITH_YOUR_CONTACT_FORM_ID";
const PV_NEWSLETTER_ENDPOINT = "https://formspree.io/f/REPLACE_WITH_YOUR_NEWSLETTER_FORM_ID";

function pvSendFormNotification(endpoint, payload) {
  if (endpoint.includes("REPLACE_WITH_YOUR")) return false;
  fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload)
  }).catch(() => {});
  return true;
}

document.addEventListener("DOMContentLoaded", () => {
  // Featured products = bestsellers + new, capped at 8
  const featured = PV_PRODUCTS.filter((p) => p.badge).concat(
    PV_PRODUCTS.filter((p) => !p.badge)
  ).slice(0, 8);
  pvRenderProductGrid(document.getElementById("featured-grid"), featured);

  // pearl strand dividers
  pvRenderPearlStrand(document.getElementById("strand-1"), 26);
  pvRenderPearlStrand(document.getElementById("strand-2"), 26);

  // hero bead necklace along the drawn path
  const beadsGroup = document.getElementById("beads");
  if (beadsGroup) {
    const path = document.querySelector(".hero-art .drape");
    if (path) {
      const len = path.getTotalLength();
      const count = 16;
      let html = "";
      for (let i = 0; i < count; i++) {
        const pt = path.getPointAtLength((len / (count - 1)) * i);
        const r = i % 4 === 0 ? 6 : 3.6;
        html += `<circle class="bead" cx="${pt.x.toFixed(1)}" cy="${pt.y.toFixed(1)}" r="${r}" fill="url(#pearlGrad)" style="animation-delay:${(1 + i * 0.06).toFixed(2)}s" />`;
      }
      beadsGroup.insertAdjacentHTML(
        "beforebegin",
        `<defs><radialGradient id="pearlGrad" cx="35%" cy="30%"><stop offset="0%" stop-color="#fff"/><stop offset="50%" stop-color="#e4cc94"/><stop offset="100%" stop-color="#c6a15b"/></radialGradient></defs>`
      );
      beadsGroup.innerHTML = html;
    }
  }

  // accordion (FAQ)
  document.querySelectorAll(".acc-trigger").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const item = trigger.closest(".acc-item");
      const panel = item.querySelector(".acc-panel");
      const isOpen = item.classList.contains("open");
      document.querySelectorAll(".acc-item.open").forEach((openItem) => {
        openItem.classList.remove("open");
        openItem.querySelector(".acc-panel").style.maxHeight = null;
      });
      if (!isOpen) {
        item.classList.add("open");
        panel.style.maxHeight = panel.scrollHeight + "px";
      }
    });
  });

  // newsletter
  const newsletterForm = document.getElementById("newsletter-form");
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = newsletterForm.querySelector("input[type=email]").value;
      pvSendFormNotification(PV_NEWSLETTER_ENDPOINT, { subject: "New newsletter signup", email });
      pvShowToast("You're on the list — welcome to Pearl Velvet.");
      newsletterForm.reset();
    });
  }

  // contact form
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(contactForm).entries());
      pvSendFormNotification(PV_CONTACT_ENDPOINT, {
        subject: `New message from ${data.name}`,
        name: data.name,
        email: data.email,
        message: data.message
      });
      pvShowToast("Message sent — we'll reply within a day.");
      contactForm.reset();
    });
  }
});
