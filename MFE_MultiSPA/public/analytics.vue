<script>
import analyticsLogic from './analytics.js';

import { createApp } from 'vue';

export function mountAnalyticsApp() {
  const app = createApp(analyticsLogic);
  app.mount("#app");
}
</script>

<template>
  <div id="app">
    <div id="header"></div>
    <div class="content">
      <h2>Customer Analytics</h2>
      <p>Total Customers: {{ insights.total_customers }}</p>
      <p>New Customers: {{ insights.new_customers }}</p>
      <p>Monthly Active: {{ insights.monthly_active }}</p>
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
