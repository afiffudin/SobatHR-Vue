<template>
  <div>
    <div class="card mb-25 border-0 rounded-0 bg-white">
      <!-- FILTER -->
      <div
        style="
          display: flex;
          gap: 10px;
          padding: 15px;
          align-items: center;
          flex-wrap: wrap;
        "
      >
        <div style="display: flex; align-items: center; gap: 5px">
          <label style="font-size: 12px; font-weight: bold">Dari:</label>
          <input
            type="date"
            v-model="startDate"
            @change="fetchData"
            class="form-control form-control-sm"
            style="width: 140px"
          />
        </div>

        <div style="display: flex; align-items: center; gap: 5px">
          <label style="font-size: 12px; font-weight: bold">Sampai:</label>
          <input
            type="date"
            v-model="endDate"
            @change="fetchData"
            class="form-control form-control-sm"
            style="width: 140px"
          />
        </div>

        <select
          v-model="attendanceStatus"
          @change="fetchData"
          class="form-select form-select-sm"
          style="width: 130px"
        >
          <option value="All">Semua Status</option>
          <option value="YES">Hadir</option>
          <option value="NO">Tidak Hadir</option>
        </select>

        <select
          v-model="selectedBranchId"
          @change="fetchData"
          class="form-select form-select-sm"
          style="width: 250px"
        >
          <option value="">Semua Cabang</option>
          <option
            v-for="branch in branchList"
            :key="branch.id"
            :value="branch.id"
          >
            {{ branch.name }}
          </option>
        </select>

        <input
          type="text"
          v-model="employeeName"
          placeholder="Cari Nama Employee"
          class="form-control form-control-sm"
          style="width: 220px"
        />

        <div
          style="
            display: flex;
            gap: 8px;
            margin-left: auto;
            align-items: center;
          "
        >
          <button
            @click="exportToExcel"
            class="btn btn-success btn-sm"
          >
            Export Excel
          </button>

          <div
            v-if="loading"
            class="spinner-border text-success"
            style="width: 16px; height: 16px"
          ></div>
        </div>
      </div>

      <!-- SUMMARY -->
      <div
        style="
          padding: 15px;
          border-bottom: 1px solid #f2f2f2;
        "
      >
        <h5
          style="
            font-size: 14px;
            margin: 0;
            font-weight: bold;
            color: #495057;
          "
        >
          Summary Absensi Employee
        </h5>
      </div>

      <AgGridVue
        class="ag-theme-quartz"
        style="height: 500px; width: 100%"
        :columnDefs="summaryColumnDefs"
        :rowData="summaryRowData"
        :defaultColDef="defaultColDef"
        :pagination="true"
        :paginationPageSize="pageSize"
      />
    </div>
  </div>
</template>

<script lang="ts">
import {
  ref,
  computed,
  defineComponent,
  onBeforeMount,
} from "vue";

import { AgGridVue } from "ag-grid-vue3";
import {
  ModuleRegistry,
  AllCommunityModule,
} from "ag-grid-community";

import api from "@/utils/api";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

ModuleRegistry.registerModules([AllCommunityModule]);

