<template>
    <v-card color="indigo" dark ripple>
        <v-card-title class="display-2">
            F2L
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
export default class F2L extends Vue {
    private details = false
    private solving = false
    private inspection = true

    private interval = 0
    private pairs: string[] = []

    private cross = ''
    private inspectionFace = ''

    private solveTime = 0
    private solveTime1 = 0
    private solveTime2 = 0
    private solveTime3 = 0
    private solveTime4 = 0
    private inspectionTime = 0
    private inspectionTime1 = 0
    private inspectionTime2 = 0
    private inspectionTime3 = 0
    private inspectionTime4 = 0

    private moves: string[] = []

    private mounted() {
        EventHub.$on(Events.cubeScrambled, () => this.onCubeScrambled())
        EventHub.$on(Events.solveCancelled, () => this.stopSolve())
        EventHub.$on(Events.cfopCross, (crossColor: string) => this.onCross(crossColor))
        EventHub.$on(Events.cubeState, (state: Uint8Array) => this.onCubeState(state))
    }

    private onCubeScrambled() {
        this.solveTime = this.inspectionTime = 0
        this.solveTime1 = this.inspectionTime1 = 0
        this.solveTime2 = this.inspectionTime2 = 0
        this.solveTime3 = this.inspectionTime3 = 0
        this.solveTime4 = this.inspectionTime4 = 0
        this.moves = []
        this.pairs = []
        this.inspection = true
    }

    private onCross(crossColor: string) {
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
            this.inspection = false
            if (this.pairs.length === 0) {
                Timer.f2l1Started()
            } else if (this.pairs.length === 1) {
                Timer.f2l2Started()
            } else if (this.pairs.length === 2) {
                Timer.f2l3Started()
            } else if (this.pairs.length === 3) {
                Timer.f2l4Started()
                this.inspectionTime = this.inspectionTime1 + this.inspectionTime2 +
                    this.inspectionTime3 + this.inspectionTime4
            }
        }

        const solvedPairs = cubeState.f2l(this.cross)
        solvedPairs.forEach((p) => {
            if (this.pairs.indexOf(p) === -1) {
                this.inspection = true
                this.pairs.push(p)
                if (this.pairs.length === 1) {
                    Timer.f2l1Solved()
                } else if (this.pairs.length === 2) {
                    Timer.f2l2Solved()
                } else if (this.pairs.length === 3) {
                    Timer.f2l3Solved()
                } else if (this.pairs.length === 4) {
                    Timer.f2l4Solved()
                }
            }
        })

        if (this.pairs.length === 4) {
            this.stopSolve()
            this.solveTime = this.solveTime1 + this.solveTime2 + this.solveTime3 + this.solveTime4
            Vue.nextTick(() => EventHub.$emit(Events.cfopF2l, this.cross))
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
        this.solveTime1 = Timer.getF2l1SolveTime()
        this.solveTime2 = Timer.getF2l2SolveTime()
        this.solveTime3 = Timer.getF2l3SolveTime()
        this.solveTime4 = Timer.getF2l4SolveTime()
        this.solveTime = this.solveTime1 + this.solveTime2 + this.solveTime3 + this.solveTime4

        this.inspectionTime1 = Timer.getF2l1InspectionTime()
        this.inspectionTime2 = Timer.getF2l2InspectionTime()
        this.inspectionTime3 = Timer.getF2l3InspectionTime()
        this.inspectionTime4 = Timer.getF2l4InspectionTime()
        this.inspectionTime = this.inspectionTime1 + this.inspectionTime2 + this.inspectionTime3 + this.inspectionTime4
    }
}
</script>
