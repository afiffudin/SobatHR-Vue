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
        <div class="header-left-side justify-content-center justify-content-md-start d-flex align-items-center">
          <button
            class="header-burger-menu transition position-relative lh-1 bg-transparent p-0 border-0"
            id="header-burger-menu"
            @click="stateStoreInstance?.onChange?.()"
          >
            <i class="flaticon-menu-3"></i>
          </button>
        </div>
      </div>

      <div class="col-xl-8 col-lg-7 col-md-6">
        <div class="header-right-side d-flex align-items-center justify-content-center justify-content-md-end">
          <button
            class="profile-trigger-btn d-flex align-items-center p-0 border-0 bg-transparent transition lh-1"
            @click="openProfileModal"
          >
            <img
              :src="getProfilePicture()"
              class="rounded"
              width="44"
              height="44"
              alt="Profile"
              style="object-fit: cover;"
            />
            <span class="title d-none d-lg-block ms-10 ms-lg-15">
              <span class="d-block fw-bold mb-5 mb-md-8">{{ employeeData?.fullName || accountData?.registeredName || userProfile.accountName || 'User' }}</span>
              <span class="text-body-emphasis fw-semibold fs-13">Staff</span>
            </span>
          </button>
        </div>
      </div>
    </div>
  </header>

  <!-- Profile Modal Overlay -->
  <teleport to="body">
    <transition name="modal-fade">
      <div
        v-if="showProfileModal"
        class="pm-overlay"
        @click.self="showProfileModal = false"
      >
        <div class="pm-modal" role="dialog" aria-modal="true" aria-label="My Account">

          <!-- Modal Header -->
          <div class="pm-header">
            <div class="pm-header-title">
              <i class="flaticon-user-2 me-2"></i>
              My Account
            </div>
            <button class="pm-close-btn" @click="showProfileModal = false" aria-label="Tutup">
              <i class="flaticon-x"></i>
            </button>
          </div>

          <!-- Loading State -->
          <div v-if="loadingProfile" class="pm-loading">
            <div class="pm-skeleton pm-skeleton-avatar"></div>
            <div class="pm-skeleton-lines">
              <div class="pm-skeleton pm-skeleton-line"></div>
              <div class="pm-skeleton pm-skeleton-line short"></div>
            </div>
          </div>

          <!-- Content: tampil jika minimal salah satu data sudah ada -->
          <template v-else-if="employeeData || accountData">
            <!-- Hero: gabungan foto (employee) + nama + status aktif (account) -->
            <div class="pm-hero">
              <img
                :src="getProfilePicture()"
                class="pm-hero-avatar"
                width="52"
                height="52"
                alt="Avatar"
              />
              <div class="pm-hero-info">
                <div class="pm-hero-name">{{ employeeData?.fullName || accountData?.registeredName || userProfile.accountName || '-' }}</div>
                <div class="pm-hero-sub" v-if="employeeData?.position?.name">{{ employeeData.position.name }}</div>
                <div class="pm-hero-sub" v-if="employeeData?.department?.name">{{ employeeData.department.name }}</div>
                <span class="pm-active-badge" v-if="accountData?.active !== false">
                  <span class="pm-dot"></span> Aktif
                </span>
                <span class="pm-inactive-badge" v-else>
                  <span class="pm-dot inactive"></span> Nonaktif
                </span>
              </div>
            </div>

            <!-- Scroll Content -->
            <div class="pm-body">

              <!-- ── Akun (dari /security/user/{id}/detail) ── -->
              <div class="pm-section" v-if="accountData">
                <p class="pm-section-label">Informasi Akun</p>
                <div class="pm-info-row">
                  <span class="pm-key">Email</span>
                  <span class="pm-val">{{ accountData.emailAddress || '-' }}</span>
                </div>
                <div class="pm-info-row">
                  <span class="pm-key">Nama Terdaftar</span>
                  <span class="pm-val">{{ accountData.registeredName || '-' }}</span>
                </div>
                <div class="pm-info-row">
                  <span class="pm-key">Status</span>
                  <span :class="accountData.active ? 'pm-val pm-val-active' : 'pm-val pm-val-inactive'">
                    {{ accountData.active ? 'Aktif' : 'Nonaktif' }}
                  </span>
                </div>
              </div>

              <!-- ── Role & Akses (dari /security/user/{id}/detail) ── -->
              <!-- <div class="pm-section" v-if="accountData">
                <p class="pm-section-label">Role & Akses</p>
                <div v-if="accountData.selectedRoles && accountData.selectedRoles.length" class="pm-roles-list">
                  <div v-for="role in accountData.selectedRoles" :key="role.id" class="pm-role-chip">
                    <div class="pm-role-chip-left">
                      <i class="flaticon-shield pm-role-icon"></i>
                    </div>
                    <div class="pm-role-chip-body">
                      <div class="pm-role-top">
                        <span class="pm-role-name">{{ role.name }}</span>
                        <span v-if="role.isActive" class="pm-role-badge">Active</span>
                      </div>
                      <div class="pm-role-desc">{{ role.description }}</div>
                    </div>
                  </div>
                </div>
                <div v-else class="pm-empty">
                  <i class="flaticon-info-circle me-2"></i>
                  Tidak ada role yang ditetapkan
                </div>
              </div> -->

              <!-- ── Kantor Cabang (dari /security/user/{id}/detail) ── -->
              <!-- <div class="pm-section" v-if="accountData">
                <p class="pm-section-label">Kantor Cabang Ditugaskan</p>
                <div v-if="accountData.selectedCompanyBranches && accountData.selectedCompanyBranches.length">
                  <div v-for="branch in accountData.selectedCompanyBranches" :key="branch.id" class="pm-branch-item">
                    <i class="flaticon-pin pm-branch-icon"></i>
                    <span>{{ branch.name }}</span>
                  </div>
                </div>
                <div v-else class="pm-empty">
                  <i class="flaticon-pin me-2"></i>
                  Belum ada cabang yang ditugaskan
                </div>
              </div> -->

              <!-- ── Informasi Karyawan (dari /getPersonalInformation) ── -->
              <div class="pm-section" v-if="employeeData">
                <p class="pm-section-label">Informasi Karyawan</p>
                <div class="pm-info-row">
                  <span class="pm-key">No. Karyawan</span>
                  <span class="pm-val">{{ employeeData.employeeNo || '-' }}</span>
                </div>
                <div class="pm-info-row">
                  <span class="pm-key">Nama Lengkap</span>
                  <span class="pm-val">{{ employeeData.fullName || '-' }}</span>
                </div>
                <div class="pm-info-row">
                  <span class="pm-key">Nickname</span>
                  <span class="pm-val">{{ employeeData.nickname || '-' }}</span>
                </div>
                <div class="pm-info-row">
                  <span class="pm-key">Gender</span>
                  <span class="pm-val">{{ employeeData.gender === 'MALE' ? 'Laki-laki' : employeeData.gender === 'FEMALE' ? 'Perempuan' : '-' }}</span>
                </div>
                <div class="pm-info-row">
                  <span class="pm-key">Kantor Cabang</span>
                  <span class="pm-val">{{ employeeData.companyBranch?.name || '-' }}</span>
                </div>
                <!-- <div class="pm-info-row">
                  <span class="pm-key">Shift</span>
                  <span class="pm-val">{{ employeeData.shift?.name || '-' }}</span>
                </div> -->
              </div>

            </div><!-- end pm-body -->

            <!-- Footer Actions -->
            <div class="pm-footer">
              <!-- <router-link
                to="/profile"
                class="pm-btn pm-btn-secondary"
                @click="showProfileModal = false"
              >
                <i class="flaticon-user-2 me-2"></i>Edit Profil
              </router-link> -->
              <button class="pm-btn pm-btn-danger" @click="handleLogout">
                <i class="flaticon-logout me-2"></i>Logout
              </button>
            </div>

          </template>

          <!-- Error State -->
          <div v-else class="pm-error-state">
            <i class="flaticon-info-circle pm-error-icon"></i>
            <p class="pm-error-msg">{{ fetchError || 'Gagal memuat data profil.' }}</p>
            <button class="pm-btn-retry" @click="fetchAllProfile">
              <i class="flaticon-refresh me-1"></i> Coba Lagi
            </button>
          </div>

        </div>
      </div>
    </transition>
  </teleport>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed, watch } from "vue";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";
