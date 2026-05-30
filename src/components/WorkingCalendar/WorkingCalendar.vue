<template>
  <div class="card mb-25 border-0 rounded-0 bg-white">
    <div style="display:flex; gap:10px; padding:15px; align-items: center; flex-wrap: wrap;">
      
      <input type="number" v-model="filterYear" @change="fetchData" class="form-control form-control-sm" style="width: 100px;" placeholder="Tahun" />
      <input type="number" v-model="filterMonth" @change="fetchData" class="form-control form-control-sm" style="width: 80px;" placeholder="Bulan" />

      <select v-model="selectedBranchId" @change="fetchData" class="form-select form-select-sm" style="flex: 1 1 200px; max-width: 300px;">
        <option value="">Semua Cabang</option>
        <option v-for="branch in branchList" :key="branch.id" :value="branch.id">{{ branch.name }}</option>
      </select>

      <div v-if="loading" class="spinner-border spinner-border-sm text-success"></div>
    </div>

    <AgGridVue
      class="ag-theme-quartz"
      style="height: 500px; width: 100%"
      :columnDefs="columnDefs"
      :rowData="uniqueRowData" 
      :defaultColDef="defaultColDef"
      :pagination="true"
      :paginationPageSize="pageSize"
    />
  </div>
</template>

<script lang="ts">
import { ref, defineComponent, onBeforeMount, computed } from "vue";
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
    const filterYear = ref(new Date().getFullYear());
    const filterMonth = ref(new Date().getMonth() + 1);
    const selectedBranchId = ref("");
    const pageSize = ref(10);

    const columnDefs = ref([
      { headerName: "No", valueGetter: "node.rowIndex + 1", width: 70 },
      { headerName: "Shift", field: "shift.name" },
      { headerName: "Date", field: "workingDate" },
      { headerName: "Is Holiday", field: "holiday", cellRenderer: (p: any) => p.value ? "YA" : "TIDAK" },
      { headerName: "Branch", field: "shift.companyBranch.name" }
    ]);

    const defaultColDef = { sortable: true, resizable: true, flex: 1 };

    // Mencegah duplikasi data secara client-side
    const uniqueRowData = computed(() => {
      const map = new Map();
      rowData.value.forEach(item => map.set(item.id, item));
      return Array.from(map.values());
    });

    const fetchData = async () => {
      loading.value = true;
      try {
        // REVISI: Langsung panggil endpoint kalender dengan filter lengkap
        // Pastikan endpoint ini di backend sudah menangani filter branch/year/month
        const res = await api.get("/api/v1/master/shift/calendar/list", {
          params: {
            year: filterYear.value,
            month: filterMonth.value,
            companyBranchId: selectedBranchId.value || undefined
          }
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
      try {
        const res = await api.get("/api/v1/master/company/branch/list");
        branchList.value = res.data?.data || [];
      } catch (e) { console.error(e); }
      await fetchData();
    });

    return { 
      rowData, uniqueRowData, columnDefs, defaultColDef, filterYear, filterMonth,
      selectedBranchId, branchList, fetchData, pageSize, loading 
    };
  },
});
</script>