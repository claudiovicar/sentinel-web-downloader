<template lang="pug">

  header
    .float-left
      button.btn.btn-sm.btn-success.float-left(@click="checkScenes()")
        icon.mr-2(name="cloud-download-alt")
        span Consultar cenas baixadas

    .float-right(v-if="dateRange.max")
      label Última atualização: {{dateRange.max.toLocaleString('pt-br')}}

      button.btn.btn-sm.btn-success.ml-2(@click="update()")
        icon.mr-2(name="sync")
        span Atualizar agora

</template>

<script>
import Icon from 'vue-awesome';

import { mapGetters } from 'vuex';

import { FETCH_SENTINEL_DATE_RANGE } from '@/store/actions.type';

export default {
  name: 'Header',
  components: {
    Icon,
  },
  data() {
    return {
    };
  },
  methods: {
    checkScenes() {
      this.$router.push({ name: 'consulta' });
    },
    update() {
      // updateService.update()
    },
  },
  computed: {
    ...mapGetters([
      'dateRange',
    ]),
  },
  mounted() {
    this.$store.dispatch(FETCH_SENTINEL_DATE_RANGE);
  },
};
</script>

<style lang="scss">
@import '@/styles/variables.scss';

  header {
    width: 100%;
    height: $header-height;
    background-color: white;
    padding: (($header-height / 2) - 14) 35px !important;
    label {
      vertical-align: text-top;
      color: grey;
    }
  }

</style>
