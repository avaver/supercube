<template>
    <v-layout justify-start align-center column v-if="enabled">
        <v-flex xs12>
            <v-card v-if="working">
                <v-card-title>
                    <h3>{{operation}}</h3>
                    <v-progress-linear :indeterminate="true"></v-progress-linear>
                </v-card-title>
            </v-card>
            <v-card v-else>
                <v-card-title class="headline">
                    <!--<v-checkbox v-model="simple" label="simple" @change="generateScrabmle"></v-checkbox>-->
                    <v-layout row wrap align-center>
                        <v-flex>
                            <v-btn flat icon color="primary" @click="generateScrabmle">
                                <v-icon>refresh</v-icon>
                            </v-btn>
                        </v-flex>
                        <v-flex v-for="(move, index) in scramble" :key="index" :class="[{'grey--text': position > index}]">
                            {{move}}
                        </v-flex>
                        <v-flex>
                            <v-icon class="scramble_info" style="cursor: pointer; line-height: 28px!important" @click.native.stop="tooltip = !tooltip">info</v-icon>
                            <v-tooltip bottom open-delay="0" v-model="tooltip" activator=".scramble_info">
                                <span>U is WHITE and F is BLUE</span>
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
import Worker from 'worker-loader!@/classes/cubejs.worker'
import * as Cubejs from 'cubejs'
import { Cube } from '@/classes/cube'
import CubeState from '@/classes/cube-state'

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
        EventHub.$on(Events.cubeSolved, () => this.generateScrabmle())

        this.worker.onmessage = (event: MessageEvent) => { 
            switch (event.data.cmd) {
                case 'init':
                    this.generateScrabmle()
                    break
                case 'scramble':
                    this.onScrambleGenerated(event.data.scramble)
                    break
            }
        }

        this.worker.postMessage({ cmd: 'init'})
    }

    private onCubeState(state: Uint8Array) {
        const cube = Cube.from(state)
        const cubeState = CubeState.from(state)
        console.log(cubeState.cross)

        if (this.enabled) {
            if (cube.lastmove() === this.solveTrigger[this.triggerBuffer.length]) {
                this.triggerBuffer.push(cube.lastmove())
                if (this.solveTrigger.join('') === this.triggerBuffer.join('')) {
                    this.triggerBuffer = []
                    this.onScrambleCompleted()
                }
            } else {
                this.triggerBuffer = []
            }

            if (!this.scrambleAvailable() || this.scrambleCompleted()) {
                return
            }
        }

        const a = this.scramble.slice(0, this.position + 1)
        // TODO: fix Cubejs ugly typings
        const eCube: Cubejs = Cubejs.random()
        eCube.identity()
        eCube.move(a.join(' '))

        if (eCube.asString() === cube.vcs) {
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
        EventHub.$emit(Events.cubeScrambled, this.scramble.join(' '))
        this.enabled = false
    }

    private generateScrabmle() {
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
}
</script>

<style>
</style>
