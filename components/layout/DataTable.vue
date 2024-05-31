<template>
  <div class="product-table-container">
    <!-- Filter inputs and select -->
    <div v-if="showFilter" class="input-filter">
      <!-- Date filters for specific fields -->
      <div
        v-if="dateFilterFields.includes(selectedFilter)"
        class="date-filters"
      >
        <input
          v-model="startDateFilter"
          type="date"
          placeholder="Start Date"
          class="filter-input"
        />
        <input
          v-model="endDateFilter"
          type="date"
          placeholder="End Date"
          class="filter-input"
        />
      </div>
      <!-- Text filter for other fields -->
      <input
        v-else
        v-model="filterValue"
        type="text"
        placeholder="Filter value..."
        class="filter-input"
      />

      <!-- Select for choosing filter field -->
      <select v-model="selectedFilter" class="filter-select">
        <option v-for="field in filterableFields" :key="field" :value="field">
          {{ formatFieldName(field) }}
        </option>
      </select>
    </div>

    <!-- Table to display products -->
    <table class="product-table">
      <thead>
        <tr>
          <!-- Display table headers -->
          <th v-for="field in tableHeaders" :key="field">
            {{ formatFieldName(field) }}
          </th>
        </tr>
      </thead>
      <tbody>
        <!-- Display product data -->
        <tr
          v-for="product in paginatedProducts"
          :key="product.id"
          @click="handleProductClick(product)"
        >
          <td v-for="field in tableHeaders" :key="field">
            {{ formatFieldValue(product, field) }}
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Pagination controls -->
    <div v-if="totalPages > 1" class="pagination">
      <button
        @click="previousPage"
        :disabled="currentPage === 1"
        class="pagination-button"
      >
        Previous
      </button>
      <span v-for="page in totalPages" :key="page">
        <button
          @click="goToPage(page)"
          :class="{ active: currentPage === page }"
        >
          {{ page }}
        </button>
      </span>
      <button
        @click="nextPage"
        :disabled="currentPage === totalPages"
        class="pagination-button"
      >
        Next
      </button>
    </div>

    <!-- ModalComponent -->
    <ModalComponent
      :modelValue="showModalComponent"
      title="Product Details"
      :message="selectedProductDetails"
      @update:modelValue="showModalComponent = $event"
      isAlert
      :displayData="true"
    />
  </div>
</template>

<script>
export default {
  props: {
    products: {
      type: Array,
      required: true,
    },
    hiddenFields: {
      type: Array,
      default: () => [],
    },
    show: {
      type: Number,
      default: 5,
    },
    showFilter: {
      type: Boolean,
      default: false,
    },
    modal: {
      type: Boolean,
      default: false,
    },
    redirectTo: String
  },
  data() {
    return {
      // Your existing data
      isModalVisible: false,
      selectedProduct: null,
      pageSize: this.show,
      currentPage: 1,
      selectedFilter: "id",
      selectedProductDetails: [],
      filterValue: "",
      startDateFilter: "",
      endDateFilter: "",
      showModalComponent: false,
      placeholderImage:
        "https://b1227186.smushcdn.com/1227186/wp-content/uploads/2017/09/placeholder-600x400.png?lossy=1&strip=1&webp=1",
      // Define the fields that require date filtering
      dateFilterFields: [
        "created_at",
        "updated_at",
        "created_at",
        "created_at",
        "created_at",
        "created_at",
      ],
    };
  },
  computed: {
    filterableFields() {
      return this.products.length > 0
        ? Object.keys(this.products[0]).filter(
            (field) => !this.hiddenFields.includes(field)
          )
        : [];
    },
    tableHeaders() {
      return this.filterableFields.filter(
        (field) => !this.hiddenFields.includes(field)
      );
    },
    filteredProducts() {
      const filterValue = this.filterValue.toLowerCase();
      const startDate = new Date(this.startDateFilter);
      const endDate = new Date(this.endDateFilter);

      return this.products.filter((product) => {
        const lowerCaseField = (field) => String(product[field]).toLowerCase();

        switch (this.selectedFilter) {
          case "created_at":
          case "updated_at":
            const productDate = new Date(product[this.selectedFilter]);
            return productDate >= startDate && productDate <= endDate;
          default:
            return lowerCaseField(this.selectedFilter).includes(filterValue);
        }
      });
    },
    totalPages() {
      return Math.ceil(this.filteredProducts.length / this.pageSize);
    },
    paginatedProducts() {
      const startIndex = (this.currentPage - 1) * this.pageSize;
      return this.filteredProducts.slice(
        startIndex,
        startIndex + this.pageSize
      );
    },
  },
  methods: {
    // Function to handle product click based on modal prop
    handleProductClick(product) {
      if (this.modal) {
        this.showProductModal(product);
      } else {
        this.navigateToProductPage(product);
      }
    },
    // Function to show the modal
    showProductModal(product) {
      // Set the selected product details in the component data
      this.selectedProductDetails = JSON.stringify(product); // Adjust as needed
      // Show the modal component by updating its visibility
      this.showModalComponent = true;
    },
    // Function to navigate to another page with selected product data
    navigateToProductPage(product) {
      if(this.redirectTo == 'meus-pedidos') {
        this.$router.push(`/meus-pedidos/${product.transaction_id}`);
      } else if (this.redirectTo == 'vendas') {
        this.$router.push(`/vendas/${product.id}`);
      }
      // Assuming the target route is named 'product-details' and accepts an 'id' parameter
    },
    // Your existing methods
    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    goToPage(page) {
      this.currentPage = page;
    },
    formatField(value, field) {
      if (
        field === "price" ||
        field === "totalAmount" ||
        field === "total_amount"
      ) {
        return this.formatPrice(value);
      }
      if (field === "buyer_address" || field === "buyerAddress") {
        return `${value.street} N.º ${value.number}, ${value.city} - ${value.state}`;
      }
      if (field === "seller_address" || field === "sellerAddress") {
        return `${value.city} - ${value.state}`;
      }
      if (
        field === "created_at" ||
        field === "updated_at" ||
        field === "createdAt" ||
        field === "updatedAt"
      ) {
        return this.formatDate(value);
      }
      // Handle other fields if needed
      return value;
    },
    formatPrice(price) {
      const value = parseFloat(price);
      if (isNaN(value)) {
        // Handle invalid price
        return "";
      } else {
        return new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(value);
      }
    },
    formatFieldName(field) {
      // Format field names for better readability
      return field
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString("pt-BR", {
        day: "numeric",
        month: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
      });
    },
    isDateField(field) {
      return this.dateFilterFields.includes(field);
    },
    getProductImageUrl(images) {
      if (images && images.length > 0 && images[0].imageUrl) {
        return images[0].imageUrl;
      } else {
        return this.placeholderImage;
      }
    },
    truncateText(text) {
      const maxLength = 20; // Adjust the maximum length as needed
      return text.length > maxLength
        ? text.substring(0, maxLength) + "..."
        : text;
    },
    formatFieldValue(product, field) {
      if (field === "description") {
        return this.truncateText(product[field]);
      } else if (field === "categories") {
        return product[field]
          .map((category) => category?.categoryName || "Unknown Category")
          .join(", ");
      } else if (field === "images") {
        return ""; // Handle images separately in the modal
      } else if (field === "is_seller_verified") {
        return product[field] ? "Vendedor Verificado" : "";
      } else {
        return this.formatField(product[field], field);
      }
    },
  },
};
</script>

