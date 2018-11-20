<template lang="pug">

  div#map

</template>

<script>

import L from 'leaflet';

import geo from '@/services/geo';

import mapGrid from '@/mixins/mapGrid';

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
    mapGrid,
  ],

  methods: {

    createMap() {
      this.map = L.map('map', MAP_CONFIG);

      const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      });

      this.map.addLayer(osm);

      this.loadUFs().then(this.loadGrid);
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
