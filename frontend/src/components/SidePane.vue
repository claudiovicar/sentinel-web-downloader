<template lang="pug">

  div.float-box.col-sm-6.col-lg-3

    div.container

      div.row

        div
          label Selecione os tiles:
          multiselect(
            v-model="tile",
            :options="tiles",
            :multiple="true",
            :close-on-select="false",
            :clear-on-select="false",
            :preserve-search="true",
            placeholder="Selecione..."
            label="id",
            track-by="id",
            :preselect-first="false",
            @input="action",
            @select="action"
          )
            template(slot="option", slot-scope="props", @click="mouseover")
              .option__desc
                span.option__title {{ props.option.id }}
                //- span.option__small {{ props.option.desc }}

</template>

<script>

import Multiselect from 'vue-multiselect';

import sentinel from '@/services/sentinel';

export default {
  name: 'SidePane',
  components: {
    Multiselect,
  },
  data() {
    return {
      expanded: false,
      tile: null,
      tiles: [],
    };
  },
  methods: {
    action(event) {
      // eslint-disable-next-line
      console.log(event);
    },
    mouseover(event) {
      // eslint-disable-next-line
      console.log(event);
    },
  },
  mounted() {
    sentinel.getTileList().then((response) => {
      this.tiles = response.data;
    });
  },
};
</script>

<style lang="scss" scoped>

.float-box {
  z-index: 10000;
  position: absolute;
  top: 0;
  bottom: 0;

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
