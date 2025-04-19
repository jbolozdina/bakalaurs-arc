import axios from 'axios';

export default {
  data() {
    return {
      isModalShown: false,
      username: null,
      password: null,
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
        location.href = "http://localhost:3000/multispa-router";
      }, 100)
    },
    attemptLogin() {
      const url = "http://localhost:3000/api/login";
      axios.post(url, { username: this.username, password: this.password }).then((res) => {
        console.log(res.data);
        setTimeout(() => {
          location.href = "http://localhost:3000/multispa-router";
        }, 100)
      },
      (err) => { console.error(err) }
      );
    },
  }
};
