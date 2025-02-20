<template>
    <Page class="page">
      <ActionBar title="Login" class="action-bar" />
      <StackLayout class="container">

        <TextField  v-model="username" hint="Username" keyboardType="email" class="text-field"  />
        <TextField  v-model="password" hint="Password" secure="true" class="text-field"  />
        <Button text="Login"  @tap="login" class="button" />
        <Label v-if="error" :text="error" class="error-label" />
        <Button text="Create an Account" @tap="register" class="button-outline" />
      </StackLayout>
    </Page>
</template> 
<script>
import { ApplicationSettings } from "@nativescript/core";
import axios from "axios/dist/axios";
import Register from './Register.vue';
import TaskList from './TaskList.vue';

export default {
  // Définition des données du composant
  data() {
    return {
      username: '',       // Nom d'utilisateur saisi par l'utilisateur
      password: '',       // Mot de passe saisi par l'utilisateur
      error: null,        // Message d'erreur, s'il y en a
      userToken: null     // Jeton de connexion stocké
    };
  },
  // Définition des méthodes du composant
  methods: {
    // Redirige vers la page d'inscription
    async register() {
      this.$navigateTo(Register);
    },
    // Tentative de connexion de l'utilisateur
    async login() {
      try {
        // Envoie une requête POST pour connecter l'utilisateur
        const response = await axios.post('http://10.0.2.2:3001/api/users/login', {
          username: this.username,
          password: this.password,
        });
        // Si la connexion réussit et que des données sont retournées
        if (response.data) {
          console.log(response.data);
          // Stocke le token utilisateur
          ApplicationSettings.setString("userToken", response.data.token);
          // Redirige vers la page de la liste des tâches
          this.$navigateTo(TaskList);
        } else {
          console.log(response);
        }
      } catch (error) {
        console.log(error);
        // Affiche un message d'erreur si la connexion échoue
        this.error = 'Invalid login credentials';
      }
    },
  },
  // Lors du montage du composant, vérifie si un token est déjà stocké
  mounted() {
    this.userToken = ApplicationSettings.getString("userToken");
    // Si un token existe, redirige directement vers la page des tâches
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