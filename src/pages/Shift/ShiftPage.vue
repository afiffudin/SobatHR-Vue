<template>
  <div id="app-layout" class="app-layout">
    <MainSidebar />
    <div class="main-content d-flex flex-column">
      <MainHeader />
      <div class="main-content-inner">
        <BreadCrumb PageTitle="Shift Page" />
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
import BranchList from "@/components/Shift/ShiftList.vue";

export default defineComponent({
  name: "ShiftPage",
  components: {
    MainSidebar,
    MainHeader,
    BreadCrumb,
    BranchList,
  },
});
</script>