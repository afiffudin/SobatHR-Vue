<template>
  <div class="card mb-25 border-0 rounded-0 bg-white">
    <div style="display:flex; gap:10px; padding:15px; align-items: center; flex-wrap: wrap;">
      <input type="date" v-model="selectedDate" @change="fetchData" class="form-control form-control-sm" style="width: 140px;" />
      
      <select v-model="attendanceStatus" @change="fetchData" class="form-select form-select-sm" style="width: 130px;">
        <option value="All">Semua Status</option>
        <option value="YES">Hadir</option>
        <option value="NO">Tidak Hadir</option>
      </select>

      <select v-model="selectedBranchId" @change="fetchData" class="form-select form-select-sm" style="flex: 1 1 200px; max-width: 300px;">
        <option value="">Semua Cabang</option>
        <option v-for="branch in branchList" :key="branch.id" :value="branch.id">{{ branch.name }}</option>
      </select>

      <div style="display: flex; gap: 8px; margin-left: auto; align-items: center; flex-shrink: 0;">
        <button @click="exportToExcel" class="btn btn-success btn-sm" style="font-size: 12px; padding: 4px 10px;">Export Excel</button>
        <!-- <button @click="exportToWord" class="btn btn-primary btn-sm" style="font-size: 12px; padding: 4px 10px;">Export Word</button> -->
        <div v-if="loading" class="spinner-border" style="width: 16px; height: 16px; color: #28a745; margin-left: 5px;"></div>
      </div>
    </div>

    <AgGridVue
      class="ag-theme-quartz"
      style="height: 500px; width: 100%"
      :columnDefs="columnDefs"
      :rowData="rowData"
      :defaultColDef="defaultColDef"
      :pagination="true"
      :paginationPageSize="pageSize"
    />
  </div>
</template>

<script lang="ts">
import { ref, defineComponent, onBeforeMount } from "vue";
import { AgGridVue } from "ag-grid-vue3";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import api from "@/utils/api";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';


// REGISTRASI MODUL DI LUAR SETUP agar terdaftar sebelum render
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

    const columnDefs = ref([
      { headerName: "Nama", valueGetter: (p: any) => p.data.employee?.fullName || '-' },
      { headerName: "No Pegawai", valueGetter: (p: any) => p.data.employee?.employeeEmploymentInfo?.employeeNo || '-' },
      { headerName: "Cabang", valueGetter: (p: any) => p.data.employee?.employeeEmploymentInfo?.companyBranch?.name || '-' },
      { field: "checkInTime", headerName: "Check In" },
      { field: "checkOutTime", headerName: "Check Out" }
    ]);

    const defaultColDef = { sortable: true, resizable: true };

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

    const exportToExcel = () => {
      const ws = XLSX.utils.json_to_sheet(rowData.value.map(r => ({
        Nama: r.employee?.fullName,
        NoPegawai: r.employee?.employeeEmploymentInfo?.employeeNo,
        Cabang: r.employee?.employeeEmploymentInfo?.companyBranch?.name,
        CheckIn: r.checkInTime,
        CheckOut: r.checkOutTime
      })));
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Attendance");
      saveAs(new Blob([XLSX.write(wb, {bookType:'xlsx', type:'array'})]), `Attendance_${selectedDate.value}.xlsx`);
    };

    const exportToWord = () => {
      const content = `<html><head><style>table{width:100%;border-collapse:collapse;font-size:11px;}th,td{border:1px solid #ccc;padding:4px;}th{background:#f2f2f2;}</style></head><body><h3>Absensi ${selectedDate.value}</h3><table><tr><th>Nama</th><th>Cabang</th><th>Check In</th><th>Check Out</th></tr>${rowData.value.map(r => `<tr><td>${r.employee?.fullName||'-'}</td><td>${r.employee?.employeeEmploymentInfo?.companyBranch?.name||'-'}</td><td>${r.checkInTime||'-'}</td><td>${r.checkOutTime||'-'}</td></tr>`).join('')}</table></body></html>`;
      saveAs(new Blob(['\ufeff', content], { type: 'application/msword' }), `Attendance_${selectedDate.value}.doc`);
    };

    onBeforeMount(async () => {
      await api.get("/api/v1/master/company/branch/list").then(res => branchList.value = res.data?.data || []);
      await fetchData();
    });

    return { rowData, columnDefs, defaultColDef, selectedDate, attendanceStatus, selectedBranchId, branchList, fetchData, pageSize, loading, exportToExcel, exportToWord };
  },
});
</script>