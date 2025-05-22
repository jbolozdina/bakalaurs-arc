<template>
  <div v-if="products.length && !isLoading" class="content">
    <h2>Products</h2>
    <h4>{{ customText }}</h4>
    <ul class="product-list">
      <li v-for="product in products" :key="product.id">
        {{ product.name }} - ${{ parseFloat(product.price).toFixed(2) }}
      </li>
    </ul>
  </div>
  <div v-else class="fa fa-spinner fa-spin">
  </div>
</template>

<script>
import Products from "./Products";

export default Products;
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

.product-list {
  list-style-type: none;
  padding: 0;
}

.product-list li {
  padding: 10px;
  border-bottom: 1px solid #eee;
}

.product-list li:last-child {
  border-bottom: none;
}
</style>
