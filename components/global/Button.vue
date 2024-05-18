<template>
  <button
    :class="['button', variantClass]"
    :disabled="disabled"
    @click="handleClick"
  >
    {{ label }}
  </button>
</template>
  
  <script>
export default {
  name: "ButtonComponent",
  props: {
    // Label text for the button
    label: {
      type: String,
      required: true,
    },
    // Variant of the button, e.g., primary, secondary, etc.
    variant: {
      type: String,
      default: "primary",
    },
    // Disabled state of the button
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    // Compute the variant class based on the provided prop
    variantClass() {
      return `button--${this.variant}`;
    },
  },
  methods: {
    // Emit a click event when the button is clicked
    handleClick(event) {
      if (!this.disabled) {
        this.$emit("click", event);
      }
    },
  },
};
</script>
  
  <style scoped>
/* Basic styling for the button component */
.button {
  padding: 16px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 600;
  font-size: 16px;
}

/* Styling for different button variants */
.button--primary {
  background-color: #F83A53;
  color: white;
}

.button--primary:hover {
  background-color: #e93048;
}

.button--secondary {
  background-color: #FFF;
  color: #F83A53;
}

.button--secondary:hover {
    background-color: hsl(352, 100%, 80%);
    color: white;
}

.button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}
</style>
  