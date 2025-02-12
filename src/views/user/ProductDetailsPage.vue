<template>
  <div>
    <div class="container mt-5">
      <!-- Loading Placeholder -->
      <div v-if="loading" class="text-center">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

      <!-- Error Message -->
      <div v-else-if="error" class="alert alert-danger text-center">
        {{ error }}
      </div>

      <!-- Product Details -->
      <div v-else-if="product" class="card shadow-lg p-3 mb-5 bg-body rounded">
        <div class="row g-0">
          <div class="col-md-6 d-flex align-items-center justify-content-center">
            <img
              :src="'https://res.cloudinary.com/sof3022-image-cloudinary/image/upload/v1737736178/Untitleddesign_3_9bdd2355-4632-4233-8c1d-1583308606b4_dnryfl.webp'"
              :alt="product.name"
              class="img-fluid rounded"
              style="max-height: 400px"
            />
          </div>
          <div class="col-md-6">
            <div class="card-body">
              <h1 class="card-title">{{ product.name }}</h1>
              <div class="d-block" :class="product.discountPrice ? 'bg-dark-subtle' : ''">
                <h3 class="text-danger d-inline fs-3">{{ product.price.toLocaleString() }} VNĐ</h3>
                <h3 v-if="product.discountPrice" class="text-gray d-inline mx-3 fs-4 fw-normal">
                  <del>{{ product.price.toLocaleString() }} VNĐ</del>
                </h3>
              </div>
              <p class="card-text text-muted">Ngày bán: {{ dateAfterFormated }} - Người bán: {{ sellerName }}</p>
              <p class="card-text" v-if="product.categoryName">Loại sản phẩm: {{ product.categoryName }}</p>
              <p class="card-text" v-else>Danh mục: Chưa cập nhật</p>
              <p class="fw-bold" :class="{ 'text-success': product.available, 'text-danger': !product.available }">
                {{ product.available ? "Còn hàng" : "Hết hàng" }}
              </p>
              <button :class="{ disabled: !product.available }" class="btn btn-primary w-50 rounded-0" @click="showModal(product)">{{ product.available ? "Thêm vào giỏ hàng" : "Hết hàng" }}</button>
              <router-link :to="{ name: 'UserPayment', params: { id: product.id } }" v-if="product.available" class="btn btn-success ms-2 w-25 rounded-0">{{
                product.available ? "Mua ngay" : "Hết hàng"
              }}</router-link>
            </div>
          </div>
        </div>
        <hr />
        <p class="fw-bold fs-4 m-0">Mô tả sản phẩm:</p>
        <span class="fs-5 text-muted">{{ product.descriptions }}</span>
      </div>

      <!-- Product Not Found -->
      <div v-else class="alert alert-warning text-center">
        <p>Sản phẩm không tồn tại.</p>
      </div>

      <teleport to="body">
        <Toasts v-if="showToast" :product="currentProduct" />
        <ConfirmModal></ConfirmModal>
      </teleport>
    </div>
  </div>
</template>

<script setup>
import moment from "moment";
import { computed, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import ConfirmModal from "../../components/user/ConfirmModal.vue";
import Toasts from "../../components/user/Toasts.vue";
import { useProductsInCart } from "../../composables/useProductInCart.js";
import { useProducts } from "../../composables/useProducts.js";
import { useModalStore } from "../../stores/modalStore.js";
import { useUsersStore } from "../../stores/usersStore.js";

const { user, fetchUserById } = useUsersStore();
const { loading, error, product, fetchProductById } = useProducts();
const { addToCart } = useProductsInCart();

const dateAfterFormated = computed(() => {
  return moment(product.createdDate).format("DD/MM/YYYY");
});

const route = useRoute();
const sellerName = computed(() => user.value?.fullName || "Không xác định");

const useModal = useModalStore();
const result = ref(null);
const showToast = ref(false);
const currentProduct = ref(null);

const showModal = async (product) => {
  result.value = await useModal.openModal("Bạn có muốn thêm <strong>" + product.name + "</strong> vào giỏ hàng?<br> Giá: <strong>" + product.price + "</strong> VNĐ");
  if (result.value) {
    handleAddToCart(product);
  }
};

const handleAddToCart = (product) => {
  addToCart(product);
  currentProduct.value = product;
  showToast.value = true;
};

onMounted(async () => {
  await fetchProductById(route.params.id);
  await fetchUserById(product.value.createdBy);
});
</script>

<style scoped>
.img-fluid {
  object-fit: contain;
  max-width: 100%;
}
.modal {
  background: rgba(0, 0, 0, 0.055);
  display: flex;
  justify-content: center;
  padding-top: 25vh;
  align-items: center;
}
.text-gray {
  color: gray;
}
</style>
