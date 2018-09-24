<template>
    <v-layout justify-start align-center column>
        <v-flex xs12 sm6>
            <v-card v-if="working">
                <v-card-title>
                    <h3>Initializing scrambler...</h3>
                    <v-progress-linear :indeterminate="true"></v-progress-linear>
                </v-card-title>
            </v-card>
            <v-card v-else>
                <v-card-title class="display-1">
                    <span v-for="(move, index) in scramble" :key="index" :class="[{'grey--text': position > index}, 'pr-2', 'pl-2']">
                        {{move}}
                    </span>
                    <v-tooltip bottom nudge-left open-delay="0">
                        <v-icon slot="activator" large class="ml-3" style="cursor: pointer" @click="generateScrabmle">info</v-icon>
                        <span>
                            Make sure your cube is solved and follow the scramble<br/>
                            Keep white face of the cube on top and blue on front<br/>
                            Scramble moves will become greyed out as you advance
                        </span>
                    </v-tooltip>
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

@Component
export default class Scramble extends Vue {
    private working = false
    private operation = ''
    private scramble: string[] = []
    private position = 0

    private worker = new Worker();

    private mounted() {
        this.worker.onmessage = (event: MessageEvent) => { 
            switch (event.data.cmd) {
                case 'init':
                    EventHub.$on(Events.cubeState, this.onCubeState)
                    this.generateScrabmle()
                    break
                case 'scramble':
                    event.data.scramble.split(' ').forEach((s: string) => this.scramble.push(s))
                    this.stopOperation()
                    break
            }
        }
        this.worker.postMessage({ cmd: 'init'})
        this.startOperation('Initializing scrambler...')
    }

    private generateScrabmle() {
        this.startOperation('Generating scramble...')
        this.scramble = []
        this.position = 0
        this.worker.postMessage({ cmd: 'scramble'})
    }

    private onCubeState(state: Uint8Array) {
        const a = this.scramble.slice(0, this.position + 1)
        const eCube: Cubejs = Cubejs.random()
        const aCube = new Cube()
        eCube.identity()
        eCube.move(a.join(' '))
        aCube.set(state)
        const expectedState = eCube.asString()
        console.log('expected: ' + expectedState)
        console.log('actual  : ' + aCube.vcs)
        if (expectedState === aCube.vcs) {
            this.position++
            if (this.position === this.scramble.length) {
                alert('ready')
            }
        }
    }

    private startOperation(message: string) {
        this.operation = message
        this.working = true
    }

    private stopOperation() {
        this.working = false
    }
}
</script>

<style>
</style>
