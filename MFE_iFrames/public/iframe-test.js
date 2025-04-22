const app = Vue.createApp({
  data() {
    return {
      currentSection: "all",
      products: [],
      orders: [],
      insights: {},
      marketing: { promoCodes: [], banners: [] },
      showDropdown: false,
      iFrameProductsLoading: true,
      iFrameOrdersLoading: true,
      iFrameAnalyticsLoading: true,
      iFrameMarketingLoading: true,
    };
  },
  methods: {
    sendFillRefreshDataSignalToAll() {
      const allIframes = {
        3001: document.getElementById('i-products'),
        3002: document.getElementById('i-orders'),
        3003: document.getElementById('i-analytics'),
        3004: document.getElementById('i-marketing'),
      };
      for (const [port, iFrame] of Object.entries(allIframes)) {
        iFrame.contentWindow.postMessage(
          { method: 'refreshData', customText: 'This text is received from host (clicked refresh all)!' },
          `http://localhost:${port}`
        );
      }
      const url = "/api/fill-random-data";
      axios.post(url).then((res) => {
        console.warn('data in');
      });
    },
    labdieniFrameProducts() {
      document.getElementById('i-products').contentWindow.postMessage(
        { method: 'refreshData', customText: 'This text is received from host (clicked under the iFrame)!' },
        "http://localhost:3001"
      );
    },
    labdieniFrameOrders() {
      document.getElementById('i-orders').contentWindow.postMessage(
        { method: 'refreshData', customText: 'This text is received from host (clicked under the iFrame)!' },
        "http://localhost:3002"
      );
    },
    labdieniFrameAnalytics() {
      document.getElementById('i-analytics').contentWindow.postMessage(
        { method: 'refreshData', customText: 'This text is received from host (clicked under the iFrame)!' },
        "http://localhost:3003"
      );
    },
    labdieniFrameMarketing() {
      document.getElementById('i-marketing').contentWindow.postMessage(
        { method: 'refreshData', customText: 'This text is received from host (clicked under the iFrame)!' },
        "http://localhost:3004"
      );
    },
    logout() {
      const url = "/api/revoke-me-auth-cookie";
      axios.delete(url).then((res) => {
        console.warn('secret cookie dookie removed');
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
      this.showDropdown = false;
    },
  },
  mounted() {
    document.addEventListener("click", this.closeDropdown);
  },
  beforeUnmount() {
    document.removeEventListener("click", this.closeDropdown);
  },
});
app.mount("#app");
