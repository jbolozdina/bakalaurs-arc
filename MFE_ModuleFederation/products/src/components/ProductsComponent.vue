<template>
  <div class="content">
    <h2>Products</h2>
    <ul class="product-list">
      <li v-for="product in products" :key="product.id">
        {{ product.name }} - ${{ parseFloat(product.price).toFixed(2) }}
      </li>
    </ul>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';

export default {
  setup() {
    const products = ref([]);

    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/products');
        products.value = response.data;
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    // Listen for messages from the host application
    const setupMessageListener = () => {
      window.addEventListener('message', (event) => {
        console.log('Message received in ProductsComponent:', event.data);
        // You can handle specific messages here
        if (event.data.isUserLoggedIn) {
          console.log('User is logged in:', event.data.isUserLoggedIn);
        }
      });
    };

    onMounted(() => {
      fetchData();
      setupMessageListener();
    });

    return {
      products
    };
  }
}
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
