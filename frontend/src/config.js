export default {};

export const MAP_STYLES = {
  grid: {
    default: {
      fill: '#6c757d',
      fillOpacity: 0.1,
      color: '#6c757d',
      weight: 1,
    },
    selected: {
      // color: '#ffc107',
      // color: 'orange',
      color: '#007bff',
      weight: 2,
      fill: 'white',
      // fillOpacity: 0.01,
      fillOpacity: 0.2,
    },
  },
  brasil: {
    default: {
      fill: false,
      color: 'black',
      weight: 1,
    },
  },
};

export const VIEW_STATES = {
  SEARCH: 'SEARCH',
  SCENE_SELECTION: 'SCENE_SELECTION',
};
