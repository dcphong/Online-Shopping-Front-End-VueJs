import { defineStore } from "pinia";
import { nextTick, reactive, ref } from "vue";

export const useProducts = defineStore("products", () => {
  const products = ref([]);
  const product = ref(null);
  const loading = ref(false);
  const isAddProduct = ref(false);
  const productStoreMessage = ref("");
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

  const addProduct = async (product) => {
    loading.value = true;
    await nextTick();

    try {
      const response = await fetch(`${apiUrl}/api/v1/user/products`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      });

      if (response.ok) {
        const data = await response.json();
        products.value.push(data.data);
        productStoreMessage.value = "Thêm sản phẩm thành công";
        isAddProduct.value = true;
      }
    } catch (err) {
      error.value = err;
      productStoreMessage.value = "Thêm sản phẩm không thành công, Vui lòng thử lại sau!";
    } finally {
      loading.value = false;
    }
  };

  const updateProduct = async (id, product) => {
    loading.value = true;

    try {
      const response = await fetch(`${apiUrl}/api/v1/user/products/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      });

      if (response.ok) {
        const data = await response.json();
      }
    } catch (err) {
      productStoreMessage.value = "Cập nhật sản phẩm không thành công!";
      console.log("USE PRODUCT STORE ERROR: ", err.message);
    } finally {
      loading.value = false;
      productStoreMessage.value = "Đã cập nhật sản phẩm!";
    }
  };

  return { products, product, loading, error, fetchProducts, fetchProductById, getProductsByCategoryName, fetchProductByUserId, addProduct, isAddProduct, productStoreMessage, updateProduct };
});
