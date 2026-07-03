<template>
  <div class="card bg-white border-0 rounded-3 mb-4 overflow-hidden shadow-sm">

    <!-- Filter Area -->
    <div class="filter-area px-4 py-3">
      <div class="d-flex align-items-center gap-2 mb-3">
        <i class="ti ti-calendar-stats text-primary" style="font-size:18px"></i>
        <span class="fw-semibold text-dark" style="font-size:15px">Kalender Shift</span>
      </div>

      <div class="row g-3 align-items-end">
        <div class="col-14 col-sm-8 col-md-5 col-lg-5">
          <label class="sc-label">
            <i class="ti ti-building"></i> Pilih Cabang
          </label>
          <select v-model="filter.branchId" class="form-select form-select-sm sc-select" @change="fetchData">
            <option v-for="b in branchOptions" :key="b.id" :value="b.id">{{ b.name }}</option>
          </select>
        </div>

        <div class="col-6 col-sm-3 col-md-2">
          <label class="sc-label">
            <i class="ti ti-calendar-month"></i> Bulan
          </label>
          <select v-model="filter.month" class="form-select form-select-sm sc-select" @change="fetchData">
            <option v-for="m in 12" :key="m" :value="m">
              {{ new Date(0, m - 1).toLocaleString('id-ID', { month: 'long' }) }}
            </option>
          </select>
        </div>

        <div class="col-6 col-sm-3 col-md-2">
          <label class="sc-label">
            <i class="ti ti-calendar-time"></i> Tahun
          </label>
          <select v-model="filter.year" class="form-select form-select-sm sc-select" @change="fetchData">
            <option v-for="y in 5" :key="y" :value="2024 + y">{{ 2024 + y }}</option>
          </select>
        </div>
        <!-- <div class="d-flex align-items-end">
      <button 
        class="btn btn-sm btn-primary d-flex align-items-center gap-1" 
        style="height: 31px;" 
        @click=""
        :disabled="!filter.branchId"
      >
        <i class="ti ti-file-spreadsheet"></i> Download Template
      </button>
    <!-- </div> -->
  </div> 
      
      <!-- Chips -->
      <div class="d-flex flex-wrap align-items-center gap-2 mt-3 pt-3 sc-chip-row">
        <span class="sc-chip-label">Filter aktif:</span>
        <span v-if="selectedBranchName" class="sc-chip">
          <i class="ti ti-building"></i> {{ selectedBranchName }}
        </span>
        <span class="sc-chip">
          <i class="ti ti-calendar"></i>
          {{ new Date(0, filter.month - 1).toLocaleString('id-ID', { month: 'long' }) }} {{ filter.year }}
        </span>
      </div>
    </div>

    <!-- Table Header -->
    <div class="d-flex align-items-center justify-content-between px-4 py-3 sc-table-header">
      <div class="d-flex align-items-center gap-2">
        <i class="ti ti-table-column text-primary" style="font-size:17px"></i>
        <span class="fw-semibold text-dark" style="font-size:14px">Data Shift Karyawan</span>
      </div>
      <span v-if="rowData.length > 0" class="sc-badge-count">
        <i class="ti ti-users"></i> {{ rowData.length }} data
      </span>
    </div>

    <!-- AG Grid -->
    <AgGridVue
      class="ag-theme-quartz"
      style="height: 500px; width: 100%"
      :columnDefs="columnDefs"
      :rowData="rowData"
      :defaultColDef="{ sortable: true, resizable: true, flex: 1 }"
      :pagination="true"
      @grid-ready="onGridReady"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, computed } from "vue";
import type { ColDef } from "ag-grid-community";
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

    // Untuk chip nama cabang
    const selectedBranchName = computed(() => {
      const found = branchOptions.value.find((b: any) => b.id === filter.branchId);
      return found ? found.name : "";
    });

    const columnDefs = ref<ColDef[]>([
      { headerName: "No", valueGetter: "node.rowIndex + 1", width: 70, sortable: false },
      {
        headerName: "Tanggal", field: "workingDate",
        valueFormatter: (p: any) => {
          if (!p.value) return "-";
          const [y, m, d] = p.value.split('-');
          return `${d}/${m}/${y}`;
        }
      },
      {
        headerName: "Nama Karyawan", field: "employeeName",
        cellStyle: { fontWeight: "500" }
      },
      {
        headerName: "Shift", field: "shiftName",
        cellRenderer: (p: any) => {
          if (!p.value || p.value === "-") return "-";
          // Teks tetap berwarna biru, tanpa background oval
          return `<span style="font-weight: 500; color: #1971c2;">${p.value}</span>`;  
        }
      },
      {
        headerName: "Check-in", field: "checkIn", width: 120,
        cellStyle: { color: "#2f9e44", fontVariantNumeric: "tabular-nums" }
      },
      {
        headerName: "Check-out", field: "checkOut", width: 120,
        cellStyle: { color: "#e03131", fontVariantNumeric: "tabular-nums" }
      }
    ]);

    // ✅ Logika fetch TIDAK diubah sama sekali dari kode asli
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

    //  onGridReady TIDAK diubah sama sekali dari kode asli
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

    return { rowData, columnDefs, filter, branchOptions, selectedBranchName, onGridReady, fetchData };
  },
});
</script>

<style scoped>
@import "ag-grid-community/styles/ag-grid.css";
@import "ag-grid-community/styles/ag-theme-quartz.css";

/* Filter area background */
.filter-area {
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
}

/* Label */
.sc-label {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  font-weight: 600;
  color: #6c757d;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 5px;
}

/* Select */
.sc-select {
  border-color: #dee2e6;
  border-radius: 6px !important;
  font-size: 13px;
  color: #212529;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.sc-select:focus {
  border-color: #4263eb;
  box-shadow: 0 0 0 3px rgba(66, 99, 235, 0.12);
}

/* Chip row */
.sc-chip-row {
  border-top: 1px solid #e9ecef;
}
.sc-chip-label {
  font-size: 11px;
  color: #adb5bd;
}
.sc-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  font-weight: 500;
  color: #1971c2;
  background: #e7f5ff;
  border: 1px solid #a5d8ff;
  border-radius: 20px;
  padding: 2px 10px;
}

/* Table header bar */
.sc-table-header {
  background: #fff;
  border-bottom: 1px solid #e9ecef;
}

/* Row count badge */
.sc-badge-count {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  font-weight: 500;
  color: #2f9e44;
  background: #ebfbee;
  border: 1px solid #b2f2bb;
  border-radius: 6px;
  padding: 2px 9px;
  min-width: 32px;
}

/* AG Grid overrides */
:deep(.ag-theme-quartz) {
  --ag-border-color: #e9ecef;
  --ag-header-background-color: #f8f9fa;
  --ag-header-foreground-color: #495057;
  --ag-row-hover-color: #f8f9fa;
  --ag-font-size: 13px;
  border: none !important;
}
:deep(.ag-root-wrapper) {
  border: none !important;
  border-radius: 0 !important;
}
:deep(.ag-header-cell-label) {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
</style>