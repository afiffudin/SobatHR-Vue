<template>
  <div class="card bg-white border-0 rounded-10 mb-4 p-4">
    <div class="d-sm-flex justify-content-between align-items-center mb-3">
      <div v-if="loading" class="spinner-border text-success" style="width: 1.5rem; height: 1.5rem;"></div>
    </div>

    <div class="search-box mb-3">
      <input v-model="search" type="text" class="form-control form-control-sm" placeholder="Cari nama atau ID..." style="width: 250px" />
    </div>

    <div class="table-responsive">
      <table class="table table-hover align-middle mb-0 table-adlash" style="min-width: 1000px">
        <thead class="table-light">
          <tr>
            <th>No</th>
            <th>Nama Karyawan</th>
            <th>ID Karyawan</th>
            <th>Cabang</th>
            <th>Departemen</th>
            <th>Posisi</th>
            <th>Status</th>
            <th class="text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in paginatedEmployees" :key="item.id">
            <td>{{ (currentPage - 1) * pageSize + index + 1 }}</td>
            <td><span class="fw-semibold text-black">{{ item.fullName }}</span></td>
            <td>{{ item.employeeEmploymentInfo?.employeeNo || "-" }}</td>
            <td>{{ item.employeeEmploymentInfo?.companyBranch?.name || "-" }}</td>
            <td>{{ item.employeeEmploymentInfo?.department?.name || "-" }}</td>
            <td>{{ item.employeeEmploymentInfo?.position?.name || "-" }}</td>
            <td>
              <span v-if="!item.employeeEmploymentInfo?.resignDate" class="badge bg-success-transparent text-success border px-2 py-1 rounded-pill">Aktif</span>
              <span v-else class="badge bg-danger-transparent text-danger border px-2 py-1 rounded-pill">Non Aktif</span>
            </td>
            <td class="text-center">
              <div class="d-flex justify-content-center gap-2">
                <button class="btn btn-sm bg-primary-transparent text-primary border-0 p-2 lh-1 rounded-circle" title="Edit" @click="editEmployee(item.id)">
                  <i class="flaticon-pen fs-14"></i>
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="paginatedEmployees.length === 0 && !loading">
            <td colspan="8" class="text-center py-4">Data tidak ditemukan</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="d-flex justify-content-between align-items-center mt-4 flex-wrap gap-2">
      <span class="text-muted fs-14">Showing {{ startRecord }} to {{ endRecord }} of {{ filteredEmployees.length }} entries</span>
      <nav>
        <ul class="pagination pagination-sm mb-0 align-items-center">
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <button class="page-link" @click="currentPage--">&laquo;</button>
          </li>
          
          <li v-for="(page, index) in visiblePages" :key="index" class="page-item" 
              :class="{ active: currentPage === page, disabled: page === '...' }">
            <button class="page-link" @click="typeof page === 'number' && (currentPage = page)">
              {{ page }}
            </button>
          </li>

          <li class="page-item" :class="{ disabled: currentPage === totalPages || totalPages === 0 }">
            <button class="page-link" @click="currentPage++">&raquo;</button>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, computed, defineComponent, onMounted } from "vue";
import { useRouter } from "vue-router";
import api from "@/utils/api";

export default defineComponent({
  name: "EmployeeList",
  setup() {
    const router = useRouter();
    const loading = ref<boolean>(false);
    const employees = ref<any[]>([]);
    const search = ref<string>("");
    const currentPage = ref<number>(1);
    const pageSize = 10;

    const fetchEmployees = async () => {
      loading.value = true;
      try {
        const res = await api.get("/api/v1/master/employee/list");
        employees.value = res.data?.data || [];
      } catch (err) {
        console.error("Error fetch employee:", err);
      } finally {
        loading.value = false;
      }
    };

    const filteredEmployees = computed(() => {
      if (!search.value) return employees.value;
      const q = search.value.toLowerCase();
      return employees.value.filter((item: any) => 
        item.fullName?.toLowerCase().includes(q) || 
        item.employeeEmploymentInfo?.employeeNo?.toLowerCase().includes(q)
      );
    });

    const totalPages = computed<number>(() => Math.ceil(filteredEmployees.value.length / pageSize));

    const paginatedEmployees = computed(() => {
      const start = (currentPage.value - 1) * pageSize;
      return filteredEmployees.value.slice(start, start + pageSize);
    });

    // Logika Pagination Rapi (Ellipsis)
    const visiblePages = computed<(number | string)[]>(() => {
      const delta = 2;
      const range: (number | string)[] = [];
      const start = Math.max(2, currentPage.value - delta);
      const end = Math.min(totalPages.value - 1, currentPage.value + delta);

      for (let i = start; i <= end; i++) range.push(i);
      
      if (start > 2) range.unshift("...");
      if (end < totalPages.value - 1) range.push("...");
      
      return totalPages.value > 1 ? [1, ...range, totalPages.value] : [1];
    });

    const startRecord = computed(() => (filteredEmployees.value.length === 0 ? 0 : (currentPage.value - 1) * pageSize + 1));
    const endRecord = computed(() => Math.min(currentPage.value * pageSize, filteredEmployees.value.length));

    const editEmployee = (employeeId: string) => {
      router.push(`/employee/edit/${employeeId}`);
    };

    onMounted(fetchEmployees);

    return {
      loading, employees, search, currentPage, pageSize,
      filteredEmployees, paginatedEmployees, totalPages,
      visiblePages, startRecord, endRecord, editEmployee
    };
  },
});
</script>

<style scoped>
.search-box { position: relative; }
.table-adlash th { white-space: nowrap; }
.bg-success-transparent { background-color: rgba(25, 135, 84, 0.1); }
.bg-danger-transparent { background-color: rgba(220, 53, 69, 0.1); }
.bg-primary-transparent { background-color: rgba(13, 110, 253, 0.1); }

/* Styling Pagination Rapi */
.page-link { color: #495057; padding: 0.4rem 0.75rem; border: 1px solid #dee2e6; cursor: pointer; }
.page-item.active .page-link { background-color: #4263eb; border-color: #4263eb; color: white; }
.page-item.disabled .page-link { color: #adb5bd; cursor: not-allowed; }
</style>