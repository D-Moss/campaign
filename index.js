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