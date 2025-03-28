import { defineStore } from "pinia";
import { computed, reactive, ref } from "vue";
export const useProductsInCart = defineStore("cartInLocal", () => {
  const cart = reactive({
    items: JSON.parse(localStorage.getItem("cart"))?.items || [],
  });

  const productsInCartNumber = computed(() => {
    return cart.items.length;
  });

  const addToCart = (product) => {
    const existsProduct = cart.items.find((item) => item.id == product.id);
    if (existsProduct) {
      existsProduct.quantity++;
    } else {
      cart.items.push({ ...product, quantity: 1 });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
  };

  const products = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const removeProductInCart = (id) => {
    cart.items = cart.items.filter((product) => product.id != id);
    localStorage.setItem("cart", JSON.stringify(cart.items));
  };

  const removeAllProductsInCart = () => {
    cart.items = [];
    localStorage.setItem("cart", JSON.stringify(cart.items));
  };

  return { cart, productsInCartNumber, addToCart, products, loading, error, removeAllProductsInCart, removeProductInCart };
});
