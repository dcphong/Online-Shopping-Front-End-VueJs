import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useOrderDetails = defineStore("orderDetails", () => {
  const isOrderDetailsLoading = ref(false);
  const orderDetailsList = ref(null);
  const orderDetails = ref({});
  const orderDetailsError = ref(null);
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const fetchOrderDetailsList = async () => {
    isOrderDetailsLoading.value = true;
    try {
      const response = await fetch(apiUrl + "/api/v1/orderDetails");
      if (response.ok) {
        const data = await response.json();
        orderDetailsList.value = data.data;
      } else {
        orderDetailsError.value = "Failed to fetch order  details from server";
      }
    } catch (err) {
      orderDetailsError.value = err.message;
    } finally {
      isOrderDetailsLoading.value = false;
    }
  };

  const fetchOrderDetailsByOrderId = async (id) => {
    isOrderDetailsLoading.value = true;
    try {
      const response = await fetch(`${apiUrl}/api/v1/orderDetails/order/${id}`);
      if (response.ok) {
        const data = await response.json();
        orderDetails.value = data.data;
      } else {
        orderDetailsError.value = "Failed to fetch order details from server";
      }
    } catch (err) {
      orderDetailsError.value = err.message;
    } finally {
      isOrderDetailsLoading.value = false;
    }
  };

  const createdOrderDetails = async (orderDetailsList) => {
    isOrderDetailsLoading.value = true;
    try {
      const response = await fetch(`${apiUrl}/api/v1/user/orderDetails`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderDetailsList),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data.data);
      } else {
        orderDetailsError.value = "Failed to create order details from server";
      }
    } catch (err) {
      orderDetailsError.value = err.message;
    } finally {
      isOrderDetailsLoading.value = false;
    }
  };

  return {
    isOrderDetailsLoading,
    orderDetailsList,
    orderDetails,
    orderDetailsError,
    fetchOrderDetailsList,
    fetchOrderDetailsByOrderId,
    createdOrderDetails,
  };
});
