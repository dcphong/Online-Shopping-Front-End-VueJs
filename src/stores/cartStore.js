import { defineStore } from "pinia";

export const useCartStore = defineStore("paymentCart", {
  state: () => ({
    selectedProducts: [],
    selectedProduct: {},
  }),
  actions: {
    setSelectedProducts(products) {
      this.selectedProducts = products;
    },
    setSelectedProduct(product) {
      this.selectedProduct = product;
    },
    clearSelectedProducts() {
      this.selectedProduct = {};
      this.selectedProducts = [];
    },
  },
  getters: {
    getSelectedProducts: (state) => state.selectedProducts, // Dùng getters thay vì "returns"
  },
  persist: true,
});
