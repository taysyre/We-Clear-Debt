(() => {
    const form = document.getElementById("serviceFeedbackForm");
    const status = document.getElementById("feedbackStatus");
    const submitButton = form?.querySelector('button[type="submit"]');

    if (!form || !status || !submitButton) {
        return;
    }

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        submitButton.disabled = true;
        status.classList.remove("is-error");
        status.textContent = "Sending your feedback...";

        try {
            const response = await fetch(form.action, {
                method: "POST",
                body: new FormData(form),
                headers: { Accept: "application/json" }
            });

            if (!response.ok) {
                throw new Error(`Feedback submission failed with status ${response.status}`);
            }

            form.reset();
            status.textContent = "Thank you. Your feedback has been sent to our team.";
        } catch (error) {
            console.error("Could not send service feedback:", error);
            status.classList.add("is-error");
            status.textContent = "We couldn't send your feedback. Please try again or contact us by phone or WhatsApp.";
        } finally {
            submitButton.disabled = false;
        }
    });
})();
