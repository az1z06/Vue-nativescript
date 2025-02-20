<template>
    <Page>
      <ActionBar title="Task List" class="action-bar" />
        <!-- On définit un GridLayout principal pour toute la page -->
       <GridLayout rows="auto, auto, *" class="page">  
        <!-- Rangée 0: Les TextField et les Boutons d'ajout / logout -->
        <StackLayout row="0" class="top-section">
          <TextField v-model="newTask" hint="New Task" class="text-field" />
          <TextField v-model="description" hint="Description" class="text-field" />
          <Button text="Add Task" @tap="addTask" class="button add-button" />
          <Button text="Logout" @tap="logout" class="button logout-button" />
        </StackLayout>
          <!-- Rangée 1: Label d'erreur -->
        <Label v-if="error" :text="error" class="error" row="1" />
          <!-- Rangée 2: Liste des tâches -->
        <ListView row="2" for="task in tasks" class="task-list">
          <v-template>
              <!-- Pour chaque tâche, on définit 3 rangées pour titre, description et zone de boutons -->
            <GridLayout columns="*" rows="auto, auto, auto" class="task-item">
              <!-- Titre de la tâche -->
              <Label :text="task.title" row="0" col="0" class="task-title" />
                <!-- Description de la tâche -->
              <Label :text="task.description" row="1" col="0" class="task-description" />
              <!-- Boutons Modify / Delete, côte à côte -->
              <GridLayout columns="auto, auto" rows="auto" row="2" col="0" class="task-actions" >
                <Button backgroundColor="#00ff00" color="#ffffff" text="Modify" @tap="modifyTask(task.id)" row="0" col="0" class="btn-modify" />
                <Button backgroundColor="#ff0000" color="#ffffff" text="Delete" @tap="deleteTask(task.id)" row="0" col="1" class="btn-delete" />
              </GridLayout>
            </GridLayout>
  
          </v-template>
        </ListView>
  
      </GridLayout>
    </Page>
</template>
<script>
import { ApplicationSettings } from "@nativescript/core";
import Login from './Login.vue';
import axios from 'axios';

