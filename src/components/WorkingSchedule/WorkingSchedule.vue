<template>
  <div class="card bg-white border-0 rounded-10 mb-4 p-4">
    <div class="row g-3 mb-3">
      <div class="col-md-3">
        <label class="form-label small">Pilih Cabang</label>
        <select v-model="filter.branchId" class="form-select form-select-sm" @change="fetchData">
          <option v-for="b in branchOptions" :key="b.id" :value="b.id">{{ b.name }}</option>
        </select>
      </div>
      <div class="col-md-2">
        <label class="form-label small">Bulan</label>
        <select v-model="filter.month" class="form-select form-select-sm" @change="fetchData">
          <option v-for="m in 12" :key="m" :value="m">{{ new Date(0, m - 1).toLocaleString('id-ID', { month: 'long' }) }}</option>
        </select>
      </div>
      <div class="col-md-2">
        <label class="form-label small">Tahun</label>
        <select v-model="filter.year" class="form-select form-select-sm" @change="fetchData">
          <option v-for="y in 5" :key="y" :value="2024 + y">{{ 2024 + y }}</option>
        </select>
      </div>
    </div>

    <AgGridVue
      class="ag-theme-quartz"
      style="height: 500px; width: 100%"
      :columnDefs="columnDefs"
      :rowData="rowData"
      :defaultColDef="{ sortable: true, filter: true, flex: 1 }"
      :pagination="true"
      @grid-ready="onGridReady"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive } from "vue";
import { AgGridVue } from "ag-grid-vue3";
import api from "@/utils/api";

export default defineComponent({
  components: { AgGridVue },
  setup() {
    const rowData = ref<any[]>([]);
    const gridApi = ref<any>(null);
    const branchOptions = ref<any[]>([]);
    
    const filter = reactive({
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
      branchId: ""
    });

    const columnDefs = ref([
      { headerName: "No", valueGetter: "node.rowIndex + 1", width: 70 },
      { 
        headerName: "Tanggal", field: "workingDate", 
        filter: 'agDateColumnFilter',
        valueFormatter: (p: any) => {
          if (!p.value) return "-";
          const [y, m, d] = p.value.split('-');
          return `${d}/${m}/${y}`;
        }
      },
      { headerName: "Employee Name", field: "employeeName", filter: 'agSetColumnFilter' },
      { headerName: "Shift", field: "shiftName" },
      { headerName: "Check-in", field: "checkIn", width: 120 },
      { headerName: "Check-out", field: "checkOut", width: 120 }
    ]);

    const fetchData = async () => {
      if (!gridApi.value || !filter.branchId) return;
      gridApi.value.showLoadingOverlay();
      
      try {
        const listRes = await api.get(`/api/v1/master/shift/calendar/list`, {
          params: { year: filter.year, month: filter.month, companyBranchId: filter.branchId }
        });

        const calendarDates = listRes.data?.data || [];
        let combinedData: any[] = [];
        
        for (const dateItem of calendarDates) {
          try {
            const detailRes = await api.get(`/api/v1/master/shift/calendar/${dateItem.id}/detail`);
            const employees = detailRes.data?.data || [];
            
            employees.forEach((emp: any) => {
              combinedData.push({
                workingDate: dateItem.workingDate,
                employeeName: emp.employee?.fullName || "-",
                shiftName: emp.shiftType?.shiftName || "-",
                checkIn: emp.shiftType?.checkInTime || "-",
                checkOut: emp.shiftType?.checkOutTime || "-"
              });
            });
          } catch (e) { console.error("Error Detail:", e); }
        }
        rowData.value = combinedData;
      } catch (error) {
        console.error("Error Fetch Data:", error);
      } finally {
        gridApi.value.hideOverlay();
      }
    };

    const onGridReady = async (params: any) => {
      gridApi.value = params.api;
      try {
        const bRes = await api.get("/api/v1/master/company/branch/list");
        branchOptions.value = bRes.data?.data || [];
        if (branchOptions.value.length > 0) {
          filter.branchId = branchOptions.value[0].id;
          fetchData();
        }
      } catch (e) { console.error("Error Load Branch:", e); }
    };

    return { rowData, columnDefs, filter, branchOptions, onGridReady, fetchData };
  },
});
</script>

<style scoped>
@import "ag-grid-community/styles/ag-grid.css";
@import "ag-grid-community/styles/ag-theme-quartz.css";
</style>