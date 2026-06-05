<template>
  <div class="login-page">

    <!-- Bubbles: pakai inline style agar tidak terkena scoped -->
    <span
      v-for="b in bubbles"
      :key="b.id"
      :style="b.style"
      aria-hidden="true"
    ></span>

    <!-- Logo area -->
    <div class="login-top">
      <div class="logo-row">
        <svg width="50" height="62" viewBox="0 0 52 68" fill="none" aria-hidden="true">
          <circle cx="26" cy="11" r="8" fill="rgba(255,255,255,.95)"/>
          <path d="M16 22 Q4 36 10 51 Q16 63 26 58" stroke="rgba(255,255,255,.95)" stroke-width="4.5" stroke-linecap="round" fill="none"/>
          <path d="M36 22 Q48 36 42 51 Q36 63 26 58" stroke="rgba(255,255,255,.6)" stroke-width="4.5" stroke-linecap="round" fill="none"/>
          <line x1="26" y1="28" x2="26" y2="50" stroke="rgba(255,255,255,.95)" stroke-width="4.5" stroke-linecap="round"/>
          <path d="M26 50 Q18 60 14 68" stroke="rgba(255,255,255,.6)" stroke-width="4" stroke-linecap="round" fill="none"/>
          <path d="M26 50 Q34 60 38 68" stroke="rgba(255,255,255,.95)" stroke-width="4" stroke-linecap="round" fill="none"/>
        </svg>
        <div class="logo-text">
          <span class="logo-name">Sobat<em>HR</em></span>
          <span class="logo-tagline">Payroll &amp; HR Solutions</span>
        </div>
      </div>
    </div>

    <!-- White card -->
    <div class="login-card">

      <h1 class="card-title">Selamat datang!</h1>
      <p class="card-sub">Masuk untuk melanjutkan ke dashboard Anda</p>

      <form @submit.prevent="handleLogin" novalidate>

        <div class="login-field">
          <label class="login-label" for="login-email">Email</label>
          <div class="inp-wrap">
            <i class="flaticon-email inp-icon" aria-hidden="true"></i>
            <input
              id="login-email"
              type="email"
              v-model="emailAddress"
              class="login-input"
              placeholder="contoh@email.com"
              autocomplete="email"
              required
            />
          </div>
        </div>

        <div class="login-field">
          <label class="login-label" for="login-password">Kata Sandi</label>
          <div class="inp-wrap">
            <i class="flaticon-password inp-icon" aria-hidden="true"></i>
            <input
              id="login-password"
              :type="showPassword ? 'text' : 'password'"
              v-model="password"
              class="login-input"
              placeholder="Masukkan kata sandi"
              autocomplete="current-password"
              required
            />
            <button
              type="button"
              class="eye-btn"
              @click="showPassword = !showPassword"
              :aria-label="showPassword ? 'Sembunyikan' : 'Tampilkan'"
            >
              <i :class="showPassword ? 'flaticon-eye' : 'flaticon-eye-slash'" aria-hidden="true"></i>
            </button>
          </div>
        </div>

        <!-- <div class="forgot-row">
          <a href="#" class="forgot-link">Lupa kata sandi?</a>
        </div> -->

        <button type="submit" class="login-btn" :disabled="loading">
          <span v-if="loading" class="btn-spin" aria-hidden="true"></span>
          <span>{{ loading ? 'Memproses...' : 'Masuk' }}</span>
        </button>

      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";
import api from "../../utils/api";

