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
      <div
        v-if="currentSection === 'products' || currentSection === 'all'"
        class="remote-component"
      >
        <ProductsComponent v-if="isProductsLoaded" />
        <div v-else>Loading Products...</div>
        <button @click="sendMessageToProducts">Send Message to Products</button>
      </div>

      <div v-if="currentSection === 'orders' || currentSection === 'all'" class="remote-component">
        <h2>Orders</h2>
        <p>Orders component would be loaded here in a complete implementation.</p>
      </div>

      <div v-if="currentSection === 'insights' || currentSection === 'all'" class="remote-component">
        <h2>Customer Analytics</h2>
        <p>Analytics component would be loaded here in a complete implementation.</p>
      </div>

      <div v-if="currentSection === 'marketing' || currentSection === 'all'" class="remote-component">
        <h2>Marketing</h2>
        <p>Marketing component would be loaded here in a complete implementation.</p>
      </div>
    </div>
  </div>
</template>

<script>
import { defineAsyncComponent, ref, onMounted, onBeforeUnmount } from 'vue';
import axios from 'axios';

// Dynamically import the Products component from the federated module
const ProductsComponent = defineAsyncComponent(() =>
  import('products/ProductsComponent')
    .catch(err => {
      console.error('Failed to load Products component:', err);
      return { render: () => h('div', 'Error loading Products component') };
    })
);

export default {
  components: {
    ProductsComponent
  },
  setup() {
    const currentSection = ref('all');
    const showDropdown = ref(false);
    const isProductsLoaded = ref(false);

    // Check if the Products component is loaded
    onMounted(() => {
      // Try to load the Products component
      import('products/ProductsComponent')
        .then(() => {
          isProductsLoaded.value = true;
        })
        .catch(err => {
          console.error('Failed to load Products component:', err);
        });

      // Close the dropdown on any click
      document.addEventListener('click', closeDropdown);
    });

    onBeforeUnmount(() => {
      document.removeEventListener('click', closeDropdown);
    });

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
      axios.delete('/api/revoke-me-auth-cookie')
        .then(() => {
          console.warn('secret cookie dookie removed');
          location.reload();
        });
    };

    const sendMessageToProducts = () => {
      // In Module Federation, we can use a custom event system or props to communicate
      // This is a placeholder for demonstration
      console.log('Sending message to Products component');
      // You would implement a proper communication mechanism here
    };

    return {
      currentSection,
      showDropdown,
      isProductsLoaded,
      toggleDropdown,
      closeDropdown,
      changeSection,
      logout,
      sendMessageToProducts
    };
  }
};
</script>
