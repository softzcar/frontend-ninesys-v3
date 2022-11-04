<template>
  <div>
    <button @click="change()">CHANGE</button>
    <!-- <pre>
      {{ t }}
    </pre> -->
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import axios from 'axios'

export default {
  data() {
    return {
      nuevo: { title: 'New Title' },
      posts: [],
    }
  },
  computed: {
    ...mapState('test', ['t']),
  },

  mounted() {
    // this.change()
  },

  methods: {
    ...mapMutations('test', ['setT']),
    async change() {
      await axios.get('https://api2.nineteengreen.com').then((res) => {
        this.$store.commit('test/setT', res.data)
      })
    },
  },
}
</script>
