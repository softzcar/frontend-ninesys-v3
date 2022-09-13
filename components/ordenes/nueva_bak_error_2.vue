<template>
  <div>
    <loading :show="loading.show" :text="loading.text" />
    <b-container fluid>
      <b-row>
        <b-col>
          <h2>Nueva Orden</h2>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <form-wizard
            ref="wizard"
            title=""
            subtitle=""
            back-button-text="Anterior"
            next-button-text="Siguiente"
            color="#007bff"
            error-color="#red"
            step-size="md"
            @on-complete="finishOrder"
          >
            <tab-content :before-change="step1" title="Cliente" class="noPrint">
              <b-col lg="6" md="8" sm="12">
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
                          <label for="input-apellido">Apellido</label>
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
                      <p info-form>
                        <span required>*</span> Campos obligatorios
                      </p>
                    </b-col>
                  </b-row>
                </b-overlay>
              </b-col>
            </tab-content>

            <!-- STEP 2 TMP -->
            <tab-content title="Productos" :before-change="step2">
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
                    <b-list-group-item
                      >Email: {{ form.email }}</b-list-group-item
                    >
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
            </tab-content>

            <tab-content :before-change="step3" title="Pago y Asignación">
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
                        placeholder="Ingrese eldescuento"
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
            </tab-content>

            <tab-content :before-change="step4" title="Emitir Orden">
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
            </tab-content>
            <tab-content :before-change="step5" title="fin">
              es el fin ...
            </tab-content>
          </form-wizard>
        </b-col>
      </b-row>
    </b-container>
    <!-- <pre>
      OBS: {{ form.obs }}
    </pre> -->
  </div>
</template>

<script>
import mixins from '~/mixins/mixins.js'
import { mapState } from 'vuex'
// import { Promise } from 'q'
// import { resolve } from 'url'
export default {
  data() {
    return {
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

  computed: {
    ...mapState('login', ['dataUser']),
  },

  methods: {
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
            this.form.email = customer.email
            this.form.direccion = customer.address
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
      // this.loading.show = true
      let method = ''
      let url = ''

      // Verificamos si el el usuarioe xiste para llamar el endpoint correcto
      if (!this.form.id) {
        method = 'POST'
        url = `${this.$config.API}/customers/${this.form.nombre}/${this.form.apellido}/${this.form.cedula}/${this.form.telefono}/${this.form.email}/${this.form.direccion}`
      } else {
        method = 'PUT'
        url = `${this.$config.API}/customers/${this.form.id}/${this.form.nombre}/${this.form.apellido}/${this.form.cedula}/${this.form.telefono}/${this.form.email}/${this.form.direccion}`
      }

      await fetch(url, { method: method })
        .then((res) => res.json())
        .then((res) => {
          console.log(`El cliente ha sido creado, redultado:`)
          console.dir(res)
        })
        .catch((err) => {
          alert(`El Cliente no se ha podido crear ${err}`)
          console.log(err)
        })
        .finally(() => {
          this.loading.show = false
          console.log(`Terminada al carga de Cliente`)
          return true
        })
    },

    step1() {
      let ok = true

      if (
        !this.form.cedula.trim() ||
        !this.form.nombre.trim() ||
        !this.form.fechaEntrega.trim()
      ) {
        this.$fire({
          type: 'info',
          title: 'Datos requeridos',
          html: '<p>Los campos:  <strong>Cédula, Nombre y Fecha de entrega</strong> <br />son obligatorios</p>',
        })
        // Volver a mostrar Placeholder si el campo es espacio en blanco
        if (!this.form.cedula.trim()) this.form.cedula = ''
        if (!this.form.nombre.trim()) this.form.nombre = ''

        ok = FontFaceSetLoadEvent
      } else {
        // update customer
        this.updateCustomer().then(() => {
          this.getCustomers()
        })
      }

      return ok
    },

    step2() {
      let ok = true
      let ceroPrice = null

      let checkCantidad = this.form.productos.filter((item) => {
        return item.cantidad === 0
      })
      if (this.form.productos.length) {
        if (checkCantidad.length) {
          ceroPrice = true
        } else {
          ceroPrice = false
        }
      } else {
        ceroPrice = true
      }

      /* this.$fire({
        type: 'info',
        tite: 'debug',
        html: `productos: ${JSON.stringify(
          this.form.productos.length
        )}<br /> obs: ${this.form.obs}<br /> precios: ${ceroPrice}`,
      }) */

      if (!this.form.productos.length || ceroPrice) {
        let errors = ''

        if (!this.form.productos.length)
          errors = errors + `<p>Debe seleccionar al menos un producto</p>`
        if (ceroPrice)
          errors = errors + `<p>Los productos no pueden tener cantidad cero</p>`

        this.$fire({
          type: 'info',
          title: 'Datos requeridos',
          html: errors,
        })
        ok = FontFaceSetLoadEvent
      }

      return ok
    },

    step3() {
      // TODO Verificar si hay algo que validar aqui
      // Crear copia del formulario
      this.formPrint = this.form
      return true
    },

    step4() {
      // Generar ordenn y guardar datos de cliente aqui......

      // this.finishOrder();
      // this.printMe().then(() => alert("listo"));
      // limpiar y resetar formulario
      this.$confirm('¿Desea imprimir la orden?').then(() => {
        this.printOrder('reporte')
      })

      return true
    },

    step5() {
      return true
    },

    clearStep1() {
      this.form.id = ''
      this.form.nombre = ''
      this.form.apellido = ''
      this.form.telefono = ''
      this.form.email = ''
      this.form.direccion = ''
    },

    step4_old() {
      // Generar ordenn y guardar datos de cliente aqui......
      // this.loading.show = true
      // this.loading.text = 'Emitiendo la orden. por favor espere'

      return true
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
    },

    async finishOrder() {
      let dataForm = ''

      dataForm += `id=${this.form.id}`
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
      dataForm += `&responsable=${this.dataUser.id_empleado}`
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
          this.$confirm('¿Desea imprimir la orden?').then(() => {
            this.printOrder('reporte').then(() => {
              this.clearForm({
                form: true,
                formPrint: true,
              })
              this.$refs.wizard.changeTab(0, 0)
            })
          })
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
