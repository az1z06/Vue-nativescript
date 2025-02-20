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
      this.$navigateTo(Register);
    },
    async login() {
      try {
        const response = await axios.post('http://10.0.2.2:3001/api/users/login', {
          username: this.username,
          password: this.password,
        });
        if (response.data) {
          console.log(response.data);
          ApplicationSettings.setString("userToken", response.data.token);
          this.$navigateTo(TaskList);
        } else {
          console.log(response);
        }
      } catch (error) {
        console.log(error);
        this.error = 'Invalid login credentials';
      }
    },
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