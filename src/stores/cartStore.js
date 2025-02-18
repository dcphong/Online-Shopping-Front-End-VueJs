import { defineStore } from "pinia";

export const useCartStore = defineStore("cart", {
  state: () => ({
    selectedProducts: [],
    selectedProduct: {},
  }),
  actions: {
    setSelectedProducts(products) {
      this.selectedProducts = products;
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
