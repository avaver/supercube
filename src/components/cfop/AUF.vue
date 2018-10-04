<template>
    <v-card color="grey lighten-2" ripple>
        <v-card-title class="display-2">
            AUF
        </v-card-title>
        <v-card-text class="display-2 text-xs-center">
            {{((time) / 1000).toFixed(2)}}
        </v-card-text>
        <v-card-title class="headline">
            {{skipped ? '(skipped)' : ''}}
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
            Timer.cubeSolved()
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
            Timer.cubeSolved()
            this.stopSolve()
            this.time = Timer.getAUFTime()
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
        this.time = Timer.getAUFTime()
    }
}
</script>
