<template>
  <div class="container">
    <!-- SLIDER -->
    <div class="row mt-3">
      <div class="col-12 col-lg-8">
        <Slider></Slider>
      </div>
      <div class="col-lg-4 col-12">
        <div class="row">
          <img src="https://imageplaceholder.net/1600x320/eeeeee/131313?text=Banner+1" alt="" class="d-block w-100" />
        </div>
        <div class="row">
          <img src="https://imageplaceholder.net/1600x320/eeeeee/131313?text=Banner+2" alt="" class="d-block w-100" />
        </div>
      </div>
    </div>
    <!-- END SLIDER -->

    <!-- PRODUCT LIST -->
    <div class="home mt-2 mb-2">
      <!-- Skeleton Loader -->
      <div v-if="loading" class="row mt-3">
        <div v-for="n in 18" :key="n" class="col-6 col-md-4 col-lg-2 mb-3 mt-3">
          <div class="card product-card shadow-sm">
            <div class="placeholder-wave">
              <div class="placeholder card-img-top product-image"></div>
            </div>
            <div class="card-body text-center">
              <h5 class="card-title placeholder-wave">
                <span class="placeholder col-8"></span>
              </h5>
              <p class="card-price placeholder-wave">
                <span class="placeholder col-4"></span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Product List -->
      <div v-else-if="error" class="alert alert-danger">{{ error }}</div>
      <div v-else class="row">
        <span class="fs-3 fw-bold">Tất cả sản phẩm</span>
        <div v-for="product in products.slice(0, 18)" :key="product.id" class="col-6 col-md-4 col-lg-2 mb-3 mt-3">
          <ProductCard :product="product" @addToCart="() => handleAddToCart(product)" />
        </div>

        <span class="fs-3 fw-bold">Thiết bị điện tử:</span>
        <div v-for="product in productElectronics" :key="product.id" class="col-6 col-md-4 col-lg-2 mb-3 mt-3">
          <ProductCard :product="product" @addToCart="() => handleAddToCart(product)" />
        </div>
      </div>
      <!-- Toasts -->
      <Toasts v-if="showToast" :product="currentProduct" />
    </div>
    <!-- END PRODUCT LIST -->
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import ProductCard from "../../components/user/ProductCard.vue";
import Slider from "../../components/user/Slider.vue";
import Toasts from "../../components/user/Toasts.vue";
import { useProductsInCart } from "../../composables/useProductInCart.js";
import { useProducts } from "../../composables/useProducts.js";

const { products, loading, error, fetchProducts, getProductsByCategoryName } = useProducts();
const { addToCart } = useProductsInCart();

const productElectronics = ref(null);

onMounted(async () => {
  await fetchProducts();
  productElectronics.value = getProductsByCategoryName("Electronics");
});

const showToast = ref(false);
const currentProduct = ref(null);

const handleAddToCart = (product) => {
  currentProduct.value = product;
  addToCart(product);
  showToast.value = true;
};
</script>

<style scoped>
.product-card {
  max-width: 200px; /* Giảm kích thước */
  max-height: 300px;
  position: relative;
  overflow: hidden;
  border-radius: 8px;
}

.product-image {
  height: 180px; /* Gọn chiều cao ảnh */
  object-fit: cover;
  border-bottom: 1px solid #ddd;
}

.card-title {
  font-size: 0.9rem;
  margin-bottom: 0.3rem;
}

.card-price {
  font-size: 1rem;
  font-weight: bold;
  margin: 0.3rem 0;
}
.home {
  background-color: white;
  padding: 5px;
}

@media screen and (max-width: 768px) {
}
</style>
