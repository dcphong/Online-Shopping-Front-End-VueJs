import { defineStore } from "pinia";
import { ref, toRaw } from "vue";

export const useOrderDetails = defineStore(
  "orderDetails",
  () => {
    const isOrderDetailsLoading = ref(false);
    const orderDetails = ref([]);
    const orderDetailsError = ref(null);
    const apiUrl = import.meta.env.VITE_API_BASE_URL;

    const createdOrderDetails = async (list) => {
      console.log("ORDER DETAILS: ", toRaw(list));
      isOrderDetailsLoading.value = true;
      try {
        const response = await fetch(`${apiUrl}/api/v1/user/orderDetails`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(list),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to create order details: ${response.statusText}`);
        }

        const data = await response.json();
      } catch (err) {
        orderDetailsError.value = err.message;
      } finally {
        isOrderDetailsLoading.value = false;
      }
    };

    const fetchOrderDetailsByOrderId = async (id) => {
      isOrderDetailsLoading.value = true;
      try {
        const response = await fetch(`${apiUrl}/api/v1/user/orderDetails/order/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "application/json",
          },
        });
        if (response.ok) {
          const data = await response.json();
          orderDetails.value = data.data || [];
        } else {
          orderDetails.value = [];
          orderDetailsError.value = "Failed to fetch order details from server";
        }
      } catch (err) {
        orderDetailsError.value = err.message;
      } finally {
        isOrderDetailsLoading.value = false;
      }
    };

    return {
      isOrderDetailsLoading,
      orderDetails,
      orderDetailsError,
      fetchOrderDetailsByOrderId,
      createdOrderDetails,
    };
  },
  {
    persist: true, // Đây là cách đúng để bật persist
  }
);
