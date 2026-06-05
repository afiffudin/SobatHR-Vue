<template>
    <BreadCrumb PageTitle="Dashboard" />
    <FormList />
</template>

<script lang="ts">
import { defineComponent } from "vue";

import BreadCrumb from "../../components/Common/BreadCrumb.vue";
import FormList from "../../components/Dashboard/DashboardUtama/DashboardUtama.vue";

export default defineComponent({
  name: "DashboardPage",
  components: {
    BreadCrumb,
    FormList,
  },
});
</script>