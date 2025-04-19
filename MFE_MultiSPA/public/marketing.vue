<script>
import marketingLogic from './marketing.js';

import { createApp } from 'vue';

export function mountMarketingApp() {
  const app = createApp(marketingLogic);
  app.mount("#app");
}
</script>

<template>
  <div id="app">
    <div id="header"></div>
    <div class="content">
      <h2>Marketing</h2>
      <div v-if="marketing.promoCodes.length">
        <h3>Promo Codes</h3>
        <ul>
          <li v-for="promo in marketing.promoCodes" :key="promo.id">
            {{ promo.code }} - {{ promo.description }} ({{
              promo.discount_percentage }}% off)
          </li>
        </ul>
      </div>
      <div v-if="marketing.banners.length">
        <h3>Banners</h3>
        <ul>
          <li v-for="banner in marketing.banners" :key="banner.id">
            <strong>{{ banner.title }}</strong>: {{ banner.message }}
          </li>
        </ul>
      </div>
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
