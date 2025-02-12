<template>
  <div class="d-flex justify-content-center align-items-center mx-auto h-100 m-5">
    <form class="card card-dark bg-white p-3 w-25 input-media">
      <div class="mb-3 form-floating">
        <input type="email" placeholder="Email xác nhận..." id="emailVerify" class="form-control rounded-0" />
        <label for="emailVerify">Email xác nhận</label>
      </div>
      <button class="btn btn-outline-primary rounded-0 w-100 input-control-media">Gửi mã xác nhận</button>
      <div class="mt-3 text-center">
        <span>Đã có tài khoản?</span>
        <router-link to="/auth/login" class="text-decoration-underline text-info"> Đăng nhập ngay</router-link>
      </div>
    </form>
  </div>
</template>

<style scoped></style>
