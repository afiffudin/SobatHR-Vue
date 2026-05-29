<template>
  <div class="card mb-25 border-0 rounded-0 bg-white">
    <div style="display:flex; gap:10px; padding:15px; align-items: center;">
      <input type="date" v-model="selectedDate" @change="fetchData" />

      <select v-model="attendanceStatus" @change="fetchData">
        <option value="All">Semua Status</option>
        <option value="YES">Hadir</option>
        <option value="NO">Tidak Hadir</option>
      </select>

      <select v-model="selectedBranchId" @change="fetchData">
        <option value="">Semua Cabang PSG</option>
        <option v-for="branch in branchList" :key="branch.id" :value="branch.id">
          {{ branch.name }}
        </option>
      </select>
    </div>

    <AgGridVue
      class="ag-theme-quartz"
      style="height:400px;width:100%"
      :columnDefs="columnDefs"
      :rowData="rowData"
      :defaultColDef="defaultColDef"
    />
  </div>
</template>

<script lang="ts">
import { ref, defineComponent, onMounted } from "vue";
import { AgGridVue } from "ag-grid-vue3";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import api from "@/utils/api"; // Path langsung ke api.ts Anda

ModuleRegistry.registerModules([AllCommunityModule]);

export default defineComponent({
  components: { AgGridVue },

  setup() {
    const rowData = ref<any[]>([]);
    const branchList = ref<any[]>([]);
    const selectedDate = ref(new Date().toISOString().split("T")[0]);
    const attendanceStatus = ref("All");
    const selectedBranchId = ref("");

    const defaultColDef = { sortable: true, resizable: true };

    const columnDefs = ref([
      { field: "employee.fullName", headerName: "Name" },
      { field: "employee.employeeEmploymentInfo.employeeNo", headerName: "Employee No" },
      { field: "employee.employeeEmploymentInfo.companyBranch.name", headerName: "Branch" },
      { field: "checkInTime", headerName: "Check In" },
      { field: "checkOutTime", headerName: "Check Out" }
    ]);

    // 1. Fetch daftar cabang untuk dropdown
    const fetchBranches = async () => {
      try {
        const res = await api.get("/api/v1/master/company/branch/list");
        branchList.value = res.data?.data || [];
      } catch (err) { console.error(err); }
    };

    // 2. Fetch data langsung dari api.ts
    const fetchData = async () => {
      try {
        // Panggil endpoint langsung tanpa service
        const res = await api.get("/api/v1/attendance/employee/list", {
          params: {
            datePeriod: selectedDate.value,
            absentStatus: attendanceStatus.value,
            companyBranchId: selectedBranchId.value || undefined // Jika kosong, API seharusnya kirim semua cabang
          }
        });

        // Sesuaikan dengan struktur response API Anda
        const data = res.data?.data?.attendanceData || res.data?.data || [];
        rowData.value = data;
        
        console.log("📦 Data Absensi Ter-load:", rowData.value);
      } catch (err) {
        console.error("❌ Fetch error:", err);
      }
    };

    onMounted(async () => {
      await fetchBranches();
      await fetchData();
    });

    return { 
      rowData, columnDefs, defaultColDef, selectedDate, 
      attendanceStatus, selectedBranchId, branchList, fetchData 
    };
  },
});
</script>