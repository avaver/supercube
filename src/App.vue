<template>
    <v-app>
        <v-navigation-drawer v-model="drawer" floating clipped app>
            <Device />
        </v-navigation-drawer>

        <v-toolbar app clipped-left color="secondary" dark>
            <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
            <v-toolbar-title>Smart Cube</v-toolbar-title>
        </v-toolbar>

        <v-content>
            <v-container fluid fill-height>
                <v-layout justify-center>
                </v-layout>
            </v-container>
        </v-content>

        <v-footer app fixed dark color="secondary">
            <span class="pl-3"><a href="mailto:avaver@gmail.com" class="subheading font-weight-light white--text">avaver@gmail.com</a></span>
        </v-footer>
    </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Device from './components/Device.vue'

@Component({
    components: {
        Device
    }
})
export default class App extends Vue {
    private drawer = false
}
</script>
