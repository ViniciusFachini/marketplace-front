<template>
  <li class="product-item">
    <figure v-if="productData.images" class="product-item__figure">
      <img v-for="(image, index) in productData.images.slice(0, 2)" :key="image.id" class="product-item__figure-img" :class="index == 0 ? 'first' : 'last'" :src="image.imageUrl" alt="" @mouseover="showImage(index)" />
    </figure>
    <figure v-else class="product-item__figure">
      <img class="product-item__figure-img" src="https://b1227186.smushcdn.com/1227186/wp-content/uploads/2017/09/placeholder-600x400.png?lossy=1&strip=1&webp=1" alt="" @mouseover="showImage(index)" />
    </figure>
    <figcaption class="product-item__price-condition">
      <div class="product-price">R$ {{ productData.price }}</div>
      <div :class="productData.product_condition.toLowerCase() == 'novo' ? 'new' : 'used' " v-text="productData.product_condition" class="product-condition"></div>
    </figcaption>
    <figcaption class="product-item__name">{{ productData.name }}</figcaption>
    <div class="product-item__is-verified">
      <nuxt-icon v-if="productData.is_seller_verified" name="verified" />
      <span v-if="productData.is_seller_verified" class="verified-text">Vendedor Verificado</span>
    </div>
  </li>
</template>

<style scoped lang="scss">
  .product-item {
    width: 100%;
    border-radius: 10px;
    background: #fff;

    &__is-verified {
      padding: 16px 8px;
      color: #21CC35;
      display: flex;
      align-items: center;
      justify-content: start;
      gap: 8px;
    }
    &__name {
      font-size: 16px;
      padding-inline: 8px;
      font-weight: 500;
      display: flex;
      align-items: center;
      justify-content: start;
    }
    &__price-condition{
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px;
      .product-price {
        font-size: 20px;
        font-weight: bold;
      }
      .product-condition {
        padding: 4px 4px;
        text-transform: uppercase;
        font-size: 12px;
        font-weight: bold;
        letter-spacing: 1px;
        color: white;
        &.new {
          background-color: #8cd995;
        }
        &.used {
          background-color: #FEC171;
        }
      }
    }
    &__figure {
      position: relative;
      &-img {
        width: 100%;
        aspect-ratio: 1/1;
        object-fit: cover;
        border-radius: 10px 10px 0px 0px;
        padding: 16px;
        &.last {
          opacity: 0;
          position: absolute!important;
          transition: opacity .5s ease;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          z-index: 1
        }
      }
      &:hover {
        img {
          &.first {
            opacity: 0;
            transition: all .3s linear
          }
          &.last {
            opacity: 1;
            transition: opacity .5s ease;
            z-index: 1
          }
        }
      }
    }
  }
</style>

<script>
export default {
  props: {
    productInfo: Object,
  },
  data() {
    return {
      productData: this.productInfo,
      activeIndex: null
    }
  },
  methods: {
    showImage(index) {
      this.activeIndex = index;
    },
  }
};
</script>
