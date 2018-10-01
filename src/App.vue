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
                    <Scramble />
                    <SolveTimer />
                    <CFOP />
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
import CFOP from '@/components/CFOP.vue'

@Component({
    components: {
        Device,
        Scramble,
        SolveTimer,
        CFOP
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

    private mounted() {
        if (this.nobluetooth = !Giiker.available()) return

        EventHub.$on(Events.error, (e: Error) => this.onError(e))
        EventHub.$on(Events.cubeState, (state: Uint8Array) => this.onCubeState(state))
        EventHub.$on(Events.cubeConnect, (name: string) => this.onCubeConnect(name))
        EventHub.$on(Events.cubeDisconnect, (name: string) => this.onCubeDisconnect(name))
    }

    private onError(e: Error) {
        this.toast(e.toString(), 'error')
        console.log(e)
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
