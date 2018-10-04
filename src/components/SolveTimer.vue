<template>
    <v-layout justify-start align-center column>
        <v-flex>
            <v-flex class="display-4 font-weight-bold main_timer" style="text-align: center">
                <span>{{(time / 1000).toFixed(3)}}</span>
                <div class="cancel">
                    <v-btn icon ripple @click="cancelSolve()" v-show="solving">
                        <v-icon large color="accent">cancel</v-icon>
                    </v-btn>
                </div>
            </v-flex>
                <v-flex class="text-xs-center">
                    <v-chip color="blue-grey" text-color="white">
                        <v-avatar class="blue-grey darken-4">{{turns}}</v-avatar>
                        turns
                        <!--<v-icon right color="green accent-2">arrow_drop_up</v-icon>-->
                    </v-chip><span class="spacer"></span>
                    <v-chip color="blue-grey" text-color="white">
                        <v-avatar class="blue-grey darken-4">{{time ? (turns / (time / 1000)).toFixed(2) : '0.00'}}</v-avatar>
                        TPS
                        <!--<v-icon right color="yellow">star</v-icon>-->
                    </v-chip>
                </v-flex>
        </v-flex>
    </v-layout>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { EventHub, Events } from '@/classes/event-hub'
import Timer from '@/classes/timer'
import CubeState from '@/classes/cube-state'

@Component
export default class SolveTimer extends Vue {
    private time = 0
    private turns = 0

    private interval = 0
    private solving = false

    private mounted() {
        EventHub.$on(Events.cubeScrambled, () => this.onCubeScrambled())
        EventHub.$on(Events.solveStarted, () => this.onSolveStarted())
        EventHub.$on(Events.cubeSolved, () => this.stopTimer())
        EventHub.$on(Events.cubeState, (state: Uint8Array) => this.onCubeState(state))
    }

    private onCubeScrambled() {
        this.time = 0
        this.turns = 0
    }

    private onSolveStarted() {
        this.solving = true
        this.interval = window.setInterval(() => this.onTimer(), 10)
    }

    private onCubeState(state: Uint8Array) {
        if (!this.solving) { return }
        this.turns++
    }

    private onTimer() {
        this.time = Timer.getSolveTime()
    }

    private cancelSolve() {
        this.stopTimer()
        EventHub.$emit(Events.solveCancelled)
    }

    private stopTimer() {
        if (this.interval) {
            window.clearInterval(this.interval)
            this.interval = 0
        }
        this.solving = false
    }
}
</script>

<style scoped>
.cancel {
    display: inline-block;
    position: absolute;
    padding-left: 20px;
}

.spacer { 
    display:inline-block;
    width:50px;
}
</style>
