import axios from 'axios';

const BASE_URL = `${process.env.VUE_APP_HTTP_PATH}geo`;

function fullURL(path) {
  return BASE_URL + path;
}

export default {

  updateSceneList() {
    return axios.post(fullURL('/update'));
  },

  getLastUpdateDate() {
    return axios.get(fullURL('/lastUpdate'));
  },

  getGridSentinel() {
    return axios.get(fullURL('/sentinel-grid'));
  },

  getUFs() {
    return axios.get(fullURL('/brasil'));
  },

};
