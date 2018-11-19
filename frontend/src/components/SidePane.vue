<template lang="pug">

  div.float-box.col-sm-6.col-lg-3

    div.container

      form

        .form-group
          label(for="tile-picker") Selecione os tiles:
          multiselect(
            id="tile-picker",
            v-model="selectedTiles",
            :options="tiles",
            :multiple="true",
            :close-on-select="false",
            :clear-on-select="false",
            :preserve-search="true",
            placeholder="Selecione..."
            label="id",
            track-by="id",
            :preselect-first="false"
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
            :not-before="dates.min",
            :not-after="dates.max",
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

      button.btn.btn-primary.float-right(@click="filtrar()")
        octicon.mr-2(name="search")
        span Buscar

</template>

<script>

import Multiselect from 'vue-multiselect';
import DatePicker from 'vue2-datepicker';
import Octicon from 'vue-octicon/components/Octicon.vue';

import 'vue-octicon/icons/search';

import sentinel from '@/services/sentinel';

export default {
  name: 'SidePane',
  components: {
    Multiselect,
    DatePicker,
    Octicon,
  },
  data() {
    return {
      expanded: false,
      tiles: [],
      selectedTiles: null,
      dates: {
        min: new Date(),
        max: new Date(),
      },
      selectedDates: [],
      cloudCover: 5,
    };
  },
  methods: {
    filtrar() {
      const dateRange = {
        min: this.selectedDates ? this.selectedDates[0].toISOString() : this.dates.min,
        max: this.selectedDates ? this.selectedDates[1].toISOString() : this.dates.max,
      };
      sentinel.filterScenes(this.selectedTiles, dateRange, this.cloudCover);
    },
  },
  mounted() {
    sentinel.tileList().then((response) => {
      this.tiles = response.data;
    });

    sentinel.dateRange().then((response) => {
      this.dates = {
        min: new Date(response.data.min),
        max: new Date(response.data.max),
      };
    });
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
