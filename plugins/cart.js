import { defineNuxtPlugin } from '#app';
import { ref, watch } from 'vue';

export default defineNuxtPlugin((nuxtApp) => {
    let initialCart = [];

    if (process.client) {
        // Initialize cart from localStorage if it exists
        initialCart = JSON.parse(localStorage.getItem('cart')) || [];
    }

    // Cart state
    const cart = ref(initialCart);

    // Method to add item to cart
    const addItem = (item) => {
        const existingItem = cart.value.find(cartItem => cartItem.id === item.id);
        if (existingItem) {
            return false; // Item already in cart
        } else {
            cart.value.push({ ...item });
            return true; // Item added to cart
        }
    };

    // Method to remove item from cart
    const removeItem = (itemId) => {
        cart.value = cart.value.filter(item => item.id !== itemId);
    };

    // Method to get the cart contents
    const getCart = () => {
        return cart.value;
    };

    // Method to update cart globally
    const updateCartGlobally = () => {
        console.log('Cart updated:', cart.value);
        // Save to localStorage if on the client side
        if (process.client) {
            localStorage.setItem('cart', JSON.stringify(cart.value));
        }
    };

    // Watch for changes in the cart and trigger the global update method
    watch(cart, () => {
        updateCartGlobally();
    }, { deep: true });

    return {
        provide: {
            cart: {
                addItem,
                removeItem,
                getCart,
                updateCartGlobally
            }
        }
    };
});
