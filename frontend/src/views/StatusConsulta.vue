<template lang="pug">

  transition(
    enter-active-class="animated fadeIn",
    leave-active-class="animated fadeOut"
  )

    div.container
        h2
            | Acompanhe o andamento dos downloads

        label(@click="navigateBack()") Voltar

        div.request-list(v-if="requestGroups")
          div(v-for="group in requestGroups")
            h5 {{group._id}}
            ul.list-group.col
                ul.list-group-item(v-for="request in group.requests")
                    div {{request.scene.granule_id}}
                    div {{request.bands}}
                    //- div {{request.status}}
                    div(v-if="request.status === 'DONE'")
                      div.badge.badge-success Completo
                      button.btn.btn-link(@click="download(request)") Download
</template>

<script>
import sentinel from '@/services/sentinel';

export default {
  data() {
    return {
      requestGroups: null,
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
  },
  mounted() {
    this.update();
  },
};
</script>

<style lang="scss" scoped>

.container {
  height: 100%;
}

.request-list {
  height: 100%;
  overflow-y: auto;
}

</style>
