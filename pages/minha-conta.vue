<template>
  <div class="page-wrapper">
    <main v-if="authenticated">
      <div class="user-landscape">
        <div class="user-info container">
          <section class="user-info__start">
            <figure class="user-info__start--image">
              <img
                :src="
                  userInfo.profilePicture
                    ? userInfo.profilePicture
                    : 'https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png'
                "
                alt=""
              />
            </figure>
            <div class="user-info__start--info">
              <div class="user-details">
                <div class="user-details__nome">
                  {{ userInfo.name }}
                </div>
                <div class="user-details__verified">
                  <span class="verified" v-if="userInfo.verified">
                    <nuxt-icon name="verified" />
                    Usuário Verificado
                  </span>
                  <span class="not-verified" v-else>
                    Usuário Não Verificado
                  </span>
                  <span v-if="!userInfo.verified" class="verify"
                    >Solicite a Verificação</span
                  >
                </div>
                <div class="user-details__since">
                  Membro desde {{ memberSince.day }} de
                  {{ memberSince.month }} de {{ memberSince.year }}
                </div>
              </div>
            </div>
          </section>
          <div class="edit-profile">
            <button>Editar Perfil</button>
          </div>
        </div>
      </div>
      <section class="sales-earnings container">
        <div class="sales-earnings__title-section">
          <h3 class="sales-earnings__title-section__title">Ganhos e Vendas</h3>
          <span @click="showWithdrawModal = true" class="withdraw">
            <nuxt-icon name="plus" />
            Sacar
          </span>
        </div>
        <div class="sales-earnings__content">
          <DisplaySaleInfo
            label="Ganhos Totais"
            :value="userInfo.totalSalesValue"
            type="price"
          />
          <DisplaySaleInfo
            label="Produtos Vendidos"
            :value="userInfo.totalSales"
            type="int"
          />
          <DisplaySaleInfo
            label="Produtos Disponíveis"
            :value="userInfo.availableProducts"
            type="int"
          />
          <DisplaySaleInfo
            label="Produtos Anunciados"
            :value="userInfo.announcedProducts"
            type="int"
          />
          <DisplaySaleInfo
            label="Saldo Bloqueado"
            :value="userInfo.wallet && userInfo.wallet.balance"
            type="price"
          />
          <DisplaySaleInfo
            label="Saldo Disponível"
            :value="userInfo.wallet && userInfo.wallet.withdrawable_amount"
            type="price"
          />
        </div>
        <h3
          v-if="userInfo.transactions && userInfo.transactions.length > 0"
          class="sales-earnings__title"
        >
          Transações do Usuário
        </h3>
        <div
          v-if="userInfo.transactions && userInfo.transactions.length > 0"
          class="sales-earnings__content"
        >
          <DataTable
            redirectTo="vendas"
            showFilter
            :products="userInfo && userInfo.transactions"
            :show="10"
            :hiddenFields="[
              'seller_address_id',
              'buyer_address_id',
              'quantity',
              'seller_id',
              'buyer_id',
              'statusHistory',
            ]"
          />
        </div>
      </section>
      <section class="my-products container">
        <section class="my-products__title-section">
          <h3 class="my-products__title-section__title">Meus Produtos</h3>
          <span @click="showNewProductModal = true" class="add-product">
            <nuxt-icon name="plus" />
            Adicionar Produto
          </span>
        </section>
        <ul
          class="my-products__content"
          v-if="userProducts && userProducts.length > 0"
        >
          <DataTable
            modal
            showFilter
            :show="5"
            :products="userProducts"
            :hiddenFields="[
              'is_seller_verified',
              'sku',
              'description',
              'available',
              'seller_id',
              'created_at',
              'slug',
            ]"
          />
        </ul>
      </section>
      <AuthPanel :show="showAuthPanel" @close="closeAuthPanel" />
      <ModalComponent
        v-model="showNewProductModal"
        :title="'Novo Produto'"
        :message="'Por favor, insira as informações do produto:'"
        :isPrompt="true"
        :promptFields="promptFields"
        :confirmButtonText="'Criar Produto'"
        :cancelButtonText="'Cancelar'"
        @confirm="handleNewProduct"
        class="modal"
      />
      <ModalComponent
        v-model="showWithdrawModal"
        :title="'Sacar'"
        :message="'Insira o valor desejado (Mínimo de R$ 20,00):'"
        :isPrompt="true"
        :promptFields="withDrawPrompt"
        :confirmButtonText="'Sacar'"
        :cancelButtonText="'Cancelar'"
        @confirm="handleUserWithdraw"
        class="modal"
      />
      <ModalComponent
        v-model="showModal"
        :title="modalTitle"
        :message="modalMessage"
        isAlert
      />
    </main>
    <main v-else class="not-authenticated">
      Você não está logado! Clique Aqui para
      <div class="destaque" @click="toggleAuthPanel">Logar</div>
    </main>
  </div>
