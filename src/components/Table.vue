<template>
  <!-- Begin App! -->
<div>
  <!-- Temporary text boxes for filtering -->
  <div class="text-gray-900"> 
    <div class="no-print">
        <div class="m-4 inline-block border rounded">
        <div class="m-4 block">
            <label class="block my-2 text-lg">Menu Visibility</label>
            <button v-on:click="() => showMenu = !showMenu" class="block border border-gray-500 rounded px-4 py-2 hover:bg-gray-200 transition">
            {{showMenu ? "Hide Menu" : "Show Menu"}}
            </button>
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
            <option v-for="o in work_centers" v-bind:key="o.wc">{{o.wc}}</option>
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
        <div class="m-4 inline-block border rounded">
            <div class="m-4 block">
                <label class="block my-2 text-lg">Search by WC</label>
                <button v-if="selected_work_centers.length <= 10" v-on:click="search" class="block border border-gray-500 rounded px-4 py-2 hover:bg-gray-200 transition">
                    Search
                </button>
                <button v-else class="block border border-gray-500 rounded px-4 py-2 hover:bg-gray-200 transition">
                    Too many WC selected
                </button>
            </div>
            <div class="m-4 block">
                <label class="block mt-2 text-lg">Show Hot Jobs</label>
                <p class="text-gray-500 mb-2 text-xs">Selects all WC</p>
                <button v-on:click="searchHotJobs" class="block border border-gray-500 rounded px-4 py-2 hover:bg-gray-200 transition">
                    Hot!
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
          <div>HOT</div>
        </th>
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
        <td :class="t.hot_job ? 'bg-red-500 text-white' : 'bg-white' ">
            {{t.hot_job ? "HOT" : ""}}
        </td>
        <td class=" border border-gray-500">
            <router-link class="text-teal-700 font-semibold" :to="{name: 'Job', params: {id: t.id}}">
                <div class="font-small">
                    {{t.work_center}}
                </div>
                <div>
                    {{t.jcn}}
                </div>
            </router-link>
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
            <span class="bg-red-500" v-if="t.expired_reviewed_date">
              <!-- MUST FIGURE OUT BEFORE LOADING NEW -->
              Reviewed more than {{reviewDays}} ago by {{t.reviewed_by}} on {{t.actual_reviewed_date}}.
            </span>
            <span v-else>
              Reviewed by {{t.reviewed_by}} on {{t.actual_reviewed_date}}.
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
            {{t.date_discovered != '' ? t.date_discovered : ''}}
          </div>
          <div>
            {{t.deferral_date != '' ? t.deferral_date : '___  ____  ___'}}({{t.deferral_reason}})
          </div>
          <div>
            {{t.completion_date != '' ? t.completion_date : '___  ____  ___'}}
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
import moment from 'moment';
import { mapActions, mapGetters } from 'vuex'
import { db } from '../db.js'

const wnsRef = db.collection('wns');

export default {
  name: 'HelloWorld',
  data: function() {
      return {
        locationFilter: "",
        equipmentFilter: "",
        statusFilter: [],
        //selected_work_centers: [],
        priorityFilter: [],
        priorityOptions: [1,2,3,4],
        showMenu: true,
        reviewDays: 90,
        moment
      }
  },
  mounted: async function() {
      // This is necessary to actually make the bind happen in the store.
      // Not documented in Vuexfire. Obvious once it's here. I'm tired, but i knew this is what I was trying to do.
      await this.$store.dispatch('bindWC');
  },
  computed: {
    // Used to determine if a file has been loaded. Prevents showing an empty table.
    ...mapGetters(['wns']),
    awn: function() {
        return this.$store.state.awn;
    },
    // selected_work_centers: function() {
    //     return this.$store.state.selected_work_centers;
    // },
    selected_work_centers: {
        get() {
            return this.$store.state.selected_work_centers;
        },
        set(e) {
            this.$store.dispatch('rememberSelectedWorkCenters', e);
        }
    },
    work_centers: function() {
        return this.$store.state.work_centers;
    },
    awnLoaded: function() {
      return !this.wns.length > 0;
    },
    statusOptions: function() {
      const statuses = this.wns.map((e) => e.status);
      return statuses.filter((value, index, self) => self.indexOf(value) === index);
    },
    // Filters the table based on all available inputs.
    filteredWN: function() {
      let output = this.wns.map((e) => e);
      output = output.filter((e) => {
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
          return this.priorityFilter.includes(e.priority_code);
        })
      }
      
      return output;
    }
  },
  methods: {
    ...mapActions([
        'bindWC',
        'rememberWN',
        'rememberSelectedWorkCenters',
    ]),
    search: async function() {
        // Firestore 'in' operator is limited to an array of 10.
        if (this.selected_work_centers.length <= 10) {
            this.$store.dispatch('clearAWN');
            const snapshot = await wnsRef.where('work_center', 'in', this.selected_work_centers).get();
            if (snapshot.empty) {
                console.log('Nothing found.');
                return;
            }

            snapshot.forEach(doc => {
                this.$store.dispatch('rememberWN', {...doc.data()})
            })
        }
    },
    searchHotJobs: async function() {
        this.$store.dispatch('clearAWN');
        const snapshot = await wnsRef.where('hot_job', '==', true).get();
        if (snapshot.empty) {
            console.log('Nothing found.');
            return;
        }

        snapshot.forEach(doc => {
            this.$store.dispatch('rememberWN', {...doc.data()})
            this.selectAll();
        })
    },
    selectAll: function() {
        // this.selected_work_centers = this.work_centers.map((e) => e.id);
        this.$store.dispatch('rememberSelectedWorkCenters', this.work_centers.map((e) => e.id));
    },
    unselectAll: function() {
        // this.selected_work_centers = [];
        this.$store.dispatch('rememberSelectedWorkCenters', []);
    },
    unselectAllStatuses: function() {
        this.statusFilter = [];
    },
    unselectPriorities: function() {
        this.priorityFilter = [];
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
