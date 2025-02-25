<template>
  <div class="container mt-2">
    <div class="mb-3">
      <label for="categoryFilter" class="form-label">Lọc theo vai trò:</label>
      <select id="categoryFilter" class="form-select w-25" @change="filterByRole">
        <option value="">Tất cả</option>
        <option v-for="role in roles" :key="role.id" :value="role.id">
          {{ role.name == "ROLE_USER" ? "Người dùng" : role.name == "ROLE_ADMIN" ? "Quản trị viên" : "Quản lý" }}
        </option>
      </select>
    </div>

    <table class="table table-bordered">
      <thead class="table-dark">
        <tr>
          <th>ID</th>
          <th>AVATAR</th>
          <th>USERNAME</th>
          <th>FULLNAME</th>
          <th>SĐT</th>
          <th>EMAIL</th>
          <th>VAI TRÒ</th>
          <th>TRẠNG THÁI</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody v-if="users?.content">
        <tr v-for="user in users?.content" :key="user.id">
          <td>{{ user.id }}</td>
          <td>
            <img :src="user.photo ? user.photo : 'https://www.pngfind.com/pngs/b/610-6104451_placeholder-png.png'" alt="avatar" class="rounded-circle object-fit-cover" width="50" height="50" />
          </td>
          <td>{{ user.username }}</td>
          <td>{{ user.fullName }}</td>
          <td>{{ user.phone }}</td>
          <td>{{ user.email }}</td>
          <td>
            {{ handleShowRole(user.roles) }}
          </td>
          <td>
            <span :class="user.available ? 'badge bg-success rounded-0' : 'badge bg-danger rounded-0'">{{ user.available ? "Hoạt động" : "Khóa" }}</span>
          </td>
          <td>
            <button class="btn btn-danger btn-sm w-100 rounded-0" @click="handleChangeUserStatus(user.id)">Vô hiệu hóa</button>
          </td>
        </tr>
        <tr>
          <td colspan="9" class="text-center">
            <div class="w-100">
              <nav aria-label="Page  example" class="d-flex justify-content-center">
                <ul class="pagination">
                  <li class="page-item">
                    <button class="btn btn-outline-dark rounded-0 border-0" @click="first" :class="users.currentPage == 0 ? 'disabled btn-secondary ' : ''"><i class="bi bi-rewind-fill"></i></button>
                  </li>
                  <li class="page-item">
                    <button class="btn btn-outline-dark rounded-0 border-0" @click="prev" :class="users.currentPage == 0 ? 'disabled btn-secondary ' : ''">
                      <i class="bi bi-caret-left-fill"></i>
                    </button>
                  </li>
                  <!-- PAGE -->
                  <li class="page-item">
                    <button class="btn btn-outline-dark rounded-0 border-0" @click="handleComputedPage(0)" :class="users.currentPage == 0 ? 'btn-primary text-white' : ''">0</button>
                  </li>

                  <li class="page-item" v-for="page in users.totalPages - 1" :key="page">
                    <button class="btn btn-outline-dark rounded-0 border-0" @click="handleComputedPage(page)" :class="users.currentPage == page ? 'btn-primary text-white' : ''">
                      {{ page }}
                    </button>
                  </li>
                  <!-- END PAGE -->
                  <li class="page-item">
                    <button class="btn btn-outline-dark rounded-0 border-0" @click="next" :class="users.currentPage == users.totalPages - 1 ? 'disabled btn-secondary ' : ''">
                      <i class="bi bi-caret-right-fill"></i>
                    </button>
                  </li>
                  <li class="page-item">
                    <button class="btn rounded-0 border-0" @click="last">
                      <i class="bi bi-fast-forward-fill" :class="users.currentPage == users.totalPages - 1 ? 'disabled    btn-secondary text-secondary' : 'btn-outline-dark'"></i>
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import moment from "moment";
import { storeToRefs } from "pinia";
import { computed, nextTick, onMounted, ref } from "vue";
import { useUsersStore } from "../../stores/usersStore";

const userStores = useUsersStore();
const { isLoading, error, users, changeUserAvailableStatus, user, fetchAllUsers, fetchUserById } = storeToRefs(userStores);

const roles = ref([
  { id: "1", name: "ROLE_USER" },
  { id: "2", name: "ROLE_ADMIN" },
  { id: "3", name: "ROLE_MANAGER" },
]);
const role = ref(0);

onMounted(async () => {
  console.log("onMounted");
  await userStores.fetchAllUsers(role.value, 0, 5, "username", "asc");
  await nextTick();
});

const handleShowRole = (roles) => {
  if (!roles || roles.length == 0) return "Không hợp lệ!";
  return roles
    .map((role) => {
      switch (role) {
        case "ROLE_USER":
          return "Người dùng";
        case "ROLE_ADMIN":
          return "Quản trị viên";
        case "ROLE_MANAGER":
          return "Quản lý";
        default:
          return role;
      }
    })
    .join(", ");
};
const next = async () => {
  await userStores.fetchAllUsers(role.value, userStores.users.currentPage + 1, 5, "username", "asc");
};
const prev = async () => {
  await userStores.fetchAllUsers(role.value, userStores.users.currentPage - 1, 5, "username", "asc");
};
const last = async () => {
  await userStores.fetchAllUsers(role.value, userStores.users.totalPages - 1, 5, "username", "asc");
};
const first = async () => {
  await userStores.fetchAllUsers(role.value, 0, 0, 5, "username", "asc");
};
const handleComputedPage = async (page) => {
  await userStores.fetchAllUsers(role.value, page, 5, "username", "asc");
  console.log("CURRENT PAGE:", userStores.users.currentPage);
};

const handleChangeUserStatus = async (id) => {
  await userStores.changeUserAvailableStatus(id);

  const userIndex = userStores.users.content.findIndex((u) => u.id === id);
  if (userIndex !== -1) {
    userStores.users.content[userIndex].available = !userStores.users.content[userIndex].available;
  }
};

const filterByRole = async (event) => {
  role.value = event.target.value;
  if (role.value == "") await userStores.fetchAllUsers(role.value, 0, 5, "username", "asc");
  else await userStores.fetchAllUsers(role.value, 0, 5, "username", "asc");
};

const formatDate = (date) => {
  return moment(date).format("DD/MM/YYYY");
};
</script>
