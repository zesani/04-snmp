import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
export default new Vuex.Store({
  strict: true,
  plugins: [],
  modules: {},
  state: {
    interfaces: []
  },
  getters: {
    interfaces: state => state.interfaces
  },
  mutations: {
    setInterfaces (state, payload) {
      console.log('hello')
    }
  },
  actions: {
    setInterfaces ({commit}, payload) {
      commit('setInterfaces', payload)
    }
  }
})
