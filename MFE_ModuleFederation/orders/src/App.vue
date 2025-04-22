<template>
  <div>
    <h1>Orders</h1>
    <Orders />
  </div>
</template>

<script>
import Orders from "./components/Orders.vue";

export default {
  components: {
    Orders,
  },
};
</script>

<style>
body {
  margin: 0;
  font-family: Arial, sans-serif;
  background-color: #f4f4f4;
}

h1 {
  color: #333;
  text-align: center;
  margin-top: 20px;
}
</style>