</template>

<script>
export default {
  data() {
    return {
      authenticated: false,
      showAuthPanel: false,
      session: {},
      categories: [],
      userInfo: {},
      userProducts: [],
      memberSince: {},
      showNewProductModal: false,
      showWithdrawModal: false,
      withDrawPrompt: [{ label: "Valor", type: "number", required: true }],
      promptFields: [
        { label: "Nome", type: "text", required: true },
        { label: "Descrição", type: "text", required: true },
        {
          label: "Categorias",
          type: "select",
          options: [],
          multiSelect: true,
          required: true,
        },
        { label: "Marca", type: "text", required: true },
        { label: "Modelo", type: "text", required: true },
        {
          label: "Condição",
          required: true,
          type: "radio",
          options: [
            { text: "Novo", value: "novo" },
            { text: "Usado", value: "usado" },
            { text: "Semi Novo", value: "semi_novo" },
          ],
        },
        { label: "Preço", type: "number", required: true },
        { label: "Imagens", type: "file", multiImages: true, required: true },
      ],
      showModal: false,
      modalTitle: "",
      modalMessage: "",
    };
  },
  methods: {
    toggleAuthPanel() {
      this.showAuthPanel = !this.showAuthPanel;
    },
    triggerModal(title, message) {
      this.modalTitle = title;
      this.modalMessage = message;
      this.showModal = true;
    },
    handleUserAction(title, message) {
      this.triggerModal(title, message);
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
        "Janeiro",
        "Fevereiro",
        "Março",
        "Abril",
        "Maio",
        "Junho",
        "Julho",
        "Agosto",
        "Setembro",
        "Outubro",
        "Novembro",
        "Dezembro",
      ];
      const month = monthNamesInPortuguese[monthIndex];
      this.memberSince = { day, month, year };
    },
    async loadCategories() {
      const response = await this.$fetchInfo("categories");
      this.categories = response.map((item) => {
        return {
          text: item.name,
          value: item.id,
        };
      });
      this.updatePromptFields();
    },
    async handleNewProduct(promptValues) {
      const finalData = {
        seller_id: this.session.user.id,
        name: promptValues.nome,
        description: promptValues.descricao,
        category_ids: promptValues.categorias,
        brand: promptValues.marca,
        model: promptValues.modelo,
        product_condition: promptValues.condicao,
        price: promptValues.preco,
        available: 1,
        images: promptValues.imagens,
      };
      console.log(finalData);
      const response = await this.$fetchInfoAuthenticated(
        "products",
        "POST",
        finalData
      );
      if (response.message) {
        this.triggerModal("Produto", "Produto criado com sucesso!");
      } else if (!response.ok) {
        this.triggerModal("Produto", "Houve um problema ao criar o Produto!");
      }
      this.showNewProductModal = false;
    },
    async handleUserWithdraw(promptValues) {
      const response = await this.$fetchInfoAuthenticated(
        `transactions/${this.session.user.id}/withdraw`,
        "PATCH",
        { amount: promptValues.valor }
      );
      if (response.message) {
        this.triggerModal("Saque", "Saque Realizado com sucesso!");
      } else if (!response.ok) {
        this.triggerModal("Saque", "Houve um problema ao realizar o saque!");
      }
      console.log(response);
      this.showWithdrawModal = false;
    },
    updatePromptFields() {
      // Find the "Categorias" field in promptFields and update its options
      const categoriasFieldIndex = this.promptFields.findIndex(
        (field) => field.label === "Categorias"
      );
      if (categoriasFieldIndex !== -1) {
        this.promptFields[categoriasFieldIndex].options = this.categories;
      }
    },
    async fetchUserInfo() {
      this.userInfo = await this.$fetchInfoAuthenticated(
        `users/${this.session.user.id}/info`
      );
    },
    async fetchUserProducts() {
      this.userProducts = await this.$fetchInfoAuthenticated(
        `users/${this.session.user.id}/products`
      );
    },
    async checkUserAuth() {
      return await this.$isAuthenticated();
    },
    async setSessionDeclared() {
      const { session } = await useSession();
      this.session = await session;
    },
  },
  async mounted() {
    const response = await this.checkUserAuth();

    if (response) {
      console.log(response);
      this.authenticated = true;
      await this.setSessionDeclared();
      await this.fetchUserInfo();
      await this.fetchUserProducts();
      this.extractDateComponents(this.userInfo.createdAt);
      await this.loadCategories();
    }
  },
};
</script>

