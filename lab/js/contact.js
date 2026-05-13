/**
 * Contact form logic for the Lab site.
 *
 * Submission strategy
 * -------------------
 * 1. If FORM_ENDPOINT is set to a non-empty URL (e.g. a Formspree / Web3Forms
 *    / custom backend endpoint), the form is POSTed there as JSON.
 * 2. Otherwise it falls back to opening the user's mail client via a mailto:
 *    link prefilled with the message body.
 *
 * The form is progressively enhanced: if JS is disabled, the underlying
 * <form action="mailto:..."> still works in most browsers.
 */
(function () {
    "use strict";

    // ---- Config ------------------------------------------------------------
    // Drop in a Formspree / Web3Forms / custom endpoint here when ready.
    // Example: "https://formspree.io/f/xxxxxxxx"
    const FORM_ENDPOINT = "";
    const FALLBACK_EMAIL = "aadityarajyadav@iitk.ac.in";

    // ---- DOM ---------------------------------------------------------------
    const form = document.getElementById("contact-form");
    if (!form) return;

    const statusEl = document.getElementById("form-status");
    const submitBtn = form.querySelector('button[type="submit"]');

    // ---- Helpers -----------------------------------------------------------
    const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function setStatus(message, kind) {
        if (!statusEl) return;
        statusEl.textContent = message;
        statusEl.dataset.kind = kind || "info";
    }

    function clearFieldErrors() {
        form.querySelectorAll(".field-error").forEach((el) => {
            el.textContent = "";
        });
        form.querySelectorAll('[aria-invalid="true"]').forEach((el) => {
            el.setAttribute("aria-invalid", "false");
        });
    }

    function showFieldError(name, message) {
        const field = form.querySelector(`[name="${name}"]`);
        const errEl = form.querySelector(`.field-error[data-for="${name}"]`);
        if (field) field.setAttribute("aria-invalid", "true");
        if (errEl) errEl.textContent = message;
    }

    function validate(data) {
        const errors = {};
        if (!data.name || data.name.trim().length < 2) {
            errors.name = "Please tell me your name.";
        }
        if (!data.email || !EMAIL_RE.test(data.email)) {
            errors.email = "A valid email address, please.";
        }
        if (!data.subject || data.subject.trim().length < 3) {
            errors.subject = "Give the message a short subject.";
        }
        if (!data.message || data.message.trim().length < 10) {
            errors.message = "Message is a bit short (at least 10 characters).";
        }
        // Honeypot: real users leave this empty.
        if (data.website && data.website.trim() !== "") {
            errors._spam = "spam";
        }
        return errors;
    }

    function setSubmitting(isSubmitting) {
        if (!submitBtn) return;
        submitBtn.disabled = isSubmitting;
        submitBtn.dataset.originalText =
            submitBtn.dataset.originalText || submitBtn.textContent;
        submitBtn.textContent = isSubmitting
            ? "Sending…"
            : submitBtn.dataset.originalText;
    }

    function buildMailtoFallback(data) {
        const subject = encodeURIComponent(`[lab.contact] ${data.subject}`);
        const body = encodeURIComponent(
            `${data.message}\n\n— ${data.name} <${data.email}>`
        );
        return `mailto:${FALLBACK_EMAIL}?subject=${subject}&body=${body}`;
    }

    async function postToEndpoint(data) {
        const res = await fetch(FORM_ENDPOINT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(data),
        });
        if (!res.ok) {
            let detail = "";
            try {
                const j = await res.json();
                detail = j && j.error ? ` (${j.error})` : "";
            } catch (_) {
                /* ignore */
            }
            throw new Error(`Request failed: ${res.status}${detail}`);
        }
        return res;
    }

    // ---- Submit handler ----------------------------------------------------
    form.addEventListener("submit", async function (event) {
        event.preventDefault();
        clearFieldErrors();
        setStatus("", "info");

        const formData = new FormData(form);
        const data = {
            name: (formData.get("name") || "").toString(),
            email: (formData.get("email") || "").toString(),
            subject: (formData.get("subject") || "").toString(),
            message: (formData.get("message") || "").toString(),
            website: (formData.get("website") || "").toString(), // honeypot
        };

        const errors = validate(data);
        if (errors._spam) {
            // Pretend success for bots.
            setStatus("Thanks — your message was sent.", "success");
            form.reset();
            return;
        }
        if (Object.keys(errors).length > 0) {
            Object.entries(errors).forEach(([name, msg]) =>
                showFieldError(name, msg)
            );
            setStatus("Please fix the highlighted fields.", "error");
            return;
        }

        setSubmitting(true);

        try {
            if (FORM_ENDPOINT) {
                await postToEndpoint(data);
                setStatus("Thanks — your message was sent.", "success");
                form.reset();
            } else {
                // No backend configured: open the user's mail client.
                const href = buildMailtoFallback(data);
                window.location.href = href;
                setStatus(
                    "Opening your mail client… if nothing happens, email " +
                        FALLBACK_EMAIL +
                        " directly.",
                    "info"
                );
            }
        } catch (err) {
            console.error(err);
            setStatus(
                "Something went wrong sending the form. You can email " +
                    FALLBACK_EMAIL +
                    " instead.",
                "error"
            );
        } finally {
            setSubmitting(false);
        }
    });
})();
