/* Pearl Velvet — product catalog
   No product photography was supplied, so each item renders as a
   hand-tuned velvet swatch (CSS gradient) instead of a photo. Swap
   `image` for a real URL per product whenever photography is ready —
   product.render() and card templates already fall back to <img> if
   `image` is set. */

const PV_PRODUCTS = [
  {
    id: "pv-01",
    name: "Duchess Pearl Drop Necklace",
    category: "Necklaces",
    price: 4800,
    compareAt: 6200,
    swatch: "linear-gradient(135deg,#3d2140,#171019 70%)",
    badge: "Bestseller",
    tags: ["necklace", "pearl", "gold"],
    description:
      "A single freshwater pearl suspended from a hair-fine 14k gold-fill chain. Sits at the collarbone — the kind of piece you forget you're wearing until someone asks where it's from.",
    details: ["14k gold-fill chain, 45cm + 5cm extender", "8mm freshwater pearl, hand-selected", "Nickel-free, tarnish-resistant", "Comes in a velvet slip pouch"],
    stock: 14
  },
  {
    id: "pv-02",
    name: "Velvet Ribbon Choker",
    category: "Necklaces",
    price: 2200,
    swatch: "linear-gradient(135deg,#5c1f3a,#26101c 75%)",
    badge: "New",
    tags: ["necklace", "velvet"],
    description:
      "Deep aubergine velvet, finished with a hand-set seed pearl clasp. An old idea, done properly — no elastic, no plastic, just ribbon and metal.",
    details: ["100% cotton velvet", "Antique-gold plated clasp", "Adjustable, 30–38cm", "Made to order in small batches"],
    stock: 22
  },
  {
    id: "pv-03",
    name: "Aria Pearl Hoops",
    category: "Earrings",
    price: 3100,
    swatch: "linear-gradient(135deg,#caa15a,#3a2a12 80%)",
    tags: ["earrings", "gold", "pearl"],
    description:
      "Small gold hoops, each hung with a single baroque pearl that catches light differently every time it moves. Lightweight enough for every day.",
    details: ["18k gold vermeil over sterling silver", "Genuine baroque freshwater pearls, no two alike", "18mm hoop diameter", "Butterfly backs"],
    stock: 30
  },
  {
    id: "pv-04",
    name: "Grand Velvet Bow Clip",
    category: "Hair",
    price: 1450,
    swatch: "linear-gradient(135deg,#7a1f4b,#2b0d1e 75%)",
    badge: "Bestseller",
    tags: ["hair", "velvet", "bow"],
    description:
      "The bow that started the shop. Structured velvet, a strong French clip underneath, oversized in the way a good hair accessory should be.",
    details: ["Structured cotton velvet with buckram core", "French clip closure, holds fine and thick hair", "12cm wide", "Spot clean only"],
    stock: 40
  },
  {
    id: "pv-05",
    name: "Petite Pearl Barrette Set",
    category: "Hair",
    price: 1900,
    swatch: "linear-gradient(135deg,#efe3cf,#8f7a58 75%)",
    tags: ["hair", "pearl", "set"],
    description:
      "Three small barrettes, seed-pearl studded, sold as a set for pinning back the pieces that always fall forward. Mix them in or wear all three.",
    details: ["Set of 3, gold-tone brass", "Seed pearl detail, hand-glued", "4.5cm each", "Strong spring clasp"],
    stock: 18
  },
  {
    id: "pv-06",
    name: "Signet Pearl Ring",
    category: "Rings",
    price: 3600,
    swatch: "linear-gradient(135deg,#caa15a,#5c451f 80%)",
    tags: ["ring", "gold", "pearl"],
    description:
      "A modern signet with a flush-set pearl in place of a crest. Solid-feeling on the hand, deliberately understated.",
    details: ["Gold vermeil over sterling silver", "5mm flush-set freshwater pearl", "Available sizes 5–9", "Resizing available on request"],
    stock: 12
  },
  {
    id: "pv-07",
    name: "Layered Velvet & Pearl Bracelet",
    category: "Bracelets",
    price: 2600,
    swatch: "linear-gradient(135deg,#3d2140,#7a1f4b 60%,#171019)",
    badge: "New",
    tags: ["bracelet", "velvet", "pearl"],
    description:
      "Two layers in one clasp — a slim velvet cord and a pearl-beaded chain, so you get the stacked look without the stacking.",
    details: ["Velvet cord + freshwater pearl chain", "Gold-fill lobster clasp", "16–19cm adjustable", "Water-resistant cord"],
    stock: 20
  },
  {
    id: "pv-08",
    name: "Opera Pearl Strand",
    category: "Necklaces",
    price: 7400,
    swatch: "linear-gradient(135deg,#f5efe6,#b9ab8e 70%,#5c4e33)",
    badge: "Limited",
    tags: ["necklace", "pearl", "statement"],
    description:
      "A full 80cm strand of hand-knotted freshwater pearls. Wear it long, double it, or knot it once at the throat — it changes with how you use it.",
    details: ["80cm hand-knotted strand", "7–8mm freshwater pearls throughout", "Gold-fill clasp", "Silk knotting thread, individually knotted between pearls"],
    stock: 6
  },
  {
    id: "pv-09",
    name: "Velvet Scrunchie Trio",
    category: "Hair",
    price: 1200,
    swatch: "linear-gradient(135deg,#2b0d1e,#5c1f3a 60%,#caa15a)",
    tags: ["hair", "velvet", "set"],
    description:
      "Three oversized velvet scrunchies in a tonal set — plum, burgundy, and antique gold. Kind to hair, heavy enough to hold.",
    details: ["Set of 3, cotton velvet", "Oversized, holds thick hair without creasing it", "Elastic core, no metal parts", "Machine washable, gentle cycle"],
    stock: 35
  },
  {
    id: "pv-10",
    name: "Cascade Pearl Earrings",
    category: "Earrings",
    price: 3900,
    swatch: "linear-gradient(135deg,#171019,#3d2140 55%,#efe3cf)",
    tags: ["earrings", "pearl", "statement"],
    description:
      "Three graduated pearls cascading from a gold ear thread. Long enough to move when you do, light enough to forget.",
    details: ["14k gold-fill ear wire", "Graduated 4–7mm freshwater pearls", "6.5cm drop", "Sold as a pair"],
    stock: 16
  },
  {
    id: "pv-11",
    name: "Velvet Wrap Bracelet",
    category: "Bracelets",
    price: 1800,
    swatch: "linear-gradient(135deg,#5c1f3a,#caa15a 85%)",
    tags: ["bracelet", "velvet"],
    description:
      "A double-wrap velvet cord with a single pearl button clasp. Simple, worn alone or stacked with the layered piece.",
    details: ["Velvet cord, double wrap", "Pearl button closure", "One size, adjustable wrap", "Fits most wrists 14–18cm"],
    stock: 24
  },
  {
    id: "pv-12",
    name: "Heirloom Pearl Studs",
    category: "Earrings",
    price: 2400,
    swatch: "linear-gradient(135deg,#f5efe6,#caa15a 70%,#3a2a12)",
    badge: "Bestseller",
    tags: ["earrings", "pearl", "classic"],
    description:
      "The pair you reach for on the days you can't decide. Round freshwater pearls on gold-fill posts — no trend to it, which is the point.",
    details: ["14k gold-fill posts", "7mm round freshwater pearls", "Hypoallergenic", "Sold as a pair"],
    stock: 45
  }
];

function pvFormatPrice(amount) {
  return "৳" + amount.toLocaleString("en-US");
}

function pvGetProduct(id) {
  return PV_PRODUCTS.find((p) => p.id === id);
}
