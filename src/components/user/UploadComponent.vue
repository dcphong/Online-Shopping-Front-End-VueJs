<template>
  <div>
    <h1>Upload Image</h1>
    <img src="" id="image" alt="" />
    <form @submit.prevent="uploadImage" enctype="multipart/form-data">
      <input type="file" ref="fileInput" accept="image/*" name="chanphong" required />
      <button type="submit">Upload</button>
    </form>
    <span>{{ responseMessage }}</span>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";

const fileInput = ref(null);
const responseMessage = ref("");
const apiUrl = import.meta.env.VITE_API_BASE_URL;
const uploadImage = async () => {
  const file = fileInput.value.files[0];

  if (!file) {
    alert("Please select a file to upload.");
    return;
  }

  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch(apiUrl + "/api/v1/cloudinary/upload/images", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    if (response.ok) {
      responseMessage.value = `Image uploaded successfully: ${result.data}`;
    } else {
      responseMessage.value = `Error: ${result.message}`;
    }
  } catch (error) {
    responseMessage.value = `Error: ${error.message}`;
  }
};
onMounted(() => {
  const image = document.getElementById("image");
  image.src = "https://res.cloudinary.com/sof3022-image-cloudinary/image/upload/q_auto/f_auto/w_100/v1737019185/car.jpg.jpg";
});
</script>
