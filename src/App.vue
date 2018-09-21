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
            <v-layout justify-space-around>
                <div>Scramble: {{scramble}}</div>
                <div>State: {{state}}</div>
                <div><a href="mailto:avaver@gmail.com" class="subheading font-weight-light white--text">avaver@gmail.com</a></div>
            </v-layout>
        </v-footer>

        <v-dialog v-model="loading" hide-overlay persistent width="300">
            <v-card color="primary" dark>
                <v-card-text>
                    Initializing scrambler...
                    <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
                </v-card-text>
            </v-card>
        </v-dialog>
    </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { EventHub, Events } from './classes/event-hub'
import Device from './components/Device.vue'
import * as Cubejs from 'cubejs'
require('cubejs/lib/solve.js')

@Component({
    components: {
        Device
    }
})
export default class App extends Vue {
    private drawer = false
    private loading = true
    private scramble = ''
    private state = ''

    private mounted() {
        EventHub.$on(Events.cubeState, (s: Uint8Array) => this.state = s.toHexString())
        setTimeout(this.init, 1000)
    }

    private init() {
        Cubejs.initSolver()
        let s = Cubejs.scramble()
        //let c: Cubejs = new (Cubejs as any)()
        this.scramble = s
        this.loading = false
    }
}
</script>
