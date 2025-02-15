import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/authStore";
import { useAuthGuard } from "./guards/useGuards";

const userRoutes = {
  path: "/",
  component: () => import("../layouts/UserLayout.vue"),
  children: [
    {
      path: "",
      name: "Home",
      component: () => import("../views/user/Home.vue"),
    },
    {
      path: "cart",
      name: "Cart",
      component: () => import("../views/user/CartPage.vue"),
    },
    {
      path: "products/:id",
      name: "ProductDetail",
      component: () => import("../views/user/ProductDetailsPage.vue"),
    },

    {
      path: "user/profile",
      name: "Profile",
      component: () => import("../views/user/ProfilePage.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "search",
      name: "Search",
      component: () => import("../views/user/SearchPage.vue"),
    },
    {
      path: "search/:key",
      name: "UserSearch",
      component: () => import("../views/user/SearchPage.vue"),
    },
    {
      path: "user/payment",
      name: "UserPayment",
      component: () => import("../views/user/PaymentDetailsPage.vue"),
    },
    {
      path: "user/orders",
      name: "UserOrders",
      meta: { requiresAuth: true },
      component: () => import("../views/user/OrdersPage.vue"),
    },
  ],
};
const adminRoutes = {
  path: "/admin",
  meta: { requiresAuth: true },
  component: () => import("../layouts/AdminLayout.vue"),
  children: [
    {
      path: "",
      name: "AdminDashboard",
      component: () => import("../components/admin/Dashboard.vue"),
    },
    {
      path: "products",
      name: "AdminProducts",
      component: () => import("../components/admin/ProductsManagement.vue"),
    },
    {
      path: "users",
      name: "AdminUsers",
      component: () => import("../components/admin/UsersManagement.vue"),
    },
    {
      path: "upload-image",
      name: "AdminUploadImage",
      component: () => import("../components/admin/UploadManagement.vue"),
    },
  ],
};
const authRoutes = {
  path: "/auth",
  component: () => import("../layouts/AuthLayout.vue"),
  children: [
    {
      path: "login",
      name: "Login",
      meta: { title: "Đăng nhập" },
      component: () => import("../views/user/LoginPage.vue"),
    },
    { path: "register", name: "Register", meta: { title: "Đăng ký" }, component: () => import("../views/user/RegisterPage.vue") },
    {
      path: "forgot",
      name: "ForgotPassword",
      meta: { title: "Quên mật khẩu" },
      component: () => import("../views/user/ForgotPasswordPage.vue"),
    },
  ],
};
const routes = [userRoutes, adminRoutes, authRoutes];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(useAuthGuard);

export default router;
