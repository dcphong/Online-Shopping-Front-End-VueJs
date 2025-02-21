<template>
  <div
    class="modal backdrop modal-static fade overflow-auto show d-block modal-lg"
    data-bs-backdrop="true"
    data-bs-keyboard="false"
    tabindex="-1"
    aria-labelledby="staticBackdropLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <slot name="header"></slot>
        </div>
        <div class="modal-body">
          <slot></slot>
        </div>
        <div class="modal-footer">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup></script>

<style scoped>
.modal {
  overflow: hidden;
  overflow: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.container::-webkit-scrollbar {
  display: none;
}
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
