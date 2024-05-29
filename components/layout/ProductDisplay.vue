<template>
    <div class="page-wrapper">
        <div class="container">
            <h3 class="section-title">
                <mark>{{ title }}</mark>
            </h3>
            <ul class="products-container">
            <ProductCard
                v-for="(product, index) in products"
                :key="index"
                :productInfo="product"
            />
            </ul>
            <div v-if="catName" class="button-container">
                <button @click="goToCategory(catName, categoryId)" type="button">
                    <span class="button-text">Ver Mais</span>
                    <nuxt-icon name="arrow-right" />
                </button>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.page-wrapper {
    padding-top: 32px;
    width: 100%;
    background-color: #f1f1f1;
    .products-container {
        grid-template-columns: repeat(5, 1fr);
        display: grid;
        gap: 20px;
        padding-bottom: 32px;
        @media screen and (max-width: 1440px) {
            grid-template-columns: repeat(4, 1fr);
        }
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
    .button-container {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 64px;
        button {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            padding: 16px 20px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            transition: all 0.3s;
            font-weight: 600;
            font-size: 16px;
            background-color: #F83A53;
            color: white;
            &:hover {
                background-color: #e93048;
            }
        }
    }
    .section-title {
        font-size: 24px;
        font-weight: 500;
        width: 100%;
        text-align: center;
        position: relative;
        margin-bottom: 32px;
        &:before {
            content: '';
            width: 100%;
            height: 2px;
            background-color: #FEC171;
            display: block;
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            left: 0;
            right: 0;
        }
        mark {
            background-color: #f1f1f1;
            z-index: 999;
            position: relative;
            padding-inline: 16px;
        }
    }
}
</style>

<script>
import { useUserStore } from "@/store/user";
export default {
  props: {
    title: String,
    categoryId: Number,
    catName: String,
    limit: Number,
  },
  data() {
    return {
      products: [],
      userStore: useUserStore(),
    }
  },
  methods: {
    goToCategory(cat, id) {
      this.userStore.setLastCategory(cat, id);
      const router = useRouter();
      router.push(
        `/categorias/${cat.toLowerCase().replace(" ", "-").replace("'", "")}`
      );
    },
  },
  async mounted() {
      const fetchItens = await this.$fetchInfo(`categories/${this.$props.categoryId}/products`);
      if(this.$props.limit) {
          this.products = fetchItens.slice(0, this.$props.limit);
      } else {
        this.products = fetchItens
      }
  },
};
</script>
