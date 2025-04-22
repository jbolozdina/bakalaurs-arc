<template>
  <div>
    <header>
      <div class="header-left">
        <h1>E-Commerce Dashboard</h1>
      </div>
      <div class="header-right" @click="toggleDropdown">
        <i class="fas fa-user user-icon"></i>
        <div class="dropdown" v-if="showDropdown">
          <a href="#settings">Settings</a>
          <a @click="logout">Log Out</a>
        </div>
      </div>
    </header>
    <div class="nav-buttons">
      <button
        class="nav-button"
        :class="{active: currentSection === 'all'}"
        @click="changeSection('all')"
      >
        All
      </button>
      <button
        class="nav-button"
        :class="{active: currentSection === 'products'}"
        @click="changeSection('products')"
      >
        Products
      </button>
      <button
        class="nav-button"
        :class="{active: currentSection === 'orders'}"
        @click="changeSection('orders')"
      >
        Orders
      </button>
      <button
        class="nav-button"
        :class="{active: currentSection === 'insights'}"
        @click="changeSection('insights')"
      >
        Customer Analytics
      </button>
      <button
        class="nav-button"
        :class="{active: currentSection === 'marketing'}"
        @click="changeSection('marketing')"
      >
        Marketing
      </button>
    </div>
    <div class="content">
      <div style="display: flex; justify-content: center">
        <button class="nav-button" @click="fillAllAndRefresh">ALL - Fill data & refresh</button>
      </div>
      <div
        v-if="currentSection === 'products' || currentSection === 'all'"
        class="remote-component"
      >
        <Products v-if="isProductsLoaded" ref="productsRef" custom-text="This message comes from the parent/host component!" />
        <div v-else><div class="fa fa-spinner fa-spin"></div> Loading Products...</div>
      </div>

      <div v-if="currentSection === 'orders' || currentSection === 'all'" class="remote-component">
        <Orders v-if="isOrdersLoaded" ref="ordersRef" custom-text="This message comes from the parent/host component!" />
        <div v-else><div class="fa fa-spinner fa-spin"></div> Loading Orders...</div>
      </div>

      <div v-if="currentSection === 'insights' || currentSection === 'all'" class="remote-component">
        <Analytics v-if="isAnalyticsLoaded" ref="analyticsRef" custom-text="This message comes from the parent/host component!" />
        <div v-else><div class="fa fa-spinner fa-spin"></div> Loading Analytics...</div>
      </div>

      <div v-if="currentSection === 'marketing' || currentSection === 'all'" class="remote-component">
        <Marketing v-if="isMarketingLoaded" ref="marketingRef" custom-text="This message comes from the parent/host component!" />
        <div v-else><div class="fa fa-spinner fa-spin"></div> Loading Marketing...</div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineAsyncComponent, ref, onMounted, onBeforeUnmount, nextTick, useTemplateRef } from "vue";
import axios from 'axios';

const Products = defineAsyncComponent(() =>
  import('products/Products')
    .catch(err => {
      console.error('Failed to load Products component:', err);
    })
);
const Orders = defineAsyncComponent(() =>
  import('orders/Orders')
    .catch(err => {
      console.error('Failed to load Orders component:', err);
    })
);
const Analytics = defineAsyncComponent(() =>
  import('analytics/Analytics')
    .catch(err => {
      console.error('Failed to load Analytics component:', err);
    })
);
const Marketing = defineAsyncComponent(() =>
  import('marketing/Marketing')
    .catch(err => {
      console.error('Failed to load Marketing component:', err);
    })
);

export default {
  components: {
    Products,
    Orders,
    Analytics,
    Marketing,
  },
  setup() {
    const currentSection = ref('all');
    const showDropdown = ref(false);

    const isProductsLoaded = ref(false);
    const isOrdersLoaded = ref(false);
    const isAnalyticsLoaded = ref(false);
    const isMarketingLoaded = ref(false);

    const productsRef = useTemplateRef('productsRef');
    const ordersRef = useTemplateRef('ordersRef');
    const analyticsRef = useTemplateRef('analyticsRef');
    const marketingRef = useTemplateRef('marketingRef');

    onMounted(() => {
      import('products/Products')
        .then(() => {
          isProductsLoaded.value = true;
        })
        .catch(err => {
          console.error('Failed to load Products component:', err);
        });

      import('orders/Orders')
        .then(() => {
          isOrdersLoaded.value = true;
        })
        .catch(err => {
          console.error('Failed to load Orders component:', err);
        });

      import('analytics/Analytics')
        .then(() => {
          isAnalyticsLoaded.value = true;
        })
        .catch(err => {
          console.error('Failed to load Analytics component:', err);
        });

      import('marketing/Marketing')
        .then(() => {
          isMarketingLoaded.value = true;
        })
        .catch(err => {
          console.error('Failed to load Marketing component:', err);
        });

      // Close the dropdown on any click
      document.addEventListener('click', closeDropdown);
    });

    onBeforeUnmount(() => {
      document.removeEventListener('click', closeDropdown);
    });

    const fillAllAndRefresh = () => {
      axios.post('/api/fill-random-data')
        .then(() => {
          console.warn('data in');
          setTimeout(async () => {
            await nextTick();
            productsRef.value?.fetchData();
            ordersRef.value?.fetchData();
            analyticsRef.value?.fetchData();
            marketingRef.value?.fetchData();
          }, 1000);
        })
        .catch(err => {
          console.error('Failed to fill data:', err);
        });
    };

    const toggleDropdown = (event) => {
      showDropdown.value = !showDropdown.value;
      event.stopPropagation();
    };

    const closeDropdown = () => {
      showDropdown.value = false;
    };

    const changeSection = (section) => {
      currentSection.value = section;
      showDropdown.value = false;
    };

    const logout = () => {
      axios.get('/api/revoke-me-auth-cookie')
        .then(() => {
          console.warn('cookie removed');
          location.reload();
        });
    };

    const sendMessageToProducts = () => {
      console.log('Sending message to Products component');
    };

    return {
      currentSection,
      showDropdown,
      isProductsLoaded,
      isOrdersLoaded,
      isAnalyticsLoaded,
      isMarketingLoaded,
      productsRef,
      ordersRef,
      analyticsRef,
      marketingRef,
      fillAllAndRefresh,
      toggleDropdown,
      closeDropdown,
      changeSection,
      logout,
      sendMessageToProducts
    };
  }
};
</script>
<style>
.remote-component {
  margin-top: 32px
}
</style>
