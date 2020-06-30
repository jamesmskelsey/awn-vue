<script>
import { mapActions } from 'vuex'
import JobDetails from '@/components/JobDetails.vue'
import JobForm from '@/components/JobForm.vue'

export default {
    components: {
        JobDetails,
        JobForm,
    },
    data() {
        return {
            id: this.$route.params.id
        }
    },
    methods: {
        ...mapActions([
            'bindJob',
            'saveWN',
        ]),
        handleSaveWN(repo_comments, hot_job) {
            const id = this.id;
            return this.$store.dispatch('saveWN', {
                id, repo_comments, hot_job
            })
        }
    },
    computed: {
        job() {
            return this.$store.state.job;
        }
    },
    mounted: async function() {
      // This is necessary to actually make the bind happen in the store.
      // Not documented in Vuexfire. Obvious once it's here. I'm tired, but i knew this is what I was trying to do.
      console.log(this.id)
      await this.$store.dispatch('bindJob', {id: this.id})  
    }
}
</script>

<template>
    <div>
        <JobDetails v-bind:job="job" ></JobDetails>
        <JobForm v-bind:initialComments="job.repo_comments" v-bind:initialHotJob="job.hot_job" :handleSaveWN="handleSaveWN"></JobForm>
    </div>
</template>