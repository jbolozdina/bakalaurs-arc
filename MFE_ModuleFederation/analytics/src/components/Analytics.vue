<template>
  <div v-if="insights && !loading" class="content">
    <h2>Customer Analytics</h2>
    <h4>{{ customText }}</h4>
    <p>Total Customers: {{ insights.total_customers }}</p>
    <p>New Customers: {{ insights.new_customers }}</p>
    <p>Monthly Active: {{ insights.monthly_active }}</p>
  </div>
  <div v-else class="fa fa-spinner fa-spin">
  </div>
</template>

<script>
import Analytics from "./Analytics";

export default Analytics;
</script>

<style scoped>
.content {
  background-color: #fff;
  padding: 15px;
  border-radius: 4px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

h2 {
  margin-top: 0;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
  color: #333;
}
</style>
