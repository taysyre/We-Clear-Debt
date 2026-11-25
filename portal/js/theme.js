(function () {
    const storageKey = "wcd-portal-dark-mode";
    const enabled = localStorage.getItem(storageKey) === "true";
    const checkbox = document.getElementById("darkMode");

    document.body.classList.toggle("dark-mode", enabled);

    if (!checkbox) {
        return;
    }

    checkbox.checked = enabled;
    checkbox.addEventListener("change", function () {
        document.body.classList.toggle("dark-mode", checkbox.checked);
        localStorage.setItem(storageKey, String(checkbox.checked));
    });
})();
