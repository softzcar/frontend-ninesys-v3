<template>
  <div>
    <b-alert v-if="ordenVinculada" show variant="warning">
    <h4 class="alert-heading">Orden Vinculada {{ ordenVinculada }}</h4>
    <p>
      Este orden estará vinculada con la orden número {{ ordenVinculada }}.
    </p>
    <p>
      Si desea desvincularla seleccione la opción desde la pestaña <strong>Clientes</strong>
    </p>
  </b-alert>

    <!-- Control buttons-->
    <div class="text-right">
      <b-button-group class="mt-2">
        <b-button @click="prev">Anterior</b-button>
        <b-button @click="next">{{ nextText }}</b-button>
      </b-button-group>
    </div>
    <!-- Tabs with card integration -->
    <b-card no-body>
      <b-tabs v-model="tabIndex" small card>
        <b-tab title="Cliente" title-link-class="h5" :disabled="disable1">
          <div class="wizard-content">
            <h3 class="mb-4">Datos del cliente</h3>
            <b-overlay
              :show="loading.show"
              rounded
              opacity="0.6"
              spinner-small
              spinner-variant="primary"
              class="d-inline-block"
              @hidden="onHidden"
            >
              <b-row>
                <b-col lg="12">
                  <produccion-vincularOrden @reload="reloadVinculo" />
                  <hr class="my-4 pb-4" />
                </b-col>
              </b-row>
              <b-row>
                <b-col lg="12">
                  <b-form v-on:submit.prevent>
                    <b-form-group>
                      <label for="input-fecha"
                        >Fecha de entega <span required>*</span></label
                      >
                      <b-form-datepicker
                        id="input-fecha"
                        v-model="form.fechaEntrega"
                        class="mb-2 mr-sm-2 mb-sm-0"
                        placeholder="Selecciona una fecha"
                      ></b-form-datepicker>
                    </b-form-group>

                    <b-form-group>
                      <label for="input-cedula"
                        >Cedula <span required>*</span></label
                      >
                      <b-form-input
                        id="input-cedula"
                        v-on:keyup="filterCustomer"
                        v-on:blur="filterCustomer"
                        v-model="form.cedula"
                        type="text"
                        class="mb-2 mr-sm-2 mb-sm-0"
                        placeholder="Ingrese la Cédula"
                      ></b-form-input>
                    </b-form-group>

                    <b-form-group>
                      <label for="input-nombre"
                        >Nombre <span required>*</span></label
                      >
                      <b-form-input
                        id="input-nombre"
                        ref="nombre"
                        v-model="form.nombre"
                        type="text"
                        class="mb-2 mr-sm-2 mb-sm-0"
                        placeholder="Ingrese el nombre"
                      ></b-form-input>
                    </b-form-group>

                    <b-form-group>
                      <label for="input-apellido"
                        >Apellido <span required>*</span></label
                      >
                      <b-form-input
                        id="input-apellido"
                        v-model="form.apellido"
                        type="text"
                        class="mb-2 mr-sm-2 mb-sm-0"
                        placeholder="Ingrese el apellido"
                      ></b-form-input>
                    </b-form-group>

                    <b-form-group>
                      <label for="input-telefono">Teléfono</label>
                      <b-form-input
                        id="input-telefono"
                        v-model="form.telefono"
                        type="tel"
                        class="mb-2 mr-sm-2 mb-sm-0"
                        placeholder="Ingrese teléfono"
                      ></b-form-input>
                    </b-form-group>

                    <b-form-group>
                      <label for="input-email">Email</label>
                      <b-form-input
                        id="input-email"
                        v-model="form.email"
                        type="email"
                        class="mb-2 mr-sm-2 mb-sm-0"
                        placeholder="Ingrese el email"
                      ></b-form-input>
                    </b-form-group>

                    <b-form-group>
                      <label for="input-address">Dirección</label>
                      <b-form-input
                        id="input-address"
                        v-model="form.direccion"
                        type="text"
                        class="mb-2 mr-sm-2 mb-sm-0"
                        placeholder="Ingrese la dirección"
                      ></b-form-input>
                    </b-form-group>
                  </b-form>
                  <p info-form><span required>*</span> Campos obligatorios</p>
                </b-col>
              </b-row>
            </b-overlay>
          </div>
        </b-tab>
        <b-tab title="Productos" title-link-class="h5" :disabled="disable2">
          <div class="wizard-content">
            <b-row>
              <b-col lg="12">
                <b-list-group horizontal>
                  <b-list-group-item
                    >Cédula: {{ form.cedula }}</b-list-group-item
                  >
                  <b-list-group-item
                    >Nombre: {{ form.nombre }}
                    {{ form.apellido }}</b-list-group-item
                  >
                  <b-list-group-item
                    >Teléfono: {{ form.telefono }}</b-list-group-item
                  >
                  <b-list-group-item>Email: {{ form.email }}</b-list-group-item>
                  <b-list-group-item
                    >Entrega: {{ form.fechaEntrega }}</b-list-group-item
                  >
                </b-list-group>
                <br />
              </b-col>
            </b-row>

            <b-row>
              <b-col lg="6">
                <b-list-group horizontal>
                  <b-list-group-item>
                    <h2>TOTAL A PAGAR: $ {{ form.total }}</h2>
                  </b-list-group-item>
                  <br />
                </b-list-group>
                <b-row>
                  <b-col lg="6" class="mt-4">
                    <products-new @r="getResponseNewProduct" />
                  </b-col>
                </b-row>
                <br />
                <vue-typeahead-bootstrap
                  @hit="loadProduct"
                  :data="productsSelect"
                  v-model="query"
                  placeholder="Seleccione los productos"
                />
              </b-col>
            </b-row>

            <b-row>
              <b-col lg="12" class="mt-4">
                <b-table
                  responsive
                  ::primary-key="form.productos.item"
                  :fields="campos"
                  :items="form.productos"
                >
                  <template #cell(nombre)="data">
                    <a :href="`#${data.item.producto}`">{{
                      data.item.item.producto
                    }}</a>
                  </template>

                  <template #cell(item)="data">
                    {{ data.index + 1 }}
                  </template>

                  <template #cell(cantidad)="data">
                    <b-form-input
                      v-model="form.productos[data.index].cantidad"
                      min="0"
                      type="number"
                      @change="montoTotalOrden"
                    ></b-form-input>
                  </template>

                  <template #cell(corte)="data">
                    <b-form-select
                      v-model="form.productos[data.index].corte"
                      :options="cortes"
                    ></b-form-select>
                  </template>

                  <template #cell(talla)="data">
                    <b-form-select
                      v-model="form.productos[data.index].talla"
                      :options="mySizes"
                    ></b-form-select>
                  </template>

                  <template #cell(tela)="data">
                    <b-form-select
                      v-model="form.productos[data.index].tela"
                      :options="myTelas"
                    ></b-form-select>
                  </template>

                  <template #cell(acciones)="data">
                    <div>
                      <span>
                        <b-button
                          variant="primary"
                          icon="ti-check"
                          @click="duplicateItem(data.index, data.item)"
                        >
                          <b-icon-box-arrow-in-left></b-icon-box-arrow-in-left>
                        </b-button>
                      </span>
                      <span>
                        <b-button
                          variant="danger"
                          icon="ti-check"
                          @click="removeItem(data.index)"
                        >
                          <b-icon-trash></b-icon-trash>
                        </b-button>
                      </span>
                    </div>
                  </template>
                </b-table>
              </b-col>

              <b-col lg="12">
                <h3 class="mb-4 mt-4">Observaciones</h3>
                <quill-editor
                  v-model="form.obs"
                  @change="onEditorChange($event)"
                ></quill-editor>
              </b-col>
            </b-row>
          </div>
        </b-tab>
        <b-tab
          title="Pago y asignación"
          title-link-class="h5"
          :disabled="disable3"
        >
          <div class="wizard-content">
            <h2>Monto pagado y asignacion de diseño</h2>

            <b-row>
              <b-col lg="12" class="mb-4">
                <div class="custom-collapse">
                  <b-list-group class="collapse" horizontal>
                    <b-list-group-item
                      >Cédula: {{ form.cedula }}</b-list-group-item
                    >
                    <b-list-group-item
                      >Nombre: {{ form.nombre }}
                      {{ form.apellido }}</b-list-group-item
                    >
                    <b-list-group-item
                      >Teléfono: {{ form.telefono }}</b-list-group-item
                    >
                    <b-list-group-item
                      >Email: {{ form.email }}</b-list-group-item
                    >
                    <b-list-group-item
                      >Entrega: {{ form.fechaEntrega }}</b-list-group-item
                    >
                    <br />
                  </b-list-group>
                </div>
              </b-col>
            </b-row>

            <!-- <b-row>
									<b-col lg="12" class="mb-4">
										<b-row>
											<b-col lg="2">
												<label for="input-abono" style="margin-right: 1rem">ABONO</label>
												<b-form-input id="input-abono" v-model="form.abono" @keydown.enter.stop.prevent type="number" class="mb-2 mr-sm-2 mb-sm-0" placeholder="Ingrese el monto pagado"></b-form-input>
											</b-col>
										</b-row>
									</b-col>
								</b-row> -->
            <b-row>
              <b-col lg="12" class="mb-4">
                <b-list-group horizontal>
                  <b-list-group-item>
                    <h2 style="color: red">
                      TOTAL: $
                      {{ form.total }}
                    </h2>
                  </b-list-group-item>

                  <b-list-group-item>
                    <h2>ABONO: $ {{ form.abono }}</h2>
                    <b-form-input
                      id="input-abono"
                      min="0"
                      v-model="form.abono"
                      @keydown.enter.stop.prevent
                      type="number"
                      class="mb-2 mr-sm-2 mb-sm-0"
                      placeholder="Ingrese el monto pagado"
                    ></b-form-input>
                  </b-list-group-item>
                  <br />

                  <b-list-group-item>
                    <h2>DESCUENTO: $ {{ form.descuento }}</h2>
                    <b-form-input
                      id="input-descuento"
                      min="0"
                      v-model="form.descuento"
                      @keydown.enter.stop.prevent
                      type="number"
                      class="mb-2 mr-sm-2 mb-sm-0"
                      placeholder="Ingrese el descuento"
                    ></b-form-input>
                  </b-list-group-item>
                  <br />

                  <b-list-group-item>
                    <h2>
                      RESTA: $
                      {{
                        (
                          parseFloat(form.total) -
                          parseFloat(form.abono) -
                          parseFloat(form.descuento)
                        ).toFixed(2)
                      }}
                    </h2>
                  </b-list-group-item>
                  <br />
                </b-list-group>
              </b-col>
            </b-row>
            <b-row>
              <b-col lg="12" class="mb-4" style="vertical-align: baseline">
                <hr />
                <div>
                  <b-form-group
                    label="Seleccion el tipo de Diseño"
                    v-slot="{ ariaDescribedby }"
                  >
                    <b-form-radio
                      v-model="form.diseno"
                      :aria-describedby="ariaDescribedby"
                      name="some-radios"
                      value="gráfico"
                      >Gráfico</b-form-radio
                    >
                    <b-form-radio
                      v-model="form.diseno"
                      :aria-describedby="ariaDescribedby"
                      name="some-radios"
                      value="modas"
                      >Modas</b-form-radio
                    >
                    <b-form-radio
                      v-model="form.diseno"
                      :aria-describedby="ariaDescribedby"
                      name="some-radios"
                      value="no"
                      >Sin diseño</b-form-radio
                    >
                  </b-form-group>
                </div>
                <hr />
              </b-col>
            </b-row>
          </div>
        </b-tab>
        <b-tab title="Emitir orden" title-link-class="h5" :disabled="disable4">
          <div class="wizard-content">
            <b-row>
              <b-col>
                <b-alert style="padding: 2.4rem" variant="success" show>
                  <h2>
                    Verifique todos los datos antes de emitir la Orden
                  </h2></b-alert
                >
              </b-col>
            </b-row>

            <b-row>
              <b-col>
                <div id="reporte">
                  <ordenes-preview :form="formPrint" :showpreview="true" />
                </div>
              </b-col>
            </b-row>
          </div>
        </b-tab>
      </b-tabs>
    </b-card>

    <div class="text-right">
      <b-button-group class="mt-2">
        <b-button @click="prev">Anterior</b-button>
        <b-button @click="next">{{ nextText }}</b-button>
      </b-button-group>
    </div>
    <!-- <pre>{{ form }}</pre> -->
    <!-- <pre>{{ myCustomers }}</pre> -->
  </div>
