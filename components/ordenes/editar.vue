<template>
  <div>
    <b-button variant="primary" @click="$bvModal.show(modal)">
      <b-icon icon="pencil"></b-icon>
    </b-button>

    <b-modal :size="size" :title="title" :id="modal">
      <b-container>
        <b-row>
          <b-col>
            <p>
              Seleccione el estatus de la orden
            </p>
            <p>
              <b-overlay :show="overlay"  spinner-small>
                <b-form-select v-model="selected" :options="options" @change="saveData"></b-form-select>
              </b-overlay>
            </p>
            <p>
              <ul>
                <li>
                  <strong>Activa</strong>: La orden está en proceso de fabricación</li>
                <li>
                  <strong>Pausada</strong>: El proceso de fabricación se ha detenido, se reanudará posteriormente</li>
                <li>
                  <strong>Cancelada</strong>: La fabricación se ha interrupido y no se reanudará</li>
                <li>
                  <strong>Terminada</strong>: El proceso de fabricación ha concluido</li>
                <li>
                  <strong>Entregada</strong>: La orden ha sido despachada al cliente</li>
              </ul>
            </p>
          </b-col>
        </b-row>
      </b-container>
    </b-modal>
  </div>
</template>

<script>
import axios from 'axios'

export default {
	data() {
		return {
			size: 'md',
			title: 'Editar estado de la orden',
			overlay: false,

			selected: this.data.estatus,
			options: [{ value: 'activa', text: 'Activa' }, { value: 'pausada', text: 'Pausada' }, { value: 'cancelada', text: 'Cancelada' }, { value: 'terminada', text: 'Terminada' }, { value: 'entregada', text: 'Entregada' }],
		}
	},

	computed: {
		modal: function() {
			const rand = Math.random()
				.toString(36)
				.substring(2, 7)

			return `modal-${rand}`
		},
	},

	methods: {
		async saveData() {
			this.overlay = true

			const data = new URLSearchParams()
			data.set('estado', this.selected)
			data.set('id', this.data.orden)

			await axios.post(`${this.$config.API}/orden/actualizar-estado`, data).then(res => {
				this.$store.dispatch('comerce/getOrdenesActivas').then(() => (this.overlay = false))
			})
		},
	},

	mounted() {},

	props: ['data'],
}
</script>
