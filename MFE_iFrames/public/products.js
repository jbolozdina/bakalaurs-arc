const app = Vue.createApp({
  data() {
    return {
      products: [],
      isLoading: true,
      customText: null,
    };
  },
  methods: {
    fetchData() {
      console.trace('hi');
      this.isLoading = true;
      axios.get('http://localhost:3000/api/products').then((res) => {
        this.products = res.data;
        this.isLoading = false;
      });
    },
  },
  mounted() {
    this.fetchData();
    window.addEventListener("message", (event) => {
      console.log('ziņojums saņemts, metode: ', event.data.method);
      if (event.data.method === 'refreshData') this.fetchData();
      this.customText = event.data.customText;
    });
  },
});
app.mount("#app");
