// Auto-close accordion + open correct section when arriving with #hash

function closeAll() {
	document.querySelectorAll("[data-accordion-button]").forEach((b) => {
		b.setAttribute("aria-expanded", "false");
	});
	document.querySelectorAll("[data-accordion-panel]").forEach((p) => {
		p.hidden = true;
	});
}

function openItem(itemEl) {
	const btn = itemEl.querySelector("[data-accordion-button]");
	const panel = itemEl.querySelector("[data-accordion-panel]");
	if (!btn || !panel) return;

	closeAll();
	btn.setAttribute("aria-expanded", "true");
	panel.hidden = false;
}

document.addEventListener("click", (e) => {
	const btn = e.target.closest("[data-accordion-button]");
	if (!btn) return;

	const item = btn.closest("[data-accordion-item]");
	const isOpen = btn.getAttribute("aria-expanded") === "true";

	// Always auto-close others
	closeAll();

	// Toggle current
	if (!isOpen) {
		const panel = item.querySelector("[data-accordion-panel]");
		btn.setAttribute("aria-expanded", "true");
		panel.hidden = false;
	}
});

// Open based on hash (and also when hash changes)
function openFromHash() {
	const hash = window.location.hash;
	if (!hash) return;

	const target = document.querySelector(hash);
	if (!target) return;

	openItem(target);
}

window.addEventListener("DOMContentLoaded", () => {
	closeAll();
	openFromHash();
});

window.addEventListener("hashchange", openFromHash);