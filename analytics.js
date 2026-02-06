(() => {
    const START = Date.now();
    const SID_KEY = "sg_sid";

    function sid() {
        let v = sessionStorage.getItem(SID_KEY);
        if (!v) {
            v = (crypto?.randomUUID?.() || String(Math.random()).slice(2));
            sessionStorage.setItem(SID_KEY, v);
        }
        return v;
    }

    function safeUrl(u) {
        try {
            const url = new URL(u, location.href);
            //Don’t send query strings from your site (avoid leaking anything)
            return url.origin + url.pathname;
        } catch {
            return null;
        }
    }

    function post(payload) {
        const body = JSON.stringify(payload);

        //Use Netlify function endpoint (recommended)
        const endpoint = "/.netlify/functions/track";

        if (navigator.sendBeacon) {
            navigator.sendBeacon(endpoint, body);
            return;
        }

        fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body,
            keepalive: true,
        }).catch(() => {});
    }

    window.trackEvent = (event, props = {}) => {
    //IMPORTANT: do not include PII (name/email/phone) in props
        post({
            event,
            ts: new Date().toISOString(),
            sid: sid(),
            path: location.pathname,
            ref: safeUrl(document.referrer),
            ...props,
        });
    };

    //Page view
    window.trackEvent("page_view");

    //Engaged time (records when user hides/leaves page)
    function report(reason) {
        const ms = Date.now() - START;
        window.trackEvent("engaged_time", { ms, reason });
    }

    document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "hidden") report("hidden");
    });

    window.addEventListener("pagehide", () => report("pagehide"));
})();