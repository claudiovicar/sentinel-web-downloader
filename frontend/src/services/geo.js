import http from './http';

const BASE_URL = `${process.env.VUE_APP_HTTP_PATH}geo`;

export default {

  updateSceneList() {
    return http.post(`${BASE_URL}/update`);
  },

  getLastUpdateDate() {
    return http.get(`${BASE_URL}/lastUpdate`);
  },

  getGridSentinel() {
    return http.get(`${BASE_URL}/sentinel-grid`);
  },

  getUFs() {
    return http.get(`${BASE_URL}/brasil`);
  },

};
