import { defineStore } from "pinia";
import { ref } from "vue";

export const useUploadStore = defineStore("upload", () => {
  const isUpload = ref(false);
  const uploadError = ref(null);
  const image = ref(null);
  const imageUrl = ref("");
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const uploadImage = async (file) => {
    if (!file) {
      uploadError.value = "Vui lòng chọn một tệp!";
      return;
    }

    isUpload.value = true;
    uploadError.value = null;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(apiUrl + "/api/v1/cloudinary/upload/images", {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        const data = await response.json();
        image.value = data.data;
        imageUrl.value = image.value.secure_url;
      } else {
        const data = await response.json();
        uploadError.value = data.message || "Upload failed!";
      }
    } catch (err) {
      uploadError.value = err.message;
    } finally {
      isUpload.value = false;
    }
  };

  return { isUpload, uploadError, image, uploadImage, imageUrl };
});
