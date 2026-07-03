<template>
  <div class="card border-0 rounded-3 mb-4 overflow-hidden shadow-sm">

    <!-- Header -->
    <div class="filter-area px-4 py-3">
      <div class="d-flex align-items-center gap-2 mb-3">
        <i class="ti ti-file-download text-primary" style="font-size:18px"></i>
        <span class="fw-semibold text-dark" style="font-size:15px">Download Template Excel</span>
      </div>
      <p class="text-muted mb-0" style="font-size:12px">
        Pilih cabang dan periode, lalu klik Download untuk mendapatkan template Assignment Shift.
      </p>
    </div>

    <!-- Form -->
    <div class="px-4 py-4">
      <div class="row g-3 align-items-end">

        <!-- Cabang -->
        <div class="col-12 col-sm-8 col-md-5 col-lg-4">
          <label class="sc-label"><i class="ti ti-building"></i> Company Branch</label>
          <select v-model="form.branchId" class="form-select form-select-sm sc-select">
            <option value="" disabled>Pilih cabang...</option>
            <option v-for="b in branchOptions" :key="b.id" :value="b.id">{{ b.name }}</option>
          </select>
        </div>

        <!-- Bulan -->
        <div class="col-6 col-sm-3 col-md-2">
          <label class="sc-label"><i class="ti ti-calendar-month"></i> Bulan</label>
          <select v-model="form.month" class="form-select form-select-sm sc-select">
            <option v-for="m in 12" :key="m" :value="m">
              {{ new Date(0, m - 1).toLocaleString('id-ID', { month: 'long' }) }}
            </option>
          </select>
        </div>

        <!-- Tahun -->
        <div class="col-6 col-sm-3 col-md-2">
          <label class="sc-label"><i class="ti ti-calendar-time"></i> Tahun</label>
          <select v-model="form.year" class="form-select form-select-sm sc-select">
            <option v-for="y in 6" :key="y" :value="2024 + y">{{ 2024 + y }}</option>
          </select>
        </div>

        <!-- Tombol Download -->
        <div class="col-12 col-sm-auto">
          <button
            class="btn btn-success btn-sm d-flex align-items-center gap-2 px-3"
            style="height:31px"
            :disabled="!form.branchId || isLoading"
            @click="downloadTemplate"
          >
            <i class="ti" :class="isLoading ? 'ti-loader-2 spin' : 'ti-file-spreadsheet'"></i>
            {{ isLoading ? 'Menyiapkan...' : 'Download Template' }}
          </button>
        </div>

      </div>

      <!-- Preview info -->
      <div v-if="form.branchId && selectedBranchName" class="preview-box mt-4">
        <div class="preview-title">
          <i class="ti ti-info-circle text-primary"></i> Preview Template
        </div>
        <div class="row g-2 mt-2">
          <div class="col-auto">
            <span class="info-label">Period</span>
            <span class="info-value ms-2">{{ periodLabel }}</span>
          </div>
          <div class="col-auto"><span class="text-muted">|</span></div>
          <div class="col-auto">
            <span class="info-label">Company Branch</span>
            <span class="info-value ms-2">{{ selectedBranchName }}</span>
          </div>
          <div class="col-auto"><span class="text-muted">|</span></div>
          <div class="col-auto">
            <span class="info-label">Kolom Tanggal</span>
            <span class="info-value ms-2">1 s/d {{ daysInMonth }}</span>
          </div>
        </div>
        <div class="mt-2 d-flex flex-wrap gap-2">
          <span class="sheet-chip"><i class="ti ti-table"></i> Sheet: Employee_Assignment</span>
          <span class="sheet-chip"><i class="ti ti-users"></i> Sheet: Employee</span>
          <span class="sheet-chip"><i class="ti ti-clock"></i> Sheet: Shift</span>
        </div>
      </div>

      <!-- Error -->
      <div v-if="errorMsg" class="alert alert-danger mt-3 py-2 px-3 mb-0" style="font-size:13px">
        <i class="ti ti-alert-circle me-1"></i> {{ errorMsg }}
      </div>
    </div>

  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from "vue";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import api from "@/utils/api";

