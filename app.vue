<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script>
export default {
  setup() {
    function updateSlideWidth() {
      if (!root.value) return;
      const rect = root.value.getBoundingClientRect();
      slideWidth.value = rect.width / config.itemsToShow + 40;
    }
    onMounted(() => {
      setTimeout(() => {
        slider.value.updateSlideWidth();
      }, 500);
    });
  },
}
</script>

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

.payment .article-list .article-list__item .nuxt-icon.nuxt-icon--stroke, .payment .article-list .article-list__item .nuxt-icon.nuxt-icon--stroke * {
  stroke: revert-layer !important;
}
.payment .article-list .article-list__item .nuxt-icon.nuxt-icon--fill, .payment .article-list .article-list__item .nuxt-icon.nuxt-icon--fill * {
  fill: revert-layer !important;
}

.showcase-container {
  li.product-item {
    margin-inline: 10px;
  }
  .carousel__track {
    padding-bottom: 10px !important;
  }
}

main {
  min-height: calc(100vh - 140px - 356px) !important;
}

.footer-content article.social-media .article-list__item:hover {
  background-color: #f1f1f1;
  .nuxt-icon.nuxt-icon--fill, .nuxt-icon.nuxt-icon--fill * {
      fill: #222 !important;
    }
  .nuxt-icon.nuxt-icon--stroke, .nuxt-icon.nuxt-icon--stroke * {
      stroke: #222 !important;
    }
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