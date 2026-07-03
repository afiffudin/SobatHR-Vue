<template>
  <div class="card border-0 rounded-3 mb-4 overflow-hidden shadow-sm">

    <!-- Filter / Upload Area -->
    <div class="filter-area px-4 py-3">
      <div class="d-flex align-items-center gap-2 mb-3">
        <i class="ti ti-calendar-stats text-primary" style="font-size:18px"></i>
        <span class="fw-semibold text-dark" style="font-size:15px">Employee Assignment</span>
      </div>

      <div class="row g-3 align-items-end">
        <!-- Upload Excel -->
        <div class="col-12 col-md-6 col-lg-5">
          <label class="sc-label"><i class="ti ti-file-spreadsheet"></i> Upload File Excel</label>
          <div class="upload-box" @click="triggerFileInput" @dragover.prevent @drop.prevent="onDrop">
            <input
              ref="fileInputRef"
              type="file"
              accept=".xlsx,.xls"
              class="d-none"
              @change="onFileChange"
            />
            <template v-if="!fileName">
              <i class="ti ti-upload" style="font-size:20px;color:#adb5bd"></i>
              <span class="upload-hint">Klik atau drag & drop file <strong>.xlsx</strong> di sini</span>
            </template>
            <template v-else>
              <i class="ti ti-file-check" style="font-size:20px;color:#2f9e44"></i>
              <span class="upload-filename">{{ fileName }}</span>
              <button class="btn-clear" @click.stop="clearFile">
                <i class="ti ti-x"></i>
              </button>
            </template>
          </div>
        </div>

        <!-- Info setelah file diload -->
        <div class="col-12 col-md-auto" v-if="period || companyBranch">
          <div class="d-flex flex-wrap gap-2">
            <span class="sc-chip" v-if="period">
              <i class="ti ti-calendar"></i> {{ period }}
            </span>
            <span class="sc-chip" v-if="companyBranch">
              <i class="ti ti-building"></i> {{ companyBranch }}
            </span>
          </div>
        </div>
      </div>

      <!-- Error -->
      <div v-if="errorMsg" class="alert alert-danger mt-3 py-2 px-3 mb-0" style="font-size:13px">
        <i class="ti ti-alert-circle me-1"></i> {{ errorMsg }}
      </div>
    </div>

    <!-- Table Header Info -->
    <div class="table-info-bar px-4 py-2" v-if="rowData.length">
      <div class="d-flex align-items-center justify-content-between flex-wrap gap-2">
        <div class="d-flex align-items-center gap-3 flex-wrap">
          <div>
            <span class="info-label">Period</span>
            <span class="info-value ms-2 fw-semibold">{{ period || '-' }}</span>
          </div>
          <span class="text-muted">|</span>
          <div>
            <span class="info-label">Company Branch</span>
            <span class="info-value ms-2 fw-semibold">{{ companyBranch || '-' }}</span>
          </div>
        </div>
        <span class="sc-badge-count">
          <i class="ti ti-users"></i> {{ rowData.length }} karyawan
        </span>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="state-box">
      <i class="ti ti-loader-2 spin" style="font-size:28px;color:#adb5bd"></i>
      <p class="mb-0 text-muted mt-2" style="font-size:13px">Membaca file Excel...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="!rowData.length" class="state-box">
      <i class="ti ti-table-import" style="font-size:36px;color:#dee2e6"></i>
      <p class="mb-0 mt-2" style="font-size:14px;color:#adb5bd">Upload file Excel untuk menampilkan data assignment</p>
    </div>

    <!-- Table -->
    <div v-else class="table-responsive">
      <table class="assign-table">
        <thead>
          <tr>
            <th class="col-sticky col-no">No</th>
            <th class="col-sticky col-name">Nama Karyawan</th>
            <th
              v-for="day in daysInMonth"
              :key="day"
              class="col-day"
              :class="{ 'col-day-weekend': isWeekend(day) }"
            >
              {{ day }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(emp, idx) in rowData" :key="emp.employeeId">
            <td class="col-sticky col-no text-muted">{{ idx + 1 }}</td>
            <td class="col-sticky col-name">
              <span class="emp-name">{{ emp.employeeName }}</span>
            </td>
            <td
              v-for="day in daysInMonth"
              :key="day"
              class="col-day"
              :class="{ 'col-day-weekend': isWeekend(day) }"
            >
              <span
                v-if="emp.shifts[day]"
                class="shift-badge"
                :class="getShiftClass(emp.shifts[day])"
              >
                {{ emp.shifts[day] }}
              </span>
              <span v-else class="text-muted" style="font-size:11px">-</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import * as XLSX from "xlsx";

interface EmpRow {
  employeeId: string;
  employeeName: string;
  shifts: Record<number, string>;
}

export default defineComponent({
  name: "EmployeeAssignmentView",

  setup() {
    const fileInputRef = ref<HTMLInputElement | null>(null);
    const fileName     = ref("");
    const isLoading    = ref(false);
    const errorMsg     = ref("");
    const period       = ref("");
    const companyBranch = ref("");
    const rowData      = ref<EmpRow[]>([]);

    // Kolom hari diambil langsung dari header Excel, bukan dari kalender
    const daysInMonth = ref<number[]>([]);

    const isWeekend = (day: number) => {
      if (!period.value) return false;
      const [y, m] = period.value.split("-").map(Number);
      const dow = new Date(y, m - 1, day).getDay();
      return dow === 0 || dow === 6;
    };

    const getShiftAbbr = (shiftName: string) => {
      if (!shiftName) return "-";
      const s = shiftName.toLowerCase();
      if (s.includes("pagi"))  return "P";
      if (s.includes("sore"))  return "S";
      if (s.includes("malam")) return "M";
      return shiftName.substring(0, 2).toUpperCase();
    };

    const getShiftClass = (shiftName: string) => {
      if (!shiftName) return "";
      const s = shiftName.toLowerCase();
      if (s.includes("pagi"))  return "shift-pagi";
      if (s.includes("sore"))  return "shift-sore";
      if (s.includes("malam")) return "shift-malam";
      return "shift-default";
    };

    const triggerFileInput = () => fileInputRef.value?.click();

    const clearFile = () => {
      fileName.value      = "";
      period.value        = "";
      companyBranch.value = "";
      rowData.value       = [];
      daysInMonth.value   = [];
      errorMsg.value      = "";
      if (fileInputRef.value) fileInputRef.value.value = "";
    };

    const processFile = (file: File) => {
      if (!file) return;

      // Validasi ekstensi
      if (!/\.(xlsx|xls)$/i.test(file.name)) {
        errorMsg.value = "Format file tidak didukung. Gunakan file .xlsx atau .xls";
        return;
      }

      fileName.value = file.name;
      isLoading.value = true;
      errorMsg.value  = "";

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data    = new Uint8Array(e.target!.result as ArrayBuffer);
          const wb      = XLSX.read(data, { type: "array" });

          // Cari sheet Employee_Assignment, fallback ke sheet pertama
          const sheetName = wb.SheetNames.find((n) =>
            n.toLowerCase().replace(/[\s_]/g, "") === "employeeassignment"
          ) ?? wb.SheetNames[0];

          const ws = wb.Sheets[sheetName];

          // Baca sebagai array of arrays (raw)
          const raw: any[][] = XLSX.utils.sheet_to_json(ws, {
            header: 1,
            defval: "",
            raw: true,
          });
          if (!raw || raw.length < 5) {
            throw new Error("Format file tidak sesuai. Minimal 5 baris data diperlukan.");
          }

          // Baris 0: Period    | 2026-06
          // Baris 1: company branch | nama cabang
          // Baris 2: (bisa kosong)
          // Baris 3: employee_id | employeename | ...
          // Baris 4: kosong | kosong | _8 | _9 | ... ← header tanggal
          // Baris 5+: data karyawan

          period.value        = String(raw[0]?.[1] ?? "").trim();
          companyBranch.value = String(raw[1]?.[1] ?? "").trim();

          // Cari baris header tanggal secara dinamis:
          // Support format angka murni (1,2,3) ATAU format _N (_1,_2,_3)
          let headerRowIdx = -1;
          let dayStartCol  = 2;

          for (let r = 2; r < Math.min(raw.length, 10); r++) {
            const row = raw[r] || [];
            for (let c = 0; c < row.length; c++) {
              const cell = String(row[c] ?? "").trim();
              // Cocok dengan _1, _2, ... ATAU angka 1-31 murni
              if (/^_\d+$/.test(cell) || /^\d+$/.test(cell) && parseInt(cell) >= 1 && parseInt(cell) <= 31) {
                // Pastikan bukan baris data (ada angka tapi ini memang header tanggal)
                // Cek minimal 3 cell berikutnya juga angka/pattern serupa
                let consecutive = 0;
                for (let cc = c; cc < Math.min(row.length, c + 5); cc++) {
                  const nc = String(row[cc] ?? "").trim();
                  if (/^_?\d+$/.test(nc) && parseInt(nc.replace("_", "")) >= 1 && parseInt(nc.replace("_", "")) <= 31) {
                    consecutive++;
                  }
                }
                if (consecutive >= 3) {
                  headerRowIdx = r;
                  dayStartCol  = c;
                  break;
                }
              }
            }
            if (headerRowIdx !== -1) break;
          }

          if (headerRowIdx === -1) {
            throw new Error("Baris header tanggal tidak ditemukan.");
          }

          // Kumpulkan semua kolom tanggal dari header row
          // Support format angka murni (1,2,3) ATAU _N (_1,_2,_3)
          const dayHeaders: number[] = [];
          const headerRow = raw[headerRowIdx] || [];
          for (let c = dayStartCol; c < headerRow.length; c++) {
            const cell = String(headerRow[c] ?? "").trim();
            const num  = parseInt(cell.replace("_", ""), 10);
            if (!isNaN(num) && num >= 1 && num <= 31) {
              dayHeaders.push(num);
            }
          }

          if (dayHeaders.length === 0) {
            throw new Error("Tidak ada kolom tanggal valid ditemukan.");
          }

          // Kolom tabel ikut header Excel — _8 s/d _14 → tampil 8–14 saja
          daysInMonth.value = dayHeaders;

          // Baris data mulai setelah header tanggal
          const result: EmpRow[] = [];
          for (let r = headerRowIdx + 1; r < raw.length; r++) {
            const row = raw[r];
            if (!row) continue;

            const empId   = String(row[0] ?? "").trim();
            const empName = String(row[1] ?? "").trim();
            // Skip baris kosong atau baris sub-header
            if (!empId && !empName) continue;
            if (empId === "employee_id" || empId === "NaN") continue;

            const shifts: Record<number, string> = {};
            for (let c = dayStartCol; c < row.length; c++) {
              const dayIdx = c - dayStartCol;
              const day    = dayHeaders[dayIdx];
              const val    = String(row[c] ?? "").trim();
              if (day && val && val !== "NaN") shifts[day] = val;
            }

            result.push({ employeeId: empId, employeeName: empName, shifts });
          }

          rowData.value = result;

          if (result.length === 0) {
            errorMsg.value = "Data karyawan tidak ditemukan. Pastikan format Excel sesuai.";
          }
        } catch (err: any) {
          errorMsg.value = err.message || "Gagal membaca file Excel.";
          rowData.value  = [];
        } finally {
          isLoading.value = false;
        }
      };

      reader.onerror = () => {
        errorMsg.value  = "Gagal membaca file. Coba lagi.";
        isLoading.value = false;
      };

      reader.readAsArrayBuffer(file);
    };

    const onFileChange = (e: Event) => {
      const input = e.target as HTMLInputElement;
      if (input.files?.[0]) processFile(input.files[0]);
    };

    const onDrop = (e: DragEvent) => {
      const file = e.dataTransfer?.files?.[0];
      if (file) processFile(file);
    };

    return {
      fileInputRef,
      fileName,
      isLoading,
      errorMsg,
      period,
      companyBranch,
      rowData,
      daysInMonth,
      isWeekend,
      getShiftAbbr,
      getShiftClass,
      triggerFileInput,
      clearFile,
      onFileChange,
      onDrop,
    };
  },
});
</script>

