export const state = () => ({
  dataUser: [],
  access: false,
})

export const mutations = {
  setDataUser(state, data) {
    state.dataUser = data
  },
  logout(state) {
    state.access = false
    state.dataUser = []
  },
  setAccess(state, value) {
    state.access = value
  },
}
