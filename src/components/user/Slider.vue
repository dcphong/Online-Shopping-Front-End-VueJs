<template>
  <div v-if="loadingSlider" class="carousel slide p-0 m-0" data-bs-ride="carousel" id="carouselSlider">
    <div class="carousel-inner">
      <div class="carousel-item placeholder-wave product-card shadow-sm active">
        <div class="w-100 h-100 placeholder product product-image"></div>
      </div>
    </div>
  </div>
  <div v-else class="carousel slide" data-bs-ride="carousel" id="carouselSlider">
    <div class="carousel-inner">
      <div class="carousel-item active">
        <img src="https://imageplaceholder.net/1600x320/eeeeee/131313?text=hinh+anh+1" alt="" class="d-block w-100" />
      </div>
      <div class="carousel-item">
        <img src="https://imageplaceholder.net/1600x320/eeeeee/131313?text=hinh+anh+2" alt="" class="d-block w-100" />
      </div>
      <div class="carousel-item">
        <img src="https://imageplaceholder.net/1600x320/eeeeee/131313?text=hinh+anh+3" alt="" class="d-block w-100" />
      </div>
      <button class="carousel-control-prev" type="button" data-bs-target="#carouselSlider" data-bs-slide="prev">
        <span class="carousel-contorl-prev-icon" arial-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
      </button>
      <button class="carousel-control-next" type="button" data-bs-target="#carouselSlider" data-bs-slide="next">
        <span class="carousel-next-icon" arial-hidden="true"></span>
        <span class="visually-hidden">Next</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
const loadingSlider = ref(false);
</script>
<style scoped>
.product-card {
  max-width: 1600; /* Giảm kích thước */
  height: 170px;
  position: relative;
  overflow: hidden;
}

.product-image {
  height: 300px; /* Gọn chiều cao ảnh */
  object-fit: cover;
  border-bottom: 1px solid #ddd;
}
</style>
