import { defineStore } from "pinia";

export const useCartStore = defineStore("cart", {
  state: () => ({
    selectedProducts: [],
  }),
  actions: {
    setSelectedProducts(products) {
      this.selectedProducts = products;
    },
    clearSelectedProducts() {
      this.selectedProducts = [];
    },
  },
  returns: {
    selectedProducts: (state) => state.selectedProducts,
    setSelectedProducts: (state) => state.setSelectedProducts,
    clearSelectedProducts: (state) => state.clearSelectedProducts,
  },
});
