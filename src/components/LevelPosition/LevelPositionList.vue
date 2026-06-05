<template>
  <div class="card mb-25 border-0 rounded-0 bg-white">
    <div style="display:flex; gap:10px; padding:15px; align-items: center; flex-wrap: wrap;">
      <select v-model="selectedBranchId" @change="fetchData" class="form-select form-select-sm" style="flex: 1 1 200px; max-width: 300px;">
        <option value="">Semua Cabang</option>
        <option v-for="branch in branchList" :key="branch.id" :value="branch.id">{{ branch.name }}</option>
      </select>

      <div style="display: flex; gap: 8px; margin-left: auto; align-items: center; flex-shrink: 0;">
        <!-- <button class="btn btn-success btn-sm" style="font-size: 12px; padding: 4px 10px;">
          + Add New Level
        </button> -->
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

ModuleRegistry.registerModules([AllCommunityModule]);

export default defineComponent({
  components: { AgGridVue },
  setup() {
    const rowData = ref<any[]>([]);
    const branchList = ref<any[]>([]);
    const loading = ref(false);
    const selectedBranchId = ref("");
    const pageSize = ref(10);

    const editLevel = (data: any) => {
      console.log("Edit Level:", data);
      alert("Arahkan ke form edit untuk ID: " + data.id);
    };

    const deleteLevel = async (data: any) => {
      if (confirm(`Yakin ingin menghapus level ${data.name}?`)) {
        try {
          await api.delete(`/api/v1/master/levelPosition/delete/${data.id}`);
          fetchData();
        } catch (err) {
          alert("Gagal menghapus data");
        }
      }
    };

    const columnDefs = ref([
      { headerName: "No", valueGetter: "node.rowIndex + 1", width: 70 },
      { field: "code", headerName: "Code", sortable: true },
      { field: "name", headerName: "Name", sortable: true },
      {
        headerName: "Action",
        width: 120,
        cellRenderer: (params: any) => {
          const container = document.createElement('div');
          container.className = 'd-flex justify-content-center gap-2';
          
          container.innerHTML = `
            <button class="btn btn-sm bg-primary-transparent text-primary border-0 p-2 lh-1 rounded-circle" title="Edit">
              <i class="flaticon-pen fs-14"></i>
            </button>
            <button class="btn btn-sm bg-danger-transparent text-danger border-0 p-2 lh-1 rounded-circle" title="Delete">
              <i class="flaticon-delete fs-14"></i>
            </button>
          `;

          container.querySelector('.bg-primary-transparent')?.addEventListener('click', () => editLevel(params.data));
          container.querySelector('.bg-danger-transparent')?.addEventListener('click', () => deleteLevel(params.data));

          return container;
        }
      }
    ]);

    const defaultColDef = { sortable: true, resizable: true, flex: 1 };

    const fetchData = async () => {
      loading.value = true;
      try {
        const res = await api.get("/api/v1/master/levelPosition/list", {
          params: { companyBranchId: selectedBranchId.value || undefined }
        });
        rowData.value = res.data?.data || [];
      } catch (err) {
        console.error("Fetch error:", err);
        rowData.value = [];
      } finally {
        loading.value = false;
      }
    };

    onBeforeMount(async () => {
      await api.get("/api/v1/master/company/branch/list").then(res => branchList.value = res.data?.data || []);
      await fetchData();
    });

    return { rowData, columnDefs, defaultColDef, selectedBranchId, branchList, fetchData, pageSize, loading };
  },
});
</script>