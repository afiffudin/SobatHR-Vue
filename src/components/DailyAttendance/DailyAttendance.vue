<template>
  <div class="card mb-25 border-0 rounded-0 bg-white">
    <div style="display:flex; gap:10px; padding:15px; align-items: center; flex-wrap: wrap;">
      <input type="date" v-model="selectedDate" @change="fetchData" class="form-control" style="width: 150px;" />

      <select v-model="attendanceStatus" @change="fetchData" class="form-select" style="width: 150px;">
        <option value="All">Semua Status</option>
        <option value="YES">Hadir</option>
        <option value="NO">Tidak Hadir</option>
      </select>

      <select v-model="selectedBranchId" @change="fetchData" class="form-select" style="width: 200px;">
        <option value="">Semua Cabang</option>
        <option v-for="branch in branchList" :key="branch.id" :value="branch.id">
          {{ branch.name }}
        </option>
      </select>

      <label class="ms-auto me-2">Data/Hal:</label>
      <select v-model="pageSize" class="form-select" style="width: 80px;">
        <option :value="10">10</option>
        <option :value="25">25</option>
        <option :value="50">50</option>
        <option :value="100">100</option>
      </select>

      <div 
  v-if="loading" 
  class="spinner-border ms-2" 
  role="status" 
  style="width: 20px; height: 20px; color: #28a745;" 
></div>
    </div>

    <AgGridVue
      class="ag-theme-quartz"
      style="height: 500px; width: 100%"
      :columnDefs="columnDefs"
      :rowData="rowData"
      :defaultColDef="defaultColDef"
      :pagination="true"
      :paginationPageSize="pageSize"
      :paginationPageSizeSelector="false"
    />
  </div>
</template>

<script lang="ts">
import { ref, defineComponent, onMounted } from "vue";
import { AgGridVue } from "ag-grid-vue3";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import api from "@/utils/api";

ModuleRegistry.registerModules([AllCommunityModule]);

export default defineComponent({
  components: { AgGridVue },
  setup() {
    const rowData = ref<any[]>([]);
    const branchList = ref<any[]>([]);
    const loading = ref(false);
    const selectedDate = ref(new Date().toISOString().split("T")[0]);
    const attendanceStatus = ref("All");
    const selectedBranchId = ref("");
    const pageSize = ref(10);

    const defaultColDef = { sortable: true, resizable: true };
    const columnDefs = ref([
      { field: "employee.fullName", headerName: "Name", flex: 1 },
      { field: "employee.employeeEmploymentInfo.employeeNo", headerName: "Employee No" },
      { field: "employee.employeeEmploymentInfo.companyBranch.name", headerName: "Branch" },
      { field: "checkInTime", headerName: "Check In" },
      { field: "checkOutTime", headerName: "Check Out" }
    ]);

    const fetchBranches = async () => {
      try {
        const res = await api.get("/api/v1/master/company/branch/list");
        branchList.value = res.data?.data || [];
      } catch (err) { console.error(err); }
    };

    const fetchData = async () => {
      loading.value = true;
      try {
        const res = await api.get("/api/v1/attendance/employee/list", {
          params: {
            datePeriod: selectedDate.value,
            absentStatus: attendanceStatus.value,
            companyBranchId: selectedBranchId.value || undefined
          }
        });
        rowData.value = res.data?.data?.attendanceData || res.data?.data || [];
      } catch (err) {
        console.error("Fetch error:", err);
        rowData.value = [];
      } finally {
        loading.value = false;
      }
    };

    onMounted(async () => {
      await fetchBranches();
      await fetchData();
    });

    return { 
      rowData, columnDefs, defaultColDef, selectedDate, 
      attendanceStatus, selectedBranchId, branchList, 
      fetchData, pageSize, loading 
    };
  },
});
</script>