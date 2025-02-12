import vue from "@vitejs/plugin-vue";
import { defineConfig, loadEnv } from "vite";

// Hàm tạo cấu hình proxy
function createProxy(env) {
  return {
    "/api": {
      target: env.VITE_API_BASE_URL, // Sử dụng biến từ loadEnv
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, ""),
    },
  };
}

// Hàm cấu hình chính
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd()); // Nạp biến môi trường

  return {
    plugins: [vue()],
    server: {
      proxy: createProxy(env), // Gọi hàm tạo cấu hình proxy
    },
  };
});