export default {
  // Déclaration des données du composant
  data() {
    return {
      tasks: [],          // Liste des tâches récupérées depuis le serveur
      newTask: '',        // Texte de la nouvelle tâche à ajouter
      description: "",    // Description de la nouvelle tâche
      error: null,        // Message d'erreur (affiché en cas de problème)
      token: ""           // Token d'authentification récupéré depuis ApplicationSettings
    };
  },
  // Cycle de vie : à l'affichage du composant
  async mounted() {
    try {
      // Récupère le token utilisateur stocké dans ApplicationSettings
      this.token = ApplicationSettings.getString("userToken");
      // Si aucun token n'est trouvé, redirige vers la page Login
      if (!this.token) this.$navigateTo(Login);
      // Récupère la liste des tâches depuis le serveur
      this.getTasks();
    } catch (error) {
      // En cas d'erreur, affiche un message d'erreur
      this.error = 'Failed to load tasks';
    }
  },
  // Définition des méthodes du composant
  methods: {
    // Méthode pour ajouter une nouvelle tâche
    async addTask() {
      try {
        // Configuration de la requête POST pour ajouter une tâche
        let config = {
          method: 'post',
          url: 'http://10.0.2.2:3001/api/tasks',
          headers: {
            'Authorization': this.token
          },
          data: {
            title: this.newTask,
            description: this.description
          }
        };
        // Exécution de la requête
        const response = await axios.request(config);
        // Après ajout, rafraîchit la liste des tâches
        this.getTasks();
        // Réinitialise les champs de saisie
        this.newTask = '';
        this.description = '';
      } catch (error) {
        // En cas d'erreur lors de l'ajout, affiche un message d'erreur
        this.error = 'Failed to add task';
      }
    },
    // Méthode pour récupérer la liste des tâches depuis le serveur
    async getTasks() {
      let config = {
        method: 'get',
        url: 'http://10.0.2.2:3001/api/tasks',
        headers: {
          'Authorization': this.token
        },
        data: []
      };
      try {
        // Exécution de la requête GET
        const response = await axios.request(config);
        // Stocke les tâches récupérées dans la variable tasks
        this.tasks = response.data;
      } catch (error) {
        // En cas d'erreur lors de la récupération, affiche un message d'erreur
        this.error = 'Failed to load tasks';
      }
    },
    // Méthode pour supprimer une tâche
    async deleteTask(id) {
      try {
        // Affiche l'id de la tâche à supprimer pour le débogage
        console.log("Supprimer la tâche avec id:", id);
        let config = {
          method: 'delete',
          url: `http://10.0.2.2:3001/api/tasks/${id}`,
          headers: {
            'Authorization': this.token
          }
        };
        // Exécute la requête DELETE
        await axios.request(config);
        // Met à jour la liste des tâches en filtrant la tâche supprimée
        this.tasks = this.tasks.filter((task) => task.id !== id);
      } catch (error) {
        // En cas d'erreur lors de la suppression, affiche un message d'erreur
        this.error = 'Failed to delete task';
      }
    },
    // Méthode pour modifier une tâche existante
    async modifyTask(id) {
      try {
        // Premier prompt pour récupérer le nouveau titre
        const promptTitle = await prompt({
          title: "Modify Task",
          message: "Enter the new title:",
          okButtonText: "OK",
          cancelButtonText: "Cancel",
          defaultText: ""  // Default value
        });
      
        // Si l'utilisateur annule, arrête la modification
        if (!promptTitle.result) {
          console.log("Modification annulée pour le titre.");
          return;
        }
        const newTitle = promptTitle.text;

        // Deuxième prompt pour récupérer la nouvelle description
        const promptDesc = await prompt({
          title: "Modify Task",
          message: "Enter the new description:",
          okButtonText: "OK",
          cancelButtonText: "Cancel",
          defaultText: ""
        });
       
        // Si l'utilisateur annule, arrête la modification
        if (!promptDesc.result) {
          console.log("Modification annulée pour la description.");
          return;
        }
        const newDescription = promptDesc.text;

        // Vérifie que les champs ne sont pas vides
        if (!newTitle || !newDescription) {
          console.log("Champs vides.");
          return;
        }

        // Configuration de la requête PUT pour modifier la tâche
        const config = {
          method: "put",
          url: `http://10.0.2.2:3001/api/tasks/${id}`,
          headers: {
            Authorization: this.token
          },
          data: {
            title: newTitle,
            description: newDescription,
            completed: false
          }
        };

        // Exécute la requête PUT
        const response = await axios.request(config);
        console.log("Réponse du serveur:", response.data);
        // Rafraîchit la liste des tâches après modification
        this.getTasks();

      } catch (error) {
        // En cas d'erreur lors de la modification, affiche un message d'erreur
        this.error = "Échec de la mise à jour de la tâche";
        console.error(error);
      }
    },
    logout() {
      // Supprime le token stocké et redirige vers la page Login
      ApplicationSettings.remove("userToken");
      this.$navigateTo(Login);
    }
  }
};
</script>




<style scoped>
.page {
  background-color: #f5f5f5;
}

.action-bar {
  background-color: #6200ea;
  color: white;
}

.top-section {
  margin: 16;
}

.text-field {
  border-color: #6200ea;
  border-width: 1;
  border-radius: 5;
  padding: 10;
  margin-bottom: 10;
}

.button {
  border-radius: 5;
  padding: 10;
  margin-bottom: 10;
  color: #fff;
}
.add-button {
  background-color: #4CAF50; 
}
.logout-button {
  background-color: #FF5722; 
}

.error {
  color: red;
  margin: 8;
  text-align: center;
}

.task-list {
  margin: 8;
}

.task-item {
  margin-bottom: 12;
  padding: 12;
  background-color: #ffffff;
  border-radius: 5;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2); 
}

.task-title {
  background-color: #43B344;
  color: #ffffff;
  font-weight: bold;
  padding: 10;
  border-top-left-radius: 5;
  border-top-right-radius: 5;
}

.task-description {
  background-color: #777777;
  color: #ffffff;
  padding: 10;
  margin-bottom: 6;
}

.task-actions {
  margin-top: 4;
}

.btn-modify {
  margin-right: 6;
}

.btn-delete {
  margin-left: 6;
}
</style>