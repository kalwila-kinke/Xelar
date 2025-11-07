// --- Faux comptes enregistrés ---
const users = [
  { username: "kuny@gmail.com", password: "kuny137" },
  { username: "astras", password: "8002astras" }
];

// --- Authentification locale (simulation frontend seulement) ---
function loginUser(username, password) {
  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    localStorage.setItem("xelarUser", user.username);
    alert(`Bienvenue, ${user.username} 🚀`);
    window.location.href = "profile.html";
  } else {
    alert("Identifiants incorrects ❌");
  }
}

// --- Affiche le nom connecté dans le profil (si dispo) ---
function displayUserName() {
  const username = localStorage.getItem("xelarUser");
  if (username) {
    const nameTag = document.querySelector("#user-name");
    if (nameTag) nameTag.textContent = username;
  }
}

// --- Message simulé dans la chatbox ---
function loadMessages() {
  const username = localStorage.getItem("xelarUser") || "Inconnu";
  const chat = document.querySelector(".chatbox");
  if (!chat) return;

  const messages = [
    { from: "astras", text: "Yo bro, Xelar c’est 🔥" },
    { from: "kuny", text: "Yes ! On va conquérir le digital 💙" },
    { from: username, text: "J'explore l’univers en codant 🚀" }
  ];

  const container = document.createElement("div");
  container.className = "chat-messages";

  messages.forEach((msg) => {
    const div = document.createElement("div");
    div.className = "message";
    if (msg.from === username) div.classList.add("from-me");
    div.textContent = `${msg.from} : ${msg.text}`;
    container.appendChild(div);
  });

  chat.insertBefore(container, chat.querySelector("input"));
}

// --- Déconnexion ---
function logoutUser() {
  localStorage.removeItem("xelarUser");
  alert("Déconnecté.");
  window.location.href = "../index.html";
}