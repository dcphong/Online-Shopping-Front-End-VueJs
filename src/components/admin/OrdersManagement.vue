<template>
  <div class="container mt-3">
    <h3 class="mb-3">Quản lý đơn hàng</h3>

    <table class="table table-bordered table-hover">
      <thead class="table-dark">
        <tr>
          <th>ID hóa đơn</th>
          <th>Người đặt</th>
          <th>Tổng tiền</th>
          <th>Trạng thái</th>
          <th>Đã cập nhật</th>
          <th>Địa chỉ</th>
          <th>Ngày đặt</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in orderedList" :key="order.id">
          <td>{{ order.orderId }}</td>
          <td>{{ order.customerName }}</td>
          <td>{{ formatCurrency(order.totalAmount) }}</td>
          <td>
            <span v-html="handleShowStatus(order.orderStatus)"></span>
          </td>
          <td class="text-center">{{ order.updateAt == null ? "-" : order.updateAt }}</td>
          <td>{{ order.addressOrder }}</td>
          <td>{{ order.orderDate }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { onMounted, ref } from "vue";
import { useOrder } from "../../stores/useOrderStore";
const ordersStore = useOrder();
const { orderedList, fetchOrderedBySalerId } = storeToRefs(ordersStore);

const formatCurrency = (value) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
};
const handleShowStatus = (status) => {
  if (status == "") return "Chưa xác định";
  switch (status) {
    case "NOT_PAYMENT":
      return `<span class=" bg-danger badge rounded-0">Chưa thanh toán</span>`;
    case "IS_PAYMENT":
      return `<span class="bg-success badge rounded-0">Đã thanh toán</span>`;
    case "IS_SHIPPED":
      return `<span class="bg-primary badge rounded-0">Đã giao hàng</span>`;
    case "IS_CANCELLED":
      return `<span class="bg-secondary badge rounded-0">Đã hủy</span>`;
    case "IS_SHIPPING":
      return `<span class="bg-warning badge rounded-0">Đang giao hàng</span>`;
    case "NOT_AVAILABLE":
      return `<span class="bg-danger badge rounded-0">Không khả dụng</span>`;
    default:
      return status;
  }
  return status;
};
onMounted(async () => {
  await ordersStore.fetchOrderedBySalerId(JSON.parse(localStorage.getItem("user")).id);
});
</script>
