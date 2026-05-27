import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createBootstrap } from "bootstrap-vue-next"; 
import VueApexCharts from "vue3-apexcharts";
import { QuillEditor } from '@vueup/vue-quill';

// KITA PAIKAI PRISMJS ASLI: Langsung impor core & tema CSS-nya agar dikenali Vite
import "prismjs";
import "prismjs/themes/prism.css"; 
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue-next/dist/bootstrap-vue-next.css";
import "swiper/css";
import "swiper/css/bundle";
import 'flatpickr/dist/flatpickr.css';
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import '@vueup/vue-quill/dist/vue-quill.bubble.css';
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import "./assets/custom.scss";

const app = createApp(App)

app.use(router)
app.use(createBootstrap()) 
app.use(VueApexCharts)

app.component('QuillEditor', QuillEditor)

app.mount('#app')