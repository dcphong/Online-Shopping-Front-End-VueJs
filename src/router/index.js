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
    {
      path: "user/changePassword",
      name: "UserChangePassword",
      meta: { requiresAuth: true },
      component: () => import("../views/user/ChangedPasswordPage.vue"),
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
      meta: { title: "Dashboard" },
      component: () => import("../components/admin/Dashboard.vue"),
    },
    {
      path: "products",
      name: "AdminProducts",
      meta: { title: "Quản lý sản phẩm" },
      component: () => import("../components/admin/ProductsManagement.vue"),
    },
    {
      path: "users",
      name: "AdminUsers",
      meta: { title: "Trang quản trị người dùng" },
      component: () => import("../components/admin/UsersManagement.vue"),
    },
    {
      path: "upload-image",
      name: "AdminUploadImage",
      meta: { title: "Trang upload" },
      component: () => import("../components/admin/UploadManagement.vue"),
    },
    {
      path: "orders",
      name: "AdminOrdersManagement",
      meta: { title: "Quản lý đơn hàng" },
      component: () => import("../components/admin/OrdersManagement.vue"),
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

router.beforeEach((to, from, next) => useAuthGuard(to, from, next));

export default router;