export default defineComponent({
  components: {
    AgGridVue,
  },

  setup() {
    const loading = ref(false);

    const rowData = ref<any[]>([]);
    const branchList = ref<any[]>([]);

    const pageSize = ref(10);

    const today = new Date();
    const firstDayOfMonth = new Date(
      today.getFullYear(),
      today.getMonth(),
      1
    );

    const startDate = ref(
      firstDayOfMonth.toISOString().split("T")[0]
    );

    const endDate = ref(
      today.toISOString().split("T")[0]
    );

    const attendanceStatus = ref("All");
    const selectedBranchId = ref("");
    const employeeName = ref("");

    const defaultColDef = {
      sortable: true,
      resizable: true,
      filter: false,
      flex: 1,
    };

    const summaryColumnDefs = ref([
  {
    headerName: "Periode",
    field: "dateRange",
    minWidth: 220,
  },
  {
    headerName: "Nama Employee",
    field: "fullName",
    minWidth: 220,
  },
  {
    headerName: "No Pegawai",
    field: "employeeNo",
    minWidth: 150,
  },
  {
    headerName: "Cabang",
    field: "branchName",
    minWidth: 180,
  },
  {
    headerName: "Total Hadir",
    field: "totalHadir",
    cellStyle: {
      color: "green",
      fontWeight: "bold",
    },
  },
  {
    headerName: "Total Tidak Hadir",
    field: "totalTidakHadir",
    cellStyle: {
      color: "red",
      fontWeight: "bold",
    },
  },
  {
    headerName: "Total Log",
    field: "totalLog",
    cellStyle: {
      color:"#000",
      fontWeight: "bold",
    },
  },
]);

    const fetchData = async () => {
      loading.value = true;

      try {
        const res = await api.get(
          "/api/v1/attendance/employee/list",
          {
            params: {
              startDate: startDate.value,
              endDate: endDate.value,
              datePeriod: startDate.value,
              absentStatus: attendanceStatus.value,
              companyBranchId:
                selectedBranchId.value || undefined,
            },
          }
        );

        rowData.value =
          res.data?.data?.attendanceData ||
          res.data?.data ||
          [];
      } catch (err) {
        console.error(err);
        rowData.value = [];
      } finally {
        loading.value = false;
      }
    };

    const summaryRowData = computed(() => {
  const summaryMap: Record<string, any> = {};

  rowData.value.forEach((row) => {
    const empId =
      row.employee?.id ||
      row.employeeId ||
      row.employee?.employeeEmploymentInfo?.employeeNo;

    if (!empId) return;

    if (!summaryMap[empId]) {
      summaryMap[empId] = {
        dateRange: `${startDate.value} s/d ${endDate.value}`,
        fullName:
          row.employee?.fullName || "-",

        employeeNo:
          row.employee?.employeeEmploymentInfo?.employeeNo ||
          "-",

        branchName:
          row.employee?.employeeEmploymentInfo
            ?.companyBranch?.name || "-",

        totalHadir: 0,
        totalTidakHadir: 0,
        totalLog: 0,
      };
    }

    summaryMap[empId].totalLog++;

    if (
      row.absentStatus === "YES" ||
      row.status === "YES"
    ) {
      summaryMap[empId].totalHadir++;
    } else {
      summaryMap[empId].totalTidakHadir++;
    }
  });

  let result = Object.values(summaryMap);

  if (employeeName.value) {
    result = result.filter((item: any) =>
      item.fullName
        ?.toLowerCase()
        .includes(employeeName.value.toLowerCase())
    );
  }

  return result;
});

    const exportToExcel = () => {
  const wb = XLSX.utils.book_new();

  const wsSummary = XLSX.utils.json_to_sheet(
    summaryRowData.value.map((item: any) => ({
      Periode: item.dateRange,
      NamaEmployee: item.fullName,
      NoPegawai: item.employeeNo,
      Cabang: item.branchName,
      TotalHadir: item.totalHadir,
      TotalTidakHadir: item.totalTidakHadir,
      TotalLog: item.totalLog,
    }))
  );

  XLSX.utils.book_append_sheet(
    wb,
    wsSummary,
    "Summary Employees"
  );

  const excelBuffer = XLSX.write(wb, {
    bookType: "xlsx",
    type: "array",
  });

  const file = new Blob([excelBuffer], {
    type: "application/octet-stream",
  });

  saveAs(
    file,
    `Attendance_Summary_${startDate.value}_to_${endDate.value}.xlsx`
  );
};

    onBeforeMount(async () => {
      try {
        const branchRes = await api.get(
          "/api/v1/master/company/branch/list"
        );

        branchList.value =
          branchRes.data?.data || [];

        await fetchData();
      } catch (err) {
        console.error(err);
      }
    });

    return {
      startDate,
      endDate,
      attendanceStatus,
      selectedBranchId,
      employeeName,

      loading,
      pageSize,

      branchList,

      summaryRowData,
      summaryColumnDefs,
      defaultColDef,

      fetchData,
      exportToExcel,
    };
  },
});
</script>

<style scoped>
.ag-theme-quartz {
  --ag-font-size: 13px;
}

.ag-theme-quartz .ag-header-cell-menu-button,
.ag-theme-quartz .ag-header-icon,
.ag-theme-quartz .ag-icon-menu,
.ag-theme-quartz .ag-icon-filter,
.ag-theme-quartz .ag-icon-filter-active {
  display: none !important;
}
</style>