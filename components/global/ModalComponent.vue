<template>
  <div v-if="isVisible" class="modal-overlay" @click="close">
    <div class="modal-content" @click.stop>
      <h2>{{ title }}</h2>
      <p v-if="!displayData">{{ message }}</p>
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

      <!-- First table for basic product information -->
      <table v-if="displayData" class="basic-product-table">
        <thead>
          <tr>
            <th>Field</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(value, key) in treatedProductDetails" :key="key">
            <td>{{ key }}</td>
            <td v-if="key != 'images'" >{{ value }}</td>
            <td v-else ><img :src="value" alt=""></td>
          </tr>
        </tbody>
      </table>

      <div
        class="button-container"
        :class="isAlert ? 'alert' : isPropmpt ? 'prompt' : 'confirm'"
      >
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
    displayData: {
      type: Boolean,
      default: false
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
  computed: {
    productDetails() {
      // Extract basic product details from the message prop
      // Modify this based on how you pass the product details to the modal
      if(this.$props.displayData) {
        return JSON.parse(this.message);
      } else {
        return
      }
    },
    treatedProductDetails() {
      // Create a copy of the original productDetails
      const originalDetails = { ...this.productDetails };

      // Treat the 'categories' field
      if (originalDetails.categories) {
        originalDetails.categories = originalDetails.categories.map(item => item.categoryName).join(', ');
      }
      if (originalDetails.statusHistory) {
        originalDetails.statusHistory = originalDetails.statusHistory.map(item => {
          const rightDate = new Date(item.changedAt).toLocaleString();
          return `${item.newStatus} - ${rightDate}`
        }).reverse().join(' | ');
      }

      // Treat the 'images' field
      if (originalDetails.images) {
        // Assume 'images' is an array of image URLs
        originalDetails.images = originalDetails.images[0].imageUrl;
      }

      // Treat the 'created_at' field
      if (originalDetails.created_at) {
        // Convert 'created_at' to a localized date string
        originalDetails.created_at = new Date(originalDetails.created_at).toLocaleString();
      }
      if (originalDetails.createdAt) {
        // Convert 'createdAt' to a localized date string
        originalDetails.createdAt = new Date(originalDetails.createdAt).toLocaleString();
      }

      // Treat the 'price' field
      if (originalDetails.price) {
        // Convert 'price' to a formatted price string
        originalDetails.price = `${this.formatPrice(originalDetails.price)}`;
      }

      if (originalDetails.totalAmount) {
        // Convert 'price' to a formatted price string
        originalDetails.totalAmount = `${this.formatPrice(originalDetails.totalAmount)}`;
      }

      // Return the treated product details
      return originalDetails;
    },
    additionalProductDetails() {
      // Example additional product details
      // Modify this based on your requirements
      return {
        // Example additional fields
        // Adjust or replace these with your actual fields and values
        "Field 1": "Value 1",
        "Field 2": "Value 2",
        "Field 3": "Value 3",
      };
    },
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
    formatPrice(price) {
      const value = parseFloat(price);
      if (isNaN(value)) {
      } else {
        return new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(value);
      }
    },
    getFieldLabel(key) {
      // Logic to determine field label based on key
      // For simplicity, returning key as label
      return key;
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
  z-index: 10000000;
  display: flex;
  justify-content: center;
  align-items: center;

  .modal-content {
    background-color: white;
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    max-width: 80vw;
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

      &.alert {
        justify-content: center;
      }

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
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 10000000;
  display: flex;
  justify-content: center;
  align-items: center;

  .modal-content {
    background-color: white;
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    max-width: 80vw;
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

      &.alert {
        justify-content: center;
      }

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

    /* Additional styles for tables */
    table {
      width: 100%;
      margin-bottom: 20px;
      border-collapse: collapse;
      background-color: white; /* Match background color of modal content */
    }

    th,
    td {
      padding: 10px;
      border: 1px solid #ddd;
      text-align: left;
      vertical-align: middle;
    }

    td img {
      width: 100%;
      max-width: 120px;
    }

    th {
      background-color: #f2f2f2;
    }
  }
}
</style>