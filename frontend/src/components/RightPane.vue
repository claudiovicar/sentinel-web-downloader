<template lang="pug">

  div.float-box.col-sm-6.col-lg-3(v-if="inspectedTile")

    div.container

      h2.mb-4 {{inspectedTile.id}} - {{foundScenes[inspectedTile.id].length}} cenas

      ul.d-flex.justify-content-center.flex-wrap
        li(v-for="scene in foundScenes[inspectedTile.id]")
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
      'foundScenes',
    ]),
  },
};
</script>

<style lang="scss" scoped>

.float-box {
  right: 0;
  overflow-y: auto;
  background-color: #f3f3f3;
  padding: 15px;
}

li {
  margin-bottom: 5px;
}

</style>
