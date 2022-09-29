<template>
  <div>
    <b-container style="padding: 0px" class="mb-4" fluid>
      <b-row>
        <b-col v-if="dataUser.departamento === 'Comercialización'">
          <menus-menuComercializacion />
        </b-col>

        <b-col v-if="dataUser.departamento === 'Jefe de diseño'">
          <menus-menuJefeDiseno />
        </b-col>

        <b-col v-if="dataUser.departamento === 'Diseño'">
          <menus-menuDisenador />
        </b-col>

        <b-col v-if="dataUser.departamento === 'Producción'">
          <menus-menuProduccion />
        </b-col>

        <b-col v-if="dataUser.departamento === 'Administración'">
          <menus-menu-admin />
        </b-col>
      </b-row>

      <b-row>
        <b-col class="mt-3 mb-3 mr-4 pt-2 text-right">
          <div>
            <checkConnection style="float: right; margin-left: 12px" />
            <b-icon icon="person" /> {{ dataUser.username }} |
            {{ dataUser.departamento }}
          </div>
        </b-col>
      </b-row>
      <b-row>
        <b-col class="mr-4 text-right">
          <buscar-BarraDeBusqueda />
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState('login', ['access', 'dataUser']),
  },
}
</script>
