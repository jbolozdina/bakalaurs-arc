<script>
import ordersLogic from './orders.js';

import { createApp } from 'vue';

export function mountOrdersApp() {
  const app = createApp(ordersLogic);
  app.mount("#app");
}
</script>

<template>
  <div id="app">
    <div id="header"></div>
    <div class="content">
      <h2>Orders</h2>
      <ul>
        <li v-for="order in orders" :key="order.id">
          Order #{{ order.id }}: {{ order.customer }} - {{ order.status }}
        </li>
      </ul>
    </div>
  </div>
</template>

<style>
body {
    margin: 0;
    font-family: Arial, sans-serif;
    background-color: #f4f4f4;
}
.content {
    background-color: #fff;
    padding: 1px 0px 1px 0px;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>
