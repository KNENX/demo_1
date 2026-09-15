<script setup>
import { onMounted, watch } from "vue";

const props = defineProps({
  geojson: {
    type: Object,
    default: () => null,
  },
});

let map = null;

const renderGeoJson = (geojson) => {
  if (!map || !window.T) return;

  map.clearOverLays();

  if (!geojson || !geojson.features || geojson.features.length === 0) {
    map.centerAndZoom(new window.T.LngLat(104.28, 35.86), 4);
    return;
  }

  const allPoints = [];

  geojson.features.forEach((feat) => {
    if (feat.geometry?.type === "Polygon") {
      feat.geometry.coordinates.forEach((ring) => {
        const ringPoints = ring.map((c) => {
          const pt = new window.T.LngLat(c[0], c[1]);
          allPoints.push(pt);
          return pt;
        });

        const polygon = new window.T.Polygon(ringPoints, {
          color: "#409EFF",
          weight: 2,
          opacity: 0.8,
          fillColor: "#409EFF",
          fillOpacity: 0.35,
        });

        map.addOverLay(polygon);
      });
    }
  });

  if (allPoints.length > 0) {
    setTimeout(() => {
      map.setViewport(allPoints);
    }, 100);
  }
};

onMounted(() => {
  if (window.T) {
    map = new window.T.Map("mapDiv");
    map.centerAndZoom(new window.T.LngLat(104.28, 35.86), 4);

    const zoomControl = new window.T.Control.Zoom();
    map.addControl(zoomControl);

    const scale = new window.T.Control.Scale();
    map.addControl(scale);

    const ctrl = new window.T.Control.MapType();
    map.addControl(ctrl);

    if (props.geojson) {
      renderGeoJson(props.geojson);
    }
  } else {
    console.error("天地图 API 尚未成功加载，请检查网络或 index.html 引入");
  }
});

watch(
  () => props.geojson,
  (newVal) => {
    renderGeoJson(newVal);
  },
);
</script>

<template>
  <div id="mapDiv" class="map-container"></div>
</template>

<style scoped>
.map-container {
  width: 100%;
  height: 100%;
}
</style>
