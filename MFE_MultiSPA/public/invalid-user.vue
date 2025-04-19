<script>
import invalidUserLogic from './invalid-user.js';

import { createApp } from 'vue';

export function mountInvalidUserApp() {
  const app = createApp(invalidUserLogic);
  app.mount("#app");
}
</script>

<template>
  <div id="app" style="width: 100%; height: 100%" class="content">
    <p>You're invalid! (No active user session)</p>
    <button @click="isModalShown = true">Log in</button>
    <button @click="addSecretCookie">Or assign yourself a secret cookie && go to dashboard</button>
    <div v-if="isModalShown" style="position: absolute; width: 50%; height: 500px; background: white; top: 128px">
      <button @click="isModalShown = false">X</button>
      <p>user</p>
      <input v-model="username" type="text">
      <p>pass</p>
      <input v-model="password" type="text">
      <button @click="attemptLogin">log in</button>
    </div>
  </div>
</template>

<style>
</style>
