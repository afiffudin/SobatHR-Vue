<template>
  <div id="app-layout" class="app-layout">
    <MainSidebar />
    <div class="main-content d-flex flex-column">
      <MainHeader />
      <div class="main-content-inner">
        <BreadCrumb PageTitle="Working Schedule" />
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
import BranchList from "@/components/WorkingSchedule/WorkingSchedule.vue";

export default defineComponent({
  name: "WorkingSchedulePage",
  components: {
    MainSidebar,
    MainHeader,
    BreadCrumb,
    BranchList,
  },
});
</script>