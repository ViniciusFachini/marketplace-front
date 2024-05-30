<template>
  <div class="checkout-container">
    <div class="container">
      <div v-if="currentStep === 'overview'" class="step overview">
        <!-- Step 1: Purchase Overview -->
        <h2>Produtos</h2>
        <ul class="items-list">
          <li v-for="item in cartItems" :key="item.id" class="item">
            <div class="image-name">
              <img :src="item.image" :alt="item.name" />
              <span>{{ item.name }}</span>
            </div>
            <span class="product-price">{{ formatPrice(item.price) }}</span>
          </li>
        </ul>
        <div class="total">
          <div class="label">Total:</div>
          <div class="value">{{ formatPrice(totalPrice) }}</div>
        </div>
        <div class="buttons">
          <button @click="proceedToNextStep" class="btn">Next</button>
        </div>
      </div>

      <div v-else-if="currentStep === 'address'" class="step">
        <!-- Step 2: Address Selection -->
        <h2>Step 2: Address Selection</h2>

        <section v-if="address && address.length > 0">
          <ul class="address-list">
            <li
              class="address-list__item"
              v-for="(ad, index) in address"
              :key="index"
              :class="{
                    selected: ad.isSelected,
                    'main-address': ad.isMainAddress,
                  }"
                  @click="toggleSelection(index)"
            >
              <div class="address-body__title">{{ ad.title }}</div>
              <div class="address-body__content">
                <div
                  class="address"
                >
                  {{ ad.street }}, Nº {{ ad.number }} - {{ ad.city }},
                  {{ ad.state }} - {{ ad.postalCode }}
                </div>
              </div>
            </li>
          </ul>
        </section>
        <!-- Other address fields -->
        <div class="buttons">
          <button type="submit" @click="proceedToNextStep" class="btn">
            Next
          </button>
          <button type="button" @click="goToPreviousStep" class="btn secondary">
            Previous
          </button>
        </div>
      </div>

      <div v-else-if="currentStep === 'payment'" class="step">
        <!-- Step 3: Payment Method -->
        <h2>Step 3: Payment Method</h2>
        <InputComponent
          type="radio"
          label="Escolha o Método de Pagamento"
          :options="[
            { text: 'Cartão de Débito', value: 'debito' },
            { texxt: 'Cartão de Crédito', value: 'credito' },
            { text: 'PIX', value: 'pix' },
            { text: 'Boleto', value: 'boleto' },
          ]"
          v-model="paymentMethod"
          required
        />
        <!-- Add other payment methods here -->
        <div class="buttons">
          <button @click="proceedToNextStep" class="btn">Next</button>
          <button @click="goToPreviousStep" class="btn secondary">
            Previous
          </button>
        </div>
      </div>

      <div v-else-if="currentStep === 'shipping'" class="step">
        <!-- Step 4: Shipping -->
        <h2>Step 4: Shipping</h2>
        <InputComponent
          type="radio"
          label="Escolha o Método de Entrega"
          :options="[
            { text: 'Entrega Expressa', value: 'express' },
            { text: 'Entrega Normal', value: 'normal' },
          ]"
          v-model="shippingOption"
          required
        />
        <!-- Add other shipping options here -->
        <div class="buttons">
          <button @click="proceedToNextStep" class="btn">Next</button>
          <button @click="goToPreviousStep" class="btn secondary">
            Previous
          </button>
        </div>
      </div>

      <div v-else-if="currentStep === 'confirmation'" class="step">
        <!-- Step 5: Confirmation -->
        <h2>Step 5: Confirmation</h2>
        <p><strong>Full Name:</strong> {{ address.fullName }}</p>
        <p><strong>Payment Method:</strong> {{ paymentMethod }}</p>
        <p><strong>Shipping Option:</strong> {{ shippingOption }}</p>
        <div class="buttons">
          <button @click="confirmOrder" class="btn">Confirm Order</button>
          <button @click="goToPreviousStep" class="btn secondary">
            Previous
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      authenticated: false,
      session: {},
      showModal: false,
      modalTitle: "",
      modalMessage: "",
      currentStep: "overview",
      address: {},
      paymentMethod: "",
      cartItems: [],
      shippingOption: "",
    };
  },
  computed: {
    totalPrice() {
      if (this.cartItems) {
        return this.cartItems.reduce((total, item) => total + item.price, 0);
      }
    },
  },
  methods: {
    proceedToNextStep() {
      if (this.currentStep === "overview") {
        this.currentStep = "address";
      } else if (this.currentStep === "address") {
        this.currentStep = "payment";
      } else if (this.currentStep === "payment") {
        this.currentStep = "shipping";
      } else if (this.currentStep === "shipping") {
        this.currentStep = "confirmation";
      }
    },
    toggleSelection(index) {
      this.address.forEach((ad, i) => {
        ad.isSelected = i === index ? !ad.isSelected : false;
      });
    },
    selectMainAddress() {
      const mainAddressIndex = this.address.findIndex(ad => ad.isMainAddress);
      if (mainAddressIndex !== -1) {
        this.address[mainAddressIndex].isSelected = true;
      } else {
        console.log("No main address found.");
      }
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
    goToPreviousStep() {
      if (this.currentStep === "address") {
        this.currentStep = "overview";
      } else if (this.currentStep === "payment") {
        this.currentStep = "address";
      } else if (this.currentStep === "shipping") {
        this.currentStep = "payment";
      } else if (this.currentStep === "confirmation") {
        this.currentStep = "shipping";
      }
    },
    async confirmOrder() {
      const { session } = this;

      for (const item of this.cartItems) {
        if (item.seller_id == session.user.id) {
          this.handleUserAction(
            "Este Produto é teu!",
            "Você não pode comprar seu próprio produto"
          );
          return;
        }
        const payload = {
          buyer_id: session.user.id,
          seller_id: item.seller_id,
          product_id: item.id,
          quantity: item.quantity,
          total_amount: item.price,
          transaction_type: "Compra",
          payment_method: this.paymentMethod,
          shipping_method: this.shippingOption,
          status: "Aguardando Pagamento",
        };
        try {
          const response = await this.$fetchInfoAuthenticated(
            "transactions",
            "POST",
            payload
          );
          if (response.id) {
            this.handleUserAction(
              "Sucesso!",
              "Operação realizada com sucesso!"
            );
            cart.removeItem(item.id);
          } else {
            this.handleUserAction(
              "Ocorreu um Problema",
              "Ocorreu um problema na geração do pedido! Favor entre em contato com a administração!"
            );
          }
          console.log(response);
        } catch (error) {
          console.error("Error:", error);
          this.handleUserAction(
            "Ocorreu um Problema",
            "Ocorreu um problema na geração do pedido! Favor entre em contato com a administração!"
          );
        }
      }
    },
    async triggerModal(title, message) {
      this.modalTitle = title;
      this.modalMessage = message;
      this.showModal = true;
    },
    async handleUserAction(title, message) {
      await this.triggerModal(title, message);
    },
    async checkUserAuth() {
      return await this.$isAuthenticated();
    },
    async setSessionDeclared() {
      const { session } = await useSession();
      this.session = await session;
    },
    async fetchCartItems() {
      this.cartItems = await this.$cart.getCart();
      console.log(this.cartItems);
    },
    async getUserAddresses() {
      const response = await this.$fetchInfoAuthenticated(
        `users/${this.session.user.id}/info`
      );
      this.address = await response.addresses;
      console.log(response);
    },
  },
  async mounted() {
    const response = await this.checkUserAuth();

    await this.fetchCartItems();

    if (response) {
      await this.setSessionDeclared();
      await this.getUserAddresses();
      await this.selectMainAddress();
      this.authenticated = true;
    }
  },
};
</script>

