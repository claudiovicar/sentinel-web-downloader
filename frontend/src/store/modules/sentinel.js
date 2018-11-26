import {
  SET_TILES,
  SET_DATE_RANGE,
  SET_SCENES,
  ADD_SELECTED_TILE,
  REMOVE_SELECTED_TILE,
  SET_INSPECTED_TILE,
} from '../mutations.type';

import {
  FETCH_SENTINEL_TILES,
  FETCH_SENTINEL_DATE_RANGE,
  FILTER_SENTINEL_SCENES,
  SELECT_TILE,
  UNSELECT_TILE,
} from '../actions.type';

import sentinel from '@/services/sentinel';

export default {

  state: {
    tiles: [],
    selectedTiles: [],
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
    selectedTiles: state => state.selectedTiles,
    dateRange: state => state.dateRange,
    scenes: state => state.scenes,
    inspectedTile: state => state.inspectedTile,
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
  },
};
