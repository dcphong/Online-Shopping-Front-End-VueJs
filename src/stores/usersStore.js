import { defineStore } from "pinia";
import { nextTick, ref } from "vue";

export const useUsersStore = defineStore("users", () => {
  const isLoading = ref(false);
  const usersStoreError = ref(null);
  const users = ref([]);
  const user = ref(null);
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const fetchAllUsers = async () => {
    isLoading.value = true;
    usersStoreError.value = null;
    try {
      const response = await fetch(apiUrl + "/api/v1/users");
      if (response.ok) {
        const data = await response.json();
        users.value = data.data;
      } else {
        usersStoreError.value = "Failed to fetch users";
      }
    } catch (err) {
      usersStoreError.value = err.message;
    } finally {
      isLoading.value = false;
      await nextTick();
    }
  };

  const fetchUserById = async (id) => {
    isLoading.value = true;
    usersStoreError.value = null;
    try {
      const response = await fetch(`${apiUrl}/api/v1/users/${id}`);
      if (response.ok) {
        const data = await response.json();
        user.value = data.data;
      } else {
        usersStoreError.value = "Failed to fetch user with id: " + id;
      }
    } catch (err) {
      usersStoreError.value = err.message;
    } finally {
      isLoading.value = false;
    }
  };

  return { isLoading, usersStoreError, users, user, fetchAllUsers, fetchUserById };
});
