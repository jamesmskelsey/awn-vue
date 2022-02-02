<template>
  <tr>
    <td :class="job.hot_job ? 'bg-red-500 text-white' : 'bg-white'">
      {{ job.hot_job ? "HOT" : "" }}
    </td>
    <td class=" border border-gray-500">
      <router-link
        class="text-teal-700 font-semibold"
        :to="{ name: 'Job', params: { id: job.id } }"
      >
        <div class="font-small">
          {{ job.work_center }}
        </div>
        <div>
          {{ job.jcn }}
        </div>
      </router-link>
    </td>
    <td class=" border border-gray-500">
      <div>
        {{ job.summary }}
      </div>
      <div>
        {{ job.location }}
      </div>
    </td>
    <td class=" border border-gray-500">
      <div>
        {{ job.equipment }}
      </div>
      <div>
        {{ job.sn }}
      </div>
    </td>
    <td class="text-xs border border-gray-500">
      <div>
        Problem: {{ job.problem.substring(0, 300) }}...
        <hr />
      </div>

      <div>
        Recommendation: {{ job.recommendation.substring(0, 300) }}...
        <hr />
      </div>
      <div v-if="job.ships_force_comments.length > 1">
        Ship's Force: {{ job.ships_force_comments }}
        <hr />
      </div>
      <div v-if="job.repo_comments && job.repo_comments.length > 1">
        Repo's Comments: {{ job.repo_comments }}
        <hr />
      </div>
      <div v-if="job.actual_solution.length > 0">
        Actual Solution: {{ job.actual_solution }}
        <hr />
      </div>
      <div v-if="job.port_eng_comments.length > 1">
        Port Eng: {{ job.port_eng_comments }}
        <hr />
      </div>
      <!-- Generated Comments to highlight possible problems -->
      <GeneratedComments :job="job" />
      <!-- end of generated comments -->
    </td>
    <td class="text-center border border-gray-500">
      <div>
        {{ job.date_discovered != "" ? job.date_discovered : "" }}
      </div>
      <div>
        {{ job.deferral_date != "" ? job.deferral_date : "___  ____  ___" }}({{
          job.deferral_reason
        }})
      </div>
      <div>
        {{ job.completion_date != "" ? job.completion_date : "___  ____  ___" }}
      </div>
    </td>
    <td class="border border-gray-500 text-center">
      <div v-bind:class="job.status == 'OPEN' ? 'bg-green-400' : ''">
        {{ job.status }}
      </div>
      <div>
        {{ job.priority_code }}
      </div>
    </td>
    <td class="border border-gray-500 text-center">
      <div
        v-bind:class="
          job.type_avail == 1 && job.avail == '' ? 'bg-yellow-400' : ''
        "
      >
        {{ job.type_avail == 1 && job.avail == "" ? "_" : job.avail }}
      </div>
      <div>
        {{ job.type_avail }}
      </div>
    </td>
    <td class="border border-gray-500 text-center">
      <div>
        {{ job.days_old }} /
        <span v-bind:class="job.days_since_update > 90 ? 'bg-red-500' : ''">{{
          job.days_since_update
        }}</span>
      </div>
      <div>
        {{ job.block_10 }}
      </div>
    </td>
    <td class="border border-gray-500 text-center">
      <div v-if="job.should_have_parts && !job.parts" class="bg-yellow-500">
        No parts ordered!
      </div>
      <div v-if="job.should_have_parts && job.parts" class="bg-green-500">
        Parts On Order
      </div>
    </td>
  </tr>
</template>

<script>
import GeneratedComments from "./GeneratedComments.vue";
export default {
  name: "TableRow",
  components: {
    GeneratedComments,
  },
  props: ["job"],
};
</script>

<style scoped></style>
