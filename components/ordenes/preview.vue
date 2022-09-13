<template>
  <div>
    <b-row>
      <b-col>
        <table class="table-main table-header">
          <tr>
            <th>
              <table class="table-header">
                <tr>
                  <td>
                    <h1>NINETEEN SPORT</h1>
                    <p>Av 13 entre calle 1 y 3, sector El Carmén Local 1-54</p>
                    <p>
                      El Vigía. Edo. Mérida. Telef: 0275 8821920 | 0414 7495435
                    </p>
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>CLIENTE: </strong
                    >{{ form.nombre + '  ' + form.apellido }}
                  </td>
                </tr>
                <tr>
                  <td><strong>DIRECCIÓN:</strong> {{ form.direccion }}</td>
                </tr>
                <tr>
                  <td><strong>CORREO:</strong> {{ form.email }}</td>
                </tr>
              </table>
            </th>
            <td>
              <table class="table-header">
                <tr>
                  <td>
                    <h1>ORDEN # {{ nextId }}</h1>
                  </td>
                </tr>
                <tr>
                  <td><strong>INICIO: </strong>{{ makeDate() }}</td>
                </tr>
                <tr>
                  <td>
                    <strong>ENTREGA: </strong>{{ makeDate(form.fechaEntrega) }}
                  </td>
                </tr>
                <tr>
                  <td><strong>CI | RIF: </strong>{{ form.cedula }}</td>
                </tr>
                <tr>
                  <td><strong>TELEFONO: </strong>{{ form.telefono }}</td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <div class="spacer"></div>

        <table class="table-products">
          <th style="text-align: right">ITEM</th>
          <th style="text-align: center">COD</th>
          <th>PRODUCTO</th>
          <th style="text-align: right">CANT</th>
          <th style="text-align: center">TALLA</th>
          <th>CORTE</th>
          <th>TELA</th>
          <th
            class="hideMe"
            v-if="
              dataUser.departamento === 'Comercialización' ||
              dataUser.departamento === 'Administración'
            "
            style="text-align: right"
          >
            PRECIO
          </th>
          <th
            class="hideMe"
            v-if="
              dataUser.departamento === 'Comercialización' ||
              dataUser.departamento === 'Administración'
            "
            style="text-align: right"
          >
            TOTAL
          </th>

          <template v-for="(product, index) in form.productos">
            <tr class="row-product" :key="product.cod">
              <td style="text-align: right">{{ index + 1 }}</td>
              <td style="text-align: center">{{ product.cod }}</td>
              <td>{{ product.producto }}</td>
              <td style="text-align: right">{{ product.cantidad }}</td>
              <td style="text-align: center">{{ product.talla }}</td>
              <td>{{ product.corte }}</td>
              <td>{{ product.tela }}</td>
              <td
                class="hideMe"
                v-if="
                  dataUser.departamento === 'Comercialización' ||
                  dataUser.departamento === 'Administración'
                "
                style="text-align: right"
              >
                {{ product.precio }}
              </td>
              <td
                class="hideMe"
                v-if="
                  dataUser.departamento === 'Comercialización' ||
                  dataUser.departamento === 'Administración'
                "
                style="text-align: right"
              >
                {{
                  (
                    parseFloat(product.precio) * parseFloat(product.cantidad)
                  ).toFixed(2)
                }}
              </td>
            </tr>
          </template>
        </table>

        <div
          class="spacer hideMe"
          v-if="
            dataUser.departamento === 'Comercialización' ||
            dataUser.departamento === 'Administración'
          "
          style="text-align: right"
        >
          <h2>ABONO: {{ floatMe(form.abono) }}</h2>
          <h2>DESCUENTOS: {{ floatMe(form.descuento) }}</h2>
          <h2>
            RESTA:
            {{
              (
                parseFloat(montoTotalOrden(form.productos)) -
                parseFloat(form.abono) -
                parseFloat(form.descuento)
              ).toFixed(2)
            }}
          </h2>
          <h1>TOTAL: {{ floatMe(montoTotalOrden(form.productos)) }}</h1>
        </div>

        <div class="spacer">
          <div style="text-align: center; margin-top: 40px">
            <h2>OBSERVACIONES</h2>
          </div>
          <div class="observaciones">
            <h3 style="text-transform: uppercase">
              TIPO DE DISEÑO: {{ form.diseno }}
            </h3>
          </div>
          <div class="spacer observaciones" v-html="form.obs"></div>
        </div>
      </b-col>
    </b-row>
    <div id="toprint"></div>
  </div>
