<template>
  <div>
    <Header></Header>
    <div class="d-flex">
      <Sidebar></Sidebar>
      <div class="content m-0 p-0">
        <router-view />
      </div>
    </div>
    <Footer></Footer>
  </div>
</template>

<script setup>
import Footer from "../components/admin/Footer.vue";
import Header from "../components/admin/Header.vue";
import Sidebar from "../components/admin/Sidebar.vue";
</script>

<style scoped>
.content {
  flex-grow: 1;
  margin-left: 60px; /* Khi Sidebar thu nhỏ */
  transition: margin-left 0.3s;
}

.open + .content {
  margin-left: 250px; /* Khi Sidebar mở rộng */
}
</style>
