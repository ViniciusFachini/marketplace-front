<template>
<div class="showcase-container">
  <div class="showcase-title-wrapper container" v-if="showcaseInfo.title">
    <h3 class="showcase-title">{{ showcaseInfo.title }}</h3>
  </div>
  <Carousel class="container" :items-to-show="5">
    <Slide v-for="(product, index) in showcaseItems" :key="index">
      <ProductCard :productInfo="product" />
    </Slide>
    <template #addons>
      <Navigation />
    </template>
  </Carousel>
</div>
</template>

<style lang="scss" scoped>
.showcase-title-wrapper {
  text-align: left;
  width: 100%;
  h3 {
    font-size: 24px;
    font-weight: 500;
    line-height: 150%;
  }
}
</style>

<script>
export default {
  props: {
    showcaseId: Number,
  },
  data() {
    return {
      showcaseInfo: {}, // Changed from an array to an object
      showcaseItems: [], // Renamed from showcaseItem to showcaseItems
    };
  },
  async mounted() {
    try {
      const fetchItems = await this.$useFetch(`showcases/${this.showcaseId}`);
      if (fetchItems && fetchItems.items) {
        this.showcaseInfo = fetchItems; // Assign fetched showcase info directly
        this.showcaseItems = fetchItems.items; // Assign fetched showcase items
      } else {
        console.error('Error fetching showcase items:', fetchItems);
      }
    } catch (error) {
      console.error('Error fetching showcase:', error);
    } finally {
      console.log(this.showcaseItems)
    }
  },
};
</script>
