<template>
  <div>
    <b-button class="mb-4 mt-4" variant="primary" @click="$bvModal.show(modal)">
      DETALLES
    </b-button>

    <b-modal :size="size" :title="title" :id="modal" hide-footer>
      <b-overlay :show="overlay" spinner-small>
        <b-container>
          <b-row>
            <b-col lg="6">
              <div v-html="detalle"></div>
            </b-col>
          </b-row>
        </b-container>
      </b-overlay>
    </b-modal>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      detalle: '',
      overlay: false,
      size: 'xl',
      title: 'Detalles',
    }
  },

  computed: {
    modal: function () {
      const rand = Math.random().toString(36).substring(2, 7)
      return `modal-${rand}`
    },
  },

  methods: {
    async getDetalles() {
      this.overlay = true
      await axios
        .get(`${this.$config.API}/ordenes/detalles/${this.idorden}`)
        .then((resp) => {
          this.detalle = resp.data.detalle[0].observaciones
          this.overlay = false
        })
    },
  },

  props: ['idorden'],

  mounted() {
    this.$root.$on('bv::modal::show', (bvEvent, modalId) => {
      this.getDetalles()
    })
  },
}
</script>

<style lang="scss" scoped></style>
