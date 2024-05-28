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
        borderRadius: this.rounded ? '0.375rem' : 'none',
        width: this.buttonFull ? '100%' : 'auto'
      };
    }
  }
};
</script>

<style lang="scss" scoped>
button {
  padding: 0.5rem 1rem;
  transition: ease-in 0.2s;
  text-align: center;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  outline: none;
  border: none;
}
</style>