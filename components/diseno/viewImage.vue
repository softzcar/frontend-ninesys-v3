<template>
  <div>
    <b-button variant="primary" @click="$bvModal.show(modal)">
      <b-icon icon="file-image"></b-icon>
    </b-button>

    <b-modal :size="size" :title="title" :id="modal" hide-footer>
      <b-overlay :show="overlay" spinner-small>
        <b-container>
          <b-row>
            <b-col>
              <div class="image-container">
                <img :src="srcImag" :width="imageWidth" :height="imageHeight" />
              </div>
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
      newImage: null,
      size: 'lg',
      title: 'Imágen del diseño',
      overlay: true,
      imageWidth: '100%',
      imageHeight: 'auto',
      imageUrl: '',
      actionURL: '',

      // ANTIGUO
      titulo: '',
      fileList: [],
    }
  },

  computed: {
    srcImag() {
      let token = this.token()
      return this.imageUrl + '&_=' + token
    },
    modal: function () {
      const rand = Math.random().toString(36).substring(2, 7)

      return `modal-${rand}`
    },
  },

  methods: {
    async getImagen() {
      await fetch(`https://cdn.nineteengreen.com/images/?id=${this.id}`)
        .then((res) => res.json())
        .then((res) => {
          // let rnd = Math.floor( Math.random() * 10 ) // PREVENIR CAHCHEAR LA IMAGEN
          this.imageUrl = res.url + `?t=${this.token()}`
        })
        .catch((err) => {
          console.log(err)
        })
    },

    token() {
      const length = 8
      var a =
        'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'.split(
          ''
        )
      var b = []
      for (var i = 0; i < length; i++) {
        var j = (Math.random() * (a.length - 1)).toFixed(0)
        b[i] = a[j]
      }
      return b.join('')
    },
  },

  props: ['id'],

  mounted() {
    this.overlay = true
    this.titulo = `Imagen de la orden ${this.id}`
    this.getImagen().then(() => {
      this.overlay = false
      this.actionURL = `https://cdn.nineteengreen.com/?id=${this.id}`
    })
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
