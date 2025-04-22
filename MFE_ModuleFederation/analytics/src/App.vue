<template>
  <div>
    <h1>Analytics</h1>
    <Analytics />
  </div>
</template>

<script>
import Analytics from "./components/Analytics.vue";

export default {
  components: {
    Analytics,
  },
};
</script>

<style>
body {
  margin: 0;
  font-family: Arial, sans-serif;
  background-color: #f4f4f4;
}

h1 {
  color: #333;
  text-align: center;
  margin-top: 20px;
}
</style>
