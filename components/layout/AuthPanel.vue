<template>
  <div>
    <transition name="slide">
      <div v-if="show" class="off-canvas">
        <div class="overlay" @click="close"></div>
        <div class="content">
          <button @click="close" class="close-btn">
            <nuxt-icon name="close" />
          </button>

          <!-- Login/Register content -->
          <!-- <div class="tabs">
            <button
              :class="{ active: activeTab === 'login' }"
              @click="toggleTab('login')"
            >
              Login
            </button>
            <button
              :class="{ active: activeTab === 'register' }"
              @click="toggleTab('register')"
            >
              Register
            </button>
          </div> -->

          <div v-if="activeTab === 'login'" class="form">
            <h2>Login</h2>
            <form
              @submit.prevent="handleLogin(this.loginEmail, this.loginPassword)"
            >
              <InputComponent
                v-model="loginEmail"
                type="email"
                label="Email"
                :required="true"
                placeholder="Digite Seu Email"
                :input-full="true"
              />
              <InputComponent
                v-model="loginPassword"
                type="password"
                label="Senha"
                :required="true"
                placeholder="Digite sua Senha"
                :input-full="true"
              />
              <Button type="submit" buttonFull>Logar</Button>
            </form>
          </div>

          <div v-if="activeTab === 'register'" class="form">
            <h2>Register</h2>
            <!-- Your register form goes here -->
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
    
  <script>
export default {
  props: {
    show: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      activeTab: "login",
      loginEmail: "",
      loginPassword: "",
    };
  },
  methods: {
    close() {
      this.$emit("close");
    },
    toggleTab(tab) {
      this.activeTab = tab;
    },
    async handleLogin(email, password) {
      await this.$loginUser({ email, password });
      this.redirect();
    },
    async redirect() {
      const result = await this.$validateToken();
        if (result.error) {
          this.$router.go("/");
        } else {
          this.$router.go("/minha-conta");
        }
        this.close()
    },
  },
};
</script>
    
  <style>
.off-canvas {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.overlay {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
}

.content {
  flex: 1;
  background-color: #fff;
  padding: 30px;
  overflow-y: auto;
  z-index: 20;
  max-width: 400px;
  max-height: 400px;
  width: 100%;
  height: 100%;
  position: relative;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  border: none;
  background: none;
  font-size: 20px;
  cursor: pointer;
}

.tabs {
  display: flex;
  margin-bottom: 20px;
}

.tabs button {
  flex: 1;
  padding: 10px 15px;
  border: none;
  background-color: transparent;
  cursor: pointer;
  outline: none;
}

.tabs button.active {
  background-color: #f0f0f0;
}

.form {
  /* display: none; */
}

.form h2 {
  margin-bottom: 10px;
}

.form.active {
  display: block;
}
</style>
  