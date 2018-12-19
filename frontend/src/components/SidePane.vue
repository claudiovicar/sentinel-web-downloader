<template lang="pug">

  div.float-box.col-sm-6.col-lg-3(v-if="isSearching")

    div

      h4 Buscar cenas

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

  div.float-box.no-padding.col-sm-6.col-lg-3(v-else)

    div.col

      div.row
        div.query-details.col-sm-10
          small
            div.text-truncate(:title="scenesQuery.selectedTiles.map(t => t.id)")
              | Tiles: {{scenesQuery.selectedTiles.map(t => t.id).toString()}}
            div
              | Data:
              | {{formattedDate(scenesQuery.dateRange.min)}}
              | -
              | {{formattedDate(scenesQuery.dateRange.max)}}
            div
              | Percentual de nuvens: {{scenesQuery.cloudCover}}%

        div.icon-return.col-sm-2(@click="backToSearch")
          icon(name="arrow-left", scale="2")

    div.scenes-list
      ul.list-group
        li.list-group-item(
          v-for="(tileScenes, tileId) in foundScenes",
          @click="selectTile({id: tileId})"
        )
          icon(v-if="selectedScenes[tileId]", name="check", scale="1.2")
          span.title {{tileId}}
          span.numScenes {{tileScenes.length}} cenas
          div(v-if="selectedScenes[tileId]")
            div.clearfix(v-for="scene in selectedScenes[tileId]")
              small.float-left {{formattedDate(scene.sensing_time)}}
              small.float-right {{scene.cloud_cover}}

      div.col
        button.btn.btn-primary.float-right.mt-4(@click="downloadScenes()", v-if="hasSelectedScenes")
          icon.mr-2(name="file-download")
          span Baixar cenas


</template>

<script>

import Multiselect from 'vue-multiselect';
import DatePicker from 'vue2-datepicker';
import Icon from 'vue-awesome';

import { mapGetters } from 'vuex';

import { VIEW_STATES } from '@/config';

import {
  FETCH_SENTINEL_TILES, FETCH_SENTINEL_DATE_RANGE, SELECT_TILE, UNSELECT_TILE,
  FILTER_SENTINEL_SCENES, SET_CURRENT_VIEW,
} from '@/store/actions.type';

import sentinel from '@/services/sentinel';

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
    formattedDate(date) {
      return new Date(date).toLocaleDateString('pt-br');
    },
    downloadScenes() {
      let scenes = [];
      for(let tileId in this.selectedScenes) {
        scenes = scenes.concat(this.selectedScenes[tileId]);
      }
      sentinel.generateComposition(scenes)
        .then((response) => {
          window.alert('Download em andamento');
        })
        .catch((error) => {
          window.alert('Erro no download');
        });
    },
    backToSearch() {
      this.$store.dispatch(SET_CURRENT_VIEW, VIEW_STATES.SEARCH);
    },
  },
  computed: {
    ...mapGetters([
      'tiles',
      'foundScenes',
      'selectedTiles',
      'selectedScenes',
      'dateRange',
      'currentView',
      'scenesQuery',
    ]),
    isSearching() {
      return this.currentView === VIEW_STATES.SEARCH;
    },
    hasSelectedScenes() {
      for (let tileId in this.foundScenes) {
        if (this.selectedScenes[tileId]) return true;
      }
      return false;
    },
    // countScenes() {
    //   return Object.keys(this.scenes).length;
    // },
  },
  mounted() {
    this.$store.dispatch(FETCH_SENTINEL_TILES);
    this.$store.dispatch(FETCH_SENTINEL_DATE_RANGE);
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

#tile-date-picker {
  width: 100%;
}

.scenes-list {
  height: 80%;
  overflow-y: auto;
}

.query-details {
  padding: 10px;
}

.icon-return {
  cursor: pointer;
  padding: 22px;
  &:hover {
    background-color: #EFEFEF;
  }
  .fa-icon {
    color: $icon-color;
  }
}

ul.list-group {

  li.list-group-item {
    cursor: pointer;
    border-radius: 0;
    &:hover {
      background-color: #EFEFEF;
    }
    .title {
      font-weight: bold;
    }
    .numScenes {
      float: right;
      font-size: 12px;
      color: $secondary;
    }
    .fa-icon {
      margin-right: 4px;
      color: $success;
    }
  }

}

// ul.scenes-list {

//   width: 100%;

//   li {
//     padding: 10px 15px;
//   }

// }

</style>
