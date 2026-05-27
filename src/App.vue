<template>
  <div v-if="$route.name === 'Login'" class="auth-layout-page">
    <router-view />
  </div>

  <div v-else :class="['main-wrapper-content', { 'active': isSidebarActive }]">
    <MainSidebar /> 

    <div class="main-content-body d-flex flex-column">
      <MainHeader />

      <div class="main-content-container p-15 p-sm-20 p-md-25 p-lg-30">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import MainHeader from './components/Layouts/MainHeader.vue'
import MainSidebar from './components/Layouts/MainSidebar.vue'

export default defineComponent({
  name: 'App',
  components: {
    MainHeader,
    MainSidebar
  },
  data() {
    return {
      isSidebarActive: false // Digunakan jika template memiliki fitur toggle minimize sidebar
    }
  }
})
</script>

<style scoped>
/* Menjamin layout terbagi menjadi Kolom Kiri (Sidebar) dan Kolom Kanan (Konten) */
.main-wrapper-content {
  display: flex;
  min-height: 100vh;
  width: 100%;
  overflow-x: hidden;
}

.main-content-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0; /* Mencegah konten tabel meluber merusak layout flexbox */
  background-color: #f5f7fa; /* Warna latar belakang dashboard default */
}

.main-content-container {
  flex: 1;
  width: 100%;
}
</style>