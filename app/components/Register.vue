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
    data() {
      return {
        username: '',
        password: '',
        error: null,
        userToken: null
      };
    },
    methods: {
      async register() {
        try {
          // Faire la requête POST vers l'API "register"
          const response = await axios.post('http://10.0.2.2:3001/api/users/register', {
            username: this.username,
            password: this.password
          });
          console.log(response.data); // { message: 'Utilisateur créé avec succès' }
          this.$navigateTo(Login);
        } catch (error) {
          this.error = "Failed to register user";
          console.error(error);
        }
      },
      goToLogin() {
        this.$navigateTo(Login);
      },
      async login() {
        try {
          const response = await axios.post('http://10.0.2.2:3001/api/users/login', {
            username: this.username,
            password: this.password
          });
          if (response.data) {
            ApplicationSettings.setString("userToken", response.data.token);
            this.$navigateTo(TaskList);
          }
        } catch (error) {
          this.error = 'Invalid login credentials';
        }
      }
    },
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