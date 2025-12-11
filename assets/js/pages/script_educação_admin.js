document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll(".tab, .nav-item");
  const pages = document.querySelectorAll(".page");
  const searchInput = document.getElementById("searchInput");
  const searchableItems = document.querySelectorAll("[data-search]");

  function showPage(id) {
    tabs.forEach(t => t.classList.remove("active"));
    pages.forEach(p => p.classList.remove("active"));
    document.querySelectorAll(`[data-target="${id}"]`).forEach(el => el.classList.add("active"));
    document.getElementById(id).classList.add("active");

    gsap.fromTo(`#${id} > *`, { y:50, opacity:0 }, { y:0, opacity:1, stagger:0.12, duration:0.7 });
  }

  tabs.forEach(tab => tab.addEventListener("click", () => {
    showPage(tab.dataset.target);
    window.scrollTo({ top: 180, behavior: "smooth" });
  }));

  // BUSCA
  searchInput.addEventListener("input", () => {
    const q = searchInput.value.toLowerCase();
    searchableItems.forEach(item => {
      const text = item.getAttribute("data-search")?.toLowerCase() || "";
      item.classList.toggle("hidden", q && !text.includes(q));
    });
  });

  gsap.from("header, .search-container, .cards .card", {
    y: 60, opacity: 0, stagger: 0.15, duration: 0.9, ease: "back.out(1.5)"
  });
});
