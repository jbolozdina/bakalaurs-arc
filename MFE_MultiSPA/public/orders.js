import axios from 'axios';

export default {
  data() {
    return {
      orders: [],
    };
  },
  methods: {
    fetchData() {
      axios.get('http://localhost:3000/api/orders').then((res) => {
        this.orders = res.data;
      });
    },
  },
  mounted() {
    this.fetchData();
    window.renderHeader('header');
  },
};
