// ✅ Vérifier si connecté
function checkLoggedIn() {
  if (localStorage.getItem("currentUser")) {
    location.href = "index.html";
  }
}

// ✅ Connexion
function login(e) {
  e.preventDefault();
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;
  const users = JSON.parse(localStorage.getItem("xelarUsers") || "[]");
  const found = users.find(u => u.username === username && u.password === password);
  if (found) {
    localStorage.setItem("currentUser", JSON.stringify(found));
    location.href = "index.html";
  } else {
    alert("Nom d’utilisateur ou mot de passe incorrect.");
  }
}

// ✅ Déconnexion
function logout() {
  localStorage.removeItem("currentUser");
  location.href = "login.html";
}

// ✅ Créer un compte
function createAccount(e) {
  e.preventDefault();
  const users = JSON.parse(localStorage.getItem("xelarUsers") || "[]");
  const username = document.getElementById("username").value.trim();
  if (users.find(u => u.username === username)) return alert("Nom d’utilisateur déjà pris.");

  const file = document.getElementById("photo").files[0];
  const reader = new FileReader();
  reader.onloadend = () => {
    const user = {
      name: document.getElementById("name").value.trim(),
      username,
      password: document.getElementById("password").value,
      birth: document.getElementById("birth").value,
      ville: document.getElementById("ville").value.trim(),
      province: document.getElementById("province").value.trim(),
      adresse: document.getElementById("adresse").value.trim(),
      codepostal: document.getElementById("codepostal").value.trim(),
      telephone: document.getElementById("telephone").value.trim(),
      status: "🟢",
      photo: reader.result || ""
    };
    users.push(user);
    localStorage.setItem("xelarUsers", JSON.stringify(users));
    alert("Compte créé avec succès !");
    location.href = "login.html";
  };
  if (file) {
    reader.readAsDataURL(file);
  } else {
    reader.onloadend(); // pour créer sans photo
  }
}

// ✅ Accueil / Publication
function loadXelar() {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  if (!user) return location.href = "login.html";
  document.getElementById("currentUserPhoto").src = user.photo || "";
  document.getElementById("profile").innerHTML = `<p>Connecté en tant que <strong>${user.name}</strong></p>`;
  loadStories();
  loadPosts();

  document.getElementById("postForm").onsubmit = function (e) {
    e.preventDefault();
    const posts = JSON.parse(localStorage.getItem("xelarPosts") || "[]");
    const text = document.getElementById("postText").value.trim();
    const status = document.getElementById("status").value;
    const file = document.getElementById("postImage").files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      posts.unshift({
        id: Date.now(),
        text,
        image: reader.result || "",
        status,
        user: user.username,
        time: new Date().toLocaleString(),
        likes: 0
      });
      localStorage.setItem("xelarPosts", JSON.stringify(posts));
      document.getElementById("postText").value = "";
      loadPosts();
    };
    if (file) reader.readAsDataURL(file); else reader.onloadend();
  };
}

// ✅ Charger publications
function loadPosts() {
  const posts = JSON.parse(localStorage.getItem("xelarPosts") || "[]");
  const users = JSON.parse(localStorage.getItem("xelarUsers") || "[]");
  const container = document.getElementById("postList");
  container.innerHTML = posts.map(p => {
    const u = users.find(x => x.username === p.user);
    return `
      <div class="post-card">
        <div style="display:flex;gap:1rem;">
          ${u?.photo ? `<img src="${u.photo}" class="avatar">` : ""}
          <div>
            <strong>${u?.name || p.user}</strong> <span>@${p.user} · ${p.status}</span><br/>
            <small>${p.time}</small>
          </div>
        </div>
        <p>${p.text}</p>
        ${p.image ? `<img src="${p.image}" style="max-width:100%; border-radius:8px;">` : ""}
        <button onclick="likePost(${p.id})">❤️ ${p.likes}</button>
      </div>
    `;
  }).join("");
}

// ✅ Like post
function likePost(id) {
  const posts = JSON.parse(localStorage.getItem("xelarPosts") || "[]");
  const idx = posts.findIndex(p => p.id === id);
  if (idx !== -1) {
    posts[idx].likes++;
    localStorage.setItem("xelarPosts", JSON.stringify(posts));
    loadPosts();
  }
}

