<template>
  <div>
    <ModalComponent
      v-model="showModal"
      :title="modalTitle"
      :message="modalMessage"
      isAlert
    />
    <transition name="slide">
      <div v-if="show" class="off-canvas">
        <div class="overlay" @click="close"></div>
        <div class="content">
          <button @click="close" class="close-btn">
            <nuxt-icon name="close" />
          </button>
          <button
            v-if="activeTab === 'address'"
            @click="toggleTab('register')"
            class="return-btn"
          >
            <nuxt-icon name="arrow-back" />
          </button>

          <div class="image-wrapper">
            <img src="~/assets/images/logo-inverted.svg" alt="Logo" />
          </div>

          <div v-if="activeTab === 'login'" class="form">
            <form @submit.prevent="handleLogin(loginEmail, loginPassword)">
              <InputComponent
                v-model="loginEmail"
                type="email"
                :required="true"
                :placeholder="'Digite Seu Email'"
                :input-full="true"
              />
              <InputComponent
                v-model="loginPassword"
                type="password"
                :required="true"
                :placeholder="'Digite sua Senha'"
                :input-full="true"
              />
              <div class="forgot-password">Esqueceu a Senha?</div>
              <Button type="submit" class="button-login" buttonFull rounded
                >Logar</Button
              >
              <Button
                type="button"
                @click="toggleTab('register')"
                class="button-register-now"
                buttonFull
                rounded
                >Criar Conta</Button
              >
            </form>
          </div>

          <div v-if="activeTab === 'address'" class="form">
            <form @submit.prevent="handleRegisterWithAddress">
              <div class="double-field">
                <InputComponent
                  v-model="address.rua"
                  type="text"
                  :required="true"
                  :placeholder="'Rua'"
                  :input-full="false"
                  label="Rua"
                />
                <InputComponent
                  v-model="address.numero"
                  type="text"
                  :required="true"
                  :placeholder="'Número'"
                  :input-full="false"
                  label="Número"
                />
              </div>
              <InputComponent
                v-model="address.bairro"
                type="text"
                :required="true"
                :placeholder="'Bairro'"
                :input-full="true"
                label="Bairro"
              />
              <InputComponent
                v-model="address.cidade"
                type="text"
                :required="true"
                :placeholder="'Cidade'"
                :input-full="true"
                label="Cidade"
              />
              <InputComponent
                v-model="address.estado"
                type="text"
                :required="true"
                :placeholder="'Estado'"
                :input-full="true"
                label="Estado"
              />
              <InputComponent
                v-model="address.cep"
                type="text"
                :required="true"
                :placeholder="'CEP'"
                :input-full="true"
                label="CEP"
              />
              <InputComponent
                v-model="address.pais"
                type="text"
                :required="true"
                :placeholder="'País'"
                :input-full="true"
                label="País"
              />
              <InputComponent
                v-model="address.titulo"
                type="text"
                :required="true"
                :placeholder="'Ex: Casa, Trabalho'"
                :input-full="true"
                label="Nome do Endereço"
              />
              <Button type="submit" class="button-login" buttonFull rounded
                >Cadastrar</Button
              >
              <Button
                type="button"
                @click="toggleTab('register')"
                class="button-login-now"
                buttonFull
                rounded
                >Já tenho uma conta!</Button
              >
            </form>
          </div>

          <div v-if="activeTab === 'register'" class="form">
            <form @submit.prevent="handleRegister">
              <div class="double-field">
                <InputComponent
                  v-model="name"
                  type="text"
                  :required="true"
                  :placeholder="'Seu nome'"
                  :input-full="false"
                  label="Nome"
                />
                <InputComponent
                  v-model="username"
                  type="text"
                  :required="true"
                  :placeholder="'Digite seu nome de usuário'"
                  :input-full="false"
                  label="Usuário"
                />
              </div>
              <InputComponent
                v-model="email"
                type="email"
                :required="true"
                :placeholder="'Seu Email'"
                :input-full="true"
                label="Email"
              />
              <div class="double-field">
                <InputComponent
                  v-model="password"
                  type="password"
                  :required="true"
                  :placeholder="'Senha'"
                  :input-full="false"
                  label="Senha"
                />
                <InputComponent
                  v-model="confirmPassword"
                  type="password"
                  :required="true"
                  :placeholder="'Confirmação de senha'"
                  :input-full="false"
                  label="Confirmação de Senha"
                />
              </div>
              <InputComponent
                v-model="phone"
                type="text"
                :required="true"
                :placeholder="'Celular'"
                :input-full="false"
                label="Celular"
              />
              <InputComponent
                v-model="addressOnCheckout"
                type="checkbox"
                label="Cadastrar Endereço no Checkout"
              />
              <Button type="submit" class="button-login" buttonFull rounded
                >Cadastrar</Button
              >
              <Button
                type="button"
                @click="toggleTab('login')"
                class="button-login-now"
                buttonFull
                rounded
                >Já tenho uma conta!</Button
              >
            </form>
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
      name: "",
      username: "",
      password: "",
      confirmPassword: "",
      email: "",
      phone: "",
      address: {
        rua: "",
        cidade: "",
        numero: "",
        estado: "",
        bairro: "",
        cep: "",
        pais: "",
        titulo: "",
      },
      addressOnCheckout: false,
      showModal: false,
      modalTitle: "",
      modalMessage: "",
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
    async handleRegister() {
      if (!this.addressOnCheckout) {
        this.toggleTab("address");
      } else {
        const userData = {
          name: this.name,
          username: this.username,
          email: this.email,
          password: this.password,
          phone: this.phone,
          user_type: "User",
        };
        const response = await this.$registerUser(userData);
        console.log(response);
        if(response.error){
          this.triggerModal(response.error, response.error)
        }
      }
    },
    triggerModal(title, message) {
      this.modalTitle = title;
      this.modalMessage = message;
      this.showModal = true;
    },
    async handleRegisterWithAddress() {
      const userData = {
        name: this.name,
        username: this.username,
        email: this.email,
        password: this.password,
        phone: this.phone,
        user_type: "User",
        address: {
          street: this.address.rua,
          neighbourhood: this.address.bairro,
          number: this.address.numero,
          city: this.address.cidade,
          state: this.address.estado,
          postal_code: this.address.cep,
          country: this.address.pais,
          title: this.address.titulo,
        },
      };
      const response = await this.$registerUser(userData);
      console.log(response, userData);
    },
    async redirect() {
      const result = await this.$validateToken();
      if (result.error) {
        this.$router.push("/");
      } else {
        this.$router.push("/minha-conta");
      }
      this.close();
    },
  },
};
</script>

