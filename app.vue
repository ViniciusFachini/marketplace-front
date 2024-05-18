<template>
  <Header />
  <NuxtPage />
</template>

<style lang="scss">
.carousel__pagination-button::after {
  width: 10px !important;
  height: 10px !important;
  border-radius: 50%;
  background-color: #f1f1f1;
}
.carousel__pagination-button--active::after {
  background-color: #f83a53;
}
.carousel__next {
  margin: 0 !important;
  height: 100px;
  width: 40px;
  background: #1C232133;
}
.carousel__prev {
  margin: 0 !important;
  height: 100px;
  width: 40px;
  background: #1C232133;
}

.carousel {
  &__viewport{
    height: 100%;
  }
  &__track {
    height: 100%;
  }
  &__slide {
    height: 100%;
    img {
      height: 100%;
    }
  }
}


</style>