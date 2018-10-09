<template>
    <v-card color="blue-grey darken-4" dark ripple class="card-pll">
        <v-card-title class="display-2">
            PLL
        </v-card-title>
        <v-card-text class="display-2 text-xs-center">
            {{((inspectionTime + solveTime) / 1000).toFixed(2)}}
        </v-card-text>
        <v-card-title class="headline">
            <v-tooltip bottom>
                <div slot="activator">{{(inspectionTime / 1000).toFixed(2)}}</div>
                <span>Inspection time</span>
            </v-tooltip>
            <v-spacer />
            <v-tooltip bottom>
                <div slot="activator">{{(solveTime / 1000).toFixed(2)}}</div>
                <span>Execution time</span>
            </v-tooltip>
        </v-card-title>
    </v-card>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { EventHub, Events } from '@/classes/event-hub'
import Timer from '@/classes/timer'
import CubeState from '@/classes/cube-state'
import { colorToFace, oppositeFace } from '@/classes/cube-helper'

@Component
export default class PLL extends Vue {
    private details = false
    private solving = false
    private inspection = true

    private interval = 0

    private cross = ''
    private inspectionFace = ''

    private solveTime = 0
    private inspectionTime = 0

    private moves: string[] = []

    private mounted() {
        EventHub.$on(Events.cubeScrambled, () => this.onCubeScrambled())
        EventHub.$on(Events.solveCancelled, () => this.stopSolve())
        EventHub.$on(Events.cfopOll, (crossColor: string, state: Uint8Array) => this.onOLL(crossColor, state))
        EventHub.$on(Events.cubeState, (state: Uint8Array) => this.onCubeState(state))
    }

    private onCubeScrambled() {
        this.solveTime = this.inspectionTime = 0
        this.moves = []
        this.inspection = true
    }

    private onOLL(crossColor: string, state: Uint8Array) {
        this.cross = crossColor
        this.inspectionFace = oppositeFace(colorToFace(crossColor))

        const cubeState = CubeState.from(state)
        if (cubeState.pll(this.cross)) {
            Timer.pllStarted()
            Timer.pllSolved()
            EventHub.$emit(Events.cfopPll, state)
        }

        this.solving = true
        this.interval = window.setInterval(() => this.onTimer(), 10)
    }

    private onCubeState(state: Uint8Array) {
        if (!this.solving) {
            return
        }

        const cubeState = CubeState.from(state)
        this.moves = CubeState.OptimizeMoves([...this.moves, cubeState.lastmove()])

        if (this.inspection) {
            if (cubeState.lastmove()[0] === this.inspectionFace) { return }
            Timer.pllStarted()
            this.inspection = false
            this.inspectionTime = Timer.getPllInspectionTime()
        }

        if (cubeState.pll(this.cross)) {
            Timer.pllSolved()
            this.stopSolve()
            this.solveTime = Timer.getPllSolveTime()
            Vue.nextTick(() => EventHub.$emit(Events.cfopPll, state))
        }
    }

    private stopSolve() {
        this.solving = false
        if (this.interval) {
            window.clearInterval(this.interval)
            this.interval = 0
        }
    }

    private onTimer() {
        this.solveTime = Timer.getPllSolveTime()
        this.inspectionTime = Timer.getPllInspectionTime()
    }
}
</script>
