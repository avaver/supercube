<template>
    <v-card color="blue-grey darken-1" dark ripple class="card-cross">
        <v-card-title class="display-2">
            Cross
            <v-spacer />
            <v-avatar v-if="cross" size="32" :color="chip[cross].color" class="font-weight-bold white--text body-1">{{cross}}</v-avatar>            
        </v-card-title>
        <v-card-text class="display-2 text-xs-center">
            {{(time / 1000).toFixed(2)}}
        </v-card-text>
        <v-card-title class="headline">
            &nbsp;
        </v-card-title>
    </v-card>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { EventHub, Events } from '@/classes/event-hub'
import Timer from '@/classes/timer'
import CubeState from '@/classes/cube-state'

@Component
export default class Cross extends Vue {
    private solving = false
    private inspection = true

    private interval = 0
    private time = 0

    private cross = ''
    private moves: string[] = []

    private chip: {[key: string]: {color: string, text: string}} = {
        G: { color: 'green' , text: 'green'},
        Y: { color: 'yellow darken-1', text: 'yellow' },
        P: { color: 'pink lighten-2', text: 'pink' },
        W: { color: 'black', text: 'white' },
        R: { color: 'red', text: 'red' },
        B: { color: 'blue', text: 'blue' }
    }

    private mounted() {
        EventHub.$on(Events.cubeScrambled, () => this.onCubeScrambled())
        EventHub.$on(Events.solveCancelled, () => this.stopSolve())
        EventHub.$on(Events.cubeState, (state: Uint8Array) => this.onCubeState(state))
    }

    private onCubeScrambled() {
        this.time = 0
        this.cross = ''
        this.moves = []
        this.solving = true
        this.inspection = true
        this.interval = window.setInterval(() => this.onTimer(), 10)
    }

    private onCubeState(state: Uint8Array) {
        if (!this.solving) {
            return
        }

        if (this.inspection) {
            Timer.crossStarted()
            EventHub.$emit(Events.solveStarted)
            this.inspection = false
        }

        const cubeState = CubeState.from(state)
        this.moves = CubeState.OptimizeMoves([...this.moves, cubeState.lastmove()])
        this.cross = cubeState.cross()
        if (this.cross) {
            Timer.crossSolved()
            this.stopSolve()
            this.time = Timer.getCrossSolveTime()
            Vue.nextTick(() => EventHub.$emit(Events.cfopCross, this.cross, state))
        }
    }

    private onTimer() {
        this.time = Timer.getCrossSolveTime()
    }

    private stopSolve() {
        this.solving = false
        if (this.interval) {
            window.clearInterval(this.interval)
            this.interval = 0
        }
    }
}
</script>
