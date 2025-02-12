import { ref } from "vue";
export const useOrder = () => {
  const orders = ref([]);
  const order = ref({});
  const isOrdersLoading = ref(false);
  const ordersError = ref(null);

  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const fetchOrders = async () => {
    isOrdersLoading.value = true;
    try {
      const response = await fetch(apiUrl + "/api/v1/user/orders", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        orders.value = data.data;
      } else {
        ordersError.value = "Failed to fetch orders from server";
      }
    } catch (err) {
      ordersError.value = err.message;
    } finally {
      isOrdersLoading.value = false;
    }
  };

  const fetchOrderById = async (id) => {
    isOrdersLoading.value = true;
    try {
      const response = await fetch(`${apiUrl}/api/v1/user/orders/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        order.value = data.data;
      } else {
        ordersError.value = "Failed to fetch order with id: " + id + " from server";
      }
    } catch (err) {
      ordersError.value = err.message;
    } finally {
      isOrdersLoading.value = false;
    }
  };

  const fetchOrderByUserId = async (id) => {
    isOrdersLoading.value = true;
    try {
      const response = await fetch(apiUrl + `/api/v1/user/orders/userId/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        orders.value = data.data;
        console.log("ORDERS: ", orders.value);
      } else {
        ordersError.value = "Failed to fetch order with user id: " + id + " from server";
      }
    } catch (err) {
      ordersError.value = err.message;
    } finally {
      isOrdersLoading.value = false;
    }
  };

  return { orders, order, isOrdersLoading, ordersError, fetchOrders, fetchOrderById, fetchOrderByUserId };
};
