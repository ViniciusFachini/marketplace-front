    <template>
  <header class="header">
    <div class="first-bar">
        <div class="container grid-container">
            <div class="logo-section">
                <NuxtLink to="/">
                    <img src="~/assets/images/logo.svg">
                </NuxtLink>
            </div>
            <div class="search-section">
                <Search />
            </div>
            <div class="user-section">
                <div class="cart">
                    <nuxt-icon name="cart" />
                    <div class="items-ammount">0</div>
                </div>
                <div class="user">
                    <nuxt-icon name="user" />
                </div>
            </div>
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
    }
  },
  async mounted() {
    const response = await this.$useFetch('categories')
    this.categories = await response
  }
}
</script>

<style lang="scss">

.grid-container {
    display: grid;
    height: 100%;
    grid-template-columns: 1fr 2fr 1fr;
}

.header {
    display: flex;
    flex-direction: column;
    align-content: center;
    justify-content: center;
    width: 100dvw;
    height: 140px;
    .first-bar {
        background-color: #f83a53;
        min-height: 100px;
        z-index: 10;
        .logo-section {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            width: 100%;
        }
        .user-section {
            display: flex;
            align-items: center;
            justify-content: end;
            gap: 16px;
            color: white;
            .cart {
                position: relative;
                .items-ammount {
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
    .second-bar {
        min-height: 40px;
        box-shadow: 0px 0px 16px -7px rgba(0,0,0,0.75);
    }
}
</style>