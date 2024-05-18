<template>
  <section class="categories">
    <div class="container">
      <span class="departments-title">
        <nuxt-icon name="menu" />
        Departamentos
      </span>
      <section class="category-container container">
        <ul>
          <li
            v-for="category in categories"
            :key="category.id"
            class="category-item"
          >
            <span v-if="!category.parent_category_id" class="category">
              <a @click="goToCategory(category.name, category.id)">{{ category.name }}</a>
            </span>
            <ul class="second-level">
              <li v-for="child in category.children" :key="child.id" class="category-item">
                <span class="category">
                  <a @click="goToCategory(child.name, child.id)">{{ child.name }}</a>
                </span>
              </li>
            </ul>
          </li>
        </ul>
      </section>
    </div>
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
  display: grid;
  grid-template-columns: 280px 1fr;
  align-items: flex-start;
  gap: 16px;
  justify-content: start;
  position: absolute;
  background: #fff;
  top: 40px;
  left: 0;
  width: 100%;
  transition: all 0.2s linear;
  padding-top: 16px;
  padding-left: 16px;
  transform: translateY(-20px);
  z-index: 9999;
  opacity: 0;
  height: 100%;
  min-height: 400px;
  visibility: hidden;
  &:hover {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }
  ul {
    display: flex;
    align-items: start;
    justify-content: start;
    height: 100%;
    flex-direction: column;
    position: relative;
    &::after {
      content: "";
      height: calc(100% + 16px);
      position: absolute;
      right: 0;
      top: -80;
      width: 2px;
      border-radius: 50%;
      background: #d9d9d9;
    }
    .category-item a {
      color: #1c2321;
      text-decoration: none;
      font-size: 16px;
      font-weight: 500;
      transition: all 0.2s linear;
      width: 100%;
      display: block;
      padding-block: 8px;
      cursor: pointer;
      &:hover {
        color: #f83a53;
      }
    }
    .category-item {
      width: 100%;
      display: block;
      .category {
      width: 100%;
      display: block;
      &:hover {
      ~ .second-level {
        visibility: visible;
        opacity: 1;
        transform: translate(0px);
        transition: all .2s linear;
      }
    }
    }
    }
    &.second-level {
      transition: none;
      position: absolute;
      height: 100%;
      left: 300px;
      visibility: hidden;
      opacity: 0;
      top: 0;
      transform: translate(-20px);
      width: 280px;
      &:hover {
        transform: translate(0px);
        opacity: 1;
        visibility: visible;
      }
    }
  }
}

.departments-title {
  color: #222;
  gap: 10px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s linear;
  &:hover {
    color: #f83a53;
  }
}

.departments-title:hover ~ .category-container {
  visibility: visible;
  opacity: 1;
  transform: translateY(0);
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
      userStore: useUserStore()
    }
  },
  methods: {
    goToCategory(cat, id) {
      this.userStore.setLastCategory(cat, id)
      const router = useRouter();
      router.push(`/categorias/${cat.toLowerCase().replace(' ', '-').replace("'", '')}`)
    },
  },
};
</script>