<template>
  <div class="cart">
    <div class="cart-backdrop" @click="toggleCart"></div>
    <div class="cart-content">
      <div class="cart-content__header">
        <h3 class="cart-content__title">Carrinho</h3>
        <nuxt-icon name="close" @click="toggleCart" />
      </div>
      <ul class="cart-content__items">
        <li v-for="item in cartItems" :key="item.id" class="cart-item">
          <figure class="cart-item__image">
            <img :src="item.image" :alt="item.name" />
          </figure>
          <div class="cart-item__info">
            <span class="cart-item__info--name" v-text="item.name"></span>
            <span
              class="cart-item__info--condition"
              :class="
                item.product_condition == 'Novo'
                  ? 'new'
                  : item.product_condition == 'Usado'
                  ? 'Usado'
                  : 'Semi Novo'
              "
              v-text="item.product_condition"
            ></span>
            <span class="cart-item__info--quantity"
              >Quantidade:
              <span class="destaque">{{ item.quantity }}</span></span
            >
            <span
              class="cart-item__info--price"
              v-text="formatPrice(item.price)"
            ></span>
            <div @click="removeFromCart(item.id)" class="cart-item__remove">
              <nuxt-icon name="trash" />
            </div>
          </div>
        </li>
      </ul>
      <div class="cart-content__footer">
        <span class="total">
          <div class="total__label">Subtotal:</div>
          <b class="total__price">{{ formatPrice(cartTotalValue) }}</b>
        </span>
        <button @click="handlePurchase" class="close-order">
          Fechar Pedido
        </button>
      </div>
    </div>
    <ModalComponent
      v-model="showModal"
      :title="modalTitle"
      :message="modalMessage"
      isAlert
    />
    <AuthPanel :show="showAuthPanel" @close="closeAuthPanel" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      isActive: false,
      cartTotalValue: 0,
      showAuthPanel: false,
      cartItems: [],
      authenticated: false,
      showModal: false,
      modalTitle: "",
      modalMessage: "",
      confirmButtonText: "",
    };
  },
  methods: {
    toggleCart() {
      if (this.isActive) {
        this.isActive = true;
      } else {
        this.isActive = false;
      }
      this.$emit("cart-toggled", this.isActive);
      document.body.classList.toggle("no-overflow", this.isActive);
    },
    formatPrice(price) {
      const value = parseFloat(price);
      if (isNaN(value)) {
      } else {
        return new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(value);
      }
    },
    toggleAuthPanel() {
      this.showAuthPanel = !this.showAuthPanel;
    },
    closeAuthPanel() {
      this.showAuthPanel = false;
    },
    triggerModal(title, message) {
      this.modalTitle = title;
      this.modalMessage = message;
      this.showModal = true;
    },
    handleUserAction(title, message) {
      this.triggerModal(title, message);
    },
    calculateCartValue() {
      this.cartTotalValue = +this.cartItems
        .map((item) => item.price)
        .reduce((acc, curr) => acc + curr, 0)
        .toFixed(2);
    },
    removeFromCart(id) {
      this.$cart.removeItem(id);
      this.updateCartItems();
      this.calculateCartValue();
    },
    updateCartItems() {
      this.cartItems = this.$cart.getCart();
    },
    updateWarningMessage() {
      this.warningMessage = this.$cart.getWarning();
    },
    async handlePurchase() {
      this.authenticated = await this.$isAuthenticated();
      if (this.authenticated) {
        this.$router.push('/checkout')
        this.toggleCart()
      //   const { session } = await useSession();
      //   const items = this.cartItems;
      //   items.forEach(async (item) => {
      //     if (item.seller_id == session.value.user.id) {
      //       this.handleUserAction(
      //         "Este Produto é teu!",
      //         "Você não pode comprar seu próprio produto"
      //       );
      //       return;
      //     }
      //     const payload = {
      //       buyer_id: session.value.user.id,
      //       seller_id: item.seller_id,
      //       product_id: item.id,
      //       quantity: item.quantity,
      //       total_amount: item.price,
      //       transaction_type: "Compra",
      //       payment_method: "Cartão de Débito",
      //       shipping_method: "Envio Expresso",
      //       status: "Aguardando Pagamento",
      //     };
      //     const response = await this.$fetchInfoAuthenticated(
      //       "transactions",
      //       "POST",
      //       payload
      //     );
      //     if (response.id) {
      //       this.handleUserAction(
      //         "Sucesso!",
      //         "Operação realizada com sucesso!"
      //       );
      //       this.removeFromCart(item.id);
      //     } else {
      //       this.handleUserAction(
      //         "Ocorreu um Problema",
      //         "Ocorreu um problema na geração do pedido! Favor entre em contato com a administração!"
      //       );
      //     }
      //     console.log(response);
      //   });
      } else {
        this.handleUserAction(
          "Logar",
          "Você precisa estar logado para comprar"
        );
        this.toggleAuthPanel();
      }
    },
  },
  created() {
    this.updateCartItems();
    this.calculateCartValue();
  },
};
</script>

  <style lang="scss" scoped>
