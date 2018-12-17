import L from 'leaflet';

import { MAP_STYLES } from '@/config';

import { SELECT_TILE, UNSELECT_TILE, FETCH_SENTINEL_GRID } from '@/store/actions.type';
import { ADD_SELECTED_TILE, REMOVE_SELECTED_TILE, SET_SENTINEL_GRID } from '@/store/mutations.type';

const tileMap = {};

function gridClicked(event) {
  const layer = event.sourceTarget;
  layer.selected = !layer.selected;
  let action = null;
  if (layer.selected) {
    layer.setStyle(MAP_STYLES.grid.selected);
    action = SELECT_TILE;
  } else {
    layer.setStyle(MAP_STYLES.grid.default);
    action = UNSELECT_TILE;
  }
  this.$store.dispatch(action, { id: layer.feature.properties.TileID });
}

function onFeature(feature, layer) {
  layer.selected = false;
  layer.on({
    click: gridClicked.bind(this),
  });
  layer.bindTooltip(feature.properties.TileID);
  tileMap[feature.properties.TileID] = layer;
}

export default {
  methods: {
    addGridToMap() {
      this.grid = L.geoJSON(this.$store.getters.sentinelGrid, {
        style: MAP_STYLES.grid.default,
        onEachFeature: onFeature.bind(this),
      });
      this.grid.addTo(this.map);
      this.map.fitBounds(this.grid.getBounds());
    },
  },
  mounted() {
    this.$store.dispatch(FETCH_SENTINEL_GRID);
    this.$store.subscribe((mutation) => {
      if (mutation.type === ADD_SELECTED_TILE) {
        tileMap[mutation.payload.id].setStyle(MAP_STYLES.grid.selected);
      } else if (mutation.type === REMOVE_SELECTED_TILE) {
        tileMap[mutation.payload.id].setStyle(MAP_STYLES.grid.default);
      } else if (mutation.type === SET_SENTINEL_GRID) {
        this.addGridToMap();
      }
    });
  },
};
