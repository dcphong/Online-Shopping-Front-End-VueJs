import { defineStore } from "pinia";
import { nextTick, ref } from "vue";

export const useUsersStore = defineStore("users", () => {
  const isLoadingUserStores = ref(false);
  const usersStoreError = ref(null);
  const users = ref([]);
  const user = ref({});
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const userStoreMessage = ref("");
  const checkStatusMessage = ref("");
  const isChangingPassword = ref(false);
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

  const fetchUserByUsername = async (username) => {
    isLoadingUserStores.value = true;
    usersStoreError.value = null;
    const formData = new URLSearchParams();
    formData.append("username", username);
    try {
      const response = await fetch(`${apiUrl}/api/v1/users/search/username`, {
        method: "GET",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      });
      if (response.ok) {
        const data = await response.json();
        user.value = data.data;
      } else {
        usersStoreError.value = "Failed to fetch user with username: " + username;
      }
    } catch (err) {
      usersStoreError.value = err.message;
    } finally {
      isLoadingUserStores.value = false;
    }
  };
  const fetchUserByPhone = async (phone) => {
    isLoadingUserStores.value = true;
    usersStoreError.value = null;
    const formData = new URLSearchParams();
    formData.append("phone", phone);
    try {
      const response = await fetch(`${apiUrl}/api/v1/users/search/phone`, {
        method: "GET",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      });
      if (response.ok) {
        const data = await response.json();
        user.value = data.data;
      } else {
        usersStoreError.value = "Failed to fetch user with phone: " + phone;
      }
    } catch (err) {
      usersStoreError.value = err.message;
    } finally {
      isLoadingUserStores.value = false;
    }
  };

  const fetchUserByEmail = async (email) => {
    isLoadingUserStores.value = true;
    usersStoreError.value = null;
    const formData = new URLSearchParams();
    formData.append("email", email);
    try {
      const response = await fetch(`${apiUrl}/api/v1/users/search/email`, {
        method: "GET",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      });
      if (response.ok) {
        const data = await response.json();
        user.value = data.data;
      } else {
        usersStoreError.value = "Failed to fetch user with email: " + email;
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

  const checkValidPasswordNewChange = async (id, password) => {
    isLoadingUserStores.value = true;
    try {
      const response = await fetch(`${apiUrl}/api/v1/user/check-valid-password/${id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(password),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.status == "INCORRECT_OLD_PASSWORD") {
          checkStatusMessage.value = `<span class='text-danger fs-6'>Mật khẩu cũ không chính xác</span>`;
        }
        if (data.status == "INCORRECT_CONFIRM_PASSWORD") {
          checkStatusMessage.value = `<span class='text-danger fs-6'>Mật khẩu xác nhận không trùng khớp!</span>`;
        }
        if (data.status == "VALID_PASSWORD") {
          checkStatusMessage.value = data.status;
        }
      } else {
        userStoreMessage.value = `<span class='text-danger fs-6'>Dữ liệu gặp sự cố... vui lòng thử lai sau ít phút</span>`;
        console.log(checkStatusMessage.value);
      }
    } catch (error) {
      userStoreMessage.value = `<span class='text-danger fs-6'> Đã có lỗi xảy ra vui lòng thử lại sau!</span>`;
      console.log("ERROR:", error.message);
    } finally {
      isLoadingUserStores.value = false;
    }
  };

  const changePassword = async (id, password) => {
    isChangingPassword.value = true;
    try {
      const response = await fetch(`${apiUrl}/api/v1/user/change-password/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(password),
      });

      if (response.ok) {
        userStoreMessage.value = `<span class='text-success'>Đã cập nhật mật khẩu!</span>`;
      }
    } catch (err) {
      console.log("ERROR WHEN CHANGE PASSWORD: ", err.message);
    } finally {
      isChangingPassword.value = false;
    }
  };

  return {
    isLoadingUserStores,
    usersStoreError,
    users,
    user,
    fetchAllUsers,
    fetchUserById,
    updateProfile,
    userStoreMessage,
    checkStatusMessage,
    checkValidPasswordNewChange,
    changePassword,
    isChangingPassword,
    fetchUserByUsername,
    fetchUserByPhone,
    fetchUserByEmail,
  };
});
