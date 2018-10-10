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
    private time = 0
    private active = false
    private inspection = false

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
        EventHub.$on(Events.solveCancelled, () => this.stop())
        EventHub.$on(Events.cubeState, (state: Uint8Array) => this.onCubeState(state))
    }

    private onCubeScrambled() {
        this.time = 0
        this.cross = ''
        this.moves = []
        this.active = this.inspection = true
    }

    private onCubeState(state: Uint8Array) {
        if (!this.active) {
            return
        }

        if (this.inspection) {
            this.start()
        }

        const cubeState = CubeState.from(state)
        this.moves = CubeState.OptimizeMoves([...this.moves, cubeState.lastmove()])
        this.cross = cubeState.cross()

        if (this.cross) {
            this.done(this.cross, state)
        }
    }

    private timer() {
        this.time = Timer.getCrossSolveTime()
        if (this.active && !this.inspection) {
            window.requestAnimationFrame(this.timer)
        }
    }


    private start() {
        Timer.crossStarted()
        this.inspection = false
        window.requestAnimationFrame(this.timer)
        EventHub.$emit(Events.solveStarted)
    }

    private done(cross: string, state: Uint8Array) {
        this.stop()
        Timer.crossSolved()
        this.time = Timer.getCrossSolveTime()
        Vue.nextTick(() => EventHub.$emit(Events.cfopCross, this.cross, state))
    }

    private stop() {
        this.active = false
    }
}
</script>
