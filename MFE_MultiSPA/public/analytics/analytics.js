const analyticsLogic = {
  data() {
    return {
      insights: {},
    };
  },
  methods: {
    fetchData() {
      axios.get('http://localhost:3000/api/customer-insights').then((res) => {
        this.insights = res.data[0];
        console.log(res.data);
      });
    },
  },
  mounted() {
    this.fetchData();
    window.renderHeader('header');
  },
};
