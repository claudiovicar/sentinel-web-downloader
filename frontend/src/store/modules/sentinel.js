import { SET_TILES, SET_DATE_RANGE, SET_SCENES } from '../mutations.type';
import {
  FETCH_SENTINEL_TILES,
  FETCH_SENTINEL_DATE_RANGE,
  FILTER_SENTINEL_SCENES,
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
  },
};
