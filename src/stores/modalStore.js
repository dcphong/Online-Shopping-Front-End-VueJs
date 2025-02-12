import { defineStore } from "pinia";
import { ref } from "vue";

export const useModalStore = defineStore("modal", () => {
  const isVisible = ref(false);
  const message = ref("");
  const resolveAction = ref(null);

  const openModal = (msg) => {
    message.value = msg;
    isVisible.value = true;
    return new Promise((resolve) => {
      resolveAction.value = resolve;
    });
  };

  const closeModal = (result) => {
    isVisible.value = false;
    if (resolveAction.value) {
      resolveAction.value(result);
      resolveAction.value(null);
    }
  };

  return { isVisible, message, openModal, closeModal };
});