</template>

<script>
import mixin from '~/mixins/mixins.js'
import { mapState, mapMutations } from 'vuex'

export default {
  data() {
    return {
      nextId: 0,
      show: true,
      output: null,
      preview: false,
      formx: {
        id: 205,
        cedula: '11222333',
        nombre: 'YESSIKA',
        apellido: 'MORALES',
        telefono: '',
        email: 'ADANARRK@GMAIL.COM',
        direccion: 'ADANARRK@GMAIL.COM',
        fechaEntrega: '2021-11-16',
        productos: [
          {
            item: 0,
            cod: 20077,
            producto: 'Producto de Pruebas 3',
            existencia: null,
            cantidad: '5',
            talla: 'L',
            corte: 'Damas',
            precio: '12',
          },
          {
            item: 2,
            cod: 20075,
            producto: 'Producto de pruebas 1',
            existencia: null,
            cantidad: '2',
            talla: 'M',
            corte: 'Damas',
            precio: '5',
          },
          {
            item: 1,
            cod: 20076,
            producto: 'Producto de pruebas 2',
            existencia: null,
            cantidad: '4',
            talla: 'S',
            corte: 'Caballeros',
            precio: '30',
          },
          {
            item: 1,
            cod: 20076,
            producto: 'Producto de pruebas 2',
            existencia: null,
            cantidad: '1',
            talla: 'Unica',
            corte: 'Niños',
            precio: '30',
          },
        ],
        obs: '<p class="ql-align-justify">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi nec ligula quis erat porta porttitor eu lacinia nibh. Etiam efficitur velit in elit rutrum dictum. Maecenas nec leo ac mauris porta mollis. Donec fringilla tincidunt sapien, id vehicula purus tristique quis. Nunc convallis dapibus sodales. Cras molestie felis commodo quam consequat, nec interdum lorem dapibus. Nullam vel odio id metus tincidunt porta.</p><p class="ql-align-justify"><br></p><ul><li class="ql-align-justify">Phasellus lobortis efficitur ante in ultrices.</li><li class="ql-align-justify">Nulla <span style="color: rgb(230, 0, 0);">imperdiet</span>, ex at molestie convallis.</li><li class="ql-align-justify">Sem elit pellentesque massa, placerat molestie lectus sapien a risus.</li></ul><p class="ql-align-justify"><br></p><p class="ql-align-justify">In hac habitasse platea dictumst. Nam pulvinar purus eget libero ornare dictum. <strong style="background-color: rgb(255, 255, 0); color: rgb(54, 54, 54);">Fusce eget dictum odio, nec molestie leo.</strong> Suspendisse sodales arcu ex, ac venenatis sem blandit non. Donec varius dolor vel nisl cursus iaculis. Donec lacinia eros et luctus sollicitudin. Aenean eu lorem in lacus dignissim tincidunt.</p><p class="ql-align-justify"><br></p><h2 class="ql-align-justify">Quisque iaculis leo eget sodales egestas.</h2><p class="ql-align-justify"><br></p><p class="ql-align-justify">Proin gravida at erat ac hendrerit. Aenean faucibus felis vel ante lobortis, eget semper turpis dapibus. Nullam lectus est, dictum eget tempor sit amet, convallis sed lectus. Nunc volutpat volutpat finibus. Nunc orci mauris, cursus et ipsum quis, facilisis placerat dui. Vestibulum vitae turpis blandit, commodo dolor non, tincidunt arcu.</p><p class="ql-align-justify">Quisque mollis dignissim lacus semper aliquet. Nunc consequat, augue aliquet tristique varius, est magna faucibus justo, at ultricies elit dui nec lectus. Maecenas ullamcorper diam mi, id vestibulum mi posuere ut. Nam vitae imperdiet felis. Pellentesque nunc ante, posuere ac suscipit non, rhoncus scelerisque dolor. In tempus a lacus ac feugiat. Nunc vestibulum urna facilisis quam suscipit, sit amet sodales libero efficitur. Cras sagittis nec ipsum at vestibulum. In hac habitasse platea dictumst. Mauris eget ipsum a ligula porttitor consectetur. Nulla ut blandit sapien.</p><p><br></p>',
        abono: '75',
        diseno: 'gráfico',
      },
    }
  },

  computed: {
    ...mapState('buscar', ['id_orden', 'result']),
    ...mapState('login', ['access', 'dataUser']),
  },

  methods: {
    ...mapMutations('buscar', ['setResult']),

    floatMe(val) {
      return parseFloat(val).toFixed(2)
    },
    montoTotalOrden(productos) {
      if (productos.length > 0) {
        return productos
          .map((item) => {
            return parseFloat(item.precio) * parseFloat(item.cantidad)
          })
          .reduce((acc, curr) => (acc = acc + curr))
      }
    },

    makeDate(date) {
      let f
      if (!date) {
        let tmp = new Date()
        f = tmp.getDate() + '/' + (tmp.getMonth() + 1) + '/' + tmp.getFullYear()
      } else {
        let tmp = date.split('-')
        f = `${tmp[2]}/${tmp[1]}/${tmp[0]}`
      }

      return f
    },
  },

  mounted() {
    if (this.showpreview) this.preview = true

    const data = new URLSearchParams()
    let conf = {
      url: `/next-id-order`,
      method: 'get',
      data: data,
    }

    this.ozhttp(conf).then((data) => {
      this.nextId = this.json.id
    })
  },

  mixins: [mixin],

  props: ['form', 'showpreview', 'go'],
}
</script>

