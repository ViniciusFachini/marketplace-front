<template>
  <div class="cart">
    <div class="cart-backdrop" @click="toggleCart"></div>
    <div class="cart-content">
      <div class="cart-content__header">
        <h3 class="cart-content__title">Carrinho</h3>
        <nuxt-icon name="close" @click="toggleCart" />
      </div>
      <div class="cart-content__items"></div>
      <div class="cart-content__footer">
        <span class="total">
          <div class="total__label">Subtotal:</div>
          <b class="total__price">R$ 0</b>
        </span>
        <NuxtLink to="/">Fechar Pedido</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isActive: false,
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
    &__title {
        font-size: 32px;
        font-weight: 500;
        color: white;
    }
    &__items {
        background: #f1f1f1;
        height: 100%;
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
      > a {
        width: 95%;
        margin: 0px 10px 10px 10px;
        background: #111;
        padding: 10px;
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
  