<script>
export default {
    name: "GeneratedComments",
    props: ['job']
}
</script>

<template>
    <div>
        Generated Comments: 
        <span class="bg-red-300" v-if="job.expired_reviewed_date">
            <!-- MUST FIGURE OUT BEFORE LOADING NEW -->
            Reviewed more than 90 days ago by {{job.reviewed_by}} on {{job.actual_reviewed_date}}.
        </span>
        <span v-else>
            Reviewed by {{job.reviewed_by}} on {{job.actual_reviewed_date}}.
        </span>
        <!-- looks safety related, but safety block not marked -->
        <span class="bg-red-300" v-if="( job.problem_mentions_safety || job.recommendation_mentions_safety ) && job.safety_code.length == 0">
            This job appears to be safety related, but no safety code is selected.
        </span>
        <!-- both recommendation/problem don't mention safety -->
        <span class="bg-red-300" v-if="job.problem_mentions_safety && !job.recommendation_mentions_safety">
            The problem seems to mention safety, but the recommendation does not.
        </span>
        <span class="bg-red-300" v-if="!job.problem_mentions_safety && job.recommendation_mentions_safety">
            The recommendation seems to mention safety, but the problem does not.
        </span>
        <span class="bg-red-300" v-if="!job.problem_mentions_safety && !job.recommendation_mentions_safety && job.safety_code.length > 0">
            The job safety code is marked, but the job doesn't seem to mention safety - it should be left blank.
        </span>
        <!-- looks like depot job, but not marked -->
        <span class="bg-red-300" v-if="job.recommendation.toLowerCase().search(/outside activity|depot/g) > -1 && job.type_avail != '1'">
            Is this job a DEPOT level job? The recommendation seems to mention depot level, but job is marked as {{job.type_avail}}.
        </span>
        <!-- looks like intermediate job, but not marked -->
        <span class="bg-red-300" v-if="job.recommendation.toLowerCase().search(/swrmc|intermediate/g) > -1 && job.type_avail != '2'">
            Is this job an INTERMEDIATE level job? The recommendation seems to mention intermediate level, but job is marked as {{job.type_avail}}.
        </span>
        <!-- looks like corrosion based maintenance, but block 10 not marked -->
        <span class="bg-red-300" v-if="job.problem.toLowerCase().search(/corrosion|corroded/g) > -1 && job.block_10 != 'C'">
            Problem says 'corrosion', block 10 is not 'C'.
        </span>
        <!-- looks like compartment based maintenance, but block 10 not marked -->
        <span class="bg-red-300" v-if="job.problem.toLowerCase().search(/zone inspection|inspection|6200.001/g) > -1 && !(job.block_10 == 'Z' || job.block_10 == 'C')">
            Problem seems to be compartment related, block 10 is not 'Z'.
        </span>
        <span class="bg-red-300" v-if="job.status == 'TECH CLOSE' && (job.actual_solution == '' || job.routing_level == 'WCS')">
            If WN is in "TECH CLOSE", must have actual solution and be routed to at least LCPO.
        </span>
    </div>
</template>