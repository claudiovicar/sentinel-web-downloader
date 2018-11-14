<template lang="pug">

  div#map

</template>

<script>

import L from 'leaflet';

import geo from '@/services/geo';

const MAP_CONFIG = {
  center: [-16.678293098288503, -54.5361328125],
  zoom: 4,
  // minZoom: 1,
  // maxZoom: 17,
};

const STYLES = {
  grid: {
    default: {
      fill: 'grey',
      fillOpacity: 0.1,
      color: 'grey',
      weight: 1,
    },
    selected: {
      color: 'orange',
      fill: 'orange',
      fillOpacity: 0.6,
    },
  },
  brasil: {
    default: {
      fill: false,
      color: 'steelblue',
    },
  },
};

export default {

  name: 'Map',

  props: {},

  data() {
    return {};
  },

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
        L.geoJSON(response.data, { style: STYLES.brasil.default }).addTo(this.map);
      });
    },

    loadGrid() {
      geo.getGridSentinel().then((response) => {
        this.grid = L.geoJSON(response.data, {
          style: STYLES.grid.default,
          onEachFeature: (feature, layer) => {
            // eslint-disable-next-line
            layer.selected = false;
            layer.on({
              click: this.gridClicked,
            });
            layer.bindTooltip(feature.properties.TileID);
          },
        });
        this.grid.addTo(this.map);
        this.map.fitBounds(this.grid.getBounds());
      });
    },

    gridClicked(event) {
      const layer = event.sourceTarget;
      layer.selected = !layer.selected;
      if (layer.selected) {
        layer.setStyle(STYLES.grid.selected);
      } else {
        layer.setStyle(STYLES.grid.default);
      }
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
