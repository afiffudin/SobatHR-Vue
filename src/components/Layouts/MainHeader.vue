<template>
  <header
    :class="[
      'header-area bg-white text-center text-md-start pt-15 pb-15 ps-15 pe-15 ps-md-20 pe-md-20 pe-lg-30 transition mb-25 position-fixed',
      { sticky: isSticky },
    ]"
    id="header"
  >
    <div class="row align-items-center">
      <div class="col-xl-4 col-lg-5 col-md-6">
        <div
          class="header-left-side justify-content-center justify-content-md-start d-flex align-items-center"
        >
          <button
            class="header-burger-menu transition position-relative lh-1 bg-transparent p-0 border-0"
            id="header-burger-menu"
            @click="stateStoreInstance.onChange"
          >
            <i class="flaticon-menu-3"></i>
          </button>
          <form class="search-box">
            <div class="input-group">
              <input
                type="text"
                class="form-control shadow-none rounded-0 border-0"
                placeholder="Search here"
              />
              <button
                class="default-btn position-relative transition border-0 fw-medium text-white pt-8 pb-8 ps-15 pe-15 pt-md-12 pb-md-12 ps-md-20 pe-md-20"
                type="button"
              >
                Search
                <i
                  class="flaticon-search-interface-symbol position-relative ms-5 top-1"
                ></i>
              </button>
            </div>
          </form>
        </div>
      </div>
      <div class="col-xl-8 col-lg-7 col-md-6">
        <div
          class="header-right-side d-flex align-items-center justify-content-center justify-content-md-end"
        >
          <LightDarkSwtichBtn />
          
          <div class="dropdown profile-dropdown">
            <button
              class="dropdown-toggle text-start fs-14 text-black-emphasis d-flex align-items-center p-0 position-relative bg-transparent border-0 transition lh-1"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <img
                src="../../assets/images/admin.jpg"
                class="rounded"
                width="44"
                height="44"
                alt="admin"
              />
              <span class="title d-none d-lg-block ms-10 ms-lg-15">
                <span class="d-block fw-bold mb-5 mb-md-8">
                  {{ userProfile.name || userProfile.emailAddress || 'User Sobat HR' }}
                </span>
                <span class="text-body-emphasis fw-semibold fs-13">
                  {{ userProfile.role || 'Staff' }}
                </span>
              </span>
            </button>
            <div
              class="dropdown-menu rounded-0 bg-white border-0 start-auto end-0"
            >
              <ul class="ps-0 mb-0 list-unstyled dropdown-body">
                <li
                  class="text-body-secondary fw-semibold transition position-relative"
                >
                  <i class="flaticon-user-2"></i>
                  My Account
                  <router-link
                    to="/profile"
                    class="d-block position-absolute start-0 top-0 end-0 bottom-0 text-decoration-none"
                  ></router-link>
                </li>
                <li
                  class="text-body-secondary fw-semibold transition position-relative"
                >
                  <i class="flaticon-setting"></i>
                  Settings
                  <router-link
                    to="/profile-settings"
                    class="d-block position-absolute start-0 top-0 end-0 bottom-0 text-decoration-none"
                  ></router-link>
                </li>
                <li
                  class="text-body-secondary fw-semibold transition position-relative"
                >
                  <i class="flaticon-warning"></i>
                  Support
                  <router-link
                    to="/support-desk-card"
                    class="d-block position-absolute start-0 top-0 end-0 bottom-0 text-decoration-none"
                  ></router-link>
                </li>
                <li
                  class="text-body-secondary fw-semibold transition position-relative"
                >
                  <i class="flaticon-logout"></i>
                  Logout
                  <a
                    href="#"
                    @click.prevent="handleLogout"
                    class="d-block position-absolute start-0 top-0 end-0 bottom-0 text-decoration-none"
                  ></a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router"; 
import Swal from "sweetalert2"; // IMPORT: Mengimpor SweetAlert2 untuk memunculkan notifikasi pop-up
import LightDarkSwtichBtn from "./LightDarkSwtichBtn.vue";
import stateStore from "../../utils/store";

export default defineComponent({
  name: "MainHeader",
  components: {
    LightDarkSwtichBtn,
  },
  setup() {
    const stateStoreInstance = stateStore;
    const isSticky = ref(false);
    const router = useRouter(); 

    onMounted(() => {
      window.addEventListener("scroll", () => {
        let scrollPos = window.scrollY;
        isSticky.value = scrollPos >= 100;
      });
    });

    const userProfile = computed(() => {
      const dataJson = localStorage.getItem("user");
      if (dataJson) {
        try {
          return JSON.parse(dataJson);
        } catch (e) {
          return {};
        }
      }
      return {};
    });

    // --- REVISI FUNGSI LOGOUT (Dengan Konfirmasi & Dialog Sukses) ---
    const handleLogout = () => {
     
      // window.location.href = "/login"; // atau router.push('/login')
      Swal.fire({
        title: "Apakah yakin ingin logout?",
        text: "Anda harus login kembali untuk mengakses dashboard.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Ya, Keluar!",
        cancelButtonText: "Batal",
        heightAuto: false // Mencegah bentrok layouting bootstrap dengan sweetalert
      }).then((result) => {
        // Jika pengguna menekan tombol "Ya, Keluar!"
        if (result.isConfirmed) {
          // 1. Bersihkan session penyimpanan lokal browser
          localStorage.removeItem("token");
          localStorage.removeItem("user");

          // 2. Munculkan pop-up alert sukses logout berdurasi 1.5 detik
          Swal.fire({
            title: "Berhasil Logout!",
            text: "Anda telah keluar dari sistem aman.",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
            heightAuto: false
          });

          // 3. Arahkan user kembali ke halaman login setelah token terhapus
          router.push("/login");
        }
      });
    };

    return {
      isSticky,
      stateStoreInstance,
      userProfile, 
      handleLogout, 
    };
  },
});
</script>