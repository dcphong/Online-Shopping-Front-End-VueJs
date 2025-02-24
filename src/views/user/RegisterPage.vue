<template>
  <div class="d-flex justify-content-center align-items-center mx-auto h-100 m-5">
    <form @submit.prevent="doRegister" class="card card-dark bg-white p-3 w-50 input-media">
      <div class="row">
        <div class="col-6 mb-2">
          <input type="text" v-model="newAccount.username" placeholder="Nhập username" class="form-control rounded-0 input-control-media" />
          <span class="text-danger" v-if="validateAccount.username" v-html="validateAccount.username"></span>
        </div>
        <div class="col-6 mb-2">
          <input type="phone" v-model="newAccount.phone" placeholder="Nhập số điện thoại" class="form-control rounded-0 input-control-media" />
          <span class="text-danger" v-if="validateAccount.phone" v-html="validateAccount.phone"></span>
        </div>
      </div>
      <div class="row">
        <div class="col-6 mb-2">
          <input type="email" v-model="newAccount.email" placeholder="Nhập Email" class="form-control rounded-0 input-control-media" />
          <span class="text-danger" v-if="validateAccount.email" v-html="validateAccount.email"></span>
        </div>
        <div class="col-6 mb-2">
          <input type="text" v-model="newAccount.fullName" placeholder="Nhập họ và tên" class="form-control rounded-0 input-control-media" />
          <span class="text-danger" v-if="validateAccount.fullName" v-html="validateAccount.fullName"></span>
        </div>
        <div class="col-12 mb-2">
          <textarea name="address" placeholder="Nhập địa chỉ..." v-model="newAccount.address" rows="2" cols="50" class="form-control" id=""></textarea>
          <span class="text-danger" v-if="validateAccount.address" v-html="validateAccount.address"></span>
        </div>
      </div>
      <div class="row">
        <div class="col-6 mb-3">
          <input type="password" v-model="newAccount.password" placeholder="Nhập mật khẩu" class="form-control rounded-0 input-control-media" />
          <span class="text-danger" v-if="validateAccount.password" v-html="validateAccount.password"></span>
        </div>
        <div class="col-6 mb-3">
          <input type="password" v-model="newAccount.confirmPassword" placeholder="Xác nhận mật khẩu" class="form-control rounded-0 input-control-media" />
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
    <Teleport to="body">
      <base-modal :openModal="isOpenEnterOtp" :typeModal="'modal-md'">
        <template v-slot:header>
          <h5 class="modal-title">Nhập mã OTP</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" @click.self="isOpenEnterOtp = false" aria-label="Close"></button>
        </template>
        <template v-slot>
          <form @submit.prevent="verifyOTP">
            <div class="mb-3">
              <label for="otp" class="form-label">Nhập mã OTP</label>
              <input type="text" class="form-control" id="otp" v-model="otp" />
            </div>
            <span v-html="otpMessage"></span>
            <button type="submit" class="btn btn-primary float-end rounded-0">Xác nhận</button>
          </form>
        </template>
      </base-modal>
    </Teleport>
  </div>
</template>
<script setup>
import { storeToRefs } from "pinia";
import { ref } from "vue";
import { useRouter } from "vue-router";
import BaseModal from "../../components/user/BaseModal.vue";
import Loading from "../../components/user/Loading.vue";
import { useAuthStore } from "../../stores/authStore";
import { useOtpStore } from "../../stores/OtpStore";
import { useUsersStore } from "../../stores/usersStore";

const otpStore = useOtpStore();
const { isValidOtp, receiveOtp, otpMessage, validateOtp } = storeToRefs(otpStore);

const router = useRouter();
const authStore = useAuthStore();
const { register, authMessage, isLoading } = storeToRefs(authStore);

const userStore = useUsersStore();
const { fetchUserByUsername, fetchUserByPhone, fetchUserByEmail } = storeToRefs(userStore);

const newAccount = ref({
  username: "",
  password: "",
  confirmPassword: "",
  email: "",
  phone: "",
  fullName: "",
  address: "",
});

const validateAccount = ref({
  username: "",
  password: "",
  confirmPassword: "",
  email: "",
  phone: "",
  fullName: "",
  address: "",
});

const validateInput = async () => {
  let isValid = true;
  validateAccount.value = {}; // Reset lỗi

  // Gửi request lấy dữ liệu người dùng song song
  await Promise.all([userStore.fetchUserByUsername(newAccount.value.username), userStore.fetchUserByPhone(newAccount.value.phone), userStore.fetchUserByEmail(newAccount.value.email)]);

  if (!newAccount.value.username) {
    validateAccount.value.username = "Vui lòng nhập username!";
    isValid = false;
  } else if (userStore.user && userStore.user.username === newAccount.value.username) {
    validateAccount.value.username = "Username đã tồn tại!";
    isValid = false;
  }

  if (!newAccount.value.phone) {
    validateAccount.value.phone = "Vui lòng nhập số điện thoại!";
    isValid = false;
  } else if (userStore.user && userStore.user.phone === newAccount.value.phone) {
    validateAccount.value.phone = "Số điện thoại đã được sử dụng!";
    isValid = false;
  }

  if (!newAccount.value.email) {
    validateAccount.value.email = "Vui lòng nhập email!";
    isValid = false;
  } else if (userStore.user && userStore.user.email === newAccount.value.email) {
    validateAccount.value.email = "Email đã được sử dụng!";
    isValid = false;
  }

  if (!newAccount.value.password || newAccount.value.password.length < 5) {
    validateAccount.value.password = "Mật khẩu phải có ít nhất 5 ký tự!";
    isValid = false;
  }

  if (!newAccount.value.confirmPassword) {
    validateAccount.value.confirmPassword = "Vui lòng xác nhận mật khẩu!";
    isValid = false;
  } else if (newAccount.value.confirmPassword !== newAccount.value.password) {
    validateAccount.value.confirmPassword = "Mật khẩu không khớp!";
    isValid = false;
  }

  if (!newAccount.value.fullName || newAccount.value.fullName.length < 5) {
    validateAccount.value.fullName = "Họ và tên phải có ít nhất 5 ký tự!";
    isValid = false;
  }

  if (!newAccount.value.address || newAccount.value.address.length < 20) {
    validateAccount.value.address = "Địa chỉ phải có ít nhất 20 ký tự!";
    isValid = false;
  }

  return isValid;
};

const isOpenEnterOtp = ref(false);
const otp = ref("");

const doRegister = async () => {
  if (await validateInput()) {
    isOpenEnterOtp.value = true;
    await otpStore.receiveOtp(newAccount.value.email);
  }
};

const verifyOTP = async () => {
  otpStore.otpMessage = `<span class="text-info">Đang kiểm tra mã OTP...</span>`;
  await otpStore.validateOtp(newAccount.value.email, otp.value);
  if (otpStore.isValidOtp) {
    await authStore.register(newAccount.value);
    router.push("/auth/login");
  } else {
    otpStore.otpMessage = `<span class="text-danger">Mã OTP không hợp lệ!</span>`;
  }
};
</script>

<style scoped>
.input-control-media {
  height: 50px;
}
</style>
