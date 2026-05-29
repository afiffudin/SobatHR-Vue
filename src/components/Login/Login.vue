<template>
  <div class="login-container d-flex align-items-center justify-content-center min-vh-100 bg-light">
    <div class="card p-4 shadow-sm border-0 rounded-10" style="width: 100%; max-width: 420px;">
      
      <div class="text-center mb-4">
        <div class="avatar-login mb-2 mx-auto bg-primary-transparent rounded-circle d-flex align-items-center justify-content-center" style="width: 60px; height: 60px;">
          <i class="flaticon-user text-primary fs-24"></i>
        </div>
        <h4 class="fw-bold text-black mb-1">Sobat HR</h4>
        <p class="text-muted fs-14">Sign in to access your dashboard</p>
      </div>

      <div 
        v-if="errorMessage" 
        class="alert alert-danger py-2 px-3 fs-13 text-center border-0 rounded-pill mb-3 animate__animated animate__fadeIn" 
        role="alert"
      >
        <i class="flaticon-warning me-1"></i> {{ errorMessage }}
      </div>

      <form @submit.prevent="handleLogin">
        <div class="mb-3">
          <label class="form-label text-black fw-medium fs-14">Email Address</label>
          <input 
            type="email" 
            v-model="emailAddress" 
            class="form-control shadow-none" 
            placeholder="example@mail.com" 
            required
          />
        </div>

        <div class="mb-4">
          <label class="form-label text-black fw-medium fs-14">Password</label>
          <input 
            type="password" 
            v-model="password" 
            class="form-control shadow-none" 
            placeholder="••••••••" 
            required
          />
        </div>

        <button 
          type="submit" 
          class="btn btn-primary w-100 py-25 fw-medium rounded-pill shadow-sm"
          :disabled="loading"
        >
          <span v-if="loading" class="spinner-border spinner-border-sm anonymity-spinner me-2" role="status" aria-hidden="true"></span>
          {{ loading ? 'Authenticating...' : 'Sign In' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
import api from "../../utils/api"; 

export default defineComponent({
  name: "LoginView",
  setup() {
    const emailAddress = ref<string>("");
    const password = ref<string>("");
    const loading = ref<boolean>(false);
    const errorMessage = ref<string>("");
    const router = useRouter();

    const handleLogin = async () => {
      try {
        loading.value = true;
        errorMessage.value = "";

        const response = await api.post("/api/v1/auth/login", {
          emailAddress: emailAddress.value,
          password: password.value,
        }, {
          headers: {
            "X-LOGIN-DEVICE": "web",
            "X-DEVICE-ID": "browser-client", 
            "X-DEVICE-NAME": window.navigator.userAgent 
          }
        });

        // Cek apakah ada data di dalam respon
        if (response.data && response.data.data) {
          const userData = response.data.data;

          // SIMPAN DATA AUTHENTIKASI
          // Kita menyimpan seluruh objek user agar bisa diambil jwtToken-nya
          localStorage.setItem("user", JSON.stringify(userData));
          // Kita simpan juga jwtToken-nya langsung agar mudah diakses interceptor
          localStorage.setItem("token", userData.jwtToken);

          alert("Login Berhasil! Selamat datang.");
          router.push("/");
        } else {
          errorMessage.value = "Gagal mendapatkan data akun. Silakan coba kembali.";
        }
      } catch (error: any) {
        console.error("Proses login terkendala:", error);
        errorMessage.value = error.response?.data?.message || "Koneksi ke server gagal. Silakan periksa kredensial Anda.";
      } finally {
        loading.value = false;
      }
    };

    return {
      emailAddress,
      password,
      loading,
      errorMessage,
      handleLogin,
    };
  },
});
</script>

<style scoped>
.rounded-10 { border-radius: 10px; }
.fs-13 { font-size: 13px; }
.fs-14 { font-size: 14px; }
.fs-24 { font-size: 24px; }
.py-25 { padding-top: 0.65rem; padding-bottom: 0.65rem; }
.bg-primary-transparent { background-color: rgba(var(--bs-primary-rgb), 0.1) !important; }
.anonymity-spinner { width: 1rem; height: 1rem; }
</style>