</template>

<script>
import mixins from '~/mixins/mixins.js'
import { mapState } from 'vuex'

export default {
  data() {
    return {
      disable1: false,
      disable2: true,
      disable3: true,
      disable4: true,
      nextText: 'Siguiente',

      ordenVinculada: 0,

      tabIndex: 0,
      query: '',
      myTelas: [],
      myCustomers: [],
      mySizes: [],
      products: [],
      productsSelect: [],
      formPrint: {
        id: '',
        cedula: '', // Datos del cliente
        nombre: '',
        apellido: '',
        telefono: '',
        email: '',
        direccion: '',
        fechaEntrega: '',
        productos: [], // Datos para la tabla de productos
        obs: '',
        abono: 0, // Pago total o parcial
        descuento: 0,
        total: 0, // Pago total o parcial
        diseno: 'no',
        next: 0,
      },
      form: {
        id: '',
        cedula: '', // Datos del cliente
        nombre: '',
        apellido: '',
        telefono: '',
        email: '',
        direccion: '',
        fechaEntrega: '',
        productos: [], // Datos para la tabla de productos
        obs: '',
        abono: 0, // Pago total o parcial
        descuento: 0,
        total: 0, // Pago total o parcial
        diseno: 'no',
        next: 0,
      },
      cortes: [
        {
          value: 'No aplica',
          text: 'No aplica',
        },
        {
          value: 'Damas',
          text: 'Damas',
        },
        {
          value: 'Caballeros',
          text: 'Caballeros',
        },
        {
          value: 'Niños',
          text: 'Niños',
        },
      ],
      campos: [
        { key: 'item', label: 'Item' },
        { key: 'cod', label: 'cod' },
        { key: 'producto', label: 'producto' },
        { key: 'precio', label: 'precio' },
        { key: 'existencia', label: 'existencia' },
        { key: 'cantidad', label: 'cantidad' },
        { key: 'talla', label: 'talla', tdClass: 'min-width' },
        { key: 'corte', label: 'corte' },
        { key: 'tela', label: 'tela' },
        { key: 'acciones', label: 'acciones' },
      ],
      loading: {
        show: false,
        text: '',
      },
    }
  },

  watch: {
    tabIndex(val) {
      if (val === 3) {
        this.nextText = 'Finalizar'
      } else {
        this.nextText = 'Siguiente'
      }
    },
  },

  methods: {
    reloadVinculo(val) {
      console.log('Orden a vincular:', val);
      this.ordenVinculada = val
    },
    prev() {
      this.tabIndex--
    },
    next() {
      if (this.tabIndex === 0) {
        this.validateStep1()
      }

      if (this.tabIndex === 1) {
        this.validateStep2()
      }

      if (this.tabIndex === 2) {
        this.validateStep3()
      }

      if (this.tabIndex === 3) {
        this.validateStep4()
      }
    },

    validateStep1() {
      if (this.step1()) {
        this.disable2 = false
        setTimeout(() => {
          this.tabIndex = 1
        }, 100)
      } else {
        this.disable2 = true
        this.disable3 = true
        this.disable4 = true
      }
    },

    validateStep2() {
      if (this.step2()) {
        this.disable3 = false
        setTimeout(() => {
          this.tabIndex = 2
        }, 100)
      } else {
        this.disable3 = true
        this.disable4 = true
      }
    },

    validateStep3() {
      if (this.step3()) {
        this.disable4 = false
        setTimeout(() => {
          this.tabIndex = 3
        }, 100)
      }
    },

    validateStep4() {
      if (this.step4()) {
      }
    },

    step1() {
      let ok = true
      let msg = ''
      let emailExist = this.emailExist(this.form.email)

      console.log(`emailExist`, emailExist)

      if (!this.form.cedula.trim()) {
        ok = false
        msg = msg + '<p>La cédula es un campo obligatorio</p>'
      }

      if (!this.form.nombre.trim()) {
        ok = false
        msg = msg + '<p>El nombre es un campo obligatorio</p>'
      }

      if (!this.form.apellido.trim()) {
        ok = false
        msg = msg + '<p>El apellido es un campo obligatorio</p>'
      }

      if (!this.form.fechaEntrega.trim()) {
        ok = false
        msg = msg + '<p>La fecha de entrega es un campo obligatorio</p>'
      }

      if (emailExist.exist) {
        ok = false
        msg = msg + emailExist.msg
      }

      if (!ok) {
        this.$fire({
          type: 'info',
          title: 'Datos requeridos',
          html: msg,
        })
        // Volver a mostrar Placeholder si el campo es espacio en blanco
        if (!this.form.cedula.trim()) this.form.cedula = ''
        if (!this.form.nombre.trim()) this.form.nombre = ''

        // ok = FontFaceSetLoadEvent
        ok = false
      } else {
        // update customer
        this.updateCustomer().then(() => {
          this.getCustomers()
        })
      }

      // OLD
      /* if (
        !this.form.cedula.trim() ||
        !this.form.nombre.trim() ||
        !this.form.apellido.trim() ||
        !this.form.fechaEntrega.trim() ||
        emailExist
      ) {
        let msg
        if (emailExist) {
          msg =
            msg +
            `<p>El email <strong>${this.form.email}</strong> ya ha sido registrado</p> <br> Los campos:  <strong>Cédula, Nombre, Apellido y Fecha de entrega</strong> <br />son obligatorios</p>`
        } else {
          msg =
            msg +
            '<p>Los campos:  <strong>Cédula, Nombre, Apellido y Fecha de entrega</strong> <br />son obligatorios</p>'
        }

        this.$fire({
          type: 'info',
          title: 'Datos requeridos',
          html: msg,
        })
        // Volver a mostrar Placeholder si el campo es espacio en blanco
        if (!this.form.cedula.trim()) this.form.cedula = ''
        if (!this.form.nombre.trim()) this.form.nombre = ''

        // ok = FontFaceSetLoadEvent
        ok = false
      } else {
        // update customer
        this.updateCustomer().then(() => {
          this.getCustomers()
        })
      } */
      return ok
    },

    step2() {
      let ok = true
      let ceroPrice = null

      let checkCantidad = this.form.productos.filter((item) => {
        return item.cantidad === 0 || item.cantidad === '0'
      })
      console.log('cantidades de productos', checkCantidad)

      if (this.form.productos.length) {
        console.log('(checkCantidad.length', checkCantidad.length)
        if (checkCantidad.length > 0) {
          ceroPrice = true
        } else {
          ceroPrice = false
        }
      } else {
        console.log('no hay productos seleccionados')
        ceroPrice = true
      }

      if (!this.form.productos.length || ceroPrice) {
        let errors = ''
        ok = false

        if (!this.form.productos.length)
          errors = errors + `<p>Debe seleccionar al menos un producto</p>`
        if (ceroPrice)
          errors = errors + `<p>Los productos no pueden tener cantidad cero</p>`

        this.$fire({
          type: 'info',
          title: 'Datos requeridos',
          html: errors,
        })
      }

      return ok
    },

    step3() {
      let ok = true
      // Veerificar el monto pagado
      let abono = parseFloat(this.form.abono)
      let descuento = parseFloat(this.form.descuento)
      let total = parseFloat(this.form.total)

      if (abono + descuento > total) {
        ok = false
        this.$fire({
          title: 'Monto',
          html: 'El monto pagadoe excede el total de la orden',
          type: 'error',
        })
      } else {
        // Crear copia del formulario
        this.formPrint = this.form
      }
      return ok
    },

    step4() {
      this.$confirm('¿Desea emitir la orden?', 'Finalizar', 'success').then(
        () => {
          this.finishOrder().then(() => {
            this.$confirm(
              '¿Desea imprimir una copia de la orden orden?',
              'Imprimir',
              'info'
            )
              .then(() => {
                this.printOrder('reporte').then(() => {
                  this.clearForm({
                    form: true,
                    formPrint: true,
                  })
                })
              })
              .catch(() => {
                this.clearForm({
                  form: true,
                  formPrint: true,
                })
              })
          })
        }
      )

      return true
    },

    filterCustomer(key) {
      const cedulaLength = this.form.cedula.trim().length
      if (!cedulaLength) {
        this.clearStep1()
      } else {
        if (
          key.keyCode === 13 ||
          this.form.cedula != '' ||
          this.form.nombre === ''
        ) {
          const customer = this.myCustomers.find(
            (el) => el.cedula === this.form.cedula.trim()
          )

          if (customer) {
            this.enableControl = true

            this.form.id = customer.id
            this.form.nombre = customer.first_name
            this.form.apellido = customer.last_name
            this.form.telefono = customer.phone
            this.form.direccion = customer.address

            /**los email que empiezan con 'none_'
             * son asignados por el sistema
             * en caso de no haber proporcionado un email
             * al momento de enviar el fromulario */
            let exp = customer.email.split('none_')
            if (exp[0] === 'none_') {
              this.form.email = ''
            } else {
              this.form.email = customer.email
            }
          } else {
            this.clearStep1()
          }
        } else if (this.form.cedula === '' || !this.form.cedula) {
          this.form.id = ''
          this.form.nombre = ''
          this.form.apellido = ''
          this.form.telefono = ''
          this.form.email = ''
          this.form.direccion = ''
        } else {
          this.form.id = ''
          this.form.nombre = ''
          this.form.apellido = ''
          this.form.telefono = ''
          this.form.email = ''
          this.form.direccion = ''
        }
      }
    },

    async getCustomers() {
      await fetch(`${this.$config.API}/customers`)
        .then((res) => res.json())
        .then((res) => {
          this.customers = res
          this.loading.show = false
        })
        .catch((err) => {
          console.log(err)
        })
        .finally(() => {
          this.laoding = false
          return true
        })
    },

    async updateCustomer() {
      this.loading.show = true
      let method = ''
      let url = ''

      console.log(`telefono length`, this.form.telefono.length)
      // Validar campos vacios
      let id = this.form.id
      let nombre = this.form.nombre.length ? this.form.nombre : 'none'
      let apellido = this.form.apellido.length ? this.form.apellido : 'none'
      let cedula = this.form.cedula.length ? this.form.cedula : 'none'
      let telefono = this.form.telefono.length ? this.form.telefono : 'none'
      let email = this.form.email.length ? this.form.email : 'none'
      let direccion = this.form.direccion.length ? this.form.direccion : 'none'

      // Verificamos si el el usuarioe xiste para llamar el endpoint correcto
      if (!this.form.id) {
        method = 'POST'
        // url = `${this.$config.API}/customers/${this.form.nombre}/${this.form.apellido}/${this.form.cedula}/${this.form.telefono}/${this.form.email}/${this.form.direccion}`
        url = `${this.$config.API}/customers/${nombre}/${apellido}/${cedula}/${telefono}/${email}/${direccion}`
      } else {
        method = 'PUT'
        // url = `${this.$config.API}/customers/${this.form.id}/${this.form.nombre}/${this.form.apellido}/${this.form.cedula}/${this.form.telefono}/${this.form.email}/${this.form.direccion}`
        console.log('url PUT', url)
        url = `${this.$config.API}/customers/${id}/${nombre}/${apellido}/${cedula}/${telefono}/${email}/${direccion}`
      }

      await fetch(url, { method: method })
        .then((res) => res.json())
        .then((res) => {})
        .catch((err) => {
          this.$fire({
            title: 'Error',
            type: 'error',
            html: '<p>No se pudo conectar con el servidor, revise su conexiona inernet</p>',
          })
          // alert(`El Cliente no se ha podido crear ${err}`)
          console.log(err)
        })
        .finally(() => {
          this.loading.show = false
          console.log(`Terminada al carga de Cliente`)
          return true
        })
    },

    emailExist(email) {
      let result = { exist: false, msg: '' }

      if (this.form.email.trim().length) {
        if (this.form.cedula.trim().length) {
          let clienteData = this.myCustomers.filter(
            (item) => item.cedula === this.form.cedula.trim()
          )
          console.log('clientData', clienteData)
          // Verificar exzistencia delcliente
          if (!clienteData.length) {
            result.exist = false
          } else {
            // Buscar email en las registros
            let emailData = this.myCustomers.find(
              (item) => item.email === this.form.email.trim()
            )

            if (
              clienteData.cedula != emailData.cedula &&
              this.form.cedula != emailData.cedula
            ) {
              result.exist = true
              result.msg = `El email ${this.form.email} ya esta registrado al usuario ${emailData.first_name}`
            }

            console.log('Hemos encontrado el cliente ', clienteData)
            console.log('Hemos encontrado el email ', emailData)
          }
        }
      } else {
        result.msg = '<p>No ha ingresado un email</p>'
      }

      return result

      /* if (this.form.email.trim().length) { // Se ha ingresado un email
        // Verificar si es un cliente nuevo
        let foundCedula = this.myCustomers.filter(
          (item) => item.cedula === this.form.cedula
        )

        console.log(`FoundCedula ::: `, foundCedula.length)
        console.log(`Registro ::: `, foundCedula[0])
        if (foundCedula.length && foundCedula[0].email != this.form.email) { // el cliente ya existe,
        }

        // VErificamos si el cliente ya ha sido creado o no

        if (email.trim() === '') {
          result = false
        } else {
          let exist = this.myCustomers.filter((item) => {
            return item.email === email
          })
          if (exist) result = true
        }
      } else {
        console.log('no prodceamos elemail porque no hay cedula para comparar')
      }
 */
    },

    clearForm(obj) {
      let clean = {
        id: '',
        cedula: '', // Datos del cliente
        nombre: '',
        apellido: '',
        telefono: '',
        email: '',
        direccion: '',
        fechaEntrega: '',
        productos: [], // Datos para la tabla de productos
        obs: '',
        abono: 0, // Pago total o parcial
        total: 0, // Pago total o parcial
        diseno: 'no',
      }
      if (obj.form) {
        this.form = clean
        console.log(`Limpiado form`)
      }
      if (obj.formPrint) {
        this.formPrint = clean
        console.log(`Limpiado formPrint`)
      }
      this.ordenVinculada = 0
      this.disable2 = true
      this.disable3 = true
      this.disable4 = true
      this.tabIndex = 0
    },

    async finishOrder() {
      this.overlay = true
      let dataForm = ''

      dataForm += `id=${this.form.id}`
      dataForm += `&vinculada=${this.ordenVinculada}`
      dataForm += `&nombre=${this.form.nombre}`
      dataForm += `&apellido=${this.form.apellido}`
      dataForm += `&cedula=${this.form.cedula}`
      dataForm += `&email=${this.form.email}`
      dataForm += `&telefono=${this.form.telefono}`
      dataForm += `&direccion=${this.form.direccion}`
      dataForm += `&fechaEntrega=${this.form.fechaEntrega}`
      dataForm += `&fechaInicio=${this.nowDate()}`
      dataForm += `&obs=${this.form.obs}`
      dataForm += `&abono=${this.form.abono}`
      dataForm += `&descuento=${this.form.descuento}`
      dataForm += `&total=${this.form.total}`
      dataForm += `&diseno=${this.form.diseno}`
      dataForm += `&responsable=${this.$store.state.login.dataUser._id}`
      dataForm += `&productos=${JSON.stringify(this.form.productos)}`

      await fetch(`${this.$config.API}/ordenes/nueva`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: dataForm,
      })
        .then((response) => {
          return response.json()
        })
        .then((data) => {
          console.log(`La orden ${data.orden_nro} ha sido creada`)
          console.dir(data)
          // commit("setCurrentOrder", data.orden_nro);
          this.$confirm('¿Desea imprimir la orden?')
            .then(() => {
              this.printOrder('reporte').then(() => {
                this.clearForm({
                  form: true,
                  formPrint: true,
                })
                // this.$refs.wizard.changeTab(0, 0)
              })
            })
            .then(() => (this.overlay = false))
          // return data.orden_nro
        })
    },

    clearStep1() {
      this.form.id = ''
      this.form.nombre = ''
      this.form.apellido = ''
      this.form.telefono = ''
      this.form.email = ''
      this.form.direccion = ''
    },

    async getProducts() {
      await fetch(`${this.$config.API}/products`)
        .then((res) => res.json())
        .then((res) => {
          this.products = res
          this.productsSelect = res.map((prod) => {
            return `${prod.id} | ${prod.name}`
          })
          this.loading.show = false
        })
        .catch((err) => {
          console.log(err)
          this.alerta({
            type: 'error',
            titile: 'Error',
            html: 'Error en la conexión',
          })
        })
        .finally(() => {
          return true
        })
    },

    loadProduct(val) {
      let exploited = val.split('|')
      let count = 0
      let dataProd = this.products
        .map((product) => {
          return {
            item: count++,
            cod: product.id,
            producto: product.name,
            existencia: product.stock_quantity,
            cantidad: 0,
            talla: null,
            tela: null,
            corte: 'No aplica',
            tela: this.form.tela,
            precio: product.regular_price,
          }
        })
        .find((product) => product.cod == exploited[0])

      this.query = ''

      this.form.productos.push(dataProd)
      this.form.productos.sort(this.dynamicSort('producto'))

      return dataProd
    },

    updateProdId(id) {
      let affect = id - 1
      this.form.productos[affect].item = id + 88
      // this.form.productos[last].item = id
    },

    duplicateItem(index, item) {
      let last = this.form.productos.length - 1
      let copy = {
        item: last,
        cod: item.cod,
        producto: item.producto,
        existencia: item.existencia,
        cantidad: item.cantidad,
        talla: item.talla,
        tela: item.tela,
        corte: item.corte,
        precio: item.precio,
      }

      this.form.productos.push(copy)

      let mySort = this.form.productos.sort(function (a, b) {
        if (a.producto > b.producto) {
          return 1
        }
        if (a.producto < b.producto) {
          return -1
        }
        // a must be equal to b
        return 0
      })

      this.form.productos = mySort
      // recalcular monto total
      this.montoTotalOrden()
    },

    removeItem(index) {
      this.form.productos.splice(index, 1)
      this.montoTotalOrden()
    },

    getResponseNewProduct(res) {
      this.loading.show = true
      this.getProducts().then(() => {
        this.loading.show = false
      })
    },

    dynamicSort(property) {
      var sortOrder = 1
      if (property[0] === '-') {
        sortOrder = -1
        property = property.substr(1)
      }
      return function (a, b) {
        /* next line works with strings and numbers,
         * and you may want to customize it to your needs
         */
        var result =
          a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0
        return result * sortOrder
      }
    },

    getObs(html) {
      console.log(`getObs recibió: ${html}`)
      this.form.obs = html
    },

    onEditorChange({ editor, html, text }) {
      console.log('editor change!', editor, html, text)
      this.form.obs = html
    },

    onHidden() {
      return false
    },

    montoTotalOrden() {
      if (this.form.productos.length > 0) {
        this.form.total = 0
        this.form.total = this.form.productos
          .map((item) => {
            return parseFloat(item.precio) * parseInt(item.cantidad)
          })
          .reduce((acc, curr) => (acc = acc + curr))
      }
    },
  },

  mounted() {
    this.loading.show = true

    // Cargar telas
    this.loading.text = 'Cagando telas...'

    this.ozhttp({
      url: '/telas',
      method: 'get',
    }).then(() => {
      this.myTelas = this.json.data.map((item) => {
        return {
          value: item.tela,
          text: item.tela,
        }
      })
    })

    this.getProducts()

    // Cargar Clientes
    this.loading.text = 'Cagando clientes...'

    this.ozhttp({
      url: '/customers',
      method: 'get',
    }).then(() => {
      this.myCustomers = this.json.data
    })

    // Cargar Tallas
    this.loading.text = 'Cagando tallas...'

    this.ozhttp({
      url: '/sizes',
      method: 'get',
    }).then(() => {
      this.mySizes = this.json.data.map((item) => {
        return {
          value: item.name,
          text: item.name,
        }
      })
    })

    this.loading.show = false
  },

  mixins: [mixins],
}
</script>

<style scoped>
.label-step {
  font-size: 1.2rem !important;
}
.wizard-content {
  width: auto;
  min-height: 200px;
  padding: 1rem;
}
</style>
