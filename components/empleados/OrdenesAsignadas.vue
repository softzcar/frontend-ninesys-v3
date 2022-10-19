<template>
  <div>
    <pre>
      {{ ordersList }}
      {{ ordenes }}
    </pre>
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
                  >{{ row.item.orden }}</b-button
                >
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
                    <!-- ok {{ row.item.id_lotes_detalles }} -->
                    <!-- <b-button
                      variant="success"
                      @click="terminarTrabajo(row.item)"
                      >TERMINAR</b-button
                    > -->
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

                <!-- <pre>
                  {{ filterOrder(row.item.orden) }}
                </pre> -->
                <!-- <ul>
                  <li v-for="(value, key) in row.item" :key="key">
                    {{ key }}: {{ value }}
                  </li>
                </ul> -->
              </b-card>
            </template>
          </b-table>

          <!-- <b-table small striped stacked :items="ordenes" :fields="fields">
            <template #cell(id_orden)="row">
              <h4 class="mb-4">
                {{ row.item.id_orden }}
                <small style="font-size: 75%"
                  >{{ row.item.producto }} | Talla {{ row.item.talla }}</small
                >
              </h4>
              <b-button size="xl" @click="row.toggleDetails">
                {{ row.detailsShowing ? '🔙' : '👀' }}
              </b-button>
              <b-button
                block
                variant="primary"
                @click="terminarTrabajo(row.item)"
                >TERMINAR</b-button
              >
              {{ maquetarPrioridad(row.item.prioridad) }}
            </template>

            <template #row-details="row">
              <b-card>
                <ul>
                  <li v-for="(value, key) in row.item" :key="key">
                    {{ key }}: {{ value }}
                  </li>
                </ul>
              </b-card>
            </template>
            <template #cell(id_lotes_detalles)="data">
              <b-button variant="success" @click="terminarTrabajo(data.item)"
                >TERMINAR</b-button
              >
            </template>
          </b-table> -->
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
      overlay: true,
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
        this.getOrdenesAsignadas().then(() => {
          this.items = this.ordenes
          this.overlay = false
          this.reload = false
        })
      }
    },
  },

  computed: {
    ordersList() {
      if (!Array.isArray(this.pagos)) {
        this.pagos = []
      }

      let pagados = this.pagos.map((el) => {
        return {
          id_lotes_detalles: el,
        }
      })
      console.log('pagados', pagados)

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
          }
        })
        .reduce((acc, item) => {
          if (acc.filter((row) => row.orden === item.orden).length === 0) {
            acc.push(item)
          }
          return acc
        }, [])

      this.pagos.forEach((pago) => {
        tmp.forEach((item, index, object) => {
          if (item.id_lote_detalles == pago.id_lote_detalles) {
            console.log('eliminar ', pago)
            object.splice(index)
          }
        })
      })
      return tmp
    },

    ordenesSize() {
      const size = parseInt(this.ordenes.length)
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
          this.pagos = resp.data.pagos[0]
          this.overlay = false
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
        this.overlay = false
      })
    },
  },

  mounted() {
    this.reloadMe()
  },

  props: ['emp'],
}
</script>
