<template>
  <div>
    <div class="card card-dark container mx-auto mt-5 p-3">
      <input type="file" class="form-control mb-3" @change="onFileChange" />
      <button @click="handleUpload" class="btn btn-info" :disabled="isUpload">Upload</button>
      <div v-if="isUpload" class="text-info">Dang upload...</div>

      <div v-if="error" class="alert alert-danger">{{ error }}</div>

      <div v-if="image">
        <img :src="image" alt="Uploaded Image" class="img-thumbnail" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useUploadStore } from "../../stores/uploadStore";

const { uploadImage, isUpload, error, image, imageUrl } = useUploadStore();

const file = ref(null);

const onFileChange = (event) => {
  file.value = event.target.files[0];
};

const handleUpload = async () => {
  if (file.value) {
    await uploadImage(file.value);
  }
};
</script>

<style scoped></style>
