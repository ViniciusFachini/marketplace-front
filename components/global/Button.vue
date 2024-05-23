<template>
  <button :type="type" :style="buttonStyle">
    <slot></slot>
  </button>
</template>

<script>
export default {
  props: {
    type: String,
    rounded: Boolean,
    buttonFull: Boolean
  },
  computed: {
    buttonStyle() {
      return {
        padding: '0.5rem 1rem',
        color: 'white',
        transition: 'ease-in 0.2s',
        textAlign: 'center',
        fontSize: '1rem',
        fontWeight: '600',
        boxShadow: '0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08)',
        outline: 'none',
        border: 'none',
        borderRadius: this.rounded ? '0.375rem' : 'none',
        width: this.buttonFull ? '100%' : 'auto'
      };
    }
  }
};
</script>