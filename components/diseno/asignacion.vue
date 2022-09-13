<template>
  <div>
    <b-overlay :show="overlay" spinner-small>
      <b-table
        ref="table"
        responsive
        small
        striped
        hover
        :items="dataTable.items"
        :fields="dataTable.fields"
      >
        <template #cell(id)="data">
          <linkSearch :id="data.item.id" />
        </template>
        <template #cell(imagen)="data">
          <diseno-uploadImage :id="data.item.id" />
        </template>

        <template #cell(empleado)="data">
          <diseno-reasignacionSelect
            :idorden="data.item.id"
            :idempleado="data.item.empleado"
            :options="optionsSelect"
          />
        </template>
      </b-table>
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
      empSelected: [],
      optionsSelect: [],
      size: 'md',
      title: `Abonos a la orden ${this.idorden}`,
    }
  },

  computed: {
    dataTable() {
      return this.$store.state.disenos.disenos
    },

    empleados() {
      return this.$store.state.disenos.empleados
    },
  },

  methods: {
    terminado(val) {
      let res
      if (val === '0') {
        res = 'No'
      } else {
        res = 'Si'
      }
      return res
    },
  },

  mounted() {
    this.$store.dispatch('disenos/getDisenos').then(() => {
      let tmpOptions = this.empleados
        .filter(
          (el) =>
            el.departamento === 'Diseño' || el.departamento === 'Jefe de diseño'
        )
        .map((el) => {
          return {
            value: el._id,
            text: el.username,
          }
        })
      this.optionsSelect = tmpOptions.concat({ value: 0, text: 'Sin asignar' })
      this.overlay = false
    })
  },
}
</script>
