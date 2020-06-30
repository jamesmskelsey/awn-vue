import Vue from 'vue'
import Vuex from 'vuex'
import { vuexfireMutations, firestoreAction } from 'vuexfire'
import { db } from '../db.js'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    wns: [],
    job: {},
    awn: [],
    selected_work_centers: ["AS01", "AS02"],
    work_centers: [],
    count: 0,
  },
  mutations: {
      ...vuexfireMutations,
        addAWN (state, awn) {
            // This adds an ARRAY of Work Notificationis to state.awn
            state.awn = [...awn]
        },
        addWN (state, wn) {
            // this adds a single work notification to state.awn
            state.wns.push(wn)
        },
        clearAWN (state) {
            // clears out the awn array to make way for new search results.
            state.wns = []
        },
        setSelectedWorkCenters(state, selected) {
            state.selected_work_centers = [...selected]
        }
  },
  actions: {
        
        // This binds ALL of the jobs that are in the database at once.
        bindWC: firestoreAction(async function({bindFirestoreRef}) {
            console.log("I'm binding the work centers!");
            await bindFirestoreRef('work_centers', db.collection('work_centers'), {wait: true})
        }),
        bindJob: firestoreAction(async function({bindFirestoreRef}, payload) {
            console.log("I'm binding a single job!", payload);
            await bindFirestoreRef('job', db.collection('wns').doc(payload.id.toUpperCase()), {wait: true})
        }),
        clearAWN ({commit}) {
            commit('clearAWN')
        },
        // In this case, "awn" stands for "all work notifications"
        rememberWN ({commit}, wn) {
            commit('addWN', wn);
        },
        // this function receives an array of jobs that it iterates across and sends the updates to the database via saveWN
        addAWN ({dispatch, commit}, awn) {
            commit('addAWN', awn)
            awn.forEach(e => dispatch('saveWN', e));
        },
        // add WN to firestore... via async
        async saveWN ({commit}, wn) {
            // going to use 'await wnRef.set({...wn}, {merge: true})
            const wnRef = db.collection('wns').doc(wn.id)
            console.log(commit);
            return await wnRef.set({...wn}, {merge: true})
        },
        rememberSelectedWorkCenters({commit}, selected) {
            commit('setSelectedWorkCenters', selected)
        }
  },
  getters: {
        wns(state) {
            return state.wns
        }
  },
  modules: {
  }
})
