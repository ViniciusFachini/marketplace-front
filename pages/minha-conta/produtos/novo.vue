<template>
  <main>
    <NuxtLink to="/minha-conta" class="go-back container">
      <nuxt-icon name="arrow-back" />
      Minha Conta
    </NuxtLink>
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
      <div
        v-if="productInfo.images && productInfo.images.length > 0"
        class="product-image"
      >
        <figure v-for="(image, index) in productInfo.images" :key="image.id">
          <img :src="image.imageUrl ? image.imageUrl : image" alt="" />
          <div @click="removeImage(index)" class="remove-picture">
            <nuxt-icon name="trash" />
          </div>
        </figure>
      </div>
      <div v-else class="product-image no-image">
        <div class="product-image--text">
          O Produto ainda não tem nenhuma imagem. Gostaria de adicionar?
        </div>
      </div>
      <div class="edit-product-wrapper">
        <h1>Novo Produto</h1>
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
              @options-selected="
                (selectedOptions) =>
                  handleSelect(selectedOptions, 'product_condition')
              "
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
              @options-selected="
                (selectedOptions) => handleSelect(selectedOptions, 'categories')
              "
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
export default {
  data() {
    return {
      productInfo: {
        name: "",
        price: "",
        product_condition: "",
        images: [],
        categories: [],
        authenticated: false,
        description: "",
      },
      categories: [],
      productConditions: [
        { value: "Novo", text: "Novo" },
        { value: "Usado", text: "Usado" },
        { value: "Semi Novo", text: "Semi Novo" },
      ],
    };
  },
  methods: {
    handleFieldChange(fieldName, value) {
      console.log(this.productInfo);
      if (fieldName === "product_condition") {
        this.productInfo[fieldName] = value[0]; // Assuming product_condition is single-select
      } else if (fieldName === "categories") {
        // Don't return early, include categories in productInfo
        this.productInfo[fieldName] = value;
      } else {
        // For other fields, simply assign the value
        this.productInfo[fieldName] = value;
      }
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
    removeImage(index) {
      console.log(index);
      this.productInfo.images.splice(index, 1);
    },
    handleSelect(selectedOptions, fieldName) {
      // Check the field name to determine which field is being updated
      if (fieldName === "categories") {
        // Handle categories selection
        this.selectedCategories = selectedOptions;
      } else if (fieldName === "product_condition") {
        // Handle product condition selection
        if (selectedOptions.length > 0) {
          this.selectedCondition = selectedOptions[0];
        } else {
          // Handle the case when no option is selected
          this.selectedCondition = "";
        }
      }
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
    async handleSubmit() {
      const newProduct = {
        seller_id: this.session.value.user.id,
        name: this.productInfo.name,
        description: this.productInfo.description,
        category_ids: this.selectedCategories.map((item) => Number(item)),
        brand: this.productInfo.brand,
        model: this.productInfo.model,
        product_condition: this.selectedCondition,
        price: Number(this.productInfo.price),
        images: this.productInfo.images,
        available: 1,
      };

      const response = await this.$fetchInfoAuthenticated(
        "products",
        "POST",
        newProduct
      );
      if (response.message) {
        this.triggerAlertModal("Produto", "Produto criado com sucesso!");
      } else if (!response.ok) {
        this.triggerWarningModal("Produto", "Houve um problema ao criar o Produto!");
      }

      console.log(this.productInfo);

      try {
        // Perform API call or other actions to save only changed fields
        console.log("Changed fields submitted:", newProduct);
        // Example API call
        // await this.$http.post('/api/products/update', this.productInfo);
      } catch (error) {
        console.error("Error submitting changed fields:", error);
      }
    },
    async setSessionDeclared() {
      const { session } = await useSession();
      this.session = await session;
    },
    async checkUserAuth() {
      return await this.$isAuthenticated();
    },
  },
  async mounted() {
    // Fetch existing product data if editing an existing product
    const response = await this.checkUserAuth();
    if (response) {
      this.authenticated = true;
      await this.loadCategories();
      await this.setSessionDeclared();
    } else {
      this.$router.push("/");
    }
  },
};
</script>
  
  <style lang="scss" scoped>
main {
  background: #f1f1f1;
}
.go-back {
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
    &.no-image {
      display: flex;
      align-items: center;
      padding-block: 40px;
      justify-content: center;
    }
    &--text {
      font-size: 18px;
      text-align: center;
    }
    figure {
      position: relative;
      img {
        aspect-ratio: 1 / 1;
        object-fit: contain;
      }
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
  