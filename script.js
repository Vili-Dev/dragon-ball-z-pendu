// --- Listes de mots par difficulté ---
const motsFaciles = [
  "goku", "buu", "cell", "beerus", "bulma", "chichi", "kaio", "nappa", "ten"
];
const motsNormaux = [
  "vegeta", "freezer", "goten", "krilin", "piccolo", "shenron", "raditz", "trunks", "majinbuu"
];
const motsDifficiles = [
  "kamehameha", "ultrainstinct", "megashenron", "supervegeto", "resurrection", "destruction",
  "namekuseijin", "transformation", "potaras", "dragonballsuper"
];

// --- Récupération des éléments ---
const wordElement = document.getElementById("word");
const wrongLettersElement = document.getElementById("wrong-letters");
const errorsElement = document.getElementById("errors");
const messageElement = document.getElementById("message");
const replayButton = document.getElementById("replay");
const canvas = document.getElementById("pendu-canvas");
const ctx = canvas.getContext("2d");
const difficultySelect = document.getElementById("difficulty");
const newGameButton = document.getElementById("new-game");
const keyboardDiv = document.getElementById("keyboard");

const alphabet = "abcdefghijklmnopqrstuvwxyz";

let mot = "";
let lettresCorrectes = [];
let lettresIncorrectes = [];
const maxErreurs = 6;
let clavierActif = true;

// --- Choix du mot selon la difficulté ---
function getMotSelonDifficulte() {
  const niveau = difficultySelect.value;
  if (niveau === "easy") return motsFaciles[Math.floor(Math.random() * motsFaciles.length)];
  if (niveau === "hard") return motsDifficiles[Math.floor(Math.random() * motsDifficiles.length)];
  return motsNormaux[Math.floor(Math.random() * motsNormaux.length)];
}

// --- Démarrer une nouvelle partie ---
function choisirMot() {
  mot = getMotSelonDifficulte();
  lettresCorrectes = [];
  lettresIncorrectes = [];
  messageElement.textContent = "";
  wrongLettersElement.textContent = "";
  errorsElement.textContent = "0";
  dessinerPendu(0);
  afficherMot();
  clavierActif = true;
  renderKeyboard();
  replayButton.style.display = "none";
}

// --- Affichage du mot à deviner ---
function afficherMot() {
  wordElement.innerHTML = mot
    .split("")
    .map(l => lettresCorrectes.includes(l) ? l : "_")
    .join(" ");
}

// --- Clavier virtuel dynamique ---
function renderKeyboard() {
  keyboardDiv.innerHTML = "";
  for (let l of alphabet) {
    const btn = document.createElement("button");
    btn.textContent = l;
    btn.id = "key-" + l;
    btn.disabled = lettresCorrectes.includes(l) || lettresIncorrectes.includes(l) || !clavierActif;
    btn.addEventListener("click", () => handleVirtualKey(l));
    keyboardDiv.appendChild(btn);
  }
}

// --- Gestion du clic sur clavier virtuel ---
function handleVirtualKey(lettre) {
  if (!clavierActif) return;
  processInput(lettre);
}

// --- Saisie clavier physique ---
function handleKeydown(e) {
  if (!clavierActif) return;
  const lettre = e.key.toLowerCase();
  processInput(lettre);
}

// --- Traitement commun (virtuel/physique) ---
function processInput(lettre) {
  if (!/^[a-z]$/.test(lettre)) return;
  if (lettresCorrectes.includes(lettre) || lettresIncorrectes.includes(lettre)) return;

  if (mot.includes(lettre)) {
    lettresCorrectes.push(lettre);
  } else {
    lettresIncorrectes.push(lettre);
    errorsElement.textContent = lettresIncorrectes.length;
    dessinerPendu(lettresIncorrectes.length);
  }
  afficherMot();
  wrongLettersElement.textContent = lettresIncorrectes.join(", ");
  verifierFinJeu();
  renderKeyboard();
}

// --- Dessin du pendu façon Freezer ---
function dessinerPendu(erreurs) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Titre
  ctx.fillStyle = "#ffcc00";
  ctx.font = "bold 16px Arial";
  ctx.fillText("Freezer te vise...", 65, 20);

  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 2;

  // Étape 1 - Tête
  if (erreurs >= 1) {
    ctx.beginPath();
    ctx.arc(125, 60, 20, 0, Math.PI * 2); // Tête
    ctx.stroke();
  }

  // Étape 2 - Corps
  if (erreurs >= 2) {
    ctx.beginPath();
    ctx.moveTo(125, 80);
    ctx.lineTo(125, 140);
    ctx.stroke();
  }

  // Étape 3 - Bras gauche
  if (erreurs >= 3) {
    ctx.beginPath();
    ctx.moveTo(125, 100);
    ctx.lineTo(95, 120);
    ctx.stroke();
  }

  // Étape 4 - Bras droit + boule d’énergie
  if (erreurs >= 4) {
    ctx.beginPath();
    ctx.moveTo(125, 100);
    ctx.lineTo(155, 120);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(160, 125, 6, 0, Math.PI * 2); // Boule d’énergie
    ctx.fillStyle = "purple";
    ctx.fill();
  }

  // Étape 5 - Jambes
  if (erreurs >= 5) {
    ctx.beginPath();
    ctx.moveTo(125, 140);
    ctx.lineTo(105, 180);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(125, 140);
    ctx.lineTo(145, 180);
    ctx.stroke();
  }

  // Étape 6 - Yeux rouges
  if (erreurs >= 6) {
    // Yeux rouges (position fixe sur visage)
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(118, 60, 3, 0, Math.PI * 2); // œil gauche
    ctx.fill();

    ctx.beginPath();
    ctx.arc(132, 60, 3, 0, Math.PI * 2); // œil droit
    ctx.fill();

    // sourcils menaçants
    ctx.strokeStyle = "red";
    ctx.beginPath();
    ctx.moveTo(113, 53);
    ctx.lineTo(123, 55); // sourcil gauche
    ctx.moveTo(127, 55);
    ctx.lineTo(137, 53); // sourcil droit
    ctx.stroke();

    // Reset couleur
    ctx.strokeStyle = "#fff";
  }
}

// --- Vérification de la victoire ou de la défaite ---
function verifierFinJeu() {
  const motUnique = [...new Set(mot)];
  if (motUnique.every(l => lettresCorrectes.includes(l))) {
    messageElement.textContent = "🎉 Bravo, tu as gagné !";
    clavierActif = false;
    replayButton.style.display = "inline-block";
    renderKeyboard();
  } else if (lettresIncorrectes.length >= maxErreurs) {
    messageElement.textContent = `💀 Freezer a gagné ! Le mot était : ${mot}`;
    afficherMot();
    clavierActif = false;
    replayButton.style.display = "inline-block";
    renderKeyboard();
  }
}

// --- Evénements ---

newGameButton.addEventListener("click", choisirMot);
replayButton.addEventListener("click", choisirMot);
difficultySelect.addEventListener("change", choisirMot);
document.addEventListener("keydown", handleKeydown);

// --- Démarrage auto au chargement
window.addEventListener("DOMContentLoaded", choisirMot);