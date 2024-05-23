<template>
  <div class="page-wrapper">
    <div class="container">
      <div class="product-container">
        <div class="product-image">
          <Carousel
            id="gallery"
            :items-to-show="1"
            :wrap-around="true"
            snapAlign="start"
            v-model="currentSlide"
          >
            <Slide v-for="slide in productInfo.images" :key="slide.id">
              <img :src="slide.imageUrl" alt="" />
            </Slide>
            <template #addons>
              <Navigation />
            </template>
          </Carousel>

          <Carousel
            id="thumbnails"
            :items-to-show="4"
            :wrap-around="true"
            v-model="currentSlide"
            ref="carousel"
          >
            <Slide v-for="(slide, index) in productInfo.images" :key="slide.id">
              <img :src="slide.imageUrl" @click="slideTo(index)" alt="" />
            </Slide>
          </Carousel>
          <div v-if="productPremium" class="premium-stamp">
            <nuxt-icon name="premium" />
          </div>
          <div class="button-group">
            <button class="share">
              <nuxt-icon name="share" />
              Compartilhar
            </button>
            <button class="report">
              <nuxt-icon name="report" />
              Denunciar
            </button>
          </div>
        </div>
        <div class="product-info">
          <div class="product-info__name-verified-sku">
            <div v-if="productInfo.is_seller_verified" class="product-info__name-verified-sku--verified">
              <nuxt-icon name="verified"/>
              <span class="verified-text">Vendedor Verificado</span>
            </div>
            <h1
              class="product-info__name-verified-sku--name"
              v-text="productInfo.name"
            ></h1>
            <span class="product-info__name-verified-sku--sku"
              >Ref: {{ productInfo.sku }}</span
            >
            <div
              :class="productInfo.product_condition == 'Novo' ? 'new' : 'used'"
              v-text="productInfo.product_condition"
              class="product-info__name-verified-sku--product-condition"
            ></div>
          </div>
          <div class="product-info__price-container">
            <span
              class="product-info__price-container--price"
              v-text="formatPrice(productInfo.price)"
            ></span>
          </div>
          <div class="buy-now">
            <NuxtLink to="/" class="buy">Compre Agora</NuxtLink>
            ou
            <NuxtLink to="/" class="talk">Fale com o Vendedor</NuxtLink>
          </div>
          <div class="seller">
            <span class="seller__title">Sobre o vendedor: </span>
            <div class="seller-container">
              <img
                :src="
                  sellerInfo.profilePicture
                    ? sellerInfo.profilePicture
                    : 'https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png'
                "
                alt=""
              />
              <div class="seller-container__info">
                <div class="seller-container__info--name">
                  {{ sellerInfo.name }}
                </div>
                <div class="seller-container__info--location" v-if="sellerAddress">
                  <nuxt-icon name="location" />
                  {{ sellerAddress.city }} - {{ sellerAddress.state }}
                </div>
                <div class="seller-container__info--transactions">
                  <span class="announced"
                    >{{ sellerInfo.announcedProducts }} Produtos Anunciados</span
                  >
                  <span class="canceled"
                    >{{ sellerInfo.canceledSales }} Vendas Canceladas</span
                  >
                  <span class="sales"
                    >{{ sellerInfo.totalSales }} Vendas Realizadas</span
                  >
                </div>
              </div>
            </div>
          </div>
          <div class="product-description">
            <span class="product-description__title">Descrição do Produto</span>
            <div class="product-description__content">
              {{ productInfo.description }}
            </div>
          </div>
        </div>
      </div>
      <ProductDisplay
        v-for="category in relatedCategories"
        :key="category.category_id"
        :categoryId="category.category_id"
        title="Produtos Relacionados"
        :limit="5"
      />
    </div>
  </div>
</template>


