<template>
  <div class="employee-profile-wrapper p-2 p-md-3 animate__animated animate__fadeIn">

    <div class="card border-0 shadow-sm rounded-4 mb-3 overflow-hidden header-glass">
      <div class="card-body p-3">
        <div class="d-flex flex-column flex-md-row align-items-center gap-3">
          <div class="profile-avatar position-relative">
            <img 
              :src="employee?.employeeDocument?.employeePicture?.imageUrl || 'https://ui-avatars.com/api/?name=' + (employee?.fullName || 'User')" 
              class="rounded-4 border border-3 border-white shadow-sm"
              style="width: 100px; height: 100px; object-fit: cover;"
            >
            <div class="status-indicator animate__animated animate__pulse animate__infinite"></div>
          </div>

          <div class="flex-grow-1 text-center text-md-start">
            <h2 class="fw-black mb-1 text-slate-900 h4">{{ employee?.fullName || 'Loading...' }}</h2>
            <div class="d-flex flex-wrap justify-content-center justify-content-md-start gap-2 mt-1">
              <span class="badge-custom"><i class="bi bi-hash"></i> {{ employee?.employeeEmploymentInfo?.employeeNo || '-' }}</span>
              <span class="badge-custom">
                <i class="bi bi-briefcase"></i> 
                {{ typeof employee?.employeeEmploymentInfo?.position === 'object' ? employee?.employeeEmploymentInfo?.position?.name : (employee?.employeeEmploymentInfo?.position || 'Staff') }}
              </span>
            </div>
          </div>

          <!-- <div class="d-flex gap-2">
            <button v-if="isEditMode" class="btn btn-sm btn-outline-secondary px-3" @click="cancelEdit">Batal</button>
            <button v-else class="btn btn-sm btn-outline-primary px-3" @click="back">Batal<i class="bi bi-arrow-left"></i></button>

            <button class="btn btn-sm shadow-sm px-3"
              :class="isEditMode ? 'btn-success' : 'btn-primary'"
              @click="isEditMode = !isEditMode" ></button>
              <i class="bi" :class="isEditMode ? 'bi-check-lg' : 'bi-pencil-square'"></i>
              <span class="ms-2 fw-bold">{{ isEditMode ? 'Simpan Keseluruhan' : 'Update Data' }}</span> -->
            <!-- </button> -->
          <!-- </div> -->
        </div>
      </div>
    </div>

    <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
      
      <div class="bg-white border-bottom">
        <ul class="nav nav-pills p-2 flex-nowrap overflow-auto hide-scrollbar">
          <li v-for="tab in tabList" :key="tab.key">
            <button class="nav-link custom-tab-btn me-2 py-1 px-3"
              :class="{ active: activeTab === tab.key }"
              @click="activeTab = tab.key">
              {{ tab.label }}
            </button>
          </li>
        </ul>
      </div>

      <div class="card-body p-3 p-md-4">
        <transition name="fade" mode="out-in">
          <div :key="activeTab">
          <div v-if="activeTab === 'personal'">
            <h6 class="section-title mb-3 text-gradient">Biodata Pribadi</h6>

            <div class="text-end mb-3" v-if="isEditMode">
              <button class="btn btn-success btn-sm" @click="savePersonal">
                <i class="bi bi-check-lg"></i> Simpan Biodata Karyawan
              </button>
            </div>

            <div class="row g-3">
              <div class="col-12 col-md-4" v-for="field in personalFields" :key="field.key">
                <div class="data-tile" :class="{ editing: isEditMode }">
                  
                  <label class="data-label">{{ field.label }}</label>

                  <template v-if="isEditMode">
                    <!-- SELECT -->
                    <select 
                      v-if="field.type === 'select'" 
                      v-model="form[field.key]" 
                      class="form-select custom-input mt-2"
                    >
                      <option value="MALE">Laki-laki</option>
                      <option value="FEMALE">Perempuan</option>
                    </select>

                    <!-- INPUT -->
                    <input 
                      v-else 
                      :type="field.type || 'text'" 
                      v-model="form[field.key]" 
                      class="form-control custom-input mt-2"
                    >
                  </template>

                  <!-- VIEW MODE -->
                  <p v-else class="data-value mt-2">
                    {{ employee?.[field.key] || '-' }}
                  </p>

                </div>
              </div>
            </div>
          </div>

            <div v-else-if="activeTab === 'employment'">
              <h6 class="section-title mb-3 text-gradient">Detail Jabatan & Kontrak</h6>
              <div class="text-end mb-3" v-if="isEditMode">
                <button class="btn btn-success btn-sm" @click="saveEmployment">
                  <i class="bi bi-check-lg"></i> Simpan Employee
                </button>
              </div>
              <div class="row g-3">
                <div class="col-md-6 col-12" v-for="f in employmentFields" :key="f.key">
                  <div class="data-tile tile-blue" :class="{ editing: isEditMode }">
                    <label class="data-label">{{ f.label }}</label>
                    <input v-if="isEditMode" :type="f.type || 'text'" v-model="form.employeeEmploymentInfo[f.key]" class="form-control custom-input mt-1">
                    <p v-else class="data-value">
                      {{ typeof employee?.employeeEmploymentInfo?.[f.key] === 'object' ? employee?.employeeEmploymentInfo?.[f.key]?.name : (employee?.employeeEmploymentInfo?.[f.key] || '-') }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div v-else-if="activeTab === 'payroll'">
              <h6 class="section-title mb-3 text-gradient">Informasi Penggajian</h6>
                <div class="text-end mb-3" v-if="isEditMode">
                <button class="btn btn-success btn-sm" @click="savePayroll">
                  <i class="bi bi-check-lg"></i> Simpan Payroll
                </button>
              </div> 
              <div class="bank-card p-3 rounded-4 text-white mb-4 shadow-sm">
                <div class="row align-items-center">
                  <div class="col-md-6">
                    <label class="tiny-label opacity-75">NAMA BANK</label>
                    <input v-if="isEditMode" v-model="form.employeePayroll.bankName" class="form-ghost w-100 fw-bold" placeholder="Contoh: BCA">
                    <h5 v-else class="fw-bold mb-0">{{ employee?.employeePayroll?.bankName || '-' }}</h5>
                  </div>
                  <div class="col-md-6 mt-2 mt-md-0">
                    <label class="tiny-label opacity-75">NOMOR REKENING</label>
                    <input v-if="isEditMode" v-model="form.employeePayroll.accountNumber" class="form-ghost w-100 fw-mono" placeholder="000000000">
                    <h5 v-else class="fw-mono mb-0">{{ employee?.employeePayroll?.accountNumber || '**** **** ****' }}</h5>
                  </div>
                </div>
              </div>

              <div class="row g-4">
                <div class="col-md-6">
                  <div class="finance-card income-border p-3 rounded-4 bg-white h-100 shadow-sm">
                    <h6 class="fw-bold text-success mb-3"><i class="bi bi-plus-circle me-2"></i>PENDAPATAN</h6>
                    <div v-for="f in payrollEarnings" :key="f.key" class="mb-3">
                      <label class="data-label text-muted">{{ f.label }}</label>
                      <div v-if="isEditMode" class="input-group mt-1">
                        <span class="input-group-text bg-light border-end-0">Rp</span>
                        <input type="number" v-model="form.employeePayroll[f.key]" class="form-control border-start-0 ps-1">
                      </div>
                      <div v-else class="fw-bold text-dark mt-1 border-bottom pb-1">{{ formatCurrency(employee?.employeePayroll?.[f.key]) }}</div>
                    </div>
                  </div>
                </div>

                <div class="col-md-6">
                  <div class="finance-card deduction-border p-3 rounded-4 bg-white h-100 shadow-sm">
                    <h6 class="fw-bold text-danger mb-3"><i class="bi bi-dash-circle me-2"></i>PENGURANGAN</h6>
                    <div v-for="f in payrollDeductions" :key="f.key" class="mb-3">
                      <label class="data-label text-muted">{{ f.label }}</label>
                      <div v-if="isEditMode" class="input-group mt-1">
                        <span class="input-group-text bg-light border-end-0">Rp</span>
                        <input type="number" v-model="form.employeePayroll[f.key]" class="form-control border-start-0 ps-1">
                      </div>
                      <div v-else class="fw-bold text-danger mt-1 border-bottom pb-1">- {{ formatCurrency(employee?.employeePayroll?.[f.key]) }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div v-else-if="activeTab === 'contact'">
              <h6 class="section-title mb-3 text-gradient">Kontak & Alamat</h6>
              <div class="text-end mb-3" v-if="isEditMode">
                <button class="btn btn-success btn-sm" @click="saveContact">
                  <i class="bi bi-check-lg"></i> Simpan Kontak
                </button>
              </div>
              <div class="row g-3">
                <div class="col-md-3 col-6" v-for="f in contactBasicFields" :key="f.key">
                  <div class="data-tile" :class="{ editing: isEditMode }">
                    <label class="data-label">{{ f.label }}</label>
                    <input v-if="isEditMode" v-model="form.employeeContact[f.key]" class="form-control custom-input mt-1">
                    <p v-else class="data-value small">{{ employee?.employeeContact?.[f.key] || '-' }}</p>
                  </div>
                </div>
                <div class="col-md-6" v-for="f in contactAddressFields" :key="f.key">
                  <div class="data-tile" :class="{ editing: isEditMode }">
                    <label class="data-label">{{ f.label }}</label>
                    <textarea v-if="isEditMode" v-model="form.employeeContact[f.key]" class="form-control custom-input mt-1" rows="1"></textarea>
                    <p v-else class="data-value small">{{ employee?.employeeContact?.[f.key] || '-' }}</p>
                  </div>
                </div>
              </div>
              
              <div class="emergency-box p-3 rounded-4 mt-4 bg-light">
                <h6 class="tiny-label fw-bold text-primary mb-3">KONTAK DARURAT</h6>
                <div class="row g-3">
                  <div class="col-md-4" v-for="f in contactEmergencyFields" :key="f.key">
                    <label class="data-label text-muted">{{ f.label }}</label>
                    <input v-if="isEditMode" v-model="form.employeeContact[f.key]" class="form-control bg-white border">
                    <p v-else class="fw-bold mb-0 text-dark">{{ employee?.employeeContact?.[f.key] || '-' }}</p>
                  </div>
                </div>
              </div>
            </div>

            <div v-else-if="activeTab === 'Document'">
              <h6 class="section-title mb-3 text-gradient">Dokumen & Identitas</h6>
              <div class="text-end mb-3" v-if="isEditMode">
              <button class="btn btn-success btn-sm" @click="saveDocument">
                <i class="bi bi-check-lg"></i> Simpan Dokumen
              </button>
            </div>
              <div class="row g-3">
                <div class="col-md-3 col-6" v-for="f in documentFields" :key="f.key">
                  <div class="data-tile border-start border-4 border-primary" :class="{ editing: isEditMode }">
                    <label class="data-label text-primary">{{ f.label }}</label>
                    <input v-if="isEditMode" v-model="form.employeeDocument[f.key]" class="form-control custom-input mt-1">
                    <p v-else class="data-value font-monospace small text-truncate">{{ employee?.employeeDocument?.[f.key] || '-' }}</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, onMounted } from "vue";
import { useRoute,useRouter } from "vue-router";
import api from "../../utils/api";
// import BranchList from '@/components/BranchList.vue'
// import api from "@/utils/api";

// Hapus import store jika tidak digunakan

export default defineComponent({
  setup() {
    const route = useRoute();
    const router = useRouter();
    const employee = ref<any>(null);
    const isEditMode = ref(false);
    const activeTab = ref("personal");

    // Gunakan 'as any' pada form agar TypeScript tidak komplain saat akses string dynamic
    const form = reactive<any>({
      fullName: '', nickname: '', gender: '', religion: '', dateOfBirth: '', placeOfBirth: '', nationality: '',
      employeeContact: { email: '', phoneNo: '', addressKtp: '', addressDomisili: '', emergencyContactName: '', emergencyContactRelation: '', emergencyContactPhoneNo: '' },
      employeeDocument: { nationalIdNumber: '', npwpNumber: '', passportNumber: '', bpjsKetenagakerjaanNo: '', bpjsKesehatanNo: '', driverLicenseNumber: '' },
      employeeEmploymentInfo: { position: '', employeeNo: '', department: '', status: '', location: '', joinDate: '' },
      employeePayroll: { bankName: '', accountNumber: '', allowance: 0, bonus: 0, mealAllowance: 0, overtime: 0, serviceCharge: 0, tax: 0, bpjsKes: 0, bpjsJht: 0, bpjsJp: 0, ewa: 0 }
    });

    const syncForm = () => {
      if (!employee.value) return;
      const rawData = JSON.parse(JSON.stringify(employee.value));
      Object.assign(form, rawData);
    };
    const fetchData = async () => {
  try {
    const id = route.params.id as string;

    console.log("Employee ID:", id);

    const response = await api.get(
      `/api/v1/master/employee/${id}/detail`
    );

    console.log("Response:", response.data);

    employee.value = response.data.data;

    syncForm();
  } catch (error: any) {
    console.error("Gagal mengambil data:", error);

    if (error.response) {
      console.log("Status:", error.response.status);
      console.log("Data:", error.response.data);
    }
  }
};
    

    onMounted(fetchData);

    return {
      employee, 
      form, 
      isEditMode, 
      activeTab, 
      router, 
      fetchData, 
      syncForm,
      // ... (sisanya sama seperti kode sebelumnya)
      tabList: [
        { key: "personal", label: "Pribadi" }, { key: "employment", label: "Jabatan" }, 
        { key: "payroll", label: "Payroll" }, { key: "contact", label: "Kontak" }, { key: "Document", label: "Dokumen" }
      ],
      personalFields: [
        { key: 'fullName', label: 'Nama Lengkap' }, { key: 'nickname', label: 'Panggilan' },
        { key: 'gender', label: 'Jenis Kelamin', type: 'select' }, { key: 'religion', label: 'Agama' },
        { key: 'nationality', label: 'Kewarganegaraan' }, { key: 'placeOfBirth', label: 'Tempat Lahir' },
        { key: 'dateOfBirth', label: 'Tanggal Lahir', type: 'date' }
      ],
      employmentFields: [
        { key: 'employeeNo', label: 'ID Karyawan' }, { key: 'position', label: 'Jabatan' },
        { key: 'department', label: 'Departemen' }, { key: 'status', label: 'Status' },
        { key: 'location', label: 'Lokasi' }, { key: 'joinDate', label: 'Join Date', type: 'date' }
      ],
      payrollEarnings: [
        { key: 'allowance', label: 'Gaji Pokok' }, { key: 'bonus', label: 'Tunj. Jabatan' }, 
        { key: 'mealAllowance', label: 'Uang Makan' }, { key: 'serviceCharge', label: 'Service Charge' }, { key: 'overtime', label: 'Lembur' }
      ],
      payrollDeductions: [
        { key: 'tax', label: 'PPh 21' }, { key: 'bpjsKes', label: 'BPJS Kes' }, 
        { key: 'bpjsJht', label: 'BPJS JHT' }, { key: 'bpjsJp', label: 'BPJS JP' }, { key: 'ewa', label: 'EWA' }
      ],
      contactBasicFields: [{ key: 'email', label: 'Email' }, { key: 'phoneNo', label: 'Phone' }],
      contactAddressFields: [{ key: 'addressKtp', label: 'Alamat KTP' }, { key: 'addressDomisili', label: 'Domisili' }],
      contactEmergencyFields: [{ key: 'emergencyContactName', label: 'Nama' }, { key: 'emergencyContactRelation', label: 'Hubungan' }, { key: 'emergencyContactPhoneNo', label: 'Nomor Telp' }],
      documentFields: [
        { key: 'nationalIdNumber', label: 'NIK' }, { key: 'npwpNumber', label: 'NPWP' }, 
        { key: 'bpjsKetenagakerjaanNo', label: 'BPJS TK' }, { key: 'bpjsKesehatanNo', label: 'BPJS Kes' }, 
        { key: 'driverLicenseNumber', label: 'SIM' }, { key: 'passportNumber', label: 'Paspor' }
      ]
    };
  },
  methods: {
    formatCurrency(val: any) { return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val || 0); },
    back() { this.router.push("/employee/list"); },
    cancelEdit() { this.isEditMode = false; this.syncForm(); },
    // Anda bisa mengganti 'this.store.updateEmployee' dengan fungsi API/Axios Anda sendiri di sini
    async savePersonal() {
  const id = localStorage.getItem("selectedId");

  const payload = {
    fullName: this.form.fullName,
    nickname: this.form.nickname,
    gender: this.form.gender,
    placeOfBirth: this.form.placeOfBirth,
    dateOfBirth: this.form.dateOfBirth,
    nationality: this.form.nationality,
    religion: this.form.religion
  };

  console.log("selectedId =", id);
  console.log("employee.id =", this.employee?.id);
  console.log("payload =", payload);

  await api.put(
    `/api/v1/master/employee/${id}/update`,
    payload
  );
},
    async saveEmployment() { /* Logic API Anda */ },
    async savePayroll() { /* Logic API Anda */ },
    async saveContact() { /* Logic API Anda */ },
    async saveDocument() { /* Logic API Anda */ },
    async updateEmployee(payload: any) {
  try {
    const id = localStorage.getItem("selectedId");

    const response = await api.put(
      `/api/v1/master/employee/${id}/update`,
      payload
    );

    alert("Data berhasil disimpan");
    await this.fetchData();
    this.isEditMode = false;

    return response.data;
  } catch (error: any) {
    console.error(error);

    alert(
      error.response?.data?.message ||
      "Gagal menyimpan data"
    );
  }
},
  }
});
</script>