export default defineComponent({
  name: "LoginView",
  setup() {
    const emailAddress = ref<string>("");
    const password     = ref<string>("");
    const loading      = ref<boolean>(false);
    const showPassword = ref<boolean>(false);
    const router       = useRouter();

    /* ── Bubbles ── */
    const bubbleData = [
      { id: 1, size: 200, top: -70,  right: -55, left: null, opacity: 0.13, delay: 0,   dur: 7  },
      { id: 2, size: 120, top:  10,  right: null, left: -35, opacity: 0.08, delay: 1,   dur: 9  },
      { id: 3, size:  75, top: 115,  right:  55, left: null, opacity: 0.13, delay: 0.5, dur: 6  },
      { id: 4, size:  50, top:  55,  right: null, left:  90, opacity: 0.10, delay: 2,   dur: 8  },
      { id: 5, size: 100, top: 150,  right: null, left: 140, opacity: 0.07, delay: 0.8, dur: 10 },
      { id: 6, size:  40, top:  30,  right: null, left: 200, opacity: 0.09, delay: 1.5, dur: 5.5},
    ];

    const bubbles = bubbleData.map((b) => ({
      id: b.id,
      style: {
        position:     "absolute" as const,
        borderRadius: "50%",
        background:   `rgba(255,255,255,${b.opacity})`,
        width:        `${b.size}px`,
        height:       `${b.size}px`,
        top:          `${b.top}px`,
        ...(b.right !== null ? { right: `${b.right}px` } : {}),
        ...(b.left  !== null ? { left:  `${b.left}px`  } : {}),
        animation:    `lbFloat ${b.dur}s ease-in-out ${b.delay}s infinite`,
        pointerEvents:"none" as const,
        zIndex:       "0",
      },
    }));

    /* ── Inject global keyframe (sekali saja) ── */
    let styleEl: HTMLStyleElement | null = null;
    onMounted(() => {
      if (!document.getElementById("lb-bubble-style")) {
        styleEl = document.createElement("style");
        styleEl.id = "lb-bubble-style";
        styleEl.textContent = `
          @keyframes lbFloat {
            0%,100% { transform: translateY(0)    scale(1);    }
            50%      { transform: translateY(-18px) scale(1.04); }
          }
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        `;
        document.head.appendChild(styleEl);
      }
    });
    onUnmounted(() => {
      if (styleEl && document.head.contains(styleEl)) {
        document.head.removeChild(styleEl);
      }
    });

    /* ── SweetAlert2 Toast helper ── */
    const Toast = Swal.mixin({
      toast: true,
      position: "top",
      showConfirmButton: false,
      timer: 0,                 // diatur manual per panggilan
      timerProgressBar: true,
      showCloseButton: true,
      customClass: {
        popup:        "lb-toast-popup",
        timerProgressBar: "lb-toast-bar",
      },
      didOpen: (popup) => {
        popup.addEventListener("mouseenter", Swal.stopTimer);
        popup.addEventListener("mouseleave", Swal.resumeTimer);
      },
    });

    const showToast = (
      icon: "success" | "error" | "warning",
      title: string,
      text: string,
      timer = 4000
    ) => {
      Toast.fire({ icon, title, text, timer });
    };

    /* ── Login handler ── */
    const handleLogin = async () => {
      if (!emailAddress.value.trim()) {
        showToast("warning", "Email wajib diisi", "Masukkan alamat email Anda.", 0);
        return;
      }
      if (!password.value) {
        showToast("warning", "Kata sandi wajib diisi", "Masukkan kata sandi Anda.", 0);
        return;
      }

      try {
        loading.value = true;

        const response = await api.post(
          "/api/v1/auth/login",
          { emailAddress: emailAddress.value.trim(), password: password.value },
          {
            headers: {
              "X-LOGIN-DEVICE": "web",
              "X-DEVICE-ID":    "browser-client",
              "X-DEVICE-NAME":  window.navigator.userAgent,
            },
          }
        );

        if (response.data?.data) {
          const userData = response.data.data;
          localStorage.setItem("user",  JSON.stringify(userData));
          localStorage.setItem("token", userData.jwtToken);

          const name = userData.fullName || userData.accountName || userData.registeredName || "Anda";
          showToast("success", "Login berhasil!", `Selamat datang kembali, ${name}.`, 3000);
          setTimeout(() => router.push("/"), 1500);
        } else {
          showToast("error", "Login gagal", response.data?.message || "Gagal mendapatkan data akun.", 0);
        }

      } catch (error: any) {
        const status    = error?.response?.status;
        const serverMsg: string = (error?.response?.data?.message || "").toLowerCase();

        if (status === 401) {
          // Coba deteksi dari pesan server apakah email atau password yang salah
          const isEmailWrong =
            serverMsg.includes("email") ||
            serverMsg.includes("not found") ||
            serverMsg.includes("tidak ditemukan") ||
            serverMsg.includes("not registered") ||
            serverMsg.includes("belum terdaftar") ||
            serverMsg.includes("user not") ||
            serverMsg.includes("account not");

          const isPasswordWrong =
            serverMsg.includes("password") ||
            serverMsg.includes("kata sandi") ||
            serverMsg.includes("wrong password") ||
            serverMsg.includes("incorrect") ||
            serverMsg.includes("invalid credential") ||
            serverMsg.includes("salah");

          if (isEmailWrong && !isPasswordWrong) {
            showToast(
              "error",
              "Email tidak ditemukan",
              "Alamat email Anda belum terdaftar. Periksa kembali.",
              0
            );
          } else if (isPasswordWrong && !isEmailWrong) {
            showToast(
              "error",
              "Kata sandi salah",
              "Kata sandi Anda tidak sesuai. Harap dicek kembali.",
              0
            );
          } else {
            // Server tidak memberi info spesifik — tampilkan dua kemungkinan
            showToast(
              "error",
              "Email atau kata sandi salah",
              "Periksa kembali email dan kata sandi Anda.",
              0
            );
          }
        } else if (status === 403) {
          showToast("error", "Akun dinonaktifkan", "Hubungi administrator untuk bantuan.", 0);
        } else if (status === 404) {
          showToast(
            "error",
            "Email tidak ditemukan",
            "Alamat email Anda belum terdaftar di sistem.",
            0
          );
        } else if (status === 429) {
          showToast("warning", "Terlalu banyak percobaan", "Tunggu beberapa menit lalu coba lagi.", 0);
        } else if (!navigator.onLine) {
          showToast("error", "Tidak ada koneksi", "Periksa jaringan Anda lalu coba lagi.", 0);
        } else {
          showToast(
            "error",
            "Terjadi kesalahan",
            error?.response?.data?.message || "Server tidak merespons. Coba lagi.",
            0
          );
        }
      } finally {
        loading.value = false;
      }
    };

    return {
      emailAddress, password, loading, showPassword,
      bubbles, handleLogin,
    };
  },
});
</script>

