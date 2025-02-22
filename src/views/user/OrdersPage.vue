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
              <table class="table table-bordered table-hover">
                <thead class="table-dark">
                  <tr>
                    <th>STT</th>
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
                      <button type="button" class="btn btn-info btn-sm" @click="fetchOrderDetails(order.id)" data-bs-toggle="modal" data-bs-target="#detailsModal">Xem chi tiết</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-else class="alert alert-warning rounded-0 text-dark">Bạn chưa có đơn hàng nào.</div>
          </div>
        </div>

        <!-- Modal Chi Tiết Đơn Hàng -->
        <teleport to="body"
          ><div class="modal fade" id="detailsModal" tabindex="-1" aria-labelledby="detailsModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg modal-dialog-centered">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="detailsModalLabel">Chi tiết đơn hàng</h5>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                  <table class="table table-bordered">
                    <thead class="table-light">
                      <tr>
                        <th>STT</th>
                        <th>Sản phẩm</th>
                        <th>Số lượng</th>
                        <th>Giá</th>
                        <th>Tổng</th>
                      </tr>
                    </thead>
                    <tbody v-if="orderDetails.length > 0">
                      <tr v-for="(detail, index) in orderDetails" :key="detail.id">
                        <td>{{ index + 1 }}</td>
                        <td>{{ detail.descriptions }}</td>
                        <td>{{ detail.quantity }}</td>
                        <td>{{ formatPrice(detail.price) }}</td>
                        <td>{{ formatPrice(detail.total) }}</td>
                      </tr>
                    </tbody>
                    <tbody v-else>
                      <tr>
                        <td colspan="5" class="text-center text-danger">Chưa có chi tiết đơn hàng.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </teleport>
      </div>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { nextTick, onMounted, ref, toRaw, watch } from "vue";
import ProfileSideBar from "../../components/user/ProfileSideBar.vue";
import { useOrderDetails } from "../../stores/useOrderDetailsStore.js";
import { useOrder } from "../../stores/useOrderStore.js";

const { orders, order, isOrdersLoading, ordersError, fetchOrderById, fetchOrderByUserId } = useOrder();

const orderDetailsStore = useOrderDetails();
const { orderDetails, fetchOrderDetailsByOrderId } = storeToRefs(orderDetailsStore);
const user = ref({});

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", { year: "numeric", month: "long", day: "numeric" });
};

const formatPrice = (price) => {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);
};

const getStatusText = (status) => {
  const statusMap = {
    NOT_PAYMENT: "Chưa thanh toán",
    IS_PAYMENT: "Đã thanh toán",
    IS_SHIPPED: "Đã giao hàng",
    IS_CANCELLED: "Đã hủy",
  };
  return statusMap[status] || "Không xác định";
};

// Định dạng class trạng thái đơn hàng
const getStatusClass = (status) => {
  return {
    "badge bg-danger": status === "NOT_PAYMENT",
    "badge bg-success": status === "IS_PAYMENT",
    "badge bg-primary": status === "IS_SHIPPED",
    "badge bg-secondary": status === "IS_CANCELLED",
  };
};
const fetchOrderDetails = async (id) => {
  await orderDetailsStore.fetchOrderDetailsByOrderId(id);
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
