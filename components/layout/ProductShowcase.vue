<template>
<div class="showcase-container">
  <div class="showcase-title-wrapper" v-if="showcaseInfo.title">
    <h3 class="showcase-title container">{{ showcaseInfo.title }}</h3>
  </div>
  <div class="container">
    <Carousel v-bind="settings" :breakpoints="breakpoints">
      <Slide v-for="(product, index) in showcaseItems" :key="index">
        <ProductCard :productInfo="product" />
      </Slide>
      <template v-if="arrows" #addons>
        <Navigation />
      </template>
    </Carousel>
  </div>
</div>
</template>

<style lang="scss" scoped>
.showcase-title-wrapper {
  text-align: left;
  width: 100%;
  margin-left: 10px;
  h3 {
    font-size: 24px;
    font-weight: 500;
    line-height: 150%;
    margin-bottom: 16px;
  }
}
</style>

<script>
export default {
  props: {
    showcaseId: Number,
    arrows: Boolean,
    itemsToShow: Number,
    infinite: Boolean
  },
  data() {
    return {
      showcaseInfo: {}, // Changed from an array to an object
      showcaseItems: [], // Renamed from showcaseItem to showcaseItems
      settings: {
        itemsToShow: 1,
        snapAlign: "center",
        itemsToScroll: 1,
      },
      breakpoints: {
      540: {
        itemsToShow: 2,
        snapAlign: "start"
      },
      991: {
        itemsToShow: 3,
        snapAlign: "start"
      },
      1200: {
        itemsToShow: 4,
        snapAlign: "start"
      },
      1439: {
        itemsToShow: 5,
        snapAlign: "start"
      }
    },
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
    } 
    // finally {
    //   console.log(this.showcaseItems)
    // }
  },
};
</script>
