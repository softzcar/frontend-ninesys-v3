<template>
  <div>
    <div v-if="!access">
      <login-form />
    </div>

    <div v-else>
      <menus-MenuLoader />
      <div
        v-if="
          dataUser.departamento === 'Comercialización' ||
          dataUser.departamento === 'Jefe de diseño' ||
          dataUser.departamento === 'Diseño' ||
          dataUser.departamento === 'Producción' ||
          dataUser.departamento === 'Administración'
        "
      >
        <b-container>
          <b-row class="text-center vh-100" style="margin-top:-8rem" align-v="center">
            <b-col>
              <h1>ninesys 3.2</h1>
              <em>Sistema de contro de procesos</em>
            </b-col>
          </b-row>
        </b-container>
      </div>

      <div v-else>
        <accessDenied />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      response: [],
      m: null,
    }
  },
  computed: {
    ...mapState('login', ['access', 'dataUser']),
  },
}
</script>
