<template lang="pug">

  div#map

</template>

<script>

import L from 'leaflet';

import geo from '@/services/geo';
import mapGrid from '@/mixins/mapGrid';
import mapScenePreview from '@/mixins/mapScenePreview';

import { MAP_STYLES } from '@/config';

const MAP_CONFIG = {
  center: [-16.678293098288503, -54.5361328125],
  zoom: 4,
};

export default {

  name: 'Map',

  props: {},

  data() {
    return {};
  },

  mixins: [
    mapGrid, /** Mixin que gerencia o grid no mapa */
    mapScenePreview, /** Mixin que gerencia os previews de cenas no mapa */
  ],

  methods: {

    createMap() {
      this.map = L.map('map', MAP_CONFIG);

      const baseLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Physical_Map/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 19,
        attribution: 'Tiles &copy; Esri &mdash; Source: US National Park Service',
      });

      this.map.addLayer(baseLayer);

      // this.loadUFs().then(this.loadGrid);
      this.loadUFs();
    },

    loadUFs() {
      return geo.getUFs().then((response) => {
        L.geoJSON(response.data, { style: MAP_STYLES.brasil.default }).addTo(this.map);
      });
    },

  },

  mounted() {
    this.createMap();
  },

};
</script>

<style lang="scss">

  #map {
    width: 100%;
    height: 100%;
  }

</style>
