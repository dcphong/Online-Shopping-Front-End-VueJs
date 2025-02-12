<template>
  <div>
    <header class="auth-header bg-primary text-white p-3 d-flex justify-content-between align-items-center">
      <router-link :to="'/'" class="text-white text-decoration-none">
        <div class="logo d-flex align-items-center">
          <img src="https://cdn-icons-png.flaticon.com/512/263/263142.png" alt="Logo" class="logo-img me-2" />
          <h4 class="m-0">LÔ GÔ - {{ router.meta.title }}</h4>
        </div>
      </router-link>
      <div>
        <router-link to="/auth/login" class="text-white text-decoration-none me-3">Đăng nhập</router-link>
        <router-link to="/auth/register" class="text-white text-decoration-none">Đăng ký</router-link>
      </div>
    </header>

    <div class="">
      <router-view />
    </div>

    <footer class="auth-footer text-center p-3 bg-light h-100">
      <p class="m-0">© 2024 Shopee Clone | Designed by You</p>
    </footer>
  </div>
</template>
<script setup>
import { useRoute } from "vue-router";
const router = useRoute();
</script>
<style scoped>
.auth-header {
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}
.logo-img {
  width: 40px;
  height: 40px;
}
</style>
