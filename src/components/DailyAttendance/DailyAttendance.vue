<template>
  <div class="card bg-white border-0 rounded-10 mb-4 p-4">
    <div class="d-sm-flex justify-content-between align-items-center mb-3">
      </div>

    <div class="search-box mb-3">
      <input 
        type="text" 
        class="form-control form-control-sm" 
        placeholder="Search Daily Attendance..." 
        style="width: 250px;"
      />
      <i class="flaticon-search-1"></i>
    </div>
    
    <div class="table-responsive">
      <table class="table table-hover align-middle mb-0 table-adlash" style="white-space: nowrap;">
        <thead class="table-light">
          <tr>
            <th scope="col" class="text-black fw-medium py-3">No</th>
            <th scope="col" class="text-black fw-medium py-3">Company Branch Name</th>
            <th scope="col" class="text-black fw-medium py-3">Employee Name</th>
            <th scope="col" class="text-black fw-medium py-3">Absent Date</th>
            <th scope="col" class="text-black fw-medium py-3">Nama Hari</th>
            <th scope="col" class="text-black fw-medium py-3">Check In Time</th>
            <th scope="col" class="text-black fw-medium py-3">Check Out Time</th>
            <th scope="col" class="text-black fw-medium py-3 text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading">
            <td colspan="8" class="text-center py-4 text-muted">
              <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Loading data dari database...
            </td>
          </tr>

          <tr v-else-if="attendanceList.length === 0">
            <td colspan="8" class="text-center py-4 text-muted">Tidak ada data kehadiran hari ini.</td>
          </tr>

          <tr v-else v-for="(item, index) in attendanceList" :key="item.employee?.id || index">
            <td class="fw-semibold text-muted">{{ String(index + 1).padStart(2, '0') }}</td>
            <td>
              <span class="fw-semibold text-black">{{ item.companyBranch?.name || '-' }}</span>
            </td>
            <td>{{ item.employee?.fullName || '-' }}</td>
            <td>{{ item.absentDate || '-' }}</td>
            <td>{{ getDayName(item.absentDate) }}</td>
            <td>{{ item.checkInTime || '-' }}</td>
            <td>{{ item.checkOutTime || '-' }}</td>
            <td class="text-center">
              <div class="d-flex justify-content-center gap-2">
                <button class="btn btn-sm bg-primary-transparent text-primary border-0 p-2 lh-1 rounded-circle" title="Edit">
                  <i class="flaticon-pen fs-14"></i>
                </button>
                <button class="btn btn-sm bg-danger-transparent text-danger border-0 p-2 lh-1 rounded-circle" title="Delete">
                  <i class="flaticon-delete fs-14"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="d-flex justify-content-between align-items-center mt-4 flex-wrap gap-2">
      <span class="text-muted fs-14">Showing 1 to {{ attendanceList.length }} of {{ attendanceList.length }} entries</span>
      
      <nav aria-label="Table navigation">
        <ul class="pagination pagination-sm mb-0">
          <li class="page-item disabled">
            <a class="page-link shadow-none" href="#" aria-label="Previous">
              <span aria-hidden="true">&laquo;</span>
            </a>
          </li>
          <li class="page-item active"><a class="page-link shadow-none" href="#">1</a></li>
          <li class="page-item"><a class="page-link shadow-none" href="#">2</a></li>
          <li class="page-item">
            <a class="page-link shadow-none" href="#" aria-label="Next">
              <span aria-hidden="true">&raquo;</span>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import api from "../../utils/api"; 

// Interface yang disesuaikan persis dengan skema data JSON asli Swagger kamu
interface Attendance {
  absentId: number | null;
  absentDate: string;
  absentStatus: string;
  checkInTime: string | null;
  checkOutTime: string | null;
  employee: {
    id: string;
    fullName: string;
  };
  companyBranch: {
    id: string;
    name: string;
  };
}

export default defineComponent({
  name: "DailyAttendanceList",
  setup() {
    const attendanceList = ref<Attendance[]>([]);
    const loading = ref<boolean>(true);

    // Fungsi pembantu untuk mengubah "2026-05-01" menjadi "Jumat"
    const getDayName = (dateString: string): string => {
      if (!dateString) return "-";
      const date = new Date(dateString);
      return date.toLocaleDateString("id-ID", { weekday: "long" });
    };

    const fetchAttendanceData = async () => {
      try {
        loading.value = true;
        
        const response = await api.get("/api/v1/attendance/employee/list", {
          params: {
            page: 0,
            size: 10
          }
        }); 
        
        // REVISI: Berdasarkan JSON-mu, data array langsung berada di dalam objek response.data.data
        if (response.data && response.data.data) {
          attendanceList.value = response.data.data;
        } else {
          attendanceList.value = [];
        }
        
      } catch (error) {
        console.error("Gagal melakukan sinkronisasi data database:", error);
      } finally {
        loading.value = false;
      }
    };

    onMounted(() => {
      fetchAttendanceData();
    });

    return {
      attendanceList,
      loading,
      fetchAttendanceData,
      getDayName
    };
  },
});
</script>