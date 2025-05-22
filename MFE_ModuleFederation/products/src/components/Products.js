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
    const products = ref([]);
    const isLoading = ref(true);

    const fetchData = async () => {
      try {
        isLoading.value = true;
        const response = await axios.get("http://localhost:3000/api/products");
        products.value = response.data;
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
      isLoading,
      products,
      fetchData,
    };
  },
};
