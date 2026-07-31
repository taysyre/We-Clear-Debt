let clients = [];

async function loadClients() {

    const { data: sessionData } = await supabaseClient.auth.getSession();

    if (!sessionData.session) {

        window.location.href = "login.html";
        return;

    }

    document.getElementById("userEmail").textContent =
        sessionData.session.user.email;

    const { data, error } = await supabaseClient
        .from("clients")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {

        alert(error.message);
        return;

    }

    clients = data;

    renderTable(clients);

    document.getElementById("totalClients").textContent =
        clients.length;

    document.getElementById("activeClients").textContent =
        clients.filter(c => c.status === "Debt Review").length;

    document.getElementById("completedClients").textContent =
        clients.filter(c => c.status === "Completed").length;

    document.getElementById("holdClients").textContent =
        clients.filter(c => c.status === "On Hold").length;

}

function renderTable(data){

    const tbody = document.getElementById("clientTable");

    tbody.innerHTML = "";

    data.forEach(client=>{

        tbody.innerHTML += `

        <tr>

            <td>${client.full_name}</td>

            <td>${client.id_number || ""}</td>

            <td>${client.phone}</td>

            <td>${client.email}</td>

            <td>R ${Number(client.debt_amount || 0).toLocaleString()}</td>

            <td>
                <span class="status ${client.status?.replace(/\s/g,'').toLowerCase()}">
                    ${client.status}
                </span>
            </td>

            <td>

                <button onclick="viewClient(${client.id})" class="btn-action">
                    View
                </button>

            </td>

        </tr>

        `;

    });

}

document.getElementById("search").addEventListener("input",function(){

    const value = this.value.toLowerCase();

    renderTable(

        clients.filter(c=>

            (c.full_name || "").toLowerCase().includes(value)

            ||

            (c.phone || "").includes(value)

            ||

            (c.email || "").toLowerCase().includes(value)

            ||

            (c.id_number || "").includes(value)

        )

    );

});

async function viewClient(id){

    localStorage.setItem("selectedClient",id);

    window.location.href="client-details.html";

}

document.getElementById("logoutBtn")
.addEventListener("click",async function(e){

    e.preventDefault();

    await supabaseClient.auth.signOut();

    window.location.href="login.html";

});

loadClients();