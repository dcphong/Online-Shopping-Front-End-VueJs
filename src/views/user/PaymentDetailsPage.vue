<template>
  <div>
    <div class="container mt-3 mb-3">
      <!-- ĐỊA CHỈ -->
      <div class="row w-100 bg-light p-3 mb-2">
        <span class="fs-6 fw-bold"><i class="bi bi-geo-alt-fill"></i>Địa chỉ nhận hàng:</span>
        <div class="d-block mb-2">
          <strong>Chấn Phong (+84) 999 665 91</strong>
          <span>{{ address }}</span>

          <button class="float-end btn btn-outline-primary rounded-0" data-bs-toggle="modal" data-bs-target="#changeAddress">Thay đổi</button>

          <!-- MODAL -->
          <div class="modal fade" id="changeAddress" tabindex="-1" aria-labelledby="changeAddress" aria-hidden="true">
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header modal-dark bg-success text-light">
                  <h1 class="modal-title fs-5" id="changeAddress">Thay đổi địa chỉ:</h1>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                  <input type="text" v-model="newAddress" class="form-control" />
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-success" @click="updateAddress" data-bs-dismiss="modal">Đồng ý</button>
                </div>
              </div>
            </div>
          </div>
          <!-- END MODAL -->
        </div>
      </div>
      <!-- END  ĐỊA CHỈ -->

      <div class="row bg-white w-100 mt-2 mb-2 pt-3 pb-3 text fw-lighter">
        <div class="col-6">Sản phẩm</div>
        <div class="col-2 text-end">Đơn giá</div>
        <div class="col-2 text-end">Số lượng</div>
        <div class="col-2 text-end">Thành tiền</div>
      </div>

      <div class="row w-100 mt-2 mb-2 text fw-lighter">
        <!-- LIST PRODUCT BY USERID -->
        <div v-if="selectedProducts" class="col-12 text p-2">
          <div v-for="(groups, sellerId) in groupedProductsBySaler" :key="sellerId">
            <div class="row bg-light mb-3">
              <div class="row d-flex align-items-center pt-2 pb-2" v-for="product in groups.products" :key="product.id">
                <div class="col-6" style="height: 80px">
                  <img :src="product.image" :alt="'Tên sản phẩm'" class="w-25" />
                  <p>{{ product.name }}</p>
                </div>
                <template v-if="product.discountPrice > 0">
                  <div class="col-2 d-flex align-items-center justify-content-end">
                    <del class="fs-6 text-muted me-2">{{ product.price.toLocaleString() }}</del>
                    {{ product.discountPrice.toLocaleString() }}đ
                  </div>
                  <div class="col-2 d-flex align-items-center justify-content-end" v-bind="product.quantity">{{ product?.quantity || 1 }}</div>
                  <div class="col-2 d-flex align-items-center justify-content-end">
                    {{ (product.discountPrice * (product.quantity == null ? 1 : product.quantity)).toLocaleString() || (product.discountPrice * 1).toLocaleString() }}đ
                  </div>
                </template>
                <template v-else>
                  <div class="col-2 d-flex align-items-center justify-content-end">{{ product.price.toLocaleString() }}đ</div>
                  <div class="col-2 d-flex align-items-center justify-content-end" v-bind="product.quantity">{{ product?.quantity || 1 }}</div>
                  <div class="col-2 d-flex align-items-center justify-content-end">
                    {{ product.quantity != null ? (product.price * product?.quantity).toLocaleString() : (product.price * 1).toLocaleString() }}đ
                  </div>
                </template>
              </div>

              <div class="row border m-0">
                <div class="col-5 d-inline p-3">
                  <p class="m-0">
                    🛍 Người bán: <span class="fw-normal">{{ groups.fullname }}</span>
                  </p>
                  <span>Lưu ý cho người bán:</span>
                  <input type="text" v-model="descriptionsForSeller[groups.sellerId]" class="form-control rounded-0" />
                </div>
                <div class="col-7 border-start border-start p-2">
                  <div class="mb-3">
                    <span> <i class="bi bi-truck text-dark"></i> Phương thức vận chuyển: </span>
                    <p class="d-inline text-success">Nhanh</p>
                    <p class="d-inline text-secondary ms-5" :bind="shippingFee">{{ formatNumber(shippingFee) + " đ" }}</p>
                    <button class="d-inline text-primary float-end border-0 bg-body-tertiary me-2">Thay đổi</button>
                  </div>
                  <hr class="m-0" />
                  <span> Được đồng kiểm <i class="bi bi-question-circle"></i></span>
                </div>
              </div>
              <div class="col-12 border m-0">
                <div class="row m-0">
                  <div class="d-flex justify-content-end p-4">
                    <span class="fw-bold">
                      Tống:
                      <b class="fw-normal fs-6 text-danger">{{ formatNumber(shippingFee + groups?.totalPrice || totalPrice) + " đ" }} </b>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- END LIST PRODUCT BY USERID -->
      <div class="w-100 bg-light row">
        <div class="col-12">
          <div class="col d-flex gap-2 p-3">
            <span>Phương thức thanh toán: </span>

            <input type="radio" class="btn-check" name="options" id="option1" autocomplete="off" />
            <label class="btn btn-outline-dark rounded-0" for="option1">Thanh toán khi nhận hàng</label>

            <input type="radio" class="btn-check" name="options" disabled id="option2" autocomplete="off" />
            <label class="btn btn-outline-dark rounded-0" for="option2">Thẻ tín dụng/thẻ ghi nợ</label>

            <input type="radio" class="btn-check" name="options" disabled id="option3" autocomplete="off" />
            <label class="btn btn-outline-dark rounded-0" for="option3">Ngân hàng</label>
          </div>
          <div class="col border-top mt-3">
            <div class="float-end">
              <div class="d-flex justify-content-between">
                <p class="fw-normal">Tổng tiền hàng:</p>
                <span>{{ formatNumber(totalProductPrice) }} đ</span>
              </div>
              <div class="d-flex justify-content-between">
                <p class="fw-normal">Tổng tiền phí vận chuyển:</p>
                <span>{{ formatNumber(totalShippingFee) }} đ</span>
              </div>
              <div class="d-flex justify-content-between">
                <p class="fw-norma me-2">Tổng thanh toán:</p>
                <span class="fw-bold fs-5 text-danger">{{ formatNumber(totalPrice) }} đ</span>
              </div>
            </div>
          </div>
        </div>
        <div class="col-12 p-3 border-top">
          <span> Nhấn "Đặt hàng" đồng nghĩa với việc bạn đồng ý tuân theo Điều khoản <a href="" class="text-decoration-none">DCP-SHOP</a> </span>
          <button class="btn btn-outline-dark rounded-0 float-end" @click="doOrder()">Đặt hàng</button>
        </div>
      </div>
    </div>
    <loading :loading="isOrdersLoading" :message="messageLoading"></loading>
  </div>
