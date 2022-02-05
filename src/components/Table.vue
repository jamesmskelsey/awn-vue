<template>
  <!-- Begin App! -->
  <div>
    <!-- Temporary text boxes for filtering -->
    <div class="text-gray-900">
      <div class="no-print">
        <div class="m-4 inline-block border rounded">
          <div class="m-4 block">
            <label v-if="showMenu" class="block my-2 text-lg"
              >Menu Visibility</label
            >
            <button
              v-on:click="() => (showMenu = !showMenu)"
              class="block border border-gray-500 rounded px-4 py-2 hover:bg-gray-200 transition"
            >
              {{ showMenu ? "Hide Menu" : "Show Menu" }}
            </button>
          </div>
        </div>
        <div v-if="showMenu" class="m-4 inline-block border rounded">
          <div class="m-4 block">
            <label class="block my-2 text-lg " for="locationFilter"
              >Location</label
            >
            <input
              class="shadow border border-gray-500 rounded p-2 focus:outline-none focus:shadow-outline"
              id="locationFilter"
              v-model="locationFilter"
              type="text"
            />
          </div>
          <div class="m-4 block">
            <label class="block my-2 text-lg" for="equipmentFilter"
              >Equipment</label
            >
            <input
              class="shadow border border-gray-500 rounded p-2 focus:outline-none focus:shadow-outline"
              id="equipmentFilter"
              v-model="equipmentFilter"
              type="text"
            />
          </div>
        </div>
        <div v-if="showMenu" class="m-4 p-2 border rounded inline-block">
          <div class="inline-block">
            <label class="block my-2 text-lg" for="priorityFilter"
              >Priority</label
            >
            <select
              class="h-32 shadow border border-gray-500 rounded p-2 focus:outline-none focus:shadow-outline"
              id="priorityFilter"
              v-model="priorityFilter"
              multiple
            >
              <option v-for="o in priorityOptions" v-bind:key="o">
                {{ o }}
              </option>
            </select>
          </div>
          <div class="inline-block">
            <button
              v-on:click="unselectPriorities"
              class="block px-2 py-2 m-1 border rounded"
            >
              Unselect All
            </button>
          </div>
        </div>
        <!-- Status Filter-->
        <div v-if="showMenu" class="m-4 p-2 border rounded inline-block">
          <div class="inline-block">
            <label class="block my-2 text-lg" for="statusFilter">Status</label>
            <select
              class="h-32 shadow border border-gray-500 rounded p-2 focus:outline-none focus:shadow-outline"
              id="statusFilter"
              v-model="statusFilter"
              multiple
            >
              <option v-for="o in statusOptions" v-bind:key="o">
                {{ o }}
              </option>
            </select>
          </div>
          <div class="inline-block">
            <button
              v-on:click="unselectAllStatuses"
              class="block px-2 py-2 m-1 border rounded"
            >
              Unselect All
            </button>
          </div>
        </div>
        <!-- Work center filter -->
        <div v-if="showMenu" class="m-4 p-2 inline-block border rounded">
          <div class="inline-block">
            <label class="block my-2 text-lg" for="work_centers"
              >Work Centers</label
            >
            <select
              class="h-32 shadow border border-gray-500 rounded p-2 focus:outline-none focus:shadow-outline"
              id="work_centers"
              v-model="selected_work_centers"
              multiple
            >
              <option v-for="o in work_centers" v-bind:key="o.wc">{{
                o.wc
              }}</option>
            </select>
          </div>
          <div class="inline-block">
            <button
              v-on:click="unselectAll"
              class="block px-2 py-2 m-1 border rounded"
            >
              Unselect All
            </button>
            <button v-on:click="selectAll" class="px-2 py-2 m-1 border rounded">
              Select All
            </button>
          </div>
        </div>
        <div v-if="showMenu" class="m-4 inline-block border rounded">
          <div class="m-4 block">
            <label class="block my-2 text-lg">Search by WC</label>
            <button
              v-if="selected_work_centers.length <= 10"
              v-on:click="search"
              class="block border border-gray-500 rounded px-4 py-2 hover:bg-gray-200 transition"
            >
              Search
            </button>
            <button
              v-else
              class="block border border-gray-500 rounded px-4 py-2 hover:bg-gray-200 transition"
            >
              Too many WC selected
            </button>
          </div>
        </div>
        <div v-if="showMenu" class="m-4 inline-block border rounded">
          <div class="m-4 block">
            <label class="block mt-2 text-lg">Show Hot Jobs</label>
            <p class="text-gray-500 mb-2 text-xs">Selects all WC</p>
            <button
              v-on:click="searchHotJobs"
              class="block border border-gray-500 rounded px-4 py-2 hover:bg-gray-200 transition"
            >
              Hot!
            </button>
          </div>
          <div class="m-4 block">
            <label class="block mt-2 text-lg">Show Commented Upon Jobs</label>
            <p class="text-gray-500 mb-2 text-xs">Selects all WC</p>
            <button
              v-on:click="searchRepoCommentJobs"
              class="block border border-gray-500 rounded px-4 py-2 hover:bg-gray-200 transition"
            >
              Commented Jobs
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- Test table for quick visual reloading -->
    <table v-if="!awnLoaded" class="min-w-full">
      <table-head />
      <tbody class="text-xs" v-if="filteredWN.length > 0">
        <table-row
          v-for="t in filteredWN"
          v-bind:key="t.jcn"
          v-bind:job="t"
          class="border-b shadow-sm mb-8"
        ></table-row>
      </tbody>
    </table>
    <div v-else class="p-5">
      <h1 class="text-5xl">There's nothing here, yet</h1>
      <h2 class="text-4xl text-red-500" v-if="this.errorMessage.length > 0">{{errorMessage}}</h2>
      <p>
        There's a few solutions. You may need to search for something. There may
        be zero results from your search.
      </p>
      <p>
        If you previously loaded a file, the data is loaded in to a local
        database.
      </p>
      <h2 class="text-2xl py-3">Getting Started</h2>
      <ol class="list-decimal list-inside px-3">
        <li>Select some Work Centers from the list.</li>
        <li>Click "Search by WC"</li>
        <li>Filter with the other options</li>
      </ol>
    </div>
  </div>
  <!-- End App -->
