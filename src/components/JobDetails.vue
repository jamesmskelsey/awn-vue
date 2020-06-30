<script>
import GeneratedComments from './GeneratedComments.vue'
export default {
    components: {
        GeneratedComments
    },
    props: ['job'],
    computed: {

    }
}
</script>

<template>
    <div class="grid grid-cols-12">
        <div class="col-start-3 col-end-10">
            <h1 class="mt-4 text-2xl font-bold">{{job.work_center}} - {{job.jcn}}</h1>
            <h2 class="mt-3 text-xl font-semibold">{{job.equipment}} in {{job.location}}</h2>
            <hr>
            <h2 class="mt-3 text-xl font-bold">{{job.summary}}</h2>
            <div class="m-2">
                <p>{{job.problem}}</p>
            </div>
            <h2 class="mt-3 text-xl font-bold">Recommendation</h2>
            <div class="m-2">
                <p>{{job.recommendation}}</p>
            </div>
            <h2 class="mt-3 text-xl font-bold">Comments</h2>
            <div class="m-2">
                <p>{{job.ships_force_comments}}</p>
                <generated-comments :job="job" />
            </div>
            <hr>
            <h2 class="mt-3 text-xl font-bold">Work Notification Information</h2>
            <div class="m-2">
                <ul>
                    <li>Status:     {{job.status}}</li>
                    <li>Routed to:  {{job.routing_level}}</li>
                    <li>Type Avail: {{job.type_avail}}</li>
                    <li>Avail:      {{job.avail}}</li>
                    <li>Safety:     {{job.safety_code}}</li>
                    <li>Block 10:   {{job.block_10}}</li>
                </ul>
            </div>
            <hr>
            <div>
                <h2 class="mt-3 text-xl font-bold">Parts Information</h2>
                <div class="m-2">
                    <p>Parts required: {{job.should_have_parts ? "Yes" : "No"}}</p>
                    <p class="text-gray-400 text-xs">This flag highlights that a job seems to mention that parts will be ordered:</p>
                    <p :class="[job.should_have_parts && job.parts == 'NO' ? 'bg-red-300' : '', '']">Has parts ordered: {{job.parts}}</p>
                </div>
            </div>
            <hr>
            <h2 class="mt-3 text-xl font-bold">Dates</h2>
            <div class="m-2">
                <ul>
                    <li>Discovered: {{job.date_discovered}}</li>
                    <li>Deferred:   {{job.deferral_date}}</li>
                </ul>
            </div>
            <h2 class="mt-3 text-xl font-bold">Update Status</h2>
            <div class="m-2">
                <p> Job is {{job.days_old}} days old. It was reviewed on {{job.actual_reviewed_date}} by {{job.reviewed_by}}.
                <hr>
                <div v-if="job.completion_date.length > 0"> 
                    <h2 class="mt-3 text-xl font-bold" >Completion Details</h2>
                    <h3>Completed: {{job.completion_date}}</h3>
                    <p>Action Taken: {{job.act_taken}}</p>
                    <p>Solution: {{job.actual_solution}}</p>
                </div>
            </div>
        </div>
    </div>
</template>