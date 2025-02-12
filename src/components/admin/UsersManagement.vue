<template>
  <div class="container mt-2">
    <h2 class="mb-4">Quản lý Sản phẩm</h2>

    <div class="mb-3">
      <label for="categoryFilter" class="form-label">Lọc theo vai trò:</label>
      <select id="categoryFilter" class="form-select w-25">
        <option value="">Tất cả</option>
        <option v-for="role in roles" :key="role.id" :value="role.id">
          {{ role.name }}
        </option>
      </select>
    </div>

    <table class="table table-bordered">
      <thead class="table-dark">
        <tr>
          <th>ID</th>
          <th>USERNAME</th>
          <th>FULLNAME</th>
          <th>SĐT</th>
          <th>EMAIL</th>
          <th>VAI TRÒ</th>
          <th>TRẠNG THÁI</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users.slice(0, 8)" :key="user.id">
          <td>{{ user.id }}</td>
          <td>{{ user.username }}</td>
          <td>{{ user.fullName }}</td>
          <td>{{ user.phone }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.roles }}</td>
          <td>{{ user.available }}</td>
          <td>
            <button class="btn btn-warning btn-sm me-2">Sửa</button>
            <button class="btn btn-danger btn-sm">Xóa</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import moment from "moment";
import { computed, onMounted, ref } from "vue";
import { useUsersStore } from "../../stores/usersStore";

const { isLoading, error, users, user, fetchAllUsers, fetchUserById } = useUsersStore();

const roles = ref([
  { id: "1", name: "USER" },
  { id: "2", name: "ADMIN" },
  { id: "3", name: "MANAGER" },
]);

const formatDate = (date) => {
  return moment(date).format("DD/MM/YYYY");
};

onMounted(() => {
  fetchAllUsers();
});
</script>
