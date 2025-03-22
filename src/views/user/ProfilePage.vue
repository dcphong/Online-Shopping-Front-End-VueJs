<template>
  <div class="container mt-4">
    <div class="row mb-3 m-0">
      <!-- Sidebar -->
      <div class="col-md-3 border-0 p-0">
        <profile-side-bar></profile-side-bar>
      </div>

      <!-- Profile Form -->
      <div class="col-md-9 border-0 p-0">
        <div class="card border-start shadow-sm p-4 rounded-0 border-0">
          <h4>
            Hồ Sơ Của: <span class="fs-3 fw-bold">{{ user?.fullName }}</span>
          </h4>
          <p class="text-muted">Quản lý thông tin hồ sơ để bảo mật tài khoản</p>

          <div class="row">
            <!-- Form thông tin user -->
            <div class="col-md-8">
              <div class="mb-3">
                <label class="form-label fw-bold">Tên đăng nhập: </label>
                <span class="form-control-plaintext d-inline ms-2 fw-normal">{{ user?.username }}</span>
              </div>

              <div class="mb-3">
                <label class="fw-bold d-inline">Tên:</label>
                <p class="form-control-plaintext d-inline ms-2">{{ user?.fullName }}</p>
              </div>

              <div class="mb-3">
                <label class="form-label fw-bold d-inline">Email</label>
                <p class="form-control-plaintext d-inline ms-2">{{ maskedEmail(user?.email) }}</p>
              </div>
              <div class="mb-3">
                <label class="form-label fw-bold d-inline">Địa chỉ</label>
                <p class="form-control-plaintext d-inline ms-2">{{ user?.address }}</p>
              </div>
              <div class="mb-3">
                <label class="form-label fw-bold d-inline">Số điện thoại</label>
                <p class="form-control-plaintext d-inline ms-2">{{ maskedPhone(user?.phone) }}</p>
              </div>

              <button class="btn btn-danger px-4 rounded-0" @click="openEditProfileModal">Thay Đổi</button>
            </div>

            <!-- Avatar -->
            <div class="col-md-4 text-center">
              <img :src="user?.photo" alt="User Avatar" class="rounded-circle img-fluid border border-secondary p-1" style="width: 120px; height: 120px; object-fit: cover" />
              <div class="mt-3">
                <input type="file" ref="fileInput" @change="handleFileChange" accept="image/*" class="d-none" />
                <button class="btn btn-outline-secondary rounded-0" @click="triggerFileInput">Chọn Ảnh</button>
                <span v-html="uploadMessage" class="text-info d-block"></span>
                <p class="text-muted mt-2">Dụng lượng file tối đa 10MB. Định dạng: .JPEG, .PNG</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <teleport to="body">
      <base-modal :openModal="isOpenEditModal" :typeModal="'modal-lg'">
        <template v-slot:header>
          <h5 class="modal-title" id="addProductModalLabel">Thay đổi hồ sơ</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" @click.self="closeEditModal" aria-label="Close"></button>
        </template>
        <template v-slot>
          <form @submit.prevent="doEditProfile">
            <div class="row mb-2">
              <div class="col-6">
                <label for="phone">Họ và Tên:</label>
                <input type="text" name="fullName" v-model="newProfile.fullName" class="form-control" />
              </div>
              <div class="col-6">
                <label for="phone">Số điện thoại:</label>
                <input type="text" name="phone" v-model="newProfile.phone" class="form-control" />
              </div>
            </div>
            <div class="row mb-2">
              <div class="col-12">
                <textarea name="address" v-model="newProfile.address" rows="5" class="form-control" id=""></textarea>
              </div>
            </div>
            <div class="float-end">
              <span class="me-2" v-html="userStoreMessage"></span>
              <button class="btn btn-warning rounded-0">Cập nhật</button>
            </div>
          </form>
        </template>
      </base-modal>
    </teleport>

    <teleport to="body">
      <loading :loading="isLoadingUserStores" :message="userStoreMessage"></loading>
    </teleport>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { nextTick, onMounted, ref } from "vue";
import BaseModal from "../../components/user/BaseModal.vue";
import Loading from "../../components/user/Loading.vue";
import ProfileSideBar from "../../components/user/ProfileSideBar.vue";
import { useUsersStore } from "../../stores/usersStore.js";

import { useUploadStore } from "../../stores/uploadStore.js";
const uploadStore = useUploadStore();
const { isUpload, uploadMessage, uploadError, uploadImage, imageUrl } = storeToRefs(uploadStore);

const useUserStores = useUsersStore();
const { fetchUserById, user, isLoadingUserStores, updateProfile, setProfilePhoto, userStoreMessage } = storeToRefs(useUserStores);

const isOpenEditModal = ref(false);
const maskedEmail = (email) => {
  if (!email) return "";
  const [user, domain] = email.split("@");
  return user.substring(0, 2) + "*******@" + domain;
};

const maskedPhone = (phone) => {
  if (!phone) return "";
  return "*******" + phone.slice(-2);
};

const newProfile = ref({
  fullName: "",
  address: "",
  phone: "",
});

const openEditProfileModal = async () => {
  await useUserStores.fetchUserById(useUserStores.user.id);
  await nextTick();

  if (useUserStores.user) {
    newProfile.value = {
      fullName: useUserStores.user.fullName,
      address: useUserStores.user.address,
      phone: useUserStores.user.phone,
    };
    isOpenEditModal.value = true;
  }
};

const closeEditModal = () => {
  isOpenEditModal.value = !isOpenEditModal.value;
};
const doEditProfile = async () => {
  useUserStores.userStoreMessage = "Đang cập nhật hồ sơ...";
  await nextTick();
  await useUserStores.updateProfile(useUserStores.user.id, newProfile.value);
};

const fileInput = ref(null);

const triggerFileInput = () => {
  fileInput.value.click();
};

const handleFileChange = async (event) => {
  const file = event.target.files[0];
  uploadStore.uploadMessage = `<span class='text-primary badge rounded-0'>Đang xử lý hình ảnh...</span>`;
  if (file) {
    await uploadStore.uploadImage(file);
    if (uploadStore.imageUrl) {
      await useUserStores.setProfilePhoto(useUserStores.user.id, uploadStore.imageUrl);
    }
  }
};

onMounted(async () => {
  await useUserStores.fetchUserById(JSON.parse(localStorage.getItem("user")).id);
});
</script>
