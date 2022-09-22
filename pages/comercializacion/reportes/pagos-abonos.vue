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
          dataUser.departamento === 'Administración'
        "
      >
        <b-container v-if="this.dataUser.departamento === 'Comercialización'">
          <b-row>
            <b-col>
              <h1 class="mb-4">{{ titulo }}</h1>
            </b-col>
          </b-row>

          <b-row>
            <b-col>
              <b-table :items="resumen"></b-table>
              <h2>Total pagos semana ${{ totalPagos}}</h2>
              <h2>Total descuentos semana ${{ totalDescuentos}}</h2>
            </b-col>
          </b-row>

          <b-row>
            <b-col>
              <b-overlay :show="overlay" spinner-small>
                <b-table responsive small :fields="campos" :items="ordenes">
                  <template #cell(_id)="data">
                    <linkSearch :id="data.item._id" />
                  </template>

                  <template #cell(vinculada)="data">
                    <admin-detalle-pagos :idorden="data.item._id" />
                  </template>
                </b-table>
              </b-overlay>
            </b-col>
          </b-row>
        </b-container>
      </div>

      <div v-else>
        <accessDenied />
      </div>
    </div>
    <pre>
        RESUMEN::: {{ resumen }}
        <hr />
        {{ pagos }}
        <hr />
        {{ ordenes }}
      </pre>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import axios from 'axios'
import mixin from '~/mixins/mixins.js'

export default {
  mixins: [mixin],

  data() {
    return {
      overlay: true,
      titulo: 'Pagos y Abonos',
      pagos: [],
      campos: [
        {
          key: '_id',
          label: 'Orden',
        },
        {
          key: 'status',
          label: 'Estatus',
        },
        {
          key: 'cliente_nombre',
          label: 'Cliente',
        },
        {
          key: 'vinculada',
          label: 'Detalles',
        },
      ],
      ordenes: [],
    }
  },

  computed: {
    ...mapState('login', ['dataUser', 'access']),

    totalPagos() {
      const totPagos = this.pagos.map((item) => {
        let abono = parseFloat(item.abono)
        return abono
      }).reduce((acum, curr) => {
        return acum + curr
      }, 0)

      return totPagos
    },
    
    totalDescuentos() {
      const totPagos = this.pagos.map((item) => {
        let descuento = parseFloat(item.descuento)
        return descuento
      }).reduce((acum, curr) => {
        return acum + curr
      }, 0)

      return totPagos
    },
  },

  methods: {
    filterPagos(id_orden) {
      let filtered = this.pagos.filter(item => item.id_orden == id_orden)
      return filtered
    },

    async getOrdenes() {
      console.log('vamos a cargar las ordenes')
      this.overlay = true
      await axios
        .get(`${this.$config.API}/comercializacion/ordenes/reporte`)
        .then((resp) => {
          this.ordenes = resp.data.items
          this.overlay = false
        })
    },

    async getPagos() {
      console.log('vamos a cargar las ordenes')
      this.overlay = true
      await axios
        .get(`${this.$config.API}/comercializacion/reportes/pagos-abonos`)
        .then((resp) => {
          this.pagos = resp.data.items
          this.overlay = false
        })
    },
  },

  mounted() {
    this.getOrdenes()
    this.getPagos()
  },
}
</script>
