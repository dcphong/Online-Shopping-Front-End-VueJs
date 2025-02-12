<template>
  <div>
    <div class="card card-dark container mx-auto mt-5 p-3">
      <input type="file" class="form-control mb-3" @change="onFileChange" />
      <button @click="handleUpload" class="btn btn-info" :disabled="isUpload">Upload</button>
      <div v-if="isUpload" class="text-info">Dang upload...</div>

      <!-- Hiển thị thông báo lỗi nếu có -->
      <div v-if="error" class="alert alert-danger">{{ error }}</div>

      <!-- Hiển thị ảnh nếu upload thành công -->
      <div v-if="image">
        <img :src="image" alt="Uploaded Image" class="img-thumbnail" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useUploadStore } from "../../stores/uploadStore";

const { uploadImage, isUpload, error, image } = useUploadStore();

const file = ref(null);

const onFileChange = (event) => {
  file.value = event.target.files[0]; // Lấy file từ input
};

const handleUpload = () => {
  if (file.value) {
    uploadImage(file.value); // Gọi action uploadImage từ store
  }
};
</script>

<style scoped>
/* Thêm style tùy chỉnh */
</style>
