<template>
  <div class="container-fluid p-4">
    <h1 class="mb-4">Dashboard</h1>

    <!-- Các thẻ thống kê -->
    <div class="row mb-4">
      <!-- Thẻ: Tổng Sản Phẩm -->
      <div class="col-md-3 mb-3">
        <div class="card text-white bg-primary h-100">
          <div class="card-body">
            <h5 class="card-title">Tổng Sản Phẩm</h5>
            <p class="card-text display-4">
              <template v-if="loading">
                <span class="placeholder placeholder-lg placeholder-wave col-6"></span>
              </template>
              <template v-else>
                {{ totalProducts }}
              </template>
            </p>
          </div>
        </div>
      </div>
      <!-- Thẻ: Sản Phẩm Còn Hàng -->
      <div class="col-md-3 mb-3">
        <div class="card text-white bg-success h-100">
          <div class="card-body">
            <h5 class="card-title">Sản Phẩm Còn Hàng</h5>
            <p class="card-text display-4">
              <template v-if="loading">
                <span class="placeholder placeholder-lg placeholder-wave col-6"></span>
              </template>
              <template v-else>
                {{ availableProducts }}
              </template>
            </p>
          </div>
        </div>
      </div>
      <!-- Thẻ: Hết Hàng -->
      <div class="col-md-3 mb-3">
        <div class="card text-white bg-warning h-100">
          <div class="card-body">
            <h5 class="card-title">Hết Hàng</h5>
            <p class="card-text display-4">
              <template v-if="loading">
                <span class="placeholder placeholder-lg placeholder-wave col-6"></span>
              </template>
              <template v-else>
                {{ outOfStock }}
              </template>
            </p>
          </div>
        </div>
      </div>
      <!-- Thẻ: Sản Phẩm Giảm Giá -->
      <div class="col-md-3 mb-3">
        <div class="card text-white bg-danger h-100">
          <div class="card-body">
            <h5 class="card-title">Sản Phẩm Giảm Giá</h5>
            <p class="card-text display-4">
              <template v-if="loading">
                <span class="placeholder placeholder-lg placeholder-wave col-6"></span>
              </template>
              <template v-else>
                {{ discountedProducts }}
              </template>
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">Danh Sách Sản Phẩm</div>
      <div class="card-body">
        <table class="table table-hover align-middle">
          <thead class="table-light">
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Ảnh</th>
              <th scope="col">Tên Sản Phẩm</th>
              <th scope="col">Giá</th>
              <th scope="col">Giá Giảm</th>
              <th scope="col">Tồn Kho</th>
              <th scope="col">Đã Bán</th>
              <th scope="col">Danh Mục</th>
            </tr>
          </thead>
          <tbody>
            <template v-if="loading">
              <tr v-for="n in 5" :key="n">
                <td>
                  <span class="placeholder col-6"></span>
                </td>
                <td>
                  <span class="d-block rounded bg-secondary placeholder-wave" style="width: 50px; height: 50px"></span>
                </td>
                <td>
                  <span class="placeholder col-8"></span>
                </td>
                <td>
                  <span class="placeholder col-6"></span>
                </td>
                <td>
                  <span class="placeholder col-6"></span>
                </td>
                <td>
                  <span class="placeholder col-4"></span>
                </td>
                <td>
                  <span class="placeholder col-4"></span>
                </td>
                <td>
                  <span class="placeholder col-7"></span>
                </td>
              </tr>
            </template>

            <template v-else-if="!products">
              <tr>
                <td colspan="8" class="text-center text-warning fw-bold">EMPTY DATA</td>
              </tr>
            </template>
            <template v-else>
              <tr v-for="product in products.slice(0, 5)" :key="product.id">
                <td>{{ product.id }}</td>
                <td>
                  <img
                    :src="'https://res.cloudinary.com/sof3022-image-cloudinary/image/upload/v1737736178/Untitleddesign_3_9bdd2355-4632-4233-8c1d-1583308606b4_dnryfl.webp'"
                    alt="Product Image"
                    class="img-thumbnail"
                    style="width: 50px; height: 50px"
                  />
                </td>
                <td>{{ product.name }}</td>
                <td>${{ product.price.toFixed(2) }}</td>
                <td>
                  <span v-if="product.discountPrice"> ${{ product.discountPrice.toFixed(2) }} </span>
                  <span v-else>-</span>
                </td>
                <td>{{ product.stock_quantity }}</td>
                <td>{{ product.sold_quantity }}</td>
                <td>{{ product.categoryName }}</td>
              </tr>
            </template>
          </tbody>
        </table>
        <div class="d-flex justify-content-center">
          <nav aria-label="Page navigation example">
            <ul class="pagination justify-content-center">
              <li class="page-item disabled">
                <a class="page-link">
                  <i class="bi bi-rewind-fill"></i>
                </a>
              </li>
              <li class="page-item">
                <a class="page-link">
                  <i class="bi bi-caret-left-fill"></i>
                </a>
              </li>
              <li class="page-item"><a class="page-link" href="#">1</a></li>
              <li class="page-item"><a class="page-link" href="#">2</a></li>
              <li class="page-item"><a class="page-link" href="#">3</a></li>
              <li class="page-item">
                <a class="page-link" href="#">
                  <i class="bi bi-caret-right-fill"></i>
                </a>
              </li>
              <li class="page-item">
                <a class="page-link" href="#">
                  <i class="bi bi-fast-forward-fill"></i>
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>

    <div class="card mt-3">
      <div class="card-header">Danh Sách Người dùng</div>
      <div class="card-body">
        <table class="table table-hover align-middle">
          <thead class="table-light">
            <tr>
              <th>ID</th>
              <th>AVATAR</th>
              <th>USERNAME</th>
              <th>FULLNAME</th>
              <th>SĐT</th>
              <th>EMAIL</th>
              <th>VAI TRÒ</th>
              <th>TRẠNG THÁI</th>
            </tr>
          </thead>
          <tbody>
            <template v-if="isLoading">
              <tr v-for="n in 5" :key="n">
                <td>
                  <span class="placeholder col-6"></span>
                </td>
                <td>
                  <span class="d-block rounded bg-secondary placeholder-wave" style="width: 50px; height: 50px"></span>
                </td>
                <td>
                  <span class="placeholder col-8"></span>
                </td>
                <td>
                  <span class="placeholder col-6"></span>
                </td>
                <td>
                  <span class="placeholder col-6"></span>
                </td>
                <td>
                  <span class="placeholder col-4"></span>
                </td>
                <td>
                  <span class="placeholder col-4"></span>
                </td>
                <td>
                  <span class="placeholder col-7"></span>
                </td>
              </tr>
            </template>

            <template v-else-if="!users">
              <tr>
                <td colspan="8" class="text-center text-warning fw-bold">EMPTY DATA</td>
              </tr>
            </template>
            <template v-else>
              <tr v-for="user in users.slice(0, 5)" :key="user.id">
                <td>{{ user.id }}</td>
                <td>
                  <img
                    :src="'https://res.cloudinary.com/sof3022-image-cloudinary/image/upload/v1738852593/0GYFgvj_t6yp1z.jpg'"
                    alt="User Image"
                    class="rounded-circle"
                    style="width: 50px; height: 50px"
                  />
                </td>
                <td>{{ user.username }}</td>
                <td>{{ user.fullName }}</td>
                <td>{{ user.phone }}</td>
                <td>{{ user.email }}</td>
                <td>{{ user.roles.includes("ROLE_USER") ? "Khách hàng" : user.roles.includes("ROLE_ADMIN") ? "Quản Trị" : "Quản Lý" }}</td>
                <td>{{ user.available ? "Hoạt động" : "Khóa" }}</td>
              </tr>
            </template>
          </tbody>
        </table>
        <div class="d-flex justify-content-center">
          <nav aria-label="Page navigation example">
            <ul class="pagination justify-content-center">
              <li class="page-item disabled">
                <a class="page-link">
                  <i class="bi bi-rewind-fill"></i>
                </a>
              </li>
              <li class="page-item">
                <a class="page-link">
                  <i class="bi bi-caret-left-fill"></i>
                </a>
              </li>
              <li class="page-item"><a class="page-link" href="#">1</a></li>
              <li class="page-item"><a class="page-link" href="#">2</a></li>
              <li class="page-item"><a class="page-link" href="#">3</a></li>
              <li class="page-item">
                <a class="page-link" href="#">
                  <i class="bi bi-caret-right-fill"></i>
                </a>
              </li>
              <li class="page-item">
                <a class="page-link" href="#">
                  <i class="bi bi-fast-forward-fill"></i>
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useProducts } from "../../composables/useProducts";
import { useUsersStore } from "../../stores/usersStore";

const { products, loading, error, fetchProducts } = useProducts();
const { isLoading, users, fetchAllUsers, fetchUserById } = useUsersStore();

const totalProducts = computed(() => products.value.length);
const availableProducts = computed(() => products.value.filter((p) => p.available && p.stock_quantity > 0).length);
const outOfStock = computed(() => products.value.filter((p) => p.stock_quantity <= 0).length);
const discountedProducts = computed(() => products.value.filter((p) => p.discountPrice && p.discountPrice < p.price).length);

onMounted(async () => {
  await fetchProducts();
  if (!users.length) {
    await fetchAllUsers();
  }
});
</script>

<style scoped>
.card {
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
}

.table th,
.table td {
  vertical-align: middle;
}

.placeholder {
  display: inline-block;
  background-color: #e0e0e0;
  border-radius: 4px;
}
</style>
