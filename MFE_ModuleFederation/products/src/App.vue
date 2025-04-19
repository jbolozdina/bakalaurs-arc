<template>
  <div>
    <h1>Products Application</h1>
    <ProductsComponent />
  </div>
</template>

<script>
import ProductsComponent from './components/ProductsComponent.vue';

export default {
  components: {
    ProductsComponent
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
