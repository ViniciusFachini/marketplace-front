<template>
  <header class="header">
    <div class="first-bar">
      <div class="container grid-container">
        <div class="hamburger-menu" @click="toggleMenu">
          <nuxt-icon name="menu" />
        </div>
        <div class="logo-section">
          <NuxtLink to="/">
            <img src="~/assets/images/logo.svg" alt="Logo" />
          </NuxtLink>
        </div>
        <div class="search-section-desktop">
          <Search />
        </div>
        <div class="user-section">
          <div class="cart" @click="toggleCart">
            <nuxt-icon name="cart" />
            <div class="items-amount">{{ cartItemsCount }}</div>
          </div>
          <div class="user auth-button">
            <nuxt-icon name="user" />
            <div class="user-container">
              <NuxtLink to="/minha-conta">
                <nuxt-icon name="user" /> Minha Conta
              </NuxtLink>
              <NuxtLink v-if="authenticated" to="/meus-pedidos">
                <nuxt-icon name="orders" class="iconkk" /> <span class="text">Meus Pedidos</span>
              </NuxtLink>
              <span
                v-if="!authenticated"
                @click="toggleAuthPanel"
                class="login"
              >
                <nuxt-icon name="login" /> Login
              </span>
              <span v-else class="logout" @click="logOutUser">
                <nuxt-icon name="logout" /> Sair
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="menu-container">
        <div class="menu" :class="{ open: isMenuOpen }">
          <MenuMobile
            class="menu-mobile"
            :categories="categories"
            @toggleMenu="toggleMenu"
          />
        </div>
      </div>
      <div class="mobile-search-section">
        <Search />
      </div>
    </div>
    <HeaderCategories class="second-bar" :categories="categories" />
    <Cart
      :class="{ active: isCartOpen }"
      @cart-toggled="handleCartToggle"
      ref="cart"
    />
    <AuthPanel :show="showAuthPanel" @close="closeAuthPanel" />
  </header>
</template>
  
<script>
export default {
  data() {
    return {
      categories: [],
      isMenuOpen: false,
      isCartOpen: false,
      showAuthPanel: false,
      authenticated: false,
      cartItemsCount: 0,
    };
  },
  async mounted() {
    this.cartItemsCount = Array.from(this.$cart.getCart()).length;
    document.addEventListener("click", this.handleClickOutside);
    this.authenticated = await this.$isAuthenticated();
    const response = await this.$useFetch("categories");
    this.categories = await response;
  },
  beforeDestroy() {
    document.removeEventListener("click", this.handleClickOutside);
  },
  methods: {
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
      document.body.classList.toggle("no-overflow");
    },
    handleCartToggle(isActive) {
      this.isCartOpen = isActive;
    },
    toggleCart() {
      this.isCartOpen = !this.isCartOpen;
      document.body.classList.toggle("no-overflow", this.isCartOpen);
    },
    async logOutUser() {
      const { reset } = await useSession();
      this.$router.go("/");
      reset();
    },
    methods: {
      handleClickOutside(event) {
        const cartContent = this.$refs.cart?.$el.querySelector(".cart-content");
        const isRemoveButton = event.target.closest(".cart-item__remove");
        if (
          this.isCartOpen &&
          cartContent &&
          !cartContent.contains(event.target) &&
          !isRemoveButton
        ) {
          this.toggleCart();
          event.stopPropagation();
        }
      },
      // Other methods remain unchanged
    },
    toggleAuthPanel() {
      this.showAuthPanel = !this.showAuthPanel;
    },
    closeAuthPanel() {
      this.showAuthPanel = false;
    },
  },
};
</script>  
<style lang="scss">
.header {
  width: 100%;
  display: flex;
  flex-direction: column;

  .first-bar {
    background-color: #f83a53;
    padding: 10px 0;

    @media screen and (max-width: 768px) {
      padding: 10px 0 0 0;
    }

    .container {
      display: grid;
      grid-template-columns: 1fr 2fr 1fr;
      align-items: center;
      padding: 0 20px;

      @media screen and (max-width: 1200px) {
        grid-template-columns: 2fr 3fr 1fr;
      }
      @media screen and (max-width: 991px) {
        grid-template-columns: 3fr 3fr 1fr;
      }

      @media (max-width: 768px) {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 10px;
      }

      .hamburger-menu {
        display: none;
        color: white;
        cursor: pointer;
        span {
          width: 24px;
        }

        @media (max-width: 768px) {
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }

      .logo-section {
        display: flex;
        justify-content: flex-start;

        @media (max-width: 768px) {
          justify-content: center;
        }
      }

      .search-section-desktop {
        display: flex;
        justify-content: center;

        @media (max-width: 768px) {
          display: none;
        }
      }

      .user-section {
        display: flex;
        justify-content: flex-end;
        gap: 16px;
        color: white;

        .user {
          position: relative;
          &:hover {
            .user-container {
              visibility: visible;
              opacity: 1;
            }
          }
          &:hover {
            opacity: 1;
            visibility: visible;
          }
          .user-container {
            position: absolute;
            top: 25px;
            right: 0;
            display: flex;
            align-items: start;
            justify-content: start;
            flex-direction: column;
            color: black;
            background-color: #fff;
            width: 160px;
            visibility: hidden;
            opacity: 0;
            z-index: 99999999;
            border-radius: 5px;
            a {
              border-radius: 5px 5px 0 0;
              text-decoration: none;
              cursor: pointer;
              width: 100%;
              height: 40px;
              display: flex;
              align-items: center;
              justify-content: start;
              padding-left: 8px;
              color: #222;
              font-weight: 500;
              gap: 8px;
              .iconkk {
                width: 24px;
              }
              &:hover {
                background-color: #f1f1f1;
                color: #f83a53;
              }
            }
            .login,
            .logout {
              border-radius: 0 0 5px 5px;
              cursor: pointer;
              width: 100%;
              height: 40px;
              display: flex;
              align-items: center;
              justify-content: start;
              padding-left: 8px;
              color: #222;
              font-weight: 500;
              gap: 8px;
              &:hover {
                background-color: #f1f1f1;
                color: #f83a53;
              }
            }
          }
          @media (max-width: 768px) {
            display: none;
          }
        }

        .cart {
          cursor: pointer;
          position: relative;

          .items-amount {
            position: absolute;
            top: -12px;
            right: -10px;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: white;
            border: 2px solid #f83a53;
            color: black;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
          }
        }
      }
    }

    .menu-container {
      position: relative;
    }

    .menu {
      position: absolute;
      top: 65px;
      left: 0;
      width: 100%;
      height: 100vh;
      background-color: #fff;
      z-index: 9999;
      transition: transform 0.3s ease;
      transform: translateX(-100%);
    }

    .menu.open {
      transform: translateX(0);
    }

    .mobile-search-section {
      display: none;

      @media (max-width: 768px) {
        display: flex;
        justify-content: center;
        padding-bottom: 5px;
        margin-top: 10px;
        form {
          input {
            border-radius: 0 !important;
          }
        }
      }
    }
  }

  .second-bar {
    background-color: white;
    padding: 10px 20px;
    box-shadow: 0px 0px 16px -7px rgba(0, 0, 0, 0.75);

    @media (max-width: 768px) {
      display: none;
    }
  }
}
</style>
  