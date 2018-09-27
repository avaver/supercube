<template>
    <v-layout justify-start align-center column v-if="enabled">
        <v-flex xs12 sm6>
            <div class="display-3 font-weight-bold" style="text-align: center">{{(time / 1000).toFixed(3)}}</div>
            <div class="headline" style="text-align: center">{{turns}} turns | {{(turns / (time / 1000)).toFixed(2)}} TPS</div>
        </v-flex>
    </v-layout>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { EventHub, Events } from '@/classes/event-hub'
import { Cube } from '@/classes/cube'

@Component
export default class SolveTimer extends Vue {
    private enabled = false
    private time = 0.0
    private turns = 0

    private startTime = 0
    private interval = 0

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
        this.enabled = true
        this.time = 0.0
        this.turns = 0
        this.startTime = 0
        this.interval = 0
    }

    private onCubeState(state: Uint8Array) {
        if (!this.enabled) {
            return
        }

        if (!this.startTime) {
            this.startTime = Date.now()
            this.interval = window.setInterval(this.onTimer, 10)
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
            EventHub.$emit(Events.cubeSolved, this.time)
        }
    }

    private onTimer() {
        this.time = Date.now() - this.startTime
    }
}
</script>
