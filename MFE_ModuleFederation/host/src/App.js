import { defineAsyncComponent } from "vue";
import axios from "axios";

const Products  = defineAsyncComponent(() =>
  import("products/Products").catch(err =>
    console.error("Failed to load Products component:", err)
  )
);
const Orders    = defineAsyncComponent(() =>
  import("orders/Orders").catch(err =>
    console.error("Failed to load Orders component:", err)
  )
);
const Analytics = defineAsyncComponent(() =>
  import("analytics/Analytics").catch(err =>
    console.error("Failed to load Analytics component:", err)
  )
);
const Marketing = defineAsyncComponent(() =>
  import("marketing/Marketing").catch(err =>
    console.error("Failed to load Marketing component:", err)
  )
);

export default {
  name: "Dashboard",
  components: { Products, Orders, Analytics, Marketing },

  data() {
    return {
      currentSection: "all",
      showDropdown: false,
      isProductsLoaded:  false,
      isOrdersLoaded:    false,
      isAnalyticsLoaded: false,
      isMarketingLoaded: false,
    };
  },

  mounted() {
    import("products/Products")
      .then(() => (this.isProductsLoaded  = true))
      .catch(err => console.error("Failed to preload Products:", err));

    import("orders/Orders")
      .then(() => (this.isOrdersLoaded    = true))
      .catch(err => console.error("Failed to preload Orders:", err));

    import("analytics/Analytics")
      .then(() => (this.isAnalyticsLoaded = true))
      .catch(err => console.error("Failed to preload Analytics:", err));

    import("marketing/Marketing")
      .then(() => (this.isMarketingLoaded = true))
      .catch(err => console.error("Failed to preload Marketing:", err));

    document.addEventListener("click", this.closeDropdown);
  },

  beforeUnmount() {
    document.removeEventListener("click", this.closeDropdown);
  },

  methods: {
    toggleDropdown(evt) {
      this.showDropdown = !this.showDropdown;
      evt.stopPropagation();
    },
    closeDropdown() {
      this.showDropdown = false;
    },
    changeSection(section) {
      this.currentSection = section;
      this.showDropdown   = false;
    },

    fillAllAndRefresh() {
      axios
        .post("/api/fill-random-data")
        .then(() => {
          setTimeout(() => {
            this.$nextTick(() => {
              this.$refs.productsRef?.fetchData();
              this.$refs.ordersRef?.fetchData();
              this.$refs.analyticsRef?.fetchData();
              this.$refs.marketingRef?.fetchData();
            });
          }, 1000);
        })
        .catch(err => console.error("Failed to fill data:", err));
    },

    logout() {
      axios.get("/api/revoke-me-auth-cookie").then(() => location.reload());
    },

    sendMessageToProducts() {
      console.log("Sending message to Products component");
    },
  },
};
