<template>
  <div class="container main-banner">
    <Carousel
      :wrap-around="true"
      :items-to-show="1"
      snap-align="start"
      :autoplay="4000"
    >
      <Slide v-for="slide in 10" :key="slide">
        <img src="http://via.placeholder.com/960x330" />
      </Slide>
      <template #addons>
        <Navigation />
        <Pagination />
      </template>
    </Carousel>
    <div class="banners">
      <img src="http://via.placeholder.com/450x150" />
      <img src="http://via.placeholder.com/450x150" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.main-banner {
  gap: 20px;
  display: flex;
  align-items: stretch;
  justify-content: center;
  margin-block: 32px;
  width: 100%;
  .carousel {
    max-width: 70%;
    width: 100%;
    &__pagination {
      position: absolute;
      bottom: 10px;
      right: 50%;
      transform: translateX(50%);
    }
    &__viewport {
      height: 100%;
    }
    &__track {
      height: 100%;
    }
    &__slide {
      height: 100%;
    }
    &__next {
      margin: 0 !important;
    }
    &__prev {
      margin: 0 !important;
    }
  }
  .banners {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: end;
    gap: 20px;
    width: 100%;
    max-width: 30%;
    > * {
      display: block;
      width: 100%;
      height: 100%;
    }
  }
  @media screen and (max-width: 992px) {
    flex-direction: column;
    .carousel {
      max-width: 100%;
    }
    .banners {
      max-width: 100%;
      flex-direction: row;
      max-height: unset;
      flex-wrap: wrap;
    }
  }
}
</style>