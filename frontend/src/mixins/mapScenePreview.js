import L from 'leaflet';

import geo from '@/services/geo';

import { MAP_STYLES } from '@/config';

import { SELECT_SCENE } from '@/store/actions.type';

const sceneOverlayMap = {};

function createImageOverlay(scene, bounds, map) {
  // eslint-disable-next-line
  const url = `/sentinel/scenes/${scene._id}/preview`;

  if (sceneOverlayMap[scene.tile.id]) {
    map.removeLayer(sceneOverlayMap[scene.tile.id]);
  }

  const overlay = L.imageOverlay(url, bounds).addTo(map);
  sceneOverlayMap[scene.tile.id] = overlay;

  map.flyToBounds(bounds);
}

export default {
  mounted() {
    this.$store.subscribe((mutation) => {
      if (mutation.type === SELECT_SCENE) {
        const gridFeature = this.$store.getters.inspectedTileFeature;
        const fixedCoords = gridFeature.geometry.coordinates[0].map(c => [c[1], c[0]]);
        const bounds = L.latLngBounds(fixedCoords);
        createImageOverlay(this.$store.getters.selectedScene, bounds, this.map);
      }
    });
  },
};
