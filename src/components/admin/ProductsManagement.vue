<template>
  <div class="container mt-2">
    <h2 class="mb-4">Quản lý Sản phẩm</h2>

    <div class="d-inline">
      <!-- Dropdown lọc theo danh mục -->
      <div class="mb-2 m-0 p-0">
        <label for="categoryFilter" class="form-label">Lọc theo danh mục:</label>
        <select id="categoryFilter" class="form-select w-25 rounded-0">
          <option value="">Tất cả</option>
          <option v-for="category in categories" :key="category.id" :value="category.id">
            {{ category.name }}
          </option>
        </select>
      </div>

      <div class="mb-1 float-end d-inline">
        <button class="rounded-0 btn btn-success m-0" data-bs-toggle="modal" data-bs-target="#addProductModal">Tạo sản phẩm</button>
      </div>
    </div>

    <!-- Bảng danh sách sản phẩm -->
    <table class="table table-bordered">
      <thead class="table-dark">
        <tr>
          <th>ID</th>
          <th>Tên sản phẩm</th>
          <th>Giá</th>
          <th>Giảm giá</th>
          <th>Tồn kho</th>
          <th>Đã bán</th>
          <th>Ngày tạo</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in visibleProducts" :key="product.id">
          <td>{{ product.id }}</td>
          <td>{{ product.name }}</td>
          <td>${{ product.price }}</td>
          <td v-if="product.discountPrice">${{ product.discountPrice }}</td>
          <td v-else>-</td>
          <td>{{ product.stock_quantity }}</td>
          <td>{{ product.sold_quantity }}</td>
          <td>{{ formatDate(product.createdDate) }}</td>
          <td>
            <button class="btn btn-warning btn-sm me-2">Sửa</button>
            <button class="btn btn-danger btn-sm">Xóa</button>
          </td>
        </tr>
        <tr>
          <td colspan="8">
            <div class="d-flex justify-content-center gap-2">
              <button class="border-0 w-100 rounded-0 btn-info btn text-light fs-5" :class="visibleProducts.value <= 0 ? 'disabled' : ''" @click="prevProductsList()">Trở lại</button>
              <button class="border-0 rounded-0 w-100 btn-info btn text-light fs-5" :disabled="!hasMoreProducts" @click="nextProductList()">Xem thêm</button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal Thêm Sản Phẩm -->
    <!-- Modal Thêm Sản Phẩm -->
    <div class="modal modal-lg fade" id="addProductModal" tabindex="-1" aria-labelledby="addProductModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="addProductModalLabel">Thêm Sản Phẩm</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="submitProduct">
              <!-- Tên sản phẩm -->
              <div class="mb-3">
                <label for="productName" class="form-label">Tên sản phẩm</label>
                <input type="text" class="form-control" id="productName" v-model="newProduct.name" required />
              </div>

              <!-- Giá & Giá giảm -->
              <div class="row mb-3">
                <div class="col-4">
                  <label for="productPrice" class="form-label">Giá</label>
                  <input type="number" class="form-control" id="productPrice" v-model="newProduct.price" required />
                </div>
                <div class="col-4">
                  <label for="discountPrice" class="form-label">Giá giảm</label>
                  <input type="number" class="form-control" id="discountPrice" v-model="newProduct.discountPrice" />
                </div>
                <div class="col-4">
                  <label for="stockQuantity" class="form-label">Số lượng tồn kho</label>
                  <input type="number" class="form-control" id="stockQuantity" v-model="newProduct.stock_quantity" required />
                </div>
              </div>

              <!-- Trạng thái có sẵn (Available) -->
              <div class="mb-3">
                <label class="form-label">Sản phẩm có sẵn?</label>
                <div>
                  <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" id="availableYes" value="true" v-model="newProduct.available" />
                    <label class="form-check-label" for="availableYes">Có</label>
                  </div>
                  <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" id="availableNo" value="false" v-model="newProduct.available" />
                    <label class="form-check-label" for="availableNo">Không</label>
                  </div>
                </div>
              </div>

              <!-- Hình ảnh sản phẩm -->
              <div class="row">
                <div class="mb-3 col-6">
                  <label for="productImage" class="form-label">Hình ảnh</label>
                  <input type="file" class="form-control" id="productImage" @change="handleFileUpload" accept="image/*" />
                  <img v-if="imagePreview" :src="imagePreview" alt="Ảnh xem trước" class="mt-2 img-thumbnail" style="max-width: 200px" />
                </div>

                <!-- Danh mục sản phẩm -->
                <div class="mb-3 col-6">
                  <label for="category" class="form-label">Danh mục</label>
                  <select class="form-select" id="category" v-model="newProduct.categoryId" required>
                    <option v-for="category in categories" :key="category.id" :value="category.id">
                      {{ category.name }}
                    </option>
                  </select>
                </div>
              </div>

              <!-- Mô tả sản phẩm -->
              <div class="mb-3">
                <label for="description" class="form-label">Mô tả</label>
                <textarea class="form-control" id="description" v-model="newProduct.descriptions"></textarea>
              </div>

              <button type="submit" class="btn btn-primary">Lưu sản phẩm</button>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- End Modal -->
  </div>
</template>
<script setup>
import moment from "moment";
import { computed, onMounted, ref } from "vue";
import { useProducts } from "../../composables/useProducts";

const { products, loading, error, fetchProducts, addProduct } = useProducts();

const visibleCount = ref(5);
const visibleFirstCount = ref(0);
const visibleProducts = computed(() => products.value.slice(visibleFirstCount.value, visibleCount.value));
const hasMoreProducts = computed(() => {
  return visibleCount.value < products.value.length;
});

const categories = ref([
  { id: "1", name: "Electronics" },
  { id: "2", name: "Clothing" },
  { id: "3", name: "Shoes" },
]);

const newProduct = ref({
  name: "",
  price: 0,
  discountPrice: null,
  stock_quantity: 0,
  available: "true",
  image: null,
  categoryId: "",
  descriptions: "",
});

const imagePreview = ref(null);

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    newProduct.value.image = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

const submitProduct = async () => {
  const formData = new FormData();
  formData.append("name", newProduct.value.name);
  formData.append("price", newProduct.value.price);
  formData.append("discountPrice", newProduct.value.discountPrice || 0);
  formData.append("stock_quantity", newProduct.value.stock_quantity);
  formData.append("available", newProduct.value.available === "true");
  formData.append("categoryId", newProduct.value.categoryId);
  formData.append("descriptions", newProduct.value.descriptions);
  if (newProduct.value.image) {
    formData.append("image", newProduct.value.image);
  }

  await addProduct(formData);
  newProduct.value = {
    name: "",
    price: 0,
    discountPrice: null,
    stock_quantity: 0,
    available: "true",
    image: null,
    categoryId: "",
    descriptions: "",
  };
  imagePreview.value = null;
  fetchProducts();

  document.getElementById("addProductModal").classList.remove("show");
  document.body.classList.remove("modal-open");
  document.querySelector(".modal-backdrop").remove();
};

const nextProductList = () => {
  if (hasMoreProducts.value) {
    visibleCount.value += 5;
    visibleFirstCount.value += 5;
  }
};

const prevProductsList = () => {
  if (visibleFirstCount.value > 0) {
    visibleFirstCount.value -= 5;
    visibleCount.value -= 5;
  }
};

const formatDate = (date) => {
  return moment(date).format("DD/MM/YYYY");
};

onMounted(async () => {
  await fetchProducts();
});
</script>
