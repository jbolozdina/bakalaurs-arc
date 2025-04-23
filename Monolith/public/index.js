const app = Vue.createApp({
  data() {
    return {
      currentSection: "all",
      products: [],
      orders: [],
      insights: {},
      marketing: { promoCodes: [], banners: [] },
      showDropdown: false,
    };
  },
  methods: {
    logout() {
      const url = "/api/revoke-me-auth-cookie";
      axios.delete(url).then((res) => {
        console.warn('secret cookie removed');
        location.reload();
      });
    },
    toggleDropdown(event) {
      this.showDropdown = !this.showDropdown;
      event.stopPropagation();
    },
    closeDropdown() {
      this.showDropdown = false;
    },
    changeSection(section) {
      this.currentSection = section;
      this.fetchData();
      this.showDropdown = false;
    },
    fillAllAndReload() {
      axios.post('/api/fill-random-data')
        .then(() => {
          console.warn('data in');
        })
        .catch(err => {
          console.error('Failed to fill data:', err);
        });
      setTimeout(() => { location.reload(); }, 1000);
    },
    fetchData() {
      let url = "";
      if (this.currentSection === "all") {
        url = "/api/dashboard/all-data";
        axios.get(url).then((res) => {
          this.products = res.data.products;
          this.orders = res.data.orders;
          this.insights = res.data.insights;
          this.marketing = {
            promoCodes: res.data.promoCodes,
            banners: res.data.banners,
          }
        });
      } else if (this.currentSection === "products") {
        url = "/api/products";
        axios.get(url).then((res) => {
          this.products = res.data;
        });
      } else if (this.currentSection === "orders") {
        url = "/api/orders";
        axios.get(url).then((res) => {
          this.orders = res.data;
        });
      } else if (this.currentSection === "insights") {
        url = "/api/customer-insights";
        axios.get(url).then((res) => {
          this.insights = res.data[0] || {};
        });
      } else if (this.currentSection === "marketing") {
        url = "/api/marketing";
        axios.get(url).then((res) => {
          this.marketing = res.data;
        });
      }
    },
  },
  mounted() {
    this.fetchData();
    // Close the dropdown on any click
    document.addEventListener("click", this.closeDropdown);
  },
  beforeUnmount() {
    document.removeEventListener("click", this.closeDropdown);
  },
});
app.mount("#app");
