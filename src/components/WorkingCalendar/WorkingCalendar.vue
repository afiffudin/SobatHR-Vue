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

    <div v-if="showModal" class="modal d-block" style="background: rgba(0,0,0,0.5);">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header"><h5>Edit Status Kalender</h5></div>
          <div class="modal-body">
            <p>Tanggal: <strong>{{ editForm.workingDate }}</strong></p>
            <div class="mb-3">
              <label>Status Hari Libur:</label>
              <select v-model="editForm.holiday" class="form-select">
                <option :value="false">TIDAK (Hari Kerja)</option>
                <option :value="true">YA (Hari Libur)</option>
              </select>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary btn-sm" @click="showModal = false">Batal</button>
            <button class="btn btn-primary btn-sm" @click="saveEdit">Simpan Perubahan</button>
          </div>
        </div>
      </div>
    </div>
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
    const showModal = ref(false);
    const filterYear = ref(new Date().getFullYear());
    const filterMonth = ref(new Date().getMonth() + 1);
    const selectedBranchId = ref("");
    const pageSize = ref(10);
    const editForm = ref({ id: '', workingDate: '', holiday: false });

    const openEdit = (data: any) => {
      editForm.value = { id: data.id, workingDate: data.workingDate, holiday: data.holiday };
      showModal.value = true;
    };

    const saveEdit = async () => {
      try {
        await api.put(`/api/v1/master/shift/calendar/${editForm.value.id}/update`, {
          holiday: editForm.value.holiday
        });
        showModal.value = false;
        fetchData();
        alert("Data berhasil diperbarui!");
      } catch (err) {
        alert("Gagal memperbarui data");
      }
    };

    const deleteRow = async (data: any) => {
      if (confirm(`Yakin ingin menghapus kalender tanggal ${data.workingDate}?`)) {
        try {
          await api.delete(`/api/v1/master/shift/calendar/delete/${data.id}`);
          fetchData();
        } catch (err) {
          alert("Gagal menghapus data");
        }
      }
    };

    const columnDefs = ref([
      { headerName: "No", valueGetter: "node.rowIndex + 1", width: 70 },
      { headerName: "Shift", field: "shift.name" },
      { headerName: "Date", field: "workingDate" },
      { headerName: "Is Holiday", field: "holiday", cellRenderer: (p: any) => p.value ? "YA" : "TIDAK" },
      { headerName: "Branch", field: "shift.companyBranch.name" },
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

          container.querySelector('.bg-primary-transparent')?.addEventListener('click', () => openEdit(params.data));
          container.querySelector('.bg-danger-transparent')?.addEventListener('click', () => deleteRow(params.data));

          return container;
        }
      }
    ]);

    const defaultColDef = { sortable: true, resizable: true, flex: 1 };

    const uniqueRowData = computed(() => {
      const map = new Map();
      rowData.value.forEach(item => map.set(item.id, item));
      return Array.from(map.values());
    });

    const fetchData = async () => {
      loading.value = true;
      try {
        const res = await api.get("/api/v1/master/shift/calendar/list", {
          params: { year: filterYear.value, month: filterMonth.value, companyBranchId: selectedBranchId.value || undefined }
        });
        rowData.value = res.data?.data || [];
      } catch (err) { rowData.value = []; } 
      finally { loading.value = false; }
    };

    onBeforeMount(async () => {
      const res = await api.get("/api/v1/master/company/branch/list");
      branchList.value = res.data?.data || [];
      await fetchData();
    });

    return { 
      rowData, uniqueRowData, columnDefs, defaultColDef, filterYear, filterMonth,
      selectedBranchId, branchList, fetchData, pageSize, loading, showModal, editForm, saveEdit 
    };
  },
});
</script>