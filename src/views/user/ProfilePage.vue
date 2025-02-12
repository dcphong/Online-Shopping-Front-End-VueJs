<template>
  <div class="container mt-4">
    <div class="row mb-3 m-0">
      <!-- Sidebar -->
      <div class="col-md-3 border-0 p-0">
        <profile-side-bar :username="user?.username"></profile-side-bar>
      </div>

      <!-- Profile Form -->
      <div class="col-md-9 border-0 p-0">
        <div class="card border-start shadow-sm p-4 rounded-0 border-0">
          <h4>Hồ Sơ Của {{ user.fullName }}</h4>
          <p class="text-muted">Quản lý thông tin hồ sơ để bảo mật tài khoản</p>

          <div class="row">
            <!-- Form thông tin user -->
            <div class="col-md-8">
              <div class="mb-3">
                <label class="form-label fw-bold">Tên đăng nhập: </label>
                <span class="form-control-plaintext d-inline ms-2 fw-normal">{{ user.username }}</span>
              </div>

              <div class="mb-3">
                <label class="fw-bold d-inline">Tên:</label>
                <input type="text" class="form-control d-inline w-50 rounded-0 ms-3" v-model="user.fullName" />
              </div>

              <div class="mb-3">
                <label class="form-label fw-bold d-inline">Email</label>
                <p class="form-control-plaintext d-inline ms-2">{{ maskedEmail(user.email) }}</p>
              </div>

              <div class="mb-3">
                <label class="form-label fw-bold d-inline">Số điện thoại</label>
                <p class="form-control-plaintext d-inline ms-2">{{ maskedPhone(user.phone) }}</p>
              </div>

              <button class="btn btn-danger px-4 rounded-0">Thay Đổi</button>
            </div>

            <!-- Avatar -->
            <div class="col-md-4 text-center">
              <img
                :src="'https://res.cloudinary.com/sof3022-image-cloudinary/image/upload/v1738852593/0GYFgvj_t6yp1z.jpg'"
                alt="User Avatar"
                class="rounded-circle img-fluid border border-secondary p-1"
                style="width: 120px; height: 120px; object-fit: cover"
              />
              <div class="mt-3">
                <button class="btn btn-outline-secondary">Chọn Ảnh</button>
                <p class="text-muted mt-2">Dụng lượng file tối đa 1MB. Định dạng: .JPEG, .PNG</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import ProfileSideBar from "../../components/user/ProfileSideBar.vue";
const user = ref({});
const maskedEmail = (email) => {
  if (!email) return "";
  const [user, domain] = email.split("@");
  return user.substring(0, 2) + "*******@" + domain;
};

const maskedPhone = (phone) => {
  if (!phone) return "";
  return "*******" + phone.slice(-2);
};

onMounted(async () => {
  user.value = await JSON.parse(localStorage.getItem("user"));
});
</script>
