<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark p-2 m-0">
      <div class="container-fluid">
        <!-- Logo -->
        <a class="navbar-brand" href="#">
          <img class="img-fluid img-logo" src="http://res.cloudinary.com/sof3022-image-cloudinary/image/upload/q_auto/f_auto/v1739116181/LOGOSHOP-MINI.png" alt="" />
        </a>

        <div>
          <span class="text-white fs-3">{{ inforAddress }}</span>
        </div>

        <!-- Nút toggle cho mobile -->
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarHeader" aria-controls="navbarHeader" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>

        <!-- Nội dung Navbar -->
        <div class="collapse navbar-collapse d-flex justify-content-end" id="navbarHeader">
          <!-- Thanh tìm kiếm -->
          <!-- <form class="d-flex ms-auto my-2 my-lg-0">
            <input class="form-control me-2" type="search" placeholder="Tìm kiếm" aria-label="Search" />
            <button class="btn btn-outline-light" type="submit">Tìm</button>
          </form> -->

          <!-- Icon và Dropdown -->
          <ul class="navbar-nav ms-3 mb-2 mb-lg-0">
            <!-- <li class="nav-item me-3">
              <a class="nav-link position-relative" href="#">
                <i class="bi bi-bell"></i>
                <span class="position-absolute top-0 start-100 mt-3 translate-middle badge rounded-pill bg-danger">
                  3
                  <span class="visually-hidden">Thông báo mới</span>
                </span>
              </a>
            </li>

            <li class="nav-item me-3">
              <a class="nav-link" href="#">
                <i class="bi bi-envelope"></i>
              </a>
            </li> -->

            <!-- Dropdown người dùng -->
            <li class="nav-item dropdown">
              <button class="nav-link btn dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                <img :src="photo" alt="" class="rounded-circle object-fit-cover" width="30" height="30" />
              </button>

              <ul class="dropdown-menu dropdown-menu-end m-0">
                <!-- <li><a class="dropdown-item" href="#">Thông tin cá nhân</a></li>
                <li><a class="dropdown-item" href="#">Cài đặt</a></li> -->
                <li><router-link :to="'/'" class="dropdown-item">Kênh người mua</router-link></li>
                <li><hr class="dropdown-divider" /></li>
                <li><button class="dropdown-item" @click="logout()">Đăng xuất</button></li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </div>
</template>
<script setup>
import { onMounted, ref } from "vue";
import { useAuthStore } from "../../stores/authStore";
const { logout } = useAuthStore();
const user = ref(null);
onMounted(async () => {
  const getUser = await JSON.parse(localStorage.getItem("user"));
  user.value = getUser;
});

const props = defineProps({
  inforAddress: String,
  photo: String,
});
</script>

<style scoped>
.nav-brand {
  width: 50px;
}
.img-logo {
  width: 50px;
}
</style>
