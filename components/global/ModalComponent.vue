<template>
  <div v-if="isVisible" class="modal-overlay" @click="close">
    <div class="modal-content" @click.stop>
      <h2>{{ title }}</h2>
      <p>{{ message }}</p>
      <div class="form" v-if="isPrompt">
        <InputComponent
          v-for="(field, index) in promptFields"
          :key="index"
          :label="field.label"
          v-model="promptValues[normalizeLabel(field.label)]"
          :type="field.type"
          :options="field.options"
          :multiImages="field.multiImages"
          :multiSelect="field.multiSelect"
        />
      </div>
      <div class="button-container">
        <button v-if="isAlert" @click="handleOk" class="button primary">
          {{ okButtonText }}
        </button>
        <button v-else @click="handleCancel" class="button secondary">
          {{ cancelButtonText }}
        </button>
        <button v-if="!isAlert" @click="handleConfirm" class="button primary">
          {{ confirmButtonText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    modelValue: {
      type: Boolean,
      required: true,
    },
    title: {
      type: String,
      default: "Modal",
    },
    message: {
      type: String,
      default: "",
    },
    confirmButtonText: {
      type: String,
      default: "Confirm",
    },
    cancelButtonText: {
      type: String,
      default: "Cancel",
    },
    okButtonText: {
      type: String,
      default: "Ok",
    },
    isPrompt: {
      type: Boolean,
      default: false,
    },
    isAlert: {
      type: Boolean,
      default: false,
    },
    promptFields: {
      type: Array,
      default: () => [],
    },
  },
  emits: ["update:modelValue", "confirm"],
  data() {
    return {
      isVisible: this.modelValue,
      promptValues: this.initializePromptValues(),
    };
  },
  watch: {
    modelValue(newValue) {
      this.isVisible = newValue;
    },
    promptFields: {
      handler(newFields) {
        this.promptValues = this.initializePromptValues();
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    initializePromptValues() {
      return (this.promptFields || []).reduce((acc, field) => {
        const normalizedKey = this.normalizeLabel(field.label);
        if (field.type === "checkbox" || field.type === "radio") {
          acc[normalizedKey] = false;
        } else if (field.type === "select" && field.multiSelect) {
          acc[normalizedKey] = [];
        } else {
          acc[normalizedKey] = ""; // Initialize each field's value as an empty string
        }
        return acc;
      }, {});
    },
    normalizeLabel(label) {
      return label
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s/g, "");
    },
    close() {
      this.isVisible = false;
      this.$emit("update:modelValue", false);
    },
    handleCancel() {
      this.close();
    },
    handleConfirm() {
      const data = {};
      if (this.isPrompt) {
        this.promptFields.forEach((field) => {
          const normalizedKey = this.normalizeLabel(field.label);
          if (field.type === "select" && field.multiSelect) {
            const selectedOptions = Array.from(
              this.promptValues[normalizedKey] || []
            ).map((option) => option);
            data[normalizedKey] = selectedOptions;
          } else {
            data[normalizedKey] = this.promptValues[normalizedKey];
          }
        });
        this.$emit("confirm", data);
      } else {
        this.close();
        this.$emit("confirm", data);
      }
    },
    handleOk() {
      this.close();
    },
  },
};
</script>

<style lang="scss" scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;

  .modal-content {
    background-color: white;
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    max-width: 600px;
    text-align: center;
    max-height: 80vh;
    overflow-y: auto;

    ::-webkit-scrollbar-track {
      -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
      background-color: #f5f5f5;
      border-radius: 0 5px 5px 0;
    }

    ::-webkit-scrollbar {
      width: 8px;
      background-color: #f5f5f5;
      border-radius: 0 5px 5px 0;
    }

    ::-webkit-scrollbar-thumb {
      background-color: #949494;
      border: 1px solid #a1a1a1;
      border-radius: 0 4px 4px 0;
    }

    h2 {
      font-size: 1.8rem;
      margin-bottom: 20px;
    }

    p {
      font-size: 1.2rem;
      margin-bottom: 30px;
      color: #4b5563;
    }

    .form {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: center;
      margin-bottom: 10px;
      gap: 20px;
    }

    .button-container {
      display: flex;
      justify-content: space-between;

      .button {
        padding: 12px 40px;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-size: 1.2rem;
        transition: all 0.3s ease-in-out;

        &.primary {
          background-color: #3b82f6;
          color: white;
        }

        &.secondary {
          background-color: #6b7280;
          color: white;
        }

        &:hover {
          opacity: 0.8;
        }
      }
    }
  }
}
</style>