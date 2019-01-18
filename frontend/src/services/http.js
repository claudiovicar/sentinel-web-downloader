import axios from 'axios';
import store from '@/store/store';
import { NOTIFY } from '@/store/actions.type';

export default class Http {
  static handleResponsePromise(promise) {
    promise.catch((error) => {
      store.dispatch(NOTIFY, {
        content: error.response.data,
        title: 'Erro na requisição',
        timeout: 10000,
        type: 'warning',
      });
    });
  }

  static get(url, data) {
    const promisse = data
      ? axios.get(url, { params: data })
      : axios.get(url);

    Http.handleResponsePromise(promisse);

    return promisse;
  }

  static post(url, data) {
    const promisse = axios.post(url, data);

    Http.handleResponsePromise(promisse);

    return promisse;
  }
}