// ✅ Stories (avatars en haut de index.html)
function loadStories() {
  const users = JSON.parse(localStorage.getItem("xelarUsers") || "[]");
  const bar = document.getElementById("storyBar");
  if (!bar) return;
  bar.innerHTML = users.map(u => `
    <div class="story-item" onclick="location.href='friend-profile.html?u=${u.username}'">
      ${u.photo ? `<img src="${u.photo}" class="story-img">` : ""}
      <small>${u.name.split(" ")[0]}</small>
    </div>
  `).join("");
}

// ✅ Mon profil
function loadProfile() {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  if (!user) return location.href = "login.html";

  const profileBox = document.getElementById("myProfile");
  profileBox.innerHTML = `
    ${user.photo ? `<img src="${user.photo}" class="avatar-large">` : ""}
    <h3>${user.name} <span style="font-size:1rem;">@${user.username}</span></h3>
    <p><strong>Statut :</strong> ${user.status}</p>
    <p><strong>Adresse :</strong> ${user.adresse}, ${user.ville}, ${user.province}</p>
    <p><strong>Code postal :</strong> ${user.codepostal}</p>
    <p><strong>Téléphone :</strong> ${user.telephone}</p>
    <button onclick="document.querySelector('.update-photo-form').style.display='block'">🖼️ Modifier la photo</button>
  `;

  const posts = JSON.parse(localStorage.getItem("xelarPosts") || "[]");
  const myPosts = posts.filter(p => p.user === user.username);
  document.getElementById("myPosts").innerHTML = myPosts.map(p => `
    <div class="post-card">
      <p>${p.text}</p>
      ${p.image ? `<img src="${p.image}" style="max-width:100%; border-radius:6px;">` : ""}
      <small>${p.time}</small>
    </div>
  `).join("") || "<p style='color:#aaa;'>Aucune publication</p>";
}
function updateProfilePhoto(e) {
  e.preventDefault();
  const users = JSON.parse(localStorage.getItem("xelarUsers") || "[]");
  const current = JSON.parse(localStorage.getItem("currentUser"));
  const file = document.getElementById("newProfilePhoto").files[0];
  const reader = new FileReader();
  reader.onloadend = () => {
    const idx = users.findIndex(u => u.username === current.username);
    if (idx !== -1) {
      users[idx].photo = reader.result;
      localStorage.setItem("xelarUsers", JSON.stringify(users));
      localStorage.setItem("currentUser", JSON.stringify(users[idx]));
      alert("Photo mise à jour !");
      location.reload();
    }
  };
  reader.readAsDataURL(file);
}

// ✅ Voir un profil ami
function loadFriendProfile() {
  const username = new URLSearchParams(location.search).get("u");
  const users = JSON.parse(localStorage.getItem("xelarUsers") || "[]");
  const friend = users.find(u => u.username === username);
  if (!friend) return document.body.innerHTML = "<h2>Utilisateur introuvable</h2>";

  document.getElementById("friendProfile").innerHTML = `
    ${friend.photo ? `<img src="${friend.photo}" class="avatar-large">` : ""}
    <h3>${friend.name} <span>@${friend.username}</span></h3>
    <p>${friend.status}</p>
    <p>${friend.adresse}, ${friend.ville}, ${friend.province}</p>
    <p>${friend.codepostal}</p>
    <p>${friend.telephone}</p>
  `;

  const posts = JSON.parse(localStorage.getItem("xelarPosts") || "[]");
  const friendPosts = posts.filter(p => p.user === username);
  document.getElementById("friendPosts").innerHTML = friendPosts.map(p => `
    <div class="post-card">
      <p>${p.text}</p>
      ${p.image ? `<img src="${p.image}" style="max-width:100%;">` : ""}
      <small>${p.time}</small>
    </div>
  `).join("") || "<p style='color:#aaa;'>Aucune publication</p>";
}

