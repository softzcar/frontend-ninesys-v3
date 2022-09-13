export const state = () => ({
  dataUser: [],
  access: false
})

export const mutations = {
  setDataUser(state, data) {
    state.dataUser = data
  },
  setAccess(state, value) {
    state.access = value
  },
}
