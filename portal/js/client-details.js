let clientId = localStorage.getItem("selectedClient");

if (!clientId) {

    window.location.href = "clients.html";

}

async function loadClient(){

    const { data: session } =
    await supabaseClient.auth.getSession();

    if(!session.session){

        window.location.href="login.html";

        return;

    }

    document.getElementById("userEmail").textContent =
    session.session.user.email;

    const { data,error } =
    await supabaseClient

    .from("clients")

    .select("*")

    .eq("id",clientId)

    .single();

    if(error){

        alert(error.message);

        return;

    }

    document.getElementById("clientName").textContent =
    data.full_name;

    document.getElementById("phone").value =
    data.phone || "";

    document.getElementById("email").value =
    data.email || "";

    document.getElementById("idNumber").value =
    data.id_number || "";

    document.getElementById("income").value =
    data.income || "";

    document.getElementById("debt").value =
    data.debt_amount || "";

    document.getElementById("status").value =
    data.status || "New Lead";

    document.getElementById("notes").value =
    data.notes || "";

    document.getElementById("callBtn").href =
    "tel:" + data.phone;

    document.getElementById("emailBtn").href =
    "mailto:" + data.email;

}

document.getElementById("saveBtn")
.addEventListener("click",async()=>{

    const { error } =
    await supabaseClient

    .from("clients")

    .update({

        phone:
        document.getElementById("phone").value,

        email:
        document.getElementById("email").value,

        id_number:
        document.getElementById("idNumber").value,

        income:
        document.getElementById("income").value,

        debt_amount:
        document.getElementById("debt").value,

        status:
        document.getElementById("status").value,

        notes:
        document.getElementById("notes").value

    })

    .eq("id",clientId);

    if(error){

        alert(error.message);

        return;

    }

    alert("Client updated successfully.");

});

document.getElementById("logoutBtn")
.addEventListener("click",async(e)=>{

    e.preventDefault();

    await supabaseClient.auth.signOut();

    window.location.href="login.html";

});

loadClient();