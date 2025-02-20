<template>
    <Page class="page">
      <ActionBar title="Register" class="action-bar" />
      <StackLayout class="container">
  
        <TextField v-model="username" hint="New Username" class="text-field" />
        <TextField v-model="password" hint="New Password" secure="true" class="text-field" />
  
        <Button text="Register" @tap="register" class="button" />
  
        <Label v-if="error" :text="error" class="error-label" />
  
        <Button text="Already have an account? Login"  @tap="goToLogin" class="button-outline" /> 
      </StackLayout>
    </Page>
</template>

<script>
  import { ApplicationSettings } from "@nativescript/core";
  import axios from "axios";
  import Login from './Login.vue';
  import TaskList from './TaskList.vue';

  export default {
    // Données du composant
    data() {
      return {
        username: '',    // Nom d'utilisateur saisi
        password: '',    // Mot de passe saisi
        error: null,     // Message d'erreur (s'il y en a)
        userToken: null  // Token d'authentification stocké
      };
    },
    // Méthodes du composant
    methods: {
      // Méthode pour inscrire un nouvel utilisateur
      async register() {
        try {
          // Envoi d'une requête POST à l'API pour l'inscription
          const response = await axios.post('http://10.0.2.2:3001/api/users/register', {
            username: this.username,
            password: this.password
          });
          console.log(response.data); // Affiche la réponse (ex: { message: 'Utilisateur créé avec succès' })
          // Redirection vers la page de login après l'inscription
          this.$navigateTo(Login);
        } catch (error) {
          // En cas d'erreur lors de l'inscription, affiche un message d'erreur
          this.error = "Failed to register user";
          console.error(error);
        }
      },
      // Méthode pour naviguer vers la page de login
      goToLogin() {
        this.$navigateTo(Login);
      },
      // Méthode pour connecter un utilisateur
      async login() {
        try {
          // Envoi d'une requête POST à l'API pour la connexion
          const response = await axios.post('http://10.0.2.2:3001/api/users/login', {
            username: this.username,
            password: this.password
          });
          if (response.data) {
            // Stocke le token reçu en réponse
            ApplicationSettings.setString("userToken", response.data.token);
            // Redirige vers la page des tâches
            this.$navigateTo(TaskList);
          }
        } catch (error) {
          // En cas d'erreur lors de la connexion, affiche un message d'erreur
          this.error = 'Invalid login credentials';
        }
      }
    },
    // Lors du montage du composant, vérifie si l'utilisateur est déjà connecté
    mounted() {
      this.userToken = ApplicationSettings.getString("userToken");
      if (this.userToken) this.$navigateTo(TaskList);
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

.container {
  padding: 30;
  align-items: center;
}

.text-field {
  width: 90%;
  border-width: 1;
  border-radius: 8;
  padding: 12;
  margin-bottom: 12;
  font-size: 16;
  border-color: #6200ea;
}

.button {
  background-color: #6200ea;
  color: white;
  border-radius: 8;
  padding: 14;
  margin-top: 10;
  font-size: 16;
  font-weight: bold;
}

.button-outline {
  background-color: transparent;
  color: #6200ea;
  border-width: 2;
  border-color: #6200ea;
  border-radius: 8;
  padding: 14;
  margin-top: 10;
  font-size: 16;
  font-weight: bold;
}

.error-label {
  color: red;
  font-size: 14;
  margin-top: 10;
}
</style>