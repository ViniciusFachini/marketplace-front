<template>
  <main>
    <div class="nav-container container">
      <NuxtLink to="/minha-conta" class="action-button go-back">
        <nuxt-icon name="arrow-back" />
        Minha Conta
      </NuxtLink>
      <NuxtLink
        :to="`/produtos/${productInfo.slug}`"
        class="action-button see-product"
      >
        Ver produto como cliente
        <nuxt-icon name="arrow-forward" />
      </NuxtLink>
    </div>
    <div class="page-wrapper container">
      <ModalComponent
        v-model="showWarningModal"
        :title="warningTitle"
        :message="warningMessage"
        isAlert
        :okButtonText="'Ok'"
        @update:modelValue="showWarningModal = $event"
      />
      <ModalComponent
        v-model="showAlertModal"
        :title="alertTitle"
        :message="alertMessage"
        isAlert
        :okButtonText="'Ok'"
        @update:modelValue="showAlertModal = $event"
      />
      <div class="product-image">
        <figure v-for="(image, index) in productInfo.images" :key="image.id">
          <img :src="image.imageUrl ? image.imageUrl : image" alt="" />
          <div @click="removeImage(index)" class="remove-picture">
            <nuxt-icon name="trash" />
          </div>
        </figure>
      </div>
      <div class="edit-product-wrapper">
        <h1>Editar Produto</h1>
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <InputComponent
              v-model="productInfo.name"
              type="text"
              label="Nome do Produto"
              required
              @field-changed="handleFieldChange('name', $event)"
            />
          </div>
          <div class="form-group">
            <InputComponent
              v-model="productInfo.price"
              type="text"
              label="Preço"
              required
              pattern="^\d+(\.\d{1,2})?$"
              placeholder="0.00"
              @field-changed="handleFieldChange('price', $event)"
            />
          </div>
          <div class="form-group">
            <InputComponent
              v-model="productInfo.product_condition"
              type="select"
              :options="productConditions"
              label="Condição do Produto"
              required
              @options-selected="handleSelect($event, 'product_condition')"
            />
          </div>
          <div class="form-group double">
            <InputComponent
              v-model="productInfo.brand"
              type="text"
              label="Marca"
              required
              @field-changed="handleFieldChange('brand', $event)"
            />
            <InputComponent
              v-model="productInfo.model"
              type="text"
              label="Modelo"
              required
              @field-changed="handleFieldChange('model', $event)"
            />
          </div>
          <div class="form-group">
            <InputComponent
              v-model="selectedCategories"
              type="select"
              multiSelect
              :options="categories"
              label="Categorias"
              @options-selected="handleSelect($event, 'categories')"
            />
          </div>
          <div class="form-group">
            <InputComponent
              v-model="productInfo.available"
              type="checkbox"
              label="Disponível"
              @field-changed="handleFieldChange('available', $event)"
            />
          </div>
          <div class="form-group">
            <InputComponent
              v-model="productInfo.images"
              type="file"
              label="Imagens do Produto"
              :multiImages="true"
              @field-changed="handleFieldChange('images', $event)"
            />
          </div>
          <div class="form-group">
            <InputComponent
              v-model="productInfo.description"
              type="textarea"
              label="Descrição do Produto"
              @field-changed="handleFieldChange('description', $event)"
            />
          </div>
          <button type="submit">Salvar</button>
        </form>
      </div>
    </div>
  </main>
</template>

<script>
import { useRoute } from "vue-router";

