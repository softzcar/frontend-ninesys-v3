<template>
  <b-container fluid>
    <pre>
      {{ ordersList }}
      <hr>
      {{ ordenes }}
    </pre>
    <!-- TABLE ORDERS  -->
    <!-- <b-table :items="ordersList" small striped stacked> </b-table> -->

    <!-- Main table element -->
    <b-table :items="ordenes" :fields="fields" small striped stacked>
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
        <b-button variant="success" @click="terminarTrabajo(row.item)"
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
    </b-table>
  </b-container>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      showAlert: true,
      ordenes: [],
      overlay: true,
      items: [
        {
          isActive: true,
          age: 40,
          name: { first: 'Dickerson', last: 'Macdonald' },
        },
        { isActive: false, age: 21, name: { first: 'Larsen', last: 'Shaw' } },
        {
          isActive: false,
          age: 9,
          name: { first: 'Mini', last: 'Navarro' },
          _rowVariant: 'success',
        },
        { isActive: false, age: 89, name: { first: 'Geneva', last: 'Wilson' } },
        { isActive: true, age: 38, name: { first: 'Jami', last: 'Carney' } },
        { isActive: false, age: 27, name: { first: 'Essie', last: 'Dunlap' } },
        { isActive: true, age: 40, name: { first: 'Thor', last: 'Macdonald' } },
        {
          isActive: true,
          age: 87,
          name: { first: 'Larsen', last: 'Shaw' },
          _cellVariants: { age: 'danger', isActive: 'warning' },
        },
        { isActive: false, age: 26, name: { first: 'Mitzi', last: 'Navarro' } },
        {
          isActive: false,
          age: 22,
          name: { first: 'Genevieve', last: 'Wilson' },
        },
        { isActive: true, age: 38, name: { first: 'John', last: 'Carney' } },
        { isActive: false, age: 29, name: { first: 'Dick', last: 'Dunlap' } },
      ],
      fields: [
        {
          key: 'id_orden',
          label: '',
          tdClass: 'text-center pt-4 pb-4',
          variant: '',
        },
      ],
      infoModal: {
        id: 'info-modal',
        title: '',
        content: '',
      },
    }
  },
  computed: {
    /*  ordersList() {
      let tmp = this.ordenes
        .map((item) => {
          return {
            id: item.id_orden,
          }
        })
        .reduce((acc, item) => {
          if (!acc.includes(item.id)) {
            acc.push(item.id)
          }
          return acc
        }, [])
        .map((item) => {
          return { orden: item }
        })

      return tmp
    }, */

    ordenesSize() {
      const size = parseInt(this.ordenes.length)
      return size
    },
  },

  methods: {
    info(item, index, button) {
      this.infoModal.title = `Row index: ${index}`
      this.infoModal.content = JSON.stringify(item, null, 2)
      this.$root.$emit('bv::show::modal', this.infoModal.id, button)
    },

    terminarTrabajo(item) {
      this.$confirm(
        `¿Desea terminar la orden Nro ${item.id_orden}?`,
        'Terminar Orden',
        'info'
      )
        .then(() => {
          this.terminarOrden(item.id_lotes_detalles)
        })
        .catch(() => {
          return false
        })
    },

    async getOrdenesAsignadas() {
      await axios
        .get(`${this.$config.API}/empleados/ordenes-asignadas/${this.emp}`)
        .then((resp) => {
          this.ordenes = resp.data.items
          this.overlay = false
        })
    },

    async terminarOrden(id_lote_detalles) {
      this.overlay = true
      await axios
        .get(`${this.$config.API}/empleados/registrar-pago/${this.emp}`)
        .then((resp) => {
          this.getOrdenesAsignadas().then(() => (this.overlay = false))
        })
    },

    maquetarPrioridad(prioridad) {
      const pri = parseInt(prioridad)
      let text = ''

      if (!pri) {
        text = ''
        this.fields[0].variant = 'success'
      } else {
        text = ' '
        this.fields[0].variant = 'danger'
      }

      return text
    },
  },

  mounted() {
    this.getOrdenesAsignadas().then(() => (this.overlay = false))
  },

  props: ['emp'],
}
</script>