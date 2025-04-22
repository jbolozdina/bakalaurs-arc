const app = Vue.createApp({
  data() {
    return {
      orders: [],
      isLoading: false,
      customText: null,
    };
  },
  methods: {
    fetchData() {
      this.isLoading = true;
      axios.get('http://localhost:3000/api/orders').then((res) => {
        this.orders = res.data;
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
