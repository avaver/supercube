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
            <v-container fluid grid-list-xl>
                <v-layout justify-center column>
                    <Scramble :game="game" />
                    <SolveTimer :game="game" />
                    <v-container grid-list-xl>
                        <v-layout row wrap>
                            <v-flex xs12>
                                <Inspection />
                            </v-flex>
                            <v-flex xs12 sm6 lg3>
                                <Cross />
                            </v-flex>
                            <v-flex xs12 sm6 lg3>
                                <F2L />
                            </v-flex>
                            <v-flex xs12 sm6 lg3>
                                <OLL />
                            </v-flex>
                            <v-flex xs12 sm6 lg3>
                                <PLL />
                            </v-flex>
                            <v-flex xs12>
                                <AUF />
                            </v-flex>
                            <v-flex xs12>
                                <Results :game="game" />
                            </v-flex>
                        </v-layout>
                    </v-container>
                </v-layout>
            </v-container>
        </v-content>

        <v-footer app fixed dark color="secondary">
            <v-layout justify-space-around>
                <div><v-icon small color="accent">{{connected ? 'bluetooth_connected' : 'bluetooth_disabled'}}</v-icon> {{connected ? 'Connected [' + cubeName + ']' : 'Disconnected'}}</div>
                <div class="hidden-sm-and-down">State: {{state}}</div>
                <div><a href="mailto:avaver@gmail.com" class="subheading font-weight-light white--text">avaver@gmail.com</a></div>
            </v-layout>
        </v-footer>

        <v-dialog v-model="nobluetooth" persistent max-width="290">
            <v-card>
                <v-card-title class="headline">Ooops!</v-card-title>
                <v-card-text>It seems your browser doesn't support bluetooth web api. Try checking <a href="https://www.google.com/chrome/canary/">Chrome Canary</a> for your platform.</v-card-text>
            </v-card>
        </v-dialog>

        <v-snackbar v-model="snackbar" :timeout="snackbarTimeout" :color="snackbarColor">
            {{snackbarText}}
            <v-btn dark flat @click="snackbar = false">Close</v-btn>
        </v-snackbar>
    </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { EventHub, Events } from '@/classes/event-hub'
import { Giiker } from '@/classes/giiker'
import Device from '@/components/Device.vue'
import Scramble from '@/components/Scramble.vue'
import SolveTimer from '@/components/SolveTimer.vue'
import Results from '@/components/Results.vue'
import Inspection from '@/components/cfop/Inspection.vue'
import Cross from '@/components/cfop/Cross.vue'
import F2L from '@/components/cfop/F2L.vue'
import OLL from '@/components/cfop/OLL.vue'
import PLL from '@/components/cfop/PLL.vue'
import AUF from '@/components/cfop/AUF.vue'
import CubeState from '@/classes/cube-state'
import GameState from '@/classes/game-state'

@Component({
    components: {
        Device,
        Scramble,
        SolveTimer,
        Inspection,
        Results,
        Cross,
        F2L,
        OLL,
        PLL,
        AUF
    }
})
export default class App extends Vue {
    private drawer = false
    private snackbar = false
    private loading = false
    private nobluetooth = false

    private connected = false
    private cubeName = ''

    private snackbarTimeout = 3000
    private snackbarColor = 'info'
    private snackbarText = ''
    private state = ''

    private game = new GameState()

    private mounted() {
        this.nobluetooth = !Giiker.available()
        if (this.nobluetooth) { return }

        EventHub.$on(Events.error, (e: Error) => this.onError(e))
        EventHub.$on(Events.cubeState, (state: Uint8Array) => this.onCubeState(state))
        EventHub.$on(Events.cubeConnect, (name: string) => this.onCubeConnect(name))
        EventHub.$on(Events.cubeDisconnect, (name: string) => this.onCubeDisconnect(name))

        // tslint:disable:max-line-length
        EventHub.$on(Events.cubeScrambled, () => window.setTimeout(() => this.$vuetify.goTo('.card-inspection', { offset: -100, duration: 500, easing: 'easeInOutCubic' }), 100))
        EventHub.$on(Events.solveStarted, () => window.setTimeout(() => this.$vuetify.goTo('.card-cross', { offset: -100, duration: 500, easing: 'easeInOutCubic' }), 100))
        EventHub.$on(Events.cfopCross, () => window.setTimeout(() => this.$vuetify.goTo('.card-f2l', { offset: -100, duration: 500, easing: 'easeInOutCubic' }), 100))
        EventHub.$on(Events.cfopF2l, () => window.setTimeout(() => this.$vuetify.goTo('.card-oll', { offset: -100, duration: 500, easing: 'easeInOutCubic' }), 100))
        EventHub.$on(Events.cfopOll, () => window.setTimeout(() => this.$vuetify.goTo('.card-pll', { offset: -100, duration: 500, easing: 'easeInOutCubic' }), 100))
        EventHub.$on(Events.cfopPll, (state: Uint8Array) => window.setTimeout(() => this.$vuetify.goTo(CubeState.from(state).solved() ? '.card-scramble' : '.card-auf', { offset: -100, duration: 500, easing: 'easeInOutCubic' }), 100))
        EventHub.$on(Events.cubeSolved, () => window.setTimeout(() => this.$vuetify.goTo('.card-scramble', { offset: -100, duration: 500, easing: 'easeInOutCubic' }), 100))
        // tslint:enable:max-line-length
    }

    private onError(e: Error) {
        this.toast(e.toString(), 'error')
        // tslint:disable-next-line:no-console
        console.log(e.toString())
    }

    private onCubeState(state: Uint8Array) {
        this.state = state.toHexString()
    }

    private onCubeConnect(name: string) {
        this.connected = true
        this.cubeName = name
    }

    private onCubeDisconnect(name: string) {
        this.connected = false
    }

    private toast(m: string, c: string = 'info') {
        this.snackbarText = m
        this.snackbarColor = c
        this.snackbar = true
    }
}
</script>