export default defineComponent({
  name: "DownloadTemplateView",

  setup() {
    const branchOptions = ref<any[]>([]);
    const isLoading     = ref(false);
    const errorMsg      = ref("");

    const form = ref({
      branchId: "" as string,
      month: new Date().getMonth() + 1,
      year:  new Date().getFullYear(),
    });

    const selectedBranchName = computed(() =>
      branchOptions.value.find((b) => b.id === form.value.branchId)?.name ?? ""
    );

    const periodLabel = computed(() => {
      const m = String(form.value.month).padStart(2, "0");
      return `${form.value.year}-${m}`;
    });

    const daysInMonth = computed(() =>
      new Date(form.value.year, form.value.month, 0).getDate()
    );

    // ── Helpers styling ──────────────────────────────────────────────
    const styleHeader = (bold = true, bg = "4263EB", color = "FFFFFF", size = 11) => ({
      font:      { bold, color: { rgb: color }, size, name: "Arial" },
      fill:      { type: "pattern", patternType: "solid", fgColor: { rgb: bg } },
      alignment: { horizontal: "center", vertical: "center", wrapText: true },
      border: {
        top:    { style: "thin", color: { rgb: "CCCCCC" } },
        bottom: { style: "thin", color: { rgb: "CCCCCC" } },
        left:   { style: "thin", color: { rgb: "CCCCCC" } },
        right:  { style: "thin", color: { rgb: "CCCCCC" } },
      },
    });

    const styleSubHeader = () => ({
      font:      { bold: true, color: { rgb: "1C3D5A" }, size: 10, name: "Arial" },
      fill:      { type: "pattern", patternType: "solid", fgColor: { rgb: "D9E8F5" } },
      alignment: { horizontal: "center", vertical: "center", wrapText: true },
      border: {
        top:    { style: "thin", color: { rgb: "CCCCCC" } },
        bottom: { style: "thin", color: { rgb: "CCCCCC" } },
        left:   { style: "thin", color: { rgb: "CCCCCC" } },
        right:  { style: "thin", color: { rgb: "CCCCCC" } },
      },
    });

    const styleInfo = (bold = false) => ({
      font:      { bold, size: 10, name: "Arial", color: { rgb: "212529" } },
      alignment: { vertical: "center" },
      border: {
        top:    { style: "thin", color: { rgb: "E9ECEF" } },
        bottom: { style: "thin", color: { rgb: "E9ECEF" } },
        left:   { style: "thin", color: { rgb: "E9ECEF" } },
        right:  { style: "thin", color: { rgb: "E9ECEF" } },
      },
    });

    const styleData = () => ({
      font:      { size: 10, name: "Arial", color: { rgb: "495057" } },
      alignment: { vertical: "center", horizontal: "center" },
      border: {
        top:    { style: "thin", color: { rgb: "DEE2E6" } },
        bottom: { style: "thin", color: { rgb: "DEE2E6" } },
        left:   { style: "thin", color: { rgb: "DEE2E6" } },
        right:  { style: "thin", color: { rgb: "DEE2E6" } },
      },
    });

    const setCell = (ws: any, addr: string, value: any, style?: any) => {
      ws[addr] = { v: value, t: typeof value === "number" ? "n" : "s", s: style };
    };

    // ── Sheet 1: Employee_Assignment ─────────────────────────────────
    const buildAssignmentSheet = (employees: any[]) => {
      const ws: any = {};
      const days    = daysInMonth.value;

      // Baris 1: Period
      setCell(ws, "A1", "Period",              styleInfo(true));
      setCell(ws, "B1", periodLabel.value,     styleInfo());

      // Baris 2: Company Branch
      setCell(ws, "A2", "company branch",          styleInfo(true));
      setCell(ws, "B2", selectedBranchName.value,  styleInfo());

      // Baris 3 & 4: kosong

      // Baris 5: header employee_id, employeename + header kosong untuk kolom tanggal
      setCell(ws, "A5", "employee_id",  styleHeader(true, "1C3D5A"));
      setCell(ws, "B5", "employeename", styleHeader(true, "1C3D5A"));
      for (let d = 1; d <= days; d++) {
        const col = XLSX.utils.encode_col(d + 1);
        setCell(ws, `${col}5`, `${d}`, styleSubHeader());
      }

      // Data karyawan mulai baris 6
      employees.forEach((emp, idx) => {
        const row = idx + 6;
        setCell(ws, `A${row}`, emp.id,       styleData());
        setCell(ws, `B${row}`, emp.fullName, { ...styleData(), alignment: { vertical: "center", horizontal: "left" } });
        for (let d = 1; d <= days; d++) {
          const col = XLSX.utils.encode_col(d + 1);
          setCell(ws, `${col}${row}`, "", styleData());
        }
      });

      // Set range
      const lastCol = XLSX.utils.encode_col(days + 1);
      const lastRow = employees.length + 5;
      ws["!ref"]    = `A1:${lastCol}${lastRow}`;

      // Column widths
      const colWidths: any[] = [
        { wch: 38 }, // A: employee_id
        { wch: 28 }, // B: employeename
      ];
      for (let d = 1; d <= days; d++) colWidths.push({ wch: 14 });
      ws["!cols"] = colWidths;

      // Row heights
      ws["!rows"] = [
        { hpt: 20 }, // row 1 Period
        { hpt: 20 }, // row 2 Branch
        { hpt: 8  }, // row 3 kosong
        { hpt: 8  }, // row 4 kosong
        { hpt: 26 }, // row 5 header
        ...Array(employees.length).fill({ hpt: 20 }),
      ];

      return ws;
    };

    // ── Sheet 2: Employee ─────────────────────────────────────────────
    const buildEmployeeSheet = (employees: any[]) => {
      const ws: any = {};

      const headers = ["employee_id", "nama", "nickname", "companybranch"];
      const widths  = [38, 30, 20, 35];
      headers.forEach((h, i) => {
        const col = XLSX.utils.encode_col(i);
        setCell(ws, `${col}1`, h, styleHeader(true, "2F4F4F"));
        ws["!rows"] = [{ hpt: 26 }];
      });

      employees.forEach((emp, idx) => {
        const row = idx + 2;
        setCell(ws, `A${row}`, emp.id,              styleData());
        setCell(ws, `B${row}`, emp.fullName,        { ...styleData(), alignment: { vertical: "center", horizontal: "left" } });
        setCell(ws, `C${row}`, emp.nickname ?? "",  styleData());
        setCell(ws, `D${row}`, selectedBranchName.value, styleData());
      });

      const lastRow = employees.length + 1;
      ws["!ref"]  = `A1:D${lastRow}`;
      ws["!cols"] = widths.map((w) => ({ wch: w }));
      return ws;
    };

    // ── Sheet 3: Shift ────────────────────────────────────────────────
    const buildShiftSheet = (shifts: any[]) => {
      const ws: any = {};

      const headers = [
        "shift_name",
        "check_in_time", "check_out_time",
      ];

      headers.forEach((h, i) => {
        const col = XLSX.utils.encode_col(i);
        setCell(ws, `${col}1`, h, styleHeader(true, "5C3317"));
        ws["!rows"] = [{ hpt: 26 }];
      });

      shifts.forEach((s, idx) => {
        const row = idx + 2;
        // setCell(ws, `A${row}`, "",                 styleData());
        // setCell(ws, `B${row}`, s.shift?.id ?? "",  styleData());
        setCell(ws, `A${row}`, s.shiftName ?? "",  { ...styleData(), alignment: { vertical: "center", horizontal: "left" } });
        setCell(ws, `B${row}`, s.checkInTime ?? "", styleData());
        setCell(ws, `C${row}`, s.checkOutTime ?? "", styleData());
        // kolom F-N kosong
        // ["F","G","H","I","J","K","L","M","N"].forEach((c) =>
        //   setCell(ws, `${c}${row}`, "", styleData())
        // );
      });

      const lastRow = shifts.length + 1;
      ws["!ref"]  = `A1:N${lastRow}`;
      ws["!cols"] = headers.map((h, i) =>
        ({ wch: [6, 38, 28, 14, 14, 14, 14, 14, 14, 10, 12, 12, 14, 14][i] })
      );
      return ws;
    };

    // ── Inject dataValidation XML ke sheet Employee_Assignment ─────────
    const injectDataValidation = async (
      buf: ArrayBuffer,
      shiftCount: number,
      dayCount: number,
      dataStartRow: number,
      dataEndRow: number
    ): Promise<Blob> => {
      const JSZip = (await import("jszip")).default;
      const zip   = await JSZip.loadAsync(buf);

      // 1. Baca workbook.xml untuk cari urutan sheet
      const wbXml = await zip.file("xl/workbook.xml")!.async("string");

      // Cari sheetId dari nama "Employee_Assignment"
      // <sheet name="Employee_Assignment" sheetId="1" r:id="rId1"/>
      const sheetMatch = wbXml.match(/<sheet[^>]*name="Employee_Assignment"[^>]*r:id="([^"]+)"/);
      const rId = sheetMatch?.[1] ?? "rId1";

      // 2. Baca workbook.xml.rels untuk resolve rId → file path
      const relsXml = await zip.file("xl/_rels/workbook.xml.rels")!.async("string");
      // <Relationship Id="rId1" ... Target="worksheets/sheet1.xml"/>
      const relMatch = relsXml.match(new RegExp(`Id="${rId}"[^>]*Target="([^"]+)"`));
      const sheetTarget = relMatch?.[1] ?? "worksheets/sheet1.xml";
      const sheetPath   = sheetTarget.startsWith("worksheets/")
        ? `xl/${sheetTarget}`
        : `xl/worksheets/${sheetTarget}`;

      console.log("[Inject] Employee_Assignment path:", sheetPath);

      const sheetXml = await zip.file(sheetPath)!.async("string");

      // 3. Cari nama sheet Shift dari workbook.xml
      const shiftMatch = wbXml.match(/<sheet[^>]*name="Shift"[^>]*r:id="([^"]+)"/);
      const shiftRId   = shiftMatch?.[1] ?? "";
      let shiftSheetName = "Shift"; // nama yang dipakai di formula Excel

      // Nama di formula = atribut name di workbook.xml, bukan nama file
      // Sudah "Shift" karena kita append dengan nama itu
      console.log("[Inject] Shift sheet rId:", shiftRId, "formula name:", shiftSheetName);

      // 4. Build sqref — satu dataValidation per kolom tanggal
      const sqrefParts: string[] = [];
      for (let d = 1; d <= dayCount; d++) {
        const col = XLSX.utils.encode_col(d + 1); // C=_1, D=_2, ...
        sqrefParts.push(`${col}${dataStartRow}:${col}${dataEndRow}`);
      }

      // Formula referensi ke sheet Shift kolom C baris 2 s/d N+1
      const formula1 = `${shiftSheetName}!$A$2:$A$${shiftCount + 1}`;

      // Satu <dataValidation> per kolom agar sqref tidak terlalu panjang
      const dvXml =
        `<dataValidations count="${dayCount}">` +
        sqrefParts.map((sq) =>
          `<dataValidation type="list" allowBlank="1" showDropDown="0" sqref="${sq}">` +
          `<formula1>${formula1}</formula1>` +
          `</dataValidation>`
        ).join("") +
        `</dataValidations>`;

      // 5. Hapus dataValidations lama jika ada, lalu inject setelah </sheetData>
      //    PENTING: harus setelah </sheetData>, bukan sebelum </worksheet>
      //    karena ada tag <ignoredErrors> di antara keduanya
      let newXml = sheetXml.replace(/<dataValidations[\s\S]*?<\/dataValidations>/g, "");

      if (newXml.includes("</sheetData>")) {
        newXml = newXml.replace("</sheetData>", `</sheetData>${dvXml}`);
      } else {
        // fallback: sisipkan sebelum </worksheet>
        newXml = newXml.replace("</worksheet>", `${dvXml}</worksheet>`);
      }

      zip.file(sheetPath, newXml);

      return zip.generateAsync({
        type: "blob",
        mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
    };

    // ── Main download ─────────────────────────────────────────────────
    const downloadTemplate = async () => {
      if (!form.value.branchId) return;

      isLoading.value = true;
      errorMsg.value  = "";

      try {
        const [empRes, shiftRes] = await Promise.all([
          api.get("/api/v1/master/employee/list"),
          api.get("/api/v1/master/shift/type/list", {
            params: { companyBranchId: form.value.branchId, lang: "en" },
          }),
        ]);

        const employees: any[] =
          empRes.data?.data?.data ||
          empRes.data?.data       ||
          empRes.data             || [];

        const shifts: any[] =
          shiftRes.data?.data?.data ||
          shiftRes.data?.data       ||
          shiftRes.data             || [];

        console.log("[Template] employees:", employees.length, employees[0]);
        console.log("[Template] shifts:", shifts.length, shifts[0]);

        if (!Array.isArray(employees) || employees.length === 0) {
          errorMsg.value = "Tidak ada data karyawan untuk cabang ini.";
          return;
        }

        // Build workbook
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, buildAssignmentSheet(employees),             "Employee_Assignment");
        XLSX.utils.book_append_sheet(wb, buildEmployeeSheet(employees),            "Employee");
        XLSX.utils.book_append_sheet(wb, buildShiftSheet(shifts),                  "Shift");

        // Write ke ArrayBuffer dulu
        const buf: ArrayBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });

        const shiftNames = shifts.map((s: any) => s.shiftName ?? "").filter(Boolean);
        const dataStartRow = 6;
        const dataEndRow   = employees.length + 5;
        const days         = daysInMonth.value;

        // Inject dataValidation XML langsung ke dalam file xlsx
        const finalBlob = shiftNames.length > 0
          ? await injectDataValidation(buf, shiftNames.length, days, dataStartRow, dataEndRow)
          : new Blob([buf], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

        saveAs(
          finalBlob,
          `Template_Assignment_${periodLabel.value}_${selectedBranchName.value.replace(/[^a-zA-Z0-9]/g, "_")}.xlsx`
        );
      } catch (err: any) {
        console.error("[Template] Error:", err);
        errorMsg.value = `Gagal: ${err?.message || err?.response?.data?.message || "Cek console untuk detail."}`;
      } finally {
        isLoading.value = false;
      }
    };

    // Load branches on mount
    onMounted(async () => {
      try {
        const res = await api.get("/api/v1/master/company/branch/list");
        branchOptions.value = res.data?.data || [];
      } catch (e) {
        console.error("Error load branch:", e);
      }
    });

    return {
      form,
      branchOptions,
      isLoading,
      errorMsg,
      selectedBranchName,
      periodLabel,
      daysInMonth,
      downloadTemplate,
    };
  },
});
</script>

<style scoped>
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
  margin-bottom: 5px;
}

.sc-select {
  border-color: #dee2e6;
  border-radius: 6px !important;
  font-size: 13px;
  color: #212529;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.sc-select:focus {
  border-color: #4263eb;
  box-shadow: 0 0 0 3px rgba(66, 99, 235, 0.12);
}

/* Preview box */
.preview-box {
  background: #f0f4ff;
  border: 1px solid #bac8ff;
  border-radius: 10px;
  padding: 14px 18px;
}
.preview-title {
  font-size: 13px;
  font-weight: 600;
  color: #364fc7;
  display: flex;
  align-items: center;
  gap: 6px;
}
.info-label {
  font-size: 11px;
  font-weight: 600;
  color: #868e96;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.info-value {
  font-size: 13px;
  color: #212529;
  font-weight: 500;
}
.sheet-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  font-weight: 500;
  color: #364fc7;
  background: #e7f5ff;
  border: 1px solid #a5d8ff;
  border-radius: 20px;
  padding: 2px 10px;
}

/* Spinner */
.spin { animation: spin 0.8s linear infinite; display: inline-block; }
@keyframes spin { to { transform: rotate(360deg); } }
</style>