import { defineStore } from "pinia";
import { ref } from "vue";

export const useOtpStore = defineStore("otp", () => {
  const otp = ref("");
  const isValidOtp = ref(false);
  const isSendingOtp = ref(false);
  const otpError = ref(null);
  const otpMessage = ref("");
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const receiveOtp = async (email) => {
    isSendingOtp.value = true;
    const formData = new URLSearchParams();
    formData.append("email", email);
    try {
      const response = await fetch(`${apiUrl}/api/v1/mail/send`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      });
    } catch (err) {
      otpError.value = err.message;
      console.log("ERROR: ", err.message);
    } finally {
      isSendingOtp.value = false;
    }
  };

  const validateOtp = async (email, otp) => {
    isSendingOtp.value = true;
    const formData = new URLSearchParams();
    formData.append("email", email);
    formData.append("otp", otp);
    try {
      const response = await fetch(`${apiUrl}/api/v1/mail/verify`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.data == true) {
          isValidOtp.value = true;
          otpMessage.value = `<span class='text-success'>OTP hợp lệ!</span>`;
        } else {
          otpMessage.value = `<span class='text-danger'>Mã OTP không hợp lệ!</span>`;
        }
      }
    } catch (err) {
      console.log("ERROR WHEN CHECK OTP: ", err.message);
      otpError.value = err.message;
    } finally {
      isSendingOtp.value = false;
    }
  };

  return { otp, isValidOtp, isSendingOtp, otpError, otpMessage, receiveOtp, validateOtp };
});
