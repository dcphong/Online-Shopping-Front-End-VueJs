<template>
  <div class="container mt-4">
    <div class="row mb-3 m-0">
      <!-- Sidebar -->
      <div class="col-md-3 border-0 p-0">
        <profile-side-bar :username="user?.username"></profile-side-bar>
      </div>
      <div class="col-md-9 border-0 p-0">
        <div class="card border-start shadow-sm p-4 rounded-0 border-0">
          <h4>
            <span class="fs-4 fw-bold">{{ "Thay đổi mật khẩu" }}</span>
          </h4>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { onMounted, ref } from "vue";
import ProfileSideBar from "../../components/user/ProfileSideBar.vue";
import { useUsersStore } from "../../stores/usersStore";

const userStore = useUsersStore();
const { user, fetchUserById, userStoreMessage, isLoadingUserStores } = storeToRefs(userStore);

onMounted(async () => {
  const id = JSON.parse(localStorage.getItem("user")).id;
  await userStore.fetchUserById(id);
});
</script>
