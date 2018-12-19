<template lang="pug">

    div.container
        h2
            | Acompanhe o andamento dos downloads

        div.row.request-list(v-if="requests")
            ul.list-group.col
                ul.list-group-item(v-for="request in requests")
                    div {{request.scene.granule_id}}
                    div {{request.bands}}
                    //- div {{request.status}}
                    div.badge.badge-success(v-if="request.status === 'DONE'") Completo
</template>

<script>
import sentinel from '@/services/sentinel';
export default {
    data() {
        return {
            requests: null
        };
    },
    methods: {
        update() {
            sentinel.getDownloadStatus()
                .then((response) => {
                    this.requests = response.data;
                })
                .catch(e => console.log);
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
