import http from './http';

const BASE_URL = `${process.env.VUE_APP_HTTP_PATH}sentinel`;

export default {

  tileList() {
    return http.get(`${BASE_URL}/tiles/list`);
  },

  dateRange() {
    return http.get(`${BASE_URL}/scenes/dateRange`);
  },

  filterScenes(tiles, dateRange, cloudCover) {
    const params = {
      tiles,
      dateRange,
      cloudCover,
    };
    return http.post(`${BASE_URL}/scenes/filter`, params);
  },

  getPreview(sceneId) {
    return http.get(`${BASE_URL}/scenes/${sceneId}/preview`);
  },

  generateComposition(scenes, bandComposition, outputFormat) {
    return http.post(`${BASE_URL}/scenes/generateComposition`, { scenes, outputFormat, bandComposition });
  },

  getDownloadStatus() {
    return http.get(`${BASE_URL}/scenes/downloadStatus`);
  },

  downloadScene(request) {
    // eslint-disable-next-line
    window.location.href = `${BASE_URL}/scenes/download/${request._id}`;
  },

};
