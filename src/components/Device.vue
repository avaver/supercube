<template>
    <v-list>
        <template v-if="connected">
            <v-list-tile avatar class="pb-1">
                <v-list-tile-avatar>
                    <v-icon class="primary white--text">grid_on</v-icon>
                </v-list-tile-avatar>
                <v-list-tile-title>
                    {{name}}
                </v-list-tile-title>
            </v-list-tile>

            <v-divider></v-divider>

            <v-list-tile class="pt-1">
                <v-list-tile-content>
                    Steps
                </v-list-tile-content>
                <v-list-tile-action>
                    <v-chip>{{steps}}</v-chip>
                </v-list-tile-action>
            </v-list-tile>

            <v-list-tile>
                <v-list-tile-content>
                    Battery
                </v-list-tile-content>
                <v-list-tile-action>
                    <v-chip><v-icon small color="green" class="pr-1" v-if="battery.charging">battery_charging_full</v-icon>{{battery.level}}%</v-chip>
                </v-list-tile-action>
            </v-list-tile>

            <v-list-tile class="pt-3">
                <v-btn flat color="primary" :disabled="loading || !connected" @click="reset">Reset</v-btn>&nbsp;
                <v-btn flat color="accent" :loading="loading" @click="toggleConnect">Disconnect</v-btn>
            </v-list-tile>

            <v-layout justify-center row>
                <img @click="updatevcs" :src="vcs" />
            </v-layout>
        </template>
        <v-list-tile v-else>
            <v-layout justify-center row>
                <v-btn flat @click="toggleConnect" :loading="loading" color="accent" :disabled="!bluetooth">Connect</v-btn>
            </v-layout>
        </v-list-tile>
    </v-list>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { EventHub, Events, CubeState } from '../classes/event-hub'
import { Giiker, BatteryInfo } from '../classes/giiker'
import { Cube } from '../classes/cube'

@Component
export default class Device extends Vue {
    private bluetooth = false
    private connected = false
    private loading = false
    private initial = true
    private name = ''
    private steps = 0
    private battery = new BatteryInfo(0)
    private cube = new Cube()

    /* tslint:disable-next-line:max-line-length */
    private vcs = 'http://roudai.net/visualcube/visualcube.php?fmt=png&size=160&r=y39x-30&bg=t&dist=3&sch=white,E53935,1976D2,yellow,F48FB1,69F0AE'

    // lifecycle
    // --------------------------------------------------
    private mounted() {
        this.bluetooth = Giiker.available()
        if (!this.bluetooth) {
            /* tslint:disable-next-line:max-line-length */
            alert('Your browser doesn\'t support bluetooth web api.\nPlease check Google Chrome Canary for your platform.')
        }
    }

    private async toggleConnect() {
        this.loading = true
        try {
            if (Giiker.connected()) {
                await Giiker.disconnect()
            } else {
                this.name = await Giiker.connect(this.onState, this.onSteps, this.onBattery, this.onDisconnect)
                this.connected = true
                EventHub.$emit(Events.cubeConnect, this.name)
            }
        } catch (e) {
            EventHub.$emit(Events.error, e)
        } finally {
            this.loading = false
        }
    }

    private async reset() {
        this.loading = true
        try {
            if (this.connected) {
                await Giiker.reset()
                this.initial = true
                EventHub.$emit(Events.cubeReset)
            }
        } catch (e) {
            EventHub.$emit(Events.error, e)
        } finally {
            this.loading = false
        }
    }

    private onState(state: Uint8Array) {
        this.cube.set(state)
        EventHub.$emit(Events.cubeState, new CubeState(state, this.initial))
        if (this.initial) {
            this.initial = false
            this.updatevcs()
        }
    }

    private onSteps(steps: number) {
        this.steps = steps
    }

    private onBattery(battery: BatteryInfo) {
        this.battery = battery
    }

    private onDisconnect(e: Event) {
        this.connected = false
        EventHub.$emit(Events.cubeDisconnect, this.name)
    }

    private updatevcs() {
        /* tslint:disable-next-line:max-line-length */
        this.vcs = 'http://roudai.net/visualcube/visualcube.php?fmt=png&size=160&r=y39x-30&bg=t&dist=3&sch=white,E53935,1976D2,yellow,F48FB1,69F0AE&fd=' + this.cube.vcs
    }
}
</script>
