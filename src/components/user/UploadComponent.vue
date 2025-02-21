<template>
  <div>
    <h1>Upload Image</h1>
    <form @submit.prevent="handleUpload" enctype="multipart/form-data">
      <input type="file" ref="imageFile" required />
      <button type="submit">Upload</button>
      <span v-if="isUpload" class="text-info">Đang upload</span>
    </form>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { onMounted, ref } from "vue";
import { useUploadStore } from "../../stores/uploadStore";

const useUpload = useUploadStore();
const { isUpload, imageUrl, error, image, uploadImage } = storeToRefs(useUpload);

const imageFile = ref(null);

const handleUpload = () => {
  console.log("UPLOAD API IS CALLED!");
  if (imageFile.value && imageFile.value.files.length > 0) {
    console.log("File đã chọn: ", imageFile.value.files[0]);
    // useUpload.uploadImage(imageFile.value.files[0]);
    console.log(imageUrl);
  } else {
    console.error("Chưa chọn file!");
  }
};
</script>