// ✅ Recherche dynamique
function initSearch() {
  document.getElementById("searchInput").addEventListener("input", function () {
    const q = this.value.toLowerCase().trim();
    const container = document.getElementById("suggestions");
    const users = JSON.parse(localStorage.getItem("xelarUsers") || "[]");
    const filtered = users.filter(u =>
      u.name.toLowerCase().includes(q) || u.username.toLowerCase().includes(q)
    );

        container.innerHTML = filtered.map(u => `
      <div class="post-card" onclick="location.href='friend-profile.html?u=${u.username}'" style="cursor:pointer;">
        ${u.photo ? `<img src="${u.photo}" class="avatar">` : ""}
        <strong>${u.name}</strong> <span style="color:#aaa;">@${u.username}</span><br>
        <small>${u.ville}, ${u.province}</small>
      </div>
    `).join("") || "<p style='color:#888;text-align:center;'>Aucun résultat</p>";
  });
}  
// 🔁 Réinitialisation comptes par défaut
(function () {
  const kuny = {
    name: "Kuny",
    username: "137kuny",
    birth: "2000-01-01",
    password: "kunypass",
    photo: "",
    status: "🟢",
    ville: "Likasi",
    province: "Haut-Katanga",
    adresse: "astras",
    codepostal: "astras8002",
    telephone: "+243976593482"
  };

  const astras = {
    name: "Astras",
    username: "2008astras",
    birth: "1999-08-08",
    password: "astraspass",
    photo: "",
    status: "🟢",
    ville: "Likasi",
    province: "Haut-Katanga",
    adresse: "astras",
    codepostal: "astras8002",
    telephone: "+243976593482"
  };

  localStorage.setItem("xelarUsers", JSON.stringify([kuny, astras]));
})();

function addFriend() {
  alert("✅ Cette personne a été ajoutée à tes amis (simulation).");
  // Tu peux plus tard stocker dans localStorage la liste des amis
}

function directMessage() {
  const username = new URLSearchParams(location.search).get("u");
  localStorage.setItem("chatTarget", username);
  location.href = "chat.html";
}
function showNotification(text) {
  const bar = document.getElementById("notifBar");
  if (bar) {
    bar.innerText = text;
    bar.style.display = "block";
    setTimeout(() => (bar.style.display = "none"), 4000);
  }
}

function addFriend() {
  const target = new URLSearchParams(location.search).get("u");
  const current = JSON.parse(localStorage.getItem("currentUser"));
  if (!current.friends) current.friends = [];
  if (!current.friends.includes(target)) {
    current.friends.push(target);
    localStorage.setItem("currentUser", JSON.stringify(current));
    showNotification(`✅ Tu as ajouté ${target} comme ami !`);
  } else {
    showNotification(`ℹ️ ${target} est déjà dans ta liste d'amis.`);
  }
}

function directMessage() {
  const target = new URLSearchParams(location.search).get("u");
  localStorage.setItem("chatTarget", target);
  location.href = "chat.html";
}

function showNotification(txt) {
  const bar = document.getElementById("notifBar");
  if (!bar) return;
  bar.innerText = txt;
  bar.style.display = "block";
  setTimeout(() => { bar.style.display = "none"; }, 4000);
}
function loadFriendProfile() {
  const username = new URLSearchParams(location.search).get("u");
  const users = JSON.parse(localStorage.getItem("xelarUsers") || "[]");
  const friend = users.find(u => u.username === username);
  if (!friend) return document.body.innerHTML = "<h2>Utilisateur introuvable</h2>";

  document.getElementById("friendProfile").innerHTML = `
    ${friend.photo ? `<img src="${friend.photo}" class="avatar-large">` : ""}
    <h3>${friend.name} <span>@${friend.username}</span></h3>
    <p>${friend.status}</p>
    <p>${friend.adresse}, ${friend.ville}, ${friend.province}</p>
    <p>${friend.codepostal}</p>
    <p>${friend.telephone}</p>
    <div style="margin-top:1rem;">
      <button onclick="addFriend()">➕ Ajouter comme ami</button>
      <button onclick="directMessage()">💬 Envoyer un message</button>
    </div>
  `;
}