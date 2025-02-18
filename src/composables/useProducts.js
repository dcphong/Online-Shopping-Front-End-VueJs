import { defineStore } from "pinia";
import { reactive, ref } from "vue";

export const useProducts = defineStore("products", () => {
  const products = ref([]);
  const product = ref(null);
  const loading = ref(false);
  const error = ref(null);
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  // Fetch all products
  const fetchProducts = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await fetch(apiUrl + "/api/v1/products", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Failed to fetch products");
      products.value = await response.json();
    } catch (err) {
      error.value = err.message + " Server is not response";
    } finally {
      loading.value = false;
    }
  };

  // Fetch product by ID
  const fetchProductById = async (id) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await fetch(`${apiUrl}/api/v1/products/${id}`);
      if (!response.ok) throw new Error(`Failed to fetch product with id ${id}`);
      const data = await response.json();
      product.value = data.data;
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  const getProductsByCategoryName = (name) => {
    return products.value.filter((product) => product.categoryName == name);
  };

  const fetchProductByUserId = async (id) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await fetch(`${apiUrl}/api/v1/user/products/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error(`Failed to fetch product with id ${id}`);
      const data = await response.json();
      products.value = data.data;
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  return { products, product, loading, error, fetchProducts, fetchProductById, getProductsByCategoryName, fetchProductByUserId };
});