import api from "@/utils/api";
import stateStore from "../../utils/store";

export default defineComponent({
  name: "MainHeader",
  setup() {
    const stateStoreInstance = stateStore;
    const isSticky = ref(false);
    const router = useRouter();

    // Data dari /getPersonalInformation (info karyawan)
    const employeeData = ref<any>(null);
    // Data dari /security/user/{id}/detail (info akun: email, role, status)
    const accountData = ref<any>(null);

    const showProfileModal = ref(false);
    const loadingProfile = ref(false);
    const fetchError = ref<string | null>(null);

    // User dari localStorage — dipakai untuk ambil userId
    const userProfile = computed(() => {
      const dataJson = localStorage.getItem("user");
      return dataJson ? JSON.parse(dataJson) : {};
    });

    const extractData = (raw: any): any | null => {
      if (!raw) return null;
      if (raw.data && typeof raw.data === "object") return raw.data;
      if (raw.id || raw.fullName || raw.employeeNo || raw.emailAddress) return raw;
      return null;
    };

    const fetchAllProfile = async () => {
      loadingProfile.value = true;
      fetchError.value = null;
      employeeData.value = null;
      accountData.value = null;

      try {
        // Fetch kedua endpoint secara paralel
        const userId = userProfile.value?.id || userProfile.value?.userId || userProfile.value?.accountId;

        const requests: Promise<any>[] = [
          api.get("/api/v1/general/getPersonalInformation"),
        ];

        if (userId) {
          requests.push(api.get(`/api/v1/security/user/${userId}/detail`));
        }

        const results = await Promise.allSettled(requests);

        // Hasil endpoint 1: employee data
        if (results[0].status === "fulfilled") {
          const emp = extractData(results[0].value.data);
          if (emp) employeeData.value = { ...emp };
          else console.warn("[MainHeader] employee data tidak dikenali:", results[0].value.data);
        } else {
          console.error("[MainHeader] getPersonalInformation gagal:", results[0].reason);
        }

        // Hasil endpoint 2: account data
        if (results[1] && results[1].status === "fulfilled") {
          const acc = extractData(results[1].value.data);
          if (acc) accountData.value = { ...acc };
          else console.warn("[MainHeader] account data tidak dikenali:", results[1].value.data);
        } else if (results[1]) {
          console.error("[MainHeader] user detail gagal:", (results[1] as PromiseRejectedResult).reason);
          // Jika endpoint 2 gagal, coba ambil dari localStorage sebagai fallback
          const local = userProfile.value;
          if (local?.emailAddress || local?.email) {
            accountData.value = {
              emailAddress: local.emailAddress || local.email,
              registeredName: local.accountName || local.registeredName,
              active: true,
              selectedRoles: local.selectedRoles || [],
              selectedCompanyBranches: local.selectedCompanyBranches || [],
            };
          }
        } else if (!userId) {
          // userId tidak ada di localStorage — fallback dari localStorage
          const local = userProfile.value;
          accountData.value = {
            emailAddress: local.emailAddress || local.email || "-",
            registeredName: local.accountName || local.registeredName || "-",
            active: true,
            selectedRoles: local.selectedRoles || [],
            selectedCompanyBranches: local.selectedCompanyBranches || [],
          };
        }

        // Minimal salah satu harus berhasil
        if (!employeeData.value && !accountData.value) {
          fetchError.value = "Gagal memuat data profil.";
        }

      } catch (error: any) {
        console.error("[MainHeader] fetchAllProfile error:", error);
        fetchError.value = "Terjadi kesalahan. Silakan coba lagi.";
      } finally {
        loadingProfile.value = false;
      }
    };

    // Fetch setiap kali modal dibuka
    watch(showProfileModal, (isOpen) => {
      if (isOpen) fetchAllProfile();
    });

    const openProfileModal = () => {
      showProfileModal.value = true;
    };

    const getProfilePicture = (): string => {
      const url = employeeData.value?.employeeDocument?.employeePicture?.imageUrl;
      const name =
        employeeData.value?.fullName ||
        accountData.value?.registeredName ||
        userProfile.value?.accountName ||
        "User";
      return url || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=e1f5ee&color=085041`;
    };

    const handleLogout = () => {
      showProfileModal.value = false;
      Swal.fire({
        title: "Logout?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Ya",
        cancelButtonText: "Batal",
      }).then((result) => {
        if (result.isConfirmed) {
          localStorage.clear();
          router.push("/login");
        }
      });
    };

    onMounted(() => {
      window.addEventListener("scroll", () => {
        isSticky.value = window.scrollY >= 100;
      });
    });

    return {
      isSticky,
      stateStoreInstance,
      userProfile,
      getProfilePicture,
      handleLogout,
      showProfileModal,
      openProfileModal,
      employeeData,
      accountData,
      loadingProfile,
      fetchError,
      fetchAllProfile,
    };
  },
});
</script>

<style scoped>
/* ── Profile Trigger Button ── */
.profile-trigger-btn {
  cursor: pointer;
  gap: 0;
}
.profile-trigger-btn:hover img {
  opacity: 0.85;
}

/* ── Overlay ── */
.pm-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  padding: 70px 24px 0;
}

/* ── Modal Box ── */
.pm-modal {
  background: #ffffff;
  border-radius: 14px;
  border: 0.5px solid #e0e0e0;
  width: 340px;
  max-height: calc(100vh - 90px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* ── Modal Header ── */
.pm-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border-bottom: 0.5px solid #ebebeb;
  flex-shrink: 0;
}
.pm-header-title {
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
}
.pm-close-btn {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 0.5px solid #e0e0e0;
  background: #f7f7f7;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #666;
  font-size: 13px;
  transition: background 0.15s;
}
.pm-close-btn:hover {
  background: #eee;
}

/* ── Hero ── */
.pm-hero {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px;
  background: #f6faf7;
  border-bottom: 0.5px solid #ebebeb;
  flex-shrink: 0;
}
.pm-hero-avatar {
  border-radius: 10px;
  object-fit: cover;
  flex-shrink: 0;
}
.pm-hero-name {
  font-size: 15px;
  font-weight: 600;
  color: #1a1a1a;
}
.pm-hero-email {
  font-size: 12px;
  color: #666;
  margin-top: 2px;
  word-break: break-all;
}
.pm-active-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  margin-top: 6px;
  font-size: 11px;
  font-weight: 500;
  color: #085041;
  background: #e1f5ee;
  border: 0.5px solid #9fe1cb;
  padding: 2px 9px;
  border-radius: 20px;
}
.pm-inactive-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  margin-top: 6px;
  font-size: 11px;
  font-weight: 500;
  color: #a32d2d;
  background: #fcebeb;
  border: 0.5px solid #f09595;
  padding: 2px 9px;
  border-radius: 20px;
}
.pm-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #1d9e75;
  display: inline-block;
}
.pm-dot.inactive {
  background: #e24b4a;
}

/* ── Scrollable Body ── */
.pm-body {
  flex: 1;
  overflow-y: auto;
  overscroll-behavior: contain;
}
.pm-body::-webkit-scrollbar {
  width: 4px;
}
.pm-body::-webkit-scrollbar-thumb {
  background: #d0d0d0;
  border-radius: 4px;
}

/* ── Sections ── */
.pm-section {
  padding: 12px 16px;
  border-bottom: 0.5px solid #f0f0f0;
}
.pm-section-label {
  font-size: 11px;
  font-weight: 600;
  color: #999;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  margin-bottom: 10px;
}

/* ── Info Rows ── */
.pm-info-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 5px 0;
}
.pm-key {
  font-size: 12px;
  color: #888;
  flex-shrink: 0;
  min-width: 110px;
}
.pm-val {
  font-size: 12px;
  font-weight: 500;
  color: #1a1a1a;
  text-align: right;
  word-break: break-all;
}
.pm-val-mono {
  font-family: monospace;
  font-size: 11px;
  color: #666;
}
.pm-val-active {
  color: #0f6e56;
}
.pm-val-inactive {
  color: #a32d2d;
}

/* ── Role Chips ── */
.pm-roles-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.pm-role-chip {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  background: #f0eefe;
  border: 0.5px solid #afa9ec;
  border-radius: 8px;
  padding: 10px 12px;
}
.pm-role-chip-left {
  flex-shrink: 0;
  margin-top: 1px;
}
.pm-role-icon {
  font-size: 16px;
  color: #534ab7;
}
.pm-role-chip-body {
  flex: 1;
}
.pm-role-top {
  display: flex;
  align-items: center;
  gap: 8px;
}
.pm-role-name {
  font-size: 13px;
  font-weight: 600;
  color: #3c3489;
}
.pm-role-badge {
  font-size: 10px;
  font-weight: 500;
  background: #e1f5ee;
  color: #085041;
  border: 0.5px solid #9fe1cb;
  padding: 2px 7px;
  border-radius: 10px;
}
.pm-role-desc {
  font-size: 11px;
  color: #534ab7;
  margin-top: 2px;
}

/* ── Branch Items ── */
.pm-branch-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #1a1a1a;
  padding: 6px 0;
  border-bottom: 0.5px solid #f5f5f5;
}
.pm-branch-icon {
  font-size: 15px;
  color: #888;
}

/* ── Empty State ── */
.pm-empty {
  font-size: 12px;
  color: #999;
  background: #f7f7f7;
  border-radius: 8px;
  padding: 10px 12px;
  display: flex;
  align-items: center;
}

/* ── Loading Skeleton ── */
.pm-loading {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px 16px;
}
.pm-skeleton {
  background: #efefef;
  border-radius: 6px;
  animation: pm-shimmer 1.2s infinite;
}
.pm-skeleton-avatar {
  width: 52px;
  height: 52px;
  border-radius: 10px;
  flex-shrink: 0;
}
.pm-skeleton-lines {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.pm-skeleton-line {
  height: 13px;
  width: 100%;
}
.pm-skeleton-line.short {
  width: 60%;
}
@keyframes pm-shimmer {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

/* ── Footer ── */
.pm-footer {
  display: flex;
  gap: 8px;
  padding: 12px 16px;
  border-top: 0.5px solid #ebebeb;
  flex-shrink: 0;
}
.pm-btn {
  flex: 1;
  padding: 9px 12px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  transition: opacity 0.15s;
}
.pm-btn:hover {
  opacity: 0.85;
}
.pm-btn-secondary {
  background: #f5f5f5;
  border: 0.5px solid #d0d0d0;
  color: #333;
}
.pm-btn-danger {
  background: #fcebeb;
  border: 0.5px solid #f09595;
  color: #a32d2d;
}

/* ── Error State ── */
.pm-error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px 20px;
  gap: 10px;
  text-align: center;
}
.pm-error-icon {
  font-size: 28px;
  color: #e24b4a;
}
.pm-error-msg {
  font-size: 13px;
  color: #666;
  line-height: 1.5;
}
.pm-btn-retry {
  font-size: 12px;
  font-weight: 500;
  color: #185fa5;
  background: #e6f1fb;
  border: 0.5px solid #85b7eb;
  border-radius: 8px;
  padding: 6px 16px;
  cursor: pointer;
  transition: opacity 0.15s;
}
.pm-btn-retry:hover {
  opacity: 0.8;
}

/* ── Modal Transition ── */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
.modal-fade-enter-active .pm-modal,
.modal-fade-leave-active .pm-modal {
  transition: transform 0.2s ease;
}
.modal-fade-enter-from .pm-modal {
  transform: translateY(-8px);
}
.modal-fade-leave-to .pm-modal {
  transform: translateY(-8px);
}
</style>