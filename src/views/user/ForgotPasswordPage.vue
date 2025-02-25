<template>
  <div class="d-flex justify-content-center align-items-center mx-auto h-100 m-5">
    <form @submit.prevent="receivedOtpToEmail" class="card card-dark bg-white p-3 w-25 input-media">
      <div class="mb-3 form-floating">
        <input type="username" v-model="newChange.username" placeholder="Tài khoản xác nhận..." id="accountVerify" class="form-control rounded-0" />
        <label for="accountVerify">Tài khoản</label>
        <span v-if="informMessage.username" class="text-danger d-block fs-6" v-html="informMessage.username"></span>
        <span v-if="userStoreMessage" v-html="userStoreMessage"></span>
      </div>
      <button class="btn btn-outline-primary rounded-0 w-100 input-control-media">Gửi mã xác nhận</button>
      <div class="mt-3 text-center">
        <span>Đã có tài khoản?</span>
        <router-link to="/auth/login" class="text-decoration-underline text-info"> Đăng nhập ngay</router-link>
      </div>
    </form>

    <teleport to="body">
      <base-modal :openModal="isOpenVerifyOtpModal" :typeModal="'modal-md'">
        <template v-slot:header>
          <h5 class="modal-title" id="verifyOtpModalLabel">Xác nhận OTP</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" @click.self="isOpenVerifyOtpModal = false" aria-label="Close"></button>
        </template>
        <template v-slot>
          <form @submit.prevent="doVerifyOtp" class="p-3">
            <div class="mb-2 form-floating">
              <input type="text" name="newPassword" v-model="newChange.newPassword" placeholder="Mật khẩu mới..." autocomplete="new-password" id="newPassword" class="form-control mb-2 rounded-0" />
              <label for="newPassword">Mật khẩu mới</label>
              <span v-if="informMessage.newPassword" class="text-danger d-block fs-6" v-html="informMessage.newPassword"></span>
            </div>
            <div class="mb-3 form-floating">
              <input
                type="text"
                name="newPassword"
                v-model="newChange.confirmPassword"
                placeholder="Xác nhận mật khẩu mới..."
                autocomplete="confirm-password"
                id=""
                class="form-control mb-2 rounded-0"
              />
              <label for="confirmPassword">Xác nhận mật khẩu</label>
              <span v-if="informMessage.confirmPassword" class="text-danger d-block fs-6" v-html="informMessage.confirmPassword"></span>
            </div>
            <div class="mb-3 form-floating">
              <input type="text" v-model="newChange.otp" placeholder="Mã OTP..." id="otpVerify" class="form-control rounded-0" />
              <label for="otpVerify">Mã OTP</label>
              <span v-if="informMessage.otp" class="text-danger d-block fs-6" v-html="informMessage.otp"></span>
            </div>
            <button class="btn btn-outline-primary rounded-0 w-100 input-control-media">Xác nhận</button>
          </form>
        </template>
      </base-modal>
    </teleport>

    <teleport to="body">
      <Loading :loading="isSendingOtp" :message="'Đang gửi OTP tới gmail...'" />
    </teleport>
  </div>
</template>
<script setup>
import { storeToRefs } from "pinia";
import { nextTick, ref } from "vue";
import BaseModal from "../../components/user/BaseModal.vue";
import Loading from "../../components/user/Loading.vue";
import { useOtpStore } from "../../stores/OtpStore";
import { useUsersStore } from "../../stores/usersStore";

const userStore = useUsersStore();
const { changePassword, changePasswordByForgetPassword, fetchUserByUsername, user, userStoreMessage, isLoadingUserStores } = storeToRefs(userStore);
const otpStore = useOtpStore();
const { isValidOtp, isSendingOtp, otpError, otpMessage, receiveOtp, validateOtp } = storeToRefs(otpStore);

const isOpenVerifyOtpModal = ref(false);

const newChange = ref({
  username: "",
  newPassword: "",
  confirmPassword: "",
  otp: "",
});

const informMessage = ref({
  username: "",
  newPassword: "",
  confirmPassword: "",
  otp: "",
});

const validateUsername = async () => {
  let isValid = true;
  if (newChange.value.username == "") {
    informMessage.value.username = "Tài khoản không được để trống";
    isValid = false;
  }
  await nextTick();
  return isValid;
};

const receivedOtpToEmail = async () => {
  if (await validateUsername()) {
    await userStore.fetchUserByUsername(newChange.value.username);
    if (userStore.user.email) {
      console.log("EMAIL:", userStore.user);
      await otpStore.receiveOtp(userStore.user.email);
      isOpenVerifyOtpModal.value = true;
    }
  }
};
const validateInform = async () => {
  let isValid = true;
  informMessage.value = {
    newPassword: "",
    confirmPassword: "",
    otp: "",
  };
  if (newChange.value.newPassword.length < 5) {
    informMessage.value.newPassword = "Mật khẩu phải có ít nhất 5 ký tự";
    isValid = false;
  }
  if (newChange.value.confirmPassword == "") {
    informMessage.value.confirmPassword = "Xác nhận mật khẩu không được để trống";
    isValid = false;
  }
  if (newChange.value.otp == "") {
    informMessage.value.otp = "Mã OTP không được để trống";
    isValid = false;
  }
  if (newChange.value.newPassword != newChange.value.confirmPassword) {
    informMessage.value.confirmPassword = "Mật khẩu không trùng khớp";
    isValid = false;
  }
  await nextTick();
  return isValid;
};
const doVerifyOtp = async () => {
  if (await validateInform()) {
    await otpStore.validateOtp(userStore.user.email, newChange.value.otp);
    if (otpStore.isValidOtp) {
      await userStore.changePasswordByForgetPassword(userStore.user.id, newChange.value.newPassword);
      isOpenVerifyOtpModal.value = false;
    }
  }
};
</script>
<style scoped></style>