.cart {
  &.active {
    .cart-backdrop {
      background: rgba(0, 0, 0, 0.4);
      z-index: 99998;
      opacity: 1;
      visibility: visible;
    }
    .cart-content {
      transform: translateX(0px);
      z-index: 99999;
    }
  }
  .cart-backdrop {
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0);
    position: fixed;
    top: 0;
    left: 0;
    z-index: -1;
    display: flex;
    transition: all 0.3s linear;
    opacity: 0;
    visibility: hidden;
  }
  .cart-content {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: fixed;
    right: 0;
    bottom: 0;
    max-width: 500px;
    width: 100%;
    z-index: -1;
    height: 100vh;
    background: white;
    box-shadow: 0px 0px 5px -3px;
    transition: 0.3s linear;
    transform: translateX(500px);
    ::-webkit-scrollbar-track {
      -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
      background-color: #f5f5f5;
    }

    ::-webkit-scrollbar {
      width: 8px;
      background-color: #f5f5f5;
    }

    ::-webkit-scrollbar-thumb {
      background-color: #949494;
      border: 1px solid #a1a1a1;
    }
    &__title {
      font-size: 32px;
      font-weight: 500;
      color: white;
    }
    &__items {
      background: #f1f1f1;
      overflow: auto;
      height: 100%;

      .cart-item {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: start;
        gap: 20px;
        padding: 20px;
        background: white;
        border-bottom: 1px solid #cacaca;
        &__image {
          img {
            width: 100%;
            max-width: 160px;
            aspect-ratio: 1 / 1 !important;
            object-fit: cover;
          }
        }
        &__info {
          display: flex;
          flex-direction: column;
          align-items: start;
          justify-content: center;
          gap: 8px;
          position: relative;
          width: 100%;
          max-width: calc(100% - 200px);
        }
        &__remove {
          position: absolute;
          right: 0;
          color: #f83a53;
          cursor: pointer;
        }
      }
    }
    &__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #f83a53;
      height: 105px;
      padding-inline: 32px;
      span {
        color: white;
        cursor: pointer;
      }
    }
    &__footer {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background-color: #fff;
      .total {
        width: 100%;
        padding: 20px 20px 10px 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        &__label {
          font-size: 1rem;
        }
        &__price {
          font-size: 1.1rem;
        }
      }
      .close-order {
        width: 95%;
        margin: 0px 10px 10px 10px;
        background: #111;
        padding: 16px;
        border: none;
        font-size: 14px;
        cursor: pointer;
        color: white;
        text-align: center;
        text-decoration: none;
        transition: 0.2s;
        &:hover {
          background: #4f4f4f;
        }
      }
    }
  }
}
</style>
  