<template>
  <div>
    <h1>Products</h1>
    <Products />
  </div>
</template>

<script>
import Products from './components/Products.vue';

export default {
  components: {
    Products
  }
}
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
