import axios from 'axios'

export const state = () => ({
  ordenesActivas: [{ msg: 'Aqui las ordenes activas' }],
  ordenNuevaTelas: [],
})

export const actions = {
  async getOrdenesActivas({ commit }) {
    await axios.get(`${this.$config.API}/table/ordenes-activas`).then((res) => {
      commit('setOrdenesActivas', res.data)
    })
  },
}

export const getters = {
  dynOrdenesActivas(state) {
    return state.ordenesActivas
  },
}

export const mutations = {
  setOrdenesActivas(state, ordenes) {
    state.ordenesActivas = ordenes
  },
}
