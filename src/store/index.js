import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    awn: [],
    selected_work_centers: [],
    work_centers: [],
    count: 42,
  },
  mutations: {
      increment (state) {
          state.count++
      },
      addAWN (state, awn) {
            // Dispatch with the result array. This adds all the AWNs to the awn array in vuex...
            // And adds the full list of work centers to the list
            // And selects all of the available work centers
          state.awn = [...awn]
          state.awn.forEach((e) => {if (!state.work_centers.includes(e.work_center)) { state.work_centers.push(e.work_center)}});
          state.selected_work_centers = state.work_centers.map(i => i);
      }
  },
  actions: {
      increment (context) {
          context.commit('increment')
      },
      addAWN ({commit}, awn) {
        commit('addAWN', awn)
      }
  },
  modules: {
  }
})
