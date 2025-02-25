<template>
  <div class="container mt-2">
    <div class="d-inline mt-4">
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
    <table class="table table-bordered table-hover">
      <thead class="table-dark">
        <tr>
          <th>STT</th>
          <th>Sản phẩm</th>
          <th>Tên sản phẩm</th>
          <th>Giá</th>
          <th>Giảm giá</th>
          <th>Tồn kho</th>
          <th>Đã bán</th>
          <th>Ngày tạo</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(product, index) in products" :key="product.id" @click="handleEditProduct(product.id)">
          <td>{{ index }}</td>
          <td>
            <img :src="product.image" class="object-fit-cover" style="width: 70px; height: 70px" alt="" />
          </td>
          <td class="product-name-table">{{ product.name.length > 30 ? product.name.slice(0, 70) + "..." : product.name }}</td>
          <td class="text-center">{{ product.price }} VNĐ</td>
          <td v-if="product.discountPrice" class="text-center">${{ product.discountPrice }}</td>
          <td v-else class="text-center">-</td>
          <td class="text-center">{{ product.stock_quantity }}</td>
          <td class="text-center">{{ product.sold_quantity }}</td>
          <td class="text-center">{{ formatDate(product.createdDate) }}</td>
        </tr>
      </tbody>
    </table>

    <!-- Modal tạo sản phẩm -->
    <teleport to="body">
      <div class="modal fade" id="addProductModal" tabindex="-1" aria-labelledby="addProductModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-fullscreen">
          <div class="modal-content bg-dark text-white">
            <div class="modal-header">
              <h5 class="modal-title" id="addProductModalLabel">Thêm Sản Phẩm</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="doCreate">
                <!-- Tên sản phẩm -->
                <div class="mb-3">
                  <label for="productName" class="form-label">Tên sản phẩm</label>
                  <input type="text" class="form-control" id="productName" v-model="newProduct.name" required />
                </div>

                <!-- Giá & Giá giảm -->
                <div class="row mb-3">
                  <div class="col-2">
                    <label for="productPrice" class="form-label">Giá</label>
                    <input type="number" class="form-control" id="productPrice" v-model="newProduct.price" required />
                  </div>
                  <div class="col-2">
                    <label for="discountPrice" class="form-label">Giá giảm</label>
                    <input type="number" class="form-control" id="discountPrice" v-model="newProduct.discountPrice" />
                  </div>
                  <div class="col-2">
                    <label for="stockQuantity" class="form-label">Số lượng tồn kho</label>
                    <input type="number" class="form-control" id="stockQuantity" v-model="newProduct.stock_quantity" required />
                  </div>
                  <div class="col-2">
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

                  <div class="col-2">
                    <label for="productImage" class="form-label">Hình ảnh</label>
                    <input type="file" ref="imageInput" class="form-control" id="productImage" @change="handleFileUpload" accept="image/*" />
                  </div>
                  <div class="col-2">
                    <label for="category" class="form-label">Danh mục</label>
                    <select class="form-select" id="category" v-model="newProduct.categoryId" required>
                      <option v-for="category in categories" :key="category.id" :value="category.id">
                        {{ category.name }}
                      </option>
                    </select>
                  </div>
                </div>

                <div class="row mb-3">
                  <div class="col-8">
                    <div class="mb-3">
                      <label for="description" class="form-label">Mô tả</label>
                      <textarea class="form-control" id="description" rows="10" v-model="newProduct.descriptions"></textarea>
                    </div>
                  </div>
                  <!-- IMAGE PREVIEW -->
                  <div class="col-4"><img v-if="imagePreview" :src="imagePreview" alt="Ảnh xem trước" class="mt-2 img-thumbnail" style="max-width: 200px" /></div>
                </div>
                <!-- Mô tả sản phẩm -->
                <div class="row">
                  <div class="col-12">
                    <button type="submit" class="float-end btn btn-primary">Lưu sản phẩm</button>
                    <span class="text-success fs-6"> {{ productStoreMessage }}</span>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </teleport>
    <!-- END MODAL tạo sản phẩm-->

    <!-- Loading component-->
    <teleport to="body">
      <loading :loading="loading" :message="messageLoading"></loading>
    </teleport>
    <!-- ENDL LOADING COMPONENT-->

    <!-- EDIT MODAL -->
    <base-modal :openModal="isOpenEditModal" :typeModal="'modal-lg'" backdrop="static" keyboard="false">
      <template v-slot:header>
        <h5 class="modal-title" id="addProductModalLabel">Chỉnh sửa sản phẩm</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" @click.self="closeEditModal" aria-label="Close"></button>
      </template>
      <template v-slot>
        <form @submit.prevent="doUpdateProduct">
          <!-- Tên sản phẩm -->
          <div class="mb-3">
            <label for="productName" class="form-label">Tên sản phẩm</label>
            <input type="text" class="form-control" id="productName" v-model="productEdited.name" required />
          </div>

          <!-- Giá & Giá giảm -->
          <div class="row mb-3">
            <div class="col-4">
              <label for="productPrice" class="form-label">Giá</label>
              <input type="number" class="form-control" id="productPrice" v-model="productEdited.price" required />
            </div>
            <div class="col-4">
              <label for="discountPrice" class="form-label">Giá giảm</label>
              <input type="number" class="form-control" id="discountPrice" v-model="productEdited.discountPrice" />
            </div>
            <div class="col-4">
              <label for="stockQuantity" class="form-label">Số lượng tồn kho</label>
              <input type="number" class="form-control" id="stockQuantity" v-model="productEdited.stock_quantity" required />
            </div>
          </div>

          <div class="mb-3">
            <label class="form-label">Sản phẩm có sẵn?</label>
            <div>
              <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" id="availableYes" value="true" v-model="productEdited.available" />
                <label class="form-check-label" for="availableYes">Có</label>
              </div>
              <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" id="availableNo" value="false" v-model="productEdited.available" />
                <label class="form-check-label" for="availableNo">Không</label>
              </div>
            </div>
          </div>

          <!-- Hình ảnh sản phẩm -->
          <div class="row">
            <div class="mb-3 col-6">
              <label for="productImage" class="form-label">Hình ảnh</label>
              <input type="file" ref="imageInput" class="form-control" id="productImage" @change="handleFileUpload" accept="image/*" />
              <img v-if="imagePreview" :src="imagePreview" alt="Ảnh xem trước" class="mt-2 img-thumbnail" style="max-width: 200px" />
            </div>

            <!-- Danh mục sản phẩm -->
            <div class="mb-3 col-6">
              <label for="category" class="form-label">Danh mục</label>
              <select class="form-select" id="category" v-model="productEdited.categoryId" required>
                <option v-for="category in categories" :key="category.id" :value="category.id">
                  {{ category.name }}
                </option>
              </select>
            </div>
          </div>

          <!-- Mô tả sản phẩm -->
          <div class="mb-3">
            <label for="description" class="form-label">Mô tả</label>
            <textarea class="form-control" id="description" v-model="productEdited.descriptions"></textarea>
          </div>

          <button type="submit" class="btn rounded-0 me-2 btn-primary">Cập nhật sản phẩm</button>
          <button type="submit" class="btn rounded-0 btn-danger" @click="doDeleteProduct">Xóa sản phẩm</button>
          <span class="text-success fs-6"> {{ productStoreMessage }}</span>
        </form>
      </template>
      <template v-slot:footer> </template>
    </base-modal>
    <!-- END EDIT MODAL -->
  </div>
