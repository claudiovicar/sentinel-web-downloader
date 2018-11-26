<template lang="pug">

  div.float-box-right.col-sm-6.col-lg-3(v-if="inspectedTile")

    div.container

      h1 Right pane

      ul
        li(v-for="scene in scenes[inspectedTile.id]") {{scene.cloud_cover}}

</template>

<script>

// import Multiselect from 'vue-multiselect';
// import DatePicker from 'vue2-datepicker';
// import Octicon from 'vue-octicon/components/Octicon.vue';

// import 'vue-octicon/icons/search';

// import sentinel from '@/services/sentinel';

import { mapGetters } from 'vuex';

// import {
//   FETCH_SENTINEL_TILES, FETCH_SENTINEL_DATE_RANGE, SELECT_TILE, UNSELECT_TILE,
// } from '@/store/actions.type';

export default {
  name: 'RightPane',
  components: {
  },
  data() {
    return {
      showPane: true,
    };
  },
  methods: {
  },
  computed: {
    ...mapGetters([
      'inspectedTile',
      'scenes',
    ]),
  },
  mounted() {
  },
};
</script>

<style lang="scss" scoped>

.float-box-right {
  z-index: 10000;
  position: absolute;
  top: 60px;
  bottom: 0;
  right: 0;

  width: 600px;
  background-color: white;
  box-shadow: 2px 4px 8px #9c9c9c;

  transform: translateX(0);
  -webkit-transform: translateX(0);
  animation-fill-mode: forwards;
  transition-property: -webkit-transform,transform,opacity;
  transition-duration: 0.3s;
  transition-timing-function: cubic-bezier(0.0,0.0,0.2,1);

  .float-box-view {
    background-color: #FFF;
    width: 100%;
    height: 100%;
    background-color: #FFF;
    display: block;
    position: relative;
    overflow-x: hidden;
  }
}

</style>
