/* ============================================================
   StudySync AI - Script JavaScript
   Auteur : Nour Kochat
   Description : Interactions pour toutes les pages
   ============================================================ */

/* -----------------------------------------------------------
   1. FONCTIONS UTILITAIRES
   ----------------------------------------------------------- */

/**
 * Obtenir la date et heure actuelles formatées
 * Retourne une chaîne de caractères lisible
 */
function obtenirHeure() {
  var maintenant = new Date();
  var heures   = maintenant.getHours();
  var minutes  = maintenant.getMinutes();
  /* Ajouter un zéro devant si nécessaire */
  if (minutes < 10) { minutes = "0" + minutes; }
  return heures + ":" + minutes;
}

/**
 * Créer un élément HTML avec une classe et du contenu
 * Paramètres : tag (String), classe (String), contenu (String)
 */
function creerElement(tag, classe, contenu) {
  var element = document.createElement(tag);
  if (classe) { element.className = classe; }
  if (contenu) { element.innerHTML = contenu; }
  return element;
}

/**
 * Faire défiler vers le bas d'un conteneur
 * Paramètres : conteneur (Element)
 */
function defilerVersLeBas(conteneur) {
  conteneur.scrollTop = conteneur.scrollHeight;
}

/* -----------------------------------------------------------
   2. NAVIGATION : lien actif
   ----------------------------------------------------------- */

/**
 * Marque le lien de navigation correspondant à la page courante
 * Utilise window.location.href pour comparer les URLs
 */
function marquerLienActif() {
  /* Récupère tous les liens de navigation dans le header */
  var liens = document.querySelectorAll("header nav ul li a");
  var urlCourante = window.location.href;

  for (var i = 0; i < liens.length; i++) {
    var lien = liens[i];
    /* Si l'href du lien correspond à l'URL courante */
    if (urlCourante.indexOf(lien.getAttribute("href")) !== -1) {
      lien.style.color = "#00d4ff";
    }
  }
}

/* -----------------------------------------------------------
   3. PAGE D'ACCUEIL : animation au défilement
   ----------------------------------------------------------- */

/**
 * Ajoute une animation d'apparition aux éléments
 * quand ils entrent dans le viewport lors du défilement
 */
function animerAuDefilement() {
  /* Sélectionne les sections et cartes à animer */
  var elements = document.querySelectorAll(".etape, .carte-fonc, .stat");

  for (var i = 0; i < elements.length; i++) {
    var el = elements[i];
    /* Position de l'élément par rapport à la fenêtre */
    var position = el.getBoundingClientRect();
    /* Si l'élément est visible dans la fenêtre */
    if (position.top < window.innerHeight - 80) {
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    }
  }
}

/* -----------------------------------------------------------
   4. FORMULAIRE INSCRIPTION : validation simple
   ----------------------------------------------------------- */

/**
 * Valide le formulaire d'inscription côté client
 * Vérifie que les champs obligatoires sont remplis
 * Retourne true si valide, false sinon
 */
function validerFormulaire() {
  var nom      = document.getElementById("nom");
  var email    = document.getElementById("email");
  var mdp      = document.getElementById("mot-de-passe");
  var confirm  = document.getElementById("confirmer-mdp");
  var niveau   = document.getElementById("niveau");

  /* Vérification du champ nom */
  if (nom && nom.value.trim() === "") {
    afficherErreur(nom, "Veuillez entrer votre nom complet.");
    return false;
  }

  /* Vérification du champ email */
  if (email && email.value.trim() === "") {
    afficherErreur(email, "Veuillez entrer votre adresse e-mail.");
    return false;
  }

  /* Vérification format email avec indexOf */
  if (email && email.value.indexOf("@") === -1) {
    afficherErreur(email, "L'adresse e-mail n'est pas valide.");
    return false;
  }

  /* Vérification du mot de passe (minimum 8 caractères) */
  if (mdp && mdp.value.length < 8) {
    afficherErreur(mdp, "Le mot de passe doit contenir au moins 8 caractères.");
    return false;
  }

  /* Vérification de la confirmation du mot de passe */
  if (mdp && confirm && mdp.value !== confirm.value) {
    afficherErreur(confirm, "Les mots de passe ne correspondent pas.");
    return false;
  }

  /* Vérification du niveau */
  if (niveau && niveau.value === "") {
    afficherErreur(niveau, "Veuillez choisir votre niveau d'études.");
    return false;
  }

  /* Vérification : au moins une matière cochée */
  var matieresCochees = document.querySelectorAll("input[name='matieres']:checked");
  if (matieresCochees.length === 0) {
    alert("Veuillez cocher au moins une matière.");
    return false;
  }

  return true;
}

