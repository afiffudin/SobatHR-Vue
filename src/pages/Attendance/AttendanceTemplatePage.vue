<template>
  <div id="app-layout" class="app-layout">
    <MainSidebar />
    <div class="main-content d-flex flex-column">
      <MainHeader />
      <div class="main-content-inner">
        <BreadCrumb PageTitle="Attendance Template Download" />
        <BranchList />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import MainSidebar from "@/components/Layouts/MainSidebar.vue";
import MainHeader from "@/components/Layouts/MainHeader.vue";
import BreadCrumb from "@/components/Common/BreadCrumb.vue";
import BranchList from "@/components/Attendance/DownloadTemplateView.vue";

export default defineComponent({
  name: "AttendanceTemplate",
  components: {
    MainSidebar,
    MainHeader,
    BreadCrumb,
    BranchList,
  },
});
</script>