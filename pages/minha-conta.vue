<template>
  <div class="page-wrapper">
    <main v-if="authenticated">
      <div class="user-landscape">
        <div class="user-info container">
          <section class="user-info__start">
            <figure class="user-info__start--image">
              <img
                :src="userInfo.userData.profilePicture ? userInfo.userData.profilePicture : 'https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png'"
                alt=""
              />
            </figure>
            <div class="user-info__start--info">
              <div class="user-details">
                <div class="user-details__nome">{{userInfo.userData.name}}</div>
                <div class="user-details__verified">
                    <span class="verified" v-if="userInfo.userData.verified">
                        <nuxt-icon name="verified" />
                        Usuário Verificado
                    </span>
                    <span class="not-verified" v-else>
                        Usuário Não Verificado
                    </span>
                    <span v-if="!userInfo.userData.verified" class="verify">Solicite a Verificação</span>
                </div>
                <div class="user-details__since">Membro desde {{memberSince.day}} de {{memberSince.month}} de {{memberSince.year}}</div>
              </div>
            </div>
          </section>
          <div class="edit-profile">
            <button>Editar Perfil</button>
          </div>
        </div>
        <section class="sales-earnings container">
          <h3 class="sales-earnings__title">Ganhos e Vendas</h3>
          <div class="sales-earnings__content">
            <DisplaySaleInfo label="Ganhos Totais" :value="userInfo.userData.totalSalesValue" type="price" />
            <DisplaySaleInfo label="Produtos Vendidos" :value="userInfo.userData.totalSales" type="int" />
            <DisplaySaleInfo label="Produtos Disponíveis" :value="userInfo.userData.availableProducts" type="int" />
            <DisplaySaleInfo label="Produtos Anunciados" :value="userInfo.userData.announcedProducts" type="int" />
          </div>
        </section>
      </div>
    </main>
    <main v-else class="not-authenticated">
      Você não está logado! Clique Aqui para
      <div class="destaque" @click="toggleAuthPanel">Logar</div>
    </main>
    <AuthPanel :show="showAuthPanel" @close="closeAuthPanel" />
  </div>
</template>

<style lang="scss" scoped>
main {
  .sales-earnings {
    &__title {
      font-size: 18px;
      padding-block: 40px 16px;
      padding-left: 10px;
      font-weight: 600;
    }
    &__content {
      display: flex;
      align-items: center;
      justify-content: stretch;
      gap: 20px;
      div {
        flex: 1 1 100%;
      }
    }
  }
  .user-landscape {
    width: 100dvw;
    height: 30vh;
    background-color: rgba(0, 0, 0, 0.5);
    .user-info {
      display: flex;
      height: 100%;
      align-items: center;
      justify-content: space-between;
      &__start {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 40px;
        &--info {
            .user-details {
                display: flex;
                align-items: flex-start;
                justify-content: center;
                flex-direction: column;
                gap: 12px;
                &__nome {
                    font-size: 32px;
                    font-weight: 600;
                    color: white;
                }
                &__verified {
                  display: flex;
                  align-items: center;
                  justify-content: start;
                  gap: 16px;
                  .verified {
                      color: #21cc35;
                      background-color: white;
                      display: flex;
                      align-items: center;
                      justify-content: start;
                      padding: 4px 8px;
                      border-radius: 5px;
                      line-height: 1.6;
                      gap: 8px;
                    }
                    .not-verified {
                      background-color: white;
                      display: flex;
                      align-items: center;
                      justify-content: start;
                      padding: 4px 8px;
                      border-radius: 5px;
                      line-height: 1.5;
                      color: #f83a53;
                      font-weight: 600;
                    }
                    .verify {
                      background: transparent;
                      color: white;
                      cursor: pointer;
                      &:hover {
                        text-decoration: underline;
                        text-underline-offset: 4px;
                      }
                    }
                }
                &__since {
                    color: white;
                    font-weight: 500;
                }
            }
            display: flex;
            flex-direction: column;
            align-content: center;
        }
        &--image {
          img {
            width: 100%;
            max-width: 200px;
            border-radius: 50%;
            border: 5px solid white;
            aspect-ratio: 1 / 1;
            object-fit: cover;
            background: white;
          }
        }
      }
      .edit-profile {
        button {
            padding: 16px 32px;
            color: white;
            background-color: #222;
            border: 1px solid #222;
            border-radius: 5px;
            cursor: pointer;
            transition: all .2s linear;
            &:hover {
                background-color: #444;
                border-color: #444;
            }
        }
      }
    }
  }
  min-height: 50vh;
  background-color: #f1f1f1;
  &.not-authenticated {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    .destaque {
      color: #f83a53;
      cursor: pointer;
      &:hover {
        font-weight: 500;
      }
    }
  }
}
</style>

<script>
export default {
  data() {
    return {
      authenticated: false,
      showAuthPanel: false,
      userInfo: {},
      memberSince: {}
    };
  },
  methods: {
    toggleAuthPanel() {
      this.showAuthPanel = !this.showAuthPanel;
    },
    closeAuthPanel() {
      this.showAuthPanel = false;
    },
    extractDateComponents(dateString) {
        const date = new Date(dateString);
        const day = date.getUTCDate();
        const monthIndex = date.getUTCMonth(); // getUTCMonth returns 0-based month
        const year = date.getUTCFullYear();
        const monthNamesInPortuguese = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
        ];
        const month = monthNamesInPortuguese[monthIndex];
        this.memberSince = {day, month, year}
    }
  },
  async mounted() {
    const { session } = await useSession();
    this.userInfo = await session
    this.extractDateComponents(this.userInfo.userData.createdAt)
    this.authenticated = await this.$isAuthenticated();
  },
};
</script>