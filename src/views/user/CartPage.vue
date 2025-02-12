<template>
  <div class="container">
    <div class="row bg-white mt-3 mb-2 p-3 text fw-lighter">
      <div class="col-6">Sản phẩm</div>
      <div class="col-2 text-end">Đơn giá</div>
      <div class="col-1 text-end">Số lượng</div>
      <div class="col-2 text-end">Số tiền</div>
      <div class="col-1">Thao tác</div>
    </div>

    <div class="">
      <div class="row bg-white pt-2 pb-2 border-bottom text fw-normal">
        <div class="col-10">Số lượng sản phẩm: {{ products.length }}</div>
        <div class="col-2">
          <button @click="removeAllProductsInCart()" class="w-100 border-0 bg-white text-decoration-underline rounded-0">Xóa hết sản phẩm</button>
        </div>
      </div>

      <div v-if="cart.items.length > 0">
        <div v-for="product in cart.items" :key="product.id" class="row product-row p-2 text">
          <div class="col-6 d-flex align-items-center" style="height: 80px">
            <img
              :src="'https://res.cloudinary.com/sof3022-image-cloudinary/image/upload/v1737736178/Untitleddesign_3_9bdd2355-4632-4233-8c1d-1583308606b4_dnryfl.webp'"
              :alt="product.name"
              class="w-25"
            />
            <p>{{ product.name }}</p>
          </div>
          <div class="col-2 text-danger d-flex align-items-center justify-content-end">{{ product.price }} VNĐ</div>
          <div class="col-1 d-flex align-items-center justify-content-end">{{ product.quantity }}</div>
          <div class="col-2 text-danger d-flex align-items-center justify-content-end">{{ product.quantity * product.price }} VNĐ</div>
          <div class="col-1 d-flex align-items-center justify-content-end">
            <button class="btn btn-outline-dark w-100 rounded-0" @click="removeProductInCart(product.id)">Xóa</button>
          </div>
        </div>
      </div>

      <div v-else>
        <div class="row bg-white pt-2 pb-2 border-bottom text fw-normal">
          <div class="col-12">Giỏ hàng trống</div>
        </div>
      </div>
    </div>

    <table class="table table-hover"></table>
  </div>
</template>

<script setup>
import { inject, onMounted, ref } from "vue";
import { useProductsInCart } from "../../composables/useProductInCart.js";

const { products, loading, error, removeProductInCart, removeAllProductsInCart, cart } = useProductsInCart();
</script>
<style scoped>
img {
  height: 100%;
  width: auto;
  object-fit: contain;
}

.col-6 {
  display: flex;
  align-items: center;
}

img.w-25 {
  max-width: 100%;
  max-height: 100%;
}
.product-row {
  background-color: white;
  transition: 0.3s ease-out;
}
.product-row:hover {
  background-color: rgba(153, 153, 153, 0.037);
  transition: background-color 0.3s ease-out;
}
</style>
