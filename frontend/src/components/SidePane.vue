<template lang="pug">

  div.float-box.col-sm-6.col-lg-3(v-if="isFiltering")

    div.container

      form

        .form-group
          label(for="tile-picker") Selecione os tiles:
          multiselect(
            id="tile-picker",
            :value="selectedTiles",
            :options="tiles",
            :multiple="true",
            :close-on-select="false",
            :clear-on-select="false",
            :preserve-search="true",
            placeholder="Selecione..."
            label="id",
            track-by="id",
            :preselect-first="false",
            @select="selectTile",
            @remove="unselectTile"
          )
            template(slot="option", slot-scope="props", @click="mouseover")
              .option__desc
                span.option__title {{ props.option.id }}

        .form-group
          label(for="tile-date-picker") Intervalo de datas:
          date-picker(
            id="tile-date-picker",
            v-model='selectedDates',
            lang='pt-br',
            :not-before="dateRange.min",
            :not-after="dateRange.max",
            range)

        .form-group
          label(for="tile-cloud-cover") Cobertura de nuvens (%):
          div
            input.form-control(
              id="tile-cloud-cover",
              type="number",
              v-model="cloudCover",
              min="0",
              max="100")

      button.btn.btn-primary.float-right(@click="filter()")
        icon.mr-2(name="search")
        span Buscar

  div.float-box.col-sm-6.col-lg-3(v-else)

    div.container

      h3 {{scenes.length}}

      div(v-for="(tileScenes, tileId) in scenes")
        h6 {{tileId}}
        ul
          li(v-for="s in tileScenes") {{s._id}}


</template>

<script>

import Multiselect from 'vue-multiselect';
import DatePicker from 'vue2-datepicker';
import Icon from 'vue-awesome';

import { mapGetters } from 'vuex';

import {
  FETCH_SENTINEL_TILES, FETCH_SENTINEL_DATE_RANGE, SELECT_TILE, UNSELECT_TILE,
  FILTER_SENTINEL_SCENES,
} from '@/store/actions.type';

export default {
  name: 'SidePane',
  components: {
    Multiselect,
    DatePicker,
    Icon,
  },
  data() {
    return {
      expanded: false,
      selectedDates: [],
      cloudCover: 5,
    };
  },
  methods: {
    filter() {
      const dateRange = {
        min: this.selectedDates ? this.selectedDates[0].toISOString() : this.dateRange.min,
        max: this.selectedDates ? this.selectedDates[1].toISOString() : this.dateRange.max,
      };
      this.$store.dispatch(FILTER_SENTINEL_SCENES, {
        selectedTiles: this.selectedTiles, dateRange, cloudCover: this.cloudCover,
      });
    },
    selectTile(tile) {
      this.$store.dispatch(SELECT_TILE, tile);
    },
    unselectTile(tile) {
      this.$store.dispatch(UNSELECT_TILE, tile);
    },
  },
  computed: {
    ...mapGetters([
      'tiles',
      'scenes',
      'selectedTiles',
      'dateRange',
      'isFiltering',
    ]),
  },
  mounted() {
    this.$store.dispatch(FETCH_SENTINEL_TILES);
    this.$store.dispatch(FETCH_SENTINEL_DATE_RANGE);
  },
};
</script>

<style lang="scss" scoped>

#tile-date-picker {
  width: 100%;
}

.float-box {
  z-index: 10000;
  position: absolute;
  top: 60px;
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
