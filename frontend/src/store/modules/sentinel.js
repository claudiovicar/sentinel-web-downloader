import {
  SET_TILES,
  SET_DATE_RANGE,
  SET_SCENES,
  ADD_SELECTED_TILE,
  REMOVE_SELECTED_TILE,
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
  },
  getters: {
    tiles: state => state.tiles,
    selectedTiles: state => state.selectedTiles,
    dateRange: state => state.dateRange,
    scenes: state => state.scenes,
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
        state.selectedTiles.push(tile);
      }
    },
    [REMOVE_SELECTED_TILE](state, tile) {
      // const index = state.selectedTiles.indexOf(tile);
      const index = state.selectedTiles.findIndex(t => t.id === tile.id);
      if (index >= 0) {
        state.selectedTiles.splice(index, 1);
      }
      state.selectedTiles = [...state.selectedTiles];
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
      });
    },
    [SELECT_TILE](context, tile) {
      context.commit(ADD_SELECTED_TILE, tile);
    },
    [UNSELECT_TILE](context, tile) {
      context.commit(REMOVE_SELECTED_TILE, tile);
    },
  },
};
