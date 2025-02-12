<template>
  <div class="">
    <div
      v-if="showModal"
      class="modal modal-static backdrop fade show"
      id="staticBackdrop"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      tabindex="-1"
      aria-labelledby="staticBackdropLabel"
      aria-hidden="true"
      style="display: block"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="staticBackdropLabel">Thông báo</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" @click="closeModal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p class="text-danger">{{ message }}</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="closeModal">Close</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { watch } from "vue";
const props = defineProps({
  showModal: {
    type: Boolean,
    required: true,
  },
  message: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["closeModal"]);

const closeModal = () => {
  emit("closeModal");
};

watch(
  () => props.showModal,
  (newValue) => {
    if (!newValue) {
      emit("closeModal");
    }
  }
);
</script>
<style scoped>
.backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5); /* Độ mờ nền */
  z-index: 1040; /* Bootstrap dùng 1040 */
}
</style>