<style scoped>
.employee-profile-wrapper { background: #f8fafc; min-height: 100vh; }
.header-glass { background: #fff; border: 1px solid #e2e8f0; }
.status-indicator { position: absolute; bottom: 5px; right: 5px; width: 14px; height: 14px; background: #22c55e; border: 2px solid white; border-radius: 50%; }
.badge-custom { background: #f1f5f9; color: #475569; padding: 2px 10px; border-radius: 6px; font-size: 11px; font-weight: 700; }

.custom-tab-btn { background: transparent; color: #94a3b8; font-weight: 700; border-radius: 8px !important; font-size: 13px; border: none; }
.custom-tab-btn.active { background: #0d6efd; color: white; }

.data-tile { background: #fff; padding: 10px; border-radius: 10px; border: 1px solid #f1f5f9; min-height: 60px; }
.data-tile.editing { border-color: #3b82f6; background: #f0f7ff; }
.tile-blue { border-left: 4px solid #0d6efd; }

.data-label { font-size: 10px; text-transform: uppercase; color: #94a3b8; font-weight: 800; letter-spacing: 0.5px; display: block; }
.data-value { font-size: 14px; font-weight: 600; color: #1e293b; margin-top: 2px; }
.custom-input { font-size: 13px; border-radius: 6px; }

.bank-card { background: linear-gradient(135deg, #ffffff, #ffffff); }
.form-ghost { background: transparent; border: none; border-bottom: 1px solid rgba(255,255,255,0.3); color: rgb(6, 6, 6); outline: none; padding: 2px 0; }
.finance-card { border-top: 4px solid; }
.income-border { border-top-color: #198754; }
.deduction-border { border-top-color: #dc3545; }

.hide-scrollbar::-webkit-scrollbar { display: none; }
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.text-gradient { color: #334155; font-weight: 800; border-left: 4px solid #0d6efd; padding-left: 10px; }
.custom-input {
  width: 100%;
  height: 44px;
  font-size: 14px;
  border-radius: 8px;
}

.data-tile {
  background: #fff;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  min-height: 90px;
  transition: all 0.2s ease;
}

.data-tile.editing {
  border-color: #3b82f6;
  background: #f0f7ff;
}

.data-label {
  font-size: 11px;
  text-transform: uppercase;
  color: #94a3b8;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.data-value {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
}
</style>