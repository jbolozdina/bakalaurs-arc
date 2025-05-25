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
      orders: [],
      isLoading: true,
    };
  },
  methods: {
    async fetchData() {
      try {
        this.isLoading = true;
        const response = await axios.get("http://localhost:3000/api/orders");
        this.orders = response.data;
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        this.isLoading = false;
      }
    },
  },
  mounted() {
    this.fetchData();
  },
};
