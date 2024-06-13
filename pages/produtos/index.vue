<template>
  <main>
    <div class="category-name container">
      <h1 class="category-name__title">Produtos</h1>
    </div>
    <ul class="products-container container">
      <ProductCard
        v-for="(product, index) in products"
        :key="index"
        :productInfo="product"
      />
    </ul>
  </main>
</template>
  
  <style lang="scss" scoped>
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
  
  <script>
import { useUserStore } from "@/store/user";
export default {
  props: {
    categories: Array,
  },
  data() {
    return {
      userStore: useUserStore(),
      products: [],
    };
  },
  methods: {},
  async mounted() {
    const fetchItens = await this.$fetchInfo(`products`);
    this.products = fetchItens;
  },
};
</script>
  