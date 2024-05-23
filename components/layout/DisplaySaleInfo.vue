<template>
  <div class="content-wrap">
    <span class="label">
      {{ label }}
    </span>
    <span class="value">
      {{ type == 'int' ? value : formatPrice(value)}}
    </span>
  </div>
</template>

<style lang="scss" scoped>
.content-wrap {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
  width: fit-content;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  &:hover {
    box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
  }
  .label {
    font-size: 16px;
    font-weight: 500;
  }
  .value {
    font-size: 24px;
  }
}
</style>

<script>
export default {
  props: {
    label: String,
    value: String,
    type: String
  },
  methods: {
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
  },
};
</script>