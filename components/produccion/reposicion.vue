<template>
  <div>
    <b-button variant="warning" @click="$bvModal.show(modal)">
      <b-icon icon="skip-backward-fill"></b-icon>
    </b-button>

    <b-modal :size="size" :title="title" :id="modal" hide-footer>
      <b-overlay :show="overlay" spinner-small>
        <p>
        <pre>{{ $props }}</pre>
        </p>
        <b-container>
          <b-row>
            <b-col xl="6" lg="6" md="6" sm="12">
              <b-card-group deck>
                <b-card header="Datos de la orden">
                  <b-list-group>
                    <span><strong>Orden:</strong> {{ item.orden }}</span>
                  </b-list-group>
                  <b-list-group>
                    <span>
                      <strong>Paso actual:</strong>
                      <span style="text-transform: uppercase;">{{ item.paso }}</span>
                    </span>
                  </b-list-group>
                  <!-- <b-list-group>
                    <span><strong>Cliente:</strong> {{ item.cliente }}</span>
                  </b-list-group> -->
                </b-card>
              </b-card-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col xl="6" lg="6" md="6" sm="12">
              <b-table hover :items="items"></b-table>
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
        size: 'lg',
        title: 'Reposición de piezas',
        overlay: true,
        items: [
          {
            Orden: this.item.orden,
            Cliente: this.item.cliente,
            Paso: this.item.paso,
          }
        ]
      }
    },

    computed: {
      modal: function () {
        const rand = Math.random().toString(36).substring(2, 7)
        return `modal-${rand}`
      },
    },

    methods: {
      async getData() {
        this.overlay = true
        await axios.get(`${this.$config.API}/disenos/link/${this.item.linkdrive}`).then((resp) => {
          this.urlLink = resp.data.linkdrive
          this.overlay = false
        })
      },

      async updateData() {
        this.overlay = true
        const data = new URLSearchParams()
              data.set('url', this.urlLink)
              data.set('id', this.item.linkdrive)

              await axios.post(`${this.$config.API}/disenos/link`, data).then(res => {
          this.overlay = false
          // this.urlLink = res.data.linkdrive
              })
      },
    },

    props: ['item', 'departamento'],

    mounted() {
      this.overlay = false
    },
  }
  </script>

  <style>
  .float-button {
    width: 100%;
    float: left;
    margin-bottom: 40px;
    margin-top: 1rem;
  }

  .image img {
    width: auto;
  }
  </style>
