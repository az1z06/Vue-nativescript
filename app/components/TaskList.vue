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
    data() {
      return {
        tasks: [],
        newTask: '',
        description: "",
        error: null,
        token: ""
      };
    },
    async mounted() {
      try {
        this.token = ApplicationSettings.getString("userToken");
        if (!this.token) this.$navigateTo(Login);
        this.getTasks();
      } catch (error) {
        this.error = 'Failed to load tasks';
      }
    },
    methods: {
      async addTask() {
        try {
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
          const response = await axios.request(config);
          this.getTasks();
          this.newTask = '';
          this.description = '';
        } catch (error) {
          this.error = 'Failed to add task';
        }
      },
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
          const response = await axios.request(config);
          this.tasks = response.data;
        } catch (error) {
          this.error = 'Failed to load tasks';
        }
      },
      async deleteTask(id) {
        try {
          console.log("Supprimer la tâche avec id:", id); // pour débug
          let config = {
            method: 'delete',
            url: `http://10.0.2.2:3001/api/tasks/${id}`,
            headers: {
              'Authorization': this.token
            }
          };
          await axios.request(config);
          this.tasks = this.tasks.filter((task) => task.id !== id);
        } catch (error) {
          this.error = 'Failed to delete task';
        }
      },
      async modifyTask(id) {
        try {
          // Premier prompt pour le titre
          const promptTitle = await prompt({
            title: "Modifier la tâche",
            message: "Entrez le nouveau titre :",
            okButtonText: "OK",
            cancelButtonText: "Annuler",
            defaultText: ""  // valeur par défaut
          });

          if (!promptTitle.result) {
            // L’utilisateur a cliqué sur "Annuler"
            console.log("Modification annulée pour le titre.");
            return;
          }
          const newTitle = promptTitle.text;

          // Deuxième prompt pour la description
          const promptDesc = await prompt({
            title: "Modifier la tâche",
            message: "Entrez la nouvelle description :",
            okButtonText: "OK",
            cancelButtonText: "Annuler",
            defaultText: ""
          });
          if (!promptDesc.result) {
            console.log("Modification annulée pour la description.");
            return;
          }
          const newDescription = promptDesc.text;

          // Vérif si c’est vide
          if (!newTitle || !newDescription) {
            console.log("Champs vides.");
            return;
          }

          // Construire la requête PUT
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

          // Appeler l’API
          const response = await axios.request(config);
          console.log("Réponse du serveur:", response.data);
          this.getTasks();

        } catch (error) {
          this.error = "Échec de la mise à jour de la tâche";
          console.error(error);
        }
      },
      logout() {
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