<script>
export default {
    props: ['job']
}
</script>

<template>
    <div class="grid grid-cols-12">
        <div class="col-start-3 col-end-10">
            <h1 class="mt-4 text-2xl font-bold">{{job.work_center}} - {{job.jcn}}</h1>
            <h2 class="mt-3 text-xl font-semibold">{{job.equipment}} in {{job.location}}</h2>
            <hr>
            <h2 class="mt-3 text-xl font-bold">{{job.summary}}</h2>
            <p>{{job.problem}}</p>
            <h2 class="mt-3 text-xl font-bold">Recommendation</h2>
            <p>{{job.recommendation}}</p>
            <h2 class="mt-3 text-xl font-bold">Comments</h2>
            <p>{{job.ships_force_comments}}
            <hr>
            <h2 class="mt-3 text-xl font-bold">Work Notification Information</h2>
            <ul>
                <li>Status:     {{job.status}}</li>
                <li>Routed to:  {{job.routing_level}}</li>
                <li>Type Avail: {{job.type_avail}}</li>
                <li>Avail:      {{job.avail}}</li>
                <li>Safety:     {{job.safety_code}}</li>
                <li>Block 10:   {{job.block_10}}</li>
            </ul>
            <hr>
            <div v-if="job.should_have_parts">
                <h2 class="mt-3 text-xl font-bold">Parts Information</h2>
                <p>Appears to need parts ordered: {{job.should_have_parts}}</p>
                <p>Has parts ordered: {{job.parts}}</p>
            </div>
            <hr>
            <h2 class="mt-3 text-xl font-bold">Dates</h2>
            <ul>
                <li>Discovered: {{job.date_discovered}}</li>
                <li>Deferred:   {{job.deferral_date}}</li>
            </ul>
            <h2 class="mt-3 text-xl font-bold">Update Status</h2>
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
</template>