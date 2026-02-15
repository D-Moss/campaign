const body = document.body;

const toggleBtn = document.querySelector(".nav_toggle");
const menu = document.querySelector("[data-menu]");
const overlay = document.querySelector("[data-overlay]");
const closeBtn = document.querySelector("[data-close]"); // ✅ matches your HTML

const focusableSelectors =
	'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

let lastFocus = null;

// Helpers
function isMenuOpen() {
	return body.classList.contains("menu-open");
}

function openMenu() {
	if (!menu || !toggleBtn || !overlay) return;

	lastFocus = document.activeElement;

	body.classList.add("menu-open");
	overlay.hidden = false;

	// Accessibility states
	menu.setAttribute("aria-hidden", "false");
	toggleBtn.setAttribute("aria-expanded", "true");

	// Focus first focusable item inside menu
	const firstFocusable = menu.querySelector(focusableSelectors);
	firstFocusable?.focus();
}

function closeMenu() {
	if (!menu || !toggleBtn || !overlay) return;

	body.classList.remove("menu-open");

	menu.setAttribute("aria-hidden", "true");
	toggleBtn.setAttribute("aria-expanded", "false");

	// Hide overlay after fade
	setTimeout(() => {
		overlay.hidden = true;
	}, 180);

	lastFocus?.focus();
}

// Initial accessibility default
menu?.setAttribute("aria-hidden", "true");

// Toggle button
toggleBtn?.addEventListener("click", () => {
	isMenuOpen() ? closeMenu() : openMenu();
});

// Close button (✕)
closeBtn?.addEventListener("click", closeMenu);

// Click overlay closes
overlay?.addEventListener("click", closeMenu);

// Clicking any link inside menu closes (nice UX)
menu?.addEventListener("click", (e) => {
	const link = e.target.closest("a");
	if (link) closeMenu();
});

// ESC closes menu
document.addEventListener("keydown", (e) => {
	if (e.key === "Escape" && isMenuOpen()) closeMenu();
});

// Focus trap inside drawer
document.addEventListener("keydown", (e) => {
	if (e.key !== "Tab") return;
	if (!isMenuOpen() || !menu) return;

	const focusables = Array.from(menu.querySelectorAll(focusableSelectors));
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

// Optional: if user resizes to desktop while menu is open, close it
window.addEventListener("resize", () => {
	if (window.innerWidth > 860 && isMenuOpen()) closeMenu();
});





// --------------------------------------
// Mailchimp SMS phone formatting
// Converts (215) 555-1212 → +12155551212
// --------------------------------------

const mcForm = document.getElementById("mc-embedded-subscribe-form");
const mcPhone = document.getElementById("mce-SMSPHONE");
const mcCountry = document.getElementById("country-select-SMSPHONE");

if (mcForm && mcPhone) {
	mcForm.addEventListener("submit", () => {
		const raw = mcPhone.value.trim();
		if (!raw) return;

		let digits = raw.replace(/\D/g, "");

		// If 11 digits starting with 1, remove leading 1
		if (digits.length === 11 && digits.startsWith("1")) {
			digits = digits.slice(1);
		}

		// If exactly 10 digits → force +1
		if (digits.length === 10) {
			mcPhone.value = `+1${digits}`;
			if (mcCountry) mcCountry.value = "US";
			return;
		}

		// If already 11 digits starting with 1 → normalize
		if (digits.length === 11 && digits.startsWith("1")) {
			mcPhone.value = `+${digits}`;
			if (mcCountry) mcCountry.value = "US";
		}
		// Otherwise let Mailchimp handle validation
	});
}

const cards = document.querySelectorAll(".policy-card");
const fightinFor = document.querySelector("#fightin-for");

if (cards.length && fightinFor) {
	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (!entry.isIntersecting) return;

				cards.forEach((card, index) => {
					setTimeout(() => {
						card.classList.add("is-visible");
					}, index * 180);
				});

				observer.disconnect(); // only run once
			});
		},
		{ threshold: 0.25 }
		);
	observer.observe(fightinFor);
} else {
// quick debug if something is missing
// console.log("Fightin' For: section or cards not found", { cards: cards.length, fightinFor });
}



const modal = document.getElementById("testimonialModal");
const openBtns = document.querySelectorAll(".js-cta-btn");

openBtns.forEach((btn) => {
	btn.addEventListener("click", () => {
		modal.classList.add("is-open");
		modal.setAttribute("aria-hidden", "false");
	});
});

// Close handlers (if you aren't already doing this)
modal?.addEventListener("click", (e) => {
	if (e.target.matches("[data-close]")) {
		modal.classList.remove("is-open");
		modal.setAttribute("aria-hidden", "true");
	}
});

document.addEventListener("keydown", (e) => {
	if (e.key === "Escape" && modal?.classList.contains("is-open")) {
		modal.classList.remove("is-open");
		modal.setAttribute("aria-hidden", "true");
	}
});