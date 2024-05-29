<template>
  <main>
    <div class="category-name container">
      <h1 class="category-name__title">
        {{ query ? query : "Sempre Pesquise bem antes de comprar!" }}
      </h1>
    </div>
    <ul class="products-container container">
      <ProductCard
        v-for="(product, index) in productsFetched"
        :key="index"
        :productInfo="product"
      />
    </ul>
  </main>
</template>
  
  <script>
export default {
  data() {
    return {
      query: "",
      productsFetched: [],
    };
  },
  async mounted() {
    const route = this.$route;
    this.query = route.query.busca;
    await this.fetchProducts();
  },
  methods: {
    async fetchProducts() {
      const response = await this.$fetchInfo(`search?query=${this.query}`);
      this.productsFetched = response;
      console.log(this.productsFetched);
    },
  },
};
</script>
  
  <style lang="scss" scoped>
main {
  background-color: #f1f1f1;
}
.products-container {
  grid-template-columns: repeat(4, 1fr);
  display: grid;
  gap: 20px;
  padding-bottom: 64px;
  @media screen and (max-width: 992px) {
    grid-template-columns: repeat(3, 1fr);
  }
  @media screen and (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media screen and (max-width: 425px) {
    grid-template-columns: repeat(1, 1fr);
  }
}
.category-name {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-block: 40px 80px;
  &__title {
    font-size: 32px;
    font-weight: 600;
    line-height: 1.5;
  }
}
</style>
  