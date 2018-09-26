<template>
    <v-layout justify-start align-center column v-if="enabled">
        <v-flex xs12 sm6>
            <div class="display-3 font-weight-bold">{{time.toFixed(3)}}</div>
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
        }

        if (!this.interval) {
            return
        }

        const cube = Cube.from(state)
        if (cube.solved()) {
            this.time = (Date.now() - this.startTime) / 1000
            window.clearInterval(this.interval)
            this.interval = 0
            EventHub.$emit(Events.cubeSolved)
        }
    }

    private onTimer() {
        this.time = (Date.now() - this.startTime) / 1000
    }
}
</script>
