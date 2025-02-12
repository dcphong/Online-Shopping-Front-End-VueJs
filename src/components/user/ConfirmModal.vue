<template>
  <div v-if="modalStore.isVisible" class="modal fade d-block" :class="{ show: modalStore.isVisible }" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Xác nhận</h5>
        </div>
        <div class="modal-body">
          <p class="fs-5" v-html="modalStore.message"></p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary" @click="close(true)">Thêm</button>
          <button type="button" class="btn btn-secondary" @click="close(false)">Đóng</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useModalStore } from "../../stores/modalStore";
const modalStore = useModalStore();

const close = (result) => {
  modalStore.closeModal(result);
};
</script>
<style scoped>
.modal {
  background: rgba(0, 0, 0, 0.055);
  display: flex;
  justify-content: center;
  padding-top: 25vh;
  align-items: center;
}
</style>