</template>

<script>
import moment from "moment";
import { mapActions, mapGetters } from "vuex";
import { db } from "../db.js";

import TableHead from "./TableHead.vue";
import TableRow from "./TableRow.vue";

const wnsRef = db.collection("wns");

export default {
  name: "Table",
  components: {
    TableHead,
    TableRow,
  },
  data: function() {
    return {
      locationFilter: "",
      equipmentFilter: "",
      statusFilter: [],
      //selected_work_centers: [],
      priorityFilter: [],
      priorityOptions: [1, 2, 3, 4],
      showMenu: true,
      reviewDays: 90,
      moment,
      errorMessage: "",
    };
  },
  mounted: async function() {
    // This is necessary to actually make the bind happen in the store.
    // Not documented in Vuexfire. Obvious once it's here. I'm tired, but i knew this is what I was trying to do.
    await this.$store.dispatch("bindWC");
  },
  computed: {
    // Used to determine if a file has been loaded. Prevents showing an empty table.
    ...mapGetters(["wns"]),
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
        this.$store.dispatch("rememberSelectedWorkCenters", e);
      },
    },
    work_centers: function() {
      return this.$store.state.work_centers;
    },
    awnLoaded: function() {
      return !this.wns.length > 0;
    },
    statusOptions: function() {
      const statuses = this.wns.map((e) => e.status);
      return statuses.filter(
        (value, index, self) => self.indexOf(value) === index
      );
    },
    // Filters the table based on all available inputs.
    filteredWN: function() {
      let output = this.wns.map((e) => e);
      output = output.filter((e) => {
        return this.selected_work_centers.includes(e.work_center);
      });
      if (this.locationFilter.length > 0) {
        output = output.filter((e) => {
          return (
            e.location.toLowerCase().search(this.locationFilter.toLowerCase()) >
            -1
          );
        });
      }
      if (this.equipmentFilter.length > 0) {
        output = output.filter((e) => {
          return (
            e.equipment
              .toLowerCase()
              .search(this.equipmentFilter.toLowerCase()) > -1
          );
        });
      }
      if (this.statusFilter.length > 0) {
        output = output.filter((e) => {
          return this.statusFilter.includes(e.status);
        });
      }
      if (this.priorityFilter.length > 0) {
        output = output.filter((e) => {
          return this.priorityFilter.includes(e.priority_code);
        });
      }

      return output;
    },
  },
  methods: {
    ...mapActions(["bindWC", "rememberWN", "rememberSelectedWorkCenters"]),
    search: async function() {
      // Firestore 'in' operator is limited to an array of 10.
      if (this.selected_work_centers.length <= 10 && this.selected_work_centers.length > 0) {
        this.errorMessage = "";
        this.$store.dispatch("clearAWN");
        const snapshot = await wnsRef
          .where("work_center", "in", this.selected_work_centers)
          .get();
        if (snapshot.empty) {
          console.info("Nothing found.");
          return;
        }

        snapshot.forEach((doc) => {
          this.$store.dispatch("rememberWN", { ...doc.data() });
        });
      } else {
        this.errorMessage = "We can't handle more than 10 work centers, and you must select at least 1."
      }
    },
    searchHotJobs: async function() {
      this.$store.dispatch("clearAWN");
      const snapshot = await wnsRef.where("hot_job", "==", true).get();
      if (snapshot.empty) {
        console.info("Nothing found.");
        return;
      }
      snapshot.forEach((doc) => {
        this.$store.dispatch("rememberWN", { ...doc.data() });
        this.selectAll();
      });
    },
    searchRepoCommentJobs: async function() {
      // Repo means "Repair Officer" in this context.
      this.$store.dispatch("clearAWN");
      const snapshot = await wnsRef.where("repo_comments", ">", "").get();
      if (snapshot.empty) {
        console.info("Nothing found.");
        return;
      }

      snapshot.forEach((doc) => {
        this.$store.dispatch("rememberWN", { ...doc.data() });
        this.selectAll();
      });
    },
    selectAll: function() {
      // this.selected_work_centers = this.work_centers.map((e) => e.id);
      this.$store.dispatch(
        "rememberSelectedWorkCenters",
        this.work_centers.map((e) => e.id)
      );
    },
    unselectAll: function() {
      this.$store.dispatch("rememberSelectedWorkCenters", []);
    },
    unselectAllStatuses: function() {
      this.statusFilter = [];
    },
    unselectPriorities: function() {
      this.priorityFilter = [];
    },
  },
};
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
