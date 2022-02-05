<script>
export default {
  props: ["id", "initialComments", "initialHotJob", "handleSaveWN"],
  data: function() {
    return {
      repo_comments: this.initialComments ? this.initialComments : "",
      hot_job: this.initialHotJob ? this.initialHotJob : false,
      updateSaved: false,
    };
  },
  methods: {
    handleSave() {
      this.updateSaved = false;
      this.handleSaveWN(this.repo_comments, this.hot_job).then(() => {
        this.updateSaved = true;
      });
    },
  },
  watch: {
    initialComments: function(newVal, oldVal) {
      if (newVal != oldVal) {
        this.repo_comments = newVal;
      }
    },
    initialHotJob: function(newVal, oldVal) {
      if (newVal != oldVal) {
        this.hot_job = newVal;
      }
    },
  },
};
</script>

<style scoped></style>

<template>
  <div class="grid grid-cols-12">
    <div class="col-start-3 col-end-10">
      <label>Repo Comments</label><br />
      <textarea
        cols="50"
        rows="5"
        class="border"
        v-model="repo_comments"
      ></textarea
      ><br />
      <input type="checkbox" v-model="hot_job" />
      <label>Hot Job</label><br />
      <p v-if="updateSaved">Update Saved!</p>
      <input
        @click="handleSave"
        class="mx-5 text-white bg-black px-4 py-2 uppercase tracking-widest font-medium"
        type="button"
        value="save"
      />
    </div>
  </div>
</template>
