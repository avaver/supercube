<template>
    <v-card color="blue-grey darken-3" dark ripple class="card-oll">
        <v-card-title class="display-2">
            OLL
        </v-card-title>
        <v-card-text class="display-2 text-xs-center">
            {{((inspectionTime + solveTime) / 1000).toFixed(2)}}
        </v-card-text>
        <v-card-title class="headline">
            {{(inspectionTime / 1000).toFixed(2)}} + {{(solveTime / 1000).toFixed(2)}}
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
import { colorToFace, oppositeFace } from '@/classes/cube-helper'

@Component
export default class OLL extends Vue {
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
        EventHub.$on(Events.cfopF2l, (crossColor: string) => this.onF2L(crossColor))
        EventHub.$on(Events.cubeState, (state: Uint8Array) => this.onCubeState(state))
    }

    private onCubeScrambled() {
        this.solveTime = this.inspectionTime = 0
        this.moves = []
        this.inspection = true
    }

    private onF2L(crossColor: string) {
        this.cross = crossColor
        this.inspectionFace = oppositeFace(colorToFace(crossColor))
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
            Timer.ollStarted()
            this.inspection = false
            this.inspectionTime = Timer.getOllInspectionTime()
        }

        if (cubeState.oll(this.cross)) {
            Timer.ollSolved()
            this.stopSolve()
            this.solveTime = Timer.getOllSolveTime()
            Vue.nextTick(() => EventHub.$emit(Events.cfopOll, this.cross))
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
        this.solveTime = Timer.getOllSolveTime()
        this.inspectionTime = Timer.getOllInspectionTime()
    }
}
</script>
