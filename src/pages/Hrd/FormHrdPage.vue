<template>
    <BreadCrumb PageTitle="HRD List" />
    <FormList />
</template>

<script lang="ts">
import { defineComponent } from "vue";

import BreadCrumb from "../../components/Common/BreadCrumb.vue";
import FormList from "../../components/Hrd/HrdList/FormList.vue";

export default defineComponent({
  name: "UsersListPage",
  components: {
    BreadCrumb,
    FormList,
  },
});
</script>