<template>
  <div :class="!disabled ? '' : 'pointer-events-none'">
    <label v-if="required && label" :for="required ? 'required-email' : 'label-input'" style="font-weight: bold;">
      {{ label }}:
      <span style="color: red;">*</span>
    </label>
    <label v-else-if="label" :for="required ? 'required-email' : 'label-input'" style="font-weight: bold;">{{ label }}:</label>
    <input
      @input="$emit('update:modelValue', $event.target.value)"
      :value="modelValue"
      :disabled="disabled"
      :type="type"
      :required="required"
      :id="required ? 'required-email' : 'label-input'"
      class="input-class"
      :class="getExtraClasses()"
      :style="inputStyle"
    />
  </div>
</template>

<script>
export default {
  data() {},
  props: {
    type: String,
    noBorder: Boolean,
    label: String,
    required: Boolean,
    placeholder: String,
    disabled: Boolean,
    modelValue: String,
    inputFull: Boolean,
  },
  methods: {
    getExtraClasses() {
      const classes = [];
      if (this.$props.noBorder) {
        classes.push("border-none");
      } else {
        classes.push("border");
        classes.push("ring-1");
      }
      if (this.$props.disabled) {
        classes.push("shadow-none");
      }
      if (this.$props.inputFull) {
        classes.push("w-full");
        classes.push("block");
      } else {
        classes.push("w-fit");
        classes.push("max-w-md");
      }
      return classes.join(" ");
    },
  },
  computed: {
    inputStyle() {
      return {
        borderRadius: '0.375rem',
        padding: '0.5rem',
        backgroundColor: 'white',
        color: 'gray',
        fontSize: '1rem',
        outline: 'none',
        border: this.noBorder ? 'none' : '1px solid #ccc',
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
        width: this.inputFull ? '100%' : 'auto',
        display: this.inputFull ? 'block' : 'inline-block'
      };
    }
  }
};
</script>
