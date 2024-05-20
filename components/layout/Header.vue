<template>
    <header class="header">
      <div class="first-bar">
        <div class="container grid-container">
          <div class="hamburger-menu" @click="toggleMenu">
            <nuxt-icon name="menu" />
          </div>
          <div class="logo-section">
            <NuxtLink to="/">
              <img src="~/assets/images/logo.svg" alt="Logo">
            </NuxtLink>
          </div>
          <div class="search-section-desktop">
            <Search />
          </div>
          <div class="user-section">
            <div class="cart">
              <nuxt-icon name="cart" />
              <div class="items-amount">0</div>
            </div>
            <div class="user">
              <nuxt-icon name="user" />
            </div>
          </div>
        </div>
        <div class="menu-container">
          <div class="menu" :class="{ open: isMenuOpen }">
            <MenuMobile class="menu-mobile" :categories="categories" @toggleMenu="toggleMenu" />
          </div>
        </div>
        <div class="mobile-search-section">
          <Search />
        </div>
      </div>
      <HeaderCategories class="second-bar" :categories="categories" />
    </header>
  </template>
  
  <script>
  export default {
    data() {
      return {
        categories: [],
        isMenuOpen: false,
      };
    },
    async mounted() {
      const response = await this.$useFetch('categories');
      this.categories = await response;
    },
    methods: {
      toggleMenu() {
        this.isMenuOpen = !this.isMenuOpen;
        document.querySelector('body').classList.toggle('no-overflow')
      }
    }
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
            @media (max-width: 768px) {
            display: none;
          }
          }
  
          .cart {
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
  