<style lang="scss" scoped>
.modal {
  ::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    background-color: #f5f5f5;
    border-radius: 0 10px 10px 0;
  }

  ::-webkit-scrollbar {
    width: 10px;
    background-color: #f5f5f5;
    border-radius: 0 10px 10px 0;
  }

  ::-webkit-scrollbar-thumb {
    background-color: #949494;
    border: 1px solid #a1a1a1;
    border-radius: 0 8px 8px 0;
  }
}
main {
  .my-products,
  .sales-earnings {
    &__title-section {
      padding-block: 40px 16px;
      padding-inline: 10px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      &__title {
        font-size: 18px;
        font-weight: 600;
      }
      .add-product {
        color: white;
        background-color: #5179ff;
        padding: 8px 16px;
        line-height: 2;
        display: flex;
        align-items: center;
        border-radius: 5px;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s linear;
        gap: 8px;
        &:hover {
          background-color: darken(#5179ff, 10%);
        }
      }
      .withdraw {
        color: white;
        background-color: #12ad1a;
        padding: 8px 16px;
        line-height: 2;
        display: flex;
        align-items: center;
        border-radius: 5px;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s linear;
        gap: 8px;
        &:hover {
          background-color: darken(#12ad1a, 10%);
        }
      }
    }
    // &__content {
    //   grid-template-columns: repeat(4, 1fr) !important;
    //   display: grid !important;
    //   gap: 20px !important;
    //   padding-bottom: 64px;
    //   @media screen and (max-width: 992px) {
    //     grid-template-columns: repeat(3, 1fr) !important;
    //   }
    //   @media screen and (max-width: 768px) {
    //     grid-template-columns: repeat(2, 1fr) !important;
    //   }
    //   @media screen and (max-width: 425px) {
    //     grid-template-columns: repeat(1, 1fr) !important;
    //   }
    // }
  }
  .sales-earnings,
  .my-products {
    &__title {
      font-size: 18px;
      padding-block: 40px 16px;
      padding-inline: 10px;
      font-weight: 600;
    }
    &__content {
      display: flex;
      align-items: stretch;
      justify-content: space-between;
      padding-bottom: 40px;
      gap: 20px;
      flex-wrap: wrap;
      @media screen and (max-width: 600px) {
        gap: 8px;
      }
      div {
        @media screen and (max-width: 991px) {
          flex-direction: column;
          row-gap: 10px;
          justify-content: center;
          flex: 1 1 30%;
        }
        flex: 1 1 20%;
      }
    }
  }
  .user-landscape {
    width: 100dvw;
    height: 30vh;
    @media screen and (max-width: 767px) {
      height: auto;
    }
    background-color: rgba(0, 0, 0, 0.5);
    .user-info {
      display: flex;
      height: 100%;
      align-items: center;
      justify-content: space-between;
      @media screen and (max-width: 991px) {
        flex-direction: column;
        justify-content: center;
        padding: 40px;
      }
      @media screen and (max-width: 767px) {
        padding: 20px;
      }
      &__start {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 40px;
        @media screen and (max-width: 767px) {
          flex-direction: column;
          padding-bottom: 32px;
          gap: 20px;
          figure {
            img {
              max-width: 300px;
            }
          }
        }
        &--info {
          .user-details {
            display: flex;
            align-items: flex-start;
            justify-content: center;
            flex-direction: column;
            gap: 12px;
            @media screen and (max-width: 767px) {
              align-items: center;
              gap: 20px;
              &__nome {
                text-align: center;
              }
            }
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
              @media screen and (max-width: 445px) {
                flex-direction: column;
                gap: 8px;
              }
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
              text-align: center;
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
          transition: all 0.2s linear;
          @media screen and (max-width: 767px) {
            padding: 8px 16px;
          }
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

