<template>
  <div>
    <h1>Marketing</h1>
    <Marketing />
  </div>
</template>

<script>
import Marketing from "./components/Marketing.vue";

export default {
  components: {
    Marketing,
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
