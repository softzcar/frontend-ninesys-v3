<template>
  <div>
    <!-- <pre>
        {{ item }}
    </pre> -->
    <b-overlay :show="overlay" spinner-small>
      <b-button :variant="ButtonVariant" @click="flujoDeTrabajo(item)">{{
        ButtonText
      }}</b-button>
    </b-overlay>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      overlay: false,
      ButtonText: 'INICIAR',
      ButtonVariant: 'secondary',
    }
  },

  methods: {
    flujoDeTrabajo(item) {
      // Verificar enq ue estado se encuetra el item
      this.overlay = true

      if (!item.fecha_inicio) {
        console.log('iniciar esta tarea')
        this.$confirm(
          `¿Va a coemnzar a trabajar con éste producto?`,
          `${item.producto}`,
          'info'
        )
          .then(() => {
            this.registrarEstado('inicio', item.id_lotes_detalles)
          })
          .finally(() => (this.overlay = false))
      } else {
        console.log('TERMINAR esta tarea')
        this.$confirm(
          `¿Terminó el trabajo con este producto?`,
          `${item.producto}`,
          'info'
        )
          .then(() => {
            this.registrarEstado('fin', item.id_lotes_detalles).then(() => {
              this.terminarOrden(item.id_lotes_detalles)
            })
          })
          .finally(() => (this.overlay = false))
      }
    },

    terminarTrabajo(item) {
      this.$confirm(
        `¿Ha terminado con éste producto?`,
        `${item.producto}`,
        'info'
      )
        .then(() => {
          this.terminarOrden(item.id_lotes_detalles)
        })
        .catch(() => {
          return false
        })
    },

    async registrarEstado(tipo, id_lote_detalles) {
      // tipos: inicio, fin
      this.overlay = true
      if (this.ButtonText === 'INICIAR') {
        this.ButtonText = 'TERMINAR'
        this.ButtonVariant = 'success'
      } else {
        tipo = 'fin'
      }

      await axios
        .get(
          `${this.$config.API}/empleados/registrar-paso/${tipo}/${id_lote_detalles}`
        )
        .then((resp) => {
          console.log('emitimos aqui...')
          this.$emit('reload', 'true')
          this.overlay = false
        })
    },

    async terminarOrden(id_lote_detalles) {
      this.overlay = true
      await axios
        .get(`${this.$config.API}/empleados/registrar-pago/${id_lote_detalles}`)
        .then((resp) => {
          this.$emit('reload', 'true')
          this.overlay = false
        })
    },
  },

  mounted() {
    if (this.item.fecha_inicio) {
      this.ButtonText = 'TERMINAR'
      this.ButtonVariant = 'success'
    } else {
      this.ButtonText = 'INICIAR'
      this.ButtonVariant = 'secondary'
      console.log(
        'el trabajo esta por inicar asignar secondary iniciar',
        this.item.fecha_inicio
      )
    }
  },

  props: ['item', 'reload'],
}
</script>
