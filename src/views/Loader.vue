<script>
import Fields from '@/components/Fields.vue'
import {mapState, mapActions} from 'vuex'
import {csvParse} from 'd3-dsv';
import moment from 'moment';

export default {
    components: {
        Fields
    },
    data: function() {
        return {
            // awn: [],
            selected_work_centers: [],
            work_centers: [],
        }
    },
    computed: {
        ...mapState({
        /* Map state to value in computed to use it in the component.
        count: state => state.count,
        msg: state => state.msg,
        */
            count: state => state.count,
       }),
       awn() {
           return this.$store.state.awn
       }
    },
    
    methods: {
        ...mapActions({
            /* Just remembering how to use vuex. Actions dispatch to do mutators/async things */
            addAWN: 'addAWN',
            
        }),
        parseReport: (e, store) => {
            function parseDateStringToMoment(str) {
                return str != "" ? moment(str.split('').filter(i => i != '=' && i != '"').join(''), "MM/DD/YYYY") : "";
            }
            function formatDateString(str) {
                return parseDateStringToMoment(str) != "" ? parseDateStringToMoment(str).format('DD MMM YY') : "";
            }
            function reviewDate(str, wd) {
                const dateDiscovered = parseDateStringToMoment(wd);
                // Strip the last date that looks like a review date out
                var arr = [...str.matchAll(/((?:\d|\d\d)\/\d\d\/\d\d\d\d).*(?:\r|\n|\r\n).*(?:R.*V.*W(?:ED|D)*)/g)];
                // return that as the last actual day reviewed... as a moment object.
                if (arr.length == 0) {
                    return dateDiscovered;
                } else {
                    return moment(arr[arr.length - 1][1], "MM/DD/YYYY");
                }
            }
            function actualReviewDate(str, wd) {
                return reviewDate(str, wd).format('DD MMM YY');
            }
            function expiredReviewDate(str, wd) {
                return reviewDate(str, wd).isBefore(new moment().subtract(90, 'days'))
            }
            function lastReviewedBy(str) {
                var arr = [...str.matchAll(/([A-Z]+,\s[A-Z]).*(?:\r|\n|\r\n).*(?:R.*V.*W(?:ED|D)?)/g)];
                if (arr.length == 0) {
                    return "originator"
                } else {
                    return arr[arr.length - 1][1];
                }
            }
            // 'data' becomes a collection of rows from the awn report
            let result = csvParse(e.target.result, function(d) {
                return {
                    id: d.JCN.substring(5),
                    work_center: d.WORKCENTER,
                    location: d.LOCATION,
                    equipment: d.EQUIPMENT,
                    sn: d.SERIAL_NUMBER,
                    summary: d.SUMMARY,
                    jcn: d.JCN.substring(9),
                    problem: d.PROBLEM,
                    recommendation: d.RECOMMENDATION,
                    ships_force_comments: d.SHIPS_FORCE_COMMENTS.split('').filter(l => l != '*').join(''),
                    equip_status: d.EQUIP_STATUS_CODE,
                    status: d.JOB_STATUS,
                    priority_code: d.PRIORITY_CODE.split('').filter(i => i != '=' && i != '"').join(''),
                    act_taken: d.ACTION_TAKEN_CODE,
                    avail: d.AVAIL_ID,
                    type_avail: d.TYPE_AVAILABILITY_CODE.split('').filter(i => i != '=' && i != '"').join(''),
                    port_eng_comments: d.MAINTENANCE_TEAM_COMMENTS,
                    safety_code: d.SAFETY_CODE,
                    problem_mentions_safety: d.PROBLEM.toLowerCase().search(/safety|unsafe/g) > -1,
                    recommendation_mentions_safety: d.RECOMMENDATION.toLowerCase().search(/safety|unsafe/g) > -1,
                    completion_date: formatDateString(d.COMPLETION_DATE),
                    date_discovered: formatDateString(d.WHEN_DISCOVERED_DATE),
                    deferral_date: formatDateString(d.DEFERRAL_DATE),
                    deferral_reason: d.DEFERRAL_REASON_CODE.split('').filter(i => i != '=' && i != '"').join(''),
                    actual_solution: d.ACTUAL_SOLUTION,
                    should_have_parts: d.RECOMMENDATION.toLowerCase().search(/part|order|requisition|open purchase/g) > -1,
                    parts: d.PARTS_ORDERED,
                    routing_level: d.ROUTING_LEVEL,
                    block_10: d.BLOCK_10,
                    days_old: d.DAYS_OLD.split('').filter(i => i != '=' && i != '"').join(''),
                    days_since_update: d.DAYS_SINCE_UPDATE.split('').filter(i => i != '=' && i != '"').join(''),
                    actual_reviewed_date: actualReviewDate(d.SHIPS_FORCE_COMMENTS, d.WHEN_DISCOVERED_DATE),
                    expired_reviewed_date: expiredReviewDate(d.SHIPS_FORCE_COMMENTS, d.WHEN_DISCOVERED_DATE),
                    reviewed_by: lastReviewedBy(d.SHIPS_FORCE_COMMENTS),
                }
            }).filter(i => i.location != "").filter(i => i.id != "");
            // The trailing filter here removes any jobs that AWN returned to me that were garbage.
            
            // Dispatch with the result array. That pushes all the jobs to firebase.
            store.dispatch('addAWN', result);
            
        },
        handleAwnReport: function (vm, e) {
            // https://github.com/d3/d3-dsv
            // Pick out the file from the input
            const fileList = e.target.files;
            const csvFile = fileList[0];
            // Create a file reader to read the file
            const fr = new FileReader();
            // Tell the reader to read the file
            fr.readAsText(csvFile);
            // Once loaded, we parse the result and concat it to existing awn
            fr.addEventListener("load", function (e) {
                this.parseReport(e, this.$store)
            }.bind(this), false);
        
        }
    }
}
</script>

<style scoped>

</style>

<template>
    <div class="m-4">
        <h1 class="text-2xl">Select your AWN .csv report</h1>
        <p>Start by running an AWN report and exporting the results to .csv</p>
        <p>Then, open that file with this tool.</p>
        <input type="file" id="awnReport" v-on:change="handleAwnReport($data, $event)">
        <p>Jobs Loaded: {{awn ? awn.length : "not found"}}</p>
        <Fields />
    </div>
</template>