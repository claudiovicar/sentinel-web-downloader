<template lang="pug">

  div#base
    .row
      Header
    Map
    SidePane

</template>

<script>

import Map from '@/components/Map.vue';
import SidePane from '@/components/SidePane.vue';
import Header from '@/components/Header.vue';

export default {
  name: 'Main',
  components: {
    Map,
    SidePane,
    Header,
  },
};

</script>

<style lang="scss" scoped>

  #base {
    width: 100%;
    height: 100%;
  }

</style>
