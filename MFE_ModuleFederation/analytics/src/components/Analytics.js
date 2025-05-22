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
    const insights = ref(null);
    const loading = ref(true);

    const fetchData = async () => {
      try {
        loading.value = true;
        const response = await axios.get("http://localhost:3000/api/customer-insights");
        insights.value = response.data[0];
        loading.value = false;
      } catch (error) {
        console.error("Error fetching insights:", error);
      }
    };

    onMounted(() => {
      fetchData();
    });

    defineExpose({ fetchData });

    return {
      insights,
      loading,
      fetchData,
    };
  },
};
