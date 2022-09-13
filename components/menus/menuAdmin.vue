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

              <b-nav-item-dropdown text="Ordenes y Lotes" right>
                <b-dropdown-item to="/comercializacion/ordenes"
                  >Nueva Orden</b-dropdown-item
                >
                <b-dropdown-item to="/comercializacion/ordenes/activas"
                  >Ordenes en Curso</b-dropdown-item
                >
              </b-nav-item-dropdown>

              <b-nav-item-dropdown text="Diseños" right>
                <b-dropdown-item to="/diseno/asignacion">
                  Asignacion
                </b-dropdown-item>

                <b-dropdown-item to="/diseno/disenos">
                  Diseños
                </b-dropdown-item>

                <b-dropdown-item to="/diseno/terminados">
                  Terminados
                </b-dropdown-item>
              </b-nav-item-dropdown>

              <b-nav-item to="/produccion/control">
                Control de Producción
              </b-nav-item>

              <b-nav-item-dropdown text="Inventario" right>
                <b-dropdown-item to="/inventario/gestion">
                  Gestión de inventario
                </b-dropdown-item>
                <hr />
                <!-- <b-dropdown-item to="/inventario/reportes/general">
                  Reporte general de invetario
                </b-dropdown-item> -->

                <b-dropdown-item to="/inventario/reportes/orden">
                  Reporte por orden
                </b-dropdown-item>

                <b-dropdown-item to="/inventario/reportes/insumo">
                  Reporte por insumo
                </b-dropdown-item>

                <b-dropdown-item to="/inventario/reportes/producto">
                  Reporte por producto
                </b-dropdown-item>


                <b-dropdown-item to="/inventario/reportes/empleado">
                  Reporte por empleado
                </b-dropdown-item>
              </b-nav-item-dropdown>

              <b-nav-item-dropdown text="Empleados" right>
                <b-dropdown-item to="/empleados/gestion">
                  Gestión de empleados
                </b-dropdown-item>

                <b-dropdown-item to="/asistencias">
                  Asistencias
                </b-dropdown-item>

                <b-dropdown-item to="/empleados">
                  Reporte semanal de asistencias
                </b-dropdown-item>
              </b-nav-item-dropdown>


              <b-nav-item-dropdown text="Varios" right>
                <b-dropdown-item to="/tallas">
                  Tallas
                </b-dropdown-item>
                

                <b-dropdown-item to="/ayuda">
                  Ayuda
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
