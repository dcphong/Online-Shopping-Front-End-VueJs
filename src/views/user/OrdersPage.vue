<template>
  <div class="container mt-4">
    <div class="row mb-3 m-0">
      <!-- Sidebar -->
      <div class="col-md-3 border-0 p-0">
        <profile-side-bar :username="user?.username"></profile-side-bar>
      </div>

      <!-- Lịch sử đơn hàng -->
      <div class="col-md-9 border-0 p-0">
        <div class="card rounded-0 h-100">
          <div class="card-header rounded-0 bg-primary text-white">
            <h5 class="m-0">Lịch sử đơn hàng</h5>
          </div>
          <div class="card-body">
            <div v-if="orders.length > 0">
              <table class="table table-bordered table-striped">
                <thead class="table-dark">
                  <tr>
                    <th>#</th>
                    <th>Ngày đặt</th>
                    <th>Địa chỉ</th>
                    <th>Tổng tiền</th>
                    <th>Trạng thái</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(order, index) in orders" :key="order.id">
                    <td>{{ index + 1 }}</td>
                    <td>{{ formatDate(order.orderDate) }}</td>
                    <td>{{ order.address }}</td>
                    <td>{{ formatPrice(order.totalAmount) }}</td>
                    <td>
                      <span :class="getStatusClass(order.order_status)">
                        {{ getStatusText(order.order_status) }}
                      </span>
                    </td>
                    <td>
                      <button class="btn btn-info btn-sm" @click="fetchOrderDetails(order.id)">Xem chi tiết</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-else class="alert alert-warning rounded-0 text-dark">Bạn chưa có đơn hàng nào.</div>
          </div>
        </div>

        <!-- Modal Chi Tiết Đơn Hàng -->
        <!-- <div class="modal fade" id="orderDetailsModal" tabindex="-1" aria-labelledby="orderDetailsModalLabel" aria-hidden="true">
          <div class="modal-dialog modal-lg">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">Chi tiết đơn hàng #{{ selectedOrderId }}</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <table class="table table-bordered">
                  <thead class="table-light">
                    <tr>
                      <th>#</th>
                      <th>Sản phẩm</th>
                      <th>Số lượng</th>
                      <th>Giá</th>
                      <th>Tổng</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(detail, index) in fetchOrderDetailsList" :key="detail.id">
                      <td>{{ index + 1 }}</td>
                      <td>{{ detail.descriptions }}</td>
                      <td>{{ detail.quantity }}</td>
                      <td>{{ formatPrice(detail.price) }}</td>
                      <td>{{ formatPrice(detail.total) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import ProfileSideBar from "../../components/user/ProfileSideBar.vue";
import { useOrderDetails } from "../../stores/useOrderDetailsStore.js";
import { useOrder } from "../../stores/useOrderStore.js";
const { orders, order, isOrdersLoading, ordersError, fetchOrderById, fetchOrderByUserId } = useOrder();
const { orderDetails, fetchOrderDetailsByOrderId, fetchOrderDetailsByUserId } = useOrderDetails();
const user = ref({});
const selectedOrderId = ref(null);

// Format ngày tháng
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", { year: "numeric", month: "long", day: "numeric" });
};

// Format tiền tệ
const formatPrice = (price) => {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);
};

// Định dạng trạng thái đơn hàng
const getStatusText = (status) => {
  const statusMap = {
    NOT_PAYMENT: "Chưa thanh toán",
    PAID: "Đã thanh toán",
    SHIPPED: "Đã giao hàng",
    CANCELLED: "Đã hủy",
  };
  return statusMap[status] || "Không xác định";
};

// Định dạng class trạng thái đơn hàng
const getStatusClass = (status) => {
  return {
    "badge bg-danger": status === "NOT_PAYMENT",
    "badge bg-success": status === "PAID",
    "badge bg-primary": status === "SHIPPED",
    "badge bg-secondary": status === "CANCELLED",
  };
};

onMounted(async () => {
  user.value = await JSON.parse(localStorage.getItem("user"));
  if (user.value) {
    await fetchOrderByUserId(user.value.id);
  }
});
</script>

<style scoped>
h5 {
  text-align: center;
}
</style>
