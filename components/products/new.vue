<template>
  <div>
    <b-button id="show-btn" @click="$bvModal.show('bv-modal-example')"
      >Nuevo Producto</b-button
    >

    <b-modal id="bv-modal-example" hide-footer>
      <template #modal-title> Crear Nuevo Producto </template>
      <b-overlay :show="overlay" spinner-small>
        <b-form @submit="onSubmit" @reset="onReset" v-if="show">
          <b-form-group
            id="input-group-1"
            label="Producto:"
            label-for="input-product"
          >
            <b-form-input
              id="input-product"
              v-model="form.product"
              type="text"
              placeholder="Nombre del producto"
              required
            ></b-form-input>
          </b-form-group>

          <b-form-group
            id="input-group-2"
            label="Precio:"
            label-for="input-price"
          >
            <b-form-input
              id="input-price"
              step="0.10"
              v-model="form.price"
              type="number"
              placeholder="Precio del producto"
              required
            ></b-form-input>
            <b-alert :show="showPriceError" variant="danger"
              >Asigne un precio al producto</b-alert
            >
          </b-form-group>

          <b-button type="submit" variant="primary">Guardar</b-button>
          <!-- <b-button type="reset" variant="danger">Reset</b-button> -->
        </b-form>
      </b-overlay>
      <!-- <b-button class="mt-3" block @click="$bvModal.hide('bv-modal-example')"
        >Cerrar</b-button
      > -->
    </b-modal>
  </div>
</template>

<script>
export default {
  data() {
    return {
      overlay: false,
      showPriceError: false,
      show: true,
      form: {
        product: '',
        price: 0.0,
      },
    }
  },

  watch: {
    form: function (val) {
      console.log(val)
      if (val.price > 0) {
        this.showPriceError = false
      } else {
        this.showPriceError = true
      }
    },
  },

  methods: {
    onSubmit(event) {
      event.preventDefault()
      if (!this.form.price) {
        console.log(`Asigne un precio al producto`)
        this.showPriceError = true
      } else {
        this.postProduct().then(() => {
          this.$emit('r', true)
          this.form = {
            product: '',
            price: 0.0,
          }
          this.$bvModal.hide('bv-modal-example')
        })
      }
    },

    async postProduct() {
      this.overlay = true
      await fetch(
        `${this.$config.API}/products/lite/${this.form.product}/${this.form.price}`,
        { method: 'POST' }
      )
        .then((res) => res.json())
        .then((res) => {
          // recargar productos en el padre
          this.reponse = res
          this.loading = false
          this.form = {
            product: '',
            price: 0.0,
          }
        })
        .catch((err) => {
          alert(`El producto no se ha podido crear ${err}`)
          console.log(err)
        })
        .finally(() => {
          this.overlay = false
          console.log(`Terminada al carga de productos`)
          return true
        })
    },

    onReset(event) {
      event.preventDefault()
      // Reset our form values
      this.form.email = ''
      this.form.name = ''
      this.form.food = null
      this.form.checked = []
      // Trick to reset/clear native browser form validation state
      this.show = false
      this.$nextTick(() => {
        this.show = true
      })
    },
  },

  props: ['reload'],
}
</script>
