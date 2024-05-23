<script setup>
const { session, refresh, update, reset } = await useSession();
console.log(session)
</script>

<template>
  <main>
    <MainBanner />
    <ProductShowcase
      :arrows="false"
      :itemsToShow="4"
      class="showcase"
      :showcaseId="1"
    />
    <ProductShowcase
      :arrows="false"
      :itemsToShow="4"
      class="showcase second-showcase"
      :showcaseId="2"
    />
    <DiscoverBanner />
    <ProductShowcase
      :arrows="false"
      :itemsToShow="4"
      class="showcase second-showcase"
      :showcaseId="3"
    />
    <DisclaimerBanner />
    <ProductDisplay :categoryId="13" title="Anúncios Patrocinados" catName="Patrocinados" :limit="20" />
  </main>
</template>

<style lang="scss" scoped>
.showcase {
  width: 100%;
  background-color: #f1f1f1;
  padding-top: 48px;
}
.second-showcase {
  padding: 22px !important;
}
main {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
</style>
