<template>
  <form class="search-input" @submit.prevent="searchProducts">
    <!-- O componente SpeechRecognition emite o evento "transcription" -->
    <SpeechRecognition class="mic" @transcription="updateSearchTerm" />
    <input
      type="text"
      v-model="searchTerm"
      placeholder="Procure aqui o que você precisa!"
    />
    <button type="submit" class="search-btn">
      <nuxt-icon name="search" />
    </button>
  </form>
</template>

<script>
export default {
  data() {
    return {
      searchTerm: "",
    };
  },
  methods: {
    // Função chamada quando o evento "transcription" é disparado pelo componente filho
    updateSearchTerm(transcript) {
      // Atualiza searchTerm com a transcrição recebida
      this.searchTerm = transcript;
    },
    async searchProducts() {
      try {
        // Make a request to your backend API endpoint that handles search
        const response = await this.$useFetch(`search?query=${this.searchTerm}`);
        // Emit the search results to the parent component
        this.$emit("search", this.searchTerm);
      } catch (error) {
        console.error("Error searching products:", error);
        // Handle error, if any
      }
    },
  },
};
</script>

<style scoped lang="scss">
.search-input {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  .search-btn {
    background: transparent;
    border: none;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 16px;
    color: #f83a53;
    cursor: pointer;
  }
  .mic {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 16px;
  }
}

.search-input input {
  width: 100%;
  padding: 10px 45px;
  height: 50px;
  border-radius: 10px;
  border: none;
  outline: none;
  font-size: 20px;
  color: #b1b1b1;
  font-weight: 500;
  &::placeholder {
    color: #b1b1b1;
    font-weight: 500;
  }
}
</style>
