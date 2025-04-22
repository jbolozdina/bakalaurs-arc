<template>
  <div v-if="orders.length && !isLoading" class="content">
    <h2>Orders</h2>
    <h4>{{ customText }}</h4>
    <ul>
      <li v-for="order in orders" :key="order.id">
        Order #{{ order.id }}: {{ order.customer }} - {{ order.status }}
      </li>
    </ul>
  </div>
  <div v-else class="fa fa-spinner fa-spin">
  </div>
</template>

<script>
import { ref, onMounted, defineExpose } from "vue";
import axios from "axios";

export default {
  props: {
    customText: {
      type: String,
      default: "nothing passed...",
    },
  },
  setup() {
    const orders = ref([]);
    const isLoading = ref(true);

    const fetchData = async () => {
      try {
        isLoading.value = true;
        const response = await axios.get("http://localhost:3000/api/orders");
        orders.value = response.data;
        isLoading.value = false;
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    defineExpose({ fetchData });

    onMounted(() => {
      fetchData();
    });

    return {
      orders,
      fetchData,
    };
  },
};
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
