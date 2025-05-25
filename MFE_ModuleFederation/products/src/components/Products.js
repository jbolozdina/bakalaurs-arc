import axios from "axios";

export default {
  props: {
    customText: {
      type: String,
      default: "nothing passed...",
    },
  },
  data() {
    return {
      products: [],
      isLoading: true,
    };
  },
  methods: {
    async fetchData() {
      try {
        this.isLoading = true;
        const response = await axios.get("http://localhost:3000/api/products");
        this.products = response.data;
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        this.isLoading = false;
      }
    },
  },
  mounted() {
    this.fetchData();
  },
};