<style scoped>
/* Filter area */
.filter-area {
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
}

.sc-label {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  font-weight: 600;
  color: #6c757d;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 6px;
}

/* Upload box */
.upload-box {
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1.5px dashed #ced4da;
  border-radius: 8px;
  padding: 10px 14px;
  cursor: pointer;
  background: #fff;
  transition: border-color 0.15s, background 0.15s;
  min-height: 44px;
}
.upload-box:hover {
  border-color: #4263eb;
  background: #f0f4ff;
}
.upload-hint {
  font-size: 12px;
  color: #868e96;
}
.upload-filename {
  font-size: 13px;
  font-weight: 500;
  color: #2f9e44;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.btn-clear {
  background: none;
  border: none;
  color: #adb5bd;
  padding: 0;
  cursor: pointer;
  font-size: 14px;
  line-height: 1;
  flex-shrink: 0;
}
.btn-clear:hover { color: #e03131; }

/* Chips */
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
  padding: 3px 10px;
}

/* Table info bar */
.table-info-bar {
  background: #fff;
  border-bottom: 1px solid #e9ecef;
}
.info-label {
  font-size: 11px;
  font-weight: 600;
  color: #868e96;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.info-value { font-size: 13px; color: #212529; }

.sc-badge-count {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  font-weight: 500;
  color: #2f9e44;
  background: #ebfbee;
  border: 1px solid #b2f2bb;
  border-radius: 20px;
  padding: 2px 10px;
}

/* States */
.state-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  text-align: center;
}

