let clients = [];

// ==========================
// INITIALISE PAGE
// ==========================
async function loadLeads() {

    // Check if user is logged in
    const { data: sessionData } = await supabaseClient.auth.getSession();

    if (!sessionData.session) {
        window.location.href = "login.html";
        return;
    }

    // Display logged in user's email
    document.getElementById("userEmail").textContent =
        sessionData.session.user.email;

    // Load all clients
    const { data, error } = await supabaseClient
        .from("clients")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error(error);
        alert("Error loading leads: " + error.message);
        return;
    }

    clients = data;

    renderTable(clients);
}

// ==========================
// RENDER TABLE
// ==========================
function renderTable(data) {

    const tbody = document.getElementById("leadTable");

    tbody.innerHTML = "";

    if (data.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align:center;padding:30px;">
                    No leads found.
                </td>
            </tr>
        `;
        return;
    }

    data.forEach(client => {

        tbody.innerHTML += `
            <tr>

                <td>${client.full_name ?? ""}</td>

                <td>${client.id_number ?? ""}</td>

                <td>${client.phone ?? ""}</td>

                <td>${client.email ?? ""}</td>

                <td>R ${Number(client.debt_amount || 0).toLocaleString()}</td>

                <td>${client.status ?? "New Lead"}</td>

                <td>${new Date(client.created_at).toLocaleDateString()}</td>

            </tr>
        `;
    });
}

// ==========================
// SEARCH
// ==========================
document.getElementById("search").addEventListener("input", function () {

    const search = this.value.toLowerCase();

    const filtered = clients.filter(client => {

        return (

            (client.full_name || "").toLowerCase().includes(search)

            ||

            (client.id_number || "").includes(search)

            ||

            (client.phone || "").includes(search)

            ||

            (client.email || "").toLowerCase().includes(search)

        );

    });

    renderTable(filtered);

});

// ==========================
// EXPORT CSV
// ==========================
document.getElementById("exportExcel").addEventListener("click", exportCSV);

function exportCSV() {

    let csv =
`Name,SA ID Number,Phone,Email,Debt,Status,Date
`;

    clients.forEach(client => {

        csv += `"${client.full_name}","${client.id_number}","${client.phone}","${client.email}","${client.debt_amount}","${client.status}","${client.created_at}"
`;

    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = "Leads.csv";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

}

// ==========================
// LOGOUT
// ==========================
document.getElementById("logoutBtn").addEventListener("click", async (e) => {

    e.preventDefault();

    await supabaseClient.auth.signOut();

    window.location.href = "login.html";

});

// ==========================
// START PAGE
// ==========================
loadLeads();