<style lang="scss" scoped>
.page-wrapper {
  background: #f1f1f1;
}
.product-container {
  display: flex;
  align-items: start;
  width: 100%;
  justify-content: space-between;
  padding-block: 40px;
  gap: 20px;
  @media screen and (max-width: 991px) {
    flex-direction: column;
    .product-image {
      max-width: 100% !important;
    }
    .product-info {
      max-width: 100% !important;
    }
  }
  .product-image {
    width: 100%;
    max-width: 60%;
    display: flex;
    flex-direction: column;
    gap: 20px;
    position: relative;
    .button-group {
      display: flex;
      align-items: center;
      justify-content: start;
      gap: 20px;
      button {
        cursor: pointer;
        transition: all .2s linear;
        padding: 8px 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        line-height: 1;
        gap: 8px;
        border-radius: 40px;
        font-weight: 500;
        &.share {
          border: 1px solid #fff;
          background: white;
          color: #f83a53;
          &:hover {
            background-color: #f83a53;
            color: white;
            border-color: #f83a53;
          }
        }
        &.report {
          border: 1px solid #f83a53;
          background: #f83a53;
          color: #fff;
          &:hover {
            background-color: #fff;
            color: #f83a53;
            border-color: #fff;
          }
        }
      }
    }
    .premium-stamp {
      position: absolute;
      top: 10px;
      z-index: 999;
      left: 10px;
      background-color: #f1f1f1;
      padding: 8px;
      border-radius: 50%;
      color: #3aa8f8;
    }
    #thumbnails {
      img {
        padding-inline: 4px;
      }
    }
    img {
      width: 100%;
      aspect-ratio: 1/1;
      object-fit: cover;
      border-radius: 20px;
    }
  }
  .product-info {
    width: 100%;
    max-width: 40%;
    .buy-now {
      display: flex;
      align-items: center;
      justify-content: start;
      gap: 20px;
      a {
        width: 100%;
        height: 50px;
        text-decoration: none;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        transition: all 0.1s linear;
      }
      .buy {
        background-color: #12a826;
        color: white;
        &:hover {
          background-color: darken(#12a826, 10%);
        }
      }
      .talk {
        background-color: #f83a53;
        color: white;
        &:hover {
          background-color: #e93048;
        }
      }
    }

    .seller {
      width: 100%;
      margin-top: 20px;
      &__title {
        font-size: 18px;
        font-weight: 500;
      }
      .seller-container {
        display: flex;
        align-items: center;
        margin-top: 20px;
        justify-content: start;
        padding: 20px;
        background: white;
        gap: 16px;
        border-radius: 20px;
        img {
          max-width: 140px;
          border-radius: 50%;
        }
        &__info {
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: start;
          justify-content: center;
          &--transactions {
            display: flex;
            align-items: start;
            justify-content: center;
            flex-direction: column;
            gap: 8px;
            margin-top: 10px;
          }
          &--name {
            font-size: 18px;
            font-weight: 500;
            transition: all 0.1s linear;
            margin-bottom: 2px;
            cursor: pointer;
            &:hover {
              color: #f83a53;
            }
          }
          &--location {
            font-size: 12px;
            color: #acacac;
            span {
              width: 20px;
            }
          }
        }
      }
    }

    .product-description {
      &__title {
        font-size: 18px;
        font-weight: 500;
        margin-block: 30px 20px;
        width: 100%;
        display: block;
      }
      &__content {
        font-size: 16px;
        font-weight: 400;
        line-height: 1.5;
      }
    }

    &__name-verified-sku {
      display: flex;
      flex-direction: column;
      align-items: start;
      justify-content: center;
      gap: 16px;
      &--verified {
        font-size: 14px;
        color: #21cc35;
        display: flex;
        align-items: center;
        justify-content: start;
        gap: 8px;
        padding: 10px 20px;
        border-radius: 5px;
        background-color: white;
      }
      &--name {
        font-weight: 600;
        font-size: 32px;
        line-height: 1.2;
      }
      &--sku {
        font-size: 12px;
        color: #acacac;
      }
      &--product-condition {
        padding: 8px 16px;
        text-transform: uppercase;
        font-size: 12px;
        font-weight: bold;
        letter-spacing: 1px;
        line-height: 150%;
        color: white;
        &.new {
          background-color: #8cd995;
        }
        &.used {
          background-color: #fec171;
        }
        &.semi-new {
          background-color: #70a9ff;
        }
      }
    }
    .product-info__price-container {
      margin-block: 40px;
      &--price {
        font-size: 32px;
        font-weight: bold;
        color: #f73a52;
      }
    }
  }
}
</style>

<script>
export default {
  data() {
    return {
      productInfo: {},
      currentSlide: 0,
      sellerInfo: {},
      sellerAddress: {},
    };
  },
  methods: {
    slideTo(val) {
      this.currentSlide = val;
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
  },
  async mounted() {
    const route = useRoute();
    const fetchItem = await this.$useFetch(
      `products/slug/${route.params.slug}`
    );
    this.productInfo = await fetchItem;
    const response = await this.$useFetch(
      `products/${this.productInfo.id}/seller`
    );
    this.sellerInfo = await response;
    this.sellerAddress = await response.addresses.main;
    this.relatedCategories = await fetchItem.categories.slice(0, 1);
    this.productPremium =
      this.productInfo.categories &&
      Array.isArray(this.productInfo.categories) &&
      this.productInfo.categories.length > 0
        ? this.productInfo.categories
            .map((item) => item && item.category_id)
            .includes(13)
        : false;
  },
};
</script>