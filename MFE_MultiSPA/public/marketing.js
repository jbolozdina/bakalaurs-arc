import axios from 'axios';

export default {
  data() {
    return {
      marketing: { promoCodes: [], banners: [] },
    };
  },
  methods: {
    fetchData() {
      axios.get('http://localhost:3000/api/marketing').then((res) => {
        this.marketing = res.data;
      });
    },
  },
  mounted() {
    this.fetchData();
    window.renderHeader('header');
  },
};
