<template>
  <div>
    <button type="button" @click="toggleListening">
      <nuxt-icon name="mic" />
    </button>
  </div>
</template>
  
  <script>
export default {
  data() {
    return {
      isListening: false,
      transcript: "",
      error: "",
      recognition: null,
      timeout: null,
      timeoutDuration: 3000, // 3 segundos para interromper após não ouvir nada
    };
  },
  methods: {
    setupRecognition() {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = "pt"; // Configurar idioma para português

        // Configurações de eventos
        this.recognition.onstart = () => {
          this.isListening = true;
          this.error = "";
          // Iniciar o temporizador para parar de escutar após 3 segundos de silêncio
          this.startTimeout();
        };

        this.recognition.onend = () => {
          this.isListening = false;
          // Limpar o temporizador quando o reconhecimento de fala termina
          this.clearTimeout();
        };

        this.recognition.onerror = (event) => {
          this.error = "Erro de reconhecimento de fala: " + event.error;
        };

        // Manipulador de resultados de reconhecimento de fala
        this.recognition.onresult = (event) => {
          // Reinicia o temporizador de 3 segundos
          this.clearTimeout();
          this.startTimeout();

          let finalTranscript = "";

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const result = event.results[i];
            finalTranscript += result[0].transcript.trim();
          }

          // Atualiza o transcript com o finalTranscript
          this.transcript += finalTranscript;

          // Emite o evento de transcrição para o componente pai
          this.$emit("transcription", finalTranscript);
        };

        // Reinicia o temporizador de 3 segundos ao final de cada fala
        this.recognition.onsoundend = () => {
          this.clearTimeout();
          this.startTimeout();
        };
      } else {
        this.error = "Reconhecimento de fala não está disponível.";
      }
    },
    toggleListening() {
      if (this.isListening) {
        // Parar de escutar
        this.recognition.stop();
        this.clearTimeout();
      } else {
        // Começar a escutar
        this.transcript = "";
        this.recognition.start();
      }
    },
    // Inicia o temporizador de 3 segundos para interromper o reconhecimento de fala
    startTimeout() {
      // Se houver um temporizador ativo, cancele-o
      this.clearTimeout();

      // Iniciar um novo temporizador de 3 segundos
      this.timeout = setTimeout(() => {
        this.recognition.stop();
      }, this.timeoutDuration);
    },
    // Função para limpar o temporizador atual
    clearTimeout() {
      if (this.timeout) {
        clearTimeout(this.timeout);
        this.timeout = null; // Opcional, para certificar-se de que o timeout é limpo
      }
    },
  },
  mounted() {
    // Inicializa o reconhecimento de fala quando o componente é montado
    this.setupRecognition();
  },
  beforeDestroy() {
    // Encerra o reconhecimento de fala quando o componente é destruído
    if (this.recognition) {
      this.recognition.stop();
    }
  },
};
</script>
  
  <style scoped>
button {
  border: none;
  background-color: transparent;
  margin: 0;
  color: #f83a53;
  cursor: pointer;
}
</style>
  