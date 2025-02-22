import { defineStore } from "pinia";
import { nextTick, ref } from "vue";

export const useUsersStore = defineStore("users", () => {
  const isLoadingUserStores = ref(false);
  const usersStoreError = ref(null);
  const users = ref([]);
  const user = ref({});
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const userStoreMessage = ref("");
  const fetchAllUsers = async () => {
    isLoadingUserStores.value = true;
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
      isLoadingUserStores.value = false;
      await nextTick();
    }
  };

  const fetchUserById = async (id) => {
    isLoadingUserStores.value = true;
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
      isLoadingUserStores.value = false;
    }
  };

  const updateProfile = async (id, data) => {
    userStoreMessage.value = "<span class='text-warning'>Đang cập nhật thông tin...</span>";
    isLoadingUserStores.value = true;
    try {
      const response = await fetch(`${apiUrl}/api/v1/user/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const data = await response.json();
        user.value = data.data;
      }
    } catch (err) {
      console.log("UPDATE ERROR:", err);
      userStoreMessage.value = "<span class='text-danger'>Đã xảy ra lỗi khi cập nhật t thông tin! </span>";
    } finally {
      isLoadingUserStores.value = false;
      userStoreMessage.value = "<span class='text-sucess'>Cập nhật thông tin thành công!</span>";
    }
  };

  return { isLoadingUserStores, usersStoreError, users, user, fetchAllUsers, fetchUserById, updateProfile, userStoreMessage };
});