<style scoped>
/* Your existing styles */
</style>


<style scoped>
.product-table-container {
  margin-bottom: 54px;
  position: relative;
}

.input-filter {
  display: flex;
  align-items: center;
  justify-content: start;
  gap: 20px;
}

.not-available {
  color: #f83a53;
}

.filter-input {
  width: 300px;
  padding: 10px 15px;
  margin: 10px 0;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.filter-input:focus {
  border-color: #66afe9;
  outline: none;
  box-shadow: 0 0 8px rgba(102, 175, 233, 0.6);
}

.filter-select {
  width: 300px;
  padding: 10px 15px;
  margin: 10px 0;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: white;
  transition: border-color 0.3s, box-shadow 0.3s;
  appearance: none;
  background-image: url('data:image/svg+xml;charset=US-ASCII,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="gray"><polygon points="0,0 16,0 8,10"/></svg>');
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 10px;
}

.filter-select:focus {
  border-color: #66afe9;
  outline: none;
  box-shadow: 0 0 8px rgba(102, 175, 233, 0.6);
}

thead {
  border-bottom: 1px solid #f1f1f1;
}

.product-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 16px;
}

.product-table th,
.product-table td {
  padding: 12px;
  text-align: left;
  vertical-align: middle;
}

.product-table th {
  background-color: #f83a53;
  color: white;
  font-weight: bold;
}

.product-table tr:nth-child(even) {
  background-color: #f2f2f2;
}

.product-table tr:hover {
  background-color: #ddd;
}

.product-table td {
  border-bottom: 1px solid #ddd;
}

.product-table tr {
  cursor: pointer;
}

.product-image {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 5px;
}

.unavailable-product {
  background: #f83a53 !important;
  color: white;
}

.unavailable-product .verified-text {
  color: white;
}

.unavailable-product:hover {
  background-color: #d32f45 !important;
}

.verified-text {
  color: #21cc35;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  bottom: -54px;
  left: 50%;
  transform: translateX(-50%);
  gap: 10px;
}

.pagination button {
  padding: 8px 12px;
  border: 1px solid #ddd;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s, color 0.3s;
}

.pagination button:hover {
  background-color: #f83a53;
  color: white;
  border-color: #f83a53;
}

.pagination button.active {
  background-color: #f83a53;
  color: white;
  border: 1px solid #f83a53;
}

.pagination-button {
  padding: 8px 16px;
  background-color: #f83a53;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.pagination-button:hover {
  background-color: #d32f45 !important;
}

.pagination-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.pagination-button:disabled:hover {
  background-color: #d7d7d7 !important;
  border-color: #d7d7d7 !important;
}
</style>
