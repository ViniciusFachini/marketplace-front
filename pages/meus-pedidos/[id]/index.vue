<template>
  <main>
    <div class="container">
      <NuxtLink to="/meus-pedidos" class="go-back">
        <nuxt-icon name="arrow-back" />
        Meus Pedidos
      </NuxtLink>
      <h2 class="order__title">Pedido: {{ transactionInfo.id }}</h2>
      <div v-if="transactionInfo.id" class="transaction-details">
        <button
          v-if="
            transactionInfo.status &&
            transactionInfo.status == 'Enviado' 
          "
          @click="confirmDeliveryModal = true"
          class="recieved"
        >
          Confirmar Recebimento
        </button>
        <button
          v-if="
            transactionInfo.status &&
            transactionInfo.status == 'Concluído' 
          "
          @click="this.$router.push(`/meus-pedidos/${transactionInfo.id}/avaliar`)"
          class="review-product"
        >
          Avaliar Vendedor
        </button>
        <p>
          <strong>Estado do Pedido: </strong>
          <span :class="statusClass(transactionInfo.status)">
            {{ transactionInfo.status }}
          </span>
        </p>
        <p>
          <strong>Valor do Pedido:</strong>
          {{ formatPrice(transactionInfo.totalAmount) }}
        </p>
        <p>
          <strong>Criado em:</strong>
          {{ new Date(transactionInfo.createdAt).toLocaleString() }}
        </p>
        <h2>Histórico do Pedido</h2>
        <ul>
          <li
            v-for="(status, index) in transactionInfo.statusHistory"
            :key="index"
          >
            <div class="status">
              <div class="status__item">
                <p>{{ status.newStatus }}</p>
                <p>{{ new Date(status.changedAt).toLocaleString() }}</p>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <h2 class="order__title">Produto Adquirido</h2>
      <NuxtLink target="_blank" :to="`/produtos/${productInfo.slug}`">
        <div v-if="productInfo.id" class="product-details">
          <div class="product-details__image">
            <img :src="productInfo.images[0].imageUrl" alt="" />
          </div>
          <div class="product-details__content">
            <span class="product-details__content--title">{{
              productInfo.name
            }}</span>
            <span class="product-details__content--description">{{
              productInfo.description
            }}</span>
            <span class="product-details__content--price">{{
              formatPrice(productInfo.price)
            }}</span>
          </div>
        </div>
      </NuxtLink>
    </div>
    <ModalComponent
      v-model="confirmDeliveryModal"
      title="Recebi meu produto"
      message="Tem certeza que deseja realizar esta operação?"
      @confirm="updateDeliveryState"
    />
  </main>
</template>
  
  <script>
import { useRoute } from "vue-router";

export default {
  data() {
    return {
      transactionInfo: {},
      productInfo: {},
      confirmDeliveryModal: false,
    };
  },
  methods: {
    async getTransaction(transaction_id) {
      const response = await this.$fetchInfoAuthenticated(
        `transactions/${transaction_id}`
      );
      this.transactionInfo = await response;
      this.transactionInfo.statusHistory =
        this.transactionInfo.statusHistory.reverse();
    },
    async getProductInfo(product_id) {
      const response = await this.$fetchInfo(`products/${product_id}`);
      this.productInfo = await response;
    },
    async updateDeliveryState(data) {
      console.log(data);
      const route = useRouter();

      const transactionId = route.currentRoute.value.params.id;

      const response = await this.$fetchInfoAuthenticated(
        `transactions/${transactionId}`,
        "PATCH",
        {
          status: "Concluído",
        }
      );

      console.log(response);

      this.route.go();
      this.confirmDeliveryModal = false;
    },
    formatPrice(price) {
      const value = parseFloat(price);
      if (isNaN(value)) {
        // Handle invalid price
        return "";
      } else {
        return new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(value);
      }
    },
    statusClass(status) {
      switch (status) {
        case "Aguardando Pagamento":
          return "status-pending";
        case "Pagamento Recebido":
          return "status-received";
        case "Processando":
          return "status-processing";
        case "Enviado":
          return "status-shipped";
        case "Entregue":
          return "status-delivered";
        case "Concluído":
          return "status-completed";
        case "Cancelado":
          return "status-cancelled";
        default:
          return "";
      }
    },
  },
  async mounted() {
    const route = useRoute();
    const transactionId = route.params.id;
    await this.getTransaction(transactionId);
    const productId = this.transactionInfo.product_id;
    await this.getProductInfo(productId);
  },
};
</script>
  
<style lang="scss" scoped>
main {
  padding-bottom: 64px;
}

.status {
  &__item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 16px;
  }
}

.go-back {
  color: #222;
  text-decoration: none;
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: start;
  margin-bottom: 20px;
  font-weight: 600;
  gap: 8px;
  line-height: 2;
  transition: all 0.2s linear;
  &:hover {
    color: #f83a53;
  }
}
.order {
  &__title {
    text-align: left;
    color: #333;
    font-size: 18px;
    margin-bottom: 20px;
  }
}
a {
  text-decoration: none;
  color: #222;
}

.product-details {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  &__image {
    img {
      width: 160px;
    }
  }
  &__content {
    display: flex;
    flex-direction: column;
    gap: 20px;
    &--title {
      font-size: 22px;
    }
    &--description {
      font-size: 16px;
    }
    &--price {
      font-size: 20px;
      font-weight: 600;
    }
  }
}
.transaction-details,
.product-details {
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 20px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  position: relative;
  .review-product {
    position: absolute;
    right: 20px;
    top: 20px;
    transition: all 0.2s linear;
    width: fit-content;
    padding: 10px 20px;
    color: white;
    background-color: hsl(113, 100%, 35%);
    border: none;
    border-radius: 5px;
    font-weight: 500;
    font-size: 18px;
    cursor: pointer;
    &:hover {
      background-color: hsl(113, 100%, 30%);
    }
  }
  .recieved {
    position: absolute;
    right: 20px;
    top: 20px;
    transition: all 0.2s linear;
    width: fit-content;
    padding: 10px 20px;
    color: white;
    background-color: #5179ff;
    border: none;
    border-radius: 5px;
    font-weight: 500;
    font-size: 18px;
    cursor: pointer;
    &:hover {
      background-color: #1e52ff;
    }
  }
}

.transaction-details p,
.product-details p {
  margin: 10px 0;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  background: #f1f1f1;
  padding: 10px;
  margin: 5px 0;
  border-radius: 5px;
}

/* Scoped deep selectors to target status classes */
::v-deep .status-pending {
  color: orange;
  font-weight: 600;
}

::v-deep .status-received {
  color: green;
  font-weight: 600;
}

::v-deep .status-processing {
  color: blue;
  font-weight: 600;
}

::v-deep .status-shipped {
  color: purple;
  font-weight: 600;
}

::v-deep .status-delivered {
  color: teal;
  font-weight: 600;
}

::v-deep .status-completed {
  color: darkgreen;
  font-weight: 600;
}

::v-deep .status-cancelled {
  color: red;
  font-weight: 600;
}
</style>
  