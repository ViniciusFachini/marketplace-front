<template>
    <section class="category-container">
      <ul>
        <li v-for="category in categories" :key="category.id" :class="category.children.length > 0 ? 'big' : 'small'" class="category-item">
          <span v-if="category.children.length > 0" class="category" @click="toggleCategory(category)">
            <a>
              {{ category.name }}
              <nuxt-icon :name="category.isOpen ? 'chevron-down' : 'chevron-right'" />
            </a>
          </span>
          <ul v-if="category.isOpen && category.children.length > 0" class="second-level">
            <li v-for="child in category.children" :key="child.id" class="category-item">
              <span class="category">
                <a @click="handleGoToCategory(child.name, child.id)">{{ child.name }}</a>
              </span>
            </li>
            <li class="category-item">
                <span class="category">
                    <a @click="handleGoToCategory(category.name, category.id)">Ver Tudo</a>
                </span>
            </li>
          </ul>
        </li>
      </ul>
    </section>
  </template>
  
  <style lang="scss" scoped>
  .categories > .container {
    position: relative;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: start;
  }
  .category-container {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: start;
    position: relative;
    top: 0;
    ul {
        width: 100%;
        .category-item {
            &.big {
                padding: 10px;
            }
            .category {
                a {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }
            }
        }
    }
  }
  
  .departments-title {
    color: #333;
    font-size: 18px;
    font-weight: bold;
    cursor: pointer;
  }
  
  .category-item {
    list-style: none;
  }
  
  .category-item a {
    text-decoration: none;
    color: #555;
    display: flex;
    align-items: center;
  }
  
  .category-item a:hover {
    color: #f83a53;
  }
  
  .second-level {
    list-style: none;
    margin-left: 16px;
    margin-top: 10px;
    .category-item {
        margin-bottom: 8px;
    }
  }
  
  .second-level .category-item a {
    display: block;
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
      };
    },
    methods: {
        handleGoToCategory(cat, id) {
            this.goToCategory(cat, id);
            this.$emit("toggleMenu");
        },
        goToCategory(cat, id) {
            this.userStore.setLastCategory(cat, id);
            const router = useRouter();
            router.push(`/categorias/${cat.toLowerCase().replace(" ", "-").replace("'", "")}`);
        },
      toggleCategory(category) {
        category.isOpen = !category.isOpen;
      },
    },
  };
  </script>
  