<template lang="pug">

  header
    .float-right(v-if="dataUltimaAtualizacao")
      label Última atualização: {{dataUltimaAtualizacao.toLocaleString('pt-br')}}

</template>

<script>
import sentinel from '@/services/sentinel';

export default {
  name: 'Header',
  data() {
    return {
      dataUltimaAtualizacao: null,
    };
  },
  mounted() {
    sentinel.dateRange().then((response) => {
      this.dataUltimaAtualizacao = new Date(response.data.max);
    });
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
