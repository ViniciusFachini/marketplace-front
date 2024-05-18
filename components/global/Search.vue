<template>
  <form class="search-input">
    <!-- O componente SpeechRecognition emite o evento "transcription" -->
    <SpeechRecognition class="mic" @transcription="updateSearchTerm" />
    <input
      type="text"
      v-model="searchTerm"
      @input="handleInput"
      placeholder="Procure aqui o que você precisa!"
    />
    <button class="search-btn" type="submit">
      <nuxt-icon name="search" />
    </button>
  </form>
</template>
  
  <script>
import SpeechRecognition from "./SpeechRecognition";
export default {
  name: "SearchInput",
  components: {
    SpeechRecognition,
  },
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
      // Dispara o evento de busca
      this.handleInput();
    },
    handleInput() {
      this.$emit("search", this.searchTerm);
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
  color: #B1B1B1;
  font-weight: 500;
  &::placeholder {
    color: #B1B1B1;
    font-weight: 500;
  }
}
</style>
  