(function () {
  const { createApp, ref, onMounted, onBeforeUnmount } = Vue;

  const HeaderWidget = {
    template: `
            <header>
                <div class="header-left" style="display: flex">
                    <button v-if="!isOnRouterPage()" style="margin-right: 8px" @click="backToNav"><</button>
                    <h1>E‑Commerce Dashboard</h1>
                </div>
                <div class="header-right" @click="toggleDropdown">
                    <i class="fas fa-user user-icon"></i>
                    <div class="dropdown" v-if="showDropdown">
                        <a href="#settings">Settings</a>
                        <a @click="logout">Log Out</a>
                    </div>
                </div>
            </header>
        `,
    setup() {
      const showDropdown = ref(false);
      const routerLink = 'http://localhost:3000/multispa-router';

      function isOnRouterPage() {
        return location.href === routerLink;
      }

      function backToNav() {
        location.href = routerLink;
      }

      function toggleDropdown(event) {
        showDropdown.value = !showDropdown.value;
        event.stopPropagation();
      }

      function logout() {
        axios.get("http://localhost:3000/api/revoke-me-auth-cookie", {
          withCredentials: true
        }).then(() => {
          console.warn("auth cookie removed");
          location.reload();
        });
      }

      function closeDropdown() {
        showDropdown.value = false;
      }

      onMounted(() => {
        document.addEventListener("click", closeDropdown);
      });
      onBeforeUnmount(() => {
        document.removeEventListener("click", closeDropdown);
      });

      return {
        isOnRouterPage,
        backToNav,
        showDropdown,
        toggleDropdown,
        logout,
      };
    },
  };

  window.renderHeader = function (targetId) {
    createApp(HeaderWidget).mount(document.getElementById(targetId));
  };
})();
