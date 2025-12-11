document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll(".tab, .nav-item");
  const pages = document.querySelectorAll(".page");
  const searchInput = document.getElementById("searchInput");
  const searchableItems = document.querySelectorAll("[data-search]");

  // Aplica cor automática conforme a nota
  function aplicarCor(item) {
    const nota = parseFloat(item.dataset.score);
    item.classList.remove("excelente","bom","atencao","ruim");
    if (nota >= 9.0) item.classList.add("excelente");
    else if (nota >= 7.0) item.classList.add("bom");
    else if (nota >= 6.0) item.classList.add("atencao");
    else item.classList.add("ruim");
  }
  document.querySelectorAll(".grade-item[data-score]").forEach(aplicarCor);

  function showPage(id) {
    tabs.forEach(t => t.classList.remove("active"));
    pages.forEach(p => p.classList.remove("active"));
    document.querySelectorAll(`[data-target="${id}"]`).forEach(el => el.classList.add("active"));
    document.getElementById(id).classList.add("active");

    gsap.fromTo(`#${id} > *`, { y:50, opacity:0 }, { y:0, opacity:1, stagger:0.12, duration:0.7 });

    if (id === "grades" || id === "previous") {
      gsap.to(`#${id} .bar`, {
        width: (i, el) => el.parentElement.parentElement.dataset.score + "%",
        duration: 1.4, ease: "power3.out", stagger: 0.12, delay: 0.3
      });
    }
  }

  tabs.forEach(tab => tab.addEventListener("click", () => {
    showPage(tab.dataset.target);
    window.scrollTo({ top: 180, behavior: "smooth" });
  }));

  // BUSCA EM TEMPO REAL
  searchInput.addEventListener("input", () => {
    const q = searchInput.value.toLowerCase().trim();
    searchableItems.forEach(item => {
      const text = item.getAttribute("data-search").toLowerCase();
      item.classList.toggle("hidden", q && !text.includes(q));
    });
  });

  // Animação de entrada
  gsap.from("header, .search-container, .cards .card", {
    y: 60, opacity: 0, stagger: 0.15, duration: 0.9, ease: "back.out(1.5)"
  });
});