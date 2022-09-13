<template>
  <div>
    <b-alert v-if="status === 'terminado'" show variant="success"
      >TERMINADA</b-alert
    >
    <b-overlay :show="overlay" spinner-small>
      <div>
        <b-progress
          :max="max"
          height="2rem"
          variant="success"
          style="width: 290px !important"
        >
          <b-progress-bar :value="value">
            <span
              ><strong>{{ value }}%</strong></span
            >
          </b-progress-bar>
        </b-progress>
      </div>
      <div>
        <div class="floatme">
          <b-form-select
            v-model="selected"
            :options="options"
            size="sm"
            class="mt-3"
            style="width: 240px"
            @change="setPaso"
          ></b-form-select>
        </div>

        <div class="floatme" style="margin-top: 12px">
          <produccion-asignar :reload="reload" :id="data.orden" />
        </div>
      </div>
    </b-overlay>
  </div>
  <!-- <pre style="width: 300px">
      {{ data }}
    </pre> -->
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      status: null,
      responseData: null,
      reload: false,
      overlay: true,
      value: this.$store.state.produccion.dataPorcentaje.porcentaje,
      max: 100,
      paso: this.$store.state.produccion.dataPorcentaje.paso,
      selected: this.$store.state.produccion.dataPorcentaje.paso,
      options: [
        { value: 'sin_asignar', text: 'Seleccione una opción' },
        { value: 'corte', text: 'Corte' },
        { value: 'estampado', text: 'Estampado' },
        { value: 'impresion', text: 'Impresión' },
        { value: 'confeccion', text: 'Confección' },
        { value: 'revision', text: 'Revisión' },
      ],
    }
  },

  methods: {
    clickedSomething(val) {
      console.log(`clickedSomething`, val)
    },
    setPaso(val) {
      this.overlay = true
      const data = new URLSearchParams()
      data.set('paso', val)
      data.set('id_orden', this.data.orden)

      axios
        .post(`${this.$config.API}/produccion/update/paso`, data)
        .then((res) => {
          if (res.data.nodata) {
            if (this.selected != 'sin_asignar') {
              this.$fire({
                type: 'info',
                title: 'Error en asignación',
                html: `El paso '${this.selected}' no está asignado a ningún empeado`,
              }).then(() => {
                this.selected = 'sin_asignar'
              })
            } else {
              this.value = 0
            }
          } else {
            this.getPorcentaje()
          }
          this.overlay = false
        })
        .catch((err) => {
          this.$fire({
            type: 'error',
            title: 'Error',
            html: `No se pudo actualizar os datos: ${err}`,
          })
          this.overlay = false
        })
    },
    pasoActual() {
      switch (this.data.paso) {
        case 'comercializacion':
          this.paso = 'Comercialización'
          break

        case 'jefe_diseno':
          this.paso = 'Jefe de Diseño'
          break

        case 'diseno':
          this.paso = 'Diseño'
          break

        case 'corte':
          this.paso = 'Corte'
          break

        case 'estampado':
          this.departamento = 'Estampado'
          break

        case 'impresion':
          this.departamento = 'Impresión'
          break

        case 'confeccion':
          this.departamento = 'Confeción'
          break

        case 'revision':
          this.departamento = 'Revisión'
          break

        default:
          this.departamento = this.data.paso
          break
      }
    },

    reloadData() {
      this.$nuxt.$emit('loadOrdersProduction')
    },

    async getPorcentaje() {
      this.overlay = true
      await axios
        .get(`${this.$config.API}/produccion/progressbar/${this.data.orden}`)
        .then((res) => {
          this.responseData = res.data
          this.value = res.data.porcentaje
          this.paso = res.data.paso
          this.selected = res.data.paso
          this.status = res.data.status
          this.pasoActual()
          this.overlay = false

          if (this.status != 'activa' || this.status != 'pausada') {
            this.$nuxt.$emit('loadOrdersProduction')
          }
        })
        .catch((err) => {
          console.error(
            'Error al obtener los datos del servidor para prgressBar',
            err
          )
          this.overlay = false
        })
    },
  },

  mounted() {
    this.$nuxt.$on('reloadPorcentaje', () => {
      this.overlay = true
      this.getPorcentaje().then(() => (this.overlay = false))
    })
    /* this.$store
      .dispatch('produccion/getPorcentaje2', this.data.orden)
      .then(() => {
        this.pasoActual()
        this.overlay = false
      }) */
    this.getPorcentaje().then(() => {
      let x = this.$store.state.produccion.dataPorcentaje
    })
  },

  props: ['data'],
}
</script>

<style scoped>
.floatme {
  float: left;
  margin-right: 4px;
}
</style>
