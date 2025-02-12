<template>
  <div>
    <router-view></router-view>
    <teleport to="body">
      <NoPermissionModal
        :showModal="authStore.showNoPermission"
        :message="authStore.noPermissionMessage"
        @closeModal="
          {
            authStore.showNoPermission = false;
          }
        "
      ></NoPermissionModal>
    </teleport>
  </div>
</template>

<script setup>
import NoPermissionModal from "./components/user/NoPermissionModal.vue";
import { useAuthStore } from "./stores/authStore";

const authStore = useAuthStore();
</script>
