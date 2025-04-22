const app = Vue.createApp({
  data() {
    return {
      isModalShown: false,
      authFail: false,
      username: null,
      password: null,
      error: null,
    };
  },
  methods: {
    teleportMe() {
      setTimeout(() => {
        location.href = "http://localhost:3000/";
      }, 100)
    },
    attemptLogin() {
      if (!this.username || !this.password) {
        this.error = 'Bad credentials!';
        return;
      }

      const url = "http://localhost:3000/api/login";
      axios.post(url, { username: this.username, password: this.password }).then((res) => {
          console.log(res.data);
          setTimeout(() => {
            location.href = "http://localhost:3000/";
          }, 100)
        },
        (err) => { console.error(err); this.error = 'Invalid credentials!'; }
      );
    },
  }
});
app.mount("#app");
