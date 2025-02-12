import { defineStore } from "pinia";
import { ref } from "vue";

export const useUploadStore = defineStore("upload", () => {
  const isUpload = ref(false);
  const error = ref(null);
  const image = ref(null);
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const uploadImage = async (file) => {
    isUpload.value = true;
    error.value = null;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${apiUrl}/api/v1/cloudinary/upload/images`, {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        const data = await response.json();
        image.value = data.data;
        console.log("IMAGE VALUE: ", image.value);
      } else {
        const data = await response.json();
        error.value = data.message || "Upload failed!";
      }
    } catch (err) {
      error.value = err.message;
    } finally {
      isUpload.value = false;
    }
  };

  return { isUpload, error, image, uploadImage };
});
