import L from 'leaflet';

import { MAP_STYLES, VIEW_STATES } from '@/config';

import {
  SELECT_TILE, UNSELECT_TILE, FETCH_SENTINEL_GRID, SET_CURRENT_VIEW,
} from '@/store/actions.type';
import {
  ADD_SELECTED_TILE, REMOVE_SELECTED_TILE, SET_SENTINEL_GRID, SET_INSPECTED_TILE,
} from '@/store/mutations.type';

const tileMap = {};

function setLayerSelection(layer, selected) {
  if (selected === true) {
    layer.setStyle(MAP_STYLES.grid.selected);
  } else {
    layer.setStyle(MAP_STYLES.grid.default);
  }

  layer.selected = selected;
}

function gridClicked(event) {
  const layer = event.sourceTarget;

  setLayerSelection(layer, !layer.selected);

  const action = layer.selected ? SELECT_TILE : UNSELECT_TILE;

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

function onFilteredFeature(feature, layer) {
  layer.on({
    click: gridClicked.bind(this),
  });
  layer.bindTooltip(feature.properties.TileID);
}

export default {
  methods: {
    createGrid() {
      this.grid = L.geoJSON(this.$store.getters.sentinelGrid, {
        style: MAP_STYLES.grid.default,
        onEachFeature: onFeature.bind(this),
      });
      this.currentGrid = this.grid;
      this.addGridToMap();
    },
    addGridToMap() {
      this.currentGrid.addTo(this.map);
      this.map.fitBounds(this.currentGrid.getBounds());
    },
    removeGridFromMap() {
      this.currentGrid.removeFrom(this.map);
    },
    filterGrid() {
      const filteredFeatures = this.$store.getters.sentinelGrid.features
        .filter(feature => feature.properties.TileID in this.$store.getters.foundScenes);
      const geoJSON = {
        features: filteredFeatures,
        type: 'FeatureCollection',
      };
      this.filteredGrid = L.geoJSON(geoJSON, {
        style: MAP_STYLES.grid.default,
        onEachFeature: onFilteredFeature.bind(this),
      });
      this.currentGrid = this.filteredGrid;
      this.addGridToMap();
    },
    zoomToTile() {
      const fixedCoords = this.$store.getters.inspectedTileFeature.geometry
        .coordinates[0].map(c => [c[1], c[0]]);
      const bounds = L.latLngBounds(fixedCoords);
      this.map.flyToBounds(bounds);
      // setLayerSelection(tileMap[tile], true);
    },
  },
  mounted() {
    this.$store.dispatch(FETCH_SENTINEL_GRID);
    this.$store.subscribe((mutation) => {
      if (mutation.type === ADD_SELECTED_TILE) {
        setLayerSelection(tileMap[mutation.payload.id], true);
        // tileMap[mutation.payload.id].setStyle(MAP_STYLES.grid.selected);
      } else if (mutation.type === REMOVE_SELECTED_TILE) {
        setLayerSelection(tileMap[mutation.payload.id], false);
        // tileMap[mutation.payload.id].setStyle(MAP_STYLES.grid.default);
      } else if (mutation.type === SET_SENTINEL_GRID) {
        this.createGrid();
      } else if (mutation.type === SET_INSPECTED_TILE) {
        if (mutation.payload) {
          this.zoomToTile();
        }
      } else if (mutation.type === SET_CURRENT_VIEW) {
        this.removeGridFromMap();
        if (mutation.payload === VIEW_STATES.SCENE_SELECTION) {
          this.filterGrid();
        } else {
          this.currentGrid = this.grid;
          this.addGridToMap();
        }
      }
    });
  },
};
