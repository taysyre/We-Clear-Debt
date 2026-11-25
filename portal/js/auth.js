const loginForm = document.getElementById("loginForm");
const passwordSetupForm = document.getElementById("passwordSetupForm");
const message = document.getElementById("message");

loginForm.addEventListener("submit", login);
passwordSetupForm.addEventListener("submit", setPassword);

async function login(event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    try {
        const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
        if (error) {
            message.textContent = error.message;
            return;
        }
        window.location.href = "dashboard.html";
    } catch (error) {
        message.textContent = error.message || "Could not sign in. Try again.";
    }
}

async function setPassword(event) {
    event.preventDefault();

    const password = document.getElementById("setupPassword").value;
    const confirmation = document.getElementById("confirmPassword").value;
    if (password !== confirmation) {
        message.textContent = "The passwords do not match.";
        return;
    }

    const submitButton = passwordSetupForm.querySelector("button[type='submit']");
    submitButton.disabled = true;
    message.textContent = "";

    try {
        const { error } = await supabaseClient.auth.updateUser({ password });
        if (error) {
            message.textContent = error.message;
            return;
        }

        message.textContent = "Password set. Opening the portal...";
        window.location.href = "dashboard.html";
    } catch (error) {
        message.textContent = error.message || "Could not set the password. Try again.";
    } finally {
        submitButton.disabled = false;
    }
}

async function initializePasswordSetup() {
    const params = new URLSearchParams(window.location.hash.slice(1));
    const callback = window.portalAuthCallback || {};
    const flow = callback.flow || params.get("type");
    const authError = callback.error || params.get("error_description");

    if (authError) {
        message.textContent = authError;
        window.history.replaceState(null, "", window.location.pathname + window.location.search);
        return;
    }

    if (flow !== "invite" && flow !== "recovery") {
        return;
    }

    try {
        const { data, error } = await supabaseClient.auth.getSession();
        window.history.replaceState(null, "", window.location.pathname + window.location.search);
        if (error || !data.session) {
            message.textContent = "This invitation or password reset link is invalid or expired.";
            return;
        }

        loginForm.hidden = true;
        passwordSetupForm.hidden = false;
        document.getElementById("loginSubtitle").textContent =
            flow === "invite" ? "Set a password to finish joining the portal." : "Choose a new password.";
    } catch (error) {
        message.textContent = error.message || "Could not verify the link. Try again.";
        return;
    }
}

initializePasswordSetup();