<style scoped>
/* ── Font ── */
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

/* ── Page ── */
.login-page {
  min-height: 100vh;
  background: #C8940F;
  display: flex;
  flex-direction: column;
  font-family: 'Plus Jakarta Sans', sans-serif;
  position: relative;
  overflow: hidden;
}

/* ── Logo area ── */
.login-top {
  position: relative;
  z-index: 1;
  padding: 52px 28px 64px;
  display: flex;
  justify-content: center;
}
.logo-row    { display: flex; align-items: center; gap: 14px; }
.logo-text   { display: flex; flex-direction: column; gap: 4px; }
.logo-name   { font-size: 32px; font-weight: 800; color: #fff; letter-spacing: -.5px; line-height: 1; display: block; }
.logo-name em{ font-style: normal; color: rgba(255,255,255,.6); }
.logo-tagline{ font-size: 11px; color: rgba(255,255,255,.6); letter-spacing: .7px; text-transform: uppercase; font-weight: 500; }

/* ── Card ── */
.login-card {
  position: relative;
  z-index: 1;
  background: #fff;
  border-radius: 28px 28px 0 0;
  flex: 1;
  padding: 34px 26px 56px;
  margin-top: -24px;
  box-shadow: 0 -8px 40px rgba(0,0,0,.10);
}
.card-title { font-size: 22px; font-weight: 800; color: #1a1a1a; margin-bottom: 4px; letter-spacing: -.3px; }
.card-sub   { font-size: 13px; color: #aaa; margin-bottom: 28px; font-weight: 400; }

/* ── Fields ── */
.login-field  { margin-bottom: 16px; }
.login-label  { display: block; font-size: 12.5px; font-weight: 600; color: #555; margin-bottom: 7px; }
.inp-wrap     { position: relative; }
.inp-icon     { position: absolute; left: 13px; top: 50%; transform: translateY(-50%); font-size: 17px; color: #c8a850; pointer-events: none; z-index: 1; }
.login-input  {
  width: 100%;
  background: #f8f2e3;
  border: 2px solid transparent;
  border-radius: 13px;
  padding: 13px 46px 13px 42px;
  font-size: 14.5px;
  color: #1a1a1a;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-weight: 500;
  outline: none;
  transition: border-color .2s, background .2s, box-shadow .2s;
  -webkit-appearance: none;
}
.login-input:focus        { border-color: #C8940F; background: #fffcf2; box-shadow: 0 0 0 4px rgba(200,148,15,.12); }
.login-input::placeholder { color: #c8b07a; font-weight: 400; }
.eye-btn {
  position: absolute; right: 13px; top: 50%; transform: translateY(-50%);
  background: none; border: none; cursor: pointer; color: #c8a850;
  font-size: 17px; padding: 2px; line-height: 1; transition: color .15s;
}
.eye-btn:hover { color: #8a7030; }

/* ── Forgot ── */
.forgot-row { text-align: right; margin: -4px 0 22px; }
.forgot-link { font-size: 12.5px; font-weight: 600; color: #C8940F; text-decoration: none; }
.forgot-link:hover { text-decoration: underline; }

/* ── Button ── */
.login-btn {
  width: 100%; background: #C8940F; color: #fff; border: none;
  border-radius: 13px; padding: 15px; font-size: 15px; font-weight: 700;
  font-family: 'Plus Jakarta Sans', sans-serif; letter-spacing: .2px;
  cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;
  transition: background .2s, transform .1s, box-shadow .2s;
  box-shadow: 0 4px 18px rgba(200,148,15,.40);
}
.login-btn:hover:not(:disabled)  { background: #a87a0c; box-shadow: 0 6px 22px rgba(200,148,15,.48); }
.login-btn:active:not(:disabled) { transform: scale(.98); }
.login-btn:disabled              { opacity: .65; cursor: not-allowed; box-shadow: none; }
.btn-spin {
  width: 15px; height: 15px;
  border: 2.5px solid rgba(255,255,255,.35); border-top-color: #fff;
  border-radius: 50%; animation: bspin .65s linear infinite; flex-shrink: 0;
}
@keyframes bspin { to { transform: rotate(360deg); } }

/* ── Responsive ── */
@media (min-width: 600px) {
  .login-page {
    align-items: center; justify-content: center;
    background: #ede8df; padding: 40px 16px;
  }
  .login-top {
    width: 100%; max-width: 460px;
    background: #C8940F;
    border-radius: 24px 24px 0 0;
    padding: 40px 32px 60px;
    overflow: hidden;
  }
  .login-card {
    width: 100%; max-width: 460px; flex: 0 0 auto;
    border-radius: 0 0 24px 24px; padding: 36px 40px 48px; margin-top: 0;
  }
}
@media (max-width: 360px) {
  .login-card { padding: 28px 20px 40px; }
  .login-top  { padding: 40px 20px 56px; }
  .logo-name  { font-size: 26px; }
}
</style>

<style>
/* SweetAlert2 toast override — TIDAK scoped agar bisa style popup global */
.lb-toast-popup {
  font-family: 'Plus Jakarta Sans', sans-serif !important;
  border-radius: 14px !important;
  padding: 12px 16px !important;
  font-size: 13px !important;
  box-shadow: 0 8px 32px rgba(0,0,0,.14) !important;
  max-width: 360px !important;
}
.lb-toast-popup .swal2-title {
  font-size: 14px !important;
  font-weight: 700 !important;
  color: #1a1a1a !important;
  padding: 0 !important;
  margin: 0 0 2px !important;
}
.lb-toast-popup .swal2-html-container,
.lb-toast-popup .swal2-content {
  font-size: 12.5px !important;
  color: #555 !important;
  margin: 0 !important;
  padding: 0 !important;
}
.lb-toast-popup.swal2-icon-success { border-left: 4px solid #1D9E75 !important; }
.lb-toast-popup.swal2-icon-error   { border-left: 4px solid #E24B4A !important; }
.lb-toast-popup.swal2-icon-warning { border-left: 4px solid #EF9F27 !important; }
.lb-toast-bar { background: #C8940F !important; }
</style>