<style lang='scss' scoped>
.checkout-container {
  margin: 0 auto;
  padding: 20px;
  background: #f1f1f1;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.items-list {
  list-style-type: none;
  padding: 0;
  .item {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    background: #fff;
    margin-bottom: 10px;
    border-radius: 4px;
    cursor: pointer;
    align-items: center;
    &:hover {
      box-shadow: 0px 2px 8px 0px rgba(99, 99, 99, 0.2);
    }
    .image-name {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      gap: 20px;
    }
    .product-price {
      font-size: 20px;
      font-weight: 500;
    }
    img {
      max-width: 140px;
      aspect-ratio: 1 / 1;
      object-fit: cover;
    }
  }
}

.address-list {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  &__item {
    padding: 20px;
    border-radius: 8px;
    border: 2px solid transparent;
    transition: all .2s linear;
    cursor: pointer;
    &.selected {
      border-color: #2e97ed;
      background-color: white;
    }
  }
}

.step {
  margin-bottom: 20px;
  .total {
    font-weight: bold;
    font-size: 1.2em;
    margin-top: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .value {
      font-size: 1.5rem;
    }
  }
}

h2 {
  margin-bottom: 20px;
  font-size: 24px;
  font-weight: 600;
  color: #343a40;
}

.form {
  display: flex;
  flex-direction: column;
}

.form-label {
  margin-bottom: 10px;
}

.form-InputComponent {
  padding: 10px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  width: 100%;
}

.buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.btn {
  padding: 10px 20px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn.secondary {
  background: #6c757d;
}

.btn:hover {
  background: #0056b3;
}

.btn.secondary:hover {
  background: #5a6268;
}

.credit-card-form {
  margin-top: 20px;
}

.credit-card-form h3 {
  margin-bottom: 10px;
}
</style>
  