import axios from 'axios';

const BASE_URL = `${process.env.VUE_APP_HTTP_PATH}geo`;

function fullURL(path) {
  return BASE_URL + path;
}

export default {

  getGridSentinel() {
    return axios.get(fullURL('/sentinel-grid'));
  },

  getUFs() {
    return axios.get(fullURL('/brasil'));
  },

};
