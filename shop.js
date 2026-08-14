/* Pearl Velvet — shop page: filter, sort, render */

document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("shop-grid");
  const resultCount = document.getElementById("result-count");
  const sortSelect = document.getElementById("sort-select");

  const state = {
    category: new URLSearchParams(location.search).get("cat") || "All",
    price: "all",
    sort: "featured"
  };

  function setActive(container, selector, value) {
    container.querySelectorAll("button").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset[selector] === value);
    });
  }

  function apply() {
    let list = PV_PRODUCTS.slice();

    if (state.category !== "All") {
      list = list.filter((p) => p.category === state.category);
    }
    if (state.price !== "all") {
      const [min, max] = state.price.split("-").map(Number);
      list = list.filter((p) => p.price >= min && p.price <= max);
    }

    switch (state.sort) {
      case "price-asc": list.sort((a, b) => a.price - b.price); break;
      case "price-desc": list.sort((a, b) => b.price - a.price); break;
      case "name-asc": list.sort((a, b) => a.name.localeCompare(b.name)); break;
      default:
        list.sort((a, b) => (b.badge ? 1 : 0) - (a.badge ? 1 : 0));
    }

    resultCount.textContent = `${list.length} piece${list.length === 1 ? "" : "s"}`;
    pvRenderProductGrid(grid, list);
  }

  document.getElementById("filter-category").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-filter-cat]");
    if (!btn) return;
    state.category = btn.dataset.filterCat;
    setActive(document.getElementById("filter-category"), "filterCat", state.category);
    apply();
  });

  document.getElementById("filter-price").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-filter-price]");
    if (!btn) return;
    state.price = btn.dataset.filterPrice;
    setActive(document.getElementById("filter-price"), "filterPrice", state.price);
    apply();
  });

  sortSelect.addEventListener("change", () => {
    state.sort = sortSelect.value;
    apply();
  });

  // reflect ?cat= in the sidebar on load
  const catButtons = document.getElementById("filter-category");
  setActive(catButtons, "filterCat", state.category);

  apply();
});
