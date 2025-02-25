<template>
  <div>
    <!-- Sidebar -->
    <div :class="['sidebar', isOpen ? 'open' : 'closed']" class="h-100">
      <button class="toggle-btn" @click="toggleSidebar"><i class="bi bi-list"></i></button>
      <ul class="nav flex-column">
        <li class="nav-item">
          <router-link class="nav-link text-light" :to="'/admin'"> <i class="bi bi-house-door"></i> <span v-if="isOpen">Dashboard</span> </router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link text-light" :to="'/admin/products'"> <i class="bi bi-box"></i> <span v-if="isOpen">Sản phẩm</span> </router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link text-light" :to="'/admin/orders'"><i class="bi bi-receipt"></i> <span v-if="isOpen">Đơn hàng</span> </router-link>
        </li>
        <li class="nav-item" v-if="isRoleAdmin">
          <router-link class="nav-link text-light" :to="'/admin/users'"> <i class="bi bi-people"></i> <span v-if="isOpen">Khách hàng</span> </router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link text-light" :to="'/admin/upload-image'"> <i class="bi bi-cloud-arrow-up"></i><span v-if="isOpen">Upload hình ảnh</span> </router-link>
        </li>
        <li class="nav-item">
          <a class="nav-link text-light" href="#"> <i class="bi bi-gear"></i> <span v-if="isOpen">Cài đặt</span> </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "../../stores/authStore";

const { isRoleAdmin, isRoleUser } = useAuthStore();
const isOpen = ref(false);

const toggleSidebar = () => {
  isOpen.value = !isOpen.value;
};
</script>

<style scoped>
.sidebar {
  background-color: #212529; /* bg-dark */
  transition: width 0.3s;
  overflow: hidden;
}

.closed {
  width: 60px;
}

.open {
  width: 250px;
}

.toggle-btn {
  background: none;
  border: none;
  color: white;
  font-size: 20px;
  padding: 10px;
  cursor: pointer;
  width: 100%;
  text-align: left;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 10px;
}

.nav-link i {
  margin-right: 10px;
}
.nav-link:hover {
  background-color: #414549;
  transition: 0.5 ease-in-out;
}
</style>
