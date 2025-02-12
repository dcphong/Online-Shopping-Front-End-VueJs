<template>
  <div>
    <Header></Header>
    <router-view></router-view>
    <Footer></Footer>
  </div>
</template>
<script setup>
import Footer from "../components/user/Footer.vue";
import Header from "../components/user/Header.vue";
</script>
