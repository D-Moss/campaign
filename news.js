(function () {
  const filterButtons = Array.from(document.querySelectorAll(".filter-btn"));
  const cards = Array.from(document.querySelectorAll(".news-card"));
  const searchInput = document.getElementById("newsSearch");
  const emptyState = document.getElementById("newsEmpty");

  // Safety checks (prevents silent failure)
  if (!filterButtons.length || !cards.length || !searchInput || !emptyState) {
    console.warn("News filters not initialized. Missing elements:", {
      filterButtons: filterButtons.length,
      cards: cards.length,
      searchInput: !!searchInput,
      emptyState: !!emptyState,
    });
    return;
  }

  let activeFilter = "all";
  let query = "";

  function matchesFilter(card) {
    if (activeFilter === "all") return true;
    const tags = (card.dataset.tags || "")
      .split(" ")
      .map(s => s.trim())
      .filter(Boolean);
    return tags.includes(activeFilter);
  }

  function matchesSearch(card) {
    if (!query) return true;
    const haystack = (
      (card.dataset.title || "") + " " +
      (card.querySelector(".news-headline")?.textContent || "") + " " +
      (card.querySelector(".news-statement")?.textContent || "") + " " +
      (card.querySelector(".news-source")?.textContent || "")
    ).toLowerCase();
    return haystack.includes(query);
  }

  function apply() {
    let visibleCount = 0;

    cards.forEach(card => {
      const show = matchesFilter(card) && matchesSearch(card);
      card.hidden = !show;
      if (show) visibleCount++;
    });

    emptyState.hidden = visibleCount !== 0;
  }

  filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      filterButtons.forEach(b => {
        b.classList.remove("is-active");
        b.setAttribute("aria-selected", "false");
      });

      btn.classList.add("is-active");
      btn.setAttribute("aria-selected", "true");

      activeFilter = btn.dataset.filter || "all";
      apply();
    });
  });

  searchInput.addEventListener("input", (e) => {
    query = (e.target.value || "").trim().toLowerCase();
    apply();
  });

  apply();
})();