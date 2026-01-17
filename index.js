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

const fightinFor = document.querySelector("#fightin-for");
if (fightinFor) observer.observe(fightinFor);



(() => {
  const continueLink = document.getElementById("donateContinue");
  const customInput = document.getElementById("customAmount");
  const amountButtons = document.querySelectorAll(".amount-btn");

  if (!continueLink) return;

  // Base ActBlue URL (must be valid or you'll always get 404)
  const baseDonateUrl = continueLink.getAttribute("href");

  function setContinueAmount(amount) {
  	const url = new URL(baseDonateUrl);
  	url.searchParams.set("amount", amount);
  	continueLink.setAttribute("href", url.toString());
  }

  // Quick amount buttons
  amountButtons.forEach(btn => {
  	btn.addEventListener("click", () => {
  		const amount = btn.dataset.amount;
  		const url = new URL(baseDonateUrl);
  		url.searchParams.set("amount", amount);
  		window.open(url.toString(), "_blank", "noopener");
  	});
  });


  // Custom amount typing
  if (customInput) {
    customInput.addEventListener("input", () => {
      // clear button highlight when custom is used
      amountButtons.forEach(b => b.classList.remove("is-active"));

      const raw = (customInput.value || "").trim();
      if (!raw) return;

      const amount = Number(raw);
      if (!Number.isFinite(amount) || amount <= 0) return;

      setContinueAmount(String(amount));
    });
  }

  // Default: preselect $100 on load
  const defaultBtn = document.querySelector(".amount-btn.main-donate");
  if (defaultBtn?.dataset.amount) {
    amountButtons.forEach(b => b.classList.remove("is-active"));
    defaultBtn.classList.add("is-active");
    setContinueAmount(defaultBtn.dataset.amount);
  }
})();





const openBtn = document.getElementById('openTestimonialModal');
  const modal = document.getElementById('testimonialModal');
  const closeEls = modal.querySelectorAll('[data-close]');

  openBtn.addEventListener('click', () => {
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  });

  closeEls.forEach(el => {
    el.addEventListener('click', closeModal);
  });

  function closeModal(){
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  document.addEventListener('keydown', e => {
    if(e.key === 'Escape' && modal.classList.contains('is-open')){
      closeModal();
    }
  });