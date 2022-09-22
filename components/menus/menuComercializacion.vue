<template>
  <div>
    <b-row>
      <b-col>
        <b-navbar toggleable="lg" type="dark" variant="info">
          <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

          <b-collapse id="nav-collapse" is-nav>
            <b-navbar-nav>
              <b-nav-item to="/">
                <b-icon-house-fill></b-icon-house-fill>
              </b-nav-item>

              <b-nav-item to="/comercializacion/ordenes">
                Nueva Orden
              </b-nav-item>

              <b-nav-item to="/comercializacion/ordenes/activas">
                Ordenes En Curso
              </b-nav-item>

              <b-nav-item-dropdown text="Reportes" right>
                <b-dropdown-item to="/comercializacion/reportes/pagos-abonos">
                  Pagos y Abonos
                </b-dropdown-item>

                <hr />
                
                <b-dropdown-item to="/comercializacion/reportes/terminadas">
                  Ordenes Terminadas
                </b-dropdown-item>
                
                <b-dropdown-item to="/comercializacion/reportes/entregadas">
                  Ordenes Entregadas
                </b-dropdown-item>
                
                <b-dropdown-item to="/comercializacion/reportes/general">
                  Reporte General de Ordenes
                </b-dropdown-item>
                
              </b-nav-item-dropdown>

              <b-nav-item href="/"> Salir</b-nav-item>
            </b-navbar-nav>

            <!-- Right aligned nav items -->
            <!-- <b-navbar-nav class="ml-auto">
              <b-nav-item to="/">
                <b-icon-house-fill></b-icon-house-fill>
              </b-nav-item>
            </b-navbar-nav> -->
          </b-collapse>
        </b-navbar>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import buscar from '~/components/buscar/BarraDeBusqueda.vue'

export default {
  computed: {
    ...mapState('login', ['dataUser']),
  },
  components: {
    buscar,
  },
  props: ['user', 'departamento'],
}
</script>

<style scoped>
.user-info {
  font-size: 1.2rem;
}
.buscar {
  margin-top: 2rem;
}
</style>
