<template>
  <main>
    <div class="page-wrapper container">
      <h3 class="page-wrapper__title">Avaliar Pedido</h3>
      <div class="page-wrapper__avaliate">
        <form @submit.prevent="handleNewReview">
          <Avaliation @ratingSelected="setRating($event)" />
          <InputComponent
            v-model="reviewData.title"
            type="text"
            required
            placeholder="Titulo da Review"
            label="Título"
          />
          <InputComponent
            v-model="reviewData.comment"
            type="textarea"
            required
            placeholder="Escreva aqui sobre o vendedor..."
            label="Comentário"
          />
          <div class="button-container">
            <Button class="send" type="submit">Enviar</Button>
            <Button class="clean" type="reset">Limpar</Button>
          </div>
        </form>
        <div class="product-info"></div>
      </div>
    </div>
  </main>
</template>

<style lang="scss" scoped>
.page-wrapper {
  &__title {
    width: 100%;
    text-align: left;
    font-size: 32px;
    padding-top: 40px;
    font-weight: bold;
  }
  &__avaliate {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    margin-block: 40px;
    form {
      max-width: 30%;
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 20px;
      .button-container {
        display: flex;
        align-items: center;
        justify-content: start;
        gap: 20px;
        .send {
          background-color: #349639;
          color: white;
          &:hover {
            background-color: lighten(#00a308, 4%);
          }
        }
        .clean {
          background-color: #f83a53;
          color: white;
          &:hover {
            background-color: darken(#f83a53, 10%);
          }
        }
      }
    }
    .product-info {
      width: 10%;
    }
  }
}
</style>
  
<script>
export default {
  data() {
    return {
      reviewData: {},
      transactionInfo: [],
      productInfo: [],
      session: [],
      authenticated: false,
    };
  },
  methods: {
    async handleNewReview() {
      const newReview = {
        seller_id: this.transactionInfo.seller_id,
        title: this.reviewData.title,
        comment: this.reviewData.comment,
        rating: this.ratingSelected,
      };
      if (this.session.user.id != this.transactionInfo.seller_id) {
        await this.$fetchInfoAuthenticated(
          "reviews",
          "POST",
          newReview
        );
      }
      this.reviewData = {};
      this.ratingSelected = null
    },
    async setRating(data) {
      this.ratingSelected = data;
    },
    async getTransaction(transaction_id) {
      try {
        const response = await this.$fetchInfoAuthenticated(
          `transactions/${transaction_id}`
        );
        this.transactionInfo = response;
        if (this.transactionInfo.statusHistory) {
          this.transactionInfo.statusHistory.reverse();
        }
      } catch (error) {
        console.error("Error fetching transaction:", error);
      }
    },
    async setSessionDeclared() {
      try {
        const { session } = await useSession();
        this.session = session;
      } catch (error) {
        console.error("Error setting session:", error);
      }
    },
    async checkUserAuth() {
      try {
        const authenticated = await this.$isAuthenticated();
        let isUserAuthorized = false;
        if (authenticated) {
          const route = useRoute();
          this.authenticated = true;
          const transactionId = route.params.id;
          await this.setSessionDeclared();
          await this.getTransaction(transactionId);
          const productId = this.transactionInfo.product_id;
          await this.getProductInfo(productId);
          isUserAuthorized = true;
          if(this.session.user.id != this.transactionInfo.buyer_id) {
            isUserAuthorized = false;
          }
        }
        return isUserAuthorized;
      } catch (error) {
        console.error("Error checking user authentication:", error);
        return false;
      }
    },
    formatPrice(price) {
      try {
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
      } catch (error) {
        console.error("Error formatting price:", error);
        return "";
      }
    },
    async getProductInfo(product_id) {
      try {
        const response = await this.$fetchInfo(`products/${product_id}`);
        this.productInfo = await response;
      } catch (error) {
        console.error("Error fetching product info:", error);
      }
    },
  },
  async mounted() {
    const isAuthorized = await this.checkUserAuth();
    if (!isAuthorized) {
      this.$router.push("/");
    }
  },
};
</script>
  