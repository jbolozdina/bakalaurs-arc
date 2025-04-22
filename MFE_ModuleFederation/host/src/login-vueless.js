const invalidUserLogic = {
  data() {
    return {
      isModalShown: false,
      username: null,
      password: null,
      error: null,
    };
  },
  methods: {
    addSecretCookie() {
      console.error('unsupported');
      return;

      const url = "http://localhost:3000/api/gimme-auth-cookie";
      axios.get(url).then((res) => {
        console.warn('secret cookie dookie acquired');
      });
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
};
