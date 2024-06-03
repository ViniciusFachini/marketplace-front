<template>
  <div class="page-wrapper">
    <main v-if="authenticated">
      <div class="my-orders container">
        <div class="my-orders__title">Meus Pedidos</div>
        <div class="my-orders__content">
          <DataTable
            :show="5"
            :products="orders"
            :hiddenFields="['buyer_id', 'product_id', 'quantity', 'seller_id', 'transaction_id']"
            redirectTo="meus-pedidos"
          />
        </div>
      </div>
      <ModalComponent
      v-model="showModal"
        :title="modalTitle"
        :message="modalMessage"
        isAlert
      />
    </main>
    <main v-else class="not-authenticated">
      Você não está logado! Clique Aqui para
      <div class="destaque" @click="toggleAuthPanel">Logar</div>
    </main>
  </div>
</template>
  
<script>
export default {
  data() {
    return {
      authenticated: false,
      orders: [],
      session: {},
      showModal: false,
      modalTitle: "",
      modalMessage: "",
    };
  },
  methods: {
    triggerModal(title, message) {
      this.modalTitle = title;
      this.modalMessage = message;
      this.showModal = true;
    },
    handleUserAction(title, message) {
      this.triggerModal(title, message);
    },
    async getUserOrders() {
      const response = await this.$fetchInfoAuthenticated(
        `users/${this.session.user.id}/orders`
      );
      this.orders = response;
    },
    async checkUserAuth() {
      return await this.$isAuthenticated();
    },
    async setSessionDeclared() {
      const { session } = await useSession();
      this.session = await session;
    },
  },
  async mounted() {
    const response = await this.checkUserAuth();

    if (response) {
      await this.setSessionDeclared();
      console.log(this.session.user.id);
      this.authenticated = true;
      await this.getUserOrders();
    }else {
      this.$router.push('/')
    }
  },
};
</script>
  
<style lang="scss" scoped>
main {
  padding-bottom: 64px;
    .my-orders {
        &__title {
        padding-block: 40px 16px;
        padding-inline: 10px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 18px;
        font-weight: 600;
      }
    }
  min-height: 50vh;
  background-color: #f1f1f1;
  &.not-authenticated {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    .destaque {
      color: #f83a53;
      cursor: pointer;
      &:hover {
        font-weight: 500;
      }
    }
  }
}
.modal {
  ::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    background-color: #f5f5f5;
    border-radius: 0 10px 10px 0;
  }

  ::-webkit-scrollbar {
    width: 10px;
    background-color: #f5f5f5;
    border-radius: 0 10px 10px 0;
  }

  ::-webkit-scrollbar-thumb {
    background-color: #949494;
    border: 1px solid #a1a1a1;
    border-radius: 0 8px 8px 0;
  }
}
</style>
  
  