<style lang="scss" scoped>
.off-canvas {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  z-index: 100000;
  align-items: center;
  justify-content: center;
}

::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: #f5f5f5;
  border-radius: 0 0 0 0;
}

::-webkit-scrollbar {
  width: 8px;
  background-color: #f5f5f5;
  border-radius: 0 0 0 0;
}

::-webkit-scrollbar-thumb {
  background-color: #949494;
  border: 1px solid #a1a1a1;
  border-radius: 0 0 0 0;
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
  max-width: 600px;
  max-height: 70vh !important;
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: space-evenly;

  .close-btn,
  .return-btn {
    position: absolute;
    top: 20px;
    right: 20px;
    color: black;
    background: transparent;
    border: none;
    cursor: pointer;
    span {
      background: #fff;
      height: 100%;
      display: block;
      width: 100%;
      padding: 10px;
      border-radius: 50%;
      box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
    }
  }

  .return-btn {
    right: unset;
    left: 20px;
  }

  form {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: center;
    gap: 20px;
  }

  .image-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 32px;
    img {
      max-width: 250px;
    }
  }

  .double-field {
    display: flex;
    gap: 20px;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    @media screen and (max-width: 767px) {
      flex-wrap: wrap;
    }
  }

  .forgot-password {
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s linear;
    &:hover {
      color: #f83a53;
    }
  }

  .button-login {
    background-color: #222;
    color: white;
    padding: 12px;
    &:hover {
      background-color: #666;
    }
  }

  .button-register-now,
  .button-login-now {
    background-color: transparent;
    border: 1px solid #222;
    padding: 12px;
    &:hover {
      background-color: #222;
      color: white;
    }
  }
}
</style>
