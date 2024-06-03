<template>
  <div class="input-wrapper" :class="type">
    <label v-if="required && label && type !== 'checkbox'" :for="inputId">
      {{ label }}:
      <span class="required-dot">*</span>
    </label>
    <label v-else-if="label && type !== 'checkbox'" :for="inputId"
      >{{ label }}:</label
    >

    <textarea
      v-if="type === 'textarea'"
      @input="handleChange($event)"
      :value="modelValue"
      :required="required"
      :id="inputId"
      :disabled="disabled"
      :placeholder="placeholder"
      class="custom-textarea"
    ></textarea>

    <input
      v-else-if="type === 'file'"
      @change="handleFileChange($event)"
      type="file"
      :accept="accept"
      :required="required"
      :id="inputId"
      class="custom-file-input"
      :multiple="multiImages"
    />

    <input
      v-else-if="type !== 'select' && type !== 'radio' && type !== 'checkbox'"
      @input="handleChange($event)"
      :value="modelValue"
      :type="type"
      :required="required"
      :id="inputId"
      :disabled="disabled"
      :pattern="pattern"
      :placeholder="placeholder"
      class="custom-input"
    />

    <template v-if="type === 'radio'">
      <div class="radio-wrapper">
        <div
          class="radio-group"
          v-for="(option, index) in options"
          :key="index"
        >
          <input
            type="radio"
            :value="option.value"
            :required="required"
            :id="`${inputId}-${index}`"
            :checked="modelValue === option.value"
            @change="handleChange(option.value)"
            :disabled="disabled"
          />
          <label :for="`${inputId}-${index}`">{{ option.text }}</label>
        </div>
      </div>
    </template>

    <template v-if="type === 'checkbox'">
      <div class="checkbox-wrapper">
        <input
          type="checkbox"
          :required="required"
          :id="inputId"
          :checked="modelValue"
          @change="handleCheckboxChange($event)"
          :disabled="disabled"
        />
        <label :for="inputId">{{ label }}</label>
      </div>
    </template>

    <select
      v-else-if="type === 'select'"
      @change="handleSelectChange($event)"
      :value="modelValue"
      :required="required"
      :id="inputId"
      :disabled="disabled"
      class="custom-input select"
      :multiple="multiSelect"
    >
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
      >
        {{ option.text }}
      </option>
    </select>
  </div>
</template>

<script>
export default {
  props: {
    type: String,
    required: Boolean,
    label: String,
    modelValue: [String, Boolean, Array],
    accept: String,
    disabled: Boolean,
    noBorder: Boolean,
    inputFull: Boolean,
    multiImages: {
      type: Boolean,
      default: false,
    },
    multiSelect: {
      type: Boolean,
      default: false, // Default value for multiple selection in select dropdown
    },
    options: {
      type: Array,
      default: () => [],
    },
    pattern: String,
    placeholder: String,
  },
  computed: {
    inputId() {
      return this.required ? "required-input" : "label-input";
    },
  },
  methods: {
    handleChange(event) {
      const value = event.target ? event.target.value : event;
      this.$emit("update:modelValue", value);
      this.$emit("field-changed", value);
    },
    handleFileChange(event) {
      const files = Array.from(event.target.files);
      if (this.multiImages) {
        const images = [];
        files.forEach((file) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            images.push(reader.result);
            if (images.length === files.length) {
              if (Array.isArray(this.modelValue)) {
                // Concatenate new images with existing ones
                const concatenatedImages = this.modelValue.concat(images);
                this.$emit("update:modelValue", concatenatedImages);
                this.$emit("field-changed", concatenatedImages);
              } else {
                this.$emit("update:modelValue", images);
                this.$emit("field-changed", images);
              }
            }
          };
          reader.readAsDataURL(file);
        });
      } else {
        const file = files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
          if (Array.isArray(this.modelValue)) {
            // Concatenate new image with existing ones
            const concatenatedImages = this.modelValue.concat(reader.result);
            this.$emit("update:modelValue", concatenatedImages);
            this.$emit("field-changed", concatenatedImages);
          } else {
            this.$emit("update:modelValue", reader.result);
            this.$emit("field-changed", reader.result);
          }
        };
        if (file) {
          reader.readAsDataURL(file);
        }
      }
    },
    handleSelectChange(event) {
      const selectedOptions = Array.from(event.target.selectedOptions).map(
        (option) => option.value
      );
      // Emit event indicating selected options
      console.log(selectedOptions)
      this.$emit("options-selected", selectedOptions);
      this.$emit("update:modelValue", selectedOptions);
      this.$emit("field-changed", selectedOptions);
    },
    handleCheckboxChange(event) {
      const checked = event.target.checked;
      this.$emit("update:modelValue", checked);
      this.$emit("field-changed", checked);
    },
  },
};
</script>
<style lang="scss" scoped>
.input-wrapper {
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: start;
  gap: 4px;
  width: 100%;

  label {
    font-weight: bold;
  }

  .required-dot {
    color: #ef4444;
  }

  .radio-wrapper {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: start;
    gap: 16px;
    .radio-group {
      display: flex;
      align-items: center;
      justify-content: center;
      width: fit-content;
      gap: 4px;
    }
  }

  .checkbox-wrapper {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: start;
    gap: 8px;
  }

  .custom-file-input {
    width: 100%;
    color: black;
    background-color: white;
    border: 1px solid #ccc;
    border-radius: 0.375rem;
    padding: 0.625rem 1rem;
    cursor: pointer;
  }

  .custom-input,
  .custom-textarea {
    color: black;
    font-size: 0.875rem;
    background-color: white;
    border: 1px solid #ccc;
    border-radius: 0.375rem;
    padding: 0.625rem 1rem;
    width: 100%;
  }

  .custom-textarea {
    resize: vertical;
    min-height: 150px;
  }

  // Style select
  select,
  select[multiple] {
    display: block;
    width: 100%;
    padding: 0;
    font-size: 16px;
    font-family: Arial, sans-serif;
    color: #333;
    border: 1px solid #ccc;
    outline: none;
    overflow: auto;
    border-radius: 5px;
    appearance: none;
  }

  // Style options
  select option,
  select[multiple] option {
    padding: 10px;
    font-size: 16px;
    font-family: Arial, sans-serif;
    color: #333;
    background-color: #fff;
  }

  // Style selected options
  select[multiple] option:checked {
    background-color: #66afe9;
    color: #fff;
  }

  // Style select when focused
  select:focus,
  select[multiple]:focus {
    outline: none;
    border-color: #66afe9;
    box-shadow: 0 0 5px rgba(102, 175, 233, 0.5);
  }
}
</style>