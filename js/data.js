// ---------- projects data ----------
// title / desc / tags = ce qui s'affiche sur la carte (tower + liste mobile)
// cover = image de la carte
// detail.description = texte long affiché dans la fenêtre de détail au clic
// detail.images = images du mini-carrousel dans la fenêtre de détail
//
// NB: les images pointent vers un dossier img/... à placer à la racine du
// portfolio (à côté d'index.html), avec la même arborescence que ton ancien
// site (img/schotten_totten/, img/simulateur_iot/, etc.).
const PROJECTS = [
  {
    title: "Scène 3D Maison",
    desc: "Modélisation 3D complète d'un espace de vie et de son environnement sous Blender",
    tags: ["Blender", "3D", "Cycles"],
    cover: "img/blender_mv52/cover.jpg",
    detail: {
      description: "Ce projet réalisé dans le cadre d'un cours avait pour objectif de concevoir une scène 3D. Le travail a suivi une démarche progressive, allant des éléments structurants (mobilier, cheminée, pièces) aux plus petits détails (vaisselle, corbeille de fruits, bûches). Il m'a permis de mettre en pratique des techniques avancées sous Blender : simulations physiques, placement procédural de végétation via Geometry Nodes, système de particules Hair, sculpting et création de matériaux procéduraux complexes sous le moteur de rendu Cycles.",
      images: [
        { src: "img/blender_mv52/vue_ensemble_salle.jpg", caption: "Vue d'ensemble de la salle à manger" },
        { src: "img/blender_mv52/vue_salon.jpg", caption: "Vue du salon avec canapé" },
        { src: "img/blender_mv52/vue_tele.jpg", caption: "Vue du salon avec télévision" },
        { src: "img/blender_mv52/table_corbeille.jpg", caption: "Zoom sur le meuble et la corbeille de fruits" },
        { src: "img/blender_mv52/cheminee_feu.jpg", caption: "Focus sur la cheminée et la simulation de feu/fumée" },
        { src: "img/blender_mv52/baie_vitree.jpg", caption: "Détail de la baie vitrée et vu de l'extérieur" },
        { src: "img/blender_mv52/vue_exterieur.jpg", caption: "Environnement extérieur avec terrain et végétation (Geometry Nodes)" }
      ]
    }
  },
  {
    title: "Mario Kart - Unity",
    desc: "Jeu de course de karting 3D avec karts concurrents (IA), gestion des tours, suivi de caméra et collecte d'objets",
    tags: ["Unity", "C#"],
    cover: "img/MarioKart/cover.jpg",
    detail: {
      description: "Ce projet réalisé dans le cadre d'un module d'initiation sur l'apprentissage des fondamentaux d'Unity. À partir des bases d'un tutoriel de déplacement physique et de gestion de collisions, le concept a été étendu vers un jeu de course de style Mario Kart.",
      images: [
        { src: "img/MarioKart/unity.jpg", caption: "Vue globale de la scène et du circuit dans l'éditeur Unity" },
        { src: "img/MarioKart/game.jpg", caption: "Vue en jeu du kart, de la piste et de la collecte de pièces" },
        { src: "img/MarioKart/score.jpg", caption: "Ligne d'arrivée et affichage final des résultats / scores" }
      ]
    }
  },
  {
    title: "Projet Unity",
    desc: "Un jeu vidéo innovant combinant trois genres distincts pour une expérience ludique unique",
    tags: ["C#", "Unity"],
    cover: "img/unity/logo_unity.jpg",
    detail: {
      description: "Ce projet, intitulé \"3 in 1\", est le résultat final d'un cours sur Unity. Il s'agit d'un jeu vidéo développé avec Unity qui fusionne trois genres de jeu différents en une seule expérience cohérente. L'objectif était de démontrer la polyvalence du moteur Unity et la capacité de l'équipe à intégrer diverses mécaniques de jeu au sein d'un même projet. Les principaux défis rencontrés incluent la gestion de la transition fluide entre les différents genres, l'harmonisation des styles graphiques et la création d'une interface utilisateur intuitive. Bien que le jeu soit pleinement fonctionnel, des améliorations pourraient être apportées pour optimiser les performances et enrichir le contenu afin d'offrir une expérience encore plus immersive aux joueurs.",
      images: [
        { src: "img/unity/menu.jpg", caption: "Image du menu de jeu" },
        { src: "img/unity/apple_catcher.jpg", caption: "Image du jeu Apple Catcher" },
        { src: "img/unity/apple_catcher_end.jpg", caption: "Image de la fin du jeu Apple Catcher" },
        { src: "img/unity/brick_breaker.jpg", caption: "Image du jeu Brick Breaker" },
        { src: "img/unity/brick_breaker_end.jpg", caption: "Image de la fin du jeu Brick Breaker" },
        { src: "img/unity/mini_ufo.jpg", caption: "Image du jeu Mini UFO Attack" },
        { src: "img/unity/mini_ufo_end.jpg", caption: "Image de la fin du jeu Mini UFO Attack" }
      ]
    }
  },
  {
    title: "Application Mobile de Réalité Augmentée",
    desc: "Suite d'expériences interactives en réalité augmentée sur Android avec AR Foundation et Unity",
    tags: ["Unity", "AR", "Android"],
    cover: "img/ar_mobile_mv57/cover.jpg",
    detail: {
      description: "Développé dans le cadre d'un cours, ce projet consiste en une application mobile Android intégrant plusieurs modules de réalité augmentée basés sur AR Foundation et ARCore. L'application propose un menu principal donnant accès aux fonctionnalités de base travaillées en TP ainsi qu'à des mini-jeux interactifs en AR, dont un Zombie Shooter.",
      images: [
        { src: "img/ar_mobile_mv57/menu_principal.jpg", caption: "Menu principal de l'application" },
        { src: "img/ar_mobile_mv57/detection_plans.jpg", caption: "Détection de plan réel et placement d'objet 3D interactif" },
        { src: "img/ar_mobile_mv57/zombie_shooter_gameplay.jpg", caption: "Gameplay du Zombie Shooter AR avec apparition d'ennemis sur le sol scanné" },
      ]
    }
  },
  {
    title: "Avatar Numérique de Cycliste & Co-Simulation VR",
    desc: "Plateforme de réalité virtuelle et co-simulation de trafic routier pour l'étude comportementale des cyclistes",
    tags: ["Unity", "SUMO", "VR"],
    cover: "img/avatar_cycliste/cover.jpg",
    detail: {
      description: "Ce projet vise à créer un avatar numérique de cycliste immersif au sein d'une co-simulation de trafic urbain en Réalité Virtuelle. Il combine le simulateur de trafic SUMO pour la génération dynamique de véhicules, Unity pour le rendu VR temps réel (Meta Quest), MediaPipe pour la capture de mouvement et la reconnaissance de signaux manuels du cycliste, ainsi que Gemini (VLM) pour l'analyse automatique des situations de conduite. Mes contributions majeures ont porté sur la modélisation 3D complète d'un rond-point réel du campus de l'UTBM sous Blender à partir de données OpenStreetMap, l'intégration des matériaux PBR, l'alignement géométrique avec les coordonnées SUMO, le développement d'un pont UDP asynchrone Python/Unity pour la synchronisation des gestes réels vers l'avatar (IK), ainsi que l'implémentation d'un système d'enregistrement vidéo embarqué sur les véhicules à 30 fps.",
      images: [
        { src: "img/avatar_cycliste/cyclist.jpg", caption: "Modèle 3D du rond-point et du cycliste intégré dans Unity" },
        { src: "img/avatar_cycliste/sumo.jpg", caption: "Co-simulation temps réel Unity - SUMO avec trafic véhicule" },
        { src: "img/avatar_cycliste/detection_handsignal.jpg", caption: "Détection de gestes MediaPipe" },
        { src: "img/avatar_cycliste/handsignal_unity.png", caption: "Retargeting des gestes sur l'avatar" },
        { src: "img/avatar_cycliste/camera.jpg", caption: "Rendu des caméras embarquées sur les véhicules SUMO" },
      ]
    }
  },
  {
    title: "Noodle - Plateforme Pédagogique",
    desc: "Plateforme d'apprentissage en ligne utilisant une base NoSQL et Angular",
    tags: ["Angular", "Node.js", "MongoDB", "Express"],
    cover: "img/noodle/logo.jpg",
    detail: {
      description: "Ce projet marque la refonte d'une application pédagogique vers une architecture MongoDB, Express, Angular, Node.js. L'objectif était de transitionner d'une base relationnelle SQL vers un modèle NoSQL orienté documents pour optimiser la gestion de données semi-structurées et évolutives. L'application intègre des fonctionnalités avancées telles qu'un tableau de bord analytics (avec pipeline d'agrégation et OLAP), un système de forums de discussion, la gestion des devoirs et notations, ainsi qu'une journalisation/logging complète des actions utilisateurs. Les principaux défis ont porté sur la synchronisation bidirectionnelle complexe des relations many-to-many entre utilisateurs et cours (UEs), ainsi que l'optimisation de la gestion des fichiers et images sur le serveur.",
      images: [
        { src: "img/noodle/login.jpg", caption: "Page de connexion avec validation dynamique" },
        { src: "img/noodle/tableau.jpg", caption: "Tableau de bord étudiant récapitulant les cours" },
        { src: "img/noodle/ue.jpg", caption: "Vue détaillée d'une Unité d'Enseignement (CM, TD, TP)" },
        { src: "img/noodle/forum.jpg", caption: "Interface des forums de discussion" },
        { src: "img/noodle/aide_ue.jpg", caption: "Panneau d'aide pour les Unités d'Enseignement" },
        { src: "img/noodle/dashboard.jpg", caption: "Dashboard analytics pour les administrateurs" }
      ]
    }
  },
  {
    title: "Schotten Totten",
    desc: "Jeu de cartes et de stratégie pour deux joueurs avec l'implémentation d'une IA",
    tags: ["Python"],
    cover: "img/schotten_totten/acceuil.jpg",
    detail: {
      description: "Ce projet vise à créer une version numérique d'un jeu de cartes avec une intelligence artificielle capable de rivaliser avec un joueur humain. L'objectif était de modéliser fidèlement les règles, développer une IA stratégique avec Deep-Learning et concevoir une interface intuitive avec Pygame pour une expérience fluide. On a rencontré plusieurs défis, comme la gestion du temps et la complexité des algorithmes, mais l'IA progresse en apprenant de ses erreurs. Bien que le jeu soit fonctionnel, il reste des améliorations à apporter, notamment sur l'optimisation des performances et l'affinement des stratégies de l'IA.",
      images: [
        { src: "img/schotten_totten/menu.jpg", caption: "Image du menu de jeu" },
        { src: "img/schotten_totten/jeu.jpg", caption: "Image de l'interface de jeu" },
        { src: "img/schotten_totten/machine_etat.jpg", caption: "Graphique machine à états du jeu" },
        { src: "img/schotten_totten/action_ia.jpg", caption: "Code gérant l'action de l'IA" }
      ]
    }
  },
  {
    title: "Turing Machine",
    desc: "Un jeu de réflexion basé sur la logique",
    tags: ["Java"],
    cover: "img/turing_machine/logo.jpg",
    detail: {
      description: "Ce projet consiste à développer une version numérique du jeu \"Turing Machine\", un jeu de logique et de déduction, en l'adaptant à un contexte universitaire. L'objectif était de modéliser les règles du jeu, concevoir une interface intuitive en Java et implémenter un système de vérification logique permettant de deviner une salle de cours à partir d'indices. L'équipe a dû relever plusieurs défis, notamment la gestion de l'interface et l'intégration des différentes classes. Bien que le projet soit fonctionnel, des améliorations restent possibles sur l'optimisation du code et l'ergonomie de l'application.",
      images: [
        { src: "img/turing_machine/jeu.jpg", caption: "Image du jeu" },
        { src: "img/turing_machine/menu.jpg", caption: "Image du menu de jeu" },
        { src: "img/turing_machine/DiagrammeCasUtilisation.jpg", caption: "Diagramme cas d'utilisation du projet" },
        { src: "img/turing_machine/DiagrammeClasse.jpg", caption: "Diagramme de classe du projet" },
        { src: "img/turing_machine/DiagrammeSéquence.jpg", caption: "Diagramme de séquence du projet" }
      ]
    }
  },
  {
    title: "Solar-Panel",
    desc: "Suivi intelligent du soleil pour une production énergétique optimisée",
    tags: ["C++", "Arduino", "NodeRed"],
    cover: "img/solar_panel/logo.jpg",
    detail: {
      description: "Ce projet vise à concevoir un panneau solaire à suivi automatique capable d'optimiser la production d'énergie en s'orientant en fonction de la position du soleil. Il utilise des capteurs de luminosité (luxmètre, photorésistances) pour ajuster son inclinaison sur deux axes. L'équipe a réparti les tâches entre la conception hardware, software et serveur NodeRed. Pour la modélisation et le prototypage, Fusion360, Arduino IDE et Tinkercad ont été utilisés. Malgré des défis liés à l'impression 3D, des ajustements ont permis de respecter les contraintes de fabrication.",
      images: [
        { src: "img/solar_panel/dashboard.jpg", caption: "Image du dashboard" },
        { src: "img/solar_panel/modelise3d.jpg", caption: "Modèle 3D pour impression 3D" },
        { src: "img/solar_panel/nodered.jpg", caption: "Node-Red" },
        { src: "img/solar_panel/schema.jpg", caption: "Organigramme de décision" },
        { src: "img/solar_panel/tinkercad.jpg", caption: "Circuit Tinkercad" }
      ]
    }
  }
];
