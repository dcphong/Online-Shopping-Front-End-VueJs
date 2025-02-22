<template>
  <div>
    <div class="card card-dark container mx-auto mt-5 p-3">
      <input type="file" ref="imageInput" class="form-control mb-3" @change="onFileChange" />
      <button @click="handleUpload" class="btn btn-info" :disabled="isUpload">Upload</button>
      <div v-if="isUpload" class="text-info">Dang upload...</div>

      <div v-if="uploadError" class="alert alert-danger">{{ uploadError }}</div>

      <img :src="imagePreview" alt="Uploaded Image" class="img-thumbnail" />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useUploadStore } from "../../stores/uploadStore";

const { uploadImage, isUpload, uploadError, image, imageUrl } = useUploadStore();

const imageInput = ref("");
const imagePreview = ref("");
const onFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

const handleUpload = async () => {
  if (!imageInput.value.files[0]) {
    uploadError.value = "Vui lòng chọn một tệp!";
    return;
  }
  await uploadImage(imageInput.value.files[0]);
};
</script>

<style scoped></style>