/**
 * Affiche un message d'erreur sous un champ
 * Paramètres : champ (Element), message (String)
 */
function afficherErreur(champ, message) {
  /* Supprime l'erreur précédente si elle existe */
  supprimerErreur(champ);

  /* Crée le message d'erreur */
  var erreur = document.createElement("p");
  erreur.className = "erreur-message";
  erreur.textContent = "⚠ " + message;
  erreur.style.color = "#ef4444";
  erreur.style.fontSize = "0.85rem";
  erreur.style.marginTop = "0.25rem";

  /* Insère l'erreur après le champ */
  champ.parentNode.insertBefore(erreur, champ.nextSibling);

  /* Met en évidence le champ en erreur */
  champ.style.borderColor = "#ef4444";

  /* Focus sur le champ */
  champ.focus();
}

/**
 * Supprime le message d'erreur d'un champ
 * Paramètres : champ (Element)
 */
function supprimerErreur(champ) {
  var erreurExistante = champ.parentNode.querySelector(".erreur-message");
  if (erreurExistante) {
    erreurExistante.remove();
  }
  /* Restaure la couleur de bordure normale */
  champ.style.borderColor = "";
}

/* -----------------------------------------------------------
   5. DASHBOARD : messagerie de groupe
   ----------------------------------------------------------- */

/**
 * Envoie un message dans le chat de groupe
 * Ajoute le message dans l'historique visuellement
 */
function envoyerMessage() {
  var saisie = document.getElementById("saisie-message");
  var historique = document.getElementById("historique");

  if (!saisie || !historique) { return; }

  var texte = saisie.value.trim();

  /* On n'envoie pas si le champ est vide */
  if (texte === "") { return; }

  /* Crée le bloc du message */
  var divMessage = creerElement("div", "message message-moi", "");

  /* Contenu du message */
  var divContenu = creerElement("div", "msg-contenu", "");
  var strong = creerElement("strong", "", "Vous");
  var para   = creerElement("p", "", texte);
  var small  = creerElement("small", "", obtenirHeure());

  divContenu.appendChild(strong);
  divContenu.appendChild(para);
  divContenu.appendChild(small);

  /* Avatar */
  var divAvatar = creerElement("div", "msg-avatar moi", "NK");

  divMessage.appendChild(divContenu);
  divMessage.appendChild(divAvatar);

  /* Ajoute le message dans l'historique */
  historique.appendChild(divMessage);

  /* Vide le champ de saisie */
  saisie.value = "";

  /* Fait défiler vers le bas */
  defilerVersLeBas(historique);
}

/* -----------------------------------------------------------
   6. CHATBOT AI : simulation de réponses
   ----------------------------------------------------------- */

/**
 * Base de connaissances du chatbot
 * Chaque entrée contient des mots-clés et une réponse
 */
