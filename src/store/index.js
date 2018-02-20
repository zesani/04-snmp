import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
export default new Vuex.Store({
  strict: true,
  plugins: [],
  modules: {},
  state: {
    test: 'ss'
  },
  getters: {
    test: state => state.test
  },
  mutations: {},
  actions: {}
})
