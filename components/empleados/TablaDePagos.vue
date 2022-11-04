<template>
  <div>
    <h1>Tabla de trabajos</h1>
    <b-overlay :show="overlay" spinner-small>
      <b-tabs content-class="mt-3">
        <b-tab title="Pendientes" active>
          <b-table
            responsive
            small
            striped
            hover
            :items="trabajosPendientes()"
            :fields="fields"
          >
          </b-table>
        </b-tab>

        <b-tab title="Terminados">
          <b-table
            responsive
            small
            striped
            hover
            :items="trabajosTerminados()"
            :fields="fields"
          >
          </b-table>
        </b-tab>
      </b-tabs>
    </b-overlay>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      overlay: true,
      ordenes: [],
      fields: [
        {
          key: 'id_orden',
          label: 'ORDEN',
          class: 'text-center',
        },
        {
          key: 'producto',
          label: 'PRODUCTO',
        },
        {
          key: 'unidades_solicitadas',
          label: 'CANIDAD',
          class: 'text-center',
        },
      ],
    }
  },

  computed: {},

  methods: {
    trabajosTerminados() {
      return this.ordenes.filter((el) => el.fecha_terminado != null)
    },
    trabajosPendientes() {
      return this.ordenes.filter((el) => el.fecha_terminado === null)
    },
    async getOrdenesAsignadas() {
      await axios
        .get(`${this.$config.API}/reportes/resumen/empleados/${this.emp}`)
        .then((resp) => {
          this.ordenes = resp.data.ordenes
          this.overlay = false
        })
    },
  },

  mounted() {
    this.getOrdenesAsignadas()
  },

  props: ['emp'],
}
</script>
