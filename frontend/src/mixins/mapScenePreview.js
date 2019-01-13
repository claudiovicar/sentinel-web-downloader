import L from 'leaflet';

import { SELECT_SCENE } from '@/store/actions.type';

const sceneOverlayMap = {};

function createImageOverlay(tileId, scenes, bounds, map) {
  if (sceneOverlayMap[tileId]) {
    sceneOverlayMap[tileId].forEach((overlay) => {
      map.removeLayer(overlay);
    });
  }
  sceneOverlayMap[tileId] = [];
  scenes.forEach((scene) => {
    // eslint-disable-next-line
    const sceneId = scene._id;

    const url = `/sentinel/scenes/${sceneId}/preview`;

    const overlay = L.imageOverlay(url, bounds).addTo(map);
    sceneOverlayMap[tileId].push(overlay);
  });

  map.flyToBounds(bounds);
}

export default {
  mounted() {
    this.$store.subscribe((mutation) => {
      if (mutation.type === SELECT_SCENE) {
        const { getters } = this.$store;
        const gridFeature = getters.inspectedTileFeature;
        const fixedCoords = gridFeature.geometry.coordinates[0].map(c => [c[1], c[0]]);
        const bounds = L.latLngBounds(fixedCoords);
        const selectedScenes = getters.selectedScenes[getters.inspectedTile.id];
        createImageOverlay(getters.inspectedTile.id, selectedScenes, bounds, this.map);
      }
    });
  },
};
