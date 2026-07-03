<!-- <template>
  <div id="map" style="height: 500px; width: 100%"></div>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";
// import L, { Map as LeafletMap, TileLayer } from "leaflet";

// const map = ref<LeafletMap | null>(null);
export default defineComponent({
  name: "MapView",
  props: [
    "centerLatitude",
    "centerLongitude",
    "zoomLevel",
    "officeLocationLatitude",
    "officeLocationLongitude",
    "userLocationLatitude",
    "userLocationLongitude",
    "officePopUpText",
    "userPopUpText",
  ],
  mounted() {
    map.value = L.map("map").setView(
      [this.centerLatitude, this.centerLongitude],
      this.zoomLevel
    );

    if (map.value) {
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map.value as any);

      L.marker([this.officeLocationLatitude, this.officeLocationLongitude])
        .addTo(map.value as L.Map)
        .bindPopup("Lokasi Kantor");

      L.marker([this.userLocationLatitude, this.userLocationLongitude])
        .addTo(map.value as L.Map)
        .bindPopup(this.userPopUpText);
    }
  },
});
</script> -->
