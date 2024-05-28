<template>
  <div class="checkout-container">
    <div v-if="currentStep === 'overview'" class="step">
      <!-- Step 1: Purchase Overview -->
      <h2>Step 1: Purchase Overview</h2>
      <ul class="items-list">
        <li v-for="item in items" :key="item.id" class="item">
          <span>{{ item.name }}</span>
          <span>${{ item.price }} x {{ item.quantity }}</span>
          <span>= ${{ item.price * item.quantity }}</span>
        </li>
      </ul>
      <p class="total">Total: ${{ totalPrice }}</p>
      <div class="buttons">
        <button @click="proceedToNextStep" class="btn">Next</button>
      </div>
    </div>

    <div v-else-if="currentStep === 'address'" class="step">
      <!-- Step 2: Address Selection -->
      <h2>Step 2: Address Selection</h2>
      <form @submit.prevent="proceedToNextStep" class="form">
        <label class="form-label">
          Full Name:
          <input
            type="text"
            v-model="address.fullName"
            required
            class="form-input"
          />
        </label>
        <label class="form-label">
          Street Address:
          <input
            type="text"
            v-model="address.street"
            required
            class="form-input"
          />
        </label>
        <label class="form-label">
          City:
          <input
            type="text"
            v-model="address.city"
            required
            class="form-input"
          />
        </label>
        <label class="form-label">
          State:
          <input
            type="text"
            v-model="address.state"
            required
            class="form-input"
          />
        </label>
        <label class="form-label">
          Zip Code:
          <input
            type="text"
            v-model="address.zip"
            required
            class="form-input"
          />
        </label>
        <div class="buttons">
          <button type="submit" class="btn">Next</button>
          <button type="button" @click="goToPreviousStep" class="btn secondary">
            Previous
          </button>
        </div>
      </form>
    </div>

    <div v-else-if="currentStep === 'payment'" class="step">
      <!-- Step 3: Payment Method -->
      <h2>Step 3: Payment Method</h2>
      <div class="form">
        <label class="form-label">
          <input
            type="radio"
            v-model="paymentMethod"
            value="credit-card"
            required
          />
          Credit Card
        </label>
        <label class="form-label">
          <input type="radio" v-model="paymentMethod" value="paypal" required />
          PayPal
        </label>
        <div v-if="paymentMethod === 'credit-card'" class="credit-card-form">
          <h3>Credit Card Details</h3>
          <label class="form-label">
            Card Number:
            <input
              type="text"
              v-model="creditCard.number"
              required
              class="form-input"
            />
          </label>
          <label class="form-label">
            Expiry Date:
            <input
              type="text"
              v-model="creditCard.expiry"
              required
              class="form-input"
            />
          </label>
          <label class="form-label">
            CVV:
            <input
              type="text"
              v-model="creditCard.cvv"
              required
              class="form-input"
            />
          </label>
        </div>
      </div>
      <div class="buttons">
        <button @click="proceedToNextStep" class="btn">Next</button>
        <button @click="goToPreviousStep" class="btn secondary">
          Previous
        </button>
      </div>
    </div>

    <div v-else-if="currentStep === 'shipping'" class="step">
      <!-- Step 4: Shipping -->
      <h2>Step 4: Shipping</h2>
      <div class="form">
        <label class="form-label">
          <input
            type="radio"
            v-model="shippingOption"
            value="standard"
            required
          />
          Standard Shipping
        </label>
        <label class="form-label">
          <input
            type="radio"
            v-model="shippingOption"
            value="express"
            required
          />
          Express Shipping
        </label>
      </div>
      <div class="buttons">
        <button @click="proceedToNextStep" class="btn">Next</button>
        <button @click="goToPreviousStep" class="btn secondary">
          Previous
        </button>
      </div>
    </div>

    <div v-else-if="currentStep === 'confirmation'" class="step">
      <!-- Step 5: Confirmation -->
      <h2>Step 5: Confirmation</h2>
      <p><strong>Full Name:</strong> {{ address.fullName }}</p>
      <p>
        <strong>Address:</strong> {{ address.street }}, {{ address.city }},
        {{ address.state }}, {{ address.zip }}
      </p>
      <p><strong>Payment Method:</strong> {{ paymentMethod }}</p>
      <p><strong>Shipping Option:</strong> {{ shippingOption }}</p>
      <div class="buttons">
        <button @click="confirmOrder" class="btn">Confirm Order</button>
        <button @click="goToPreviousStep" class="btn secondary">
          Previous
        </button>
      </div>
    </div>
  </div>
</template>
  
  <script setup>
import { ref, computed } from "vue";

const currentStep = ref("overview");

const items = ref([
  { id: 1, name: "Item A", price: 10, quantity: 2 },
  { id: 2, name: "Item B", price: 20, quantity: 1 },
]);

const totalPrice = computed(() =>
  items.value.reduce((total, item) => total + item.price * item.quantity, 0)
);

const address = ref({
  fullName: "",
  street: "",
  city: "",
  state: "",
  zip: "",
});

const paymentMethod = ref("");
const creditCard = ref({
  number: "",
  expiry: "",
  cvv: "",
});

const shippingOption = ref("");

const proceedToNextStep = () => {
  if (currentStep.value === "overview") {
    currentStep.value = "address";
  } else if (currentStep.value === "address") {
    currentStep.value = "payment";
  } else if (currentStep.value === "payment") {
    currentStep.value = "shipping";
  } else if (currentStep.value === "shipping") {
    currentStep.value = "confirmation";
  }
};

const goToPreviousStep = () => {
  if (currentStep.value === "address") {
    currentStep.value = "overview";
  } else if (currentStep.value === "payment") {
    currentStep.value = "address";
  } else if (currentStep.value === "shipping") {
    currentStep.value = "payment";
  } else if (currentStep.value === "confirmation") {
    currentStep.value = "shipping";
  }
};

const confirmOrder = () => {
  alert("Order Confirmed!");
  // Perform order confirmation logic here
};
</script>
  
  <style scoped>
.checkout-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.step {
  margin-bottom: 20px;
}

h2 {
  margin-bottom: 20px;
  color: #343a40;
}

.items-list {
  list-style-type: none;
  padding: 0;
}

.item {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  background: #fff;
  margin-bottom: 10px;
  border-radius: 4px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
}

.total {
  font-weight: bold;
  font-size: 1.2em;
  margin-top: 10px;
}

.form {
  display: flex;
  flex-direction: column;
}

.form-label {
  margin-bottom: 10px;
}

.form-input {
  padding: 10px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  width: 100%;
}

.buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.btn {
  padding: 10px 20px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn.secondary {
  background: #6c757d;
}

.btn:hover {
  background: #0056b3;
}

.btn.secondary:hover {
  background: #5a6268;
}

.credit-card-form {
  margin-top: 20px;
}

.credit-card-form h3 {
  margin-bottom: 10px;
}
</style>
  