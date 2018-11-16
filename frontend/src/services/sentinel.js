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
    return axios.get(fullURL('/dateRange'));
  },

};
