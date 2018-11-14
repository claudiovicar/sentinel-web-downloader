<template lang="pug">

  div#base
    Map
    SidePane

</template>

<script>

import Map from '@/components/Map.vue';
import SidePane from '@/components/SidePane.vue';

export default {
  name: 'Main',
  components: {
    Map,
    SidePane,
  },
};

</script>

<style lang="scss" scoped>

  #base {
    width: 100%;
    height: 100%;
  }

</style>
