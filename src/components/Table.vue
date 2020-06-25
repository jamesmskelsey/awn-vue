<template>
  <!-- Begin App! -->
<div>
  <div v-if="awnLoaded" class="m-4">
    <h1 class="text-2xl">Select your AWN .csv report</h1>
    <p>Start by running an AWN report and exporting the results to .csv</p>
    <p>Then, open that file with this tool.</p>
    <input type="file" id="awnReport" v-on:change="handleAwnReport($data, $event)">
  </div>
  <!-- Temporary text boxes for filtering -->
  <div class="text-gray-900" v-if="work_centers.length > 0"> 
    <div class="no-print" v-if="work_centers.length > 0">
        <div class="m-4 inline-block border rounded">
        <div class="m-4 block">
            <label class="block my-2 text-lg">Menu Visibility</label>
            <button v-on:click="() => showMenu = !showMenu" class="block border border-gray-500 rounded px-4 py-2 hover:bg-gray-200 transition">
            {{showMenu ? "Hide Menu" : "Show Menu"}}
            </button>
        </div>
        <div v-if="showMenu" class="m-4 block">
            <label class="block my-2 text-lg text-gray-900" for="reviewDays">Days Since Review</label>
            <input class="shadow border border-gray-500 rounded p-2 focus:outline-none focus:shadow-outline" id="reviewDays" v-model="reviewDays" type="text" />

        </div>
        </div>
        <div v-if="showMenu" class="m-4 inline-block border rounded">
        <div class="m-4 block">
            <label class="block my-2 text-lg " for="locationFilter">Location</label>
            <input class="shadow border border-gray-500 rounded p-2 focus:outline-none focus:shadow-outline" id="locationFilter" v-model="locationFilter" type="text" />
        </div>
        <div class="m-4 block">
            <label class="block my-2 text-lg" for="equipmentFilter">Equipment</label>
            <input class="shadow border border-gray-500 rounded p-2 focus:outline-none focus:shadow-outline" id="equipmentFilter" v-model="equipmentFilter" type="text" />

        </div>
        </div>
        <div v-if="showMenu" class="m-4 p-2 border rounded inline-block">
        <div class="inline-block">
            <label class="block my-2 text-lg" for="priorityFilter">Priority</label>
            <select class="h-32 shadow border border-gray-500 rounded p-2 focus:outline-none focus:shadow-outline" id="priorityFilter" v-model="priorityFilter" multiple>
            <option v-for="o in priorityOptions" v-bind:key="o">
                {{o}}
            </option>
            </select>
        </div>
        <div class="inline-block">
            <button v-on:click="unselectPriorities"
                class="block px-2 py-2 m-1 border rounded">
            Unselect All
            </button>
        </div>
        </div>
        <!-- Status Filter-->
        <div v-if="showMenu" class="m-4 p-2 border rounded inline-block">
        <div class="inline-block">
            <label class="block my-2 text-lg" for="statusFilter">Status</label>
            <select class="h-32 shadow border border-gray-500 rounded p-2 focus:outline-none focus:shadow-outline" id="statusFilter" v-model="statusFilter" multiple>
            <option v-for="o in statusOptions" v-bind:key="o">
                {{o}}
            </option>
            </select>
        </div>
        <div class="inline-block">
            <button v-on:click="unselectAllStatuses"
                class="block px-2 py-2 m-1 border rounded">
            Unselect All
            </button>
        </div>
        </div>
        <!-- Work center filter -->
        <div v-if="showMenu" class="m-4 p-2 inline-block border rounded">
        <div class="inline-block">
            <label class="block my-2 text-lg" for="work_centers">Work Centers</label>
            <select class="h-32 shadow border border-gray-500 rounded p-2 focus:outline-none focus:shadow-outline"
                    id="work_centers" v-model="selected_work_centers" multiple>
            <option v-for="o in work_centers" v-bind:key="o">
                {{o}}
            </option>
            </select>
        </div>
        <div class="inline-block">
            <button v-on:click="unselectAll"
                class="block px-2 py-2 m-1 border rounded">
            Unselect All
            </button>
            <button v-on:click="selectAll"
                    class="px-2 py-2 m-1 border rounded">
            Select All
            </button>
        </div>
        </div>    
    </div>
  </div>
  <!-- Test table for quick visual reloading -->

  <table v-if="!awnLoaded" class="min-w-full">
    <thead class="uppercase bg-teal-600 text-sm">
      <tr class="border-b-2 border-gray-600">
        <th class="text-left border border-gray-500">
          <div>W/C</div>
          <div>JSN</div>
        </th>
        <th class="text-left border border-gray-500">
          <div>SUMMARY</div>
          <div class="font-small text-gray-800 font-normal">Location</div>
        </th>
        <th class="text-left border border-gray-500">
          <div>EQUIPMENT</div>
        </th>
        <th class="text-left border border-gray-500">
          <div>DISCUSSION</div>
        </th>
        <th class="text-left border border-gray-500">
          <div>Discovered</div>
          <div>Deferred</div>
          <div>Completed</div>
        </th>
        <th class="text-left border border-gray-500 text-center">
          <div>Status</div>
          <div class="text-gray-800">Pri</div>
        </th>
        <th class="text-left border border-gray-500">
          <div>Avail</div>
          <div class="font-small text-gray-800">Type Avail</div>
        </th>
        <th class="text-left border border-gray-500 text-xs">
          <div>Age / Update</div>
          <div>Block 10</div>
        </th>
        <th class="text-left border border-gray-500">
          <div>Parts</div>
        </th>
      </tr>
    </thead>
    <tbody class="text-xs">
      <tr v-for="t in filteredWN" 
          v-bind:key="t.jcn"
          class="border-b shadow-sm mb-8" 
          >
        <td class=" border border-gray-500">
          <div class="font-small">
            {{t.work_center}}
          </div>
          <div>
            {{t.jcn}}
          </div>
        </td>
        <td class=" border border-gray-500">
          <div>
            {{t.summary}}
          </div>
          <div>
            {{t.location}}
          </div>
        </td>
        <td class=" border border-gray-500">
          <div>
            {{t.equipment}}
          </div>
          <div>
            {{t.sn}}
          </div>
        </td>
        <td class="text-xs border border-gray-500">
          <div>
            Problem: {{t.problem.substring(0,300)}}...
            <hr>
          </div>
          
          <div>
            Recommendation: {{t.recommendation.substring(0,300)}}...
            <hr>
          </div>
          <div v-if="t.ships_force_comments.length > 1">
            Ship's Force: {{t.ships_force_comments}}
            <hr>
          </div>
         <div v-if="t.actual_solution.length > 0">
            Actual Solution: {{t.actual_solution}}
            <hr>
          </div>
          <div v-if="t.port_eng_comments.length > 1">
            Port Eng: {{t.port_eng_comments}}
            <hr>
          </div>
      <!-- Generated Comments to highlight possible problems -->
          <div contenteditable>
            Comments: 
            <span class="bg-red-500" v-if="t.actual_reviewed_date.isBefore(new moment().subtract(reviewDays, 'days'))">
              <!-- MUST FIGURE OUT BEFORE LOADING NEW -->
              Reviewed more than {{reviewDays}} ago by {{t.reviewed_by}} on {{t.actual_reviewed_date.format('DD MMM YY')}}.
            </span>
            <span v-else>
              Reviewed by {{t.reviewed_by}} on {{t.actual_reviewed_date.format('DD MMM YY')}}.
            </span>
            <!-- looks safety related, but safety block not marked -->
            <span class="bg-red-500" v-if="( t.problem_mentions_safety || t.recommendation_mentions_safety ) && t.safety_code.length == 0">
              This job appears to be safety related, but no safety code is selected.
            </span>
            <!-- both recommendation/problem don't mention safety -->
            <span class="bg-red-500" v-if="t.problem_mentions_safety && !t.recommendation_mentions_safety">
              The problem seems to mention safety, but the recommendation does not.
            </span>
            <span class="bg-red-500" v-if="!t.problem_mentions_safety && t.recommendation_mentions_safety">
              The recommendation seems to mention safety, but the problem does not.
            </span>
            <span class="bg-red-500" v-if="!t.problem_mentions_safety && !t.recommendation_mentions_safety && t.safety_code.length > 0">
              The job safety code is marked, but the job doesn't seem to mention safety - it should be left blank.
            </span>
            <!-- looks like depot job, but not marked -->
            <span class="bg-red-500" v-if="t.recommendation.toLowerCase().search(/outside activity|depot/g) > -1 && t.type_avail != '1'">
              Is this job a DEPOT level job? The recommendation seems to mention depot level, but job is marked as {{t.type_avail}}.
            </span>
            <!-- looks like intermediate job, but not marked -->
            <span class="bg-red-500" v-if="t.recommendation.toLowerCase().search(/swrmc|intermediate/g) > -1 && t.type_avail != '2'">
              Is this job an INTERMEDIATE level job? The recommendation seems to mention intermediate level, but job is marked as {{t.type_avail}}.
            </span>
            <!-- looks like corrosion based maintenance, but block 10 not marked -->
            <span class="bg-red-500" v-if="t.problem.toLowerCase().search(/corrosion|corroded/g) > -1 && t.block_10 != 'C'">
              Problem says 'corrosion', block 10 is not 'C'.
            </span>
            <!-- looks like compartment based maintenance, but block 10 not marked -->
            <span class="bg-red-500" v-if="t.problem.toLowerCase().search(/zone inspection|inspection|6200.001/g) > -1 && !(t.block_10 == 'Z' || t.block_10 == 'C')">
              Problem seems to be compartment related, block 10 is not 'Z'.
            </span>
            <span class="bg-red-500" v-if="t.status == 'TECH CLOSE' && (t.actual_solution == '' || t.routing_level == 'WCS')">
              If WN is in "TECH CLOSE", must have actual solution and be routed to at least LCPO.
            </span>
          </div>
      <!-- end of generated comments -->
        </td>
        <td class="text-center border border-gray-500">
          <div>
            {{t.date_discovered != '' ? t.date_discovered.format('DD MMM YY') : ''}}
          </div>
          <div>
            {{t.deferral_date != '' ? t.deferral_date.format('DD MMM YY') : '___  ____  ___'}}({{t.deferral_reason}})
          </div>
          <div>
            {{t.completion_date != '' ? t.completion_date.format('DD MMM YY') : '___  ____  ___'}}
          </div>
        </td>
        <td class="border border-gray-500 text-center">
          <div v-bind:class="t.status == 'OPEN' ? 'bg-green-400' : ''">
            {{t.status}}
          </div>
          <div>
            {{t.priority_code}}
          </div>
        </td>
        <td class="border border-gray-500 text-center">
          <div v-bind:class="t.type_avail == 1 && t.avail == '' ? 'bg-yellow-400' : '' ">
            {{t.type_avail == 1 && t.avail == '' ? '_' : t.avail}}
          </div>
          <div>
            {{t.type_avail}}
          </div>
        </td>
        <td class="border border-gray-500 text-center">
          <div>
            {{t.days_old}} / <span v-bind:class="t.days_since_update > 90 ? 'bg-red-500' : '' ">{{t.days_since_update}}</span>
          </div>
          <div>
            {{t.block_10}}
          </div>
        </td>
        <td class="border border-gray-500 text-center">
          <div v-if="t.should_have_parts && !t.parts" class="bg-yellow-500">
            No parts ordered!
          </div>
          <div v-if="t.should_have_parts && t.parts" class="bg-green-500">
            Parts On Order
          </div>
         </td>
      </tr>

      
    </tbody>
  </table>

