<template>
  <div class="product-table-container">
    <table class="product-table">
      <thead>
        <tr>
          <th>Product Name</th>
          <th>Price</th>
          <th>Condition</th>
          <th>Categories</th>
          <th>Image</th>
          <th>Seller Verified</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in displayedProducts" :key="product.id">
          <td>{{ product.name }}</td>
          <td>R$ {{ product.price }}</td>
          <td :class="product.product_condition.toLowerCase()">
            {{ product.product_condition }}
          </td>
          <td>
            <ul>
              <li
                v-for="category in product.categories"
                :key="category?.category_id"
              >
                {{ category?.categoryName || "Unknown Category" }}
              </li>
            </ul>
          </td>
          <td>
            <img
              :src="
                product.images[0]?.imageUrl ||
                'https://b1227186.smushcdn.com/1227186/wp-content/uploads/2017/09/placeholder-600x400.png?lossy=1&strip=1&webp=1'
              "
              alt="Product Image"
              class="product-image"
            />
          </td>
          <td class="verified-text">
            <nuxt-icon v-if="product.is_seller_verified" name="verified" />
            <span v-if="product.is_seller_verified">Vendedor Verificado</span>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="pagination">
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
  </div>
</template>

<script>
export default {
  props: {
    products: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      pageSize: 5, // Number of products per page
      currentPage: 1, // Current page
    };
  },
  computed: {
    // Calculate total number of pages based on number of products and page size
    totalPages() {
      return Math.ceil(this.products.length / this.pageSize);
    },
    // Calculate the subset of products to display based on current page
    displayedProducts() {
      const startIndex = (this.currentPage - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      return this.products.slice(startIndex, endIndex);
    },
  },
  methods: {
    // Go to previous page
    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    // Go to next page
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    // Go to a specific page
    goToPage(page) {
      this.currentPage = page;
    },
  },
};
</script>

<style lang="scss" scoped>
.product-table-container {
  min-height: 485px; /* Adjust this value according to your needs */
  position: relative;
}
.product-table {
  width: 100%;
  border-collapse: collapse;
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

.product-image {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 5px;
}

.verified-text ~ span,
.verified-text {
  color: #21cc35;
}

.product-condition.new {
  color: #8cd995;
  font-weight: bold;
}

.product-condition.usado {
  color: #fec171;
  font-weight: bold;
}

.product-condition.semi-new {
  color: #70a9ff;
  font-weight: bold;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  gap: 10px;
  span {
    width: 32px;
    aspect-ratio: 1 / 1;
    display: flex;
    align-items: center;
    justify-content: center;
    button {
      width: 100%;
      height: 100%;
      border: 1px solid #cacaca;
      cursor: pointer;
      border-radius: 3px;
      transition: all .2s linear;
      &.active {
        background-color: #f83a53;
        border-color: #f83a53;
        color: white;
        &:hover {
          background-color: #f83a53;
          border-color: #f83a53;
          color: white;
        }
      }
      &:hover {
        background-color: #f83a53;
        border-color: #f83a53;
        color: white;
      }
    }
  }
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
  background-color: #d32f45;
}

.pagination-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.active {
  background-color: #d32f45;
}
</style>
