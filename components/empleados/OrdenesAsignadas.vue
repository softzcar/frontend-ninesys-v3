<template>
  <div>
    <b-overlay :show="overlay" spinner-small>
      <div v-if="ordenesSize < 1">
        <b-container>
          <b-row>
            <b-col>
              <b-alert :show="showAlert" class="text-center" variant="warning">
                <p>No hay ordenes para mostrar</p>
              </b-alert>
            </b-col>
          </b-row>
        </b-container>
      </div>

      <div v-else>
        <b-container>
          <b-table small stacked :items="ordersList" :fields="fields2">
            <template #cell(id_lotes_detalles)="row">
              terminemos el lote {{ row.item.id_lotes_detalles }}
            </template>
            <template #cell(orden)="row">
              <div style="width: 164%">
                <b-button
                  :variant="row.item.variant"
                  block
                  size="xl"
                  @click="row.toggleDetails"
                  >{{ row.item.orden }}
                </b-button>
              </div>
            </template>

            <template #row-details="row">
              <b-card>
                <b-table
                  small
                  striped
                  stacked
                  responsive
                  :items="filterOrder(row.item.orden)"
                  :fields="fields"
                >
                  <template #cell(departamento)="row">
                    {{ row.item.departamento }}
                  </template>
                  <template #cell(id_lotes_detalles)="row">
                    <empleados-boton-terminar
                      @reload="reloadMe"
                      :item="row.item"
                    />
                  </template>
                  <template #cell(detalle)="row">
                    <empleados-ver-detalle :idorden="row.item.id_orden" />
                  </template>
                  <template #cell(id_orden)="row">
                    <h4 class="mb-4">
                      {{ row.item.id_orden }}
                      <small style="font-size: 35%"
                        >{{ row.item.producto }} | Talla
                        {{ row.item.talla }}</small
                      >
                    </h4>
                    {{ maquetarPrioridad(row.item.prioridad) }}
                  </template>
                </b-table>
              </b-card>
            </template>
          </b-table>
        </b-container>
      </div>
    </b-overlay>
  </div>
</template>

<script>
import axios from 'axios'
import { log } from 'console'
export default {
  data() {
    return {
      showAlert: true,
      ordenes: [],
      pagos: [],
      overlay: false,
      reload: false,
      fields2: [
        {
          key: 'orden',
          label: '',
          variant: '',
        },
      ],
      fields: [
        {
          key: 'departamento',
          label: '',
          tdClass: 'text-uppercase text-center font-weight-bold',
        },
        {
          key: 'producto',
          thClass: 'Porducto',
        },
        {
          key: 'unidades_solicitadas',
          label: 'Unidades',
        },

        {
          key: 'id_empleado',
          thClass: 'd-none',
          tdClass: 'd-none',
        },
        {
          key: 'talla',
          label: 'Talla',
        },
        {
          key: 'corte',
          label: 'Corte',
        },
        {
          key: 'tela',
          label: 'Tela',
        },
        {
          key: 'detalle',
          label: '',
          class: 'text-center',
        },
        {
          key: 'id_lotes_detalles',
          label: '',
          tdClass: 'text-center pt-4 pb-4',
        },
        {
          key: 'departamento',
          thClass: 'd-none',
          tdClass: 'd-none',
        },
      ],
    }
  },

  watch: {
    reload() {
      // console.log('RELOAD', val)
      if (this.reload) {
        this.reloadMe()
        /* this.getOrdenesAsignadas().then(() => {
          this.overlay = false
          this.reload = false
        }) */
      }
    },
  },

  computed: {
    ordersList() {
      if (!Array.isArray(this.pagos)) {
        this.pagos = []
      }

      let tmp = this.ordenes
        .map((item) => {
          let txtVariant
          if (parseInt(item.prioridad)) {
            txtVariant = 'danger'
          } else {
            txtVariant = 'success'
          }
          return {
            orden: item.id_orden,
            variant: txtVariant,
            terminado: item.fecha_terminado,
          }
        })
        .reduce((acc, item) => {
          console.log('item to push', item)

          if (acc.filter((row) => row.orden === item.orden).length === 0) {
            acc.push(item)
          }
          return acc
        }, [])
      // .filter((el) => el.terminado === null)

      console.log('TMP', tmp)

      return tmp
    },

    ordenesSize() {
      let size = null
      size = parseInt(this.ordenes.length)
      return size
    },
  },

  methods: {
    createArray(obj) {
      const arr = []
      arr.push(obj)
      console.log(' creata array', arr)
      return arr
    },

    filterOrder(id_orden) {
      const products = this.ordenes.filter(
        (item) => item.id_orden === id_orden && !item.fecha_terminado
      )
      return products
    },

    async getOrdenesAsignadas() {
      await axios
        .get(`${this.$config.API}/empleados/ordenes-asignadas/${this.emp}`)
        .then((resp) => {
          this.ordenes = resp.data.items
          if (resp.data.pagos[0].length) {
            this.pagos = resp.data.pagos[0]
          }
        })
    },

    maquetarPrioridad(prioridad) {
      const pri = parseInt(prioridad)
      let text = ''

      if (!pri) {
        text = ''
        this.fields[0].variant = 'success'
      } else {
        text = ''
        this.fields[0].variant = 'danger'
      }

      return text
    },

    reloadMe() {
      this.getOrdenesAsignadas().then(() => {
        this.items = this.ordenes
      })
    },
  },

  mounted() {
    this.overlay = true
    this.reloadMe()
    this.overlay = false
  },

  props: ['emp'],
}
</script>
