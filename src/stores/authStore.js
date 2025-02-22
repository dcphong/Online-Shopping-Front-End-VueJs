import { jwtDecode } from "jwt-decode";

import { defineStore } from "pinia";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useProductsInCart } from "../composables/useProductInCart";

export const useAuthStore = defineStore("auth", () => {
  const { cart } = useProductsInCart();
  const user = ref(null);
  const error = ref(null);
  const isLoading = ref(false);
  const accessToken = ref(localStorage.getItem("accessToken") || null);
  const refreshToken = ref(localStorage.getItem("refreshToken") || null);
  const router = useRouter();
  const role = ref(null);
  const isRoleUser = ref(false);
  const isRoleAdmin = ref(false);
  const isRoleManager = ref(false);
  const isExpiredToken = ref(false);
  const showNoPermission = ref(false);
  const noPermissionMessage = ref("");
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const login = async (username, password) => {
    try {
      isLoading.value = true;
      const response = await fetch(apiUrl + "/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        accessToken.value = data.accessToken;
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        localStorage.setItem("user", JSON.stringify(data.user));
        const savedUrl = router.currentRoute.value.query.redirect || "/";
        decodeUserRole();
        user.value = JSON.parse(localStorage.getItem("user"));
        router.push(router.currentRoute.value.query.redirect || "/");
      } else {
        error.value = "Dang nhap khong hop le";
      }
    } catch (err) {
      error.value = err;
    } finally {
      isLoading.value = false;
    }
  };
  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("cart");
    localStorage.removeItem("orderDetails");
    localStorage.removeItem("user");
    user.value = null;
    accessToken.value = null;
    role.value = null;
    isRoleAdmin.value = false;
    isRoleManager.value = false;
    isRoleUser.value = false;
    router.push("/auth/login");
  };

  const decodeUserRole = () => {
    if (!accessToken.value || typeof accessToken.value !== "string") {
      console.warn("Token không hợp lệ hoặc không tồn tại!");
      return;
    }

    try {
      const decodeToken = jwtDecode(accessToken.value);
      role.value = decodeToken.roles;
      if (role.value.includes("ROLE_ADMIN")) {
        isRoleAdmin.value = true;
      }
      if (role.value.includes("ROLE_USER")) {
        isRoleUser.value = true;
      }
      if (role.value.includes("ROLE_MANAGER")) {
        isRoleManager.value = true;
      }
    } catch (error) {
      console.error("Lỗi khi giải mã JWT:", error);
      logout();
    }
  };

  const isTokenExpired = async (token) => {
    try {
      const response = await fetch(`${apiUrl}/api/v1/auth/validateToken`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          accessToken: token,
        }),
      });

      if (response.ok) {
        console.log("IS VALID TOKEN: ", response.data);
        isValidToken.value = true;
      }
    } catch (err) {
      error.value = err;
    }
  };

  const initAuth = () => {
    const userInLocal = JSON.parse(localStorage.getItem("user"));
    isTokenExpired(accessToken.value);
    if (userInLocal && !isExpiredToken.value) {
      user.value = userInLocal;
      decodeUserRole();
    }
  };

  initAuth();
  return { accessToken, user, isRoleManager, error, isLoading, login, logout, isRoleAdmin, isRoleUser, decodeUserRole, showNoPermission, noPermissionMessage, isExpiredToken };
});
