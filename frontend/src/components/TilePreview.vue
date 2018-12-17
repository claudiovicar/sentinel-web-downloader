<template lang="pug">

div.tile-preview(@click="selectScene(scene)")

  div.info
    span Sentinel2
    div
      icon.mr-2(name="cloud")
      span {{formattedCloudCover}} %
    div
      icon.mr-2(name="calendar")
      span {{formattedDate}}

  //- div.not-found
    icon(name="unlink", scale="2")

  img(:src='sceneURL')

</template>

<script>
import { mapActions } from 'vuex';

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

// .not-found {
//   color: white;
//   position: absolute;
//   top: $size / 2;
//   left: $size / 2;
// }

.fa-icon {
  margin-top: -5px;
}

</style>
