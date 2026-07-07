document
.getElementById("loginForm")
.addEventListener("submit", login);

async function login(e){

e.preventDefault();

const email =
document.getElementById("email").value;

const password =
document.getElementById("password").value;

const { error } =
await supabaseClient.auth.signInWithPassword({

email,

password

});

if(error){

document.getElementById("message")
.innerHTML = error.message;

return;

}

window.location.href =
"dashboard.html";

}