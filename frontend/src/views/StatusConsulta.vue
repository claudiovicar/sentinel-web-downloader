<template lang="pug">

  transition(
    enter-active-class="animated fadeIn",
    leave-active-class="animated fadeOut"
  )

    div.container.wrapper

      div.affix
        h2
            | Acompanhe o andamento dos downloads

        label(@click="navigateBack()") Voltar

      div.request-list(v-if="requestGroups")

        div.request-group.shadow-sm(v-for="group in requestGroups")

          div.group-info {{formatDate(group)}} - {{group.requests.length}} cenas

          table.table.table-sm.table-light
            thead
              tr
                th #
                th Cena
                th Composição de bandas
                th Formato
                th Status
                th
            tbody.table-hover
              tr(v-for="(request, index) in group.requests")
                th.text-center {{index}}
                th {{request.scene.granule_id}}
                th {{request.bands}}
                th {{request.outputFormat}}
                th
                  div.badge(:class="status[request.status].class") {{status[request.status].text}}
                th
                  button.btn.btn-link(
                    v-if="request.status === 'DONE'",
                    @click="download(request)") Download
</template>

<script>
import sentinel from '@/services/sentinel';

const STATUS = {
  DONE: {
    text: 'Completo',
    class: 'badge-success',
  },
  IN_PROGRESS: {
    text: 'Em andamento',
    class: 'badge-primary',
  },
  ERROR: {
    text: 'Erro',
    class: 'badge-danger',
  },
};

export default {
  data() {
    return {
      requestGroups: null,
      status: STATUS,
    };
  },
  methods: {
    navigateBack() {
      this.$router.push({ name: 'home' });
    },
    update() {
      sentinel.getDownloadStatus()
        .then((response) => {
          this.requestGroups = response.data;
        })
        // eslint-disable-next-line
        .catch(e => console.log(e));
    },
    download(request) {
      sentinel.downloadScene(request);
    },
    formatDate(group) {
      const date = new Date(group.requestDate);
      return `${date.toLocaleDateString('pt-br')} às ${date.toLocaleTimeString('pt-br')}`;
    },
  },
  mounted() {
    this.update();
  },
};
</script>

<style lang="scss" scoped>

.wrapper {
  height: 100%;
  padding: 20px;
  background-color: white;
}

.request-list {
  height: 100%;
  overflow-y: auto;
}

.request-group {
  background-color: #f5f5f5;
  padding: 5px 10px;
  margin-bottom: 10px;
  .group-info {
    padding: 5px;
    font-size: 1.1em;
  }
}

table {
  th {
    vertical-align: middle;
  }
  thead th {
    padding: 0.5rem !important;
  }
}

</style>
