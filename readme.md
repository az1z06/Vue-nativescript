# tp3Vue
Cette application de gestion de tâches (ToDo List) est développée avec NativeScript Vue pour le front-end et Express/MySQL pour le back-end. Elle permet aux utilisateurs de s'inscrire, de se connecter et de gérer leurs tâches (ajout, modification, suppression).

## Instructions d'installation

1. Clonez le dépôt Git sur votre machine locale :
   
    git clone https://github.com/az1z06/Vue-nativescript.git
   
2. Voir le dossier Back_end_To_do_list pour l'installation de Back end


3. Installez les dépendances nécessaires :

    npm install

4. Configurez l'environnement :
    - Assurez-vous d'avoir Node.js et npm installés.
    - Installez NativeScript CLI si ce n'est pas déjà fait :

      npm install -g nativescript


## Instructions de lancement

### Lancer l'application sur un simulateur Android

1. Assurez-vous d'avoir Android Studio installé avec un émulateur configuré.
2. Lancez l'émulateur Android.
3. Dans le répertoire du projet, exécutez :

    ns run android


### Lancer l'application sur un simulateur iOS

1. Assurez-vous d'avoir Xcode installé avec un simulateur configuré.
2. Dans le répertoire du projet, exécutez :

    ns run ios


## Description des fonctionnalités

### Inscription

- Les utilisateurs peuvent s'inscrire en fournissant un nom d'utilisateur et un mot de passe.
- La requête POST est envoyée à l'API `/api/users/register`.
- En cas de succès, l'utilisateur est redirigé vers la page de connexion.

### Connexion

- Les utilisateurs peuvent se connecter en fournissant leur nom d'utilisateur et leur mot de passe.
- La requête POST est envoyée à l'API `/api/users/login`.
- En cas de succès, un token utilisateur est stocké et l'utilisateur est redirigé vers la liste des tâches.

### Récupération des informations utilisateur

- Lors de la connexion, le token utilisateur est récupéré et stocké pour les requêtes futures.
- Les utilisateurs peuvent ajouter, modifier et supprimer des tâches.
- Les tâches sont récupérées via une requête GET à l'API `/api/tasks`.

### Gestion des tâches

- Les utilisateurs peuvent ajouter de nouvelles tâches avec un titre et une description.
- Les utilisateurs peuvent modifier les tâches existantes via des prompts pour le titre et la description.
- Les utilisateurs peuvent supprimer des tâches, et la liste des tâches est mise à jour en conséquence.


## Auteurs

- Aziz Jouini (https://github.com/az1z06)
