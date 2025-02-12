import { getMessaging, getToken } from "firebase/messaging";
importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js");

const firebaseConfig = {
  apiKey: "AIzaSyDf3vFwRi3PY_EyWNGYEwxJB2EH6lm80N8",
  authDomain: "spring-rest-api-fbase-project.firebaseapp.com",
  projectId: "spring-rest-api-fbase-project",
  storageBucket: "spring-rest-api-fbase-project.firebasestorage.app",
  messagingSenderId: "471171333622",
  appId: "1:471171333622:web:8f29963e10364107369bd7",
  measurementId: "G-BJ7YPVP6K1",
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("Received background message: ", payload);
  const notificationTitle = payload.notificationTitle.title;
  const notificationOptions = {
    body: payload.notification.bofy,
    icon: payload.notification.icon,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
