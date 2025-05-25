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
      insights: null,
      loading: true,
    };
  },
  methods: {
    async fetchData() {
      try {
        this.loading = true;
        const response = await axios.get(
          "http://localhost:3000/api/customer-insights"
        );
        this.insights = response.data[0];
      } catch (error) {
        console.error("Error fetching insights:", error);
      } finally {
        this.loading = false;
      }
    },
  },
  mounted() {
    this.fetchData();
  },
};
