<script>
/*
"WORKCENTER",
"LOCATION",
"SERIAL_NUMBER",
"JCN",
"PROBLEM",
"RECOMMENDATION",
"SHIPS_FORCE_COMMENTS",
"EQUIP_STATUS_CODE",
"JOB_STATUS",
"PRIORITY_CODE",
"ACTION_TAKEN",
"AVAIL_ID",
"TYPE_AVAILABILITY_CODE",
"MAINTENANCE_TEAM_COMMENTS",
"SAFETY_CODE",
"PROBLEM",
"RECOMMENDATION",
"COMPLETION_DATE",
"WHEN_DISCOVERED_DATE",
"DEFERRAL_DATE",
"DEFERRAL_REASON_CODE",
"ACTUAL_SOLUTION",
"RECOMMENDATION",
"PARTS_ORDERED",
"ROUTING_LEVEL",
"BLOCK_10",
"DAYS_OLD",
"DAYS_SINCE_UPDATE",
*/
export default {
    data: function() {
        return {
            fields: [
                "WORKCENTER",
                "LOCATION",
                "SERIAL_NUMBER",
                "JCN",
                "PROBLEM",
                "RECOMMENDATION",
                "SHIPS_FORCE_COMMENTS",
                "EQUIP_STATUS_CODE",
                "JOB_STATUS",
                "PRIORITY_CODE",
                "ACTION_TAKEN",
                "AVAIL_ID",
                "TYPE_AVAILABILITY_CODE",
                "MAINTENANCE_TEAM_COMMENTS",
                "SAFETY_CODE",
                "COMPLETION_DATE",
                "WHEN_DISCOVERED_DATE",
                "DEFERRAL_DATE",
                "DEFERRAL_REASON_CODE",
                "ACTUAL_SOLUTION",
                "PARTS_ORDERED",
                "ROUTING_LEVEL",
                "BLOCK_10",
                "DAYS_OLD",
                "DAYS_SINCE_UPDATE",
            ]
        }
    }
}
</script>

<template>
    <div>
        <h2 class="text-xl">ADHOC Fields</h2>
        <p class="text-gray-700 text-sm">Checkboxes are provided for your convenience. Each is required to be in your ADHOC.</p>
        <div class="ml-4" v-for="field in fields" v-bind:key="field">
            <input class="m-1" type="checkbox" :id="field" />
            <label :for="field">{{field}}</label>
            
        </div>
    </div>
</template>