<template>
  <div>
    <b-overlay :show="overlay" spinner-small>
      <h6>Asignar {{ departamento }}</h6>
      <span class="floatme">
        <b-form-select
          v-model="selected"
          :options="empleadosSelect"
          size="sm"
          class="mt-3"
          @change="updateEmpleado"
        ></b-form-select>
      </span>
      <span class="floatme mt-2">
        <inventario-InsumoAsignar
          :datos="item"
          :empleado="selected"
          :departamento="departamento"
        />
      </span>
    </b-overlay>
  </div>
</template>

<script>
import axios from 'axios'
import mixin from '~/mixins/mixins.js'

export default {
  data() {
    return {
      overlay: true,
      selected: null,
    }
  },

  computed: {
    empleadosSelect() {
      return this.options.map((item) => {
        return { value: item._id, text: item.nombre }
      })
    },
  },

  methods: {
    updateEmpleado() {
      // this.overlay = true

      const data = new URLSearchParams()
      data.set('id_orden', this.item.id_orden)
      data.set('id_ordenes_productos', this.item._id)
      data.set('id_empleado', this.selected)
      data.set('departamento', this.departamento)

      console.log('datos a guardar')
      console.dir(data)

      axios
        .post(`${this.$config.API}/lotes/empleados/reasignar`, data)
        .then((res) => {
          this.$nuxt.$emit('reloadPorcentaje')
          // this.$store.dispatch('produccion/getPorcentaje2', this.item.id_orden)
          // console.log('resultado empleadoAsignar', res.data)
        })
    },
  },

  mounted() {
    axios
      .get(
        `${this.$config.API}/empleado/asignado/${this.prepareDep(
          this.departamento
        )}/${this.item.id_orden}/${this.item._id}`
      )
      .then((res) => {
        if (!res.data.id_empleado.length) {
          this.selected = 0
        } else {
          this.selected = res.data.id_empleado[0].id_empleado
          this.overlay = false
        }
        this.overlay = false
      })
      .catch((err) => {
        console.log('ERROR!!!!', err)
      })

    this.empleadosSelect.push({ value: '0', text: 'SIN ASIGNAR' })
  },

  mixins: [mixin],

  props: ['item', 'departamento', 'options'],
}
</script>