</div>
<!-- End App -->


</template>

<script>
import {csvParse} from 'd3-dsv';
import moment from 'moment';

export default {
  name: 'HelloWorld',
  data: function() {
      return {
        awn: [],
        work_centers: [],
        selected_work_centers: [],
        // Filter variables
        locationFilter: "",
        equipmentFilter: "",
        statusFilter: [],
        priorityFilter: [],
        priorityOptions: [1,2,3,4],
        reviewDays: 90,
        showMenu: true,
        moment
      }
  },
  computed: {
    // Used to determine if a file has been loaded. Prevents showing an empty table.
    awnLoaded: function() {
      return !this.awn.length > 0;
    },
    statusOptions: function() {
      const statuses = this.awn.map((e) => e.status);
      return statuses.filter((value, index, self) => self.indexOf(value) === index);
    },
    // Filters the table based on all available inputs.
    filteredWN: function() {
      let output = this.awn.map((e) => e);
      output = output.filter((e) => {
          // selected_work_centers.includes(t.work_center)
          return this.selected_work_centers.includes(e.work_center);
      })
      if (this.locationFilter.length > 0) {
        output = output.filter((e) => {
          return e.location.toLowerCase().search(this.locationFilter.toLowerCase()) > -1;
        })
      }
      if (this.equipmentFilter.length > 0) {
        output = output.filter((e) => {
          return e.equipment.toLowerCase().search(this.equipmentFilter.toLowerCase()) > -1;
        })
      }
      if (this.statusFilter.length > 0) {
        output = output.filter((e) => {
          return this.statusFilter.includes(e.status);
        })
      }
      if (this.priorityFilter.length > 0) {
        output = output.filter((e) => {
          return this.priorityFilter.includes(e.status);
        })
      }
      
      return output;
    }
  },
  methods: {
    selectAll: function() {
      this.selected_work_centers = this.work_centers.map((e) => e);
    },
    unselectAll: function() {
      this.selected_work_centers = [];
    },
    unselectAllStatuses: function() {
      this.statusFilter = [];
    },
    unselectPriorities: function() {
      this.priorityFilter = [];
    },
    handleAwnReport: (vm, e) => {
      // https://github.com/d3/d3-dsv
      // Pick out the file from the input
      const fileList = e.target.files;
      const csvFile = fileList[0];
      // Create a file reader to read the file
      const fr = new FileReader();
      // Tell the reader to read the file
      fr.readAsText(csvFile);
      // Once loaded, we parse the result and concat it to existing awn
      fr.addEventListener("load", () => { 
        function parseDateStringToMoment(str) {
          return str != "" ? moment(str.split('').filter(i => i != '=' && i != '"').join(''), "MM/DD/YYYY") : "";
        }
        function actualReviewDate(str, wd) {
          const dateDiscovered = parseDateStringToMoment(wd);
          // Strip the last date that looks like a review date out
          var arr = [...str.matchAll(/((?:\d|\d\d)\/\d\d\/\d\d\d\d).*\n.*(?:R.*V.*W(?:ED|D))/g)]
          // return that as the last actual day reviewed... as a moment object.
          if (arr.length == 0) {
            return dateDiscovered;
          } else {
            return moment(arr[arr.length - 1][1], "MM/DD/YYYY");
          }
        }
        function lastReviewedBy(str) {
          var arr = [...str.matchAll(/([A-Z]+,\s[A-Z]).*\n.*(?:R.*V.*W(?:ED|D))/g)];
          if (arr.length == 0) {
            return "originator"
          } else {
            return arr[arr.length - 1][1];
          }
        }
        // 'data' becomes a collection of rows from the awn report
        let result = csvParse(fr.result, function(d) {
          return {
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
            priority_code: d.PRIORITY_CODE,
            act_taken: d.ACTION_TAKEN,
            avail: d.AVAIL_ID,
            type_avail: d.TYPE_AVAILABILITY_CODE.split('').filter(i => i != '=' && i != '"').join(''),
            port_eng_comments: d.MAINTENANCE_TEAM_COMMENTS,
            safety_code: d.SAFETY_CODE,
            problem_mentions_safety: d.PROBLEM.toLowerCase().search(/safety|unsafe/g) > -1,
            recommendation_mentions_safety: d.RECOMMENDATION.toLowerCase().search(/safety|unsafe/g) > -1,
            completion_date: parseDateStringToMoment(d.COMPLETION_DATE),
            date_discovered: parseDateStringToMoment(d.WHEN_DISCOVERED_DATE),
            deferral_date: parseDateStringToMoment(d.DEFERRAL_DATE),
            deferral_reason: d.DEFERRAL_REASON_CODE.split('').filter(i => i != '=' && i != '"').join(''),
            actual_solution: d.ACTUAL_SOLUTION,
            should_have_parts: d.RECOMMENDATION.toLowerCase().search(/part|order|requisition|open purchase/g) > -1,
            parts: d.PARTS_ORDERED,
            routing_level: d.ROUTING_LEVEL,
            block_10: d.BLOCK_10,
            days_old: d.DAYS_OLD.split('').filter(i => i != '=' && i != '"').join(''),
            days_since_update: d.DAYS_SINCE_UPDATE.split('').filter(i => i != '=' && i != '"').join(''),
            actual_reviewed_date: actualReviewDate(d.SHIPS_FORCE_COMMENTS, d.WHEN_DISCOVERED_DATE),
            reviewed_by: lastReviewedBy(d.SHIPS_FORCE_COMMENTS),
          }
        }).filter(i => i.location != "");
        result.sort((a, b) => {
          if (a.work_center < b.work_center) {
            return -1;
          } else if (a.work_center > b.work_center) {
            return 1;
          }
          if (+a.jcn < +b.jcn) {
            return -1;
          } 
          return 1;
        });
        vm.awn = vm.awn.concat(result);
        // Add all work centers to the work center list
        vm.awn.forEach((e) => {if (!vm.work_centers.includes(e.work_center)) { vm.work_centers.push(e.work_center)}});
        // Select all work centers initially.        
        vm.selected_work_centers = vm.work_centers.map(i => i);
      }, false);
      
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@media print {
  .no-print {
    visibility: hidden !important;
    height: 0;
  }
}
</style>
