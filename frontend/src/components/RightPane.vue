<template lang="pug">

  div.float-box-right.col-sm-6.col-lg-3(v-if="inspectedTile")

    div.container

      h2 {{inspectedTile.id}} - {{scenes[inspectedTile.id].length}} cenas

      ul.d-flex.justify-content-center.flex-wrap
        li(v-for="scene in scenes[inspectedTile.id]")
          tile-preview(:scene="scene")

</template>

<script>

import { mapGetters } from 'vuex';

import TilePreview from './TilePreview.vue';

export default {
  name: 'RightPane',
  components: {
    TilePreview,
  },
  data() {
    return {
      showPane: true,
    };
  },
  computed: {
    ...mapGetters([
      'inspectedTile',
      'scenes',
    ]),
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

  overflow-y: auto;

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

li {
  margin-bottom: 5px;
}

</style>
