<script>
/* This display on the page is not meant to do anything. Users had to pick a specific set of
fields to get this to work, and many were named in a confusing way. I was asked to put this here
by the users at some point.
*/
export default {
  data: function() {
    return {
      fields: [
        "ACTION_TAKEN",
        "ACTUAL_SOLUTION",
        "AVAIL_ID",
        "BLOCK_10",
        "COMPLETION_DATE",
        "DAYS_OLD",
        "DAYS_SINCE_UPDATE",
        "DEFERRAL_DATE",
        "DEFERRAL_REASON_CODE",
        "EQUIP_STATUS_CODE",
        "JCN",
        "JOB_STATUS",
        "LOCATION",
        "MAINTENANCE_TEAM_COMMENTS",
        "PARTS_ORDERED",
        "PRIORITY_CODE",
        "PROBLEM",
        "RECOMMENDATION",
        "ROUTING_LEVEL",
        "SAFETY_CODE",
        "SERIAL_NUMBER",
        "SHIPS_FORCE_COMMENTS",
        "TYPE_AVAILABILITY_CODE",
        "WHEN_DISCOVERED_DATE",
        "WORKCENTER",
      ],
    };
  },
};
</script>

<template>
  <div>
    <h2 class="mt-4 text-xl">ADHOC Fields</h2>
    <p class="text-gray-700 text-sm">
      Checkboxes are provided for your convenience. Each is required to be in
      your ADHOC.
    </p>
    <div class="ml-4" v-for="field in fields" v-bind:key="field">
      <input class="m-1" type="checkbox" :id="field" />
      <label :for="field">{{ field }}</label>
    </div>
  </div>
</template>
