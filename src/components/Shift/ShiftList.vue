<template>
  <div class="card mb-25 border-0 rounded-0 bg-white">
    <div style="display:flex; gap:10px; padding:15px; align-items: center; flex-wrap: wrap;">
      <select v-model="selectedBranchId" @change="fetchData" class="form-select form-select-sm" style="flex: 1 1 200px; max-width: 300px;">
        <option value="">Semua Cabang</option>
        <option v-for="branch in branchList" :key="branch.id" :value="branch.id">{{ branch.name }}</option>
      </select>

      <input 
        type="text" 
        v-model="quickFilterText" 
        @input="onFilterTextBoxChanged"
        class="form-control form-control-sm" 
        style="width: 250px;" 
        placeholder="Search Shift..." 
      />

      <div style="display: flex; gap: 8px; margin-left: auto; align-items: center; flex-shrink: 0;">
        <button class="btn btn-success btn-sm" style="font-size: 12px; padding: 4px 10px;">+ Add New Shift</button>
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
      :quickFilterText="quickFilterText"
      @grid-ready="onGridReady"
    />
  </div>
</template>

<script lang="ts">
import { ref, defineComponent, onBeforeMount } from "vue";
import { AgGridVue } from "ag-grid-vue3";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import api from "@/utils/api";

ModuleRegistry.registerModules([AllCommunityModule]);

export default defineComponent({
  components: { AgGridVue },
  setup() {
    const rowData = ref<any[]>([]);
    const branchList = ref<any[]>([]);
    const quickFilterText = ref("");
    const gridApi = ref<any>(null);
    const selectedBranchId = ref("");
    const pageSize = ref(10);

    const onGridReady = (params: any) => { gridApi.value = params.api; };
    const onFilterTextBoxChanged = () => { gridApi.value.setQuickFilter(quickFilterText.value); };

    const columnDefs = ref([
      { headerName: "No", valueGetter: "node.rowIndex + 1", width: 70 },
      { field: "name", headerName: "Nama Shift", sortable: true },
      // Menggunakan valueGetter untuk menangani berbagai kemungkinan nama field
      { 
        headerName: "Check IN", 
        valueGetter: (p: any) => p.data.checkIn || p.data.check_in || p.data.checkInTime || p.data.check_in_time || '-' 
      },
      { 
        headerName: "Check OUT", 
        valueGetter: (p: any) => p.data.checkOut || p.data.check_out || p.data.checkOutTime || p.data.check_out_time || '-' 
      },
      { 
        headerName: "Toleransi (Min)", 
        valueGetter: (p: any) => p.data.tolerableAbsent || p.data.tolerance || 0 
      },
      { 
        headerName: "Action",
        width: 120,
        cellRenderer: (params: any) => {
          const container = document.createElement('div');
          container.className = 'd-flex justify-content-center gap-2';
          container.innerHTML = `
            <button class="btn btn-sm bg-primary-transparent text-primary border-0 p-2 lh-1 rounded-circle"><i class="flaticon-pen fs-14"></i></button>
            <button class="btn btn-sm bg-danger-transparent text-danger border-0 p-2 lh-1 rounded-circle"><i class="flaticon-delete fs-14"></i></button>
          `;
          return container;
        }
      }
    ]);

    const defaultColDef = { sortable: true, resizable: true, flex: 1 };

    const fetchData = async () => {
      try {
        const res = await api.get("/api/v1/master/shift/list", {
          params: { companyBranchId: selectedBranchId.value || undefined }
        });
        rowData.value = res.data?.data || [];
      } catch (err) { rowData.value = []; }
    };

    onBeforeMount(async () => {
      await api.get("/api/v1/master/company/branch/list").then(res => branchList.value = res.data?.data || []);
      await fetchData();
    });

    return { rowData, columnDefs, defaultColDef, selectedBranchId, branchList, fetchData, quickFilterText, onGridReady, onFilterTextBoxChanged, pageSize };
  },
});
</script>