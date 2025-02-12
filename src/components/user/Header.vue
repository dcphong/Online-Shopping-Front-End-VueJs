<template>
  <div class="row bg-black text-white sticky-top p-0 m-0">
    <span class="ps-5 address">Hotline: 0899 966 591 - 0795 491 421 * Tư vấn build PC: 0899966591 * Địa chỉ: CS1: 86A Phan Thiết - Bình Thuận CS2: 68A Mũi Né T.Bình Thuận - TP.Phan Thiết</span>
    <nav class="navbar navbar-expand-lg bg-dark-subtle p-0">
      <div class="container-fluid">
        <router-link to="/" href="" class="navbar-brand fs-3">
          <img src="http://res.cloudinary.com/sof3022-image-cloudinary/image/upload/q_auto/f_auto/v1739116181/LOGOSHOP-MINI.png" class="m-0 img-fixed-quality" alt="" />
        </router-link>

        <button class="navbar-toggler m-2" data-bs-toggle="collapse" data-bs-target="#navbarNavAlt">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarNavAlt">
          <div class="navbar-nav w-100">
            <router-link to="/" class="nav-link hover-effect fs-5">Trang chủ</router-link>

            <div class="dropdown">
              <button class="nav-link hover-effect dropdown-toggle m-0" data-bs-toggle="dropdown">Loại sản phẩm</button>
              <ul class="dropdown-menu dropdown-menu-dark rounded-0 rounded-bottom-1 m-0">
                <li>
                  <routerLink to="search" class="dropdown-item">Điện tử</routerLink>
                  <routerLink to="search" class="dropdown-item">Lap top</routerLink>
                  <routerLink to="search" class="dropdown-item">Thời trang</routerLink>
                </li>
              </ul>
            </div>
            <router-link to="/admin" class="nav-link admin-link-redirect fs-6">Kênh quản trị</router-link>

            <!-- SEARCH -->
            <form :action="'/search'" role="search" class="d-flex search w-50 ms-auto">
              <input class="form-control rounded-end-0 inputSearch" id="search" v-model="searchValue" name="search" type="search" placeholder="Nhập..." />
              <button @click="search" class="btn btn-outline-success rounded-start-0 inputSearch btnSearch">Tìm kiếm</button>
            </form>
            <!-- END SEARCH -->

            <div role="profile" class="d-flex profile ms-auto me-2">
              <!-- CART-->
              <button class="btn btn-primary cartBtn w-100 me-3 loginBtn position-relative" @click="showCart">
                Giỏ hàng <i class="bi bi-cart-check"></i>
                <span class="position-absolute top-0 start-100 translate-middle rounded-pill bg-danger badge text-bg-secondary">{{ productsInCartNumber }}</span>
                <div class="position-absolute top-100 end-0 border border-dark p-0 m-0 bg-white">
                  <table class="table-hover table" :style="isShowCart ? 'display: block' : 'display: none'" style="width: 400px">
                    <tr v-if="!cart.items.length > 0" class="border-bottom-0 text-black">
                      <td class="text-center" v-html="'Giỏ hàng rỗng'"></td>
                    </tr>
                    <tr class="" v-else v-for="(product, index) in cart.items.slice(0, 5)" :key="index">
                      <td class="p-0 m-0 w-25 border-bottom-0">
                        <img
                          :src="'https://res.cloudinary.com/sof3022-image-cloudinary/image/upload/q_auto/f_auto/v1737736178/Untitleddesign_3_9bdd2355-4632-4233-8c1d-1583308606b4_dnryfl.webp'"
                          :alt="'product image'"
                          class="w-50 float-start"
                        />
                      </td>
                      <td class="p-0 m-0 w-50 border-bottom-0">
                        <p class="fs-6 text-start">{{ product.name }}</p>
                      </td>
                      <td class="p-0 m-0 w-50 border-bottom-0">
                        <p class="fs-6 text-start">{{ product.price }} VNĐ</p>
                      </td>
                    </tr>
                  </table>
                  <router-link class="btn btn-dark border-top-1 border-end-0 border-start-0 border-bottom-0 rounded-0 w-100" :style="isShowCart ? 'display: block' : 'display: none'" to="/cart"
                    >Xem tất cả...</router-link
                  >
                </div>
              </button>
              <!-- END CART -->

              <!-- PROFILE -->
              <router-link v-if="!user" to="/auth/login" class="btn btn-outline-dark loginBtn">Đăng nhập</router-link>

              <div v-else class="dropdown">
                <button class="dropdown-toggle btn btn-outline-dark loginBtn text-truncate" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">{{ user.username }}</button>
                <ul class="dropdown-menu dropdown-menu-end" style="margin-top: -8px" aria-labelledby="dropdownMenuButton">
                  <li>
                    <button class="dropdown-item disabled text-black">
                      Username: <span class="text-success">{{ user.username }}</span>
                    </button>
                  </li>
                  <li><router-link class="dropdown-item" to="/user/profile">Hồ sơ</router-link></li>
                  <li><router-link class="dropdown-item" to="/user/orders">Đơn hàng</router-link></li>
                  <li><button class="dropdown-item" @click="logout()">Đăng xuất</button></li>
                </ul>
              </div>
              <!-- END PROFILE -->
            </div>
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { inject, onMounted, reactive, ref, watchEffect } from "vue";
import { useRouter } from "vue-router";
import { useProductsInCart } from "../../composables/useProductInCart";
import { useAuthStore } from "../../stores/authStore";
const { productsInCartNumber, cart } = useProductsInCart();
const { logout, user } = useAuthStore();
const router = useRouter();
const token = ref(null);
const isShowCart = ref(false);
const searchValue = ref(null);
const showCart = () => {
  isShowCart.value = !isShowCart.value;
};
</script>

<style>
.hover-effect:hover {
  background-color: #aaaaaa;
  color: white;
}
.admin-link-redirect:hover {
  background-color: #aaaaaa !important;
  color: rgb(36, 38, 162) !important;
  font-style: italic;
  transition: 1.5 ease-in-out;
}
.admin-link-redirect {
  color: rgb(0, 0, 0);
}
.nav-link {
  height: 70px !important;
  line-height: 50px !important;
}
.inputSearch,
.loginBtn {
  margin-top: 20px;
  height: 40px !important;
  margin-bottom: 10px;
}
.btnSearch {
  width: 110px !important;
}
.loginBtn,
.cartBtn {
  width: 112px !important;
}
.img-fixed-quality {
  width: 50px !important;
}
@media screen and (max-width: 768px) {
  .search {
    margin-bottom: 5px;
    width: 100% !important;
  }
  .nav-link {
    font-size: 18px !important;
    height: 55px !important;
  }
  .address {
    display: none;
  }
  .loginBtn {
    margin-bottom: 5px;
  }
  .btnSearch {
    margin-top: 20px;
    margin-right: 5px;
    width: 70px !important;
    height: 40px !important;
  }
}
</style>
