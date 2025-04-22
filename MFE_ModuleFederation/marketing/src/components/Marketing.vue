<template>
  <div v-if="marketing.promoCodes?.length && marketing.banners?.length && !isLoading" class="content">
    <h2>Marketing</h2>
    <h4>{{ customText }}</h4>
    <div v-if="marketing.promoCodes?.length">
      <h3>Promo Codes</h3>
      <ul>
        <li v-for="promo in marketing.promoCodes" :key="promo.id">
          {{ promo.code }} - {{ promo.description }}
        </li>
      </ul>
    </div>
    <div v-if="marketing.banners?.length">
      <h3>Banners</h3>
      <ul>
        <li v-for="banner in marketing.banners" :key="banner.id">
          <strong>{{ banner.title }}</strong>: {{ banner.message }}
        </li>
      </ul>
    </div>
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
    const marketing = ref([]);
    const isLoading = ref(true);

    const fetchData = async () => {
      try {
        isLoading.value = true;
        const response = await axios.get("http://localhost:3000/api/marketing");
        marketing.value = response.data;
        isLoading.value = false;
      } catch (error) {
        console.error("Error fetching marketing data:", error);
      }
    };

    defineExpose({ fetchData });

    onMounted(() => {
      fetchData();
    });

    return {
      marketing,
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