</template>
<script setup>
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import Loading from "../../components/user/Loading.vue";
import { useProductsInCart } from "../../composables/useProductInCart.js";
import { useProducts } from "../../composables/useProducts";
import { useCartStore } from "../../stores/cartStore.js";
import { useUsersStore } from "../../stores/usersStore";

const { cart, removeProductInCart } = useProductsInCart();
const { selectedProducts, setSelectedProducts, clearSelectedProducts } = useCartStore();

import { useOrderDetails } from "../../stores/useOrderDetailsStore.js";
import { useOrder } from "../../stores/useOrderStore.js";
const { createdOrderDetails } = useOrderDetails();
const { createdOrder, orderStore, isOrdersLoading } = useOrder();

const route = useRoute();
const router = useRouter();

const { products, loading, error, fetchProducts, fetchProductById } = useProducts();
const { user, fetchUserById } = useUsersStore();

const productFetch = computed(() => {
  const product = products.value.find((p) => p.id == route.params.id);
  return product ? product : { name: "Sản phẩm không tồn tại", id: null };
});

const shippingFee = ref(25000);

const formatNumber = (value) => {
  return new Intl.NumberFormat("vi-VN").format(value);
};

onMounted(async () => {
  await fetchProducts();
  if (route.params.id) {
    await fetchProductById(route.params.id);
    await fetchUserById(productFetch.value.createdBy);
  }
});