export default {
  data() {
    return {
      productInfo: {
        name: "",
        price: "",
        product_condition: "",
        available: false,
        images: [],
        categories: [],
        authenticated: false,
        description: "",
      },
      categories: [],
      changedFields: {},
      productConditions: [
        { value: "Novo", text: "Novo" },
        { value: "Usado", text: "Usado" },
        { value: "Semi Novo", text: "Semi Novo" },
      ],
      selectedCategories: [],
      selectedCondition: "",
      showWarningModal: false,
      warningTitle: "",
      warningMessage: "",
      showAlertModal: false,
      alertTitle: "",
      alertMessage: "",
    };
  },
  methods: {
    handleFieldChange(fieldName, value) {
      if (fieldName === "product_condition") {
        this.changedFields[fieldName] = value[0]; // Assuming product_condition is single-select
      } else {
        this.changedFields[fieldName] = value;
      }
    },
    removeImage(index) {
      this.productInfo.images.splice(index, 1);
    },
    handleSelect(selectedOptions, fieldName) {
      if (fieldName === "categories") {
        this.selectedCategories = selectedOptions;
      } else if (fieldName === "product_condition") {
        if (selectedOptions.length > 0) {
          this.selectedCondition = selectedOptions[0];
        } else {
          this.selectedCondition = "";
        }
      }
    },
    async convertImagesToBase64(images) {
      const convertedImages = await Promise.all(
        Array.from(images).map(async (item) => {
          if (item.imageUrl) {
            return await this.toDataUrl(item.imageUrl);
          } else {
            return item;
          }
        })
      );
      return convertedImages;
    },
    toDataUrl(url) {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        xhr.responseType = "blob";
        xhr.onload = function () {
          const reader = new FileReader();
          reader.onloadend = function () {
            resolve(reader.result);
          };
          reader.readAsDataURL(xhr.response);
        };
        xhr.onerror = function () {
          reject(new Error("Failed to fetch image"));
        };
        xhr.send();
      });
    },
    async loadCategories() {
      const response = await this.$fetchInfo("categories");
      this.categories = response.map((item) => {
        return {
          text: item.name,
          value: item.id,
        };
      });
    },
    triggerWarningModal(title, message) {
      this.warningTitle = title;
      this.warningMessage = message;
      this.showWarningModal = true;
    },
    triggerAlertModal(title, message) {
      this.alertTitle = title;
      this.alertMessage = message;
      this.showAlertModal = true;
    },
    async handleSubmit() {
      if (this.selectedCondition) {
        this.changedFields.product_condition = this.selectedCondition;
      }

      if (this.selectedCategories) {
        this.changedFields.categories = this.selectedCategories;
      } else if (
        this.selectedCategories &&
        this.selectedCategories.length === 0
      ) {
        const originalCategories = Array.from(this.productInfo.categories).map(
          (item) => item.category_id
        );
        this.changedFields.categories = [...originalCategories];
      }

      if (this.productInfo.images && this.productInfo.images.length > 0) {
        const oldImages = await this.convertImagesToBase64(
          this.productInfo.images
        );
        this.changedFields.images = [...oldImages];
      }

      try {
        const response = await this.$fetchInfoAuthenticated(
          `products/${this.productInfo.id}`,
          "PATCH",
          this.changedFields
        );
        console.log(response);
        if (response.message) {
          this.triggerAlertModal("Produto", "Produto atualizado com sucesso!");
        } else if (!response.ok) {
          this.triggerWarningModal(
            "Produto",
            "Houve um problema ao atualizar o Produto!"
          );
        }
      } catch (error) {
        console.error("Error submitting changed fields:", error);
      }
    },
    async getProductInfo() {
      const productId = this.$route.params.slug
      const fetchItem = await this.$fetchInfo(`products/slug/${productId}`);
      this.productInfo = await fetchItem;
    },
    async setSessionDeclared() {
      const { session } = await useSession();
      this.session = await session;
    },
    async checkUserAuth() {
      const authenticated = await this.$isAuthenticated();
      let isUserPermited;
      if (authenticated) {
        await this.loadCategories();
        await this.setSessionDeclared()
        await this.getProductInfo()
        const authenticatedUserId = await this.session.value.user.id
        if(this.productInfo && this.productInfo.seller_id === authenticatedUserId) {
          isUserPermited = true
        } else {
          isUserPermited = false
        }
      } else {
        isUserPermited = false
      }
      return isUserPermited;
    },
  },
  async mounted() {
    const response = await this.checkUserAuth();
    if(response) {
      this.authenticated = true;
    } else {
      this.$router.push("/minha-conta");
    }
  },
};
</script>


<style lang="scss" scoped>
main {
  background: #f1f1f1;
}

.nav-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.action-button {
  color: #222;
  text-decoration: none;
  padding-top: 20px;
  display: flex;
  align-items: center;
  justify-content: start;
  font-weight: 600;
  gap: 8px;
  line-height: 2;
  transition: all 0.2s linear;
  &:hover {
    color: #f83a53;
  }
}
.page-wrapper {
  display: flex;
  align-items: start;
  justify-content: center;
  gap: 20px;
  padding-block: 20px 40px;
  .product-image {
    width: 60%;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    padding: 20px;
    background-color: white;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    figure {
      position: relative;
      &:hover {
        .remove-picture {
          opacity: 1;
          visibility: visible;
        }
      }
      .remove-picture {
        position: absolute;
        top: 20px;
        right: 20px;
        color: red;
        background-color: white;
        padding: 20px;
        width: auto;
        height: auto;
        transition: all 0.1s linear;
        border-radius: 50%;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        span {
          width: 24px;
          height: 24px;
        }
      }
    }
  }
  .edit-product-wrapper {
    width: 100%;
    max-width: 40%;
    padding: 40px;
    background: white;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    button {
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
      border: none;
      min-width: 120px;
      font-size: 16px;
      &:hover {
        background-color: #1e52ff;
      }
    }

    h1 {
      font-size: 24px;
      margin-bottom: 20px;
    }

    .form-group {
      margin-bottom: 20px;

      &.double {
        display: flex;
        gap: 20px;
      }

      label {
        display: block;
        margin-bottom: 5px;
        font-weight: bold;
      }

      input,
      textarea,
      select {
        width: 100%;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 5px;
        font-size: 16px;
      }

      textarea {
        height: 100px;
      }
    }

    .image-upload {
      input[type="file"] {
        display: block;
        margin-bottom: 10px;
      }

      .image-preview {
        display: flex;
        gap: 10px;

        img {
          width: 100px;
          height: 100px;
          object-fit: cover;
          border-radius: 5px;
        }
      }
    }

    .save-button {
      display: block;
      width: 100%;
      padding: 15px;
      background: #12a826;
      border: none;
      color: white;
      font-size: 18px;
      font-weight: bold;
      cursor: pointer;
      border-radius: 5px;
      transition: background 0.3s;

      &:hover {
        background: darken(#12a826, 10%);
      }
    }
  }
}
</style>
