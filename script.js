const mots = [
  "goku", "vegeta", "kamehameha", "namek", "freezer",
  "super", "saiyan", "cell", "trunks", "goten",
  "piccolo", "shenron", "krilin", "majinbuu", "kaio",
  "raditz", "ten", "yamcha", "bulma", "broly"
];

let mot = "";
let lettresCorrectes = [];
let lettresIncorrectes = [];

const wordElement = document.getElementById("word");
const wrongLettersElement = document.getElementById("wrong-letters");
const errorsElement = document.getElementById("errors");
const messageElement = document.getElementById("message");
const replayButton = document.getElementById("replay");

const canvas = document.getElementById("pendu-canvas");
const ctx = canvas.getContext("2d");

function choisirMot() {
  mot = mots[Math.floor(Math.random() * mots.length)];
  lettresCorrectes = [];
  lettresIncorrectes = [];
  messageElement.textContent = "";
  wrongLettersElement.textContent = "";
  errorsElement.textContent = "0";
  replayButton.style.display = "none";
  dessinerPendu(0);
  afficherMot();
}

function afficherMot() {
  wordElement.innerHTML = mot
    .split("")
    .map(l => lettresCorrectes.includes(l) ? l : "_")
    .join(" ");
}

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

function verifierFinJeu() {
  const motUnique = [...new Set(mot)];
  if (motUnique.every(l => lettresCorrectes.includes(l))) {
    messageElement.textContent = "🎉 Bravo, tu as gagné !";
    document.removeEventListener("keydown", handleKeydown);
    replayButton.style.display = "inline-block";
  } else if (lettresIncorrectes.length >= 6) {
    messageElement.textContent = `💀 Freezer a gagné ! Le mot était : ${mot}`;
    afficherMot();
    document.removeEventListener("keydown", handleKeydown);
    replayButton.style.display = "inline-block";
  }
}

function handleKeydown(e) {
  const lettre = e.key.toLowerCase();
  if (/^[a-z]$/.test(lettre)) {
    if (mot.includes(lettre)) {
      if (!lettresCorrectes.includes(lettre)) {
        lettresCorrectes.push(lettre);
      }
    } else {
      if (!lettresIncorrectes.includes(lettre)) {
        lettresIncorrectes.push(lettre);
        errorsElement.textContent = lettresIncorrectes.length;
        dessinerPendu(lettresIncorrectes.length);
      }
    }
    afficherMot();
    wrongLettersElement.textContent = lettresIncorrectes.join(", ");
    verifierFinJeu();
  }
}

replayButton.addEventListener("click", () => {
  document.addEventListener("keydown", handleKeydown);
  choisirMot();
});

document.addEventListener("keydown", handleKeydown);
choisirMot();