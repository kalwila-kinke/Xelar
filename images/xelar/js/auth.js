// Données utilisateur fixes (local uniquement pour test)
const user = {
  username: "kinke",
  password: "kuny137$KN",
  phone: "+243976593482"
};

function loginUser(event) {
  event.preventDefault();
  const inputUsername = document.getElementById("username").value.toLowerCase();
  const inputPassword = document.getElementById("password").value;

  if (inputUsername === user.username && inputPassword === user.password) {
    alert(`Bienvenue ${user.username.toUpperCase()} ! 📱 Tel: ${user.phone}`);
    window.location.href = "index.html";
  } else {
    alert("Identifiants incorrects ❌");
  }
}