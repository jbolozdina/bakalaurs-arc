import axios from 'axios';

export default {
  data() {
    return {
      products: [],
    };
  },
  methods: {
    fetchData() {
      axios.get('http://localhost:3000/api/products').then((res) => {
        this.products = res.data;
      });
    },
  },
  mounted() {
    this.fetchData();
    window.renderHeader('header');
  },
};
