<template>
  <div class="list-group shadow-sm rounded-0 h-100 bg-white">
    <div class="row border-bottom p-2">
      <div class="col-3">
        <img :src="'https://res.cloudinary.com/sof3022-image-cloudinary/image/upload/v1738852593/0GYFgvj_t6yp1z.jpg'" alt="User Avatar" class="img-fluid rounded-circle" style="height: 50px" />
      </div>
      <div class="col-9">
        <span class="fw-bold">{{ username }}</span>
        <p class="p-0 m-0">Tùy chọn <i class="bi bi-pencil-fill"></i></p>
      </div>
    </div>
    <a href="/user/profile" class="list-group-item list-group-item-action border-0"> <i class="bi bi-person-circle me-2"></i> Tài Khoản Của Tôi </a>

    <router-link to="/user/orders" class="list-group-item list-group-item-action border-0"><i class="bi bi-basket2-fill me-2"></i> Đơn hàng </router-link>
    <a href="#" class="list-group-item list-group-item-action border-0"> <i class="bi bi-key me-2"></i>Đổi mật khẩu </a>
  </div>
</template>
<script setup>
import { ref } from "vue";
const props = defineProps({
  username: {
    type: String,
    required: true,
  },
});
</script>
