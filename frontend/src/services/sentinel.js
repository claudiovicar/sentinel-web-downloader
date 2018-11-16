import axios from 'axios';

const BASE_URL = `${process.env.VUE_APP_HTTP_PATH}sentinel`;

function fullURL(path) {
  return BASE_URL + path;
}

export default {

  getTileList() {
    return axios.get(fullURL('/list/tiles'));
  },

};
