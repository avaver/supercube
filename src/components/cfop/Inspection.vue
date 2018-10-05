<template>
    <v-card color="blue-grey lighten-4" ripple class="card-inspection">
        <v-card-title class="display-2">
            Inspection<v-spacer />{{((time) / 1000).toFixed(2)}}
        </v-card-title>
    </v-card>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { EventHub, Events } from '@/classes/event-hub'
import Timer from '@/classes/timer'
import CubeState from '@/classes/cube-state'

@Component
export default class Inspection extends Vue {
    private details = false

    private interval = 0
    private time = 0

    private mounted() {
        EventHub.$on(Events.cubeScrambled, () => this.onCubeScrambled())
        EventHub.$on(Events.solveStarted, () => this.onSolveStarted())
        EventHub.$on(Events.solveCancelled, () => this.stopSolve())
    }

    private onCubeScrambled() {
        this.time = 0
        this.interval = window.setInterval(() => this.onTimer(), 10)
    }

    private onSolveStarted() {
        this.time = Timer.getInspectionTime()
        this.stopSolve()
    }

    private stopSolve() {
        if (this.interval) {
            window.clearInterval(this.interval)
            this.interval = 0
        }
    }

    private onTimer() {
        this.time = Timer.getInspectionTime()
    }
}
</script>
