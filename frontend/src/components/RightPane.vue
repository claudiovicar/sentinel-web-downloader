<template lang="pug">

  div.float-box.col-sm-6.col-lg-3(v-if="inspectedTile")

    div.container

      div.row
        div.col-sm-10
          h2.mb-4 {{inspectedTile.id}} - {{foundScenes[inspectedTile.id].length}} cenas

        div.icon-close.col-sm-2(@click="close")
            icon(name="times", scale="2")

      ul.d-flex.justify-content-center.flex-wrap(ref="sceneList")
        li(v-for="scene in foundScenes[inspectedTile.id]")
          tile-preview(:scene="scene")

</template>

<script>

import Icon from 'vue-awesome';

import { mapGetters } from 'vuex';
import { SET_INSPECTED_TILE } from '@/store/mutations.type';

import TilePreview from './TilePreview.vue';

export default {
  name: 'RightPane',
  components: {
    TilePreview,
    Icon,
  },
  data() {
    return {
      showPane: true,
    };
  },
  methods: {
    close() {
      this.$store.dispatch(SET_INSPECTED_TILE, null);
    },
  },
  computed: {
    ...mapGetters([
      'inspectedTile',
      'foundScenes',
    ]),
  },
  watch: {
    inspectedTile() {
      if (this.$refs.sceneList) {
        this.$refs.sceneList.scrollTop = 0;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.float-box {
  right: 0;
  background-color: #f3f3f3;
  padding: 15px;
  height: 100%;
}

.container {
  height: 100%;
}

ul {
  height: 100%;
  overflow-y: auto;
  li {
    margin-bottom: 5px;
    position: relative;
  }
}

.icon-close {
  cursor: pointer;
  &:hover {
    color: grey;
  }
  .fa-icon {
    color: $icon-color;
  }
}

</style>
