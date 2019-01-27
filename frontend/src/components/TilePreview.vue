<template lang="pug">

div.tile-preview(@click="selectScene(scene)", :class="{'selected': isSelected()}")

  div.info
    span Sentinel2
    div
      icon.mr-2(name="cloud")
      span {{formattedCloudCover}} %
    div
      icon.mr-2(name="calendar")
      span {{formattedDate}}

  img(:src='sceneURL', @load="onImageLoad()")
  div.icon-loading(v-if="isLoading")
    icon.fa-pulse(name="spinner", scale="3")

</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import { SELECT_SCENE } from '@/store/actions.type';

import Icon from 'vue-awesome';

export default {
  props: {
    scene: {
      type: Object,
      required: true,
    },
  },
  components: {
    Icon,
  },
  data() {
    return {
      isLoading: true,
    };
  },
  computed: {
    formattedDate() {
      return new Date(this.scene.sensing_time).toLocaleString('pt-br');
    },
    formattedCloudCover() {
      return Number(this.scene.cloud_cover).toFixed(2);
    },
    sceneURL() {
      // eslint-disable-next-line
      return `/sentinel/scenes/${this.scene._id}/preview`;
    },
  },
  methods: {
    ...mapActions({
      selectScene: SELECT_SCENE,
    }),
    ...mapGetters([
      'selectedScenes',
    ]),
    isSelected() {
      const scenes = this.selectedScenes()[this.scene.tile.id];
      // eslint-disable-next-line
      return scenes && scenes.filter(scene => this.scene._id === scene._id).length;
    },
    onImageLoad() {
      this.isLoading = false;
    },
  },
};
</script>

<style lang="scss" scoped>

$size: 360px;

.tile-preview {
  cursor: pointer;
  width: $size;
  height: $size;
  background-color: #AAA;

  &.selected {
    .info {
      background-color: #007bff;
    }
  }
}

.info {
  background-color: #717375bf;
  position: absolute;
  width: $size;
  padding: 6px 10px;
  color: white;
}

img {
  width: 100%;
}

.fa-icon {
  margin-top: -5px;
}

.icon-loading {
  color: white;
  position: relative;
  z-index: 100;
  float: right;
  top: 0px;
  right: 20px;
}

</style>