/* Spinner */
.spin { animation: spin 0.8s linear infinite; display: inline-block; }
@keyframes spin { to { transform: rotate(360deg); } }

/* Table */
.table-responsive {
  overflow-x: auto;
  overflow-y: auto;
  max-height: 560px;
}

.assign-table {
  border-collapse: separate;
  border-spacing: 0;
  width: max-content;
  min-width: 100%;
  font-size: 12px;
}

.assign-table thead tr th {
  position: sticky;
  top: 0;
  z-index: 3;
  background: #f8f9fa;
  border-bottom: 2px solid #dee2e6;
  border-right: 1px solid #e9ecef;
  padding: 8px 6px;
  text-align: center;
  font-size: 11px;
  font-weight: 600;
  color: #495057;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  white-space: nowrap;
}

/* Sticky columns */
.col-sticky {
  position: sticky !important;
  z-index: 4 !important;
  background: #f8f9fa;
}
.assign-table tbody .col-sticky {
  background: #fff;
  z-index: 2 !important;
}

.col-no   { left: 0;    min-width: 44px;  width: 44px; }
.col-name { left: 44px; min-width: 160px; width: 160px; text-align: left !important; border-right: 2px solid #dee2e6 !important; }

/* Day columns */
.col-day {
  min-width: 90px;
  width: 90px;
  text-align: center;
  padding: 6px 4px !important;
}
.col-day-weekend { background: #fff9db !important; }
.assign-table thead .col-day-weekend {
  background: #fff3bf !important;
  color: #e67700 !important;
}

/* Body rows */
.assign-table tbody tr td {
  border-bottom: 1px solid #f1f3f5;
  border-right: 1px solid #f1f3f5;
  padding: 7px 4px;
  vertical-align: middle;
  text-align: center;
}
.assign-table tbody tr:hover td { background: #f8f9fa !important; }
.assign-table tbody tr:hover .col-sticky { background: #f1f3f4 !important; }

.emp-name { font-size: 13px; font-weight: 500; color: #212529; }

/* Shift badges */
.shift-badge {
  display: inline-block;
  font-size: 11px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 4px;
  line-height: 1.5;
  white-space: nowrap;
}
.shift-pagi    { background: #fff9db; color: #e67700; }
.shift-sore    { background: #e7f5ff; color: #1971c2; }
.shift-malam   { background: #f3f0ff; color: #6741d9; }
.shift-default { background: #f1f3f5; color: #495057; }

@media (max-width: 576px) {
  .filter-area { padding: 0.75rem !important; }
  .col-name { min-width: 120px; width: 120px; }
}
</style>