var baseChatbot = [
  {
    mots: ["algorithme", "tri", "sort"],
    reponse: "📐 <strong>Les algorithmes de tri</strong><br><br>Il existe plusieurs algorithmes de tri :<br>• <strong>Tri à bulles</strong> : compare les éléments adjacents. Complexité : O(n²)<br>• <strong>Tri par sélection</strong> : cherche le minimum à chaque étape. Complexité : O(n²)<br>• <strong>Tri rapide (QuickSort)</strong> : divise et conquiert. Complexité : O(n log n) en moyenne<br>• <strong>Tri fusion (MergeSort)</strong> : divise, trie, fusionne. Complexité : O(n log n)<br><br>Tu veux que j'explique l'un d'eux en détail ?"
  },
  {
    mots: ["complexité", "temporelle", "grand o", "o(n)"],
    reponse: "⏱ <strong>La complexité algorithmique</strong><br><br>La complexité mesure le temps ou l'espace nécessaire en fonction de la taille de l'entrée <em>n</em>.<br><br>• <strong>O(1)</strong> : constant (accès direct à un tableau)<br>• <strong>O(log n)</strong> : logarithmique (recherche binaire)<br>• <strong>O(n)</strong> : linéaire (parcours simple d'un tableau)<br>• <strong>O(n²)</strong> : quadratique (boucles imbriquées)<br>• <strong>O(2ⁿ)</strong> : exponentiel (à éviter !)<br><br>L'objectif est toujours de minimiser la complexité."
  },
  {
    mots: ["dérivée", "derivee", "dériver", "calcul différentiel"],
    reponse: "📐 <strong>Les dérivées</strong><br><br>La dérivée mesure le taux de variation d'une fonction.<br><br>Règles de base :<br>• (xⁿ)' = n·xⁿ⁻¹<br>• (sin x)' = cos x<br>• (cos x)' = −sin x<br>• (eˣ)' = eˣ<br>• (ln x)' = 1/x<br><br>Exemple : f(x) = 3x² → f'(x) = 6x<br><br>Tu veux un exercice pratique ?"
  },
  {
    mots: ["exercice", "entraînement", "pratiquer", "quiz"],
    reponse: "🎯 <strong>Exercice de pratique</strong><br><br>Voici un exercice de mathématiques :<br><br>Calculez la dérivée de : <strong>f(x) = 2x³ - 5x² + 3x - 7</strong><br><br>Indice : utilisez la règle (xⁿ)' = n·xⁿ⁻¹ pour chaque terme.<br><br>Réponse : f'(x) = 6x² - 10x + 3<br><br>Veux-tu un autre exercice, ou sur une autre matière ?"
  },
  {
    mots: ["conseil", "révision", "mémoriser", "mémoire", "organiser", "méthode"],
    reponse: "🧠 <strong>Conseils pour mémoriser et réviser efficacement</strong><br><br>1. <strong>La répétition espacée</strong> : révisez à intervalles croissants (1j, 3j, 7j, 14j)<br>2. <strong>La technique Pomodoro</strong> : 25 min de travail, 5 min de pause<br>3. <strong>L'auto-test</strong> : se poser des questions sans regarder le cours<br>4. <strong>Les fiches de révision</strong> : résumer en quelques mots clés<br>5. <strong>Enseigner à quelqu'un</strong> : expliquer = mieux comprendre<br>6. <strong>Dormir suffisamment</strong> : le sommeil consolide la mémoire<br><br>Quelle technique veux-tu approfondir ?"
  },
  {
    mots: ["arbre", "binaire", "tree", "structure données"],
    reponse: "🌳 <strong>Les arbres binaires</strong><br><br>Un arbre binaire est une structure de données où chaque nœud a au plus 2 fils (gauche et droit).<br><br>Terminologie :<br>• <strong>Racine</strong> : nœud au sommet<br>• <strong>Feuille</strong> : nœud sans fils<br>• <strong>Hauteur</strong> : profondeur maximale<br><br>Parcours :<br>• <strong>Préfixe</strong> (racine → gauche → droite)<br>• <strong>Infixe</strong> (gauche → racine → droite)<br>• <strong>Postfixe</strong> (gauche → droite → racine)<br><br>Un arbre binaire de recherche (ABR) garde les éléments triés !"
  },
  {
    mots: ["html", "balise", "attribut", "web"],
    reponse: "💻 <strong>Les bases du HTML</strong><br><br>HTML (<em>HyperText Markup Language</em>) est le langage de structure du web.<br><br>Structure minimale :<br><code>&lt;!DOCTYPE html&gt;<br>&lt;html&gt;<br>&nbsp;&nbsp;&lt;head&gt;<br>&nbsp;&nbsp;&nbsp;&nbsp;&lt;meta charset=\"utf-8\"&gt;<br>&nbsp;&nbsp;&nbsp;&nbsp;&lt;title&gt;Ma page&lt;/title&gt;<br>&nbsp;&nbsp;&lt;/head&gt;<br>&nbsp;&nbsp;&lt;body&gt;...&lt;/body&gt;<br>&lt;/html&gt;</code><br><br>Éléments importants : <strong>h1-h6</strong> (titres), <strong>p</strong> (paragraphe), <strong>a</strong> (lien), <strong>img</strong> (image), <strong>ul/li</strong> (liste)"
  },
  {
    mots: ["css", "style", "mise en forme", "couleur"],
    reponse: "🎨 <strong>Les bases du CSS</strong><br><br>CSS (<em>Cascading Style Sheets</em>) contrôle l'apparence des pages HTML.<br><br>Syntaxe de base :<br><code>sélecteur {<br>&nbsp;&nbsp;propriété: valeur;<br>}</code><br><br>Exemples :<br>• <code>color: #00d4ff;</code> → couleur du texte<br>• <code>background-color: #111;</code> → couleur de fond<br>• <code>font-size: 1rem;</code> → taille de police<br>• <code>margin: 1rem;</code> → marge extérieure<br>• <code>padding: 1rem;</code> → marge intérieure"
  },
  {
    mots: ["bonjour", "salut", "bonsoir", "hello", "hi"],
    reponse: "👋 Bonjour ! Je suis prêt à vous aider dans vos études. Posez-moi une question sur vos matières : Informatique, Mathématiques, Physique, Chimie... ou demandez-moi des conseils d'étude !"
  }
];

