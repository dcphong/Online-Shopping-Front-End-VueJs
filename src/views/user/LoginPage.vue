<template>
  <div>
    <div class="d-flex justify-content-center align-items-center mx-auto h-100 m-5">
      <div class="card card-dark bg-white p-3 w-25 input-media">
        <div class="mb-2">
          <input type="text" v-model="userLogin.username" placeholder="Nhập Email hoặc username" class="form-control input-control-media" />
        </div>
        <div class="mb-3">
          <input type="password" v-model="userLogin.password" placeholder="Nhập mật khẩu" class="form-control input-control-media" />
        </div>
        <span v-if="handleMessage" class="text-danger fs-6" v-html="handleMessage"></span>
        <div class="d-flex justify-content-between justify-content-center gap-2 mb-2">
          <button class="btn btn-outline-primary w-100 input-control-media" @click="handlerLogin()">Đăng nhập</button>
        </div>
        <div class="d-flex justify-content-between justify-content-center gap-2 mb-2">
          <button class="btn btn-outline-success w-50"><img src="https://img.icons8.com/?size=100&id=V5cGWnc9R4xj&format=png&color=000000" alt="" class="w-25" />Google</button>
          <button class="btn btn-outline-primary w-75"><img src="https://img.icons8.com/?size=100&id=118497&format=png&color=000000" class="w-25" alt="" />Facebook</button>
        </div>
        <div class="mb-3 d-flex justify-content-between">
          <router-link :to="'/auth/forgot'" class="text-decoration-underline text-info">Quên mật khẩu?</router-link>
          <router-link :to="'/auth/register'" class="text-decoration-underline text-info">Chưa có tài khoản?</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { computed, nextTick, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { useAuthStore } from "../../stores/authStore";
const userLogin = ref({
  username: "",
  password: "",
});
const authStore = useAuthStore();
const { login, user, error } = storeToRefs(authStore);
const handleMessage = ref("");

const handlerLogin = async () => {
  handleMessage.value = `<span class='text-info fs-6'>Đang đăng nhập...</span>`;
  await nextTick();
  await authStore.login(userLogin.value.username, userLogin.value.password);
};

const route = useRoute();
const loginMessage = computed(() => route.query.message);
</script>

<style scoped>
.input-control-media {
  height: 50px;
}

@media screen and (max-width: 768px) {
  .input-media {
    width: 100% !important;
    margin: 10px !important;
  }
}
</style>
