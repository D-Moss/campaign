const body = document.body;

const toggleBtn = document.querySelector(".nav_toggle");
const menu = document.querySelector("[data-menu]");
const overlay = document.querySelector("[data-overlay]");
const closeBtn = menu?.querySelector("[data-close]"); // ✅ matches your HTML

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



const testimonialModal = document.getElementById("testimonialModal");
const openBtns = document.querySelectorAll(".js-cta-btn");

openBtns.forEach((btn) => {
	btn.addEventListener("click", () => {
		testimonialModal?.classList.add("is-open");
		testimonialModal?.setAttribute("aria-hidden", "false");
	});
});

// Close handlers (if you aren't already doing this)
testimonialModal?.addEventListener("click", (e) => {
	if (e.target.matches("[data-close]")) {
		testimonialModal.classList.remove("is-open");
		testimonialModal.setAttribute("aria-hidden", "true");
	}
});

document.addEventListener("keydown", (e) => {
	if (e.key === "Escape" && testimonialmodal?.classList.contains("is-open")) {
		modal.classList.remove("is-open");
		modal.setAttribute("aria-hidden", "true");
	}
});






// ==========================================================
// SIGNATURE DRIVE SLIDE-UP MODAL
// Remove or modify after March 7
// ==========================================================
(() => {
  const sigOverlay = document.getElementById("sigOverlay");
  const sigClose = document.getElementById("sigClose");
  const sigWalkinBtn = document.getElementById("sigWalkinBtn");
  const sigToast = document.getElementById("sigToast");

  // If the modal HTML isn't on this page, do nothing
  if (!sigOverlay) return;

  const SHOW_DELAY_MS = 1800;
  const STORAGE_KEY = "sigModalSeenUntil";
  const SUPPRESS_HOURS = 24;

  // Auto-hide after the events are over
  const ENABLE_DATE_GUARD = true;
  const START = new Date("2026-03-01T00:00:00-05:00");
  const END   = new Date("2026-03-08T23:59:59-05:00");

  function withinDateWindow() {
    if (!ENABLE_DATE_GUARD) return true;
    const now = new Date();
    return now >= START && now <= END;
  }

  function canShow() {
    const until = Number(localStorage.getItem(STORAGE_KEY) || 0);
    return Date.now() > until;
  }

  function markSeen() {
    const until = Date.now() + SUPPRESS_HOURS * 60 * 60 * 1000;
    localStorage.setItem(STORAGE_KEY, String(until));
  }

  function openSigModal() {
    sigOverlay.classList.add("is-open");
    sigOverlay.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeSigModal() {
    sigOverlay.classList.remove("is-open");
    sigOverlay.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  function showToast(msg) {
    if (!sigToast) return;
    sigToast.textContent = msg;
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => (sigToast.textContent = ""), 4500);
  }

  // Track helper (GA4 optional)
  function track(action, params = {}) {
    if (typeof gtag === "function") {
      gtag("event", action, { event_category: "signature_modal", ...params });
    }
  }

  // Auto open once per 24h
  if (withinDateWindow() && canShow()) {
    window.setTimeout(() => {
      openSigModal();
      markSeen();
      track("modal_view");
    }, SHOW_DELAY_MS);
  }

  // Close button
  sigClose?.addEventListener("click", () => {
    closeSigModal();
    track("modal_close");
  });

  // Clicking the dark overlay closes (but clicking inside modal does not)
  sigOverlay.addEventListener("click", (e) => {
    if (e.target === sigOverlay) {
      closeSigModal();
      track("modal_close_overlay");
    }
  });

  // ESC closes signature modal
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && sigOverlay.classList.contains("is-open")) {
      closeSigModal();
      track("modal_close_esc");
    }
  });

  // Walk-in button (toast + GA4)
  sigWalkinBtn?.addEventListener("click", () => {
    showToast("Perfect — see you one day this week! ✅");
    track("walkin_click");
  });

  // RSVP expand/collapse
  document.querySelectorAll("[data-rsvp-open]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const key = btn.getAttribute("data-rsvp-open"); // friday | saturday
      const form = document.querySelector(`form[data-rsvp="${key}"]`);
      if (!form) return;

      // Close other RSVP forms
      document.querySelectorAll(".sig-rsvp").forEach((f) => {
        if (f !== form) f.classList.remove("is-open");
      });

      form.classList.toggle("is-open");
      track("rsvp_open", { day: key });
    });
  });

  // RSVP submissions (Netlify Forms background submit)
  async function postToNetlifyForm(formName, data) {
    const params = new URLSearchParams();
    params.append("form-name", formName);
    Object.entries(data).forEach(([k, v]) => params.append(k, v ?? ""));

    const res = await fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });

    return res.ok;
  }

  document.querySelectorAll("form.sig-rsvp").forEach((form) => {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const dayKey = form.getAttribute("data-rsvp"); // friday|saturday
      const firstName = form.querySelector('input[name="first_name"]')?.value?.trim();
      const contact = form.querySelector('input[name="contact"]')?.value?.trim() || "";
      const bringingGuest =
        form.querySelector('input[name="bringing_guest"]')?.checked ? "Yes" : "No";

      if (!firstName) {
        showToast("Quick thing — please add your first name to RSVP. ✍️");
        return;
      }

      const eventDay =
        dayKey === "friday"
          ? "Friday (March 6, 2026) — 3–6 PM — 123 N 9th St"
          : "Saturday (March 7, 2026) — 3–6 PM — 6234 Ridge Ave";

      try {
        const ok = await postToNetlifyForm("sig-event-rsvp", {
          event_day: eventDay,
          first_name: firstName,
          contact,
          bringing_guest: bringingGuest,
          page: window.location.href,
          ts: new Date().toISOString(),
        });

        if (!ok) {
          showToast("Hmm — RSVP didn’t go through. Please try again.");
          return;
        }

        if (dayKey === "friday") {
          showToast("We’re excited to see you Friday — feel free to bring a friend/family member! 💛");
        } else {
          showToast("We can’t wait to see you Saturday — please tell your friends/family! 💛");
        }

        track("rsvp_submit", { day: dayKey });

        form.reset();
        form.classList.remove("is-open");
      } catch {
        showToast("Hmm — RSVP didn’t go through. Please try again.");
      }
    });
  });
})();