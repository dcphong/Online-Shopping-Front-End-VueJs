<template>
  <div>
    <Header :inforAddress="router.meta.title" :photo="user.photo"></Header>
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
import { storeToRefs } from "pinia";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import Footer from "../components/admin/Footer.vue";
import Header from "../components/admin/Header.vue";
import Sidebar from "../components/admin/Sidebar.vue";
import { useUsersStore } from "../stores/usersStore";
const userStores = useUsersStore();
const { user, fetchUserById } = storeToRefs(userStores);

const photo = ref("");

onMounted(async () => {
  photo.value = JSON.parse(localStorage.getItem("user")).photo;
  const userId = JSON.parse(localStorage.getItem("user")).id;
  await userStores.fetchUserById(userId);
});

const router = useRoute();
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
