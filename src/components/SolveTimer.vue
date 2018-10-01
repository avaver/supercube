<template>
    <v-layout justify-start align-center column>
        <v-flex>
            <div class="display-4 font-weight-bold main_timer" style="text-align: center">{{(time / 1000).toFixed(3)}}</div>
            <v-layout row wrap align-center>
                <v-flex>
                    <v-chip color="blue-grey" text-color="white">
                        <v-avatar class="blue-grey darken-4">{{turns}}</v-avatar>
                        turns
                        <!--<v-icon right color="green accent-2">arrow_drop_up</v-icon>-->
                    </v-chip>
                </v-flex>
                <v-flex class="text-xs-right">
                    <v-chip color="blue-grey" text-color="white">
                        <v-avatar class="blue-grey darken-4">{{time ? (turns / (time / 1000)).toFixed(2) : '0.00'}}</v-avatar>
                        TPS
                        <!--<v-icon right color="yellow">star</v-icon>-->
                    </v-chip>
                </v-flex> 
            </v-layout>
        </v-flex>
    </v-layout>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { EventHub, Events } from '@/classes/event-hub'
import { Cube } from '@/classes/cube'

@Component
export default class SolveTimer extends Vue {
    private time = 0.0
    private turns = 0

    private startTime = 0
    private interval = 0

    private scrambled = false

    private mounted() {
        EventHub.$on(Events.cubeScrambled, () => this.onCubeScrambled())
        EventHub.$on(Events.cubeState, (state: Uint8Array) => this.onCubeState(state))
    }

    private destroyed() {
        if (this.interval) {
            window.clearInterval(this.interval)
            this.interval = 0
        }
    }

    private onCubeScrambled() {
        this.time = 0.0
        this.turns = 0
        this.startTime = 0
        this.interval = 0
        this.scrambled = true
    }

    private onCubeState(state: Uint8Array) {
        if (this.scrambled && !this.startTime) {
            this.startTime = Date.now()
            this.interval = window.setInterval(() => this.onTimer(), 10)
            EventHub.$emit(Events.solveStarted, this.startTime)
        }

        if (!this.interval) {
            return
        }

        this.turns++
        const cube = Cube.from(state)
        if (cube.solved()) {
            this.time = Date.now() - this.startTime
            window.clearInterval(this.interval)
            this.interval = 0
            this.scrambled = false
            EventHub.$emit(Events.cubeSolved, this.time)
        }
    }

    private onTimer() {
        this.time = Date.now() - this.startTime
    }
}
</script>
