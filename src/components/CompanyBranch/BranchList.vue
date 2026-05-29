<template>
  <div class="card bg-white border-0 rounded-10 mb-4 p-4">
    <div class="d-sm-flex justify-content-between align-items-center mb-3">
      <button class="btn btn-success text-white fw-medium px-3 btn-sm mt-2 mt-sm-0">
        + Add New Branch
      </button>
      <div class="search-box">
        <input 
            type="text" 
            v-model="searchQuery"
            class="form-control form-control-sm" 
            placeholder="Search branch..." 
            style="width: 250px;"
        />
        <i class="flaticon-search-1"></i>
      </div>
    </div>
    
    <div class="table-responsive">
      <table class="table table-hover align-middle mb-0" style="min-width: 1000px;">
        <thead class="table-light">
          <tr>
            <th class="text-black fw-medium py-3">No</th>
            <th class="text-black fw-medium py-3">Name</th>
            <th class="text-black fw-medium py-3">Address</th>
            <th class="text-black fw-medium py-3">Phone</th>
            <th class="text-black fw-medium py-3">Email</th>
            <th class="text-black fw-medium py-3">Timezone</th>
            <th class="text-black fw-medium py-3">Radius</th>
            <th class="text-black fw-medium py-3 text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading">
            <td colspan="8" class="text-center py-4">Memuat data...</td>
          </tr>
          
          <tr v-for="(item, index) in filteredBranches" :key="item.id">
            <td class="fw-semibold text-muted">{{ index + 1 }}</td>
            <td><span class="fw-semibold text-black">{{ item.name }}</span></td>
            <td>{{ item.locationAddress?.fullAddress || '-' }}</td>
            <td>{{ item.phoneNo || '-' }}</td>
            <td>{{ item.emailAddress || '-' }}</td>
            <td>
              <span class="badge bg-success-transparent text-success border px-2 py-1 rounded-pill">
                {{ item.timezone }}
              </span>
            </td>
            <td>
              <span class="badge bg-primary-transparent text-primary border px-2 py-1 rounded-pill">
                {{ item.absentRadius }} Meter
              </span>
            </td>
            <td class="text-center">
              <div class="d-flex justify-content-center gap-2">
                <button class="btn btn-sm bg-primary-transparent text-primary border-0 p-2 lh-1 rounded-circle">
                  <i class="flaticon-pen fs-14"></i>
                </button>
                <button class="btn btn-sm bg-danger-transparent text-danger border-0 p-2 lh-1 rounded-circle">
                  <i class="flaticon-delete fs-14"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from "vue";
import api from "../../utils/api"; 

interface Branch {
  id: string;
  name: string;
  phoneNo: string;
  emailAddress: string;
  timezone: string;
  absentRadius: number;
  locationAddress: { fullAddress: string };
}

export default defineComponent({
  name: "BranchList",
  setup() {
    const branches = ref<Branch[]>([]);
    const loading = ref(true);
    const searchQuery = ref("");

    const fetchBranches = async () => {
      try {
        loading.value = true;
        // Panggil endpoint sesuai Swagger
        const response = await api.get("/api/v1/master/company/branch/list");
        if (response.data && response.data.data) {
          branches.value = response.data.data;
        }
      } catch (error) {
        console.error("Gagal memuat data branch:", error);
      } finally {
        loading.value = false;
      }
    };

    const filteredBranches = computed(() => {
      return branches.value.filter(b => 
        b.name.toLowerCase().includes(searchQuery.value.toLowerCase())
      );
    });

    onMounted(fetchBranches);

    return { branches, loading, searchQuery, filteredBranches };
  },
});
</script>