<template lang="pug">
    #app
      vue-snotify
      .container-fluid
        router-view
</template>

<script>
// import { LOAD_FROM_STORAGE } from '@/store/actions.type';

// export default {
//   mounted() {
//     this.$store.dispatch(LOAD_FROM_STORAGE);
//   },
// };
</script>


<style lang="scss">
#app {
  height: 100%;
  .container-fluid {
    height: 100%;
    margin: 0;
    padding: 0;
  }
}
</style>
