import { getAnalytics } from "firebase/analytics";
import firebase, { initializeApp } from "firebase/app";
import "firebase/auth"; // <- import cac dich vu firebase can su dung
import "firebase/firestore";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import.meta.env.VITE_API_BASE_URL;
// init firebase voi thong tin du an
const firebaseConfig = {
  apiKey: "AIzaSyDf3vFwRi3PY_EyWNGYEwxJB2EH6lm80N8",
  authDomain: "spring-rest-api-fbase-project.firebaseapp.com",
  projectId: "spring-rest-api-fbase-project",
  storageBucket: "spring-rest-api-fbase-project.firebasestorage.app",
  messagingSenderId: "471171333622",
  appId: "1:471171333622:web:8f29963e10364107369bd7",
  measurementId: "G-BJ7YPVP6K1",
};

// Lấy token đăng ký
firebase
  .messaging()
  .getToken()
  .then(function (currentToken) {
    if (currentToken) {
      console.log("Token đăng ký:", currentToken);
      // Gửi token đăng ký đến server Java (sử dụng AJAX hoặc Fetch API)
      // ... (ví dụ sử dụng Fetch API như bên dưới)
      fetch("{VITE_API_BASE_URL}", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: currentToken }),
      })
        .then((response) => {
          console.log("Token đã được gửi đến server:", response);
        })
        .catch((error) => {
          console.error("Lỗi khi gửi token:", error);
        });
    } else {
      console.error("Không thể lấy token đăng ký.");
    }
  })
  .catch(function (err) {
    console.error("Lỗi khi lấy token đăng ký:", err);
  });

// Xử lý thông báo đẩy
firebase.messaging().onMessage(function (payload) {
  console.log("Thông báo đẩy nhận được:", payload);
  // Hiển thị thông báo đẩy trong Vue.js
  // ...
});

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const messaging = getMessaging(app);
getToken(messaging, { vapidKey: "BET_TI9ADBmbgvvhByLMSo2oz8wj1_Qc5JeDxR37y_r3a-hl9-gXJodw3-dIbsduCVeMNgGxYAjN0pmzNocI2QM" });
export { getToken, messaging, onMessage };
