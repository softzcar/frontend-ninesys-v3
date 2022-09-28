<template>
  <div>
    <b-overlay :show="overlay" spinner-small>
      <pre>
        {{ $props.lote }}
      </pre>
      <span class="floatme">
        <label>Empleado</label>
        <b-form-select
          v-model="selected"
          :options="empleadosSelect"
          size="md"
          class="mt-3"
          @change="updateEmpleado"
        ></b-form-select>
      </span>

      <span class="floatme mt-3">
        <label>Cantidad</label>
        <b-input
          v-model="cantidad"
          size="md"
          style="width: 85px"
          type="number"
          @change="changeCantidad"
        />
      </span>

      <span class="floatme" style="margin-top: 47px">
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
      cantidad: 0
    }
  },

  computed: {
    idLoteDetalles() {
      let cantidadActual = 0

      if (!this.selected) {
        cantidadActual = this.item.cantidad
      } else {
        let tmp = this.lote.filter(
          (dato) => dato.id_ordenes_productos === this.item._id
        )
        // cantidadActual = tmp.unidades_solicitadas
        cantidadActual = tmp[0]._id
      }
      return cantidadActual
    },

    empleadosSelect() {
      return this.options.map((item) => {
        return { value: item._id, text: item.nombre }
      })
    },
  },

  methods: {
    changeCantidad() {
      this.overlay = true
      const data = new URLSearchParams()
      data.set('cantidad', this.cantidad)
      data.set('id', this.idLoteDetalles)

      axios
        .post(`${this.$config.API}/lotes/update/cantidad`, data)
        .then((res) => {
          console.log('vamos a recargar lotes y porductos');
          this.$emit('reload', true)
          this.overlay = false
        })
        .catch((err) => {
          this.$fire({
            title: 'Error',
            type: 'error',
            html: `Error al actaulizar la cantidad del lote: ${err}`,
          })
        })
    },

    updateEmpleado() {
      // this.overlay = true
      console.log('item en reasdingar empleado', this.item)
      const data = new URLSearchParams()
      data.set('id_orden', this.item.id_orden)
      data.set('id_ordenes_productos', this.item._id)
      data.set('id_empleado', this.selected)
      data.set('id_woo', this.item.id_woo)
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
    // this.cantidad = this.item.cantidad
    let cantidadActual = 0

        if (!this.selected) {
          cantidadActual = this.item.cantidad
        } else {
          let tmp = this.lote.filter(
            (dato) => dato.id_ordenes_productos === this.item._id
          )
          // cantidadActual = tmp.unidades_solicitadas
          cantidadActual = tmp[0].unidades_solicitadas
        }
        this.cantidad = cantidadActual

    axios
      .get(
        `${this.$config.API}/empleado/asignado/${this.prepareDep(
          this.departamento
        )}/${this.item.id_orden}/${this.item._id}`
      )
      .then((res) => {
        if (!res.data.id_empleado.length) {
          this.selected = 0
          this.cantidad = this.item.cantidad
        } else {
          this.selected = res.data.id_empleado[0].id_empleado

          let tmp = this.lote.filter(
            (dato) => dato.id_ordenes_productos === this.item._id
          )
          // cantidadActual = tmp.unidades_solicitadas
          this.cantidad = tmp[0].unidades_solicitadas
          this.overlay = false
        }
        this.overlay = false
      })
      .catch((err) => {
        console.log('ERROR!!!!', err)
        this.overlay = false
      })

    this.empleadosSelect.push({ value: '0', text: 'SIN ASIGNAR' })
  },

  mixins: [mixin],

  props: ['item', 'reload', 'departamento', 'options', 'lote'],
}
</script>
