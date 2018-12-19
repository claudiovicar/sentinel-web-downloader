import axios from 'axios';

const BASE_URL = `${process.env.VUE_APP_HTTP_PATH}sentinel`;

function fullURL(path) {
  return BASE_URL + path;
}

export default {

  tileList() {
    return axios.get(fullURL('/tiles/list'));
  },

  dateRange() {
    return axios.get(fullURL('/scenes/dateRange'));
  },

  filterScenes(tiles, dateRange, cloudCover) {
    const params = {
      tiles,
      dateRange,
      cloudCover,
    };
    return axios.post(fullURL('/scenes/filter'), params);
  },

  getPreview(sceneId) {
    return axios.get(`/sentinel/scenes/${sceneId}/preview`);
  },

  generateComposition(scenes) {
    return axios.post(fullURL('/scenes/generateComposition'), { scenes });
  },

};
