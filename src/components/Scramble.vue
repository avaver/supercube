<template>
    <v-layout justify-start align-center column v-if="enabled">
        <v-flex xs12 class="card-scramble">
            <v-card v-if="working">
                <v-card-title>
                    <h3>{{operation}}</h3>
                    <v-progress-linear :indeterminate="true"></v-progress-linear>
                </v-card-title>
            </v-card>
            <v-card v-else>
                <v-card-title class="headline">
                    <v-layout row wrap align-center>
                        <v-flex>
                            <v-btn flat icon color="primary" @click="generateScramble">
                                <v-icon>refresh</v-icon>
                            </v-btn>
                        </v-flex>
                        <v-flex v-for="(move, index) in scramble" :key="index" :class="[{'grey--text': position > index}]">
                            {{move}}
                        </v-flex>
                        <v-flex>
                            <v-icon class="scramble_info" style="cursor: pointer; line-height: 28px!important" @click.native.stop="tooltip = !tooltip">info</v-icon>
                            <v-tooltip bottom open-delay="0" v-model="tooltip" activator=".scramble_info">
                                <span class="subheading">
                                    - <kbd>U</kbd> is <strong>white</strong> and <kbd>F</kbd> is <strong>green</strong><br/>
                                    - <kbd>{{solveTrigger.join(' ')}}</kbd> to start solve without completing the scramble
                                </span>
                            </v-tooltip>
                        </v-flex>
                    </v-layout>
                </v-card-title>
            </v-card>
        </v-flex>
    </v-layout>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { EventHub, Events } from '@/classes/event-hub'
import Timer from '@/classes/timer'
import Worker from 'worker-loader!@/classes/cubejs.worker'
import CubeState from '@/classes/cube-state'
// tslint:disable-next-line:no-var-requires
const cubejs = require('cubejs')

@Component
export default class Scramble extends Vue {
    private enabled = true
    private working = true
    private tooltip = false

    private operation = 'Initializing scrambler...'
    private scramble: string[] = []
    private position = 0

    private solveTrigger = ['R', 'R\'']
    private triggerBuffer: string[] = []

    private worker = new Worker()

    private mounted() {
        EventHub.$on(Events.cubeState, (state: Uint8Array) => this.onCubeState(state))
        EventHub.$on(Events.cubeSolved, () => this.generateScramble())
        EventHub.$on(Events.solveCancelled, () => this.generateScramble())

        this.worker.onmessage = (event: MessageEvent) => {
            switch (event.data.cmd) {
                case 'init':
                    this.generateScramble()
                    break
                case 'scramble':
                    this.onScrambleGenerated(event.data.scramble)
                    break
            }
        }

        this.worker.postMessage({ cmd: 'init'})
    }

    private onCubeState(state: Uint8Array) {
        if (!this.enabled || !this.scrambleAvailable() || this.scrambleCompleted()) {
            return
        }

        const cubeState = CubeState.from(state)
        this.checkTrigger(cubeState)

        const expectedState: any = new cubejs()
        expectedState.move(this.scramble.slice(0, this.position + 1).join(' '))

        if (cubeState.visualState === expectedState.asString()) {
            this.position++
            if (this.scrambleCompleted()) {
                this.onScrambleCompleted()
            }
        }
    }

    private onScrambleGenerated(scramble: string) {
        this.working = false
        this.scramble = []
        this.position = 0
        scramble.split(' ').forEach((s: string) => this.scramble.push(s))
    }

    private onScrambleCompleted() {
        Timer.cubeScrambled()
        Vue.nextTick(() => EventHub.$emit(Events.cubeScrambled, this.scramble.join(' ')))
        this.enabled = false
    }

    private generateScramble() {
        this.enabled = true
        this.operation = 'Generating scramble...'
        this.working = true
        this.worker.postMessage({ cmd: 'scramble'})
    }

    private scrambleAvailable() {
        return this.scramble.length > 0
    }

    private scrambleCompleted() {
        return this.scramble.length > 0 && this.scramble.length === this.position
    }

    private checkTrigger(state: CubeState) {
        if (state.lastmove() === this.solveTrigger[this.triggerBuffer.length]) {
            this.triggerBuffer.push(state.lastmove())
            if (this.solveTrigger.join('') === this.triggerBuffer.join('')) {
                this.triggerBuffer = []
                this.onScrambleCompleted()
            }
        } else {
            this.triggerBuffer = []
        }
    }
}
</script>

<style>
</style>
