import { defineStore } from "pinia";
import { ref } from "vue";

export const useCategoryStore = defineStore("category", () => {
  const categories = ref([]);
  const isCategoriesLoading = ref(false);
  const categoriesErrorr = ref(null);
  const category = ref({});
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const fetchCategories = async () => {
    isCategoriesLoading.value = true;
    try {
      const response = await fetch(apiUrl + "/api/v1/categories");
      if (response.ok) {
        const data = await response.json();
        categories.value = data.data;
      } else {
        categoriesErrorr.value = "Failed to fetch categories";
      }
    } catch (err) {
      categoriesErrorr.value = err;
    } finally {
      isCategoriesLoading.value = false;
    }
  };

  return { categories, isCategoriesLoading, categoriesErrorr, category, apiUrl, fetchCategories };
});
