<template>
  <div class="card bg-white border-0 rounded-10 mb-4 p-4">
    <div class="d-sm-flex justify-content-between align-items-center mb-3">
      <button class="btn btn-success text-white fw-medium px-3 btn-sm mt-2 mt-sm-0">
        + Add New Working Schedule
      </button>
    </div>

     <div class="search-box">
        <input 
            type="text" 
            class="form-control form-control-sm" 
            placeholder="Search Working Calendar..." 
            style="width: 250px;"
        />
        <i class="flaticon-search-1"></i>
        </div>
    <!-- </div> -->
    
    <div class="table-responsive">
      <table class="table table-hover align-middle mb-0 table-adlash" style="min-width: 1000px;">
        <thead class="table-light">
          <tr>
            <th scope="col" class="text-black fw-medium py-3">No</th>
            <th scope="col" class="text-black fw-medium py-3">Working Calendar Name</th>
            <th scope="col" class="text-black fw-medium py-3">Employee Name</th>
            <th scope="col" class="text-black fw-medium py-3">Shift Type Name</th>
            <th scope="col" class="text-black fw-medium py-3">Jam Masuk</th>
            <th scope="col" class="text-black fw-medium py-3">Jam Keluar</th>
            <th scope="col" class="text-black fw-medium py-3 text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="fw-semibold text-muted">01</td>
            <td>
              <span class="fw-semibold text-black">Senin, 26-05-2026</span>
            </td>
            <td>Adel</td>
            <td>OF4 - p bsb jaya</td>
            <td>14:00:00</td>
            <td>22:00:00</td>
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
          
          <tr>
            <td class="fw-semibold text-muted">02</td>
            <td>
              <span class="fw-semibold text-black">Minggu, 25-05-2026</span>
            </td>
            <td>Rico</td>
            <td>OF4 - p bsb jaya</td>
            <td>14:00:00</td>
            <td>22:00:00</td>
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
      <span class="text-muted fs-14">Showing 1 to 2 of 2 entries</span>
      
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
import { defineComponent } from "vue";

export default defineComponent({
  name: "WorkingCalendarList",
});
</script>