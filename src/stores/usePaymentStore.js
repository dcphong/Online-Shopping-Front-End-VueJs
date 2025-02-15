import { defineStore } from "pinia";
import { ref } from "vue";

export const usePayment = defineStore("payment", () => {
  const products = ref([]);
  const isOrderedLoading = ref(false);
  const paymentError = ref(null);
  const user = ref(JSON.parse(localStorage.getItem("user")) || {});
});
