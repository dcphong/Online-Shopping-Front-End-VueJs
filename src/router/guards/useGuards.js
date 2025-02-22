// src/router/guards/useGuards.js
import { storeToRefs } from "pinia";
import { ref } from "vue";
import { useAuthStore } from "../../stores/authStore";

export function useAuthGuard(to, from, next) {
  const authStore = useAuthStore();
  const { accessToken, isExpiredToken, showNoPermission, noPermissionMessage, isRoleAdmin, isRoleManager, decodeUserRole } = storeToRefs(authStore);

  authStore.decodeUserRole();
  if (to.meta.requiresAuth && (!authStore.accessToken || isExpiredToken.value)) {
    console.log("Chặn chưa đăng nhập!");
    next({
      path: "/auth/login",
      query: { redirect: "", message: "Vui lòng đăng nhập" },
    });
  } else if (to.path.startsWith("/admin") && !authStore.isRoleManager) {
    authStore.showNoPermission = true;
    authStore.noPermissionMessage = "Bạn không có quyền truy cập trang này!";

    next(false);
  } else {
    next();
  }
}
