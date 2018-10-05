<template>
    <v-card color="blue-grey lighten-4" ripple class="card-auf">
        <v-card-title class="display-2">
            AUF {{skipped ? '(skipped)' : ''}} {{moves.length ? ' | ' : ''}} <span class="headline pl-2">{{moves.join(' ')}}</span><v-spacer />{{((time) / 1000).toFixed(2)}}
        </v-card-title>
    </v-card>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { EventHub, Events } from '@/classes/event-hub'
import Timer from '@/classes/timer'
import CubeState from '@/classes/cube-state'

@Component
export default class AUF extends Vue {
    private details = false
    private solving = false

    private interval = 0
    private time = 0
    private skipped = false

    private moves: string[] = []

    private mounted() {
        EventHub.$on(Events.cubeScrambled, () => this.onCubeScrambled())
        EventHub.$on(Events.solveCancelled, () => this.stopSolve())
        EventHub.$on(Events.cfopPll, (solved: boolean) => this.onPLL(solved))
        EventHub.$on(Events.cubeState, (state: Uint8Array) => this.onCubeState(state))
    }

    private onCubeScrambled() {
        this.time = 0
        this.moves = []
    }

    private onPLL(solved: boolean) {
        if (solved) {
            this.skipped = true
            this.cubeSolved()
        } else {
            this.solving = true
            this.interval = window.setInterval(() => this.onTimer(), 10)
        }
    }

    private onCubeState(state: Uint8Array) {
        if (!this.solving) {
            return
        }

        const cubeState = CubeState.from(state)
        this.moves = CubeState.OptimizeMoves([...this.moves, cubeState.lastmove()])

        if (cubeState.solved()) {
            this.cubeSolved()
            this.stopSolve()
            this.time = Timer.getAUFTime()
        }
    }

    private cubeSolved() {
        Timer.cubeSolved()
        EventHub.$emit(Events.cubeSolved)
    }

    private stopSolve() {
        this.solving = false
        if (this.interval) {
            window.clearInterval(this.interval)
            this.interval = 0
        }
    }

    private onTimer() {
        this.time = Timer.getAUFTime()
    }
}
</script>
