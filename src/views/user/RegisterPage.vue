<template>
  <div class="d-flex justify-content-center align-items-center mx-auto h-100 m-5">
    <form class="card card-dark bg-white p-3 w-25 input-media">
      <div class="mb-2">
        <input type="text" placeholder="Nhập họ và tên" class="form-control rounded-0 input-control-media" />
      </div>
      <div class="mb-2">
        <input type="text" placeholder="Nhập username" class="form-control rounded-0 input-control-media" />
      </div>
      <div class="mb-2">
        <input type="email" placeholder="Nhập Email" class="form-control rounded-0 input-control-media" />
      </div>
      <div class="mb-2">
        <input type="password" placeholder="Nhập mật khẩu" class="form-control rounded-0 input-control-media" />
      </div>
      <div class="mb-3">
        <input type="password" placeholder="Xác nhận mật khẩu" class="form-control rounded-0 input-control-media" />
      </div>
      <button class="btn btn-outline-primary w-100 input-control-media">Đăng ký</button>
      <div class="mt-3 text-center">
        <span>Đã có tài khoản?</span>
        <router-link to="/auth/login" class="text-decoration-underline text-info"> Đăng nhập ngay</router-link>
      </div>
    </form>
  </div>
</template>

<style scoped>
.input-control-media {
  height: 50px;
}
</style>