const groupedProductsBySaler = computed(() => {
  return selectedProducts.reduce((groups, product) => {
    const sellerId = product.createdBy;
    const sellerFullname = product.userCreatedName;
    const totalPrice = product.discountPrice > 0 ? product.discountPrice * product.quantity : product.price * product.quantity;
    if (!groups[sellerId]) {
      groups[sellerId] = {
        sellerId: sellerId,
        fullname: sellerFullname,
        products: [],
        totalPrice: 0,
      };
    }
    groups[sellerId].products.push(product);
    groups[sellerId].totalPrice += product.discountPrice > 0 ? product.discountPrice * (product.quantity || 1) : product.price * (product.quantity || 1);

    return groups;
  }, {});
});

const totalProductPrice = computed(() => {
  return selectedProducts.reduce((sum, product) => {
    const price = product.discountPrice > 0 ? product.discountPrice : product.price;
    return sum + price * (product.quantity || 1);
  }, 0);
});

const totalShippingFee = computed(() => {
  if (selectedProducts.length <= 1) return shippingFee.value;
  return Object.keys(groupedProductsBySaler.value).length * shippingFee.value;
});

const totalPrice = computed(() => {
  return totalProductPrice.value + totalShippingFee.value;
});

const address = ref(JSON.parse(localStorage.getItem("user"))?.address);

const descriptionsForSeller = ref({});

const newAddress = ref("");

const order = ref({
  userId: JSON.parse(localStorage.getItem("user"))?.id || null,
  address: JSON.parse(localStorage.getItem("user"))?.address || "",
  totalAmount: computed(() => totalPrice.value),
});
const updateAddress = () => {
  order.value.address = newAddress.value;
  address.value = newAddress.value;
};
const messageLoading = ref("Đang xử lý...");

const doOrder = async () => {
  messageLoading.value = "Đang đặt hàng...";

  try {
    if (!order.value.userId || !order.value.address || !order.value.totalAmount) {
      console.log("order.value thiếu thông tin cần thiết.,", order.value);
      return;
    }

    const newOrder = await createdOrder(order.value);

    if (!newOrder || !newOrder.id) {
      throw new Error("Order creation failed.");
    }

    const updatedOrderDetailsList = selectedProducts.map((product) => ({
      quantity: product.quantity || 1,
      price: product.price,
      total: Number(product.price) * (product.quantity || 1),
      descriptions: descriptionsForSeller.value[product.createdBy] || "",
      productId: product.id,
      orderId: newOrder.id,
    }));

    await createdOrderDetails(updatedOrderDetailsList);
    clearSelectedProducts();
    for (let i = 0; i < selectedProducts.length; i++) {
      await removeProductInCart(selectedProducts[i].id);
    }
  } catch (error) {
    console.log("Lỗi khi đặt hàng:", error.message);
  } finally {
    router.push("/user/orders");
  }
};
</script>
<style scoped>
img {
  height: 100%;
  width: auto;
  object-fit: contain;
}

.col-6 {
  display: flex;
  align-items: center;
}

img.w-25 {
  max-width: 100%;
  max-height: 100%;
}
.product-row {
  background-color: white;
  transition: 0.3s ease-out;
}
.product-row:hover {
  background-color: rgba(153, 153, 153, 0.09);
  transition: background-color 0.3s ease-out;
}
</style>
