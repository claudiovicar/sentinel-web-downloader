<template lang="pug">

  header
    .float-right(v-if="dateRange.max")
      label Última atualização: {{dateRange.max.toLocaleString('pt-br')}}

</template>

<script>
import { mapGetters } from 'vuex';

import { FETCH_SENTINEL_DATE_RANGE } from '@/store/actions.type';

export default {
  name: 'Header',
  data() {
    return {
    };
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

  header {
    width: 100%;
    height: 60px;
    background-color: white;
  }

</style>
