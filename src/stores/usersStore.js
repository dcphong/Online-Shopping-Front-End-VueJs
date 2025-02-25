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
  const fetchAllUsers = async (role, page, size, key, direction) => {
    isLoadingUserStores.value = true;
    usersStoreError.value = null;
    if (role == 0) role = "";
    else if (role == 1) role = "ROLE_USER";
    else if (role == 2) role = "ROLE_ADMIN";
    else if (role == 3) role = "ROLE_MANAGER";
    try {
      const response = await fetch(`${apiUrl}/api/v1/users?role=${role}&page=${page}&size=${size}&key=${key}&direction=${direction}`);
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
    try {
      const response = await fetch(`${apiUrl}/api/v1/users/search/username?username=${encodeURIComponent(username)}`);
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
    console.log("PHONE:", phone);
    isLoadingUserStores.value = true;
    usersStoreError.value = null;
    try {
      const response = await fetch(`${apiUrl}/api/v1/users/search/phone?phone=${encodeURIComponent(phone)}`);
      if (response.ok) {
        const data = await response.json();
        user.value = data.data;
        console.log("USER PHONE VALUE:", user.value);
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
    console.log("EMAIL:", email);
    isLoadingUserStores.value = true;
    usersStoreError.value = null;
    try {
      const response = await fetch(`${apiUrl}/api/v1/users/search/email?email=${encodeURIComponent(email)}`);
      if (response.ok) {
        const data = await response.json();
        user.value = data.data;
        console.log("USER EMAIL VALUE:", user.value);
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

  const changePasswordByForgetPassword = async (id, password) => {
    isChangingPassword.value = true;
    const formData = new URLSearchParams();
    formData.append("password", password);
    try {
      const response = await fetch(`${apiUrl}/api/v1/forget-password/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      });
      if (response.ok) {
        const data = await response.json();
        userStoreMessage.value = `<span class='text-success'>${data.message}</span>`;
      }
    } catch (err) {
      console.log("ERROR WHEN CHANGE PASSWORD BY FORGET PASSWORD: ", err.message);
      userStoreMessage.value = `<span class='text-danger'>Đã có lỗi xảy ra vui lòng thử lại sau!</span>`;
    } finally {
      isChangingPassword.value = false;
    }
  };

  const changeUserAvailableStatus = async (id) => {
    isLoadingUserStores.value = true;
    try {
      await fetch(`${apiUrl}/api/v1/admin/user/locked/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "Content-Type": "application/json",
        },
      });
    } catch (err) {
      console.log("ERROR WHEN CHANGE USER STATUS: ", err.message);
    } finally {
      isLoadingUserStores.value = false;
    }
  };

  const setProfilePhoto = async (id, photo) => {
    isLoadingUserStores.value = true;
    const formData = new URLSearchParams();
    formData.append("photo", photo);
    try {
      const response = await fetch(`${apiUrl}/api/v1/user/change-profile-photo/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      });

      if (response.ok) {
        console.log("SET PROFILE PHOTO SUCCESS");
        user.value.photo = photo;
      } else {
        console.log("SET PROFILE PHOTO FAILED", response);
      }
    } catch (err) {
      console.log("ERROR WHEN SET PROFILE PHOTO: ", err.message);
    } finally {
      isLoadingUserStores.value = false;
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
    changePasswordByForgetPassword,
    isChangingPassword,
    fetchUserByUsername,
    fetchUserByPhone,
    fetchUserByEmail,
    setProfilePhoto,
    changeUserAvailableStatus,
  };
});
