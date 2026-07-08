async function initDashboard() {

    // Check login
    const { data: sessionData } = await supabaseClient.auth.getSession();

    if (!sessionData.session) {
        window.location.href = "login.html";
        return;
    }

    document.getElementById("userEmail").textContent =
        sessionData.session.user.email;

    // Load clients
    const { data: clients, error } = await supabaseClient
        .from("clients")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error(error);
        return;
    }

    document.getElementById("totalLeads").textContent = clients.length;

    const newLeads = clients.filter(c => c.status === "New Lead");
    document.getElementById("newLeads").textContent = newLeads.length;

    const tbody = document.getElementById("recentLeads");
    tbody.innerHTML = "";

    clients.slice(0, 10).forEach(client => {

        tbody.innerHTML += `
            <tr>
                <td>${client.full_name}</td>
                <td>${client.phone}</td>
                <td>${client.status}</td>
            </tr>
        `;
    });

}

document.getElementById("logoutBtn").addEventListener("click", async (e) => {
    e.preventDefault();
    await supabaseClient.auth.signOut();
    window.location.href = "login.html";
});

initDashboard();