import Vue from "vue";
import Vuex from "vuex";
// https://vuefire.vuejs.org/vuexfire/
import { vuexfireMutations, firestoreAction } from "vuexfire";
import { db } from "../db.js";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    wns: [],
    job: {},
    awn: [],
    selected_work_centers: [],
    work_centers: [],
    count: 0,
  },
  mutations: {
    ...vuexfireMutations,
    addAWN(state, awn) {
      // This adds an ARRAY of Work Notifications to state.awn
      state.awn = [...awn];
    },
    addWN(state, wn) {
      // this adds a single work notification to state.awn
      state.wns.push(wn);
    },
    clearAWN(state) {
      // clears out the awn array to make way for new search results.
      state.wns = [];
    },
    setSelectedWorkCenters(state, selected) {
      // Allows for multiple work centers to be selected.
      state.selected_work_centers = [...selected];
    },
  },
  actions: {
    // This binds ALL of the jobs that are in the database at once.
    bindWC: firestoreAction(async function({ bindFirestoreRef }) {
      await bindFirestoreRef("work_centers", db.collection("work_centers"), {
        wait: true,
      });
    }),
    // This binds a single job, for looking at the detail page.
    bindJob: firestoreAction(async function({ bindFirestoreRef }, payload) {
      await bindFirestoreRef(
        "job",
        db.collection("wns").doc(payload.id.toUpperCase()),
        { wait: true }
      );
    }),
    // In this case, "awn" stands for "all work notifications"
    clearAWN({ commit }) {
      commit("clearAWN");
    },
    rememberWN({ commit }, wn) {
      commit("addWN", wn);
    },
    // this function receives an array of jobs that it iterates across and sends the updates to the database via saveWN
    addAWN({ dispatch, commit }, awn) {
      commit("addAWN", awn);
      awn.forEach((e) => dispatch("saveWN", e));
    },
    // add WN to firestore... via async
    async saveWN(_, wn) {
      // going to use 'await wnRef.set({...wn}, {merge: true})
      // Which allows me to overwrite jobs that already exist, but
      // now the user is uploading new data
      const wnRef = db.collection("wns").doc(wn.id);
      return await wnRef.set({ ...wn }, { merge: true });
    },
    rememberSelectedWorkCenters({ commit }, selected) {
      commit("setSelectedWorkCenters", selected);
    },
  },
  getters: {
    wns(state) {
      return state.wns;
    },
  },
  modules: {},
});
