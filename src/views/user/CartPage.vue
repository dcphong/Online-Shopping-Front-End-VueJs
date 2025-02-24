<template>
  <div class="container">
    <div class="row bg-white mt-3 mb-2 p-3 text fw-lighter">
      <div class="col-6">Sản phẩm</div>
      <div class="col-2 text-end">Đơn giá</div>
      <div class="col-1 text-end">Số lượng</div>
      <div class="col-2 text-end">Số tiền</div>
      <div class="col-1">Thao tác</div>
    </div>

    <div class="row bg-white pt-2 pb-2 border-bottom text fw-normal">
      <div class="col-10">Số lượng sản phẩm: {{ cart.items.length }}</div>
      <div class="col-2">
        <button @click="removeAllProductsInCart()" class="w-100 border-0 bg-white text-decoration-underline rounded-0">Xóa hết sản phẩm</button>
      </div>
    </div>

    <div v-if="cart.items.length > 0">
      <div v-for="(group, sellerId) in groupedCartItems" :key="sellerId" class="mb-4">
        <div class="row bg-light pt-2 pb-2 fw-bold border">
          <div class="col-10">
            🛍 Người bán: <span class="fw-normal">{{ group.fullname }}</span>
          </div>
          <div class="col-2 text-end">
            <button @click="removeAllProductsBySeller(sellerId)" class="btn btn-outline-danger btn-sm rounded-0">Xóa toàn bộ</button>
          </div>
        </div>

        <!-- Duyệt danh sách sản phẩm của người bán -->
        <div v-for="product in group.products" :key="product.id" class="row product-row pt-2 pb-2 text">
          <div class="col-6" style="height: 80px">
            <img :src="product.image" :alt="product.name" class="w-25 img-fluid" />
            <p>{{ product.name.length > 50 ? product.name.substring(0, 40) + "..." : product.name }}</p>
          </div>
          <template v-if="product.discountPrice > 0">
            <div class="col-2 text-danger d-flex align-items-center justify-content-end">
              <del class="fs-6 me-2 text-muted">{{ product.price.toLocaleString() }}</del>
              {{ product.discountPrice.toLocaleString() }}đ
            </div>
            <div class="col-1 d-flex align-items-center justify-content-end">{{ product.quantity }}</div>
            <div class="col-2 text-danger d-flex align-items-center justify-content-end">{{ (product.quantity * product.discountPrice).toLocaleString() }}đ</div>
          </template>
          <template v-else>
            <div class="col-2 text-danger d-flex align-items-center justify-content-end">{{ product.price.toLocaleString() }}đ</div>
            <div class="col-1 d-flex align-items-center justify-content-end">{{ product.quantity }}</div>
            <div class="col-2 text-danger d-flex align-items-center justify-content-end">{{ (product.quantity * product.price).toLocaleString() }}đ</div>
          </template>
          <div class="col-1 d-flex align-items-center justify-content-end">
            <button class="btn btn-outline-dark w-100 rounded-0" @click="removeProductInCart(product.id)">Xóa</button>
          </div>
        </div>

        <div class="row d-flex align-items-center justify-content-end bg-white pt-2 pb-2">
          <div class="col-12">
            <div class="w-50 float-end">
              <button class="btn btn-outline-dark w-25 rounded-0 float-end" @click="sendProductsToPayment(group.products)">Mua</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else>
      <div class="row bg-white pt-2 pb-2 border-bottom text fw-normal">
        <div class="col-12">🛒 Giỏ hàng trống</div>
      </div>
    </div>
    <div class="row d-flex align-items-center justify-content-end bg-white pt-2 pb-2">
      <div class="col-12">
        <div class="w-50 float-end">
          <button class="btn btn-outline-dark w-25 rounded-0 float-end" @click="sendProductsToPayment(cart.items)">Mua tất cả</button>
        </div>
      </div>
    </div>

    <table class="table table-hover"></table>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useProductsInCart } from "../../composables/useProductInCart.js";
import { useCartStore } from "../../stores/cartStore.js";

const router = useRouter();
const { setSelectedProducts } = useCartStore();
const { loading, error, removeProductInCart, removeAllProductsInCart, cart } = useProductsInCart();

const groupedCartItems = computed(() => {
  return cart.items.reduce((groups, product) => {
    const sellerId = product.createdBy;
    const salerFullname = product.userCreatedName;
    if (!groups[sellerId]) {
      groups[sellerId] = {
        sellerId: sellerId,
        fullname: salerFullname,
        products: [],
      };
    }
    groups[sellerId].products.push(product);
    return groups;
  }, {});
});
const removeAllProductsBySeller = (sellerId) => {
  cart.items = cart.items.filter((product) => product.createdBy !== sellerId);
};

const sendProductsToPayment = (products) => {
  const productsInLocal = JSON.parse(localStorage.getItem("cart")).items;
  const selectedProducts = productsInLocal.filter((product) => products.some((p) => p.id === product.id));
  setSelectedProducts(selectedProducts);
  router.push("/user/payment");
};
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