</template>
<script setup>
import moment from "moment";
import { storeToRefs } from "pinia";
import { computed, nextTick, onMounted, ref } from "vue";
import { useProducts } from "../../composables/useProducts";
import { useCategoryStore } from "../../stores/categoryStore";
import { useUploadStore } from "../../stores/uploadStore";
import BaseModal from "../user/BaseModal.vue";
import Loading from "../user/Loading.vue";

const useUpload = useUploadStore();
const { isUpload, uploadError, image, uploadImage, imageUrl } = storeToRefs(useUpload);

const useCategoryStores = useCategoryStore();
const { categories, fetchCategories } = storeToRefs(useCategoryStores);

const useProductsStore = useProducts();
const { products, loading, error, fetchProductByUserId, addProduct, isAddProduct, updateProduct, productStoreMessage, deleteProduct } = storeToRefs(useProductsStore);

const messageLoading = ref("Đang xử lý...");
const imagePreview = ref("https://imageplaceholder.net/200x200/eeeeee/131313?text=chua+co+hinh+anh+san+pham");

const imageInput = ref("");
const handleFileUpload = (event) => {
  const file = event.target.files[0];

  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

const newProduct = ref({
  name: "",
  price: 0,
  discountPrice: 0,
  stock_quantity: 0,
  available: true,
  image: null,
  createdBy: JSON.parse(localStorage.getItem("user"))?.id || null,
  descriptions: `<div><span class="me-4 fs-6">NAME</span><span class="fw-bold fs-6">VALUE</span></div>
  <div><span class="me-4 fs-6">NAME</span><span class="fw-bold fs-6">VALUE</span></div>
  <div><span class="me-4 fs-6">NAME</span><span class="fw-bold fs-6">VALUE</span></div>
  <div><span class="me-4 fs-6">NAME</span><span class="fw-bold fs-6">VALUE</span></div>
`,
  categoryId: 1,
});
const productEdited = ref({
  name: "",
  price: 0,
  discountPrice: 0,
  stock_quantity: 0,
  available: true,
  image: null,
  descriptions: ``,
  categoryId: 1,
});

const isOpenEditModal = ref(false);
const handleEditProduct = async (id) => {
  await useProductsStore.fetchProductById(id);

  productEdited.value = { ...useProductsStore.product };
  isOpenEditModal.value = true;
  imagePreview.value = productEdited.value.image;
};

const closeEditModal = () => {
  isOpenEditModal.value = !isOpenEditModal.value;
};

const formatDate = (date) => {
  return moment(date).format("DD/MM/YYYY");
};

const doCreate = async () => {
  useProductsStore.productStoreMessage = "Đang thêm sản phẩm...";
  await nextTick();

  await useUpload.uploadImage(imageInput.value.files[0]);
  if (imageInput.value != null) {
    newProduct.value.image = useUpload.imageUrl;
    useProductsStore.addProduct(newProduct.value);
  }
};

const doUpdateProduct = async () => {
  useProductsStore.productStoreMessage = "Đang cập nhật sản phẩm...";
  await nextTick();

  await useUpload.uploadImage(imageInput.value.files[0]);
  if (imageInput.value != null) {
    productEdited.value.image = useUpload.imageUrl;
    useProductsStore.updateProduct(productEdited.value.id, productEdited.value);
  }
};

const doDeleteProduct = async () => {
  useProductsStore.productStoreMessage = "Đang xóa sản phẩm...";
  await nextTick();

  await useProductsStore.deleteProduct(productEdited.value.id);
};

onMounted(async () => {
  await useProductsStore.fetchProductByUserId(JSON.parse(localStorage.getItem("user")).id);
  await useCategoryStores.fetchCategories();
});
</script>

<style scoped></style>
