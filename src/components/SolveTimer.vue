<template>
    <v-layout justify-start align-center column>
        <v-flex>
            <v-flex class="display-4 font-weight-bold main_timer" style="text-align: center">
                <span>{{(time / 1000).toFixed(3)}}</span>
                <div class="cancel">
                    <v-btn icon ripple @click="cancel()" v-show="active">
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
    private active = false

    private mounted() {
        EventHub.$on(Events.cubeScrambled, () => this.onCubeScrambled())
        EventHub.$on(Events.solveStarted, () => this.onSolveStarted())
        EventHub.$on(Events.cubeSolved, () => this.stop())
        EventHub.$on(Events.cubeState, (state: Uint8Array) => this.onCubeState(state))
    }

    private onCubeScrambled() {
        this.time = this.turns = 0
        this.active = true
    }

    private onSolveStarted() {
        window.requestAnimationFrame(this.timer)
    }

    private onCubeState(state: Uint8Array) {
        this.turns = this.active ? this.turns + 1 : this.turns
    }

    private timer() {
        this.time = Timer.getSolveTime()
        if (this.active) {
            window.requestAnimationFrame(this.timer)
        }
    }

    private cancel() {
        this.stop()
        EventHub.$emit(Events.solveCancelled)
    }

    private stop() {
        this.active = false
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
