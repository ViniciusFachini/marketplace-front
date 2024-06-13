<template>
  <div class="sidebar-container">
    <div class="top-section">
      <div class="header">
        <NuxtLink activeClass="active" exact to="/admin">
          <img src="/assets/images/logo-inverted.svg" alt="" />
        </NuxtLink>
      </div>
      <div class="links">
        <NuxtLink activeClass="active" exact to="/admin">
          <span>Analytics</span>
        </NuxtLink>
        <NuxtLink activeClass="active" exact to="/admin/produtos">
          <span>Produtos</span>
        </NuxtLink>
        <NuxtLink activeClass="active" exact to="/admin/showcases">
          <span>Showcases</span>
        </NuxtLink>
        <NuxtLink activeClass="active" exact to="/admin/categorias">
          <span>Categorias</span>
        </NuxtLink>
        <NuxtLink activeClass="active" exact to="/admin/mensagens">
          <span>Mensagens</span>
        </NuxtLink>
        <NuxtLink activeClass="active" exact to="/admin/usuarios">
          <span>Usuários</span>
        </NuxtLink>
        <NuxtLink activeClass="active" exact to="/admin/reviews">
          <span>Reviews</span>
        </NuxtLink>
        <NuxtLink activeClass="active" exact to="/admin/transacoes">
          <span>Transações</span>
        </NuxtLink>
        <NuxtLink activeClass="active" exact to="/admin/enderecos">
          <span>Endereços</span>
        </NuxtLink>
      </div>
    </div>
    <div class="footer">
      <button @click="logoutUser" class="logout">
        <span> Log Out </span>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    async logoutUser() {
      const { reset } = await useSession();
      reset();
      this.$router.push("/");
    },
  },
};
</script>

<style lang="scss" scoped>
.sidebar-container {
  width: 100%;
  background-color: #f1f1f1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  max-width: 250px;
}

.top-section {
  width: 100%;

  .header {
    img {
      padding: 30px 10px;
    }
  }

  .links {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    padding-inline: 10px;
    row-gap: 10px;
    padding-top: 40px;

    a {
      background-color: transparent;
      width: 100%;
      padding: 10px 20px 10px 20px;
      border-radius: 10px;
      transition: all 0.1s linear;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      gap: 0.75rem;
      height: 50px;

      &:hover {
        background-color: #ffffff;
      }

      &.active {
        background-color: #2966cc;
        color: white;
      }
    }
  }
}

.footer {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding-inline: 20px;
  margin-bottom: 30px;

  button {
    width: 100%;
    display: flex;
    align-content: center;
    justify-content: flex-start;
    gap: 10px;

    span {
      line-height: 1.25;
    }
  }
}
</style>
