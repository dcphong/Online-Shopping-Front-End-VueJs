<!-- filepath: /d:/FPOLY_DEV/SPRING25/BLOCK1/SOF3022-JAVA-5/ASS/FRONT_END/SOF3022_FrontEnd_ASS/src/components/Toasts.vue -->
<template>
  <div id="toast-container" class="toast-container position-fixed top-0 mt-5 end-0 p-3" data-bs-autohide="false">
    <div v-for="(toast, index) in toasts" :key="index" class="toast show" role="alert" aria-live="assertive" aria-atomic="true" data-bs-autohide="false">
      <div class="toast-body">
        <p v-html="toast.value.message"></p>
        <div class="mt-2 pt-2 border-top">
          <router-link type="button" class="btn btn-success btn-sm me-2" to="/cart">Xem giỏ hàng</router-link>
          <button type="button" class="btn btn-dark btn-sm" data-bs-dismiss="toast">Đóng</button>
        </div>
        <div class="progress mt-1" role="progressbar">
          <div class="progress-bar progress-bar-striped bg-success progress-bar-animated" :style="{ width: `${toast.value.progress}%`, transition: 'width 0.5s linear' }"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watchEffect } from "vue";

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
});

const toasts = ref([]);

const addToast = (message) => {
  const toast = ref({ message: "", progress: 100 });
  toast.value.message = message;
  toast.value.progress = 100;
  toasts.value.shift();
  toasts.value.push(toast);

  const interval = setInterval(() => {
    toast.value.progress -= 5;
    if (toast.value.progress <= 0) {
      clearInterval(interval);
      toasts.value.shift();
    }
  }, 500);
};

watchEffect(() => {
  if (props.product) {
    addToast("Add <strong> " + props.product.name + " </strong> to cart successfully!");
  }
});
</script>

<style scoped>
.toast-container {
  z-index: 1055;
}

.progress-bar {
  transition: width 0.5s linear;
}
</style>
