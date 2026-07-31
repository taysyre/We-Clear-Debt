async function loadSettings() {

    const { data: session } = await supabaseClient.auth.getSession();

    if (!session.session) {

        window.location.href = "login.html";

        return;

    }

    document.getElementById("userEmail").textContent =
        session.session.user.email;

    document.getElementById("adminEmail").value =
        session.session.user.email;

}

document.getElementById("passwordBtn")
.addEventListener("click", async () => {

    const password =
        document.getElementById("newPassword").value;

    if(password.length < 6){

        alert("Password must be at least 6 characters.");

        return;

    }

    const { error } =
        await supabaseClient.auth.updateUser({

            password: password

        });

    if(error){

        alert(error.message);

        return;

    }

    alert("Password updated successfully.");

    document.getElementById("newPassword").value = "";

});

document.getElementById("logoutBtn")
.addEventListener("click", async (e)=>{

    e.preventDefault();

    await supabaseClient.auth.signOut();

    window.location.href="login.html";

});

loadSettings();