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
        <tr v-for="product in products" :key="product.id">
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
            <span v-if="product.is_seller_verified"
              >Vendedor Verificado</span
            >
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
  
  <style scoped>
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

.verified-text ~ span, .verified-text {
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
</style>
  
  <script>
export default {
  props: {
    products: {
      type: Array,
      required: true,
    },
  },
};
</script>
  