<style scoped>
.report * {
  font-family: Arial, Helvetica, sans-serif;
}
.report {
  padding: 2rem;
}
.observaciones {
  padding: 1.85rem;
}
.printMe {
  width: 100%;
  text-align: right;
}
.spacer {
  width: 100%;
  margin-bottom: 2rem;
}
.table-main,
.table-products {
  width: 100%;
}
.table-main tr td,
.table-products tr th td {
  padding: 0.25rem;
}
.table-products th {
  font-weight: bold;
  padding: 0.25rem;
  border-top: solid 1px rgb(119, 112, 112);
  border-bottom: solid 1px #000;
}
.table-products tr td {
  padding: 0.25rem 0.4rem;
}
@media print {
  .table-header * {
    border: solid 1px #fff;
  }
  .hideMe {
    display: none;
  }
  .printMe {
    visibility: hidden;
  }
}
.table-products {
  border-bottom: solid 1px #000;
}
@page {
  size: landscape;
}
@media screen {
  /* Contenido del fichero home.css */
}

@media print {
  .noPrint {
    display: none;
  }
}

/* RESET STYLES */
/* http://meyerweb.com/eric/tools/css/reset/
   v2.0 | 20110126
   License: none (public domain)
*/

html,
body,
div,
span,
applet,
object,
iframe,
h1,
h2,
h3,
h4,
h5,
h6,
p,
blockquote,
pre,
a,
abbr,
acronym,
address,
big,
cite,
code,
del,
dfn,
em,
img,
ins,
kbd,
q,
s,
samp,
small,
strike,
strong,
sub,
sup,
tt,
var,
b,
u,
i,
center,
dl,
dt,
dd,
ol,
ul,
li,
fieldset,
form,
label,
legend,
table,
caption,
tbody,
tfoot,
thead,
tr,
th,
td,
article,
aside,
canvas,
details,
embed,
figure,
figcaption,
footer,
header,
hgroup,
menu,
nav,
output,
ruby,
section,
summary,
time,
mark,
audio,
video {
  margin: 0;
  padding: 0;
  border: 0;
  font-size: 100%;
  font: inherit;
  vertical-align: baseline;
  color: #000;
  font-family: Arial, Helvetica, sans-serif;
}
/* HTML5 display-role reset for older browsers */
article,
aside,
details,
figcaption,
figure,
footer,
header,
hgroup,
menu,
nav,
section {
  display: block;
}
body {
  line-height: 1;
}

h1,
h2,
h3,
h4,
h5,
h6 {
  font-weight: bold;
}
strong {
  font-weight: bold;
}
ol,
ul {
  list-style: none;
}
blockquote,
q {
  quotes: none;
}
blockquote:before,
blockquote:after,
q:before,
q:after {
  content: '';
  content: none;
}
table {
  border-collapse: collapse;
  border-spacing: 0;
}
</style>
