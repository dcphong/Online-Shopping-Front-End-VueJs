<template>
  <div class="list-group shadow-sm rounded-0 h-100 bg-white">
    <div class="row border-bottom p-2">
      <div class="col-3">
        <img :src="user?.photo" alt="User Avatar" class="img-fluid rounded-circle" style="height: 50px" />
      </div>
      <div class="col-9">
        <span class="fw-bold">{{ user?.username }}</span>
        <p class="p-0 m-0">Tùy chọn <i class="bi bi-pencil-fill"></i></p>
      </div>
    </div>
    <router-link to="/user/profile" class="btn btn-dark rounded-0 list-group-item list-group-item-action border-0"> <i class="bi bi-person-circle me-2"></i> Tài Khoản Của Tôi </router-link>

    <router-link to="/user/orders" class="btn btn-dark rounded-0 list-group-item list-group-item-action border-0"><i class="bi bi-basket2-fill me-2"></i> Đơn hàng </router-link>
    <button @click="openChangePasswordModal" class="btn btn-dark rounded-0 list-group-item list-group-item-action border-0"><i class="bi bi-key me-2"></i>Đổi mật khẩu</button>

    <!--  NHẬP MẬT KHẨU MỚI -->
    <teleport to="body">
      <base-modal :openModal="isOpenChangePasswordModal" :typeModal="'modal-md'">
        <template #header>
          <h5 class="modal-title" id="addProductModalLabel">Đổi mật khẩu</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" @click.self="isOpenChangePasswordModal = false" aria-label="Close"></button>
        </template>
        <template #default>
          <form @submit.prevent="doChangePassword">
            <div class="mb-2">
              <label for="oldPassword" class="form-label">Mật khẩu cũ</label>
              <input type="password" name="oldPassword" placeholder="Nhập vào mật khẩu cũ..." v-model="newPassword.oldPassword" autocomplete="current-password" class="form-control" />
            </div>
            <div class="mb-2">
              <label for="newPassword" class="form-label">Mật khẩu mới</label>
              <input type="password" name="newPassword" placeholder="Nhập vào mật khẩu mới..." v-model="newPassword.newPassword" autocomplete="new-password" class="form-control" />
            </div>
            <div class="mb-2">
              <label for="confirmPassword" class="form-label">Xác nhận mật khẩu</label>
              <input type="password" name="confirmPassword" placeholder="Xác nhận mật khẩu mới..." v-model="newPassword.confirmPassword" autocomplete="new-password" class="form-control" />
            </div>
            <span v-if="checkStatusMessage" class="me-2" v-html="checkStatusMessage == 'VALID_PASSWORD' ? '' : checkStatusMessage"></span>
            <button class="btn btn-outline-info mt-2 mb-2 float-end rounded-0" type="submit">Đổi mật khẩu</button>
          </form>
        </template>
      </base-modal>
    </teleport>
    <!-- END NHẬP MẬT KHẨU MỚI -->

    <!-- NHẬP EMAIL -->
    <teleport to="body">
      <base-modal :openModal="isOpenEnterEmailModal" :typeModal="'modal-md'">
        <template v-slot:header>
          <h5 class="modal-title" id="addProductModalLabel">Nhập Email</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" @click.self="isOpenEnterEmailModal = false" aria-label="Close"></button>
        </template>
        <template v-slot>
          <form @submit.prevent="sendOTP">
            <label for="email" class="form-label">Email</label> <input type="email" class="form-control" placeholder="Nhập email nhận OTP..." id="email" v-model="email" />
            <button type="submit" class="btn btn-outline-primary mt-3 float-end rounded-0">Nhận OTP</button>
          </form>
        </template>
      </base-modal>
    </teleport>

    <teleport to="body">
      <base-modal :openModal="isOpenCheckingOTPModal" :typeModal="'modal-md'">
        <template v-slot:header>
          <h5 class="modal-title" id="addProductModalLabel">Nhập OTP</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" @click.self="isOpenCheckingOTPModal = false" aria-label="Close"></button>
        </template>
        <template v-slot>
          <form @submit.prevent="checkingOtp">
            <label for="otp" class="form-label">OTP</label> <input type="text" class="form-control" placeholder="Nhập OTP..." id="otp" v-model="otp" />
            <span v-if="otpMessage" v-html="otpMessage"></span>
            <button type="submit" @click="resendOtp" class="btn btn-outline-success opacity mt-3 float-end rounded-0">Xác nhận</button>
            <button :class="isWaitingResendOtp ? 'disabled' : ''" class="btn btn-outline-dark mt-3 me-2 float-end rounded-0" @click="sendOTP">
              Gửi lại OTP {{ waitingTime > 0 ? waitingTime : "" }}
            </button>
          </form>
        </template>
      </base-modal>
    </teleport>

    <teleport to="body">
      <loading :loading="isSendingOtp" :message="otpMessage"></loading>
    </teleport>
    <teleport to="body">
      <loading :loading="isChangingPassword" :message="'Đang đổi mật khẩu...'"></loading>
    </teleport>
  </div>
</template>
<script setup>
import { storeToRefs } from "pinia";
import { nextTick, onMounted, ref } from "vue";
import { useOtpStore } from "../../stores/OtpStore.js";
import { useUsersStore } from "../../stores/usersStore.js";
import BaseModal from "./BaseModal.vue";
import Loading from "./Loading.vue";

const otpStore = useOtpStore();
const { isSendingOtp, otpError, otpMessage, receiveOtp, validateOtp, isValidOtp } = storeToRefs(otpStore);
const useUserStores = useUsersStore();
const { userStoreMessage, user, checkValidPasswordNewChange, checkStatusMessage, isChangingPassword, changePassword } = storeToRefs(useUserStores);

const isOpenChangePasswordModal = ref(false);
const isOpenEnterEmailModal = ref(false);
const isOpenCheckingOTPModal = ref(false);
const isWaitingResendOtp = ref(false);
const waitingTime = ref(60);

const newPassword = ref({
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
});
const email = ref("");
const otp = ref("");
const openChangePasswordModal = () => {
  isOpenChangePasswordModal.value = true;
};

const timer = ref(null);

const doChangePassword = async () => {
  useUserStores.userStoreMessage = "Đang kiểm tra mật khẩu...";
  await useUserStores.checkValidPasswordNewChange(useUserStores.user.id, newPassword.value);
  await nextTick();
  if (useUserStores.checkStatusMessage === "VALID_PASSWORD") {
    isOpenEnterEmailModal.value = true;
    isOpenChangePasswordModal.value = false;
  }
};

const sendOTP = async () => {
  isOpenEnterEmailModal.value = false;
  isOpenCheckingOTPModal.value = true;
  waitingTime.value = 60;
  isWaitingResendOtp.value = true;
  clearInterval(timer.value);
  timer.value = setInterval(() => {
    if (waitingTime.value > 0) {
      waitingTime.value -= 1;
    } else {
      clearInterval(timer);
      isWaitingResendOtp.value = false;
    }
  }, 1000);
  await otpStore.receiveOtp(email.value);
  await nextTick();
};

const checkingOtp = async () => {
  await otpStore.validateOtp(email.value, otp.value);
  await nextTick();
  if (otpStore.isValidOtp) {
    await useUserStores.changePassword(useUserStores.user.id, newPassword.value);
  }
};

const resendOtp = async () => {
  await otpStore.receiveOtp(email.value);
};

const closeCheckingOtpModal = () => {
  clearInterval(timer.value);
  isOpenCheckingOTPModal.value = false;
};

onMounted(async () => {
  await useUserStores.fetchUserById(JSON.parse(localStorage.getItem("user")).id);
});
</script>
