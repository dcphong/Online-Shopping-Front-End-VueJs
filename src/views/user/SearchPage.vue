<template>
  <div>
    <div class="container p-2">
      <div class="row">
        <!-- BỘ LỌC TÌM KIẾM -->
        <div class="col-3 bg-light p-3">
          <p class="fs-5 fw-bold"><i class="bi bi-funnel"></i> Bộ lọc tìm kiếm</p>
          <div class="d-block mb-3">
            <span>Theo danh mục</span>
            <div class="form-check">
              <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
              <label class="form-check-label" for="flexCheckDefault">Lượt mua nhiều nhất</label>
            </div>
            <div class="form-check">
              <input class="form-check-input" type="checkbox" value="" id="flexCheckChecked" checked />
              <label class="form-check-label" for="flexCheckChecked">Còn hàng </label>
            </div>
          </div>
          <div class="d-block mb-3">
            <span>Theo Giá</span>
            <div class="form-check">
              <input class="form-check-input" type="checkbox" value="" name="locTimKiemGia" id="giaCaoNhat" />
              <label class="form-check-label" for="giaCaoNhat">Giá cao nhất</label>
            </div>
            <div class="form-check">
              <input class="form-check-input" type="checkbox" name="locTimKiemGia" value="" id="giaThapNhat" checked />
              <label class="form-check-label" for="giaThapNhat">Giá thấp nhất </label>
            </div>
            <div class="form-check">
              <input class="form-check-input" type="checkbox" name="" value="" id="" checked />
              <label class="form-check-label" for="">Đang giảm giá </label>
            </div>
          </div>
          <div class="d-block mb-3">
            <span>Theo ngày</span>
            <div class="form-check">
              <input class="form-check-input" type="checkbox" value="" id="" />
              <label class="form-check-label" for="">Ngày lâu nhất</label>
            </div>
            <div class="form-check">
              <input class="form-check-input" type="checkbox" value="" id="" checked />
              <label class="form-check-label" for="">Ngày mới nhất </label>
            </div>
          </div>
        </div>
        <!-- END BỘ LỌC TÌM KIÉM -->
        <div class="col-9 bg-light p-3 border-start">
          <span class="fs-6">
            <div v-if="isNotFoundKeyword">
              <i class="bi bi-exclamation-circle"></i><span class="text-danger"> Không tìm thấy kết quả tìm kiếm của từ khóa</span> <b>{{ route.query.search }}</b>
            </div>
            <div v-else-if="!isNotFoundKeyword">
              <i class="bi bi-exclamation-circle"></i> Kết quả tìm kiếm của từ khóa <b>{{ route.query.search }}</b>
            </div>
          </span>

          <!-- BỘ LỌC DANH SÁCH -->
          <div class="row mt-3 bg-dark-subtle p-3 align-items-center">
            <span class="col-auto">Sắp xếp theo</span>
            <div class="col d-flex gap-2">
              <input type="radio" class="btn-check" name="options" @click="sortProducts" id="option1" autocomplete="off" />
              <label class="btn btn-outline-dark" for="option1">Liên Quan</label>

              <input type="radio" class="btn-check" name="options" id="option2" autocomplete="off" />
              <label class="btn btn-outline-dark" for="option2">Bán Chạy</label>

              <input type="radio" class="btn-check" name="options" id="option3" autocomplete="off" />
              <label class="btn btn-outline-dark" for="option3">Mới Nhất</label>

              <div class="dropdown w-50">
                <button class="btn btn-outline-secondary dropdown-toggle w-100 text-start" type="button" data-bs-toggle="dropdown" aria-expanded="false">Giá</button>
                <ul class="dropdown-menu w-100 rounded-0">
                  <li><a class="dropdown-item" href="#">Thấp đến cao</a></li>
                  <li><a class="dropdown-item" href="#">Cao đến thấp</a></li>
                </ul>
              </div>
            </div>
          </div>
          <!-- END BỘ LỌC DANH SÁCH -->

          <div class="row">
            <div v-for="product in products.slice(0, 18)" :key="product.id" class="col-6 col-md-4 col-lg-3 mt-2 mb-2">
              <ProductCard :product="product" @addToCart="() => handleAddToCart(product)" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { storeToRefs } from "pinia";
import { nextTick, onMounted, ref, watchEffect } from "vue";
import { useRoute } from "vue-router";
import ProductCard from "../../components/user/ProductCard.vue";
import { useProducts } from "../../composables/useProducts";
const useProductsStore = useProducts();
const { products, productStoreMessage, loading, isNotFoundKeyword, getProductsByCategoryName, fetchProductByKeyWords } = storeToRefs(useProductsStore);

const route = useRoute();
const sortProducts = () => {
  console.log("SORT IS CLICKED");
};
watchEffect(async () => {
  if (route.query.search) {
    await useProductsStore.fetchProductByKeyWords(route.query.search);
  }
});

onMounted(async () => {
  if (route.query.search) {
    await useProductsStore.fetchProductByKeyWords(route.query.search);
  }
});
</script>
<style scoped>
.btn {
  border-radius: 0;
}
</style>
