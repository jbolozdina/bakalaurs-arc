<script>
import productsLogic from './products.js';

import { createApp } from 'vue';

export function mountProductsApp() {
  const app = createApp(productsLogic);
  app.mount("#app");
}
</script>

<template>
  <div id="app">
    <div id="header"></div>
    <div class="content">
      <h2>Products</h2>
      <ul>
        <li v-for="product in products" :key="product.id">
          {{ product.name }} - ${{ parseFloat(product.price).toFixed(2) }}
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
