const body = document.body;

const toggleBtn = document.querySelector(".nav_toggle");
const mobileMenu = document.getElementById("mobileMenu");
const overlay = document.querySelector("[data-menu-overlay]");
const closeBtn = document.querySelector(".mobile-menu_close");

const focusableSelectors =
	'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

let lastFocus = null;

function openMenu() {
	lastFocus = document.activeElement;

	body.classList.add("menu-open");
	overlay.hidden = false;

	mobileMenu.setAttribute("aria-hidden", "false");
	toggleBtn.setAttribute("aria-expanded", "true");

	// Focus first focusable item in menu
	const firstFocusable = mobileMenu.querySelector(focusableSelectors);
	firstFocusable?.focus();
}

function closeMenu() {
	body.classList.remove("menu-open");

	mobileMenu.setAttribute("aria-hidden", "true");
	toggleBtn.setAttribute("aria-expanded", "false");

	// Fade overlay out then hide
	setTimeout(() => {
		overlay.hidden = true;
	}, 180);

	lastFocus?.focus();
}

toggleBtn?.addEventListener("click", () => {
	const isOpen = body.classList.contains("menu-open");
	isOpen ? closeMenu() : openMenu();
});

closeBtn?.addEventListener("click", closeMenu);
overlay?.addEventListener("click", closeMenu);

// Close when any link is clicked
mobileMenu?.addEventListener("click", (e) => {
	const link = e.target.closest("a");
	if (link) closeMenu();
});

// ESC closes menu
document.addEventListener("keydown", (e) => {
	if (e.key === "Escape" && body.classList.contains("menu-open")) {
		closeMenu();
	}
});

// Focus trap inside drawer
document.addEventListener("keydown", (e) => {
	if (e.key !== "Tab") return;
	if (!body.classList.contains("menu-open")) return;

	const focusables = Array.from(mobileMenu.querySelectorAll(focusableSelectors));
	if (!focusables.length) return;

	const first = focusables[0];
	const last = focusables[focusables.length - 1];

	if (e.shiftKey && document.activeElement === first) {
		e.preventDefault();
		last.focus();
	} else if (!e.shiftKey && document.activeElement === last) {
		e.preventDefault();
		first.focus();
	}
});

const cards = document.querySelectorAll(".policy-card");
const observer = new IntersectionObserver(
	(entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				cards.forEach((card, index) => {
					setTimeout(() => {
						card.classList.add("is-visible");
					}, index * 250);
				});
				observer.disconnect();
			}
		});
	},
	{ threshold: 0.3 }
	);

observer.observe(document.querySelector("#fightin-for"));

(() => {
  const continueLink = document.getElementById("donateContinue");
  const customInput = document.getElementById("customAmount");
  const amountButtons = document.querySelectorAll(".amount-btn");

  if (!continueLink) return;

  // IMPORTANT: set this to the *real* ActBlue donate page URL (no params)
  const baseDonateUrl = continueLink.getAttribute("href");

  function setContinueAmount(amount) {
    // clear active styles
    amountButtons.forEach(b => b.classList.remove("is-active"));

    const url = new URL(baseDonateUrl);
    url.searchParams.set("amount", amount);

    // Optional tracking (nice to have)
    // url.searchParams.set("refcode", "website-quickamount");

    continueLink.setAttribute("href", url.toString());
  }

  // Quick amount buttons
  amountButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const amount = btn.dataset.amount;
      btn.classList.add("is-active");
      if (customInput) customInput.value = ""; // clear custom when using preset
      setContinueAmount(amount);
    });
  });

  // Custom amount typing
  if (customInput) {
    customInput.addEventListener("input", () => {
      const raw = (customInput.value || "").trim();
      if (!raw) {
        // If they clear it, fall back to whatever the link already is
        return;
      }
      const amount = Number(raw);
      if (!Number.isFinite(amount) || amount <= 0) return;

      setContinueAmount(String(amount));
    });
  }

  // Default: if you want $100 preselected on page load
  const defaultBtn = document.querySelector(".amount-btn.main-donate");
  if (defaultBtn?.dataset.amount) {
    defaultBtn.classList.add("is-active");
    setContinueAmount(defaultBtn.dataset.amount);
  }
})();