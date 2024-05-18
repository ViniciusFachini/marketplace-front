<template>
  <div class="page-wrapper">
    <div class="category-name">
      <h1 class="category-name__title">
        {{ catInfo ? catInfo.name : '' }}
      </h1>
    </div>
    <ul class="products-container">
      <ProductCard v-for="(product, index) in products" :key="index" :productInfo="product"/>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.products-container {
  grid-template-columns: repeat(4, 1fr);
  display: grid;
  gap: 20px;
  padding: 40px 12%;
  background: #e3e3e3;
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
import { useUserStore } from '@/store/user'
export default {
  props: {
    categories: Array,
  },
  data() {
    return {
      userStore: useUserStore(),
      products: [],
      catInfo: null
    }
  },
  methods: {
    goToCategory(cat, id) {
      this.userStore.setLastCategory(cat, id)
    },
    getLastCategory() {
      const last = this.userStore.user.categoryHistory[this.userStore.user.categoryHistory.length - 1]
      return last
    }
  },
  async mounted() {
    const lastCategory = await this.getLastCategory()
    this.catInfo = await lastCategory
    if(lastCategory.id) {
      const fetchItens = await this.$useFetch(`categories/${lastCategory.id}/products`)
      console.log(fetchItens)
      this.products = fetchItens
    }
  }
};
</script>
