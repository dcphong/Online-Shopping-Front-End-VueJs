<template>
  <div class="d-flex justify-content-center align-items-center mx-auto h-100 m-5">
    <form @submit.prevent="doRegister" class="card card-dark bg-white p-3 w-50 input-media">
      <div class="row">
        <div class="col-6 mb-2">
          <input type="text" required v-model="newAccount.username" placeholder="Nhập username" class="form-control rounded-0 input-control-media" />
          <span class="text-danger" v-if="validateAccount.username" v-html="validateAccount.username"></span>
        </div>
        <div class="col-6 mb-2">
          <input type="phone" required v-model="newAccount.phone" placeholder="Nhập số điện thoại" class="form-control rounded-0 input-control-media" />
          <span class="text-danger" v-if="validateAccount.phone" v-html="validateAccount.phone"></span>
        </div>
      </div>
      <div class="row">
        <div class="col-6 mb-2">
          <input type="email" required v-model="newAccount.email" placeholder="Nhập Email" class="form-control rounded-0 input-control-media" />
          <span class="text-danger" v-if="validateAccount.email" v-html="validateAccount.email"></span>
        </div>
        <div class="col-6 mb-2">
          <input type="text" required v-model="newAccount.fullName" placeholder="Nhập họ và tên" class="form-control rounded-0 input-control-media" />
          <span class="text-danger" v-if="validateAccount.fullName" v-html="validateAccount.fullName"></span>
        </div>
        <div class="col-12 mb-2">
          <textarea name="address" required placeholder="Nhập địa chỉ..." v-model="newAccount.address" rows="2" cols="50" class="form-control" id=""></textarea>
          <span class="text-danger" v-if="validateAccount.address" v-html="validateAccount.address"></span>
        </div>
      </div>
      <div class="row">
        <div class="col-6 mb-3">
          <input type="password" required v-model="newAccount.password" placeholder="Nhập mật khẩu" class="form-control rounded-0 input-control-media" />
          <span class="text-danger" v-if="validateAccount.password" v-html="validateAccount.password"></span>
        </div>
        <div class="col-6 mb-3">
          <input type="password" required v-model="newAccount.confirmPassword" placeholder="Xác nhận mật khẩu" class="form-control rounded-0 input-control-media" />
          <span class="text-danger" v-if="validateAccount.confirmPassword" v-html="validateAccount.confirmPassword"></span>
        </div>
      </div>
      <button type="submit" class="btn btn-outline-primary rounded-0 w-100 input-control-media">Đăng ký</button>
      <div class="mt-3 text-center">
        <span>Đã có tài khoản?</span>
        <router-link to="/auth/login" class="text-decoration-underline text-info"> Đăng nhập ngay</router-link>
        <div class="mt-1" v-html="authMessage + '...'"></div>
      </div>
    </form>
    <teleport to="body">
      <Loading :loading="isLoading" :message="'Đang xử lý đăng ký...'" />
    </teleport>
  </div>
</template>
<script setup>
import { storeToRefs } from "pinia";
import { ref } from "vue";
import { useRouter } from "vue-router";
import Loading from "../../components/user/Loading.vue";
import { useAuthStore } from "../../stores/authStore";
const router = useRouter();
const authStore = useAuthStore();
const { register, authMessage, isLoading } = storeToRefs(authStore);

import { useUsersStore } from "../../stores/usersStore";
const userStore = useUsersStore();
const { fetchUserByUsername, fetchUserByPhone, fetchUserByEmail, user } = storeToRefs(userStore);

const newAccount = ref({
  username: "",
  password: "",
  confirmPassword: "",
  email: "",
  phone: "",
  fullName: "",
  address: "",
});

const isValidAccount = ref(true);

const validateAccount = ref({
  username: "",
  password: "",
  confirmPassword: "",
  email: "",
  phone: "",
  fullName: "",
  address: "",
});

const doRegister = async () => {
  if (newAccount.value.username) {
    await userStore.fetchUserByUsername(newAccount.value.username);
    if (userStore.user.username == newAccount.value.username) {
      validateAccount.value.username = `<span class='text-danger fs-6'>Username đã tồn tại!</span>`;
      isValidAccount.value = false;
      userStore.user = null;
    }
  } else {
    isValidAccount.value = false;

    validateAccount.value.username = `<span class='text-danger fs-6'>Vui lòng nhập username!</span>`;
  }

  if (newAccount.value.phone) {
    await userStore.fetchUserByPhone(newAccount.value.phone);
    if (userStore.user.phone == newAccount.value.phone) {
      validateAccount.value.phone = `<span class='text-danger fs-6'>Số điện thoại đã được sử dụng!</span>`;
      isValidAccount.value = false;

      userStore.user = null;
    }
  } else {
    isValidAccount.value = false;

    validateAccount.value.phone = `<span class='text-danger fs-6'>Vui lòng nhập số điện thoại!</span>`;
  }

  if (newAccount.value.email) {
    await userStore.fetchUserByEmail(newAccount.value.email);
    if (userStore.user.email == newAccount.value.email) {
      validateAccount.value.email = `<span class='text-danger fs-6'>Email đã được sử dụng!</span>`;
      isValidAccount.value = false;
      userStore.user = null;
    }
  } else {
    isValidAccount.value = false;

    validateAccount.value.email = `<span class='text-danger fs-6'>Vui lòng nhập email!</span>`;
  }

  if (newAccount.value.confirmPassword) {
    if (newAccount.value.confirmPassword != newAccount.value.password) {
      validateAccount.value.confirmPassword = `<span class='text-danger fs-6'>Mật khẩu không khớp!</span>`;
      isValidAccount.value = false;
    }
  } else {
    isValidAccount.value = false;

    validateAccount.value.confirmPassword = `<span class='text-danger fs-6'>Vui lòng xác nhận mật khẩu!</span>`;
  }

  if (newAccount.value.fullName.length < 5) {
    isValidAccount.value = false;
    validateAccount.value.fullName = `<span class='text-danger fs-6'>Vui lòng nhập tên lớn hơn 5 kí tự!</span>`;
  }

  if (newAccount.value.address.length < 20) {
    isValidAccount.value = false;
    validateAccount.value.address = `<span class='text-danger fs-6'>Vui lòng nhập địa chỉ lớn hơn 20 kí tự!</span>`;
  }

  if (newAccount.value.password.length < 5) {
    isValidAccount.value = false;
    validateAccount.value.password = `<span class='text-danger fs-6'>Vui lòng nhập mật khẩu lớn hơn 5 kí tự!</span>`;
  }

  if (isValidAccount.value) {
    await authStore.register(newAccount.value);
    router.push("/auth/login");
  }
};
</script>
<style scoped>
.input-control-media {
  height: 50px;
}
</style>
