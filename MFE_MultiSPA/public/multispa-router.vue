<script>
import multispaRouterLogic from './multispa-router.js';

import { createApp } from 'vue';

export function mountMultispaRouterApp() {
  const app = createApp(multispaRouterLogic);
  app.mount("#app");
}
</script>

<template>
  <div id="app">
    <div id="header"></div>
    <div class="content" style="display: flex; width: 100%; height: 80vh; justify-content: center; align-items: center;">
      <a class="nav-button" href="http://localhost:3001/products">
        Products
      </a>
      <a class="nav-button" href="http://localhost:3002/orders">
        Orders
      </a>
      <a class="nav-button" href="http://localhost:3003/analytics">
        Customer Analytics
      </a>
      <a class="nav-button" href="http://localhost:3004/marketing">
        Marketing
      </a>
    </div>
  </div>
</template>

<style>
</style>
