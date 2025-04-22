const app = Vue.createApp({
  data() {
    return {
      marketing: { promoCodes: [], banners: [] },
      isLoading: true,
      customText: null,
    };
  },
  methods: {
    fetchData() {
      this.isLoading = true;
      axios.get('http://localhost:3000/api/marketing').then((res) => {
        this.marketing = res.data;
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
