<template>
    <v-card color="blue-grey darken-1" dark ripple class="card-cross">
        <v-card-title class="display-2">
            Cross
            <v-spacer />
            <v-chip color="white" text-color="black" v-if="cross">
                <v-avatar :color="chip[cross].color" class="font-weight-bold white--text">{{cross}}</v-avatar>
                <span>{{chip[cross].text}}</span>
            </v-chip>
        </v-card-title>
        <v-card-text class="display-2 text-xs-center">
            {{(time / 1000).toFixed(2)}}
        </v-card-text>
        <v-card-title class="headline">
            <v-spacer />
            <v-btn icon @click.stop.prevent="details = !details">
                <v-icon>{{ details ? 'keyboard_arrow_up' : 'keyboard_arrow_down' }}</v-icon>
            </v-btn>
        </v-card-title>
        <v-slide-y-transition>
            <v-card-text v-show="details">
                <v-card-text class="text-truncate">{{moves.join(' ')}}</v-card-text>
            </v-card-text>
        </v-slide-y-transition>
    </v-card>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { EventHub, Events } from '@/classes/event-hub'
import Timer from '@/classes/timer'
import CubeState from '@/classes/cube-state'

@Component
export default class Cross extends Vue {
    private details = false
    private solving = false
    private inspection = true

    private interval = 0
    private time = 0

    private cross = ''
    private moves: string[] = []

    private chip: {[key: string]: {color: string, text: string}} = {
        G: { color: 'green' , text: 'green'},
        Y: { color: 'yellow', text: 'yellow' },
        P: { color: 'pink lighten-2', text: 'pink' },
        W: { color: 'grey lighten-1', text: 'white' },
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
            Vue.nextTick(() => EventHub.$emit(Events.cfopCross, this.cross))
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
