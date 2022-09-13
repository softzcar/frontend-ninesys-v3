<template>
  <div>
    <div v-if="!access">
      <login-form />
    </div>

    <div v-else>
      <menus-MenuLoader />
      <div v-if="dataUser.departamento === 'Administración'">
        <b-overlay :show="overlay" spinner-small>
          <b-container fluid v-if="dataUser.departamento === 'Administración'">
            <b-row>
              <b-col>
                <h2 class="mb-4">{{ titulo }}</h2>
              </b-col>
            </b-row>
            <b-row>
              <b-col>
                <b-table
                  responsive
                  :fields="dataTable.fields"
                  :items="dataTable.items"
                >
                  <template #cell(moment)="data">
                    <!-- <pre>
                      {{ data.item }}
                    </pre> -->
                    <admin-EntradaSalida
                      :moment="data.moment"
                      :registros="dataTable.diarias"
                    />
                  </template>
                </b-table>
              </b-col>
            </b-row>
          </b-container>
        </b-overlay>
      </div>

      <div v-else><accessDenied /></div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import axios from 'axios'

export default {
  data() {
    return {
      titulo: 'Asistencia de empleados',
      overlay: true,
      dataTable: [],
    }
  },

  computed: {
    ...mapState('login', ['dataUser', 'access']),
  },

  methods: {
    async getTablaAsistencias() {
      await axios.get(`${this.$config.API}/asistencias/tabla`).then((resp) => {
        this.dataTable = resp.data
        this.overlay = false
      })
    },
  },

  mounted() {
    this.getTablaAsistencias().then(() => {
      this.overlay = false
    })
  },
}
</script>
