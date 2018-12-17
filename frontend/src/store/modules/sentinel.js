import {
  SET_TILES,
  SET_DATE_RANGE,
  SET_SCENES,
  ADD_SELECTED_TILE,
  REMOVE_SELECTED_TILE,
  SET_INSPECTED_TILE,
  SET_SENTINEL_GRID,
} from '../mutations.type';

import {
  FETCH_SENTINEL_GRID,
  FETCH_SENTINEL_TILES,
  FETCH_SENTINEL_DATE_RANGE,
  FILTER_SENTINEL_SCENES,
  SELECT_TILE,
  UNSELECT_TILE,
  SELECT_SCENE,
} from '../actions.type';

import geo from '@/services/geo';
import sentinel from '@/services/sentinel';

export default {

  state: {
    tiles: [],
    sentinelGrid: {},
    selectedTiles: [],
    selectedScenes: {},
    dateRange: {
      min: new Date(),
      max: new Date(),
    },
    scenes: null,
    isFiltering: true,
    inspectedTile: null,
  },

  getters: {
    tiles: state => state.tiles,
    sentinelGrid: state => state.sentinelGrid,
    selectedTiles: state => state.selectedTiles,
    selectedScenes: state => state.selectedScenes,
    selectedScene: state => state.selectedScenes[state.inspectedTile.id],
    dateRange: state => state.dateRange,
    scenes: state => state.scenes,
    inspectedTile: state => state.inspectedTile,
    inspectedTileFeature: (state) => {
      const gridFeature = state.sentinelGrid.features.filter(feature => feature.properties.TileID
        === state.inspectedTile.id);
      return gridFeature[0];
    },
    isFiltering: state => state.isFiltering,
  },

  mutations: {
    [SET_TILES](state, tiles) {
      state.tiles = tiles;
    },
    [SET_DATE_RANGE](state, dateRange) {
      state.dateRange = dateRange;
    },
    [ADD_SELECTED_TILE](state, tile) {
      if (state.selectedTiles.indexOf(tile) < 0) {
        const fullTile = state.tiles.find(el => el.id === tile.id);
        state.selectedTiles.push(fullTile);
      }
    },
    [REMOVE_SELECTED_TILE](state, tile) {
      const index = state.selectedTiles.findIndex(t => t.id === tile.id);
      if (index >= 0) {
        state.selectedTiles.splice(index, 1);
      }
      state.selectedTiles = [...state.selectedTiles];
    },
    [SET_SCENES](state, scenes) {
      const groupedScenes = {};
      scenes.forEach((scene) => {
        if (!groupedScenes[scene.tile.id]) groupedScenes[scene.tile.id] = [];
        groupedScenes[scene.tile.id].push(scene);
      });
      state.scenes = groupedScenes;
      state.isFiltering = false;
    },
    [SET_INSPECTED_TILE](state, tile) {
      state.inspectedTile = tile;
    },
    [SELECT_SCENE](state, scene) {
      state.selectedScenes[state.inspectedTile.id] = scene;
    },
    [SET_SENTINEL_GRID](state, grid) {
      state.sentinelGrid = grid;
    },
  },

  actions: {
    [FETCH_SENTINEL_TILES](context) {
      sentinel.tileList().then(({ data }) => {
        context.commit(SET_TILES, data);
      });
    },
    [FETCH_SENTINEL_DATE_RANGE](context) {
      sentinel.dateRange().then(({ data }) => {
        const dates = {
          min: new Date(data.min),
          max: new Date(data.max),
        };
        context.commit(SET_DATE_RANGE, dates);
      });
    },
    [FILTER_SENTINEL_SCENES](context, { selectedTiles, dateRange, cloudCover }) {
      sentinel.filterScenes(selectedTiles, dateRange, cloudCover).then(({ data }) => {
        context.commit(SET_SCENES, data);

        context.state.selectedTiles.forEach((tile) => {
          context.commit(UNSELECT_TILE, tile);
        });
      });
    },
    [SELECT_TILE](context, tile) {
      if (context.state.isFiltering) {
        context.commit(ADD_SELECTED_TILE, tile);
      } else {
        context.commit(SET_INSPECTED_TILE, tile);
      }
    },
    [UNSELECT_TILE](context, tile) {
      if (context.state.isFiltering) {
        context.commit(REMOVE_SELECTED_TILE, tile);
      } else {
        context.commit(SET_INSPECTED_TILE, null);
      }
    },
    [SELECT_SCENE](context, scene) {
      context.commit(SELECT_SCENE, scene);
    },
    [FETCH_SENTINEL_GRID](context) {
      geo.getGridSentinel().then((response) => {
        context.commit(SET_SENTINEL_GRID, response.data);
      });
    },
  },
};