/**
 * Cherche une réponse dans la base de connaissances
 * Paramètres : texte (String) - message de l'utilisateur
 * Retourne une réponse String
 */
function chercherReponse(texte) {
  /* Convertit en minuscules pour la comparaison */
  var texteLower = texte.toLowerCase();

  /* Parcourt la base de connaissances */
  for (var i = 0; i < baseChatbot.length; i++) {
    var entree = baseChatbot[i];
    /* Vérifie si un mot-clé est présent dans le texte */
    for (var j = 0; j < entree.mots.length; j++) {
      if (texteLower.indexOf(entree.mots[j]) !== -1) {
        return entree.reponse;
      }
    }
  }

  /* Réponse par défaut si aucun mot-clé trouvé */
  return "🤔 Je n'ai pas trouvé de réponse précise à votre question. Essayez de reformuler ou posez une question sur : <strong>algorithmes, complexité, dérivées, arbres binaires, HTML, CSS, méthodes de révision</strong>...";
}

/**
 * Ajoute un message de l'utilisateur dans la conversation
 * Paramètres : texte (String)
 */
function ajouterMessageUtilisateur(texte) {
  var conversation = document.getElementById("conversation");
  if (!conversation) { return; }

  var divMessage = creerElement("div", "message-user", "");
  var bulle = creerElement("div", "bulle-user", "");
  var para = creerElement("p", "", texte);

  bulle.appendChild(para);
  divMessage.appendChild(bulle);
  conversation.appendChild(divMessage);
  defilerVersLeBas(conversation);
}

/**
 * Ajoute un message du bot dans la conversation
 * Paramètres : texte (String)
 */
function ajouterMessageBot(texte) {
  var conversation = document.getElementById("conversation");
  if (!conversation) { return; }

  var divMessage = creerElement("div", "message-bot", "");
  var avatar = creerElement("div", "bot-avatar", "🤖");
  var bulle = creerElement("div", "bulle-bot", "");

  var para = document.createElement("p");
  para.innerHTML = texte;

  var heure = creerElement("small", "", obtenirHeure());

  bulle.appendChild(para);
  bulle.appendChild(heure);
  divMessage.appendChild(avatar);
  divMessage.appendChild(bulle);
  conversation.appendChild(divMessage);
  defilerVersLeBas(conversation);
}

/**
 * Affiche / cache l'indicateur "en train d'écrire"
 * Paramètres : afficher (Boolean)
 */
function afficherTyping(afficher) {
  var typing = document.getElementById("bot-typing");
  if (!typing) { return; }
  if (afficher) {
    typing.classList.add("visible");
  } else {
    typing.classList.remove("visible");
  }
}

/**
 * Traite l'envoi d'un message dans le chatbot
 */
function envoyerMessageChatbot() {
  var input = document.getElementById("input-chatbot");
  if (!input) { return; }

  var texte = input.value.trim();
  if (texte === "") { return; }

  /* Affiche le message de l'utilisateur */
  ajouterMessageUtilisateur(texte);
  input.value = "";

  /* Affiche l'indicateur de frappe */
  afficherTyping(true);

  /* Simule un délai de réponse (entre 1 et 2.5 secondes) */
  var delai = 1000 + Math.random() * 1500;

  setTimeout(function() {
    /* Cache l'indicateur */
    afficherTyping(false);
    /* Cherche et affiche la réponse */
    var reponse = chercherReponse(texte);
    ajouterMessageBot(reponse);
  }, delai);
}

