<template>
  <div>
    <loading :show="loading.show" :text="loading.text" />
    <b-container fluid>
      <b-row>
        <b-col>
          <h2>Ordenes en curso</h2>
          <!-- <pre>
            {{ ordenesActivas.items }}
          </pre> -->
        </b-col>
      </b-row>

      <b-row>
        <b-col>
          <b-table
            ref="table"
            responsive
            small
            striped
            hover
            :items="ordenesActivas.items"
            :fields="ordenesActivas.fields"
          >
            <template #cell(orden)="data">
              <linkSearch :id="data.item.orden" />
            </template>

            <template #cell(fecha_inicio)="data">
              {{ formatDate(data.item.fecha_inicio) }}
            </template>

            <template #cell(fecha_entrega)="data">
              {{ formatDate(data.item.fecha_entrega) }}
            </template>

            <template #cell(acc)="data">
              <div style="float: left; margin-right: 6px">
                <comercio-editarProductos @reload="loadOrders()" :item="data.item" />
              </div>
              <div style="float: left; margin-right: 6px">
                <ordenes-editar :data="data.item" />
              </div>
              <div style="float: left; margin-right: 6px">
                <ordenes-abono :idorden="data.item.orden" />
              </div>
            </template>
          </b-table>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import axios from 'axios'
import { mapState, mapActions, mapGetters } from 'vuex'
import mixin from '~/mixins/mixins.js'

export default {
  data() {
    return {
      loading: {
        show: true,
        text: 'Cargando ordenes activas...',
      },
    }
  },

  methods: {
    ...mapActions('comerce', ['getOrdenesActivas']),
    loadOrders() {
      this.overlay = true
      this.getOrdenesActivas().then(() => (this.loading.show = false))
    }
  },

  computed: {
    misOrdenes() {
      return this.ordenesActivas
    },
    ...mapState('comerce', ['ordenesActivas', 'hola']),
    ...mapGetters('comerce', ['dynOrdenesActivas']),
    ...mapState('login', ['dataUser']),
  },

  mounted() {
    this.getOrdenesActivas().then(() => (this.loading.show = false))
    // this.loadOrders()
  },

  mixins: [mixin],
}
</script>
