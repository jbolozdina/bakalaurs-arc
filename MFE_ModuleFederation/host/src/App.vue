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
import App from "./App";

export default App;
</script>
<style>
.remote-component {
  margin-top: 32px
}
</style>
