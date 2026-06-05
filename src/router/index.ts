import { createWebHistory, createRouter } from "vue-router";

// Impor komponen utama yang dibutuhkan
import EcommercePage from "../pages/Dashboard/EcommercePage.vue";
import FormHrdPage from "../pages/Hrd/FormHrdPage.vue";
import BranchPage from "@/pages/CompanyBranch/BranchPage.vue";
import EmployeePage from "@/pages/Employee/EmployeePage.vue";
import EmployeeDetailPage from "@/pages/Employee/EmployeeDetailPage.vue";
import ShiftPage from "@/pages/Shift/ShiftPage.vue";
import PositionPage from "@/pages/Position/PositionPage.vue";
import LevelPositionPage from "@/pages/LevelPosition/LevelPositionPage.vue";
import WorkingCalendar from "@/pages/WorkingCalendar/WorkingCalendar.vue";
import WorkingSchedule from "@/pages/WorkingSchedule/WorkingSchedule.vue";
import DailyAttendancePage from "@/pages/DailyAttendance/DailyAttendancePage.vue";
import AttendanceSummaryPage from "@/pages/AttendanceSummary/AttendanceSummaryPage.vue";
import ShiftTypePage from "@/pages/ShiftType/ShiftTypePage.vue";
import DashboardPage from "@/pages/Dashboard/DashboardUtamaPage.vue";
import ProfilePage from "@/pages/ProfilPage/ProfilePage.vue";
import LoginView from "../components/Login/Login.vue";

const routes = [
  {
    path: "/login",
    name: "Login",
    component: LoginView,
    meta: { guestOnly: true } // Hanya untuk user yang belum login
  },
  {
    path: "/",
    name: "DashboardPage",
    component: DashboardPage,
    meta: { requiresAuth: true } // Wajib login
  },
  {
    path: "/profile",
    name: "ProfilPage",
    component: ProfilePage,
    meta: { requiresAuth: true } // Wajib login
  },
  {
    path: "/hrd-list",
    name: "FormHrdPage",
    component: FormHrdPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/master-company-branch',
    name: "BranchPage",
    component: BranchPage,
    meta: { requiresAuth: true }
  },
  {
    path: "/master-employee-list",
    name: "EmployeePage",
    component: EmployeePage,
    meta: { requiresAuth: true }
  },
  {
    path: "/employee/edit/:id",
    name: "EmployeeDetailPage",
    component: EmployeeDetailPage,
    meta: { requiresAuth: true }
  },
  {
    path: "/master-shift-list",
    name: "ShiftPage",
    component: ShiftPage,
    meta: { requiresAuth: true }
  },
  {
    path: "/master-shift-type-list",
    name: "ShiftTypePage",
    component: ShiftTypePage,
    meta: { requiresAuth: true }
  },
  {
    path: "/master-position-page",
    name: "PositionPage",
    component: PositionPage,
    meta: { requiresAuth: true }
  },
  {
    path: "/master-levelposition-page",
    name: "LevelPositionPage",
    component: LevelPositionPage,
    meta: { requiresAuth: true }
  },
  {
    path: "/master-working-calendar",
    name: "WorkingCalendarPage",
    component: WorkingCalendar,
    meta: { requiresAuth: true }
  },
  {
    path: "/master-working-schedule",
    name: "WorkingSchedulePage",
    component: WorkingSchedule,
    meta: { requiresAuth: true }
  },
  {
    path: "/daily-attendance",
    name: "DailyAttendancePage",
    component: DailyAttendancePage,
    meta: { requiresAuth: true }
  },
  {
    path: "/attendance-summary",
    name: "AttendanceSummaryPage",
    component: AttendanceSummaryPage,
    meta: { requiresAuth: true }
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/login"
  }
];

const router = createRouter({
  history: createWebHistory(),
  linkExactActiveClass: "active",
  routes: routes,
  scrollBehavior() {
    return { top: 0, behavior: "smooth" };
  },
});

// AKTIFKAN: Satpam Pengaman Route (Navigation Guard)
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");

  // Kasus 1: Halaman butuh login, tapi token tidak ada -> Tendang ke /login
  if (to.matched.some(record => record.meta.requiresAuth) && !token) {
    next("/login");
  } 
  // Kasus 2: User sudah login (punya token) tapi coba buka halaman /login -> Balikin ke dashboard (/)
  else if (to.matched.some(record => record.meta.guestOnly) && token) {
    next("/");
  } 
  // Kasus 3: Kondisi aman -> Lanjutkan perjalanan
  else {
    next();
  }
});

export default router;