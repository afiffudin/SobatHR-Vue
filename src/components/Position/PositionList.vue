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
        placeholder="Cari posisi..." 
      />

      <div style="display: flex; gap: 8px; margin-left: auto; align-items: center; flex-shrink: 0;">
        <button class="btn btn-success btn-sm" style="font-size: 12px; padding: 4px 10px;">
          + Add New Position
        </button>
        <div v-if="loading" class="spinner-border spinner-border-sm" style="color: #28a745; margin-left: 5px;"></div>
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
    const loading = ref(false);
    const selectedBranchId = ref("");
    const quickFilterText = ref(""); // Tambahkan ini
    const gridApi = ref<any>(null); // Reference untuk AgGrid API
    const pageSize = 10;

    const onGridReady = (params: any) => {
      gridApi.value = params.api;
    };

    const onFilterTextBoxChanged = () => {
      gridApi.value.setQuickFilter(quickFilterText.value);
    };

    // ... (Fungsi editPosition, deletePosition, columnDefs tetap sama)

    const columnDefs = ref([
      { headerName: "No", valueGetter: "node.rowIndex + 1", width: 70 },
      { field: "name", headerName: "Nama Posisi", sortable: true },
      { field: "description", headerName: "Deskripsi", sortable: true },
      { 
        headerName: "Cabang", 
        field: "companyBranch.name",
        valueGetter: (params: any) => params.data.companyBranch?.name || '-' 
      },
      { 
        headerName: "Action",
        width: 120,
        cellRenderer: (params: any) => {
          const container = document.createElement('div');
          container.className = 'd-flex justify-content-center gap-2';
          
          container.innerHTML = `
            <button class="btn btn-sm bg-primary-transparent text-primary border-0 p-2 lh-1 rounded-circle">
              <i class="flaticon-pen fs-14"></i>
            </button>
            <button class="btn btn-sm bg-danger-transparent text-danger border-0 p-2 lh-1 rounded-circle">
              <i class="flaticon-delete fs-14"></i>
            </button>
          `;
          // Tambahkan listener kembali jika diperlukan...
          return container;
        }
      }
    ]);

    const defaultColDef = { sortable: true, resizable: true, flex: 1 };

    const fetchData = async () => {
      loading.value = true;
      try {
        const res = await api.get("/api/v1/master/position/list", {
          params: { companyBranchId: selectedBranchId.value || undefined }
        });
        rowData.value = res.data?.data || [];
      } finally {
        loading.value = false;
      }
    };

    onBeforeMount(async () => {
      await api.get("/api/v1/master/company/branch/list").then(res => branchList.value = res.data?.data || []);
      await fetchData();
    });

    return { 
      rowData, columnDefs, defaultColDef, selectedBranchId, branchList, 
      fetchData, pageSize, loading, quickFilterText, onGridReady, onFilterTextBoxChanged 
    };
  },
});
</script>