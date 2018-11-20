import L from 'leaflet';

import geo from '@/services/geo';

import { MAP_STYLES } from '@/config';

import { SELECT_TILE, UNSELECT_TILE } from '@/store/actions.type';

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
    loadGrid() {
      geo.getGridSentinel().then((response) => {
        this.grid = L.geoJSON(response.data, {
          style: MAP_STYLES.grid.default,
          onEachFeature: onFeature.bind(this),
        });
        this.grid.addTo(this.map);
        this.map.fitBounds(this.grid.getBounds());
      });
    },
  },
  // computed: {
  //   ...mapGetters([
  //     'selectedTiles',
  //   ]),
  // },
  // watch: {
  //   selectedTiles: (oldValue, newValue) => {
  //     // eslint-disable-next-line
  //     console.log(oldValue, newValue);
  //   },
  // },
  mounted() {
    this.$store.subscribe((mutation) => {
      // TODO: Usar constantes
      if (mutation.type === 'selectTile') {
        tileMap[mutation.payload.id].setStyle(MAP_STYLES.grid.selected);
      } else if (mutation.type === 'unselectTile') {
        tileMap[mutation.payload.id].setStyle(MAP_STYLES.grid.default);
      }
    });
  },
};