/* -----------------------------------------------------------
   7. INITIALISATION AU CHARGEMENT DE LA PAGE
   ----------------------------------------------------------- */

/**
 * Fonction principale exécutée au chargement du DOM
 * Attache tous les gestionnaires d'événements
 */
window.addEventListener("load", function() {

  /* --- Navigation : lien actif --- */
  marquerLienActif();

  /* --- Défilement : animation des sections --- */
  window.addEventListener("scroll", animerAuDefilement);
  /* Déclenche une première fois pour les éléments déjà visibles */
  animerAuDefilement();

  /* --- Formulaire inscription : bouton valider --- */
  var btnInscrire = document.getElementById("btn-inscrire");
  if (btnInscrire) {
    btnInscrire.addEventListener("click", function() {
      if (validerFormulaire()) {
        /* Si valide : simule une redirection vers le dashboard */
        alert("✅ Inscription réussie ! Bienvenue sur StudySync AI.");
        window.location.href = "dashboard.html";
      }
    });
  }

  /* --- Formulaire connexion : bouton connecter --- */
  var btnConnecter = document.getElementById("btn-connecter");
  if (btnConnecter) {
    btnConnecter.addEventListener("click", function() {
      var email = document.getElementById("email-co");
      var mdp   = document.getElementById("mdp-co");

      if (!email || email.value.trim() === "") {
        alert("⚠ Veuillez entrer votre e-mail.");
        return;
      }
      if (!mdp || mdp.value === "") {
        alert("⚠ Veuillez entrer votre mot de passe.");
        return;
      }
      /* Simule une connexion réussie */
      alert("✅ Connexion réussie ! Bon retour, " + email.value.split("@")[0] + " !");
      window.location.href = "dashboard.html";
    });
  }

  /* --- Dashboard : supprimer l'erreur au focus --- */
  var tousLesInputs = document.querySelectorAll("input, select");
  for (var i = 0; i < tousLesInputs.length; i++) {
    tousLesInputs[i].addEventListener("focus", function() {
      supprimerErreur(this);
    });
  }

  /* --- Dashboard : envoi de message (bouton) --- */
  var btnEnvoyer = document.getElementById("btn-envoyer");
  if (btnEnvoyer) {
    btnEnvoyer.addEventListener("click", envoyerMessage);
  }

  /* --- Dashboard : envoi de message (touche Entrée) --- */
  var saisieMessage = document.getElementById("saisie-message");
  if (saisieMessage) {
    saisieMessage.addEventListener("keydown", function(evenement) {
      /* keyCode 13 = touche Entrée */
      if (evenement.key === "Enter" || evenement.keyCode === 13) {
        envoyerMessage();
      }
    });
  }

  /* --- Chatbot : bouton envoyer --- */
  var btnBot = document.getElementById("btn-envoyer-bot");
  if (btnBot) {
    btnBot.addEventListener("click", envoyerMessageChatbot);
  }

  /* --- Chatbot : touche Entrée --- */
  var inputBot = document.getElementById("input-chatbot");
  if (inputBot) {
    inputBot.addEventListener("keydown", function(evenement) {
      if (evenement.key === "Enter" || evenement.keyCode === 13) {
        envoyerMessageChatbot();
      }
    });
  }

  /* --- Chatbot : boutons de suggestions --- */
  var suggestions = document.querySelectorAll(".suggestion-btn");
  for (var j = 0; j < suggestions.length; j++) {
    suggestions[j].addEventListener("click", function() {
      var message = this.getAttribute("data-msg");
      var inputC = document.getElementById("input-chatbot");
      if (inputC) {
        inputC.value = message;
        envoyerMessageChatbot();
      }
    });
  }

  /* --- Chatbot : bouton effacer la conversation --- */
  var btnEffacer = document.getElementById("btn-effacer");
  if (btnEffacer) {
    btnEffacer.addEventListener("click", function() {
      var conversation = document.getElementById("conversation");
      if (conversation) {
        /* Vide la conversation */
        conversation.innerHTML = "";
        /* Remet le message de bienvenue */
        ajouterMessageBot("Conversation effacée. Je suis toujours là pour vous aider ! 😊 Que voulez-vous apprendre aujourd'hui ?");
      }
    });
  }

}); /* fin window.addEventListener load */