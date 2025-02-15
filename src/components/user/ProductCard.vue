<template>
  <div class="card product-card rounded-0 shadow-sm position-relative">
    <router-link :to="{ name: 'ProductDetail', params: { id: product.id } }">
      <!-- Sale Banner -->
      <div v-if="product.discountPrice" class="sale-banner position-absolute text-center">
        <img :src="'http://res.cloudinary.com/sof3022-image-cloudinary/image/upload/e_background_removal/v1739371531/sale-icon.png'" class="object-fit-cover img-fluid" alt="Sale" />
        <span class="sale-text">Sale</span>
      </div>

      <!-- Product Image -->
      <!-- <img :src="product.image" :alt="product.name" class="card-img-top product-image" /> -->
      <img
        :src="'https://res.cloudinary.com/sof3022-image-cloudinary/image/upload/v1737736178/Untitleddesign_3_9bdd2355-4632-4233-8c1d-1583308606b4_dnryfl.webp'"
        :alt="product.name"
        class="card-img-top product-image p-2"
      />
    </router-link>

    <!-- Product Details -->
    <div class="card-body text-center">
      <h5 class="card-title text-truncate" title="product.name">{{ product.name }}</h5>
      <p class="card-price text-primary float-start fs-6 fw-normal float-start">đ{{ product.price }}</p>

      <button v-if="product.available" @click="showModal(product.name, product.price)" class="btn btn-sm btn-outline-primary w-100">
        Thêm vào giỏ hàng
        <!-- ICON ADD TO CART -->
        <i class="bi bi-bag-plus-fill"></i>
        <!-- END ICON ADD TO CART -->
      </button>
      <button v-else class="btn btn-sm btn-outline-dark w-100" :disabled="!product.available">
        Hết hàng
        <!-- ICON OUT OF STOCK -->
        <i class="bi bi-bag-x-fill"></i>
        <!-- END OUT OF STOCK -->
      </button>
      <teleport to="body">
        <ConfirmModal></ConfirmModal>
      </teleport>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useModalStore } from "../../stores/modalStore";
import ConfirmModal from "./ConfirmModal.vue";

const modalStore = useModalStore();
const result = ref(null);

const showModal = async (name, price) => {
  result.value = await modalStore.openModal("Bạn có muốn thêm <strong>" + name + "</strong> vào giỏ hàng?<br> <p>Giá: <strong class='text-danger'>" + price + " </strong> VNĐ</p> ");
  if (result.value) {
    addToCart();
  }
};

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["addToCart"]);

const addToCart = () => {
  emit("addToCart", props.product);
};
</script>

<style scoped>
.product-card {
  max-width: 200px;
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease-in-out;
}

.product-card:hover {
  transform: scale(1.02);
}

.product-image {
  width: 100%;
  height: 180px;
  object-fit: cover;
  aspect-ratio: 4/3;
}

.sale-banner {
  position: absolute;
  top: 0;
  left: 75%;
  width: 50px;
  height: 50px;
}
.sale-banner img {
  width: 100%;
  height: 100%;
}
.sale-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 12px;
  font-weight: bold;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}
.card-title {
  font-size: 0.9rem;
  line-height: 1.2;
}

button:disabled {
  cursor: not-allowed;
}

@media screen and (max-width: 768px) {
}
</style>
