<template>
  <div>
    <b-button variant="primary" @click="$bvModal.show(modal)">
      <b-icon icon="pencil"></b-icon>
    </b-button>

    <b-modal
      :size="size"
      :title="title"
      :id="modal"
      cancel-disabled
      ok-disabled
      footerClass="d-none"
    >
      <b-container>
        <b-row>
          <b-col>
            <p>
              <b-overlay :show="overlay" spinner-small>
                <b-form @submit="onSubmit" @reset="onReset">
                  <b-form-group
                    id="input-group-1"
                    label="Insumo:"
                    label-for="input-insumo"
                  >
                    <b-form-input
                      id="input-insumo"
                      v-model="form.insumo"
                      placeholder="Ingrese el insumo"
                      required
                    ></b-form-input>
                  </b-form-group>

                  <b-form-group
                    id="input-group-3"
                    label="Cantidad:"
                    label-for="input-cantidad"
                  >
                    <b-form-input
                      id="input-cantidad"
                      v-model="form.cantidad"
                      placeholder="Ingrese la cantidad"
                      required
                    ></b-form-input>
                  </b-form-group>

                  <b-form-group
                    id="input-group-2"
                    label="Tipo de unidad:"
                    label-for="input-unidad"
                  >
                    <b-form-select
                      id="input-unidad"
                      v-model="form.unidad"
                      :options="unidadesOptions"
                      required
                    >
                    </b-form-select>
                  </b-form-group>

                  <b-form-group
                    id="input-group-4"
                    label="Departamento:"
                    label-for="input-departamento"
                  >
                    <b-form-select
                      id="input-departamento"
                      v-model="form.departamento"
                      :options="departamentOptions"
                      required
                    >
                    </b-form-select>
                  </b-form-group>
                  <!-- <b-button @click="resetForm" variant="danger"
                    >Limpiar</b-button
                  > -->
                  <b-button type="submit" variant="primary">Guardar</b-button>
                </b-form>
              </b-overlay>
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
      form: {
        insumo: '',
        unidad: '',
        cantidad: '',
        departamento: '',
      },
      unidadesOptions: [
        { value: 'Mts', text: 'Metros' },
        { value: 'Kg', text: 'Kilos' },
        { value: 'Und', text: 'Unidades' },
      ],
      departamentOptions: [
        { value: 'Empleado', text: 'Empleado' },
        { value: 'Comercialización', text: 'Comercialización' },
        { value: 'Jefe de diseño', text: 'Jefe de diseño' },
        { value: 'Diseño', text: 'Diseño' },
        { value: 'Producción', text: 'Producción' },
        { value: 'Administración', text: 'Administración' },
      ],
      size: 'md',
      title: 'Nuevo Insumo',
      overlay: false,
    }
  },

  watch: {
    data() {
      this.form = {
        insumo: this.data.insumo,
        unidad: this.data.unidad,
        cantidad: this.data.cantidad,
        departamento: this.data.departamento,
      }
    },
  },

  computed: {
    modal: function () {
      const rand = Math.random().toString(36).substring(2, 7)
      return `modal-${rand}`
    },
  },

  methods: {
    async guardarInsumo() {
      this.overlay = true

      const data = new URLSearchParams()
      data.set('_id', this.data._id)
      data.set('insumo', this.form.insumo)
      data.set('unidad', this.form.unidad)
      data.set('cantidad', this.form.cantidad)
      data.set('departamento', this.form.departamento)

      await axios
        .post(`${this.$config.API}/insumos/editar`, data)
        .then((res) => {
          console.log('resultado insumo editar', res)
          this.resetForm()
          this.$emit('reload')
          this.$bvModal.hide(this.modal)
        })
    },

    onSubmit(event) {
      event.preventDefault()
      this.guardarInsumo()
    },

    onReset(event) {
      event.preventDefault()
      // Reset our form values
      this.form = {
        insumo: '',
        unidad: '',
        cantidad: '',
        departamento: '',
      }
      // Trick to reset/clear native browser form validation state
      this.show = false
      this.$nextTick(() => {
        this.show = true
      })
    },

    resetForm() {
      this.overlay = true
      this.form = {
        insumo: '',
        unidad: '',
        cantidad: '',
        departamento: '',
      }
      this.overlay = false
    },
  },
  mounted() {
    this.form = {
      insumo: this.data.insumo,
      unidad: this.data.unidad,
      cantidad: this.data.cantidad,
      departamento: this.data.departamento,
    }
  },

  props: ['data'],
}
</script>
